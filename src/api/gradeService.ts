import type { Grade, EntityId } from '../types/models';
import { request } from './client';
export const getAll = () => request<Grade[]>('GET', '/grades?_expand=course');
export const getById = (id: EntityId) =>
  request<Grade>('GET', `/grades/${encodeURIComponent(id)}?_expand=course`);
export const update = (id: EntityId, data: Partial<Grade>) =>
  request<Grade>('PATCH', `/grades/${encodeURIComponent(id)}`, data);
export const create = (data: Partial<Grade>) =>
  request<Grade>('POST', '/grades', data);
