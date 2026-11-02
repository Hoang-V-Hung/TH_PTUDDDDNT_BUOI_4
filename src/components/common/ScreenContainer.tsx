import type { ScreenContainerProps } from '../../types/componentProps';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';
import layout from '../../theme/layout';

/** @param {{children: React.ReactNode, scroll?: boolean}} props children bắt buộc. */
export default function ScreenContainer({
  children,
  scroll = false,
  header = null,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {header}
      <OfflineBanner />
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={layout.content}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
});
