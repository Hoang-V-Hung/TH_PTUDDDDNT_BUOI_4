import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

/** Họa tiết trang trí đầu trang; không có dữ liệu hoặc vùng bấm. */
export default function BrandPattern() {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.pattern}
    >
      <View style={styles.orbit} />
      <Icon
        name="flower-outline"
        size={spacing.avatar}
        color={colors.primaryDecor}
        style={styles.flower}
      />
      <Icon
        name="sunny-outline"
        size={spacing.touch * 2}
        color={colors.primaryDecor}
        style={styles.burst}
      />
      <View style={styles.dot} />
    </View>
  );
}
const styles = StyleSheet.create({
  pattern: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  orbit: {
    position: 'absolute',
    width: spacing.touch * 4,
    height: spacing.touch * 4,
    borderWidth: spacing.hairline,
    borderColor: colors.primaryDecor,
    borderRadius: spacing.round,
    right: -spacing.touch,
    top: -spacing.touch * 2,
  },
  flower: {
    position: 'absolute',
    left: spacing.xxl * 2,
    top: -spacing.md,
    opacity: 0.32,
    transform: [{ rotate: '22deg' }],
  },
  burst: {
    position: 'absolute',
    right: spacing.lg,
    bottom: -spacing.xxxl,
    opacity: 0.36,
  },
  dot: {
    position: 'absolute',
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.primaryDecor,
    top: spacing.xxl,
    right: spacing.touch * 3,
  },
});
