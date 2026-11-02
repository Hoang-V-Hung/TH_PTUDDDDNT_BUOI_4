import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { FlatList, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import QueryFeedback from '../../components/common/QueryFeedback';
import SyncNotice from '../../components/common/SyncNotice';
import EmptyState from '../../components/common/EmptyState';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAssignmentList } from '../../hooks/useStudyData';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import layout from '../../theme/layout';

const filters = [
  { value: 'all', label: 'Tất cả' },
  { value: 'todo', label: 'Chưa xong' },
  { value: 'done', label: 'Đã xong' },
  { value: 'overdue', label: 'Quá hạn' },
];
/** @param {{navigation: Object}} props navigation bắt buộc. */
export default function AssignmentListScreen({
  navigation,
}: ScreenProps<'AssignmentList'>) {
  const data = useAssignmentList();
  const sync = useSync();
  return (
    <ScreenContainer>
      <FlatList
        data={data.items}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={layout.content}
        refreshing={data.query.refreshing}
        onRefresh={data.query.refresh}
        ListHeaderComponent={
          <View style={layout.section}>
            <SyncNotice {...sync} onSync={sync.syncNow} />
            <AppButton
              title="Thêm bài tập"
              onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
            />
            <SearchBar
              value={data.search}
              onChangeText={data.setSearch}
              placeholder="Tìm bài tập hoặc môn học"
            />
            <FilterChips
              options={filters}
              selected={data.filter}
              onSelect={data.setFilter}
            />
            <QueryFeedback query={data.query} showTimestamp={!sync.isOnline} />
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
              title="Không có bài tập phù hợp"
              actionLabel="Xóa bộ lọc"
              onAction={() => {
                data.setSearch('');
                data.setFilter('all');
              }}
            />
          ) : undefined
        }
      />
    </ScreenContainer>
  );
}
