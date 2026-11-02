import type { Session } from '../types/models';
import { formatDate } from './date';

export interface CalendarCell {
  date: string;
  day: number;
  dayOfWeek: number;
  inMonth: boolean;
  today: boolean;
  hasSession: boolean;
  label: string;
}
export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
export function localDate(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}
export const dayOfWeek = (key: string) =>
  ((localDate(key).getDay() + 6) % 7) + 2;
export const monthKey = (key: string) => `${key.slice(0, 7)}-01`;
export function moveMonth(key: string, direction: number) {
  const date = localDate(key);
  const target = new Date(
    date.getFullYear(),
    date.getMonth() + direction + 1,
    0,
    12,
  );
  return dateKey(
    new Date(
      target.getFullYear(),
      target.getMonth(),
      Math.min(date.getDate(), target.getDate()),
      12,
    ),
  );
}
export function sessionOnDate(session: Session, key: string) {
  return (
    session.dayOfWeek === dayOfWeek(key) &&
    (!session.startDate || key >= session.startDate) &&
    (!session.endDate || key <= session.endDate)
  );
}
export function calendarCells(
  anchor: string,
  mode: 'week' | 'month',
  sessions: Session[],
  today: string,
): CalendarCell[] {
  const start = localDate(mode === 'month' ? monthKey(anchor) : anchor);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return Array.from({ length: mode === 'month' ? 42 : 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = dateKey(date);
    return {
      date: key,
      day: date.getDate(),
      dayOfWeek: dayOfWeek(key),
      inMonth: key.slice(0, 7) === anchor.slice(0, 7),
      today: key === today,
      hasSession: sessions.some(session => sessionOnDate(session, key)),
      label: `${
        date.getDay() === 0 ? 'Chủ nhật' : `Thứ ${date.getDay() + 1}`
      }, ${formatDate(date.getTime())}`,
    };
  });
}
