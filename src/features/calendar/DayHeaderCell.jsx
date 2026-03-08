import React from 'react';

export default function DayHeaderCell({ dateStr, dayLabel, hasNote, isFrozen, isYesterday, isToday, onOpenNote }) {
  let colClass = '';
  if (isToday)     colClass = ' col-today';
  else if (isYesterday) colClass = ' col-yesterday';
  if (isFrozen)    colClass += ' col-frozen';

  return (
    <th className={`cal-th-day${colClass}`}>
      {dayLabel}
      {isToday && <span style={{ fontSize: 8, marginLeft: 2, opacity: 0.7 }}>●</span>}
      <span className="cursor-pointer ml-0.5 opacity-60 hover:opacity-100 text-[9px]"
            title={hasNote ? 'Has note' : 'Add note'}
            onClick={() => onOpenNote(dateStr, String(dayLabel))}>
        {hasNote ? '📝' : ''}
      </span>
      {isFrozen && <span title="Freeze" className="text-[9px]">🧊</span>}
    </th>
  );
}
