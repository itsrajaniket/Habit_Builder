import React, { useRef, useEffect, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { MOOD_EMOJIS } from "../../utils/constants";

export default function MoodPickerPopover({
  dateStr,
  anchorRect,
  onSelect,
  onClose,
}) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 600px)");
    setIsMobile(mql.matches);
    const h = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);

  useClickOutside(ref, onClose);

  // Close on Escape
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  /* ── Position ──
     Mobile: fixed bottom sheet (CSS handles it via .mood-picker-popover media query in index.css)
     Desktop: positioned near the clicked cell */
  const desktopStyle = anchorRect
    ? {
        position: "fixed",
        top: Math.min((anchorRect.bottom || 0) + 6, window.innerHeight - 200),
        left: Math.min(
          Math.max(8, (anchorRect.left || 0) - 20),
          window.innerWidth - 240,
        ),
        zIndex: 9500,
      }
    : {
        position: "fixed",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9500,
      };

  /* On mobile the CSS in index.css overrides the inline position to a bottom sheet */
  return (
    <div
      ref={ref}
      style={desktopStyle}
      role="dialog"
      aria-label="Select mood"
      aria-modal="true"
      className="mood-picker-popover"
    >
      {/* Drag handle — visible on mobile only */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 10,
        }}
        className="mobile-only"
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 99,
            background: "var(--border-hi)",
          }}
        />
      </div>

      <p
        style={{
          fontSize: 10,
          color: "var(--text-3)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        How are you feeling?
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          /* On mobile the popover is full-width so we want a wider emoji grid */
          maxWidth: isMobile ? "100%" : 220,
          justifyContent: isMobile ? "center" : "flex-start",
        }}
      >
        {MOOD_EMOJIS.map((em, i) => (
          <button
            key={i}
            title={`Level ${i + 1}`}
            aria-label={`Mood level ${i + 1}`}
            onClick={() => {
              onSelect(dateStr, i + 1);
              onClose();
            }}
            className="mood-emoji-btn"
            style={{
              /* Larger on mobile */
              width: isMobile ? 44 : 36,
              height: isMobile ? 44 : 36,
              fontSize: isMobile ? 22 : 19,
            }}
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}
