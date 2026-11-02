import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import App from '../App';
import db from '../db.json';

test('React Native hiển thị 5 tab và thông tin lấy từ API', async () => {
  globalThis.fetch = jest.fn(async (url: string) => {
    const parts = String(url)
      .replace(/^https?:\/\/[^/]+/, '')
      .split('?')[0]
      .split('/')
      .filter(Boolean);
    const records = db[parts[0] as keyof typeof db];
    const data = parts[1]
      ? records.find(item => String(item.id) === parts[1])
      : records;
    return { ok: true, status: 200, json: async () => data } as Response;
  }) as jest.Mock;
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(<App />);
  });
  try {
    const output = renderer.root
      .findAllByType(Text)
      .flatMap(node => node.props.children)
      .filter(value => typeof value === 'string' || typeof value === 'number')
      .join(' ');
    [
      'Tổng quan',
      'Môn học',
      'Lịch học',
      'Bài tập',
      'Cá nhân',
      db.students[0].fullName,
      db.students[0].studentCode,
    ].forEach(label => expect(output).toContain(label));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/students/1'),
      expect.any(Object),
    );
  } finally {
    await act(async () => {
      renderer.unmount();
    });
  }
}, 60000);
