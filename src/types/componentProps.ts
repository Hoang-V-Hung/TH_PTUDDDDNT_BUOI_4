import type { ReactNode } from 'react';
import type { KeyboardTypeOptions } from 'react-native';
import type {
  Assignment,
  Course,
  Session,
  Grade,
  Notice,
  QueryState,
} from './models';

export type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  header?: ReactNode;
};
export type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
};
export type ErrorViewProps = { message: string; onRetry: () => void };
export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};
export type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};
export type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  placeholder?: string;
};
export type QueryFeedbackProps = {
  showTimestamp?: boolean;
  query: Pick<QueryState<unknown>, 'loading' | 'error' | 'lastUpdated'> & {
    refresh: () => void;
  };
};
export type SyncNoticeProps = {
  pendingCount: number;
  syncing: boolean;
  isOnline: boolean;
  notice: Notice;
  onSync: () => void;
};
export type CourseCardProps = {
  course: Course;
  onPress: () => void;
  compact?: boolean;
};
export type SessionCardProps = { session: Session; onPress: () => void };
export type StatusToggleProps = {
  status: Assignment['status'];
  onToggle: () => void;
};
export type AssignmentItemProps = {
  assignment: Assignment;
  pending?: boolean;
  onPress: () => void;
  onToggleStatus: () => void;
};
export type GpaSummaryProps = {
  gpa: number;
  totalCredits: number;
  onPress?: () => void;
};
export type GradeRowProps = { grade: Grade; onPress: () => void };
export type InfoRowProps = { label: string; value: ReactNode; last?: boolean };
