import { useSync } from '../../context/SyncContext';
import SyncNotice from '../../components/common/SyncNotice';
import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import EmptyState from '../../components/common/EmptyState';
import InfoRow from '../../components/profile/InfoRow';
import useRecord from '../../hooks/useRecord';
import { useDetailTitle } from '../../hooks/useStudyData';
import layout from '../../theme/layout';

/** @param {{route: Object, navigation: Object}} props route.params chỉ có { id }. */
export default function SessionDetailScreen({
  route,
  navigation,
}: ScreenProps<'SessionDetail'>) {
  const sync = useSync();
  const query = useRecord('sessions', route.params.id);
  const session = query.data;
  useDetailTitle(navigation, session?.course?.name || session?.courseId);
  return (
    <ScreenContainer scroll>
      <SyncNotice {...sync} onSync={sync.syncNow} />
      <QueryFeedback query={query} />
      {session ? (
        <View style={layout.card}>
          <Text style={layout.title}>
            {session.course?.name || session.courseId}
          </Text>
          <InfoRow
            label="Ngày học"
            value={
              session.dayOfWeek === 8 ? 'Chủ nhật' : `Thứ ${session.dayOfWeek}`
            }
          />
          <InfoRow
            label="Thời gian"
            value={`${session.startTime} – ${session.endTime}`}
          />
          <InfoRow label="Phòng học" value={session.room} />
          <InfoRow label="Ghi chú" value={session.note} />
        </View>
      ) : !query.loading && !query.error ? (
        <EmptyState title="Không tìm thấy buổi học" />
      ) : null}
    </ScreenContainer>
  );
}
