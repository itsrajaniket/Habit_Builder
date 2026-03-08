import useHabitStore from '../../store/habitStore';
import { weekStart, fmt } from '../../utils/dateUtils';

export function useCalendar() {
  const currentMonth      = useHabitStore(s => s.currentMonth);
  const currentYear       = useHabitStore(s => s.currentYear);
  const calendarView      = useHabitStore(s => s.calendarView);
  const currentWeekStart  = useHabitStore(s => s.currentWeekStart);
  const setCalendarView   = useHabitStore(s => s.setCalendarView);
  const setCurrentMonth   = useHabitStore(s => s.setCurrentMonth);
  const setCurrentYear    = useHabitStore(s => s.setCurrentYear);
  const setCurrentWeekStart = useHabitStore(s => s.setCurrentWeekStart);
  const saveUserData      = useHabitStore(s => s.saveUserData);

  const goNext = () => {
    if (calendarView === 'week') {
      const wsStr = currentWeekStart || weekStart(new Date());
      const w = new Date(wsStr + 'T00:00:00');
      w.setDate(w.getDate() + 7);
      setCurrentWeekStart(fmt(w.getFullYear(), w.getMonth() + 1, w.getDate()));
    } else {
      let m = currentMonth + 1, y = currentYear;
      if (m > 11) { m = 0; y++; }
      setCurrentMonth(m); setCurrentYear(y);
    }
    saveUserData();
  };

  const goPrev = () => {
    if (calendarView === 'week') {
      const wsStr = currentWeekStart || weekStart(new Date());
      const w = new Date(wsStr + 'T00:00:00');
      w.setDate(w.getDate() - 7);
      setCurrentWeekStart(fmt(w.getFullYear(), w.getMonth() + 1, w.getDate()));
    } else {
      let m = currentMonth - 1, y = currentYear;
      if (m < 0) { m = 11; y--; }
      setCurrentMonth(m); setCurrentYear(y);
    }
    saveUserData();
  };

  const switchView = (view) => {
    if (view === 'week' && !currentWeekStart) {
      setCurrentWeekStart(weekStart(new Date()));
    }
    setCalendarView(view);
    saveUserData();
  };

  return { currentMonth, currentYear, calendarView, currentWeekStart, goNext, goPrev, switchView };
}
