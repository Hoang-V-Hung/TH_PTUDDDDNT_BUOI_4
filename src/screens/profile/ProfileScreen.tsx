import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { FlatList, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import EmptyState from '../../components/common/EmptyState';
import AppButton from '../../components/common/AppButton';
import SyncNotice from '../../components/common/SyncNotice';
import GpaSummary from '../../components/grade/GpaSummary';
import IdentityHeader from '../../components/profile/IdentityHeader';
import ProfileInfoCard from '../../components/profile/ProfileInfoCard';
import { useProfileData } from '../../hooks/useStudyData';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import layout from '../../theme/layout';

/** navigation bắt buộc. Hồ sơ, chỉnh sửa và điểm là các chức năng đã có. */
export default function ProfileScreen({ navigation }: ScreenProps<'Profile'>) {
  const data = useProfileData();
  const sync = useSync();
  const showFeedback = Boolean(
    sync.pendingCount ||
      sync.notice.message ||
      data.query.loading ||
      data.query.error ||
      !sync.isOnline,
  );
  const openGrades = () => navigation.navigate(ROUTES.GRADE_LIST);
  return (
    <ScreenContainer header={<IdentityHeader student={data.student} />}>
      <FlatList
        data={data.student ? [data.student] : []}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={layout.content}
        refreshing={data.query.refreshing}
        onRefresh={data.query.refresh}
        ListHeaderComponent={
          showFeedback ? (
            <View style={layout.section}>
              <SyncNotice {...sync} onSync={sync.syncNow} />
              <QueryFeedback
                query={data.query}
                showTimestamp={!sync.isOnline}
              />
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <ProfileInfoCard
            student={item}
            pending={data.pending('students', 1)}
            onEdit={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          />
        )}
        ListFooterComponent={
          <View style={layout.section}>
            {data.queries.grades.data && data.queries.courses.data ? (
              <GpaSummary {...data.summary} onPress={openGrades} />
            ) : (
              <AppButton
                title="Xem kết quả học tập"
                variant="outline"
                onPress={openGrades}
              />
            )}
          </View>
        }
        ListEmptyComponent={
          !data.query.loading && !data.query.error ? (
            <EmptyState title="Chưa có hồ sơ sinh viên" />
          ) : undefined
        }
      />
    </ScreenContainer>
  );
}
