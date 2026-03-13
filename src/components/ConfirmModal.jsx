import React, { useEffect } from "react";

/**
 * ConfirmModal — drop-in replacement for window.confirm()
 *
 * Usage:
 *   const [confirm, setConfirm] = useState(null);
 *
 *   // To trigger:
 *   setConfirm({
 *     title: 'Remove habit?',
 *     message: 'This cannot be undone.',
 *     danger: true,
 *     onConfirm: () => { doThing(); setConfirm(null); },
 *   });
 *
 *   // In JSX:
 *   {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
 */
export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl slide-up"
        style={{ background: "var(--surface, #1a1a2e)" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3">
          <div className="flex items-start gap-3">
            {danger && (
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(239,68,68,0.12)" }}
              >
                <span className="text-lg">⚠️</span>
              </div>
            )}
            <div>
              <h3 className="text-base font-bold t1">{title}</h3>
              {message && <p className="mt-1 text-sm t2">{message}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-6 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
            style={{
              background: "var(--surface-2, rgba(255,255,255,0.06))",
              color: "var(--text-2)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.98]"
            style={
              danger
                ? {
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }
                : {
                    background: "var(--green-dim, rgba(52,211,153,0.15))",
                    color: "var(--green, #34d399)",
                    border: "1px solid rgba(52,211,153,0.3)",
                  }
            }
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
