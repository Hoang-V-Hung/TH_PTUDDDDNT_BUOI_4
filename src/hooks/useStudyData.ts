import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import useQueryGroup from './useQueryGroup';
import {
  normalize,
  validateAssignment,
  validateProfile,
} from '../utils/validators';
import { parseLocalDate, isOverdue, formatDate } from '../utils/date';
import {
  dateKey,
  monthKey,
  localDate,
  dayOfWeek,
  calendarCells,
  sessionOnDate,
  moveMonth,
} from '../utils/calendar';
import { calcGpa } from '../utils/gpa';
import { sameId } from '../utils/pending';
import type { EntityId } from '../types/models';
import { errorMessage } from '../utils/errors';

export function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = setInterval(update, 60000);
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') {
        update();
      }
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, []);
  return now;
}
export function useDetailTitle(
  navigation: { setOptions: (options: { title: string }) => void },
  title?: string | number,
) {
  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({ title: String(title) });
    }
  }, [navigation, title]);
}
export function useHomeData() {
  const app = useAppData();
  const now = useNow();
  const semester =
    app.courses.find(course => course.status === 'active')?.semester ||
    app.courses[0]?.semester;
  return {
    ...app,
    query: useQueryGroup(['student', 'courses', 'assignments']),
    activeCourses: app.courses.filter(course => course.semester === semester),
    upcoming: app.assignments.filter(
      assignment =>
        assignment.status !== 'done' &&
        Date.parse(assignment.dueDate) >= now &&
        Date.parse(assignment.dueDate) <= now + 7 * 86400000,
    ),
    overdueCount: app.assignments.filter(assignment =>
      isOverdue(assignment, now),
    ).length,
  };
}
export function useCourseList() {
  const app = useAppData();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');
  const semesters = [...new Set(app.courses.map(course => course.semester))];
  return {
    search,
    setSearch,
    semester,
    setSemester,
    options: [
      { value: 'all', label: 'Tất cả học kỳ' },
      ...semesters.map(value => ({ value, label: value })),
    ],
    courses: app.courses.filter(
      course =>
        (semester === 'all' || course.semester === semester) &&
        normalize(`${course.code} ${course.name}`).includes(normalize(search)),
    ),
    query: app.queries.courses,
  };
}
export function useAssignmentList() {
  const app = useAppData();
  const now = useNow();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  return {
    ...app,
    search,
    setSearch,
    filter,
    setFilter,
    query: useQueryGroup(['assignments', 'courses']),
    items: app.assignments.filter(
      assignment =>
        normalize(
          `${assignment.title} ${assignment.course?.name || ''}`,
        ).includes(normalize(search)) &&
        (filter === 'all' ||
          (filter === 'overdue'
            ? isOverdue(assignment, now)
            : assignment.status === filter)),
    ),
  };
}
export function useScheduleData() {
  const app = useAppData();
  const now = useNow();
  const today = dateKey(new Date(now));
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const day = dayOfWeek(selectedDate);
  const weekCells = calendarCells(selectedDate, 'week', app.sessions, today);
  const setDay = (value: number) => {
    const match = weekCells.find(cell => cell.dayOfWeek === value);
    if (match) {
      setSelectedDate(match.date);
    }
  };
  const date = localDate(selectedDate);
  return {
    day,
    setDay,
    selectedDate,
    setSelectedDate,
    weekCells,
    monthCells: calendarCells(
      monthKey(selectedDate),
      'month',
      app.sessions,
      today,
    ),
    monthLabel: `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`,
    selectedLabel: `${
      selectedDate === today ? 'Hôm nay' : day === 8 ? 'Chủ nhật' : `Thứ ${day}`
    }, ${formatDate(date.getTime())}`,
    moveMonth: (direction: number) =>
      setSelectedDate(value => moveMonth(value, direction)),
    query: useQueryGroup(['sessions', 'courses']),
    sessions: app.sessions
      .filter(session => sessionOnDate(session, selectedDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  };
}
export function useGrades() {
  const app = useAppData();
  const [semester, setSemester] = useState('all');
  const grades = app.grades.filter(
    grade => semester === 'all' || grade.semester === semester,
  );
  const semesters = [...new Set(app.grades.map(grade => grade.semester))];
  return {
    ...app,
    grades,
    semester,
    setSemester,
    summary: calcGpa(grades, app.courses),
    query: useQueryGroup(['grades', 'courses']),
    options: [
      { value: 'all', label: 'Tất cả học kỳ' },
      ...semesters.map(value => ({ value, label: value })),
    ],
  };
}
export function useProfileData() {
  const app = useAppData();
  return {
    ...app,
    query: useQueryGroup(['student', 'grades', 'courses']),
    summary: calcGpa(app.grades, app.courses),
  };
}
export function useAssignmentForm() {
  const app = useAppData();
  const [values, setValues] = useState<{
    title: string;
    courseId: EntityId;
    description: string;
    dueText: string;
  }>({ title: '', courseId: '', description: '', dueText: '' });
  const [errors, setErrors] = useState<ReturnType<typeof validateAssignment>>(
    {},
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const change = <K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) => setValues(current => ({ ...current, [key]: value }));
  async function save(onSaved: () => void) {
    if (saving) {
      return;
    }
    const data = {
      title: values.title.trim(),
      courseId: values.courseId,
      description: values.description.trim(),
      dueDate: parseLocalDate(values.dueText),
    };
    const nextErrors = validateAssignment(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !data.dueDate) {
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      await app.createAssignment({ ...data, dueDate: data.dueDate });
      onSaved();
    } catch (error) {
      setSaveError(errorMessage(error, 'Chưa lưu được bài tập.'));
    } finally {
      setSaving(false);
    }
  }
  return {
    values,
    errors,
    saving,
    saveError,
    change,
    save,
    query: app.queries.courses,
    courseOptions: app.courses.map(course => ({
      value: course.id,
      label: `${course.code} · ${course.name}`,
    })),
  };
}
export function useEditProfile() {
  const app = useAppData();
  const initialized = useRef(false);
  const [values, setValues] = useState({ fullName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<ReturnType<typeof validateProfile>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  useEffect(() => {
    if (app.student && !initialized.current) {
      initialized.current = true;
      const { fullName, email, phone } = app.student;
      setValues({ fullName, email, phone });
    }
  }, [app.student]);
  const change = (key: keyof typeof values, value: string) =>
    setValues(current => ({ ...current, [key]: value }));
  async function save(onSaved: () => void) {
    if (saving) {
      return;
    }
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      await app.updateStudent({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      });
      onSaved();
    } catch (error) {
      setSaveError(errorMessage(error, 'Chưa lưu được thông tin.'));
    } finally {
      setSaving(false);
    }
  }
  return {
    values,
    errors,
    saving,
    saveError,
    change,
    save,
    student: app.student,
    query: app.queries.student,
  };
}
export function useCourseRelated(id: EntityId) {
  const app = useAppData();
  return {
    ...app,
    sessions: app.sessions.filter(session => sameId(session.courseId, id)),
    assignments: app.assignments.filter(assignment =>
      sameId(assignment.courseId, id),
    ),
    query: useQueryGroup(['sessions', 'assignments']),
  };
}
