import React from "react";
import useHabitStore from "../../store/habitStore";
import { buildHeatmapData } from "../../utils/heatmapUtils";

export default function YearHeatmap() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const habitCreatedDates = useHabitStore((s) => s.habitCreatedDates);

  const getActiveCount = (ds) => {
    const keys = Object.keys(habitCreatedDates);
    if (!keys.length) return habits.length;
    const c = habits.filter((h) => {
      const cr = habitCreatedDates[h.id];
      return !cr || cr <= ds;
    }).length;
    return c || habits.length;
  };

  const { cells, totalCols, monthCols } = buildHeatmapData(
    habits,
    completions,
    getActiveCount,
  );

  return (
    <div className="card rounded-2xl p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-xs font-bold t2 uppercase tracking-widest">
          📅 Year at a Glance
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] t3 flex-shrink-0">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`w-3 h-3 rounded-sm hm-lv${l}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/*
        Always horizontally scrollable — the heatmap is inherently wide.
        scroll-snap gives a smooth feel on touch.
      */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          paddingBottom: 4, // room for scrollbar on desktop
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            gap: 4,
            /* Each cell is 13px + 3px gap = 16px.
               52 weeks × 16 = 832px minimum width */
            minWidth: `${totalCols * 16}px`,
          }}
        >
          {/* Month labels */}
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: totalCols }, (_, c) => (
              <div
                key={c}
                style={{
                  width: 13,
                  fontSize: 9,
                  color: "var(--text-3)",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {monthCols[c] || ""}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: totalCols }, (_, col) => (
              <div
                key={col}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  flexShrink: 0,
                }}
              >
                {Array.from({ length: 7 }, (_, row) => {
                  const cell = cells[col * 7 + row];
                  if (!cell) {
                    return <div key={row} style={{ width: 13, height: 13 }} />;
                  }
                  return (
                    <div
                      key={row}
                      className={`hm-lv${cell.level}`}
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: 2,
                        cursor: "default",
                      }}
                      title={`${cell.ds}: ${cell.done}/${cell.activeCount}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
