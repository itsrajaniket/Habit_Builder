import React, { useState } from "react";
import useHabitStore from "../../store/habitStore";
import HabitRow from "../habits/HabitRow";
import CheckCell from "./CheckCell";
import DayHeaderCell from "./DayHeaderCell";
import DayNotesModal from "./DayNotesModal";
import {
  fmt,
  daysInMonth,
  yesterdayStr,
  todayStr,
} from "../../utils/dateUtils";
import { MONTH_NAMES, DAY_NAMES_SHORT } from "../../utils/constants";
import { calcDayPct, calcDayDone } from "../../utils/statsCalc";

// Shorter day labels for mobile columns
const DAY_NAMES_MIN = ["S", "M", "T", "W", "T", "F", "S"];

export default function MonthView({
  year,
  month,
  visibleHabits,
  onRemove,
  onReorder,
}) {
  const completions = useHabitStore((s) => s.completions);
  const freezeUsedDates = useHabitStore((s) => s.freezeUsedDates);
  const dayNotes = useHabitStore((s) => s.dayNotes);
  const [noteDate, setNoteDate] = useState(null);
  const [noteLabel, setNoteLabel] = useState("");
  const [dragSrcId, setDragSrcId] = useState(null);

  const yd = yesterdayStr();
  const td = todayStr();
  const firstDay = new Date(year, month, 1).getDay();
  const dim = daysInMonth(year, month);
  const weeks = Math.ceil((firstDay + dim) / 7);

  // Build week grid
  const grid = [];
  let dc = 1;
  for (let w = 0; w < weeks; w++) {
    grid[w] = [];
    for (let d = 0; d < 7; d++) {
      grid[w][d] = (w === 0 && d < firstDay) || dc > dim ? null : dc++;
    }
  }

  const allDates = [];
  grid.forEach((wk) =>
    wk.forEach((day) => allDates.push(day ? fmt(year, month + 1, day) : null)),
  );

  return (
    <>
      {/*
        The outer wrapper allows horizontal scrolling on mobile.
        The table has a minimum width so it never gets crushed.
        On desktop it fills naturally.
      */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          /* Subtle scroll hint on mobile */
          marginLeft: -2,
          marginRight: -2,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <table
          className="cal-table"
          style={{
            /* Minimum so all weeks fit even on a narrow screen.
               Each week col = 7 days × ~26px + label col ~100px */
            minWidth: `${100 + weeks * 7 * 26}px`,
            width: "100%",
          }}
        >
          <thead>
            {/* ── Week group headers ── */}
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
              {Array.from({ length: weeks }, (_, w) => (
                <th key={w} colSpan={7} className="cal-th-week">
                  Wk {w + 1}
                </th>
              ))}
            </tr>

            {/* ── Day-of-week row ── */}
            <tr>
              <th className="cal-th-dow cal-th-label" />
              {Array.from({ length: weeks }, (_, w) =>
                DAY_NAMES_MIN.map((d, di) => (
                  <th
                    key={`${w}-${di}`}
                    className="cal-th-dow"
                    style={{ fontSize: 9 }}
                  >
                    {d}
                  </th>
                )),
              )}
            </tr>

            {/* ── Day numbers ── */}
            <tr className="day-numbers-row">
              <th
                className="cal-th-day cal-th-label"
                style={{ textAlign: "left", paddingLeft: 8 }}
              >
                Day
              </th>
              {grid.map((wk, w) =>
                wk.map((day, d) => {
                  if (!day)
                    return <th key={`${w}-${d}`} className="cal-th-day" />;
                  const ds = fmt(year, month + 1, day);
                  return (
                    <DayHeaderCell
                      key={ds}
                      dateStr={ds}
                      dayLabel={day}
                      hasNote={!!dayNotes[ds]}
                      isFrozen={freezeUsedDates.includes(ds)}
                      isYesterday={ds === yd}
                      isToday={ds === td}
                      onOpenNote={(ds, lbl) => {
                        setNoteDate(ds);
                        setNoteLabel(lbl);
                      }}
                    />
                  );
                }),
              )}
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
                {grid.map((wk, w) =>
                  wk.map((day, d) => {
                    if (!day)
                      return <td key={`${w}-${d}`} className="cal-td" />;
                    const ds = fmt(year, month + 1, day);
                    return (
                      <CheckCell
                        key={ds}
                        habitId={habit.id}
                        dateStr={ds}
                        isYesterday={ds === yd}
                        isToday={ds === td}
                        isFrozen={freezeUsedDates.includes(ds)}
                        tipLabel={`${habit.emoji} ${habit.name} — ${MONTH_NAMES[month]} ${day}`}
                      />
                    );
                  }),
                )}
              </HabitRow>
            ))}

            {/* Summary rows */}
            {[
              {
                label: "%",
                fn: (ds) => calcDayPct(ds, visibleHabits, completions) + "%",
              },
              {
                label: "✓",
                fn: (ds) => calcDayDone(ds, visibleHabits, completions),
              },
              {
                label: "✗",
                fn: (ds) =>
                  visibleHabits.length -
                  calcDayDone(ds, visibleHabits, completions),
              },
            ].map((row) => (
              <tr key={row.label} className="cal-summary">
                <td style={{ paddingLeft: 8 }}>{row.label}</td>
                {allDates.map((ds, i) => (
                  <td key={i} style={{ fontSize: 9 }}>
                    {ds ? row.fn(ds) : ""}
                  </td>
                ))}
              </tr>
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
