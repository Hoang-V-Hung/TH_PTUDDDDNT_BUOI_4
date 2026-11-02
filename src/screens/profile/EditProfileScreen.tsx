import { useSync } from '../../context/SyncContext';
import SyncNotice from '../../components/common/SyncNotice';
import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { Text } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useEditProfile } from '../../hooks/useStudyData';
import layout from '../../theme/layout';

/** @param {{navigation: Object}} props navigation bắt buộc. */
export default function EditProfileScreen({
  navigation,
}: ScreenProps<'EditProfile'>) {
  const sync = useSync();
  const form = useEditProfile();
  return (
    <ScreenContainer scroll>
      <SyncNotice {...sync} onSync={sync.syncNow} />
      <Text style={layout.title}>Thông tin cá nhân</Text>
      <QueryFeedback query={form.query} />
      <FormInput
        label="Họ tên *"
        value={form.values.fullName}
        onChangeText={value => form.change('fullName', value)}
        error={form.errors.fullName}
      />
      <FormInput
        label="Email *"
        keyboardType="email-address"
        value={form.values.email}
        onChangeText={value => form.change('email', value)}
        error={form.errors.email}
      />
      <FormInput
        label="Số điện thoại *"
        keyboardType="phone-pad"
        value={form.values.phone}
        onChangeText={value => form.change('phone', value)}
        error={form.errors.phone}
      />
      {form.saveError ? (
        <Text style={layout.error}>{form.saveError}</Text>
      ) : null}
      <AppButton
        title="Lưu thông tin"
        loading={form.saving}
        disabled={!form.student}
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
