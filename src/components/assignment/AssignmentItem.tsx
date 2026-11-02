import type { AssignmentItemProps } from '../../types/componentProps';
import React, { memo } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import elevation from '../../theme/elevation';

/** @param {{assignment: Object, pending?: boolean, onPress: Function, onToggleStatus: Function}} props assignment và hai callback bắt buộc. */
export default memo(function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}: AssignmentItemProps) {
  const overdue = isOverdue(assignment);
  return (
    <View style={[styles.card, assignment.status !== 'done' && styles.todo]}>
      <View style={[styles.accent, overdue && styles.overdueAccent]} />
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Xem bài tập ${assignment.title}`}
        style={styles.detail}
      >
        <Text style={styles.course}>
          {assignment.course?.name || assignment.courseId}
        </Text>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={[styles.date, overdue && styles.overdue]}>
          {overdue ? 'Quá hạn · ' : 'Hạn nộp: '}
          {formatDate(assignment.dueDate, true)}
        </Text>
      </Pressable>
      <View style={styles.footer}>
        <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
        <SyncBadge pending={pending} />
      </View>
    </View>
  );
});
const styles = StyleSheet.create({
  card: {
    ...elevation.card,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingLeft: spacing.xxl,
  },
  todo: {
    backgroundColor: colors.assignmentSoft,
    borderColor: colors.assignmentBorder,
  },
  accent: {
    position: 'absolute',
    left: spacing.sm,
    top: spacing.md,
    bottom: spacing.md,
    width: spacing.stripe,
    borderRadius: spacing.round,
    backgroundColor: colors.warning,
  },
  overdueAccent: { backgroundColor: colors.danger },
  detail: { gap: spacing.sm, minHeight: spacing.touch },
  course: { ...typography.caption, color: colors.textMuted },
  title: { ...typography.h3, color: colors.text },
  date: { ...typography.caption, color: colors.textMuted },
  overdue: { color: colors.danger },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});
