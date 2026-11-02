import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCache, setCache } from '../src/storage/cache';
import { enqueue, getAll, remove } from '../src/storage/outbox';
import { OUTBOX_KEY } from '../src/storage/keys';
import { request } from '../src/api/client';
import { flushOutbox } from '../src/hooks/syncEngine';
import { getEntry, acceptRecord } from '../src/hooks/queryStore';

jest.mock('../src/api/client', () => ({ request: jest.fn() }));
const oldDate = '2026-10-01T00:00:00.000Z';
const newDate = '2026-11-02T00:00:00.000Z';
const action = (id, extra = {}) => ({
  id,
  method: 'PATCH',
  url: `/assignments/${id}`,
  resource: 'assignments',
  resourceId: id,
  body: { status: 'done', updatedAt: newDate },
  createdAt: newDate,
  rollbackOnHttpError: false,
  ...extra,
});
beforeEach(async () => {
  for (const item of await getAll()) {
    await remove(item.id);
  }
  await AsyncStorage.clear();
  request.mockReset();
});
test('cache giữ dữ liệu và thời điểm lưu; cache JSON hỏng được bỏ qua', async () => {
  await setCache('courses', [{ id: 1 }]);
  expect(await getCache('courses')).toMatchObject({
    data: [{ id: 1 }],
    savedAt: expect.any(String),
  });
  await AsyncStorage.setItem('cache:broken', '{');
  expect(await getCache('broken')).toBeNull();
});
test('hai PATCH và một POST offline được lưu bền vững theo thứ tự', async () => {
  await Promise.all([
    enqueue(action('one')),
    enqueue(action('two')),
    enqueue(
      action('new', {
        method: 'POST',
        url: '/assignments',
        body: { id: 'new', title: 'Mới', updatedAt: newDate },
      }),
    ),
  ]);
  expect((await getAll()).map(item => item.id)).toEqual(['one', 'two', 'new']);
  expect(JSON.parse(await AsyncStorage.getItem(OUTBOX_KEY))).toHaveLength(3);
  request.mockImplementation(async (method, url, body) => {
    if (method === 'GET' && url.endsWith('/new')) {
      throw { type: 'http', status: 404 };
    }
    return method === 'GET'
      ? { id: url.split('/').pop(), updatedAt: oldDate }
      : { ...body, id: body.id || url.split('/').pop() };
  });
  const notice = jest.fn();
  await flushOutbox(() => true, notice);
  expect(
    request.mock.calls
      .filter(([method]) => method !== 'GET')
      .map(([method, url]) => [method, url]),
  ).toEqual([
    ['PATCH', '/assignments/one'],
    ['PATCH', '/assignments/two'],
    ['POST', '/assignments'],
  ]);
  expect(await getAll()).toEqual([]);
  expect(notice).toHaveBeenCalledWith('Đã đồng bộ 3 thay đổi.', false);
});
test('lỗi mạng giữ thao tác và chặn các thao tác phía sau', async () => {
  await enqueue(action('first'));
  await enqueue(action('second'));
  request.mockRejectedValue({ type: 'network', message: 'Mất mạng' });
  await flushOutbox(() => true);
  expect(await getAll()).toHaveLength(2);
  expect(request).toHaveBeenCalledTimes(1);
  request.mockImplementation(async (method, url, body) => ({
    id: url.split('/').pop(),
    updatedAt: oldDate,
    ...body,
  }));
  await flushOutbox(() => true);
  expect(await getAll()).toEqual([]);
});
test('hai lời gọi sync cùng lúc không gửi trùng một thao tác', async () => {
  await enqueue(action('single'));
  request.mockImplementation(async (method, url, body) => ({
    id: 'single',
    updatedAt: oldDate,
    ...body,
  }));
  await Promise.all([flushOutbox(() => true), flushOutbox(() => true)]);
  expect(
    request.mock.calls.filter(([method]) => method === 'PATCH'),
  ).toHaveLength(1);
});
test('xung đột hồ sơ: giữ server có updatedAt mới hơn và thông báo', async () => {
  await enqueue(
    action('profile', {
      resource: 'students',
      resourceId: 1,
      url: '/students/1',
      body: { fullName: 'Tên offline', updatedAt: newDate },
    }),
  );
  request.mockResolvedValue({
    id: 1,
    fullName: 'Tên trên server',
    updatedAt: '2026-11-03T00:00:00Z',
  });
  const notice = jest.fn();
  const result = await flushOutbox(() => true, notice);
  expect(result.conflicts).toBe(1);
  expect(request).toHaveBeenCalledTimes(1);
  expect(getEntry('students:1').snapshot.data.fullName).toBe('Tên trên server');
  expect(await getAll()).toEqual([]);
  expect(notice.mock.calls[0][0]).toContain('ưu tiên dữ liệu mới hơn');
});
test('POST đã nhận trên server không được tạo bản sao khi mất phản hồi', async () => {
  await enqueue(
    action('created', {
      method: 'POST',
      url: '/assignments',
      body: { id: 'created', title: 'Bài mới', updatedAt: newDate },
    }),
  );
  request.mockResolvedValue({
    id: 'created',
    title: 'Bài mới',
    updatedAt: newDate,
  });
  await flushOutbox(() => true);
  expect(request).toHaveBeenCalledTimes(1);
  expect(await getAll()).toEqual([]);
});
test('HTTP lỗi khi online: hoàn tác cập nhật lạc quan và báo lỗi', async () => {
  await acceptRecord('assignments', {
    id: 'rollback',
    status: 'todo',
    updatedAt: oldDate,
  });
  await enqueue(action('rollback', { rollbackOnHttpError: true }));
  request.mockImplementation(async method => {
    if (method === 'GET') {
      return { id: 'rollback', status: 'todo', updatedAt: oldDate };
    }
    throw { type: 'http', status: 500, message: 'Máy chủ báo lỗi' };
  });
  const notice = jest.fn();
  const result = await flushOutbox(() => true, notice);
  expect(result.rolledBack).toBe(1);
  expect(await getAll()).toEqual([]);
  expect(
    getEntry('assignments').snapshot.data.find(item => item.id === 'rollback')
      .status,
  ).toBe('todo');
  expect(notice.mock.calls[0][0]).toContain('Đã hoàn tác');
});
test('HTTP lỗi của thao tác offline vẫn được giữ để thử lại', async () => {
  await enqueue(action('retry'));
  request.mockRejectedValue({
    type: 'http',
    status: 500,
    message: 'Máy chủ báo lỗi',
  });
  await flushOutbox(() => true);
  expect(await getAll()).toHaveLength(1);
});

test('tiến trình mới đọc lại hàng đợi từ AsyncStorage theo đúng thứ tự', async () => {
  await enqueue(action('persist-one'));
  await enqueue(action('persist-two'));
  const sharedStorage = AsyncStorage;
  jest.doMock('@react-native-async-storage/async-storage', () => sharedStorage);
  let restored;
  jest.isolateModules(() => {
    restored = require('../src/storage/outbox');
  });
  expect(restored.getSnapshot()).toEqual([]);
  expect((await restored.getAll()).map(item => item.id)).toEqual([
    'persist-one',
    'persist-two',
  ]);
});
