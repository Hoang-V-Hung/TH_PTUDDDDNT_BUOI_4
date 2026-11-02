import React, { createContext, useContext } from 'react';
import * as studentService from '../api/studentService';
import * as courseService from '../api/courseService';
import * as sessionService from '../api/sessionService';
import * as assignmentService from '../api/assignmentService';
import * as gradeService from '../api/gradeService';
import { enqueue } from '../storage/outbox';
import { applyPending, makeId, sameId, isPending } from '../utils/pending';
import useCachedQuery from '../hooks/useCachedQuery';
import { useSync } from './SyncContext';
import type {
  EntityId,
  Course,
  Assignment,
  OutboxAction,
} from '../types/models';

const AppDataContext = createContext<ReturnType<typeof useAppDataValue> | null>(
  null,
);
const fetchStudent = () => studentService.getById(1);
function useAppDataValue() {
  const sync = useSync();
  const studentQuery = useCachedQuery('students:1', fetchStudent);
  const courseQuery = useCachedQuery('courses', courseService.getAll);
  const sessionQuery = useCachedQuery('sessions', sessionService.getAll);
  const assignmentQuery = useCachedQuery(
    'assignments',
    assignmentService.getAll,
  );
  const gradeQuery = useCachedQuery('grades', gradeService.getAll);
  const courses = courseQuery.data || [];
  const withCourse = <T extends { courseId: EntityId; course?: Course }>(
    records: T[],
  ) =>
    records.map(record => ({
      ...record,
      course:
        courses.find(course => sameId(course.id, record.courseId)) ||
        record.course,
    }));
  const student =
    applyPending(
      'students',
      studentQuery.data ? [studentQuery.data] : [],
      sync.actions,
    )[0] || null;
  const assignments = withCourse(
    applyPending('assignments', assignmentQuery.data, sync.actions),
  ).sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
  async function mutate(
    resource: OutboxAction['resource'],
    resourceId: EntityId,
    method: OutboxAction['method'],
    body: Record<string, any>,
  ) {
    const createdAt = new Date().toISOString();
    const action: OutboxAction = {
      id: makeId('action'),
      method,
      url:
        method === 'POST'
          ? `/${resource}`
          : `/${resource}/${encodeURIComponent(resourceId)}`,
      resource,
      resourceId,
      body: { ...body, updatedAt: createdAt },
      createdAt,
      rollbackOnHttpError: sync.isOnline,
    };
    try {
      await enqueue(action);
      if (!sync.isOnline) {
        sync.notify(
          'Đã lưu trên thiết bị. Thay đổi sẽ được đồng bộ khi có mạng.',
        );
      }
      return action.body;
    } catch {
      sync.notify(
        'Không lưu được thay đổi vào hàng đợi. Vui lòng thử lại.',
        true,
      );
      throw new Error('Không lưu được thay đổi vào thiết bị.');
    }
  }
  const value = {
    student,
    courses,
    assignments,
    sessions: withCourse(sessionQuery.data || []),
    grades: withCourse(gradeQuery.data || []),
    queries: {
      student: studentQuery,
      courses: courseQuery,
      sessions: sessionQuery,
      assignments: assignmentQuery,
      grades: gradeQuery,
    },
    pending: (resource: string, id: EntityId) =>
      isPending(sync.actions, resource, id),
    toggleAssignment: (assignment: Assignment) =>
      mutate('assignments', assignment.id, 'PATCH', {
        status: assignment.status === 'done' ? 'todo' : 'done',
      }),
    createAssignment: (
      data: Pick<Assignment, 'title' | 'courseId' | 'description' | 'dueDate'>,
    ) => {
      const id = makeId('assignment');
      return mutate('assignments', id, 'POST', { ...data, id, status: 'todo' });
    },
    updateStudent: (data: { fullName: string; email: string; phone: string }) =>
      mutate('students', 1, 'PATCH', data),
  };
  return value;
}
export default function AppDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useAppDataValue();
  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
export const useAppData = () => {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData phải nằm trong AppDataProvider.');
  }
  return value;
};
