import { toScale4, toLetter, calcGpa, calcTotal } from '../src/utils/gpa';
import {
  parseLocalDate,
  formatDate,
  isOverdue,
  daysLeft,
} from '../src/utils/date';
import {
  normalize,
  validateAssignment,
  validateProfile,
} from '../src/utils/validators';
import { applyPending } from '../src/utils/pending';
import db from '../db.json';
import {
  calendarCells,
  dateKey,
  localDate,
  moveMonth,
  sessionOnDate,
} from '../src/utils/calendar';

test.each([
  [10, 4, 'A'],
  [8.5, 4, 'A'],
  [8.4, 3.5, 'B+'],
  [8, 3.5, 'B+'],
  [7.9, 3, 'B'],
  [6.9, 2.5, 'C+'],
  [6.4, 2, 'C'],
  [5.4, 1.5, 'D+'],
  [4.9, 1, 'D'],
  [3.9, 0, 'F'],
])('quy đổi điểm %s', (score, points, letter) => {
  expect(toScale4(score)).toBe(points);
  expect(toLetter(score)).toBe(letter);
});
test('GPA có trọng số; F chỉ bị loại khỏi tín chỉ tích lũy', () => {
  expect(
    calcGpa(
      [
        { courseId: 1, total: 8 },
        { courseId: 2, total: 3 },
      ],
      [
        { id: 1, credits: 3 },
        { id: 2, credits: 2 },
      ],
    ),
  ).toEqual({ gpa: 2.1, totalCredits: 3 });
  expect(calcGpa([], [])).toEqual({ gpa: 0, totalCredits: 0 });
});
test('db đủ 5 bản ghi mỗi tập, liên kết đúng và điểm tổng đúng trọng số', () => {
  Object.values(db).forEach(records =>
    expect(records.length).toBeGreaterThanOrEqual(5),
  );
  [...db.assignments, ...db.sessions, ...db.grades].forEach(record =>
    expect(db.courses.some(course => course.id === record.courseId)).toBe(true),
  );
  db.grades.forEach(grade => {
    expect(grade.total).toBe(calcTotal(grade));
    expect(grade.letter).toBe(toLetter(grade.total));
  });
  db.sessions.forEach(session => {
    expect(session.dayOfWeek).toBeGreaterThanOrEqual(2);
    expect(session.dayOfWeek).toBeLessThanOrEqual(8);
  });
});
test('ngày giờ Việt Nam và kiểm tra ngày không hợp lệ', () => {
  expect(parseLocalDate('31/02/2026 10:30')).toBeNull();
  expect(parseLocalDate('09/11/2026 25:00')).toBeNull();
  const parsed = parseLocalDate('09/11/2026 23:59');
  expect(formatDate(parsed, true)).toBe('09/11/2026, 23:59');
  expect(
    isOverdue(
      { dueDate: '2026-01-01', status: 'todo' },
      Date.parse('2026-02-01'),
    ),
  ).toBe(true);
  expect(isOverdue({ dueDate: '2026-01-01', status: 'done' })).toBe(false);
  expect(daysLeft('2026-11-09', Date.parse('2026-11-07'))).toBe(2);
});
test('form chặn tiêu đề rỗng, ngày quá khứ, email sai', () => {
  expect(
    validateAssignment({ title: ' ', courseId: '', dueDate: '2020-01-01' }),
  ).toHaveProperty('title');
  expect(
    validateAssignment({
      title: 'Bài tập',
      courseId: 'course',
      dueDate: '2020-01-01',
    }),
  ).toHaveProperty('dueDate');
  expect(
    validateAssignment({
      title: 'Bài tập',
      courseId: 'course',
      dueDate: '2099-01-01',
    }),
  ).toEqual({});
  expect(
    validateProfile({ fullName: 'An', email: 'sai', phone: '0912345678' }),
  ).toHaveProperty('email');
  expect(normalize('Lập trình Đa nền tảng')).toBe('lap trinh da nen tang');
});
test('ghi đè cache bằng các thao tác offline đúng thứ tự', () => {
  const pending = [
    {
      resource: 'assignments',
      resourceId: 'new',
      method: 'POST',
      body: { id: 'new', status: 'todo' },
    },
    {
      resource: 'assignments',
      resourceId: 'new',
      method: 'PATCH',
      body: { status: 'done' },
    },
  ];
  expect(applyPending('assignments', [], pending)).toEqual([
    { id: 'new', status: 'done' },
  ]);
});

test('lịch tháng đủ 6 tuần, bắt đầu thứ Hai và khớp ngày ở hai đầu tháng', () => {
  const cells = calendarCells('2026-11-02', 'month', db.sessions, '2026-11-02');
  expect(cells).toHaveLength(42);
  expect(cells[0].date).toBe('2026-10-26');
  expect(cells[41].date).toBe('2026-12-06');
  expect(cells.find(cell => cell.date === '2026-11-02')).toMatchObject({
    dayOfWeek: 2,
    inMonth: true,
    today: true,
    hasSession: true,
  });
  expect(cells.filter(cell => cell.inMonth)).toHaveLength(30);
});
test('đổi tháng giữ ngày hợp lệ, xử lý năm nhuận và chuyển năm', () => {
  expect(moveMonth('2026-01-31', 1)).toBe('2026-02-28');
  expect(moveMonth('2028-01-31', 1)).toBe('2028-02-29');
  expect(moveMonth('2026-12-31', 1)).toBe('2027-01-31');
  expect(moveMonth('2026-01-01', -1)).toBe('2025-12-01');
  expect(dateKey(localDate('2026-11-02'))).toBe('2026-11-02');
});
test('chấm lịch và danh sách chỉ dùng buổi học đã có trong khoảng học kỳ', () => {
  const session = db.sessions[0];
  expect(sessionOnDate(session, '2026-11-02')).toBe(true);
  expect(sessionOnDate(session, '2026-11-03')).toBe(false);
  expect(sessionOnDate(session, '2027-02-01')).toBe(false);
  expect(
    calendarCells('2027-02-01', 'week', db.sessions, '2027-02-01').every(
      cell => !cell.hasSession,
    ),
  ).toBe(true);
});
