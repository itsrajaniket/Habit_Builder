import React, { useState } from "react";
import useHabitStore from "../store/habitStore";
import { useTheme } from "../hooks/useTheme";
import ConfirmModal from "./ConfirmModal";

export default function GlobalNav() {
  const currentUser = useHabitStore((s) => s.currentUser);
  const logout = useHabitStore((s) => s.logout);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const { theme, toggleTheme } = useTheme();

  const [loggingOut, setLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => setShowConfirm(true);

  const handleLogoutConfirm = async () => {
    setShowConfirm(false);
    setLoggingOut(true);
    try {
      await saveUserData();
    } catch (e) {
      console.warn("saveUserData failed during logout (continuing):", e);
    }
    await logout();
    // No need to reset loggingOut — component unmounts when currentUser → null
  };

  return (
    <>
      <nav
        className="glass-nav sticky top-0 z-50 flex items-center gap-2 md:gap-4 px-3 md:px-5 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5 mr-auto">
          <span className="text-2xl hidden sm:inline">🎯</span>
          <span className="font-extrabold text-sm tracking-tight t1 truncate">
            Habit Builder Kit
          </span>
        </div>

        {currentUser && (
          <span className="text-sm t2">
            Welcome,{" "}
            <strong className="t1">
              {(currentUser.includes("@")
                ? currentUser.split("@")[0]
                : currentUser
              )
                .charAt(0)
                .toUpperCase() +
                (currentUser.includes("@")
                  ? currentUser.split("@")[0]
                  : currentUser
                ).slice(1)}
            </strong>{" "}
            👋
          </span>
        )}

        <button
          onClick={toggleTheme}
          className="icon-btn w-9 h-9 text-lg"
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button
          onClick={handleLogoutClick}
          disabled={loggingOut}
          className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "rgba(239,68,68,0.12)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
          onMouseEnter={(e) => {
            if (!loggingOut)
              e.currentTarget.style.background = "rgba(239,68,68,0.22)";
          }}
          onMouseLeave={(e) => {
            if (!loggingOut)
              e.currentTarget.style.background = "rgba(239,68,68,0.12)";
          }}
        >
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </nav>

      {showConfirm && (
        <ConfirmModal
          title="Log out?"
          message="Your data is saved. You can log back in anytime."
          confirmLabel="Log out"
          cancelLabel="Cancel"
          danger={false}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
