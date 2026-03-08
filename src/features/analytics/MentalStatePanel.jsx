import React, { useState } from "react";
import useHabitStore from "../../store/habitStore";
import MoodPickerPopover from "./MoodPickerPopover";
import MentalChart from "./MentalChart";
import { fmt, daysInMonth, weekStart } from "../../utils/dateUtils";
import { MOOD_EMOJIS } from "../../utils/constants";

const MOT_COLORS = [
  "",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#a855f7",
];

const CHART_MODES = [
  { value: "both", label: "Both", color: "var(--green)" },
  { value: "mood", label: "Mood", color: "var(--purple)" },
  { value: "motivation", label: "Motivation", color: "var(--green)" },
];

export default function MentalStatePanel() {
  const mentalState = useHabitStore((s) => s.mentalState);
  const setMood = useHabitStore((s) => s.setMood);
  const setMotivation = useHabitStore((s) => s.setMotivation);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const year = useHabitStore((s) => s.currentYear);
  const month = useHabitStore((s) => s.currentMonth);
  const calendarView = useHabitStore((s) => s.calendarView);
  const currentWeekStart = useHabitStore((s) => s.currentWeekStart);

  const [moodPicker, setMoodPicker] = useState(null);
  const [motPicker, setMotPicker] = useState(null);
  const [chartMode, setChartMode] = useState("both");

  // Build day list
  let days = [];
  if (calendarView === "week") {
    const ws = new Date(
      (currentWeekStart || weekStart(new Date())) + "T00:00:00",
    );
    for (let i = 0; i < 7; i++) {
      const d = new Date(ws);
      d.setDate(d.getDate() + i);
      days.push({
        d: d.getDate(),
        ds: fmt(d.getFullYear(), d.getMonth() + 1, d.getDate()),
      });
    }
  } else {
    const dim = daysInMonth(year, month);
    for (let d = 1; d <= dim; d++)
      days.push({ d, ds: fmt(year, month + 1, d) });
  }

  const cellBase = {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.13s",
    border: "1px solid var(--border)",
    background: "var(--surface-1)",
    /* Minimum 44px touch target (extended by padding below) */
  };

  return (
    <div className="p-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-xs font-bold t2 uppercase tracking-widest">
            🧠 Mental State
          </h3>
          {/* Hint hidden on very small screens to save space */}
          <span className="text-[10px] t3 hidden xs:inline">
            tap mood · tap number for motivation
          </span>
        </div>
      </div>

      {/* ── Scrollable grid ── */}
      <div
        className="mental-state-table-wrap"
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          paddingBottom: 4,
        }}
      >
        <table
          style={{
            borderSpacing: "3px 4px",
            borderCollapse: "separate",
            fontSize: 12,
          }}
        >
          <tbody>
            {/* Day numbers */}
            <tr>
              <td
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-3)",
                  paddingRight: 10,
                  whiteSpace: "nowrap",
                  /* Sticky so the label stays visible when scrolling */
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  background: "var(--bg-card)",
                }}
              >
                Day
              </td>
              {days.map(({ d }) => (
                <td
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text-3)",
                    minWidth: 28,
                  }}
                >
                  {d}
                </td>
              ))}
            </tr>

            {/* Mood row */}
            <tr>
              <td
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--purple)",
                  paddingRight: 10,
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  background: "var(--bg-card)",
                }}
              >
                Mood
              </td>
              {days.map(({ ds }) => {
                const val = mentalState.mood[ds];
                return (
                  <td key={ds} style={{ padding: "1px" }}>
                    <button
                      data-mood-date={ds}
                      style={{
                        ...cellBase,
                        fontSize: 16,
                        padding: 0,
                        border: "none",
                      }}
                      onClick={() => {
                        const el = document.querySelector(
                          `[data-mood-date="${ds}"]`,
                        );
                        setMoodPicker({
                          dateStr: ds,
                          rect: el?.getBoundingClientRect(),
                        });
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(167,139,250,0.18)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "var(--surface-1)")
                      }
                      aria-label={`Set mood for day ${ds}`}
                    >
                      {val != null ? (
                        MOOD_EMOJIS[val - 1] || val
                      ) : (
                        <span style={{ color: "var(--text-3)", fontSize: 14 }}>
                          ·
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>

            {/* Motivation row */}
            <tr>
              <td
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--green)",
                  paddingRight: 10,
                  whiteSpace: "nowrap",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  background: "var(--bg-card)",
                }}
              >
                Mot.
              </td>
              {days.map(({ d, ds }) => {
                const val = mentalState.motivation[ds];
                return (
                  <td key={ds} style={{ padding: "1px" }}>
                    <button
                      style={{
                        ...cellBase,
                        fontSize: 11,
                        fontWeight: 700,
                        color: val != null ? MOT_COLORS[val] : "var(--text-3)",
                        padding: 0,
                        border: "1px solid var(--border)",
                      }}
                      onClick={() => setMotPicker({ dateStr: ds, day: d })}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(52,211,153,0.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "var(--surface-1)")
                      }
                      aria-label={`Set motivation for day ${ds}`}
                    >
                      {val ?? "·"}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Chart toggle + chart */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-[10px] font-bold t3 uppercase tracking-widest">
            Graph View
          </span>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--border-hi)" }}
          >
            {CHART_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setChartMode(m.value)}
                style={{
                  padding: "6px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  transition: "all 0.15s",
                  background:
                    chartMode === m.value ? "var(--surface-3)" : "transparent",
                  color: chartMode === m.value ? m.color : "var(--text-3)",
                  borderRight: "1px solid var(--border)",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 36,
                  fontFamily: "inherit",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-2 flex-wrap">
          {(chartMode === "mood" || chartMode === "both") && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "rgba(167,139,250,0.85)", flexShrink: 0 }}
              />
              <span className="text-[10px] t3">Mood</span>
            </div>
          )}
          {(chartMode === "motivation" || chartMode === "both") && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "rgba(52,211,153,0.85)", flexShrink: 0 }}
              />
              <span className="text-[10px] t3">Motivation</span>
            </div>
          )}
        </div>

        <MentalChart mode={chartMode} />
      </div>

      {/* Mood picker popover */}
      {moodPicker && (
        <MoodPickerPopover
          dateStr={moodPicker.dateStr}
          anchorRect={moodPicker.rect}
          onSelect={(ds, v) => {
            setMood(ds, v);
            saveUserData();
            setMoodPicker(null);
          }}
          onClose={() => setMoodPicker(null)}
        />
      )}

      {/* Motivation picker — modal on both desktop and mobile (full-overlay for safe area) */}
      {motPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onClick={() => setMotPicker(null)}
        >
          <div
            className="rounded-t-2xl md:rounded-2xl p-5 shadow-2xl slide-up w-full md:max-w-xs"
            style={{
              background: "var(--bg-card-hi)",
              border: "1px solid var(--border-hi)",
              paddingBottom: "max(20px, env(safe-area-inset-bottom))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center mb-3 md:hidden">
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 99,
                  background: "var(--border-hi)",
                }}
              />
            </div>

            <p className="text-sm font-bold t1 mb-1">
              Day {motPicker.day} — Motivation
            </p>
            <p className="text-[10px] t3 mb-4">
              Rate from 1 (low) to 10 (high)
            </p>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                const active = mentalState.motivation[motPicker.dateStr] === n;
                return (
                  <button
                    key={n}
                    style={{
                      width: "100%",
                      height: 48,
                      background: active ? MOT_COLORS[n] : "var(--surface-2)",
                      color: active ? "#fff" : "var(--text-2)",
                      transform: active ? "scale(1.1)" : "scale(1)",
                      border: `1px solid ${active ? MOT_COLORS[n] : "var(--border)"}`,
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                    onClick={() => {
                      setMotivation(motPicker.dateStr, n);
                      saveUserData();
                      setMotPicker(null);
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
