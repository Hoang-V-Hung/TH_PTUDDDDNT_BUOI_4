export const normalize = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
export function validateAssignment(
  values: { title: string; courseId: string | number; dueDate: string | null },
  now = Date.now(),
) {
  const errors: Partial<Record<'title' | 'courseId' | 'dueDate', string>> = {};
  if (!values.title.trim()) {
    errors.title = 'Vui lòng nhập tiêu đề bài tập.';
  }
  if (!values.courseId) {
    errors.courseId = 'Vui lòng chọn môn học.';
  }
  if (!values.dueDate || !Number.isFinite(Date.parse(values.dueDate))) {
    errors.dueDate = 'Nhập đúng ngày giờ theo dạng dd/MM/yyyy HH:mm.';
  } else if (Date.parse(values.dueDate) <= Number(now)) {
    errors.dueDate = 'Hạn nộp phải ở tương lai.';
  }
  return errors;
}
export function validateProfile(values: {
  fullName: string;
  email: string;
  phone: string;
}) {
  const errors: Partial<Record<'fullName' | 'email' | 'phone', string>> = {};
  if (!values.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ tên.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Email cần có tên, dấu @ và tên miền.';
  }
  if (!/^\+?[\d\s.-]{9,15}$/.test(values.phone.trim())) {
    errors.phone = 'Số điện thoại cần có 9–15 ký tự số hợp lệ.';
  }
  return errors;
}
