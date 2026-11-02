import type { EmptyStateProps } from '../../types/componentProps';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{title: string, description?: string, actionLabel?: string, onAction?: Function}} props title bắt buộc. */
export default function EmptyState({
  title,
  description = '',
  actionLabel = 'Thử lại',
  onAction = undefined,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {onAction ? (
        <AppButton title={actionLabel} variant="outline" onPress={onAction} />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: spacing.xxl, gap: spacing.sm, alignItems: 'center' },
  title: { ...typography.h3, color: colors.text, textAlign: 'center' },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
