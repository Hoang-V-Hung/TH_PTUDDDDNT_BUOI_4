import type { SearchBarProps } from '../../types/componentProps';
import React, { useRef } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** @param {{value: string, onChangeText: Function, placeholder?: string}} props value, onChangeText bắt buộc. */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm',
}: SearchBarProps) {
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);
  return (
    <View style={styles.container}>
      <TextInput
        ref={input}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={placeholder}
        returnKeyType="search"
      />
      {value ? (
        <Pressable
          style={styles.clear}
          accessibilityRole="button"
          accessibilityLabel="Xóa tìm kiếm"
          onPress={() => {
            onChangeText('');
            input.current?.focus();
          }}
        >
          <Text style={styles.text}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: spacing.hairline,
    borderColor: colors.inputBorder,
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
  },
  input: {
    ...typography.input,
    color: colors.text,
    flex: 1,
    minWidth: spacing.none,
    minHeight: spacing.touch,
    paddingHorizontal: spacing.md,
  },
  clear: {
    width: spacing.touch,
    minHeight: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { ...typography.h2, color: colors.textMuted },
});
