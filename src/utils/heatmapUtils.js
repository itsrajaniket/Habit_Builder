import { fmt } from './dateUtils';
import { MONTH_NAMES } from './constants';

export function buildHeatmapData(habits, completions, getActiveHabitCountOnDate) {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  const startDow = startDate.getDay();
  const cells = [];
  for (let p = 0; p < startDow; p++) cells.push(null);
  let cellDate = new Date(startDate);
  while (cellDate <= today) {
    const ds = fmt(cellDate.getFullYear(), cellDate.getMonth() + 1, cellDate.getDate());
    let done = 0;
    habits.forEach(h => { if (completions[h.id]?.[ds]) done++; });
    const activeCount = getActiveHabitCountOnDate(ds) || 1;
    const pct = done / activeCount;
    const level = done === 0 ? 0 : pct < 0.25 ? 1 : pct < 0.5 ? 2 : pct < 0.75 ? 3 : 4;
    cells.push({ ds, done, activeCount, level });
    const next = new Date(cellDate);
    next.setDate(next.getDate() + 1);
    cellDate = next;
  }
  const totalCols = Math.ceil(cells.length / 7);
  const monthCols = {};
  cells.forEach((c, i) => {
    if (!c) return;
    const d = new Date(c.ds + 'T00:00:00');
    const col = Math.floor(i / 7);
    if (d.getDate() === 1 && !monthCols[col]) {
      monthCols[col] = MONTH_NAMES[d.getMonth()].slice(0, 3);
    }
  });
  return { cells, totalCols, monthCols };
}
