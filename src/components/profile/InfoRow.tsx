import type { InfoRowProps } from '../../types/componentProps';
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{label: string, value: string|number}} props Cả hai bắt buộc. */
export default memo(function InfoRow({
  label,
  value,
  last = false,
}: InfoRowProps) {
  const stacked = typeof value === 'string' && value.includes('@');
  return (
    <View style={[styles.row, last && styles.last, stacked && styles.stacked]}>
      <Text style={[styles.label, stacked && styles.stackedLabel]}>
        {label}
      </Text>
      <Text
        selectable
        textBreakStrategy="balanced"
        style={[styles.value, stacked && styles.stackedValue]}
      >
        {value === '' || value === null || value === undefined
          ? 'Chưa có thông tin'
          : value}
      </Text>
    </View>
  );
});
const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
    gap: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: spacing.hairline,
    borderColor: colors.border,
  },
  last: { borderBottomWidth: spacing.none },
  stacked: { flexDirection: 'column', gap: spacing.xs },
  stackedLabel: { flex: 0, paddingTop: spacing.none },
  stackedValue: { flex: 0, textAlign: 'left' },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
    paddingTop: spacing.xs,
  },
  value: {
    ...typography.body,
    color: colors.text,
    flex: 2,
    textAlign: 'right',
  },
});
