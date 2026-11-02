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
export default function GradeDetailScreen({
  route,
  navigation,
}: ScreenProps<'GradeDetail'>) {
  const sync = useSync();
  const query = useRecord('grades', route.params.id);
  const grade = query.data;
  useDetailTitle(navigation, grade?.course?.name || grade?.courseId);
  return (
    <ScreenContainer scroll>
      <SyncNotice {...sync} onSync={sync.syncNow} />
      <QueryFeedback query={query} />
      {grade ? (
        <View style={layout.card}>
          <Text style={layout.title}>
            {grade.course?.name || grade.courseId}
          </Text>
          <InfoRow label="Học kỳ" value={grade.semester} />
          <InfoRow label="Chuyên cần · 10%" value={grade.attendance} />
          <InfoRow label="Giữa kỳ · 30%" value={grade.midterm} />
          <InfoRow label="Cuối kỳ · 60%" value={grade.final} />
          <InfoRow label="Tổng kết" value={Number(grade.total).toFixed(2)} />
          <InfoRow label="Điểm chữ" value={grade.letter} />
          <Text style={layout.muted}>
            Tổng kết = 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ.
          </Text>
        </View>
      ) : !query.loading && !query.error ? (
        <EmptyState title="Không tìm thấy kết quả học tập" />
      ) : null}
    </ScreenContainer>
  );
}
