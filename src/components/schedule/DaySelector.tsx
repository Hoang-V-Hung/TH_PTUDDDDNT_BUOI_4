import React from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import CalendarDate from './CalendarDate';
import {
  calendarCells,
  dateKey,
  type CalendarCell,
} from '../../utils/calendar';
import { todayDay } from '../../utils/date';
import spacing from '../../theme/spacing';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

/** onSelectDay bắt buộc; các ngày và chấm lịch được truyền từ dữ liệu hiện có. */
export default function DaySelector({
  selectedDay = todayDay(),
  onSelectDay,
  cells = [],
  selectedDate = '',
  onSelectDate = undefined,
  monthCells = [],
  expansion = undefined,
  expanded = false,
  monthHeight = (spacing.touch + spacing.xs + spacing.hairline) * 6,
  onMonthHeight = undefined,
}: {
  selectedDay?: number;
  onSelectDay: (day: number) => void;
  cells?: CalendarCell[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  monthCells?: CalendarCell[];
  expansion?: Animated.Value;
  expanded?: boolean;
  monthHeight?: number;
  onMonthHeight?: (height: number) => void;
}) {
  if (expansion && monthCells.length) {
    const rowCount = Math.ceil(monthCells.length / 7);
    const weekHeight = monthHeight / rowCount;
    const selectedWeek = Math.max(
      0,
      Math.floor(monthCells.findIndex(cell => cell.date === selectedDate) / 7),
    );
    const height = expansion.interpolate({
      inputRange: [0, 1],
      outputRange: [weekHeight, monthHeight],
      extrapolate: 'clamp',
    });
    const translateY = expansion.interpolate({
      inputRange: [0, 1],
      outputRange: [-selectedWeek * weekHeight, 0],
      extrapolate: 'clamp',
    });
    return (
      <>
        <View style={styles.weekdays}>
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
            <Text key={day} style={styles.weekday}>
              {day}
            </Text>
          ))}
        </View>
        <Animated.View style={[styles.viewport, { height }]}>
          <Animated.View
            onLayout={event => onMonthHeight?.(event.nativeEvent.layout.height)}
            style={{ transform: [{ translateY }] }}
          >
            {Array.from({ length: rowCount }, (_, index) => (
              <View
                key={index}
                style={styles.row}
                accessibilityElementsHidden={
                  !expanded && index !== selectedWeek
                }
                importantForAccessibility={
                  !expanded && index !== selectedWeek
                    ? 'no-hide-descendants'
                    : 'auto'
                }
                pointerEvents={
                  expanded || index === selectedWeek ? 'auto' : 'none'
                }
              >
                {monthCells.slice(index * 7, (index + 1) * 7).map(cell => (
                  <CalendarDate
                    key={cell.date}
                    cell={cell}
                    selected={cell.date === selectedDate}
                    onSelect={value => {
                      if (onSelectDate) {
                        onSelectDate(value);
                      } else {
                        onSelectDay(cell.dayOfWeek);
                      }
                    }}
                  />
                ))}
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </>
    );
  }
  const dates = cells.length
    ? cells
    : calendarCells(dateKey(new Date()), 'week', [], dateKey(new Date()));
  return (
    <View style={styles.row}>
      {dates.map(cell => (
        <CalendarDate
          key={cell.date}
          cell={cell}
          selected={
            selectedDate
              ? cell.date === selectedDate
              : cell.dayOfWeek === selectedDay
          }
          showWeekday
          onSelect={value => {
            if (onSelectDate) {
              onSelectDate(value);
            } else {
              onSelectDay(cell.dayOfWeek);
            }
          }}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: spacing.xs },
  viewport: { overflow: 'hidden' },
  weekdays: { flexDirection: 'row', paddingHorizontal: spacing.xs },
  weekday: {
    ...typography.caption,
    color: colors.text,
    width: `${100 / 7}%`,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
});
