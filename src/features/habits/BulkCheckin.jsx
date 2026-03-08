import React from 'react';
import useHabitStore from '../../store/habitStore';
import { yesterdayStr } from '../../utils/dateUtils';
import { CATEGORY_COLORS } from '../../utils/constants';
import { showToast } from '../../components/ui/Toast';

// BulkCheckin is no longer shown in the main bar — YesterdayView in CalendarTable replaces it.
// Keeping this file so it can still be imported without breaking anything.
export default function BulkCheckin({ onClose }) {
  const habits        = useHabitStore(s => s.habits);
  const completions   = useHabitStore(s => s.completions);
  const setCompletion = useHabitStore(s => s.setCompletion);
  const toggleCompletion = useHabitStore(s => s.toggleCompletion);
  const saveUserData  = useHabitStore(s => s.saveUserData);
  const yesterday     = yesterdayStr();

  const done = habits.filter(h => completions[h.id]?.[yesterday]).length;
  const pct  = habits.length ? Math.round((done / habits.length) * 100) : 0;

  const toggle   = (id) => { toggleCompletion(id, yesterday); saveUserData(); };
  const checkAll = () => { habits.forEach(h => setCompletion(h.id, yesterday, true)); saveUserData(); showToast("✅ All checked!"); };

  return (
    <div className="card rounded-2xl p-4 shadow-xl slide-up">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-bold t1">⚡ Log Yesterday</span>
          <span className="ml-2 text-xs t3">{yesterday}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: 'var(--orange)' }}>{done}/{habits.length} · {pct}%</span>
          <button onClick={onClose} className="icon-btn w-7 h-7">✕</button>
        </div>
      </div>

      <div className="h-1.5 rounded-full mb-3 progress-track">
        <div className="h-full rounded-full transition-all duration-500"
             style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#d97706,#f59e0b)' }} />
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {habits.map(h => {
          const on  = !!completions[h.id]?.[yesterday];
          const cat = CATEGORY_COLORS[h.category] || CATEGORY_COLORS.other;
          return (
            <div key={h.id} onClick={() => toggle(h.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm"
              style={{
                background: on ? 'rgba(245,158,11,0.10)' : 'var(--surface-1)',
                border: `1px solid ${on ? 'rgba(245,158,11,0.30)' : 'var(--border)'}`,
                borderLeft: `3px solid ${cat.accent}`,
              }}>
              <div className={`toggle-track shrink-0 ${on ? 'on-orange' : ''}`}>
                <div className="toggle-thumb" />
              </div>
              <span className="truncate" style={{ color: on ? 'var(--orange)' : 'var(--text-2)' }}>
                {h.emoji} {h.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={onClose} className="btn-ghost flex-1 py-2 rounded-xl text-xs font-semibold">Done</button>
        <button onClick={checkAll}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-black"
          style={{ background: 'var(--orange)' }}>
          ⚡ Check All
        </button>
      </div>
    </div>
  );
}
