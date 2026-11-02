import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';
import typography from './typography';
import elevation from './elevation';

export default StyleSheet.create({
  fill: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
    flexGrow: 1,
  },
  section: { gap: spacing.md, marginBottom: spacing.sm },
  card: {
    ...elevation.card,
    padding: spacing.lg,
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    borderWidth: spacing.hairline,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  grow: { flex: 1, minWidth: spacing.none },
  title: { ...typography.h1, color: colors.text },
  heading: { ...typography.h3, color: colors.text },
  body: { ...typography.body, color: colors.text },
  muted: { ...typography.caption, color: colors.textMuted },
  error: { ...typography.caption, color: colors.danger },
  success: { ...typography.body, color: colors.success },
  value: { ...typography.metric, color: colors.primary },
});
