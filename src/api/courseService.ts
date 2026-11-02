import type { Course, EntityId } from '../types/models';
import { request } from './client';
export const getAll = () => request<Course[]>('GET', '/courses');
export const getById = (id: EntityId) =>
  request<Course>('GET', `/courses/${encodeURIComponent(id)}`);
export const update = (id: EntityId, data: Partial<Course>) =>
  request<Course>('PATCH', `/courses/${encodeURIComponent(id)}`, data);
export const create = (data: Partial<Course>) =>
  request<Course>('POST', '/courses', data);
