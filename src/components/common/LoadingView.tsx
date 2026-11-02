import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LoadingView({
  message = 'Đang tải…',
}: {
  message?: string;
}) {
  return (
    <View style={styles.container} accessibilityLabel={message}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: spacing.xxl, alignItems: 'center', gap: spacing.md },
  text: { ...typography.body, color: colors.textMuted },
});
