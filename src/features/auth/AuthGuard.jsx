import React, { useEffect } from "react";
import useHabitStore from "../../store/habitStore";
import LoginPage from "./LoginPage";

export default function AuthGuard({ children }) {
  const currentUser = useHabitStore((s) => s.currentUser);
  const authLoading = useHabitStore((s) => s.authLoading);
  const initAuth = useHabitStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading) {
    return (
      <div
        style={{
          /*
            100dvh accounts for mobile browser chrome (address bar, bottom bar).
            Falls back to 100vh on browsers that don't support dvh.
          */
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          /* Respect notch / home indicator on iOS */
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* App icon */}
          <div style={{ fontSize: 44, marginBottom: 20 }}>🎯</div>

          {/* Spinner */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              margin: "0 auto",
              border: "3px solid rgba(52,211,153,0.2)",
              borderTopColor: "var(--green)",
              animation: "spin 0.8s linear infinite",
            }}
          />

          {/* Loading text */}
          <p
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "var(--text-3)",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Loading…
          </p>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!currentUser) return <LoginPage />;
  return children;
}
