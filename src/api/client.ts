import { BASE_URL, TIMEOUT } from '../config';

/** @returns {Promise<any>} Lỗi chuẩn hóa: { type, status, message }. */
export async function request<T = any>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT);
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      throw {
        type: 'http',
        status: response.status,
        message:
          response.status === 404
            ? 'Không tìm thấy dữ liệu trên máy chủ.'
            : `Máy chủ báo lỗi (${response.status}). Vui lòng thử lại.`,
      };
    }
    return response.status === 204
      ? (null as T)
      : ((await response.json()) as T);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'type' in error &&
      error.type === 'http'
    ) {
      throw error;
    }
    throw {
      type: timedOut ? 'timeout' : 'network',
      status: 0,
      message: timedOut
        ? 'Máy chủ chưa phản hồi sau 10 giây. Vui lòng thử lại.'
        : 'Không kết nối được máy chủ. Kiểm tra kết nối và địa chỉ API rồi thử lại.',
    };
  } finally {
    clearTimeout(timer);
  }
}
