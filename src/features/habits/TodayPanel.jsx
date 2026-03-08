import React from "react";
import useHabitStore from "../../store/habitStore";
import { todayStr } from "../../utils/dateUtils";
import { CATEGORY_COLORS } from "../../utils/constants";
import { showToast } from "../../components/ui/Toast";

export default function TodayPanel({ onClose }) {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const setCompletion = useHabitStore((s) => s.setCompletion);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const today = todayStr();

  const done = habits.filter((h) => completions[h.id]?.[today]).length;
  const pct = habits.length ? Math.round((done / habits.length) * 100) : 0;

  const toggle = (id) => {
    toggleCompletion(id, today);
    saveUserData();
  };
  const checkAll = () => {
    habits.forEach((h) => setCompletion(h.id, today, true));
    saveUserData();
    showToast("🎉 All habits checked for today!");
  };

  return (
    <div className="card rounded-2xl p-4 shadow-xl slide-up">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="min-w-0">
          <span className="text-sm font-bold t1">☀️ Today's Habits</span>
          <span className="ml-2 text-xs t3 hidden xs:inline">{today}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold" style={{ color: "var(--green)" }}>
            {done}/{habits.length} · {pct}%
          </span>
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ width: 36, height: 36, fontSize: 18 }}
            aria-label="Close today panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1.5 rounded-full mb-3 progress-track">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#059669,#34d399)",
            boxShadow: pct > 0 ? "0 0 8px rgba(52,211,153,0.4)" : "none",
          }}
        />
      </div>

      {/* ── Habit toggles ──
          1 column on phones < 480px, 2 columns on larger screens */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
          gap: 6,
          marginBottom: 12,
        }}
      >
        {habits.map((h) => {
          const on = !!completions[h.id]?.[today];
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
                background: on ? "rgba(52,211,153,0.10)" : "var(--surface-1)",
                border: `1px solid ${on ? "rgba(52,211,153,0.30)" : "var(--border)"}`,
                borderLeft: `3px solid ${cat.accent}`,
                /* Accessible touch target */
                minHeight: 48,
                textAlign: "left",
                fontFamily: "inherit",
                width: "100%",
              }}
            >
              {/* Toggle pill */}
              <div className={`toggle-track shrink-0 ${on ? "on" : ""}`}>
                <div className="toggle-thumb" />
              </div>
              <span
                className="text-sm truncate"
                style={{ color: on ? "var(--green)" : "var(--text-2)" }}
              >
                {h.emoji} {h.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="btn-ghost flex-1 rounded-xl text-xs font-semibold"
          style={{ minHeight: 44 }}
        >
          Close
        </button>
        <button
          onClick={checkAll}
          className="flex-1 rounded-xl text-xs font-bold text-black transition-all"
          style={{
            background: "var(--green)",
            boxShadow: "0 0 14px var(--green-glow)",
            border: "none",
            cursor: "pointer",
            minHeight: 44,
            fontFamily: "inherit",
          }}
        >
          ✅ Check All
        </button>
      </div>
    </div>
  );
}
