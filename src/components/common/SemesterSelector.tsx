import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import elevation from '../../theme/elevation';
import type { FilterOption } from '../../types/models';

/** options, selected, onSelect bắt buộc; chỉ hiện các học kỳ được truyền từ API. */
export default function SemesterSelector<T extends string | number>({
  options,
  selected,
  onSelect,
}: {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const choice = options.find(option => option.value === selected);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(value => !value);
  };
  return (
    <View style={styles.card}>
      <Pressable
        onPress={toggle}
        style={styles.selector}
        accessibilityRole="button"
        accessibilityLabel={`Chọn học kỳ, ${choice?.label || ''}`}
        accessibilityState={{ expanded: open }}
      >
        <Text style={styles.label}>Kỳ học</Text>
        <Text style={styles.value}>{choice?.label || 'Chọn học kỳ'}</Text>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={spacing.lg}
          color={colors.textMuted}
        />
      </Pressable>
      {open ? (
        <View style={styles.options}>
          {options.map(option => (
            <Pressable
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                toggle();
              }}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: option.value === selected }}
              style={[
                styles.option,
                option.value === selected && styles.selected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  option.value === selected && styles.selectedText,
                ]}
              >
                {option.label}
              </Text>
              {option.value === selected ? (
                <Icon
                  name="checkmark"
                  color={colors.primary}
                  size={spacing.lg}
                />
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    ...elevation.card,
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
  },
  selector: {
    minHeight: spacing.touch + spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: { ...typography.body, color: colors.textMuted },
  value: { ...typography.h3, color: colors.text, flex: 1, textAlign: 'right' },
  options: {
    borderTopWidth: spacing.hairline,
    borderTopColor: colors.border,
    padding: spacing.xs,
  },
  option: {
    minHeight: spacing.touch,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: spacing.sm,
  },
  optionText: { ...typography.body, color: colors.text, flex: 1 },
  selected: { backgroundColor: colors.primarySoft },
  selectedText: { color: colors.primary, fontWeight: '600' },
});
