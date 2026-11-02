import type { ScreenProps } from '../../types/navigation';
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import QueryFeedback from '../../components/common/QueryFeedback';
import SyncNotice from '../../components/common/SyncNotice';
import EmptyState from '../../components/common/EmptyState';
import ScheduleCalendar from '../../components/schedule/ScheduleCalendar';
import SessionCard from '../../components/schedule/SessionCard';
import { useScheduleData } from '../../hooks/useStudyData';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import layout from '../../theme/layout';

/** @param {{navigation: Object}} props navigation bắt buộc. */
export default function ScheduleScreen({
  navigation,
}: ScreenProps<'Schedule'>) {
  const data = useScheduleData();
  const sync = useSync();
  return (
    <ScreenContainer>
      <ScheduleCalendar
        monthLabel={data.monthLabel}
        selectedDate={data.selectedDate}
        selectedDay={data.day}
        weekCells={data.weekCells}
        monthCells={data.monthCells}
        onSelectDate={data.setSelectedDate}
        onSelectDay={data.setDay}
        onMoveMonth={data.moveMonth}
      />
      <FlatList
        data={data.sessions}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={layout.content}
        refreshing={data.query.refreshing}
        onRefresh={data.query.refresh}
        ListHeaderComponent={
          <View style={layout.section}>
            <SyncNotice {...sync} onSync={sync.syncNow} />
            <QueryFeedback query={data.query} showTimestamp={!sync.isOnline} />
            <Text style={layout.heading}>{data.selectedLabel}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          !data.query.loading && !data.query.error ? (
            <EmptyState
              title="Không có lịch học trong ngày"
              description="Chọn ngày khác để xem lịch học."
            />
          ) : undefined
        }
      />
    </ScreenContainer>
  );
}
