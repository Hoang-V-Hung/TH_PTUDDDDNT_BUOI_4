import type { FormInputProps } from '../../types/componentProps';
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{label: string, value: string, onChangeText: Function, error?: string, keyboardType?: string, multiline?: boolean, placeholder?: string}} props label, value, onChangeText bắt buộc. */
export default function FormInput({
  label,
  value,
  onChangeText,
  error = '',
  keyboardType = 'default',
  multiline = false,
  placeholder = '',
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.invalid,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
      <Text accessibilityLiveRegion="polite" style={styles.error}>
        {error || ' '}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { ...typography.h3, color: colors.text },
  input: {
    ...typography.input,
    minHeight: spacing.touch,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: spacing.hairline,
    borderColor: colors.inputBorder,
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  multiline: { minHeight: spacing.touch * 2, textAlignVertical: 'top' },
  invalid: { borderColor: colors.danger },
  error: { ...typography.caption, color: colors.danger },
});
