import { todayStr } from '../../utils/dateUtils';

export const createStreakSlice = (set, get) => ({
  streakFreezes: 0,
  freezeUsedDates: [],
  perfectDaysCount: 0,
  _lastPerfectDayRecorded: null,

  checkAndAwardFreezes: () => {
    const { habits, completions, _lastPerfectDayRecorded, perfectDaysCount, streakFreezes } = get();
    if (!habits.length) return null;
    const today = todayStr();
    const allDone = habits.every(h => completions[h.id]?.[today]);
    if (allDone && _lastPerfectDayRecorded !== today) {
      const newPerfect = (perfectDaysCount || 0) + 1;
      if (newPerfect >= 14) {
        set({ perfectDaysCount: 0, streakFreezes: streakFreezes + 1, _lastPerfectDayRecorded: today });
        return 'freeze_earned';
      } else {
        set({ perfectDaysCount: newPerfect, _lastPerfectDayRecorded: today });
      }
    }
    return null;
  },

  useStreakFreeze: () => {
    const { streakFreezes, freezeUsedDates } = get();
    if (streakFreezes <= 0) return 'no_freezes';
    const today = todayStr();
    if (freezeUsedDates.includes(today)) return 'already_used';
    set({
      streakFreezes: streakFreezes - 1,
      freezeUsedDates: [...freezeUsedDates, today],
    });
    return 'success';
  },
});
