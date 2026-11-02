import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  if (isOnline) {
    return null;
  }
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>Bạn đang offline</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  banner: { backgroundColor: colors.warningSoft, padding: spacing.sm },
  text: { ...typography.body, color: colors.warning, textAlign: 'center' },
});
