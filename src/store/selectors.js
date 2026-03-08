// Selector helpers for computed values from store state
import { calcDayPct, calcDayDone, getMonthlyStats } from '../utils/statsCalc';
import { calcStreak, calcBestStreak } from '../utils/streakCalc';

export const selectVisibleHabits = (state) => {
  let h = state.activeBoard === 'all'
    ? state.habits
    : state.habits.filter(x => x.board === state.activeBoard || x.board === 'all');
  if (state.activeCategory !== 'all') h = h.filter(x => x.category === state.activeCategory);
  return h;
};

export const selectMonthlyStats = (state) => {
  return getMonthlyStats(state.currentYear, state.currentMonth, state.habits, state.completions);
};

export const selectBestStreak = (state) => {
  return Math.max(0, ...state.habits.map(h => calcBestStreak(h.id, state.completions, state.freezeUsedDates)));
};
