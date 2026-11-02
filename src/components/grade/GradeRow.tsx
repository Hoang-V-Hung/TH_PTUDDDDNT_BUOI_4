import type { GradeRowProps } from '../../types/componentProps';
import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import elevation from '../../theme/elevation';

/** @param {{grade: Object, onPress: Function}} props Cả hai bắt buộc. */
export default memo(function GradeRow({ grade, onPress }: GradeRowProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Xem điểm ${grade.course?.name || grade.courseId}`}
    >
      <View style={styles.info}>
        <Text style={styles.title}>{grade.course?.name || grade.courseId}</Text>
        <Text style={styles.text}>
          {grade.course?.credits || 0} tín chỉ · {grade.semester}
        </Text>
      </View>
      <View style={styles.result}>
        <Text style={styles.score}>{Number(grade.total).toFixed(2)}</Text>
        <Text style={styles.letter}>{grade.letter}</Text>
      </View>
    </Pressable>
  );
});
const styles = StyleSheet.create({
  card: {
    ...elevation.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    minHeight: spacing.touch,
  },
  info: { flex: 1, gap: spacing.sm },
  result: {
    backgroundColor: colors.primarySoft,
    borderRadius: spacing.radius,
    padding: spacing.md,
    alignItems: 'center',
    minWidth: spacing.touch,
  },
  letter: { ...typography.caption, color: colors.primary },
  title: { ...typography.h3, color: colors.text },
  text: { ...typography.caption, color: colors.textMuted },
  score: { ...typography.h2, color: colors.primary },
});
