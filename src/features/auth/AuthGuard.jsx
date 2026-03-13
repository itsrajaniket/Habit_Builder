import React, { useEffect } from "react";
import useHabitStore from "../../store/habitStore";
import LoginPage from "./LoginPage";

export default function AuthGuard({ children }) {
  const currentUser = useHabitStore((s) => s.currentUser);
  const authLoading = useHabitStore((s) => s.authLoading);
  const isGuest = useHabitStore((s) => s.isGuest);
  const initAuth = useHabitStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
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
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Guest mode — show the full app (read-only enforced by GuestBanner + habitStore guards)
  if (isGuest) return <>{children}</>;

  if (!currentUser) return <LoginPage />;
  return children;
}
