import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../common/AppButton';
import EmptyState from '../common/EmptyState';
import CourseOptionRow from './CourseOptionRow';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import layout from '../../theme/layout';
import type { EntityId, FilterOption } from '../../types/models';

/** options, value, onSelect bắt buộc. Chỉ giữ trạng thái mở/đóng, không gọi API. */
export default function CoursePicker({
  options,
  value,
  onSelect,
}: {
  options: FilterOption<EntityId>[];
  value: EntityId;
  onSelect: (value: EntityId) => void;
}) {
  const [visible, setVisible] = useState(false);
  const selected = options.find(option => option.value === value);
  return (
    <>
      <AppButton
        title={selected?.label || 'Chọn môn học'}
        variant="outline"
        onPress={() => setVisible(true)}
      />
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.container}>
          {visible ? <StatusBar barStyle="dark-content" /> : null}
          <View style={styles.header}>
            <Text style={layout.title}>Chọn môn học</Text>
            <AppButton
              title="Đóng"
              variant="outline"
              onPress={() => setVisible(false)}
            />
          </View>
          <FlatList
            data={options}
            keyExtractor={item => String(item.value)}
            contentContainerStyle={layout.content}
            renderItem={({ item }) => (
              <CourseOptionRow
                option={item}
                selected={item.value === value}
                onPress={() => {
                  onSelect(item.value);
                  setVisible(false);
                }}
              />
            )}
            ListEmptyComponent={<EmptyState title="Chưa có môn học để chọn" />}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.xl, gap: spacing.md },
});
