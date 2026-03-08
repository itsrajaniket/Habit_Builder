import React from 'react';
import { CATEGORY_COLORS } from '../../utils/constants';

export default function HabitAnalysisRow({ habit, done, goal, streak, onRemove }) {
  const cat = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.other;
  const pct = goal > 0 ? Math.round((done / goal) * 100) : 0;

  return (
    <div className="py-2.5 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[13px] font-semibold text-white flex-1 truncate">{habit.emoji} {habit.name}</span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
          style={{ background: cat.bg, color: cat.accent }}
        >
          {cat.label.replace(/^[^\s]+\s/, '')}
        </span>
        <button
          onClick={() => onRemove(habit.id)}
          className="shrink-0 w-5 h-5 flex items-center justify-center text-white/20
                     hover:text-red-400 hover:bg-red-400/10 rounded transition-colors text-sm"
        >🗑</button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: cat.accent }}
          />
        </div>
        <span className="text-[11px] text-white/40 shrink-0 w-16 text-right">{done}/{goal} · {pct}%</span>
      </div>

      {/* Streak chain */}
      {streak > 0 && (
        <div className="flex items-center gap-2 mt-1.5">
          <div
            className="h-1 rounded-full transition-all"
            style={{
              width: `${Math.min(100, streak * 4)}%`,
              background: streak > 14 ? '#ff9800' : '#4caf50',
              maxWidth: 100,
              boxShadow: streak > 7 ? `0 0 6px ${streak > 14 ? '#ff9800' : '#4caf50'}` : 'none',
            }}
          />
          <span className="text-[10px] font-semibold text-orange-400">🔥 {streak}-day chain</span>
        </div>
      )}
    </div>
  );
}
