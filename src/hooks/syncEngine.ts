import { request } from '../api/client';
import { getAll, remove } from '../storage/outbox';
import { acceptRecord } from './queryStore';
import type { ApiError } from '../types/models';
import { errorMessage } from '../utils/errors';

type SyncResult = {
  synced: number;
  conflicts: number;
  rolledBack: number;
  error: string;
};
let running: Promise<SyncResult> | null = null;
export function flushOutbox(
  isOnline: () => boolean,
  onNotice: (message: string, error: boolean) => void = () => {},
) {
  if (running) {
    return running;
  }
  running = (async () => {
    let synced = 0;
    let conflicts = 0;
    let rolledBack = 0;
    let failure = '';
    while (isOnline()) {
      const [action] = await getAll();
      if (!action) {
        break;
      }
      try {
        const itemUrl = `/${action.resource}/${encodeURIComponent(
          action.resourceId,
        )}`;
        let server = null;
        try {
          server = await request('GET', itemUrl);
        } catch (error) {
          const apiError = error as Partial<ApiError>;
          if (
            !(
              apiError.type === 'http' &&
              apiError.status === 404 &&
              action.method === 'POST'
            )
          ) {
            throw error;
          }
        }
        if (!isOnline()) {
          break;
        }
        if (
          action.method === 'PATCH' &&
          Date.parse(server.updatedAt) > Date.parse(action.body.updatedAt)
        ) {
          await acceptRecord(action.resource, server);
          await remove(action.id);
          conflicts += 1;
          continue;
        }
        // ID do client tạo cố định: POST bị mất phản hồi không tạo bản sao khi thử lại.
        const result =
          action.method === 'POST' && server
            ? server
            : await request(action.method, action.url, action.body);
        await acceptRecord(action.resource, result);
        await remove(action.id);
        synced += 1;
      } catch (error) {
        const apiError = error as Partial<ApiError>;
        if (apiError.type === 'http' && action.rollbackOnHttpError) {
          await remove(action.id);
          rolledBack += 1;
          failure = errorMessage(error, 'Máy chủ báo lỗi.');
          continue;
        }
        failure = errorMessage(
          error,
          'Chưa lưu được kết quả đồng bộ vào thiết bị.',
        );
        break; // Giữ lỗi và mọi thao tác phía sau, không gửi sai thứ tự.
      }
    }
    const messages = [];
    if (synced) {
      messages.push(`Đã đồng bộ ${synced} thay đổi.`);
    }
    if (conflicts) {
      messages.push(
        `Có ${conflicts} xung đột: đã ưu tiên dữ liệu mới hơn trên máy chủ.`,
      );
    }
    if (rolledBack) {
      messages.push(`Đã hoàn tác ${rolledBack} thay đổi vì máy chủ báo lỗi.`);
    }
    if (failure) {
      messages.push(failure);
    }
    if (messages.length) {
      onNotice(messages.join(' '), Boolean(failure));
    }
    return { synced, conflicts, rolledBack, error: failure };
  })().finally(() => {
    running = null;
  });
  return running;
}
