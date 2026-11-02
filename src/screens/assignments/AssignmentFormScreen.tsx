import { useSync } from '../../context/SyncContext';
import SyncNotice from '../../components/common/SyncNotice';
import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { Text } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import CoursePicker from '../../components/course/CoursePicker';
import QueryFeedback from '../../components/common/QueryFeedback';
import { useAssignmentForm } from '../../hooks/useStudyData';
import layout from '../../theme/layout';

/** @param {{navigation: Object}} props navigation bắt buộc. */
export default function AssignmentFormScreen({
  navigation,
}: ScreenProps<'AssignmentForm'>) {
  const sync = useSync();
  const form = useAssignmentForm();
  return (
    <ScreenContainer scroll>
      <SyncNotice {...sync} onSync={sync.syncNow} />
      <Text style={layout.title}>Bài tập mới</Text>
      <Text style={layout.muted}>
        Bạn có thể thêm bài khi offline. Bài sẽ được gửi khi có mạng trở lại.
      </Text>
      <FormInput
        label="Tiêu đề *"
        value={form.values.title}
        onChangeText={value => form.change('title', value)}
        error={form.errors.title}
      />
      <Text style={layout.heading}>Môn học *</Text>
      <QueryFeedback query={form.query} />
      <CoursePicker
        options={form.courseOptions}
        value={form.values.courseId}
        onSelect={value => form.change('courseId', value)}
      />
      {form.errors.courseId ? (
        <Text style={layout.error}>{form.errors.courseId}</Text>
      ) : null}
      <FormInput
        label="Hạn nộp * (dd/MM/yyyy HH:mm)"
        placeholder="Ví dụ: 09/11/2026 23:59"
        value={form.values.dueText}
        onChangeText={value => form.change('dueText', value)}
        error={form.errors.dueDate}
      />
      <FormInput
        label="Mô tả"
        value={form.values.description}
        onChangeText={value => form.change('description', value)}
        multiline
      />
      {form.saveError ? (
        <Text style={layout.error}>{form.saveError}</Text>
      ) : null}
      <AppButton
        title="Lưu bài tập"
        loading={form.saving}
        disabled={!form.courseOptions.length}
        onPress={() => form.save(() => navigation.goBack())}
      />
      <AppButton
        title="Hủy"
        variant="outline"
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}
