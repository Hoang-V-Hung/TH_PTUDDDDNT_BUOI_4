import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import BrandPattern from './BrandPattern';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** title bắt buộc; onBack tùy chọn cho màn hình trong Stack. */
export default function BrandHeader({
  title,
  onBack = undefined,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <BrandPattern />
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            style={styles.side}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Icon name="chevron-back" color={colors.white} size={spacing.xxl} />
          </Pressable>
        ) : (
          <View style={styles.side} />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.side} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary },
  row: {
    minHeight: spacing.header,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
  side: {
    width: spacing.touch,
    minHeight: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.header,
    color: colors.white,
    textAlign: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
  },
});
