import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InfoRow from './InfoRow';
import SyncBadge from '../common/SyncBadge';
import type { Student } from '../../types/models';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import elevation from '../../theme/elevation';

/** student, onEdit bắt buộc. pending mặc định false. */
export default memo(function ProfileInfoCard({
  student,
  onEdit,
  pending = false,
}: {
  student: Student;
  onEdit: () => void;
  pending?: boolean;
}) {
  const fields: Array<[keyof Student, string]> = [
    ['studentCode', 'Mã sinh viên'],
    ['fullName', 'Họ tên'],
    ['className', 'Lớp'],
    ['major', 'Ngành'],
    ['email', 'Email'],
    ['phone', 'Số điện thoại'],
  ];
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.header}
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel="Chỉnh sửa thông tin"
      >
        <Icon
          name="person-circle-outline"
          color={colors.primary}
          size={spacing.xxl}
        />
        <Text style={styles.title}>Thông tin tài khoản</Text>
        <Icon
          name="chevron-forward"
          size={spacing.lg}
          color={colors.textMuted}
        />
      </Pressable>
      <SyncBadge pending={pending} />
      {fields.map(([key, label], index) => (
        <InfoRow
          key={key}
          label={label}
          value={student[key]}
          last={index === fields.length - 1}
        />
      ))}
    </View>
  );
});
const styles = StyleSheet.create({
  card: {
    ...elevation.card,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.radius,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: spacing.touch,
    marginBottom: spacing.sm,
    borderBottomWidth: spacing.hairline,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  title: { ...typography.h3, color: colors.text, flex: 1 },
});
