import type { SessionCardProps } from '../../types/componentProps';
import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{session: Object, onPress: Function}} props Cả hai bắt buộc. */
export default memo(function SessionCard({
  session,
  onPress,
}: SessionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Xem buổi học ${
        session.course?.name || session.courseId
      }`}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.accent} />
      <Text style={styles.title}>
        {session.course?.name || session.courseId}
      </Text>
      <View style={styles.meta}>
        <Icon name="time-outline" color={colors.calendar} size={spacing.lg} />
        <Text style={styles.text}>
          {session.startTime} – {session.endTime}
        </Text>
      </View>
      <View style={styles.meta}>
        <Icon
          name="location-outline"
          color={colors.calendar}
          size={spacing.lg}
        />
        <Text style={styles.text}>Phòng {session.room}</Text>
      </View>
    </Pressable>
  );
});
const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    paddingLeft: spacing.xxl,
    gap: spacing.sm,
    borderWidth: spacing.hairline,
    borderColor: colors.calendarBorder,
    borderRadius: spacing.radius,
    backgroundColor: colors.calendarSoft,
    minHeight: spacing.touch,
  },
  accent: {
    position: 'absolute',
    left: spacing.sm,
    top: spacing.md,
    bottom: spacing.md,
    width: spacing.stripe,
    borderRadius: spacing.round,
    backgroundColor: colors.calendar,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.h3, color: colors.calendar, marginBottom: spacing.xs },
  text: { ...typography.caption, color: colors.text },
});
