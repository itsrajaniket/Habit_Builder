import React from "react";
import useHabitStore from "../../store/habitStore";
import { useCalendar } from "./useCalendar";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import YesterdayView from "./YesterdayView";
import { MONTH_NAMES } from "../../utils/constants";
import { weekStart } from "../../utils/dateUtils";
import { showToast } from "../../components/ui/Toast";

const VIEWS = [
  { key: "month", label: "Month", shortLabel: "Mo" },
  { key: "week", label: "Week", shortLabel: "Wk" },
  { key: "yesterday", label: "Yesterday", shortLabel: "Yest" },
];

export default function CalendarTable({ onRemove }) {
  const {
    currentMonth,
    currentYear,
    calendarView,
    currentWeekStart,
    goNext,
    goPrev,
    switchView,
  } = useCalendar();
  const habits = useHabitStore((s) => s.habits);
  const reorderHabits = useHabitStore((s) => s.reorderHabits);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const activeBoard = useHabitStore((s) => s.activeBoard);
  const activeCategory = useHabitStore((s) => s.activeCategory);

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

  const isYesterday = calendarView === "today";

  let title = "";
  if (calendarView === "week") {
    const wsStr = currentWeekStart || weekStart(new Date());
    const ws = new Date(wsStr + "T00:00:00");
    title = `${MONTH_NAMES[ws.getMonth()].slice(0, 3)} ${ws.getDate()}, ${ws.getFullYear()}`;
  } else if (isYesterday) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    title = `Yesterday — ${MONTH_NAMES[y.getMonth()].slice(0, 3)} ${y.getDate()}`;
  } else {
    title = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  }

  const handleReorder = (fromId, toId) => {
    if (activeBoard !== "all" || activeCategory !== "all") {
      showToast("⚠️ Clear filters before reordering habits.");
      return;
    }
    reorderHabits(fromId, toId);
    saveUserData();
  };

  const noMatch = !visibleHabits.length && habits.length > 0;

  return (
    <div>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between mb-3 gap-2"
        style={{ flexWrap: "wrap" }}
      >
        {/* Title */}
        <h2
          className="font-extrabold t1"
          style={{
            fontSize: "clamp(14px, 4vw, 18px)",
            minWidth: 0,
            flex: "1 1 auto",
          }}
        >
          {title}
        </h2>

        {/* Controls — prev/next + view switcher */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isYesterday && (
            <>
              <button
                onClick={goPrev}
                className="btn-ghost rounded-lg font-semibold"
                style={{ padding: "6px 10px", fontSize: 12, minHeight: 36 }}
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={goNext}
                className="btn-ghost rounded-lg font-semibold"
                style={{ padding: "6px 10px", fontSize: 12, minHeight: 36 }}
                aria-label="Next"
              >
                →
              </button>
            </>
          )}

          {/* View switcher */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--border-hi)" }}
          >
            {VIEWS.map((v) => {
              const storeKey = v.key === "yesterday" ? "today" : v.key;
              const isActive = calendarView === storeKey;
              return (
                <button
                  key={v.key}
                  onClick={() => switchView(storeKey)}
                  style={{
                    padding: "6px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    transition: "all 0.15s",
                    background: isActive ? "var(--green)" : "var(--surface-1)",
                    color: isActive ? "#000" : "var(--text-2)",
                    border: "none",
                    borderRight: "1px solid var(--border)",
                    cursor: "pointer",
                    minHeight: 36,
                    minWidth: 36,
                    fontFamily: "inherit",
                  }}
                  aria-pressed={isActive}
                  aria-label={v.label}
                >
                  {/* Full label on ≥480px, short on smaller */}
                  <span className="hidden xs:inline">{v.label}</span>
                  <span className="xs:hidden">{v.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Calendar body — horizontal scroll wrapper ── */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          borderRadius: 12,
          /* Negative margin trick: goes edge-to-edge on mobile */
          marginLeft: -2,
          marginRight: -2,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {noMatch ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-bold t2">No habits match this filter</p>
            <p className="text-xs t3 mt-1">
              Try a different board or category.
            </p>
          </div>
        ) : calendarView === "month" ? (
          <MonthView
            year={currentYear}
            month={currentMonth}
            visibleHabits={visibleHabits}
            onRemove={onRemove}
            onReorder={handleReorder}
          />
        ) : calendarView === "week" ? (
          <WeekView
            weekStartStr={currentWeekStart}
            visibleHabits={visibleHabits}
            onRemove={onRemove}
            onReorder={handleReorder}
          />
        ) : (
          <YesterdayView visibleHabits={visibleHabits} />
        )}
      </div>
    </div>
  );
}
