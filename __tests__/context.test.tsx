import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppDataProvider, { useAppData } from '../src/context/AppDataContext';
import SyncProvider, { useSync } from '../src/context/SyncContext';
import { getAll } from '../src/storage/outbox';
import { OUTBOX_KEY } from '../src/storage/keys';
import db from '../db.json';
import useRecord from '../src/hooks/useRecord';
import { refreshQuery } from '../src/hooks/queryStore';
import type { Assignment } from '../src/types/models';

let app: ReturnType<typeof useAppData>;
let sync: ReturnType<typeof useSync>;
function Probe() {
  app = useAppData();
  sync = useSync();
  return null;
}
function Harness() {
  return (
    <SyncProvider>
      <AppDataProvider>
        <Probe />
      </AppDataProvider>
    </SyncProvider>
  );
}

test('lỗi lần đầu → tải lại → 2 tick + 1 POST offline → khởi động lại → tự đồng bộ', async () => {
  await AsyncStorage.clear();
  (useNetInfo as jest.Mock).mockReturnValue({
    isConnected: true,
    isInternetReachable: true,
  });
  const remote = JSON.parse(JSON.stringify(db));
  let serverAvailable = false;
  globalThis.fetch = jest.fn(async (url: string, options: RequestInit) => {
    if (!serverAvailable) {
      throw new Error('Server đang tắt');
    }
    const [resource, id] = String(url)
      .replace(/^https?:\/\/[^/]+\//, '')
      .split('?')[0]
      .split('/');
    const records = remote[resource];
    const found = records.find(
      (record: { id: string | number }) => String(record.id) === id,
    );
    if (options.method === 'PATCH') {
      Object.assign(found, JSON.parse(String(options.body)));
    }
    if (options.method === 'POST') {
      records.push(JSON.parse(String(options.body)));
    }
    const data = id
      ? found
      : options.method === 'POST'
      ? records[records.length - 1]
      : records;
    return {
      ok: Boolean(data),
      status: data ? 200 : 404,
      json: async () => JSON.parse(JSON.stringify(data)),
    } as Response;
  }) as jest.Mock;
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(<Harness />);
  });
  try {
    expect(app.queries.courses.error?.message).toContain('Không kết nối được');
    expect(app.queries.courses.loading).toBe(false);
    serverAvailable = true;
    await act(async () => {
      await Promise.all(
        Object.values(app.queries).map(query => query.refresh()),
      );
    });
    expect(app.courses).toHaveLength(db.courses.length);
    expect(app.student?.studentCode).toBe(db.students[0].studentCode);
    (useNetInfo as jest.Mock).mockReturnValue({
      isConnected: false,
      isInternetReachable: false,
    });
    await act(async () => {
      renderer.update(<Harness />);
    });
    const todo = app.assignments
      .filter(assignment => assignment.status === 'todo')
      .slice(0, 2);
    const oldFetchCount = (fetch as jest.Mock).mock.calls.length;
    await act(async () => {
      await app.toggleAssignment(todo[0]);
      await app.toggleAssignment(todo[1]);
      await app.createAssignment({
        courseId: db.courses[0].id,
        title: 'Tạo khi offline',
        description: 'Kiểm thử',
        dueDate: '2099-11-09T10:00:00Z',
      });
    });
    expect((fetch as jest.Mock).mock.calls).toHaveLength(oldFetchCount);
    expect(sync.pendingCount).toBe(3);
    expect(JSON.parse((await AsyncStorage.getItem(OUTBOX_KEY))!)).toHaveLength(
      3,
    );
    expect(
      app.assignments.filter(
        assignment => assignment.title === 'Tạo khi offline',
      ),
    ).toHaveLength(1);
    expect(
      todo.every(
        item =>
          app.assignments.find(current => current.id === item.id)?.status ===
          'done',
      ),
    ).toBe(true);
    expect(app.pending('assignments', todo[0].id)).toBe(true);
    await act(async () => {
      renderer.unmount();
    });
    await act(async () => {
      renderer = Renderer.create(<Harness />);
    });
    expect(
      app.assignments.some(
        assignment => assignment.title === 'Tạo khi offline',
      ),
    ).toBe(true);
    expect(sync.pendingCount).toBe(3);
    (useNetInfo as jest.Mock).mockReturnValue({
      isConnected: true,
      isInternetReachable: true,
    });
    await act(async () => {
      renderer.update(<Harness />);
    });
    await act(async () => {
      await sync.syncNow();
    });
    expect(await getAll()).toHaveLength(0);
    expect(sync.pendingCount).toBe(0);
    expect(app.pending('assignments', todo[0].id)).toBe(false);
    expect(
      remote.assignments.filter(
        (item: { title: string }) => item.title === 'Tạo khi offline',
      ),
    ).toHaveLength(1);
    expect(sync.notice.message).toContain('Đã đồng bộ 3 thay đổi');
  } finally {
    await act(async () => {
      renderer.unmount();
    });
  }
}, 60000);

test('chi tiết offline lấy danh sách mới hơn thay vì cache chi tiết cũ', async () => {
  jest.useFakeTimers({ now: new Date('2026-11-02T10:00:00Z') });
  const stale = { ...db.assignments[0], status: 'todo' as const } as Assignment;
  const fresh = { ...stale, status: 'done' as const };
  await refreshQuery(`assignments:${stale.id}`, async () => stale);
  jest.advanceTimersByTime(1000);
  await refreshQuery('assignments', async () => [fresh]);
  (useNetInfo as jest.Mock).mockReturnValue({
    isConnected: false,
    isInternetReachable: false,
  });
  let selected: Assignment | null = null;
  function DetailProbe() {
    selected = useRecord('assignments', stale.id).data;
    return null;
  }
  let renderer!: Renderer.ReactTestRenderer;
  try {
    await act(async () => {
      renderer = Renderer.create(
        <SyncProvider>
          <AppDataProvider>
            <DetailProbe />
          </AppDataProvider>
        </SyncProvider>,
      );
    });
    expect((selected as Assignment | null)?.status).toBe('done');
  } finally {
    await act(async () => {
      renderer.unmount();
    });
    jest.useRealTimers();
  }
});
