import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { CACHE_TTL } from '../config';
import useNetworkStatus from './useNetworkStatus';
import {
  getEntry,
  subscribeQuery,
  hydrateQuery,
  refreshQuery,
} from './queryStore';
import type { CachedQuery } from '../types/models';

export default function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  enabled = true,
): CachedQuery<T> {
  const { isOnline } = useNetworkStatus();
  const fetchRef = useRef(fetcher);
  fetchRef.current = fetcher;
  const subscribe = useCallback(
    (listener: () => void) => subscribeQuery(key, listener),
    [key],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    () => getEntry<T>(key).snapshot,
  );
  const refresh = useCallback(async () => {
    if (isOnline && enabled) {
      await refreshQuery(key, () => fetchRef.current());
    } else {
      await hydrateQuery(key);
    }
  }, [key, isOnline, enabled]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (
        state === 'active' &&
        Date.now() -
          Date.parse(getEntry(key).snapshot.lastUpdated || '1970-01-01') >
          CACHE_TTL
      ) {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [key, refresh]);
  const noOfflineData =
    !isOnline && !snapshot.loading && snapshot.data === undefined;
  return {
    ...snapshot,
    error: noOfflineData
      ? { message: 'Chưa có dữ liệu đã lưu. Kết nối mạng để tải lần đầu.' }
      : snapshot.error,
    refresh,
  };
}
