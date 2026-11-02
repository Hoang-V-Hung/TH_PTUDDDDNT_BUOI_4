import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import type { FilterOption } from '../../types/models';

/** @param {{options: Array, selected: string|number, onSelect: Function}} props Tất cả bắt buộc. */
export default function FilterChips<T extends string | number>({
  options,
  selected,
  onSelect,
}: {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map(option => (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option.value)}
          accessibilityRole="button"
          accessibilityLabel={option.label}
          accessibilityState={{ selected: selected === option.value }}
          style={[styles.chip, selected === option.value && styles.selected]}
        >
          <Text
            style={[styles.text, selected === option.value && styles.onPrimary]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  row: { gap: spacing.sm },
  chip: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderWidth: spacing.hairline,
    borderColor: colors.inputBorder,
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { ...typography.body, color: colors.text },
  onPrimary: { color: colors.white },
});
