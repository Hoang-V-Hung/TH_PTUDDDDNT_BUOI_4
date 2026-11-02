import type { GpaSummaryProps } from '../../types/componentProps';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import elevation from '../../theme/elevation';

/** gpa, totalCredits bắt buộc; onPress tùy chọn mở danh sách điểm. */
export default function GpaSummary({
  gpa,
  totalCredits,
  onPress = undefined,
}: GpaSummaryProps) {
  return (
    <Pressable
      style={styles.card}
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? 'Xem kết quả học tập' : undefined}
    >
      {onPress ? (
        <View style={styles.header}>
          <Icon
            name="school-outline"
            size={spacing.icon}
            color={colors.primary}
          />
          <Text style={styles.title}>Kết quả học tập</Text>
          <Icon
            name="chevron-forward"
            size={spacing.lg}
            color={colors.textMuted}
          />
        </View>
      ) : null}
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.label}>GPA hệ 4</Text>
          <Text style={styles.value}>
            {gpa.toFixed(2)}
            <Text style={styles.unit}> / 4.00</Text>
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metric}>
          <Text style={styles.label}>Tín chỉ tích lũy</Text>
          <Text style={styles.value}>{totalCredits}</Text>
        </View>
      </View>
      <Text style={styles.note}>
        Môn điểm F được tính vào GPA, không cộng tín chỉ tích lũy.
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    ...elevation.card,
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    borderRadius: spacing.radius,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: spacing.touch,
  },
  title: { ...typography.h3, color: colors.text, flex: 1 },
  metrics: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.lg },
  metric: { flex: 1, gap: spacing.xs },
  label: { ...typography.caption, color: colors.textMuted },
  value: { ...typography.metric, color: colors.primary },
  unit: { ...typography.caption, color: colors.textMuted },
  divider: { width: spacing.hairline, backgroundColor: colors.border },
  note: { ...typography.small, color: colors.textMuted },
});
