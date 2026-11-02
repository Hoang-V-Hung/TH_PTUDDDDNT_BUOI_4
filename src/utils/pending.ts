import type { EntityId, OutboxAction } from '../types/models';
export const sameId = (a: EntityId, b: EntityId) => String(a) === String(b);
export const makeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
export function applyPending<T extends { id: EntityId }>(
  resource: string,
  records: T[] | undefined,
  actions: OutboxAction[],
): T[] {
  let result = [...(records || [])];
  actions
    .filter(action => action.resource === resource)
    .forEach(action => {
      const index = result.findIndex(record =>
        sameId(record.id, action.resourceId),
      );
      if (index >= 0) {
        result[index] = { ...result[index], ...action.body };
      } else if (action.method === 'POST') {
        result.push(action.body as T);
      }
    });
  return result;
}
export const isPending = (
  actions: OutboxAction[],
  resource: string,
  id: EntityId,
) =>
  actions.some(
    action => action.resource === resource && sameId(action.resourceId, id),
  );
