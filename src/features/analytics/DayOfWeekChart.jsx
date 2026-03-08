import React from "react";
import useHabitStore from "../../store/habitStore";
import { buildDowData } from "../../utils/dowUtils";
import { DAY_NAMES_3 } from "../../utils/constants";

export default function DayOfWeekChart() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const activeBoard = useHabitStore((s) => s.activeBoard);
  const avgs = buildDowData(habits, completions, activeBoard);
  const max = Math.max(...avgs, 1);

  return (
    <div className="card rounded-2xl p-4 md:p-5">
      <h3 className="text-xs font-bold t2 uppercase tracking-widest mb-3 md:mb-4">
        📊 Best Day of Week
      </h3>

      <div className="flex flex-col gap-2.5">
        {DAY_NAMES_3.map((name, i) => {
          const pct = avgs[i];
          const barPct = Math.round((pct / max) * 100);
          const isTop = pct === max && pct > 0;

          return (
            <div key={name} className="flex items-center gap-2">
              {/* Day label — fixed width so bars align */}
              <span
                style={{
                  width: 28,
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  color: isTop ? "var(--orange)" : "var(--text-2)",
                }}
              >
                {name}
              </span>

              {/* Bar track */}
              <div
                className="flex-1 rounded-full"
                style={{
                  height: 6,
                  background: "var(--surface-2)",
                  minWidth: 0,
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barPct}%`,
                    background: isTop ? "var(--orange)" : "var(--green)",
                  }}
                />
              </div>

              {/* Percentage + trophy — fixed width to prevent layout shift */}
              <span
                style={{
                  width: 44,
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  textAlign: "right",
                  color: isTop ? "var(--orange)" : "var(--text-2)",
                  whiteSpace: "nowrap",
                }}
              >
                {pct}%{isTop ? " 🏆" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
