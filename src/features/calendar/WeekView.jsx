import React, { useState } from 'react';
import useHabitStore from '../../store/habitStore';
import HabitRow from '../habits/HabitRow';
import CheckCell from './CheckCell';
import DayNotesModal from './DayNotesModal';
import { fmt, yesterdayStr, weekStart } from '../../utils/dateUtils';
import { DAY_NAMES_SHORT, MONTH_NAMES } from '../../utils/constants';

export default function WeekView({ weekStartStr, visibleHabits, onRemove, onReorder }) {
  const freezeUsedDates = useHabitStore(s => s.freezeUsedDates);
  const dayNotes        = useHabitStore(s => s.dayNotes);
  const [noteDate, setNoteDate]   = useState(null);
  const [noteLabel, setNoteLabel] = useState('');
  const [dragSrcId, setDragSrcId] = useState(null);
  const yd = yesterdayStr();

  const ws   = new Date((weekStartStr || weekStart(new Date())) + 'T00:00:00');
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ws); d.setDate(d.getDate() + i);
    return { date: d, ds: fmt(d.getFullYear(), d.getMonth() + 1, d.getDate()) };
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="cal-table">
          <thead>
            <tr>
              <th className="cal-th-week cal-th-label" style={{ textAlign:'left', paddingLeft:10 }}>My Habits</th>
              {days.map(({ ds, date }) => (
                <th key={ds} className="cal-th-week">
                  {DAY_NAMES_SHORT[date.getDay()]} {date.getDate()}
                  <span className="cursor-pointer ml-1 text-[9px] opacity-50 hover:opacity-100"
                    onClick={() => { setNoteDate(ds); setNoteLabel(`${DAY_NAMES_SHORT[date.getDay()]} ${date.getDate()}`); }}>
                    {dayNotes[ds] ? '📝' : ''}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleHabits.map(habit => (
              <HabitRow key={habit.id} habit={habit} onRemove={onRemove}
                onDragStart={() => setDragSrcId(habit.id)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => { if (dragSrcId && dragSrcId !== habit.id) onReorder(dragSrcId, habit.id); setDragSrcId(null); }}>
                {days.map(({ ds, date }) => (
                  <CheckCell key={ds} habitId={habit.id} dateStr={ds}
                    isYesterday={ds === yd} isFrozen={freezeUsedDates.includes(ds)}
                    tipLabel={`${habit.emoji} ${habit.name} — ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`} />
                ))}
              </HabitRow>
            ))}
          </tbody>
        </table>
      </div>
      <DayNotesModal dateStr={noteDate} label={noteLabel} onClose={() => setNoteDate(null)} />
    </>
  );
}
