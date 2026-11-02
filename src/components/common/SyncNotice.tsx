import type { SyncNoticeProps } from '../../types/componentProps';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{pendingCount: number, syncing: boolean, isOnline: boolean, notice: Object, onSync: Function}} props Tất cả bắt buộc. */
export default function SyncNotice({
  pendingCount,
  syncing,
  isOnline,
  notice,
  onSync,
}: SyncNoticeProps) {
  if (!pendingCount && !notice.message) {
    return null;
  }
  return (
    <View style={styles.container}>
      {pendingCount ? (
        <Text style={styles.text}>{pendingCount} thay đổi chưa đồng bộ</Text>
      ) : null}
      {notice.message ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.text, notice.error && styles.error]}
        >
          {notice.message}
        </Text>
      ) : null}
      {pendingCount && isOnline ? (
        <AppButton
          title={syncing ? 'Đang đồng bộ…' : 'Đồng bộ ngay'}
          variant="outline"
          loading={syncing}
          onPress={onSync}
        />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingVertical: spacing.sm },
  text: { ...typography.caption, color: colors.textMuted },
  error: { color: colors.danger },
});
