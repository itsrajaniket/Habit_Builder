import { fmt, daysInMonth } from './dateUtils';
import { calcBestStreak } from './streakCalc';
import { BADGES } from './constants';

export function getTotalCompletions(habits, completions) {
  let t = 0;
  habits.forEach(h => Object.values(completions[h.id] || {}).forEach(v => { if (v) t++; }));
  return t;
}

export function getEarnedBadges(habits, completions, freezeUsedDates = []) {
  const earned = [];
  const tc = getTotalCompletions(habits, completions);
  habits.forEach(h => {
    const s = calcBestStreak(h.id, completions, freezeUsedDates);
    if (tc >= 1 && !earned.includes('first_day')) earned.push('first_day');
    if (s >= 7  && !earned.includes('week_warrior')) earned.push('week_warrior');
    if (s >= 30 && !earned.includes('month_master')) earned.push('month_master');
    if (s >= 50 && !earned.includes('dedication'))   earned.push('dedication');
    if (tc >= 100 && !earned.includes('century'))    earned.push('century');
  });
  const today = new Date();
  let pw = habits.length > 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = fmt(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (!habits.every(h => completions[h.id]?.[ds])) { pw = false; break; }
  }
  if (pw) earned.push('perfect_week');
  if (freezeUsedDates.length > 0) earned.push('freeze_pro');
  return earned;
}

export function calcDayPct(dateStr, visibleHabits, completions) {
  if (!visibleHabits.length) return 0;
  return Math.round(
    (visibleHabits.filter(h => completions[h.id]?.[dateStr]).length / visibleHabits.length) * 100
  );
}

export function calcDayDone(dateStr, visibleHabits, completions) {
  return visibleHabits.filter(h => completions[h.id]?.[dateStr]).length;
}

export function getMonthlyStats(year, month, habits, completions) {
  const dim = daysInMonth(year, month);
  let total = 0;
  const possible = habits.length * dim;
  habits.forEach(h => {
    for (let d = 1; d <= dim; d++) {
      if (completions[h.id]?.[fmt(year, month + 1, d)]) total++;
    }
  });
  const pct = possible > 0 ? Math.round((total / possible) * 100) : 0;
  return { total, possible, pct };
}

export function gradeFromPct(pct) {
  if (pct >= 90) return { g: 'A+', c: '#4ade80' };
  if (pct >= 80) return { g: 'A',  c: '#86efac' };
  if (pct >= 70) return { g: 'B',  c: '#fde047' };
  if (pct >= 60) return { g: 'C',  c: '#fb923c' };
  if (pct >= 50) return { g: 'D',  c: '#f97316' };
  return { g: 'F', c: '#f87171' };
}
