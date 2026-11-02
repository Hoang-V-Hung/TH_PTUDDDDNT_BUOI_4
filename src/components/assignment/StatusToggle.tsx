import type { StatusToggleProps } from '../../types/componentProps';
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{status: string, onToggle: Function}} props Cả hai bắt buộc. */
export default function StatusToggle({ status, onToggle }: StatusToggleProps) {
  const done = status === 'done';
  return (
    <Pressable
      onPress={onToggle}
      style={styles.button}
      accessibilityRole="checkbox"
      accessibilityLabel={done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      accessibilityState={{ checked: done }}
    >
      <Icon
        name={done ? 'checkbox' : 'square-outline'}
        size={spacing.icon}
        color={done ? colors.success : colors.textMuted}
      />
      <Text style={[styles.text, done && styles.done]}>
        {done ? 'Đã xong' : 'Chưa xong'}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: spacing.touch,
    minWidth: spacing.touch,
  },
  text: { ...typography.body, color: colors.textMuted },
  done: { color: colors.success },
});
