import React, { useState, useEffect } from "react";
import useHabitStore from "../../store/habitStore";
import { fmt, daysInMonth } from "../../utils/dateUtils";
import { CATEGORY_COLORS } from "../../utils/constants";

export default function ProgressRings() {
  const completions = useHabitStore((s) => s.completions);
  const year = useHabitStore((s) => s.currentYear);
  const month = useHabitStore((s) => s.currentMonth);
  const visibleHabits = useHabitStore((s) => {
    const { habits, activeBoard, activeCategory } = s;
    let h =
      activeBoard === "all"
        ? habits
        : habits.filter((x) => x.board === activeBoard || x.board === "all");
    if (activeCategory !== "all")
      h = h.filter((x) => x.category === activeCategory);
    return h;
  });

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 480,
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 480px)");
    const h = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);

  const today = new Date();
  const isCurrent = today.getMonth() === month && today.getFullYear() === year;
  const elapsed = isCurrent ? today.getDate() : daysInMonth(year, month);

  /* Ring size: smaller on very narrow phones */
  const ringSize = isMobile ? 56 : 68;
  const r = isMobile ? 22 : 28;
  const fontSize = isMobile ? 11 : 13;

  return (
    <div>
      <div
        style={{
          display: "grid",
          /* auto-fill: as many rings per row as fit.
             min 72px on mobile (fits 4 on 320px), 90px on larger */
          gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 72 : 90}px, 1fr))`,
          gap: isMobile ? "14px 8px" : "20px 12px",
        }}
      >
        {visibleHabits.map((h) => {
          let done = 0;
          for (let d = 1; d <= elapsed; d++) {
            if (completions[h.id]?.[fmt(year, month + 1, d)]) done++;
          }
          const pct = elapsed > 0 ? Math.round((done / elapsed) * 100) : 0;
          const cat = CATEGORY_COLORS[h.category] || CATEGORY_COLORS.other;
          const circ = 2 * Math.PI * r;
          const off = circ * (1 - pct / 100);
          const cx = ringSize / 2 + 2; // +2 for viewBox padding
          const cy = cx;
          const vb = ringSize + 4;

          return (
            <div key={h.id} className="flex flex-col items-center gap-1.5">
              <svg
                width={ringSize}
                height={ringSize}
                viewBox={`0 0 ${vb} ${vb}`}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="var(--surface-2)"
                  strokeWidth={isMobile ? 5 : 6}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={cat.accent}
                  strokeWidth={isMobile ? 5 : 6}
                  strokeDasharray={circ.toFixed(1)}
                  strokeDashoffset={off.toFixed(1)}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ transition: "stroke-dashoffset 0.7s ease" }}
                />
                <text
                  x={cx}
                  y={cy + fontSize * 0.38}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fontWeight="800"
                  fill={cat.accent}
                >
                  {pct}%
                </text>
              </svg>

              <p
                style={{
                  fontSize: isMobile ? 10 : 11,
                  textAlign: "center",
                  lineHeight: 1.3,
                  color: "var(--text-2)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  width: "100%",
                  wordBreak: "break-word",
                }}
              >
                {h.emoji} {h.name}
              </p>
            </div>
          );
        })}

        {!visibleHabits.length && (
          <p
            className="text-xs t3 text-center py-4"
            style={{ gridColumn: "1/-1" }}
          >
            No habits to display.
          </p>
        )}
      </div>
    </div>
  );
}
