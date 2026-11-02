import { useSync } from '../../context/SyncContext';
import SyncNotice from '../../components/common/SyncNotice';
import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { FlatList, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import SemesterSelector from '../../components/common/SemesterSelector';
import EmptyState from '../../components/common/EmptyState';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import { useGrades } from '../../hooks/useStudyData';
import { ROUTES } from '../../navigation/routes';
import layout from '../../theme/layout';

/** @param {{navigation: Object}} props navigation bắt buộc. */
export default function GradeListScreen({
  navigation,
}: ScreenProps<'GradeList'>) {
  const sync = useSync();
  const data = useGrades();
  return (
    <ScreenContainer>
      <FlatList
        data={data.grades}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={layout.content}
        refreshing={data.query.refreshing}
        onRefresh={data.query.refresh}
        ListHeaderComponent={
          <View style={layout.section}>
            <SyncNotice {...sync} onSync={sync.syncNow} />
            <SemesterSelector
              options={data.options}
              selected={data.semester}
              onSelect={data.setSemester}
            />
            <QueryFeedback query={data.query} showTimestamp={!sync.isOnline} />
            {data.queries.grades.data && data.queries.courses.data ? (
              <GpaSummary {...data.summary} />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          !data.query.loading && !data.query.error ? (
            <EmptyState title="Chưa có điểm trong học kỳ này" />
          ) : undefined
        }
      />
    </ScreenContainer>
  );
}
