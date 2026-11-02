import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import EmptyState from '../../components/common/EmptyState';
import SyncNotice from '../../components/common/SyncNotice';
import InfoRow from '../../components/profile/InfoRow';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import useRecord from '../../hooks/useRecord';
import { useCourseRelated, useDetailTitle } from '../../hooks/useStudyData';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import layout from '../../theme/layout';

/** @param {{route: Object, navigation: Object}} props route.params chỉ có { id }. */
export default function CourseDetailScreen({
  route,
  navigation,
}: ScreenProps<'CourseDetail'>) {
  const query = useRecord('courses', route.params.id);
  const related = useCourseRelated(route.params.id);
  const sync = useSync();
  const course = query.data;
  useDetailTitle(navigation, course?.name);
  return (
    <ScreenContainer>
      <FlatList
        data={course ? related.assignments : []}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={layout.content}
        refreshing={query.refreshing || related.query.refreshing}
        onRefresh={() => {
          query.refresh();
          related.query.refresh();
        }}
        ListHeaderComponent={
          <View style={layout.section}>
            <SyncNotice {...sync} onSync={sync.syncNow} />
            <QueryFeedback query={query} />
            {course ? (
              <>
                <View style={layout.card}>
                  <Text style={layout.title}>{course.name}</Text>
                  <InfoRow label="Mã môn" value={course.code} />
                  <InfoRow label="Số tín chỉ" value={course.credits} />
                  <InfoRow label="Giảng viên" value={course.lecturer} />
                  <InfoRow label="Học kỳ" value={course.semester} />
                  <Text style={layout.body}>{course.description}</Text>
                </View>
                <Text style={layout.heading}>Lịch học của môn</Text>
                <QueryFeedback query={related.query} />
                {related.sessions.map(session => (
                  <View key={session.id} style={layout.section}>
                    <Text style={layout.muted}>
                      {session.dayOfWeek === 8
                        ? 'Chủ nhật'
                        : `Thứ ${session.dayOfWeek}`}
                    </Text>
                    <SessionCard
                      session={session}
                      onPress={() =>
                        navigation.navigate(ROUTES.SESSION_DETAIL, {
                          id: session.id,
                        })
                      }
                    />
                  </View>
                ))}
                {!related.sessions.length &&
                !related.query.loading &&
                !related.query.error ? (
                  <EmptyState title="Chưa có lịch học" />
                ) : null}
                <Text style={layout.heading}>Bài tập của môn</Text>
              </>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={related.pending('assignments', item.id)}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => {
              related.toggleAssignment(item).catch(() => {});
            }}
          />
        )}
        ListEmptyComponent={
          !query.loading &&
          !query.error &&
          !related.query.loading &&
          !related.query.error ? (
            <EmptyState
              title={
                course
                  ? 'Chưa có bài tập cho môn học này'
                  : 'Không tìm thấy môn học'
              }
            />
          ) : undefined
        }
      />
    </ScreenContainer>
  );
}
