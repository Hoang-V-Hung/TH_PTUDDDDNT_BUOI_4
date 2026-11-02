import AsyncStorage from '@react-native-async-storage/async-storage';
import { OUTBOX_KEY } from './keys';
import type { OutboxAction } from '../types/models';

// Một chuỗi ghi dùng chung tránh ghi đè khi bấm liên tục hoặc sync cùng lúc.
let writes: Promise<unknown> = Promise.resolve();
let snapshot: OutboxAction[] = [];
const listeners = new Set<() => void>();
let loaded = false;
const emit = (value: OutboxAction[]) => {
  snapshot = value;
  listeners.forEach(listener => listener());
};
const serialized = <T>(operation: () => Promise<T>): Promise<T> => {
  const result = writes.then(operation);
  writes = result.catch(() => {});
  return result;
};
async function read() {
  if (!loaded) {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    const value = raw ? JSON.parse(raw) : [];
    if (
      !Array.isArray(value) ||
      value.some(
        (action: OutboxAction) =>
          !action.id ||
          !action.url ||
          !['POST', 'PATCH'].includes(action.method),
      )
    ) {
      throw new Error('Hàng đợi đã lưu không hợp lệ. Không thể đồng bộ.');
    }
    loaded = true;
    emit(value);
  }
  return snapshot;
}
export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getSnapshot = () => snapshot;
export const getAll = () => serialized(read);
export const enqueue = (action: OutboxAction) =>
  serialized(async () => {
    const current = await read();
    const next = [...current, action];
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(next));
    emit(next);
    return action;
  });
export const remove = (id: string) =>
  serialized(async () => {
    const next = (await read()).filter(action => action.id !== id);
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(next));
    emit(next);
  });
