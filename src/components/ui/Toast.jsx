import React, { useEffect, useState } from "react";

let _setMsg = null;
export function showToast(msg) {
  if (_setMsg) _setMsg(msg);
}

export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    _setMsg = (msg) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2800);
    };
    return () => {
      _setMsg = null;
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        /*
          On mobile the bottom nav is ~64px tall + safe-area-inset-bottom.
          We sit 8px above it so the toast is never hidden under the nav.
          On desktop (no bottom nav) bottom-6 = 24px is fine.
          We use a CSS custom property set in index.css:
            --mobile-nav-h: 64px (or 0 on desktop)
        */
        bottom:
          "calc(var(--mobile-nav-h, 0px) + env(safe-area-inset-bottom, 0px) + 12px)",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)`,
        zIndex: 9999,
        padding: "11px 20px",
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-1)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease, transform 0.25s ease",
        background: "var(--bg-card-hi)",
        border: "1px solid var(--border-hi)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        /* Don't exceed screen width on narrow phones */
        maxWidth: "calc(100vw - 32px)",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}
