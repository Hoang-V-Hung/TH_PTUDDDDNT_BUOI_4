import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export default function SyncBadge({ pending = false }: { pending?: boolean }) {
  return pending ? <Text style={styles.text}>Chưa đồng bộ</Text> : null;
}
const styles = StyleSheet.create({
  text: { ...typography.caption, color: colors.warning },
});
