import React from 'react';
import useHabitStore from '../../store/habitStore';
import { fmt, daysInMonth } from '../../utils/dateUtils';
import { CATEGORY_COLORS } from '../../utils/constants';

export default function ProgressRings() {
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
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(90px, 1fr))', gap:'20px 12px' }}>
        {visibleHabits.map(h => {
          let done = 0;
          for (let d = 1; d <= elapsed; d++) if (completions[h.id]?.[fmt(year, month+1, d)]) done++;
          const pct  = elapsed > 0 ? Math.round((done / elapsed) * 100) : 0;
          const cat  = CATEGORY_COLORS[h.category] || CATEGORY_COLORS.other;

          let ringColor = cat.accent;
          if (pct === 0) ringColor = 'var(--surface-3)';
          else if (pct < 20) ringColor = '#ef4444'; // Red
          else if (pct < 40) ringColor = '#f97316'; // Orange
          else if (pct < 60) ringColor = '#eab308'; // Yellow
          else if (pct < 80) ringColor = '#3b82f6'; // Blue
          else if (pct < 100) ringColor = '#10b981'; // Emerald
          // At 100% it uses the category's accent color automatically

          const r    = 28, circ = 2 * Math.PI * r;
          const off  = circ * (1 - pct / 100);
          return (
            <div key={h.id} className="flex flex-col items-center gap-2">
              <svg width="68" height="68" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
                <circle cx="36" cy="36" r={r} fill="none" stroke={ringColor} strokeWidth="6"
                  strokeDasharray={circ.toFixed(1)} strokeDashoffset={off.toFixed(1)}
                  strokeLinecap="round" transform="rotate(-90 36 36)"
                  style={{ transition:'stroke-dashoffset 0.7s ease, stroke 0.3s ease' }} />
                <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="800" fill={ringColor}>{pct}%</text>
              </svg>
              {/* Full name, max 2 lines */}
              <p className="text-[11px] text-center leading-tight t2"
                 style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', width:'100%' }}>
                {h.emoji} {h.name}
              </p>
            </div>
          );
        })}
        {!visibleHabits.length && <p className="text-xs t3 text-center py-4" style={{ gridColumn:'1/-1' }}>No habits.</p>}
      </div>
    </div>
  );
}
