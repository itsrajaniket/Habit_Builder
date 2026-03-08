import React from 'react';
import useHabitStore from '../../store/habitStore';
import { buildDowData } from '../../utils/dowUtils';
import { DAY_NAMES_3 } from '../../utils/constants';

export default function DayOfWeekChart() {
  const habits      = useHabitStore(s => s.habits);
  const completions = useHabitStore(s => s.completions);
  const activeBoard = useHabitStore(s => s.activeBoard);
  const avgs = buildDowData(habits, completions, activeBoard);
  const max  = Math.max(...avgs, 1);

  return (
    <div className="card rounded-2xl p-5">
      <h3 className="text-xs font-bold t2 uppercase tracking-widest mb-4">📊 Best Day of Week</h3>
      <div className="flex flex-col gap-3">
        {DAY_NAMES_3.map((name, i) => {
          const pct    = avgs[i];
          const barPct = Math.round((pct / max) * 100);
          const isTop  = pct === max && pct > 0;
          return (
            <div key={name} className="flex items-center gap-3">
              <span className="w-8 text-xs font-semibold shrink-0"
                    style={{ color: isTop ? 'var(--orange)' : 'var(--text-2)' }}>{name}</span>
              <div className="flex-1 h-2 rounded-full" style={{ background:'var(--surface-2)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width:`${barPct}%`, background: isTop ? 'var(--orange)' : 'var(--green)' }} />
              </div>
              <span className="text-xs font-bold w-12 text-right shrink-0"
                    style={{ color: isTop ? 'var(--orange)' : 'var(--text-2)' }}>
                {pct}%{isTop ? ' 🏆' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
