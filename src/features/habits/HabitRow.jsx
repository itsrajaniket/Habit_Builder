import React, { memo } from 'react';
import HabitRowHeader from './HabitRowHeader';

const HabitRow = memo(function HabitRow({ habit, onRemove, children, onDragStart, onDragOver, onDrop }) {
  return (
    <tr className="habit-row" draggable="true" data-habit-id={habit.id}
        onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}>
      <HabitRowHeader habit={habit} onRemove={onRemove} />
      {children}
    </tr>
  );
});

export default HabitRow;
