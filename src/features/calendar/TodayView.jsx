import React from 'react';
import useHabitStore from '../../store/habitStore';
import { todayStr } from '../../utils/dateUtils';
import { CATEGORY_COLORS } from '../../utils/constants';
import { useSound } from '../../hooks/useSound';

export default function TodayView({ visibleHabits }) {
  const completions      = useHabitStore(s => s.completions);
  const toggleCompletion = useHabitStore(s => s.toggleCompletion);
  const saveUserData     = useHabitStore(s => s.saveUserData);
  const { playCheck, playUncheck } = useSound();
  const today = todayStr();

  const done = visibleHabits.filter(h => completions[h.id]?.[today]).length;
  const pct  = visibleHabits.length ? Math.round((done / visibleHabits.length) * 100) : 0;

  const handleToggle = (id) => {
    const wasDone = !!completions[id]?.[today];
    toggleCompletion(id, today);
    saveUserData();
    wasDone ? playUncheck() : playCheck();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold t1">☀️ Today's Habits</h3>
        <span className="text-xs font-semibold" style={{ color:'var(--green)' }}>{done}/{visibleHabits.length} — {pct}%</span>
      </div>
      <div className="h-1.5 rounded-full mb-3 progress-track">
        <div className="h-full rounded-full transition-all duration-500"
             style={{ width:`${pct}%`, background:'linear-gradient(90deg,#059669,#34d399)' }} />
      </div>

      {visibleHabits.map(h => {
        const chk = !!completions[h.id]?.[today];
        const cat = CATEGORY_COLORS[h.category] || CATEGORY_COLORS.other;
        return (
          <div key={h.id}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer"
            style={{
              borderLeft: `3px solid ${cat.accent}`,
              background: chk ? 'rgba(52,211,153,0.07)' : 'var(--surface-1)',
              opacity: chk ? 0.7 : 1,
              border: `1px solid ${chk ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`,
              borderLeft: `3px solid ${cat.accent}`,
            }}
            onClick={() => handleToggle(h.id)}
          >
            <span className="text-sm font-medium t1">{h.emoji} {h.name}</span>
            <div className={`today-chk${chk ? ' done pop-anim' : ''}`}
              role="checkbox" aria-checked={chk}>
              {chk ? '✓' : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}
