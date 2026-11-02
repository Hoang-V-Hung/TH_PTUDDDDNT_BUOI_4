import { useAppData } from '../context/AppDataContext';
import { useSync } from '../context/SyncContext';
import * as courseService from '../api/courseService';
import * as sessionService from '../api/sessionService';
import * as assignmentService from '../api/assignmentService';
import * as gradeService from '../api/gradeService';
import { applyPending, sameId } from '../utils/pending';
import useCachedQuery from './useCachedQuery';
import { formatDate, isOverdue } from '../utils/date';
import { useNow } from './useStudyData';
import type {
  Assignment,
  Course,
  Session,
  Grade,
  EntityId,
} from '../types/models';

const services = {
  courses: courseService,
  sessions: sessionService,
  assignments: assignmentService,
  grades: gradeService,
};
type ResourceMap = {
  courses: Course;
  sessions: Session;
  assignments: Assignment;
  grades: Grade;
};
export default function useRecord<K extends keyof ResourceMap>(
  resource: K,
  id: EntityId,
) {
  const app = useAppData();
  const sync = useSync();
  const now = useNow();
  const localCreate = sync.actions.some(
    action =>
      action.resource === resource &&
      sameId(action.resourceId, id) &&
      action.method === 'POST',
  );
  const query = useCachedQuery<ResourceMap[K]>(
    `${resource}:${id}`,
    () => services[resource].getById(id) as Promise<ResourceMap[K]>,
    !localCreate,
  );
  const fallback = app[resource].find(record => sameId(record.id, id));
  const listUpdated = app.queries[resource].lastUpdated;
  const preferList =
    fallback &&
    (!query.data ||
      Date.parse(listUpdated || '1970-01-01') >
        Date.parse(query.lastUpdated || '1970-01-01'));
  const raw = (preferList ? fallback : query.data || fallback) as
    | ResourceMap[K]
    | undefined;
  const record = applyPending(resource, raw ? [raw] : [], sync.actions).find(
    item => sameId(item.id, id),
  );
  const details = record as
    | {
        courseId?: EntityId;
        course?: Course;
        dueDate?: string;
        status?: Assignment['status'];
      }
    | undefined;
  return {
    ...query,
    data: record
      ? ({
          ...record,
          course:
            app.courses.find(course =>
              sameId(course.id, details?.courseId || ''),
            ) || details?.course,
        } as ResourceMap[K])
      : null,
    loading: query.loading && !record,
    lastUpdated: preferList ? listUpdated : query.lastUpdated || listUpdated,
    dueLabel: details?.dueDate ? formatDate(details.dueDate, true) : '',
    overdue: details?.dueDate
      ? isOverdue(
          { dueDate: details.dueDate, status: details.status || 'todo' },
          now,
        )
      : false,
  };
}
