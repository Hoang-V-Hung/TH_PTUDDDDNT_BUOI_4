import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import SearchBar from '../../components/common/SearchBar';
import SemesterSelector from '../../components/common/SemesterSelector';
import QueryFeedback from '../../components/common/QueryFeedback';
import SyncNotice from '../../components/common/SyncNotice';
import EmptyState from '../../components/common/EmptyState';
import CourseCard from '../../components/course/CourseCard';
import { useCourseList } from '../../hooks/useStudyData';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import layout from '../../theme/layout';
import spacing from '../../theme/spacing';
import useCardGrid from '../../hooks/useCardGrid';

/** @param {{navigation: Object}} props navigation bắt buộc. */
export default function CourseListScreen({
  navigation,
}: ScreenProps<'CourseList'>) {
  const data = useCourseList();
  const sync = useSync();
  const grid = useCardGrid();
  return (
    <ScreenContainer>
      <FlatList
        key={grid.columns}
        numColumns={grid.columns}
        columnWrapperStyle={grid.columns > 1 ? styles.gridRow : undefined}
        data={data.courses}
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
            <SearchBar
              value={data.search}
              onChangeText={data.setSearch}
              placeholder="Tìm tên hoặc mã môn học"
            />
            <QueryFeedback query={data.query} showTimestamp={!sync.isOnline} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ width: grid.cardWidth }}>
            <CourseCard
              compact
              course={item}
              onPress={() =>
                navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          !data.query.loading && !data.query.error ? (
            <EmptyState
              title="Không tìm thấy môn học"
              description="Thử từ khóa hoặc học kỳ khác."
              actionLabel="Xóa bộ lọc"
              onAction={() => {
                data.setSearch('');
                data.setSemester('all');
              }}
            />
          ) : undefined
        }
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  gridRow: { gap: spacing.md, alignItems: 'stretch' },
});
