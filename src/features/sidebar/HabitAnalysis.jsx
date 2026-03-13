import React, { useState } from "react";
import Collapsible from "../../components/ui/Collapsible";
import useHabitStore from "../../store/habitStore";
import ConfirmModal from "../../components/ConfirmModal";
import { CATEGORY_COLORS } from "../../utils/constants";
import { fmt, daysInMonth } from "../../utils/dateUtils";
import { calcStreak } from "../../utils/streakCalc";
import { showToast } from "../../components/ui/Toast";

export default function HabitAnalysis({ onRemove }) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [confirm, setConfirm] = useState(null);

  const completions = useHabitStore((s) => s.completions);
  const year = useHabitStore((s) => s.currentYear);
  const month = useHabitStore((s) => s.currentMonth);
  const freezeUsedDates = useHabitStore((s) => s.freezeUsedDates);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const saveUserData = useHabitStore((s) => s.saveUserData);

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

  const dim = daysInMonth(year, month);
  const items = visibleHabits
    .map((h) => {
      let done = 0;
      for (let d = 1; d <= dim; d++)
        if (completions[h.id]?.[fmt(year, month + 1, d)]) done++;
      return {
        h,
        done,
        goal: dim,
        streak: calcStreak(h.id, completions, freezeUsedDates),
      };
    })
    .sort((a, b) => b.done - a.done);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.h.id)));
  };

  const handleBulkDelete = () => {
    if (!selected.size) return;
    const count = selected.size;
    setConfirm({
      title: `Delete ${count} habit${count > 1 ? "s" : ""}?`,
      message:
        "This cannot be undone. All history for these habits will be removed.",
      confirmLabel: `Delete ${count}`,
      danger: true,
      onConfirm: () => {
        selected.forEach((id) => removeHabit(id));
        saveUserData();
        showToast(`🗑 ${count} habit${count > 1 ? "s" : ""} removed.`);
        setSelected(new Set());
        setSelectMode(false);
        setConfirm(null);
      },
    });
  };

  const header = (
    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
      {!selectMode ? (
        <button
          onClick={() => setSelectMode(true)}
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 8,
            background: "var(--surface-2)",
            color: "var(--text-3)",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}
        >
          ☑ Select
        </button>
      ) : (
        <>
          <button
            onClick={toggleAll}
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 8,
              background: "var(--surface-2)",
              color: "var(--text-2)",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            {selected.size === items.length ? "Deselect All" : "Select All"}
          </button>
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 8,
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.25)",
                cursor: "pointer",
              }}
            >
              🗑 Delete {selected.size}
            </button>
          )}
          <button
            onClick={() => {
              setSelectMode(false);
              setSelected(new Set());
            }}
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 8,
              background: "transparent",
              color: "var(--text-3)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <Collapsible
        title="📊 Habit Analysis"
        defaultOpen
        storageKey="analysisBody"
      >
        {items.length === 0 ? (
          <p className="text-xs t3">No habits match this filter.</p>
        ) : (
          <>
            {header}
            {items.map(({ h, done, goal, streak }) => {
              const cat = CATEGORY_COLORS[h.category] || CATEGORY_COLORS.other;
              const pct = goal > 0 ? Math.round((done / goal) * 100) : 0;
              const isSel = selected.has(h.id);

              return (
                <div
                  key={h.id}
                  onClick={selectMode ? () => toggleSelect(h.id) : undefined}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    cursor: selectMode ? "pointer" : "default",
                    background: isSel ? "rgba(239,68,68,0.04)" : "transparent",
                    borderRadius: isSel ? 8 : 0,
                    paddingLeft: isSel ? 8 : 0,
                    transition: "all 0.15s",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {selectMode && (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          flexShrink: 0,
                          border: `2px solid ${isSel ? "#f87171" : "var(--border-hi)"}`,
                          background: isSel
                            ? "rgba(239,68,68,0.15)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "#f87171",
                        }}
                      >
                        {isSel ? "✓" : ""}
                      </div>
                    )}
                    <span className="text-[13px] font-semibold t1 flex-1 truncate">
                      {h.emoji} {h.name}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: cat.bg, color: cat.accent }}
                    >
                      {cat.label.replace(/^[^\s]+\s/, "")}
                    </span>
                    {!selectMode && (
                      <button
                        onClick={() => onRemove(h.id)}
                        className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-sm"
                        style={{ color: "rgba(239,68,68,0.4)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#f87171";
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(239,68,68,0.4)";
                          e.currentTarget.style.background = "";
                        }}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-1.5 rounded-full"
                      style={{ background: "var(--surface-2)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: cat.accent }}
                      />
                    </div>
                    <span className="text-[11px] t3 shrink-0 w-16 text-right">
                      {done}/{goal} · {pct}%
                    </span>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${Math.min(100, streak * 4)}%`,
                          maxWidth: 100,
                          background:
                            streak > 14 ? "var(--orange)" : "var(--green)",
                          boxShadow:
                            streak > 7
                              ? `0 0 6px ${streak > 14 ? "var(--orange)" : "var(--green)"}`
                              : "none",
                        }}
                      />
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: "var(--orange)" }}
                      >
                        🔥 {streak}d
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </Collapsible>

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
