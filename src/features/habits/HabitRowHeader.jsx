import React, { useState } from 'react';
import InlineEdit from './InlineEdit';
import MeatballMenu from './MeatballMenu';
import { CATEGORY_COLORS } from '../../utils/constants';
import useHabitStore from '../../store/habitStore';
import { showToast } from '../../components/ui/Toast';

export default function HabitRowHeader({ habit, onRemove }) {
  const [editing, setEditing]   = useState(false);
  const [meatball, setMeatball] = useState(null);
  const renameHabit  = useHabitStore(s => s.renameHabit);
  const saveUserData = useHabitStore(s => s.saveUserData);
  const cat = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.other;

  const handleRename = (name) => { renameHabit(habit.id, name); saveUserData(); showToast('✅ Renamed!'); setEditing(false); };

  return (
    <td className="cal-td-label" style={{ borderLeft: `3px solid ${cat.accent}` }}>
      <div className="flex items-center gap-1 px-1 py-1 group">
        <span className="t3 cursor-grab text-xs select-none shrink-0 transition-colors group-hover:t2">⠿</span>

        {editing ? (
          <InlineEdit value={habit.name} onCommit={handleRename} onCancel={() => setEditing(false)} />
        ) : (
          <span className="text-[13px] font-semibold t1 truncate flex-1 cursor-default"
                onDoubleClick={() => setEditing(true)}
                title={`${habit.emoji} ${habit.name} (double-click to rename)`}>
            {habit.emoji} {habit.name}
          </span>
        )}

        <button
          onClick={e => { e.stopPropagation(); setMeatball(e.currentTarget.getBoundingClientRect()); }}
          className="icon-btn shrink-0 w-5 h-5 opacity-0 group-hover:opacity-100 text-sm"
        >⋮</button>
      </div>

      {meatball && (
        <MeatballMenu anchorRect={meatball} onClose={() => setMeatball(null)}
          onRename={() => setEditing(true)} onDelete={() => onRemove(habit.id)} />
      )}
    </td>
  );
}
