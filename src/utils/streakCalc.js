import { fmt, todayStr } from './dateUtils';

export function calcStreak(habitId, completions, freezeUsedDates = []) {
  let streak = 0;
  let cur = new Date();
  const todayDs = todayStr();
  const todayDone = !!completions[habitId]?.[todayDs] || freezeUsedDates.includes(todayDs);
  if (!todayDone) cur.setDate(cur.getDate() - 1);
  while (streak < 3650) {
    const ds = fmt(cur.getFullYear(), cur.getMonth() + 1, cur.getDate());
    if (completions[habitId]?.[ds] || freezeUsedDates.includes(ds)) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else break;
  }
  return streak;
}

export function calcBestStreak(habitId, completions, freezeUsedDates = []) {
  const completionDates = Object.keys(completions[habitId] || {}).filter(d => completions[habitId][d]);
  const allDates = Array.from(new Set([...completionDates, ...freezeUsedDates]))
    .sort((a, b) => new Date(a) - new Date(b));
  let max = 0, cur = 0, prev = null;
  allDates.forEach(ds => {
    const d = new Date(ds + 'T12:00:00');
    if (prev) {
      const prevNoon = new Date(prev + 'T12:00:00');
      const diff = Math.round((d - prevNoon) / 86400000);
      cur = diff === 1 ? cur + 1 : 1;
    } else cur = 1;
    max = Math.max(max, cur);
    prev = ds;
  });
  return max;
}
