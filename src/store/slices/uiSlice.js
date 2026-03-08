import { weekStart, fmt } from '../../utils/dateUtils';

export const createUiSlice = (set, get) => ({
  activeBoard: 'all',
  activeCategory: 'all',
  calendarView: 'month',
  theme: 'dark',
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  currentWeekStart: weekStart(new Date()),
  bestMonthScores: {},

  setActiveBoard:       (b) => set({ activeBoard: b }),
  setActiveCategory:    (c) => set({ activeCategory: c }),
  setCalendarView:      (v) => set({ calendarView: v }),
  setTheme:             (t) => set({ theme: t }),
  setCurrentMonth:      (m) => set({ currentMonth: m }),
  setCurrentYear:       (y) => set({ currentYear: y }),
  setCurrentWeekStart:  (w) => set({ currentWeekStart: w }),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('habitTheme', next);
    set({ theme: next });
  },

  updateBestMonthScore: (monthKey, score) => {
    set(state => ({
      bestMonthScores: { ...state.bestMonthScores, [monthKey]: score },
    }));
  },
});
