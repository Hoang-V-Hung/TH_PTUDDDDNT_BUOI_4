import type { Course, Grade } from '../types/models';
const scale: [number, string, number][] = [
  [8.5, 'A', 4],
  [8, 'B+', 3.5],
  [7, 'B', 3],
  [6.5, 'C+', 2.5],
  [5.5, 'C', 2],
  [5, 'D+', 1.5],
  [4, 'D', 1],
  [0, 'F', 0],
];
export const toScale4 = (score10: number) =>
  scale.find(([minimum]) => Number(score10) >= minimum)?.[2] ?? 0;
export const toLetter = (score10: number) =>
  scale.find(([minimum]) => Number(score10) >= minimum)?.[1] ?? 'F';
export const calcTotal = (
  grade: Pick<Grade, 'attendance' | 'midterm' | 'final'>,
) =>
  Math.round(
    (grade.attendance * 0.1 + grade.midterm * 0.3 + grade.final * 0.6) * 100,
  ) / 100;
export function calcGpa(grades: Grade[], courses: Course[]) {
  let weighted = 0;
  let credits = 0;
  let totalCredits = 0;
  grades.forEach(grade => {
    const course =
      courses.find(item => String(item.id) === String(grade.courseId)) ||
      grade.course;
    const count = Number(course?.credits || 0);
    const points = toScale4(grade.total);
    weighted += points * count;
    credits += count;
    if (points > 0) {
      totalCredits += count;
    }
  });
  return { gpa: credits ? weighted / credits : 0, totalCredits };
}
