import { getCache, setCache } from '../storage/cache';
import type { QueryState, EntityId } from '../types/models';
import { errorMessage } from '../utils/errors';

interface QueryEntry<T = any> {
  snapshot: QueryState<T>;
  listeners: Set<() => void>;
  hydration: Promise<void> | null;
  flight: Promise<void> | null;
  revision: number;
}
const entries = new Map<string, QueryEntry>();
export function getEntry<T = any>(key: string): QueryEntry<T> {
  if (!entries.has(key)) {
    entries.set(key, {
      snapshot: {
        data: undefined,
        loading: true,
        error: null,
        refreshing: false,
        lastUpdated: null,
      },
      listeners: new Set(),
      hydration: null,
      flight: null,
      revision: 0,
    });
  }
  return entries.get(key)!;
}
function publish<T>(entry: QueryEntry<T>, changes: Partial<QueryState<T>>) {
  entry.snapshot = { ...entry.snapshot, ...changes };
  entry.listeners.forEach(listener => listener());
}
export const subscribeQuery = (key: string, listener: () => void) => {
  const entry = getEntry(key);
  entry.listeners.add(listener);
  return () => entry.listeners.delete(listener);
};
export async function hydrateQuery(key: string) {
  const entry = getEntry(key);
  if (!entry.hydration) {
    entry.hydration = (async () => {
      try {
        const cached = await getCache(key);
        if (cached && entry.snapshot.data === undefined) {
          publish(entry, { data: cached.data, lastUpdated: cached.savedAt });
        }
      } catch {
        publish(entry, {
          error: { message: 'Không đọc được bộ nhớ đệm. Vui lòng thử lại.' },
        });
      } finally {
        publish(entry, { loading: false });
      }
    })();
  }
  await entry.hydration;
}
export async function refreshQuery<T>(key: string, fetcher: () => Promise<T>) {
  const entry = getEntry(key);
  if (entry.flight) {
    return entry.flight;
  }
  entry.flight = (async () => {
    await hydrateQuery(key);
    publish(entry, {
      loading: entry.snapshot.data === undefined,
      refreshing: true,
      error: null,
    });
    const revision = entry.revision;
    try {
      const data = await fetcher();
      // Một GET khởi chạy trước PATCH không được ghi đè dữ liệu vừa đồng bộ.
      if (revision !== entry.revision) {
        return;
      }
      publish(entry, { data, lastUpdated: new Date().toISOString() });
      await setCache(key, data);
    } catch (error) {
      publish(entry, {
        error: {
          message: errorMessage(
            error,
            'Không lưu được bộ nhớ đệm. Vui lòng thử lại.',
          ),
        },
      });
    } finally {
      publish(entry, { loading: false, refreshing: false });
      entry.flight = null;
    }
  })();
  return entry.flight;
}
export async function acceptRecord(
  resource: string,
  record: { id: EntityId; [key: string]: any },
) {
  const id = String(record.id);
  const listKey = resource === 'students' ? `students:${id}` : resource;
  const listEntry = getEntry(listKey);
  await hydrateQuery(listKey);
  const current = listEntry.snapshot.data;
  const data =
    resource === 'students'
      ? record
      : [
          ...(Array.isArray(current)
            ? current.filter(item => String(item.id) !== id)
            : []),
          record,
        ];
  const saved = await setCache(listKey, data);
  listEntry.revision += 1;
  publish(listEntry, { data, lastUpdated: saved.savedAt, loading: false });
  if (resource !== 'students') {
    const detailKey = `${resource}:${id}`;
    const detailEntry = getEntry(detailKey);
    const detailSaved = await setCache(detailKey, record);
    detailEntry.revision += 1;
    publish(detailEntry, {
      data: record,
      lastUpdated: detailSaved.savedAt,
      loading: false,
    });
  }
}
