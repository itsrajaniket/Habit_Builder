import React from "react";

export default function DayHeaderCell({
  dateStr,
  dayLabel,
  hasNote,
  isFrozen,
  isYesterday,
  isToday,
  onOpenNote,
}) {
  let colClass = "";
  if (isToday) colClass = " col-today";
  else if (isYesterday) colClass = " col-yesterday";
  if (isFrozen) colClass += " col-frozen";

  return (
    <th className={`cal-th-day${colClass}`} style={{ position: "relative" }}>
      {/* Day number */}
      <span>{dayLabel}</span>

      {/* Today dot */}
      {isToday && (
        <span style={{ fontSize: 8, marginLeft: 2, opacity: 0.7 }}>●</span>
      )}

      {/* Note button — large tap target */}
      <button
        title={hasNote ? "Has note — tap to edit" : "Add note"}
        onClick={() => onOpenNote(dateStr, String(dayLabel))}
        aria-label={
          hasNote
            ? `Edit note for day ${dayLabel}`
            : `Add note for day ${dayLabel}`
        }
        style={{
          /* Transparent button, only shows emoji */
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          marginLeft: 1,
          opacity: hasNote ? 1 : 0,
          fontSize: 9,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          /* On touch, always visible so it's discoverable */
          verticalAlign: "middle",
          /* Minimum tap target */
          minWidth: 20,
          minHeight: 20,
        }}
        className="note-btn"
      >
        {hasNote ? "📝" : ""}
      </button>

      {/* Freeze indicator */}
      {isFrozen && (
        <span title="Freeze applied" style={{ fontSize: 9, marginLeft: 1 }}>
          🧊
        </span>
      )}

      <style>{`
        /* Show note button on touch devices so users discover it */
        @media (pointer: coarse) {
          .note-btn { opacity: 0.5 !important; }
          .note-btn:active { opacity: 1 !important; transform: scale(1.2); }
        }
        /* Show on hover for desktop */
        th:hover .note-btn { opacity: 0.7 !important; }
      `}</style>
    </th>
  );
}
