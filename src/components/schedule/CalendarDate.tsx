import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import type { CalendarCell } from '../../utils/calendar';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** cell, onSelect bắt buộc; selected=false, showWeekday=false. */
export default memo(function CalendarDate({
  cell,
  onSelect,
  selected = false,
  showWeekday = false,
}: {
  cell: CalendarCell;
  onSelect: (date: string) => void;
  selected?: boolean;
  showWeekday?: boolean;
}) {
  return (
    <Pressable
      style={styles.cell}
      onPress={() => onSelect(cell.date)}
      accessibilityRole="button"
      accessibilityLabel={cell.label}
      accessibilityState={{ selected }}
    >
      {showWeekday ? (
        <Text style={styles.weekday}>
          {cell.dayOfWeek === 8 ? 'CN' : `T${cell.dayOfWeek}`}
        </Text>
      ) : null}
      {/* Đổi nền chọn trên Android vẫn giữ bo tròn khi lịch được cắt và trượt. */}
      <View
        key={selected ? 'selected' : 'normal'}
        style={[styles.circle, selected && styles.selected]}
      >
        <Text
          style={[
            styles.number,
            !cell.inMonth && styles.outside,
            cell.today && styles.today,
            selected && styles.onPrimary,
          ]}
        >
          {cell.day}
        </Text>
      </View>
      <View
        style={[
          styles.dot,
          cell.hasSession && styles.marked,
          cell.hasSession && selected && styles.selectedDot,
        ]}
      />
    </Pressable>
  );
});
const styles = StyleSheet.create({
  cell: {
    width: `${100 / 7}%`,
    minHeight: spacing.touch + spacing.xs,
    minWidth: spacing.touch,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  weekday: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  circle: {
    width: spacing.day,
    height: spacing.day,
    borderRadius: spacing.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.primary },
  number: { ...typography.body, color: colors.text },
  outside: { color: colors.textMuted },
  today: { color: colors.primary, fontWeight: '700' },
  onPrimary: { color: colors.white, fontWeight: '700' },
  dot: {
    width: spacing.stripe,
    height: spacing.stripe,
    borderRadius: spacing.round,
    marginTop: spacing.xs,
  },
  marked: { backgroundColor: colors.calendar },
  selectedDot: { backgroundColor: colors.primary },
});
