import type { ErrorViewProps } from '../../types/componentProps';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{message: string, onRetry: Function}} props Cả hai bắt buộc. */
export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Icon
        name="alert-circle-outline"
        size={spacing.icon}
        color={colors.danger}
      />
      <Text style={styles.text}>{message}</Text>
      <AppButton title="Thử lại" variant="outline" onPress={onRetry} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, alignItems: 'center' },
  text: { ...typography.body, color: colors.danger, textAlign: 'center' },
});
