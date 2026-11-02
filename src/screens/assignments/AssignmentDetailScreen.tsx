import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import EmptyState from '../../components/common/EmptyState';
import SyncBadge from '../../components/common/SyncBadge';
import SyncNotice from '../../components/common/SyncNotice';
import StatusToggle from '../../components/assignment/StatusToggle';
import InfoRow from '../../components/profile/InfoRow';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import useRecord from '../../hooks/useRecord';
import { useDetailTitle } from '../../hooks/useStudyData';
import layout from '../../theme/layout';

/** @param {{route: Object, navigation: Object}} props route.params chỉ có { id }. */
export default function AssignmentDetailScreen({
  route,
  navigation,
}: ScreenProps<'AssignmentDetail'>) {
  const query = useRecord('assignments', route.params.id);
  const { toggleAssignment, pending } = useAppData();
  const sync = useSync();
  const assignment = query.data;
  useDetailTitle(navigation, assignment?.title);
  return (
    <ScreenContainer scroll>
      <SyncNotice {...sync} onSync={sync.syncNow} />
      <QueryFeedback query={query} />
      {assignment ? (
        <View style={layout.card}>
          <Text style={layout.title}>{assignment.title}</Text>
          <InfoRow
            label="Môn học"
            value={assignment.course?.name || assignment.courseId}
          />
          <InfoRow label="Hạn nộp" value={query.dueLabel} />
          {query.overdue ? (
            <Text style={layout.error}>Bài tập đã quá hạn</Text>
          ) : null}
          <Text style={layout.body}>
            {assignment.description || 'Chưa có mô tả.'}
          </Text>
          <StatusToggle
            status={assignment.status}
            onToggle={() => {
              toggleAssignment(assignment).catch(() => {});
            }}
          />
          <SyncBadge pending={pending('assignments', assignment.id)} />
        </View>
      ) : !query.loading && !query.error ? (
        <EmptyState title="Không tìm thấy bài tập" />
      ) : null}
    </ScreenContainer>
  );
}
