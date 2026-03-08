import React from "react";
import useHabitStore from "../../store/habitStore";
import { yesterdayStr } from "../../utils/dateUtils";
import { CATEGORY_COLORS } from "../../utils/constants";
import { showToast } from "../../components/ui/Toast";

export default function YesterdayView({ visibleHabits }) {
  const completions = useHabitStore((s) => s.completions);
  const setCompletion = useHabitStore((s) => s.setCompletion);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const yesterday = yesterdayStr();

  const done = visibleHabits.filter(
    (h) => completions[h.id]?.[yesterday],
  ).length;
  const pct = visibleHabits.length
    ? Math.round((done / visibleHabits.length) * 100)
    : 0;

  const toggle = (id) => {
    toggleCompletion(id, yesterday);
    saveUserData();
  };
  const checkAll = () => {
    visibleHabits.forEach((h) => setCompletion(h.id, yesterday, true));
    saveUserData();
    showToast("✅ All yesterday's habits logged!");
  };

  return (
    <div className="flex flex-col gap-3 p-1">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold t1">📅 Log Yesterday</h3>
          <p className="text-xs t3 mt-0.5">
            {yesterday} — retroactive check-in
          </p>
        </div>
        <span
          className="text-xs font-bold flex-shrink-0"
          style={{ color: "var(--orange)" }}
        >
          {done}/{visibleHabits.length} · {pct}%
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1.5 rounded-full progress-track">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#d97706,#f59e0b)",
            boxShadow: pct > 0 ? "0 0 8px rgba(245,158,11,0.4)" : "none",
          }}
        />
      </div>

      {/* ── Habit grid — 1 col on phones, 2 col on wider screens ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
          gap: 6,
        }}
      >
        {visibleHabits.map((h) => {
          const on = !!completions[h.id]?.[yesterday];
          const cat = CATEGORY_COLORS[h.category] || CATEGORY_COLORS.other;
          return (
            <button
              key={h.id}
              onClick={() => toggle(h.id)}
              aria-pressed={on}
              aria-label={`Toggle ${h.name}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.15s",
                background: on ? "rgba(245,158,11,0.10)" : "var(--surface-1)",
                border: `1px solid ${on ? "rgba(245,158,11,0.30)" : "var(--border)"}`,
                borderLeft: `3px solid ${cat.accent}`,
                minHeight: 48,
                textAlign: "left",
                fontFamily: "inherit",
                width: "100%",
              }}
            >
              <div className={`toggle-track shrink-0 ${on ? "on-orange" : ""}`}>
                <div className="toggle-thumb" />
              </div>
              <span
                className="text-sm truncate"
                style={{ color: on ? "var(--orange)" : "var(--text-2)" }}
              >
                {h.emoji} {h.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Check All ── */}
      <button
        onClick={checkAll}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          background: "rgba(245,158,11,0.12)",
          color: "var(--orange)",
          border: "1px solid rgba(245,158,11,0.22)",
          cursor: "pointer",
          transition: "all 0.15s",
          fontFamily: "inherit",
          minHeight: 48,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(245,158,11,0.22)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(245,158,11,0.12)")
        }
      >
        ⚡ Check All Yesterday
      </button>
    </div>
  );
}
