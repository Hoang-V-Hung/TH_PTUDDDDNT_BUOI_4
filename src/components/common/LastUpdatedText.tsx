import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatUpdatedAt } from '../../utils/date';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export default function LastUpdatedText({
  timestamp = null,
}: {
  timestamp?: string | null;
}) {
  return timestamp ? (
    <Text style={styles.text}>
      Cập nhật lần cuối: {formatUpdatedAt(timestamp)}
    </Text>
  ) : null;
}
const styles = StyleSheet.create({
  text: { ...typography.caption, color: colors.textMuted },
});
