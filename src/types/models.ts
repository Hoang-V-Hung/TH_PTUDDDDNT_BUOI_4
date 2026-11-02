export type EntityId = string | number;
export interface Student {
  id: EntityId;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
}
export interface Course {
  id: EntityId;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
  status?: 'active' | 'completed';
}
export interface Session {
  id: EntityId;
  courseId: EntityId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  course?: Course;
  startDate?: string;
  endDate?: string;
}
export interface Assignment {
  id: EntityId;
  courseId: EntityId;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'done';
  updatedAt: string;
  course?: Course;
}
export interface Grade {
  id: EntityId;
  courseId: EntityId;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course;
}
export interface ApiError {
  type: 'network' | 'timeout' | 'http';
  status: number;
  message: string;
}
export interface QueryState<T> {
  data: T | undefined;
  loading: boolean;
  error: { message: string } | null;
  refreshing: boolean;
  lastUpdated: string | null;
}
export interface CachedQuery<T> extends QueryState<T> {
  refresh: () => Promise<void>;
}
export interface OutboxAction {
  id: string;
  method: 'POST' | 'PATCH';
  url: string;
  resource: 'students' | 'assignments';
  resourceId: EntityId;
  body: Record<string, any>;
  createdAt: string;
  rollbackOnHttpError: boolean;
}
export interface Notice {
  message: string;
  error: boolean;
}
export interface FilterOption<T extends string | number> {
  value: T;
  label: string;
}
