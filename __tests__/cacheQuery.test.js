import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getEntry,
  hydrateQuery,
  refreshQuery,
  acceptRecord,
} from '../src/hooks/queryStore';
import { setCache } from '../src/storage/cache';

test('cache được đọc trước khi GET hoàn tất; GET cập nhật cả dữ liệu và cache', async () => {
  await setCache('cache-first-test', [{ id: 'old' }]);
  let complete;
  const fetcher = () =>
    new Promise(resolve => {
      complete = resolve;
    });
  const refresh = refreshQuery('cache-first-test', fetcher);
  await hydrateQuery('cache-first-test');
  expect(getEntry('cache-first-test').snapshot.data).toEqual([{ id: 'old' }]);
  complete([{ id: 'new' }]);
  await refresh;
  expect(getEntry('cache-first-test').snapshot.data).toEqual([{ id: 'new' }]);
  expect(
    JSON.parse(await AsyncStorage.getItem('cache:cache-first-test')).data,
  ).toEqual([{ id: 'new' }]);
});
test('GET cũ không được ghi đè kết quả PATCH vừa đồng bộ', async () => {
  let complete;
  const refresh = refreshQuery(
    'assignments',
    () =>
      new Promise(resolve => {
        complete = resolve;
      }),
  );
  await hydrateQuery('assignments');
  await acceptRecord('assignments', { id: 'changed', status: 'done' });
  complete([{ id: 'changed', status: 'todo' }]);
  await refresh;
  expect(getEntry('assignments').snapshot.data[0].status).toBe('done');
});
