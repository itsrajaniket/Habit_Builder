import React, { useEffect, useState } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const h = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 fade-in"
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card-hi w-full overflow-y-auto slide-up"
        style={{
          border: "1px solid var(--border-hi)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          maxWidth: isMobile ? "100%" : 480,
          maxHeight: isMobile ? "92dvh" : "88vh",
          borderRadius: isMobile ? "20px 20px 0 0" : 16,
          overscrollBehavior: "contain",
          paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : 0,
        }}
      >
        {/* Drag handle on mobile */}
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

        {title && (
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom: "1px solid var(--border)",
              position: "sticky",
              top: 0,
              background: "var(--bg-card-hi)",
              zIndex: 5,
            }}
          >
            <h3 className="text-base font-bold t1">{title}</h3>
            <button
              onClick={onClose}
              className="icon-btn"
              style={{ width: 36, height: 36, fontSize: 18 }}
            >
              ×
            </button>
          </div>
        )}

        <div className="px-5 py-5 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
