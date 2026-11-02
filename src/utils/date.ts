import type { Assignment } from '../types/models';
const pad = (value: number) => String(value).padStart(2, '0');
export function formatDate(value: string | number, withTime = false) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return 'Chưa có thông tin';
  }
  const day = `${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
  return withTime
    ? `${day}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
    : day;
}
export function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}, ${formatDate(
    value,
  )}`;
}
export const isOverdue = (
  assignment: Pick<Assignment, 'status' | 'dueDate'>,
  now = Date.now(),
) =>
  assignment.status !== 'done' && Date.parse(assignment.dueDate) < Number(now);
export const daysLeft = (value: string, now = Date.now()) =>
  Math.ceil((Date.parse(value) - Number(now)) / 86400000);
export const todayDay = () => ((new Date().getDay() + 6) % 7) + 2;
export function parseLocalDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(
    value.trim(),
  );
  if (!match) {
    return null;
  }
  const [, day, month, year, hour, minute] = match.map(Number);
  const date = new Date(year, month - 1, day, hour, minute);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute
    ? date.toISOString()
    : null;
}
