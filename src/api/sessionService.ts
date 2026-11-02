import type { Session, EntityId } from '../types/models';
import { request } from './client';
export const getAll = () =>
  request<Session[]>('GET', '/sessions?_expand=course');
export const getById = (id: EntityId) =>
  request<Session>('GET', `/sessions/${encodeURIComponent(id)}?_expand=course`);
export const update = (id: EntityId, data: Partial<Session>) =>
  request<Session>('PATCH', `/sessions/${encodeURIComponent(id)}`, data);
export const create = (data: Partial<Session>) =>
  request<Session>('POST', '/sessions', data);
