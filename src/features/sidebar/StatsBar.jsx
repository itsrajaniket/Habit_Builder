import React from "react";
import useHabitStore from "../../store/habitStore";
import { fmt, daysInMonth } from "../../utils/dateUtils";
import { calcBestStreak } from "../../utils/streakCalc";

export default function StatsBar() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const year = useHabitStore((s) => s.currentYear);
  const month = useHabitStore((s) => s.currentMonth);
  const streakFreezes = useHabitStore((s) => s.streakFreezes);
  const freezeUsedDates = useHabitStore((s) => s.freezeUsedDates);

  const dim = daysInMonth(year, month);
  let total = 0;
  habits.forEach((h) => {
    for (let d = 1; d <= dim; d++) {
      if (completions[h.id]?.[fmt(year, month + 1, d)]) total++;
    }
  });
  const possible = habits.length * dim;
  const pct = possible > 0 ? Math.round((total / possible) * 100) : 0;
  const bestStreak = Math.max(
    0,
    ...habits.map((h) => calcBestStreak(h.id, completions, freezeUsedDates)),
  );

  const stats = [
    { v: habits.length, l: "Habits", c: "var(--blue)" },
    { v: total, l: "Completed", c: "var(--green)" },
    { v: `${bestStreak}d`, l: "🔥 Streak", c: "var(--orange)" },
    { v: streakFreezes, l: "🧊 Freezes", c: "#67e8f9" },
  ];

  return (
    <div className="card rounded-2xl p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest t3 mb-3">
        📊 Dashboard
      </p>

      {/* 2×2 grid — works on all screen sizes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {stats.map(({ v, l, c }) => (
          <div
            key={l}
            className="card-hi rounded-xl"
            style={{ padding: "10px 12px" }}
          >
            <div
              style={{
                fontSize: "clamp(18px, 5vw, 24px)",
                fontWeight: 900,
                lineHeight: 1,
                color: c,
              }}
            >
              {v}
            </div>
            <div
              className="t3 font-semibold uppercase tracking-wide"
              style={{ fontSize: 9, marginTop: 4 }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs t2 font-medium">Monthly Progress</span>
          <span className="text-sm font-bold" style={{ color: "var(--green)" }}>
            {pct}%
          </span>
        </div>
        <div
          className="h-2 rounded-full"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#059669,#34d399)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
