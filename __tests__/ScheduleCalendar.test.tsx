import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { Animated, PanResponder } from 'react-native';
import type {
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import ScheduleCalendar from '../src/components/schedule/ScheduleCalendar';
import { calendarCells } from '../src/utils/calendar';

const selectedDate = '2026-11-02';
const event = {} as GestureResponderEvent;
const gesture = (dy: number, vy = 0, dx = 0): PanResponderGestureState => ({
  stateID: 1,
  moveX: dx,
  moveY: dy,
  x0: 0,
  y0: 0,
  dx,
  dy,
  vx: 0,
  vy,
  numberActiveTouches: 1,
});

async function mountCalendar() {
  const capture = jest.spyOn(PanResponder, 'create');
  jest.spyOn(Animated, 'spring').mockImplementation((value, config) => ({
    start: callback => {
      (value as Animated.Value).setValue(Number(config.toValue));
      callback?.({ finished: true });
    },
    stop: () => {},
    reset: () => {},
  }));
  const onSelectDate = jest.fn();
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(
      <ScheduleCalendar
        monthLabel="Tháng 11/2026"
        selectedDate={selectedDate}
        selectedDay={2}
        weekCells={calendarCells(selectedDate, 'week', [], selectedDate)}
        monthCells={calendarCells(selectedDate, 'month', [], selectedDate)}
        onSelectDate={onSelectDate}
        onSelectDay={jest.fn()}
        onMoveMonth={jest.fn()}
      />,
    );
  });
  const monthButton = () =>
    renderer.root.findAll(
      node =>
        typeof node.props.onPress === 'function' &&
        node.props.accessibilityLabel?.startsWith('Tháng 11/2026'),
    )[0];
  return { renderer, pan: capture.mock.calls[0][0], onSelectDate, monthButton };
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('kéo lên thu lịch tháng, kéo xuống mở lại và giữ ngày đang chọn', async () => {
  const { renderer, pan, monthButton, onSelectDate } = await mountCalendar();
  try {
    await act(async () => {
      monthButton().props.onPress();
    });
    expect(monthButton().props.accessibilityState.expanded).toBe(true);
    await act(async () => {
      pan.onPanResponderGrant?.(event, gesture(0));
      pan.onPanResponderMove?.(event, gesture(-60, -0.8));
      pan.onPanResponderRelease?.(event, gesture(-60, -0.8));
    });
    expect(monthButton().props.accessibilityState.expanded).toBe(false);
    await act(async () => {
      pan.onPanResponderGrant?.(event, gesture(0));
      pan.onPanResponderMove?.(event, gesture(60, 0.8));
      pan.onPanResponderRelease?.(event, gesture(60, 0.8));
    });
    expect(monthButton().props.accessibilityState.expanded).toBe(true);
    expect(onSelectDate).not.toHaveBeenCalled();
  } finally {
    await act(async () => {
      renderer.unmount();
    });
  }
});

test('chỉ nhận kéo dọc; kéo chậm nửa chừng thì về vị trí gần nhất', async () => {
  const { renderer, pan, monthButton } = await mountCalendar();
  try {
    expect(
      pan.onMoveShouldSetPanResponderCapture?.(event, gesture(3, 0, 70)),
    ).toBe(false);
    expect(
      pan.onMoveShouldSetPanResponderCapture?.(event, gesture(40, 0, 3)),
    ).toBe(true);
    await act(async () => {
      pan.onPanResponderGrant?.(event, gesture(0));
      pan.onPanResponderMove?.(event, gesture(160));
      pan.onPanResponderRelease?.(event, gesture(160));
    });
    expect(monthButton().props.accessibilityState.expanded).toBe(true);
    await act(async () => {
      pan.onPanResponderGrant?.(event, gesture(0));
      pan.onPanResponderMove?.(event, gesture(-10));
      pan.onPanResponderRelease?.(event, gesture(-10));
    });
    expect(monthButton().props.accessibilityState.expanded).toBe(true);
  } finally {
    await act(async () => {
      renderer.unmount();
    });
  }
});

test('kéo bị ngắt quay về trạng thái trước và thanh ngang vẫn bấm được', async () => {
  const { renderer, pan, monthButton } = await mountCalendar();
  try {
    await act(async () => {
      pan.onPanResponderGrant?.(event, gesture(0));
      pan.onPanResponderMove?.(event, gesture(160));
      pan.onPanResponderTerminate?.(event, gesture(160));
    });
    expect(monthButton().props.accessibilityState.expanded).toBe(false);
    const handle = renderer.root.findAll(
      node =>
        typeof node.props.onPress === 'function' &&
        node.props.accessibilityLabel === 'Mở lịch tháng',
    )[0];
    await act(async () => {
      handle.props.onPress();
    });
    expect(monthButton().props.accessibilityState.expanded).toBe(true);
  } finally {
    await act(async () => {
      renderer.unmount();
    });
  }
});
