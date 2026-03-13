import { useState } from "react";
import useHabitStore from "../store/habitStore";

/**
 * GuestBanner
 * Shown at the top of the app when isGuest === true.
 * - Read-only notice
 * - Sign Up button → opens LoginPage modal
 * - Exit guest mode link
 */
export default function GuestBanner() {
  const isGuest = useHabitStore((s) => s.isGuest);
  const exitGuestMode = useHabitStore((s) => s.exitGuestMode);
  const [showLogin, setShowLogin] = useState(false);
  const [LoginModal, setLoginModal] = useState(null);

  if (!isGuest) return null;

  const handleSignUp = async () => {
    if (!LoginModal) {
      const mod = await import("../features/auth/LoginPage");
      setLoginModal(() => mod.default);
    }
    setShowLogin(true);
  };

  return (
    <>
      {/* ── Banner ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background:
            "linear-gradient(90deg, #1e1033 0%, #16213e 50%, #1e1033 100%)",
          borderBottom: "1px solid rgba(167,139,250,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: "44px",
          gap: "12px",
        }}
      >
        {/* Left — info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: "14px", flexShrink: 0 }}>👁️</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#c4b5fd",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Guest Preview — read-only demo
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#a78bfa",
                opacity: 0.6,
              }}
            />
            Your data won't be saved
          </span>
        </div>

        {/* Right — actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={exitGuestMode}
            style={{
              fontSize: "11px",
              color: "#6b7280",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "6px",
              fontWeight: 500,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Exit
          </button>

          <button
            onClick={handleSignUp}
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#030712",
              background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
              border: "none",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              boxShadow: "0 0 14px rgba(167,139,250,0.35)",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(167,139,250,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 0 14px rgba(167,139,250,0.35)";
            }}
          >
            Sign Up Free →
          </button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind the fixed banner */}
      <div style={{ height: "44px", flexShrink: 0 }} />

      {/* ── Login modal overlay ── */}
      {showLogin && LoginModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogin(false);
          }}
        >
          <LoginModal />
        </div>
      )}
    </>
  );
}
