import React, { useState, useEffect } from "react";
import { EMOJIS, BOARDS, CATEGORIES, HABIT_KITS } from "../../utils/constants";
import useHabitStore from "../../store/habitStore";
import { showToast } from "../../components/ui/Toast";

/* ─── KitCard ─────────────────────────────────────────────── */
function KitCard({ kit, onLoad }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onTouchStart={() => setHov(true)}
      onTouchEnd={() => setHov(false)}
      onClick={() => onLoad(kit)}
      style={{
        cursor: "pointer",
        borderRadius: 14,
        padding: "14px 16px",
        background: hov ? `${kit.color}12` : "var(--surface-1)",
        border: `1px solid ${hov ? kit.color + "45" : "var(--border)"}`,
        transition: "all 0.18s",
        "--kit-glow": kit.glow,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 22 }}>{kit.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 13,
              color: hov ? kit.color : "var(--text-1)",
            }}
          >
            {kit.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>
            {kit.description}
          </div>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 99,
            background: `${kit.color}18`,
            color: kit.color,
            border: `1px solid ${kit.color}30`,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {kit.habits.length} habits
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {kit.habits.slice(0, 4).map((h) => (
          <span
            key={h.name}
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 99,
              background: "var(--surface-2)",
              color: "var(--text-3)",
              border: "1px solid var(--border)",
            }}
          >
            {h.emoji} {h.name}
          </span>
        ))}
        {kit.habits.length > 4 && (
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 99,
              color: "var(--text-3)",
            }}
          >
            +{kit.habits.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Main Modal ──────────────────────────────────────────── */
export default function HabitModal({ isOpen, onClose, onAdd }) {
  const [tab, setTab] = useState("custom");
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("⏰");
  const [category, setCategory] = useState("health");
  const [board, setBoard] = useState("all");
  const [nameError, setNameError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const addHabit = useHabitStore((s) => s.addHabit);
  const saveUserData = useHabitStore((s) => s.saveUserData);

  // Detect mobile
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const h = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleAdd = () => {
    if (!name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 2000);
      return;
    }
    onAdd(name.trim(), emoji, category, board);
    setName("");
    setEmoji("⏰");
    setCategory("health");
    setBoard("all");
    onClose();
  };

  const handleLoadKit = (kit) => {
    kit.habits.forEach((h) => addHabit(h.name, h.emoji, h.category, h.board));
    saveUserData();
    showToast(
      `${kit.icon} ${kit.name} kit loaded — ${kit.habits.length} habits added!`,
    );
    onClose();
  };

  const handleClose = () => {
    setName("");
    setNameError(false);
    setTab("custom");
    onClose();
  };

  const pillCls = (active, color) => ({
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    background: active
      ? color
        ? `${color}20`
        : "rgba(52,211,153,0.15)"
      : "var(--surface-1)",
    color: active ? color || "var(--green)" : "var(--text-3)",
    border: `1px solid ${active ? (color ? color + "40" : "rgba(52,211,153,0.35)") : "var(--border)"}`,
    transition: "all 0.15s",
    minHeight: 40,
  });

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        /* On mobile: align to bottom (bottom sheet). On desktop: center */
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? "0" : "16px",
        animation: "fadeIn 0.18s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Panel */}
      <div
        style={{
          background: "var(--bg-card-hi)",
          border: "1px solid var(--border-hi)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          /* Mobile: full-width bottom sheet with rounded top; Desktop: constrained dialog */
          borderRadius: isMobile ? "20px 20px 0 0" : 20,
          width: "100%",
          maxWidth: isMobile ? "100%" : 500,
          maxHeight: isMobile ? "92dvh" : "88vh",
          overflowY: "auto",
          overscrollBehavior: "contain",
          display: "flex",
          flexDirection: "column",
          animation: isMobile
            ? "slideUpFull 0.28s cubic-bezier(0.4,0,0.2,1)"
            : "slideUp 0.22s ease",
          paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : 0,
        }}
      >
        {/* Drag handle (mobile only) */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 10,
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 99,
                background: "var(--border-hi)",
              }}
            />
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px 12px",
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            background: "var(--bg-card-hi)",
            zIndex: 5,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "var(--text-1)",
              margin: 0,
            }}
          >
            Add Habit
          </h2>
          <button
            onClick={handleClose}
            className="icon-btn"
            style={{ width: 36, height: 36 }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: 1,
          }}
        >
          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              gap: 6,
              padding: "2px",
              borderRadius: 10,
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
            }}
          >
            {[
              { key: "custom", label: "✏️ Custom" },
              { key: "kits", label: "📦 Starter Kits" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: tab === t.key ? "var(--bg-card)" : "transparent",
                  color: tab === t.key ? "var(--text-1)" : "var(--text-3)",
                  boxShadow:
                    tab === t.key ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
                  minHeight: 40,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── CUSTOM TAB ── */}
          {tab === "custom" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-3)",
                  }}
                >
                  Habit Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning Exercise"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  autoFocus={!isMobile}
                  /* Prevent iOS zoom on focus: font-size must be ≥ 16px */
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    fontSize: 16,
                    outline: "none",
                    background: nameError
                      ? "rgba(239,68,68,0.06)"
                      : "var(--surface-2)",
                    border: `1px solid ${nameError ? "rgba(239,68,68,0.5)" : "var(--border-hi)"}`,
                    color: "var(--text-1)",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(52,211,153,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = nameError
                      ? "rgba(239,68,68,0.5)"
                      : "var(--border-hi)")
                  }
                />
                {nameError && (
                  <p style={{ fontSize: 11, color: "#f87171", margin: 0 }}>
                    ⚠️ Please enter a habit name
                  </p>
                )}
              </div>

              {/* Category */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-3)",
                  }}
                >
                  Category
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                    <div
                      key={c.value}
                      style={pillCls(category === c.value)}
                      onClick={() => setCategory(c.value)}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Board */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-3)",
                  }}
                >
                  Board
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {BOARDS.map((b) => (
                    <div
                      key={b.value}
                      style={pillCls(board === b.value)}
                      onClick={() => setBoard(b.value)}
                    >
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emoji grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-3)",
                  }}
                >
                  Icon
                </label>
                <div
                  style={{
                    display: "grid",
                    /* More columns on mobile so grid fits screen */
                    gridTemplateColumns: `repeat(${isMobile ? 8 : 10}, 1fr)`,
                    gap: 4,
                    maxHeight: 140,
                    overflowY: "auto",
                  }}
                >
                  {EMOJIS.map((em) => (
                    <div
                      key={em}
                      onClick={() => setEmoji(em)}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: isMobile ? 20 : 16,
                        transition: "all 0.12s",
                        background:
                          emoji === em ? "rgba(52,211,153,0.2)" : "transparent",
                        border: `1px solid ${emoji === em ? "rgba(52,211,153,0.4)" : "transparent"}`,
                        minHeight: 36,
                      }}
                    >
                      {em}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons — stacked on mobile */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 8,
                  paddingTop: 4,
                }}
              >
                <button
                  onClick={handleClose}
                  className="btn-ghost rounded-xl text-sm font-semibold"
                  style={{ flex: 1, padding: "11px 0" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 800,
                    background: "var(--green)",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 0 18px var(--green-glow)",
                    minHeight: 44,
                  }}
                >
                  ＋ Add Habit
                </button>
              </div>
            </div>
          )}

          {/* ── KITS TAB ── */}
          {tab === "kits" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>
                Load a pre-built pack and start tracking immediately.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  maxHeight: isMobile ? "50dvh" : 420,
                  overflowY: "auto",
                  paddingRight: 2,
                }}
              >
                {HABIT_KITS.map((kit) => (
                  <KitCard key={kit.id} kit={kit} onLoad={handleLoadKit} />
                ))}
              </div>
              <button
                onClick={handleClose}
                className="btn-ghost w-full py-2 rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
