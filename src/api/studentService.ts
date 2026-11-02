import type { Student, EntityId } from '../types/models';
import { request } from './client';
export const getAll = () => request<Student[]>('GET', '/students');
export const getById = (id: EntityId) =>
  request<Student>('GET', `/students/${encodeURIComponent(id)}`);
export const update = (id: EntityId, data: Partial<Student>) =>
  request<Student>('PATCH', `/students/${encodeURIComponent(id)}`, data);
export const create = (data: Partial<Student>) =>
  request<Student>('POST', '/students', data);
