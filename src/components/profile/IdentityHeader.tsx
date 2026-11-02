import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import BrandPattern from '../common/BrandPattern';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import type { Student } from '../../types/models';

/** student bắt buộc (null khi đang tải), onSchedule tùy chọn. */
export default function IdentityHeader({
  student,
  onSchedule = undefined,
}: {
  student: Student | null;
  onSchedule?: () => void;
}) {
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <BrandPattern />
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Icon name="person" size={spacing.xxxl} color={colors.white} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {student?.fullName || 'Hồ sơ sinh viên'}
          </Text>
          {student ? (
            <Text style={styles.code}>MSV: {student.studentCode}</Text>
          ) : null}
        </View>
        {onSchedule ? (
          <Pressable
            style={styles.action}
            onPress={onSchedule}
            accessibilityRole="button"
            accessibilityLabel="Mở thời khóa biểu"
          >
            <Icon
              name="calendar-outline"
              size={spacing.icon}
              color={colors.white}
            />
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: spacing.avatar,
    height: spacing.avatar,
    borderRadius: spacing.round,
    backgroundColor: colors.primaryDecor,
    borderWidth: spacing.stripe,
    borderColor: colors.onPrimaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: spacing.xs },
  name: { ...typography.h2, color: colors.white },
  code: { ...typography.caption, color: colors.white },
  action: {
    width: spacing.touch,
    height: spacing.touch,
    borderRadius: spacing.radius,
    backgroundColor: colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
