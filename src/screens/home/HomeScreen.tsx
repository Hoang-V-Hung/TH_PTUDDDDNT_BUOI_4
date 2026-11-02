import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import SyncNotice from '../../components/common/SyncNotice';
import EmptyState from '../../components/common/EmptyState';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import IdentityHeader from '../../components/profile/IdentityHeader';
import { useHomeData } from '../../hooks/useStudyData';
import useCardGrid from '../../hooks/useCardGrid';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import layout from '../../theme/layout';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/** navigation bắt buộc. Chỉ trình bày lại hồ sơ, môn học và bài tập hiện có. */
export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const data = useHomeData();
  const sync = useSync();
  const grid = useCardGrid();
  return (
    <ScreenContainer
      header={
        <IdentityHeader
          student={data.student}
          onSchedule={() =>
            navigation.getParent()?.navigate(ROUTES.SCHEDULE_TAB)
          }
        />
      }
    >
      <FlatList
        data={data.upcoming}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={layout.content}
        refreshing={data.query.refreshing}
        onRefresh={data.query.refresh}
        ListHeaderComponent={
          <View style={layout.section}>
            <SyncNotice {...sync} onSync={sync.syncNow} />
            <QueryFeedback query={data.query} showTimestamp={!sync.isOnline} />
            <View style={styles.sectionHeading}>
              <Text style={styles.heading}>Môn đang học</Text>
              <Text style={styles.count}>
                {data.activeCourses.length} môn học
              </Text>
            </View>
            <View style={styles.grid}>
              {data.activeCourses.map(course => (
                <View key={course.id} style={{ width: grid.cardWidth }}>
                  <CourseCard
                    compact
                    course={course}
                    onPress={() =>
                      navigation.navigate(ROUTES.COURSE_DETAIL, {
                        id: course.id,
                      })
                    }
                  />
                </View>
              ))}
            </View>
            {!data.activeCourses.length &&
            !data.query.loading &&
            !data.query.error ? (
              <EmptyState title="Chưa có môn đang học" />
            ) : null}
            <Text style={styles.assignmentHeading}>
              Bài tập đến hạn trong 7 ngày tới
            </Text>
            {data.overdueCount ? (
              <Text style={layout.error}>
                Có {data.overdueCount} bài tập quá hạn. Xem trong tab Bài tập.
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={data.pending('assignments', item.id)}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => {
              data.toggleAssignment(item).catch(() => {});
            }}
          />
        )}
        ListEmptyComponent={
          !data.query.loading && !data.query.error ? (
            <EmptyState
              title="Không có bài tập sắp đến hạn"
              description="Các bài tập đến hạn trong 7 ngày tới sẽ xuất hiện tại đây."
            />
          ) : undefined
        }
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heading: { ...typography.h2, color: colors.text },
  count: { ...typography.caption, color: colors.textMuted },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  assignmentHeading: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
  },
});
