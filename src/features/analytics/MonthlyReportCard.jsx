import React from 'react';
import useHabitStore from '../../store/habitStore';
import { fmt, daysInMonth } from '../../utils/dateUtils';
import { gradeFromPct } from '../../utils/statsCalc';

export default function MonthlyReportCard() {
  const completions   = useHabitStore(s => s.completions);
  const year          = useHabitStore(s => s.currentYear);
  const month         = useHabitStore(s => s.currentMonth);
  const visibleHabits = useHabitStore(s => {
    const { habits, activeBoard, activeCategory } = s;
    let h = activeBoard === 'all' ? habits : habits.filter(x => x.board === activeBoard || x.board === 'all');
    if (activeCategory !== 'all') h = h.filter(x => x.category === activeCategory);
    return h;
  });

  const today     = new Date();
  const isCurrent = today.getMonth() === month && today.getFullYear() === year;
  const elapsed   = isCurrent ? today.getDate() : daysInMonth(year, month);

  return (
    <div className="card rounded-2xl p-5">
      <h3 className="text-xs font-bold t2 uppercase tracking-widest mb-3">📋 Monthly Report Card</h3>

      <div className="grid text-[10px] font-bold uppercase tracking-wider t3 pb-1.5 mb-1"
           style={{ gridTemplateColumns:'1fr 40px 40px 28px', borderBottom:'1px solid var(--border)', gap:8 }}>
        <span>Habit</span><span>Done</span><span>Rate</span><span>Grade</span>
      </div>

      {visibleHabits.map(h => {
        let done = 0;
        for (let d = 1; d <= elapsed; d++) if (completions[h.id]?.[fmt(year, month+1, d)]) done++;
        const pct = elapsed > 0 ? Math.round((done / elapsed) * 100) : 0;
        const { g, c } = gradeFromPct(pct);
        return (
          <div key={h.id} className="grid items-center py-2"
               style={{ gridTemplateColumns:'1fr 40px 40px 28px', gap:8, borderBottom:'1px solid var(--border)' }}>
            <span className="text-xs t1 truncate">{h.emoji} {h.name}</span>
            <span className="text-xs t3">{done}/{elapsed}</span>
            <span className="text-xs t2 font-medium">{pct}%</span>
            <span className="text-sm font-black" style={{ color: c }}>{g}</span>
          </div>
        );
      })}
      {!visibleHabits.length && <p className="text-xs t3 py-4 text-center">No habits to grade.</p>}
    </div>
  );
}
