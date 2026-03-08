import React, { useState } from "react";
import InlineEdit from "./InlineEdit";
import MeatballMenu from "./MeatballMenu";
import { CATEGORY_COLORS } from "../../utils/constants";
import useHabitStore from "../../store/habitStore";
import { showToast } from "../../components/ui/Toast";

export default function HabitRowHeader({ habit, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [meatball, setMeatball] = useState(null);
  const renameHabit = useHabitStore((s) => s.renameHabit);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const cat = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.other;

  const handleRename = (name) => {
    renameHabit(habit.id, name);
    saveUserData();
    showToast("✅ Renamed!");
    setEditing(false);
  };

  return (
    <td
      className="cal-td-label"
      style={{ borderLeft: `3px solid ${cat.accent}` }}
    >
      <div
        className="flex items-center gap-1.5 px-2 py-1 group"
        style={{ minHeight: 36 }}
      >
        {/* Drag handle */}
        <span
          className="t3 cursor-grab text-xs select-none shrink-0 transition-colors group-hover:t2"
          aria-hidden="true"
        >
          ⠿
        </span>

        {editing ? (
          <InlineEdit
            value={habit.name}
            onCommit={handleRename}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <span
            className="text-[13px] font-semibold t1 truncate flex-1 cursor-default"
            onDoubleClick={() => setEditing(true)}
            title={`${habit.emoji} ${habit.name} (double-click to rename)`}
          >
            {habit.emoji} {habit.name}
          </span>
        )}

        {/* Meatball button:
            - Desktop: hidden until row hover (opacity-0 group-hover:opacity-100)
            - Touch devices: always visible at 60% opacity (via CSS .habit-meatball rule)
        */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMeatball(e.currentTarget.getBoundingClientRect());
          }}
          className="habit-meatball icon-btn shrink-0 opacity-0 group-hover:opacity-100"
          style={{
            width: 28,
            height: 28,
            fontSize: 16,
            /* Larger invisible tap area on touch */
            padding: 4,
          }}
          aria-label={`Options for ${habit.name}`}
        >
          ⋮
        </button>
      </div>

      {meatball && (
        <MeatballMenu
          anchorRect={meatball}
          onClose={() => setMeatball(null)}
          onRename={() => setEditing(true)}
          onDelete={() => onRemove(habit.id)}
        />
      )}
    </td>
  );
}
