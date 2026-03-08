export function fmt(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function todayStr() {
  const t = new Date();
  return fmt(t.getFullYear(), t.getMonth() + 1, t.getDate());
}

export function yesterdayStr() {
  const t = new Date();
  t.setDate(t.getDate() - 1);
  return fmt(t.getFullYear(), t.getMonth() + 1, t.getDate());
}

export function daysInMonth(y, m) {
  // m = 0-based
  return new Date(y, m + 1, 0).getDate();
}

export function weekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return fmt(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function parseLocalDate(dateStr) {
  return new Date(dateStr + 'T00:00:00');
}
