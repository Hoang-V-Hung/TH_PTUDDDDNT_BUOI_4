import type { Assignment, EntityId } from '../types/models';
import { request } from './client';
export const getAll = () =>
  request<Assignment[]>('GET', '/assignments?_expand=course&_sort=dueDate');
export const getById = (id: EntityId) =>
  request<Assignment>(
    'GET',
    `/assignments/${encodeURIComponent(id)}?_expand=course`,
  );
export const update = (id: EntityId, data: Partial<Assignment>) =>
  request<Assignment>('PATCH', `/assignments/${encodeURIComponent(id)}`, data);
export const create = (data: Partial<Assignment>) =>
  request<Assignment>('POST', '/assignments', data);
