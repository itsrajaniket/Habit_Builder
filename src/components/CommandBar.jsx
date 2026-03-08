import React, { useState } from "react";
import useHabitStore from "../store/habitStore";
import { BOARDS, CATEGORIES } from "../utils/constants";

export default function CommandBar({ onOpenToday }) {
  const activeBoard = useHabitStore((s) => s.activeBoard);
  const activeCategory = useHabitStore((s) => s.activeCategory);
  const setActiveBoard = useHabitStore((s) => s.setActiveBoard);
  const setActiveCategory = useHabitStore((s) => s.setActiveCategory);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const [showFilters, setShowFilters] = useState(false);

  const hasFilter = activeBoard !== "all" || activeCategory !== "all";

  const clearAll = () => {
    setActiveBoard("all");
    setActiveCategory("all");
    saveUserData();
  };

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      {/* ── Main bar ── */}
      <div
        className="command-bar-inner flex items-center gap-2"
        style={{
          padding: "8px 12px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE */,
          flexWrap: "nowrap",
        }}
      >
        {/* Board quick pills — scrollable row on mobile */}
        <div
          style={{
            display: "flex",
            gap: 4,
            flex: 1,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: 1,
          }}
        >
          {BOARDS.map((b) => {
            const active = activeBoard === b.value;
            return (
              <button
                key={b.value}
                onClick={() => {
                  setActiveBoard(b.value);
                  saveUserData();
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: active
                    ? "rgba(52,211,153,0.15)"
                    : "var(--surface-1)",
                  color: active ? "var(--green)" : "var(--text-3)",
                  border: `1px solid ${active ? "rgba(52,211,153,0.35)" : "var(--border)"}`,
                  /* 44px touch target height */
                  minHeight: 36,
                  flexShrink: 0,
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 12px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
            background:
              activeCategory !== "all"
                ? "rgba(52,211,153,0.1)"
                : "var(--surface-1)",
            color: activeCategory !== "all" ? "var(--green)" : "var(--text-3)",
            border: `1px solid ${activeCategory !== "all" ? "rgba(52,211,153,0.3)" : "var(--border)"}`,
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.15s",
            minHeight: 36,
          }}
        >
          {showFilters ? "▲" : "▼"}
          {/* Hide text on very small screens */}
          <span className="hidden xs:inline"> Category</span>
          {activeCategory !== "all" && (
            <span
              style={{
                background: "var(--green)",
                color: "#000",
                borderRadius: 99,
                width: 14,
                height: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 900,
              }}
            >
              1
            </span>
          )}
        </button>

        {/* Clear active filter */}
        {hasFilter && (
          <button
            onClick={clearAll}
            style={{
              padding: "6px 10px",
              borderRadius: 99,
              fontSize: 10,
              fontWeight: 700,
              background: "rgba(239,68,68,0.08)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.2)",
              cursor: "pointer",
              flexShrink: 0,
              minHeight: 36,
            }}
          >
            ✕
          </button>
        )}

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border-hi)",
            flexShrink: 0,
          }}
        />

        {/* Today CTA */}
        <button
          onClick={onOpenToday}
          style={{
            padding: "6px 14px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 800,
            background: "var(--green)",
            color: "#000",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 14px var(--green-glow)",
            flexShrink: 0,
            minHeight: 36,
          }}
        >
          ☀️ <span className="hidden xs:inline">Today</span>
        </button>
      </div>

      {/* ── Category filter drawer ── */}
      {showFilters && (
        <div
          style={{
            display: "flex",
            gap: 5,
            padding: "8px 12px 10px",
            flexWrap: "wrap",
            borderTop: "1px solid var(--border)",
            background: "var(--surface-1)",
            animation: "fadeIn 0.15s ease",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              alignSelf: "center",
              marginRight: 4,
            }}
          >
            Category
          </span>
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.value;
            return (
              <button
                key={c.value}
                onClick={() => {
                  setActiveCategory(c.value);
                  saveUserData();
                }}
                style={{
                  padding: "5px 12px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: active ? "rgba(52,211,153,0.15)" : "transparent",
                  color: active ? "var(--green)" : "var(--text-3)",
                  border: `1px solid ${active ? "rgba(52,211,153,0.35)" : "var(--border)"}`,
                  minHeight: 36,
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
