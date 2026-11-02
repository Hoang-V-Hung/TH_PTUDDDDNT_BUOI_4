import type { CourseCardProps } from '../../types/componentProps';
import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import elevation from '../../theme/elevation';

/** @param {{course: Object, onPress: Function}} props Cả hai bắt buộc. */
export default memo(function CourseCard({
  course,
  onPress,
  compact = false,
}: CourseCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Xem môn ${course.name}`}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compact,
        pressed && styles.pressed,
      ]}
    >
      <View pointerEvents="none" style={styles.decoration}>
        <View style={styles.orbit} />
        <View style={styles.innerOrbit} />
      </View>
      <View style={styles.accent} />
      <Text style={styles.credits}>{course.credits} tín chỉ</Text>
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.code}>{course.code}</Text>
      <Text style={styles.text}>{course.lecturer}</Text>
      <Text style={styles.text}>{course.semester}</Text>
    </Pressable>
  );
});
const styles = StyleSheet.create({
  card: {
    ...elevation.card,
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: spacing.radius,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: spacing.touch,
  },
  compact: { flex: 1, minHeight: spacing.touch * 4 },
  credits: {
    ...typography.small,
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    alignSelf: 'flex-start',
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  accent: {
    position: 'absolute',
    width: spacing.stripe,
    height: spacing.xxxl,
    borderRadius: spacing.stripe,
    backgroundColor: colors.primary,
    top: spacing.lg,
    left: spacing.none,
  },
  decoration: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    borderRadius: spacing.radius,
  },
  orbit: {
    position: 'absolute',
    right: -spacing.xxl,
    bottom: -spacing.xxl,
    width: spacing.touch * 2,
    height: spacing.touch * 2,
    borderRadius: spacing.round,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
  },
  innerOrbit: {
    position: 'absolute',
    right: -spacing.lg,
    bottom: -spacing.lg,
    width: spacing.touch,
    height: spacing.touch,
    borderRadius: spacing.round,
    borderWidth: spacing.hairline,
    borderColor: colors.primarySoft,
  },
  code: { ...typography.small, color: colors.textMuted },
  title: { ...typography.h3, color: colors.text },
  text: { ...typography.small, color: colors.textMuted },
  pressed: { opacity: spacing.opacity },
});
