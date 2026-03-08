import { fmt } from './dateUtils';

export function buildDowData(habits, completions, activeBoard) {
  const totals = new Array(7).fill(0);
  const counts = new Array(7).fill(0);
  const filtered = activeBoard === 'all'
    ? habits
    : habits.filter(h => h.board === activeBoard || h.board === 'all');
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const ds = fmt(d.getFullYear(), d.getMonth() + 1, d.getDate());
    let done = 0;
    filtered.forEach(h => { if (completions[h.id]?.[ds]) done++; });
    if (filtered.length > 0) {
      totals[dow] += (done / filtered.length) * 100;
      counts[dow]++;
    }
  }
  return totals.map((t, i) => counts[i] > 0 ? Math.round(t / counts[i]) : 0);
}
