import React from 'react';
import useHabitStore from '../../store/habitStore';
import { fmt, daysInMonth } from '../../utils/dateUtils';
import { calcBestStreak } from '../../utils/streakCalc';
import { MONTH_NAMES } from '../../utils/constants';

export function useShareData() {
  const habits          = useHabitStore(s => s.habits);
  const completions     = useHabitStore(s => s.completions);
  const freezeUsedDates = useHabitStore(s => s.freezeUsedDates);
  const year            = useHabitStore(s => s.currentYear);
  const month           = useHabitStore(s => s.currentMonth);
  const currentUser     = useHabitStore(s => s.currentUser);

  const dim = daysInMonth(year, month);
  let total = 0;
  habits.forEach(h => {
    for (let d = 1; d <= dim; d++) {
      if (completions[h.id]?.[fmt(year, month + 1, d)]) total++;
    }
  });
  const possible  = habits.length * dim;
  const pct       = possible > 0 ? Math.round((total / possible) * 100) : 0;
  const maxStreak = Math.max(0, ...habits.map(h => calcBestStreak(h.id, completions, freezeUsedDates)));

  return { currentUser, year, month, pct, total, possible, maxStreak };
}

export default function ShareCard() {
  const { currentUser, year, month, pct, total, possible, maxStreak } = useShareData();

  return (
    <div id="shareCard"
      className="rounded-xl p-5 text-white"
      style={{ background: 'linear-gradient(135deg, #1a237e, #283593)' }}
    >
      <p className="text-xs font-bold text-blue-300 mb-1">🎯 Habit Builder Kit</p>
      {currentUser && <p className="text-xs text-white/60">{currentUser.toUpperCase()}</p>}
      <p className="text-xs text-blue-200 mt-0.5">{MONTH_NAMES[month]} {year}</p>
      <p className="text-5xl font-black my-3">{pct}%</p>
      <p className="text-xs text-white/70">{total} / {possible} habits completed</p>
      {maxStreak > 0 && (
        <p className="text-xs text-yellow-400 font-semibold mt-1">🔥 Best Streak: {maxStreak} days</p>
      )}
    </div>
  );
}
