import React, { memo, useRef, useCallback } from "react";
import useHabitStore from "../../store/habitStore";
import { useSound } from "../../hooks/useSound";
import { todayStr } from "../../utils/dateUtils";

// ─── Celebration burst from cell position ─────────────────────
function spawnBurst(cellEl) {
  if (!cellEl) return;
  const rect = cellEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const wrap = document.createElement("div");
  wrap.style.cssText = `
    position:fixed; left:${cx}px; top:${cy}px;
    pointer-events:none; z-index:9999;
    transform:translate(-50%,-50%);
  `;

  const COLORS = [
    "#34d399",
    "#059669",
    "#6ee7b7",
    "#fbbf24",
    "#a78bfa",
    "#f472b6",
    "#60a5fa",
    "#fb923c",
  ];
  const COUNT = 14;

  for (let i = 0; i < COUNT; i++) {
    const angle = (i / COUNT) * Math.PI * 2;
    const dist = 22 + Math.random() * 18;
    const size = 5 + Math.random() * 5;
    const color = COLORS[i % COLORS.length];
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const dur = 420 + Math.random() * 160;
    const shape = i % 4 === 0 ? "circle" : i % 4 === 1 ? "star" : "rect";

    const el = document.createElement("div");
    el.style.cssText = `
      position:absolute;
      left:50%; top:50%;
      width:${size}px; height:${size}px;
      background:${shape === "star" ? "transparent" : color};
      color:${color};
      font-size:${size + 2}px;
      line-height:1;
      border-radius:${shape === "circle" ? "50%" : shape === "rect" ? "2px" : "0"};
      transform:translate(-50%,-50%) translate(0px,0px) scale(1);
      opacity:1;
      transition: transform ${dur}ms cubic-bezier(0.2,0,0.8,1),
                  opacity   ${dur}ms ease-out;
      will-change: transform, opacity;
    `;
    el.textContent = shape === "star" ? "★" : "";
    wrap.appendChild(el);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = `translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0)`;
        el.style.opacity = "0";
      });
    });
  }

  // Ring pulse on the cell itself
  const ring = document.createElement("div");
  ring.style.cssText = `
    position:absolute; left:50%; top:50%;
    width:6px; height:6px;
    border:2px solid #34d399;
    border-radius:50%;
    transform:translate(-50%,-50%) scale(1);
    opacity:0.9;
    transition: transform 380ms ease-out, opacity 380ms ease-out;
  `;
  wrap.appendChild(ring);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ring.style.transform = "translate(-50%,-50%) scale(5)";
      ring.style.opacity = "0";
    });
  });

  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 650);
}

// ─── Shake animation for blocked future clicks ─────────────────
function spawnBlockedShake(cellEl) {
  if (!cellEl) return;
  cellEl.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(-3px)" },
      { transform: "translateX(3px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 300, easing: "ease-in-out" },
  );
}

// ─── Main component ────────────────────────────────────────────
const CheckCell = memo(function CheckCell({
  habitId,
  dateStr,
  isYesterday,
  isToday,
  isFrozen,
  tipLabel,
}) {
  const done = useHabitStore((s) => !!s.completions[habitId]?.[dateStr]);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const { playCheck, playUncheck } = useSound();
  const cellRef = useRef(null);

  // ── Future-date detection ──────────────────────────────────
  const isFuture = dateStr > todayStr();

  const onClick = useCallback(() => {
    // 🚫 Block future dates
    if (isFuture) {
      spawnBlockedShake(cellRef.current);
      return;
    }

    const nowDone = !done;
    toggleCompletion(habitId, dateStr);
    saveUserData();

    const el = cellRef.current;
    if (el) {
      el.classList.remove("pop-anim", "unpop-anim");
      void el.offsetWidth; // force reflow
      el.classList.add(nowDone ? "pop-anim" : "unpop-anim");
      setTimeout(() => el.classList.remove("pop-anim", "unpop-anim"), 400);
    }

    if (nowDone) {
      playCheck();
      spawnBurst(cellRef.current);
    } else {
      playUncheck();
    }
  }, [
    done,
    habitId,
    dateStr,
    isFuture,
    toggleCompletion,
    saveUserData,
    playCheck,
    playUncheck,
  ]);

  return (
    <td
      className={`cal-td${isToday ? " col-today" : isYesterday ? " col-yesterday" : ""}`}
    >
      <div
        ref={cellRef}
        className={`chk${done ? " done" : ""}${isFrozen ? " frozen" : ""}${isFuture ? " future-locked" : ""}`}
        onClick={onClick}
        title={isFuture ? "Can't check future dates" : tipLabel}
        role="checkbox"
        aria-checked={done}
        aria-disabled={isFuture}
        tabIndex={isFuture ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === " " && !isFuture) onClick();
        }}
        style={{
          position: "relative",
          ...(isFuture
            ? {
                cursor: "not-allowed",
                opacity: 0.25,
                filter: "grayscale(1)",
                pointerEvents: "auto", // keep so shake still fires
              }
            : {}),
        }}
      />
    </td>
  );
});

export default CheckCell;
