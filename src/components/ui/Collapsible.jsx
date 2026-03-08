import React, { useState } from "react";

export default function Collapsible({
  title,
  defaultOpen = true,
  children,
  storageKey,
}) {
  const getInit = () => {
    if (!storageKey) return defaultOpen;
    try {
      const s = JSON.parse(localStorage.getItem("ht_collapse") || "{}");
      return s[storageKey] !== undefined ? !s[storageKey] : defaultOpen;
    } catch {
      return defaultOpen;
    }
  };

  const [open, setOpen] = useState(getInit);

  const toggle = () =>
    setOpen((prev) => {
      const next = !prev;
      if (storageKey) {
        try {
          const s = JSON.parse(localStorage.getItem("ht_collapse") || "{}");
          s[storageKey] = !next;
          localStorage.setItem("ht_collapse", JSON.stringify(s));
        } catch {}
      }
      return next;
    });

  return (
    <div className="card rounded-2xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between text-left transition-all"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "14px 16px" /* taller = better touch target (min 44px) */,
          minHeight: 48,
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--surface-1)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        aria-expanded={open}
      >
        <span className="text-xs font-bold t1">{title}</span>
        <span
          className="text-[10px] t3 transition-transform duration-200"
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
