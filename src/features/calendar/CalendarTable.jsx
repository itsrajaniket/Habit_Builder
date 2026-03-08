import React from 'react';
import useHabitStore from '../../store/habitStore';
import { useCalendar } from './useCalendar';
import MonthView from './MonthView';
import WeekView from './WeekView';
import YesterdayView from './YesterdayView';
import { MONTH_NAMES } from '../../utils/constants';
import { weekStart } from '../../utils/dateUtils';
import { showToast } from '../../components/ui/Toast';

const VIEWS = [
  { key: 'month',     label: 'Month' },
  { key: 'week',      label: 'Week' },
  { key: 'yesterday', label: 'Yesterday' }, // maps to store 'today' view key
];

export default function CalendarTable({ onRemove }) {
  const { currentMonth, currentYear, calendarView, currentWeekStart, goNext, goPrev, switchView } = useCalendar();
  const habits        = useHabitStore(s => s.habits);
  const reorderHabits = useHabitStore(s => s.reorderHabits);
  const saveUserData  = useHabitStore(s => s.saveUserData);
  const activeBoard   = useHabitStore(s => s.activeBoard);
  const activeCategory = useHabitStore(s => s.activeCategory);

  const visibleHabits = useHabitStore(s => {
    const { habits, activeBoard, activeCategory } = s;
    let h = activeBoard === 'all' ? habits : habits.filter(x => x.board === activeBoard || x.board === 'all');
    if (activeCategory !== 'all') h = h.filter(x => x.category === activeCategory);
    return h;
  });

  let title = '';
  if (calendarView === 'week') {
    const wsStr = currentWeekStart || weekStart(new Date());
    const ws = new Date(wsStr + 'T00:00:00');
    title = `Week of ${MONTH_NAMES[ws.getMonth()]} ${ws.getDate()}, ${ws.getFullYear()}`;
  } else if (calendarView === 'today') {
    // "today" store key = Yesterday tab
    const y = new Date(); y.setDate(y.getDate() - 1);
    title = `Yesterday — ${MONTH_NAMES[y.getMonth()]} ${y.getDate()}, ${y.getFullYear()}`;
  } else {
    title = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  }

  const handleReorder = (fromId, toId) => {
    if (activeBoard !== 'all' || activeCategory !== 'all') {
      showToast('⚠️ Clear filters before reordering habits.');
      return;
    }
    reorderHabits(fromId, toId);
    saveUserData();
  };

  const noMatch = !visibleHabits.length && habits.length > 0;
  const isYesterday = calendarView === 'today'; // store key 'today' = Yesterday tab

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-extrabold t1">{title}</h2>

        <div className="flex items-center gap-2">
          {/* Prev/Next hidden for yesterday tab */}
          {!isYesterday && (
            <>
              <button onClick={goPrev} className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-semibold">← Prev</button>
              <button onClick={goNext} className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-semibold">Next →</button>
            </>
          )}

          {/* View switcher */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-hi)' }}>
            {VIEWS.map(v => {
              // Map display key ↔ store key
              const storeKey = v.key === 'yesterday' ? 'today' : v.key;
              const isActive = calendarView === storeKey;
              return (
                <button key={v.key}
                  onClick={() => switchView(storeKey)}
                  className="px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? 'var(--green)' : 'var(--surface-1)',
                    color: isActive ? '#000' : 'var(--text-2)',
                    borderRight: '1px solid var(--border)',
                  }}>
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="overflow-x-auto rounded-xl">
        {noMatch ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-bold t2">No habits match this filter</p>
            <p className="text-xs t3 mt-1">Try a different board or category.</p>
          </div>
        ) : calendarView === 'month' ? (
          <MonthView year={currentYear} month={currentMonth} visibleHabits={visibleHabits} onRemove={onRemove} onReorder={handleReorder} />
        ) : calendarView === 'week' ? (
          <WeekView weekStartStr={currentWeekStart} visibleHabits={visibleHabits} onRemove={onRemove} onReorder={handleReorder} />
        ) : (
          <YesterdayView visibleHabits={visibleHabits} />
        )}
      </div>
    </div>
  );
}
