import React, { useState } from "react";
import useHabitStore from "../../store/habitStore";
import HabitRow from "../habits/HabitRow";
import CheckCell from "./CheckCell";
import DayNotesModal from "./DayNotesModal";
import { fmt, yesterdayStr, todayStr, weekStart } from "../../utils/dateUtils";
import { DAY_NAMES_SHORT, MONTH_NAMES } from "../../utils/constants";

export default function WeekView({
  weekStartStr,
  visibleHabits,
  onRemove,
  onReorder,
}) {
  const freezeUsedDates = useHabitStore((s) => s.freezeUsedDates);
  const dayNotes = useHabitStore((s) => s.dayNotes);
  const [noteDate, setNoteDate] = useState(null);
  const [noteLabel, setNoteLabel] = useState("");
  const [dragSrcId, setDragSrcId] = useState(null);
  const yd = yesterdayStr();
  const td = todayStr();

  const ws = new Date((weekStartStr || weekStart(new Date())) + "T00:00:00");
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ws);
    d.setDate(d.getDate() + i);
    return { date: d, ds: fmt(d.getFullYear(), d.getMonth() + 1, d.getDate()) };
  });

  return (
    <>
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          marginLeft: -2,
          marginRight: -2,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <table
          className="cal-table"
          style={{
            /* 7 day cols × ~44px (comfortable touch) + label col ~100px */
            minWidth: "408px",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th
                className="cal-th-week cal-th-label"
                style={{
                  textAlign: "left",
                  paddingLeft: 8,
                  whiteSpace: "nowrap",
                }}
              >
                My Habits
              </th>
              {days.map(({ ds, date }) => {
                const isToday = ds === td;
                const isYest = ds === yd;
                return (
                  <th
                    key={ds}
                    className="cal-th-week"
                    style={{
                      background: isToday
                        ? "rgba(52,211,153,0.08)"
                        : isYest
                          ? "rgba(245,158,11,0.06)"
                          : undefined,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {/* Day abbreviation */}
                      <span
                        style={{ fontSize: 10, fontWeight: 700, opacity: 0.6 }}
                      >
                        {DAY_NAMES_SHORT[date.getDay()]}
                      </span>
                      {/* Day number */}
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: isToday
                            ? "var(--green)"
                            : isYest
                              ? "var(--orange)"
                              : "var(--text-1)",
                        }}
                      >
                        {date.getDate()}
                      </span>
                      {/* Notes indicator — proper touch-size button */}
                      <button
                        onClick={() => {
                          setNoteDate(ds);
                          setNoteLabel(
                            `${DAY_NAMES_SHORT[date.getDay()]} ${date.getDate()}`,
                          );
                        }}
                        aria-label={`${dayNotes[ds] ? "Edit" : "Add"} note for ${ds}`}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px 4px",
                          minWidth: 24,
                          minHeight: 20,
                          fontSize: 10,
                          opacity: dayNotes[ds] ? 1 : 0.25,
                          transition: "opacity 0.15s",
                          fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = dayNotes[ds]
                            ? "1"
                            : "0.25")
                        }
                      >
                        {dayNotes[ds] ? "📝" : "·"}
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visibleHabits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                onRemove={onRemove}
                onDragStart={() => setDragSrcId(habit.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragSrcId && dragSrcId !== habit.id)
                    onReorder(dragSrcId, habit.id);
                  setDragSrcId(null);
                }}
              >
                {days.map(({ ds, date }) => (
                  <CheckCell
                    key={ds}
                    habitId={habit.id}
                    dateStr={ds}
                    isYesterday={ds === yd}
                    isToday={ds === td}
                    isFrozen={freezeUsedDates.includes(ds)}
                    tipLabel={`${habit.emoji} ${habit.name} — ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`}
                  />
                ))}
              </HabitRow>
            ))}
          </tbody>
        </table>
      </div>

      <DayNotesModal
        dateStr={noteDate}
        label={noteLabel}
        onClose={() => setNoteDate(null)}
      />
    </>
  );
}
