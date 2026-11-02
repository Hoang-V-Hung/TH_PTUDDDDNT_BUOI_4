import { request } from '../src/api/client';

beforeEach(() => {
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.useRealTimers();
});

test('gửi JSON và đọc phản hồi thành công', async () => {
  fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ id: 1 }),
  });
  await expect(
    request('POST', '/assignments', { title: 'Bài mới' }),
  ).resolves.toEqual({ id: 1 });
  expect(fetch.mock.calls[0][1]).toMatchObject({
    method: 'POST',
    body: '{"title":"Bài mới"}',
  });
});
test('chuẩn hóa lỗi HTTP và lỗi mạng', async () => {
  fetch.mockResolvedValue({ ok: false, status: 500 });
  await expect(request('GET', '/courses')).rejects.toMatchObject({
    type: 'http',
    status: 500,
  });
  fetch.mockRejectedValue(new Error('Connection refused'));
  await expect(request('GET', '/courses')).rejects.toMatchObject({
    type: 'network',
    status: 0,
  });
});
test('hủy yêu cầu khi quá 10 giây', async () => {
  jest.useFakeTimers();
  fetch.mockImplementation(
    (url, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () =>
          reject(new Error('Aborted')),
        );
      }),
  );
  const outcome = request('GET', '/courses').catch(error => error);
  await jest.advanceTimersByTimeAsync(10000);
  expect(await outcome).toMatchObject({ type: 'timeout', status: 0 });
});
