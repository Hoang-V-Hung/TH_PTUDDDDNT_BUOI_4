import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DaySelector from './DaySelector';
import type { CalendarCell } from '../../utils/calendar';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** Tất cả props bắt buộc. expanded chỉ đổi cách trình bày lịch tuần/tháng. */
export default function ScheduleCalendar({
  monthLabel,
  selectedDate,
  selectedDay,
  weekCells,
  monthCells,
  onSelectDate,
  onSelectDay,
  onMoveMonth,
}: {
  monthLabel: string;
  selectedDate: string;
  selectedDay: number;
  weekCells: CalendarCell[];
  monthCells: CalendarCell[];
  onSelectDate: (date: string) => void;
  onSelectDay: (day: number) => void;
  onMoveMonth: (direction: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [monthHeight, setMonthHeight] = useState(
    (spacing.touch + spacing.xs + spacing.hairline) * 6,
  );
  const expansion = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const liveProgress = useRef(expanded ? 1 : 0);
  const dragStart = useRef(0);
  const expandedRef = useRef(expanded);
  const travel = useRef((monthHeight * 5) / 6);
  expandedRef.current = expanded;
  travel.current = Math.max(1, (monthHeight * 5) / 6);

  useEffect(() => {
    const listener = expansion.addListener(({ value }) => {
      liveProgress.current = value;
    });
    return () => {
      expansion.stopAnimation();
      expansion.removeListener(listener);
    };
  }, [expansion]);

  const snapTo = useCallback(
    (next: boolean) => {
      expandedRef.current = next;
      setExpanded(next);
      Animated.spring(expansion, {
        toValue: next ? 1 : 0,
        stiffness: 240,
        damping: 28,
        mass: 1,
        overshootClamping: true,
        useNativeDriver: false,
      }).start();
    },
    [expansion],
  );
  const toggle = () => snapTo(!expandedRef.current);
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 4 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dy) > 4 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderGrant: () => {
          expansion.stopAnimation();
          dragStart.current = liveProgress.current;
        },
        onPanResponderMove: (_, gesture) => {
          const value = Math.max(
            0,
            Math.min(1, dragStart.current + gesture.dy / travel.current),
          );
          liveProgress.current = value;
          expansion.setValue(value);
        },
        onPanResponderRelease: (_, gesture) => {
          const fastDown = gesture.dy > 8 && gesture.vy > 0.35;
          const fastUp = gesture.dy < -8 && gesture.vy < -0.35;
          snapTo(fastDown || (!fastUp && liveProgress.current >= 0.5));
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderTerminate: () => snapTo(expandedRef.current),
      }),
    [expansion, snapTo],
  );
  return (
    <View style={styles.calendar}>
      <View style={styles.toolbar}>
        <Pressable
          style={styles.arrow}
          onPress={() => onMoveMonth(-1)}
          accessibilityRole="button"
          accessibilityLabel="Tháng trước"
        >
          <Icon
            name="chevron-back"
            size={spacing.lg}
            color={colors.textMuted}
          />
        </Pressable>
        <Pressable
          style={styles.month}
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={`${monthLabel}, ${
            expanded ? 'thu gọn lịch tuần' : 'mở lịch tháng'
          }`}
          accessibilityState={{ expanded }}
        >
          <Text style={styles.monthText}>{monthLabel}</Text>
        </Pressable>
        <Pressable
          style={styles.arrow}
          onPress={() => onMoveMonth(1)}
          accessibilityRole="button"
          accessibilityLabel="Tháng sau"
        >
          <Icon
            name="chevron-forward"
            size={spacing.lg}
            color={colors.textMuted}
          />
        </Pressable>
      </View>
      <DaySelector
        cells={weekCells}
        selectedDate={selectedDate}
        selectedDay={selectedDay}
        onSelectDay={onSelectDay}
        onSelectDate={onSelectDate}
        monthCells={monthCells}
        expansion={expansion}
        expanded={expanded}
        monthHeight={monthHeight}
        onMonthHeight={height => {
          if (height > 0) {
            setMonthHeight(height);
          }
        }}
      />
      <View
        style={styles.handleZone}
        {...panResponder.panHandlers}
        testID="calendar-drag-area"
      >
        <Pressable
          style={styles.handleButton}
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={
            expanded ? 'Thu gọn lịch về tuần' : 'Mở lịch tháng'
          }
          accessibilityHint="Kéo lên để thu gọn, kéo xuống để mở rộng lịch"
          accessibilityState={{ expanded }}
        >
          <View style={styles.handle} />
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  calendar: {
    backgroundColor: colors.surface,
    borderBottomWidth: spacing.hairline,
    borderBottomColor: colors.border,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  arrow: {
    width: spacing.touch,
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    flex: 1,
    minHeight: spacing.touch,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: { ...typography.h3, color: colors.primary },
  handleZone: {
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleButton: {
    width: spacing.touch * 2,
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: spacing.xxxl,
    height: spacing.stripe,
    borderRadius: spacing.round,
    backgroundColor: colors.inputBorder,
    alignSelf: 'center',
  },
});
