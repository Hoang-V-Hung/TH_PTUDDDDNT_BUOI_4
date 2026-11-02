import AsyncStorage from '@react-native-async-storage/async-storage';
import { cacheKey } from './keys';

export async function getCache<T = any>(
  key: string,
): Promise<{ data: T; savedAt: string } | null> {
  const raw = await AsyncStorage.getItem(cacheKey(key));
  if (!raw) {
    return null;
  }
  try {
    const value = JSON.parse(raw);
    return value &&
      'data' in value &&
      Number.isFinite(Date.parse(value.savedAt))
      ? value
      : null;
  } catch {
    return null;
  }
}
export async function setCache<T>(key: string, data: T) {
  const value = { data, savedAt: new Date().toISOString() };
  await AsyncStorage.setItem(cacheKey(key), JSON.stringify(value));
  return value;
}
