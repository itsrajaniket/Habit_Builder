import React from "react";
import useHabitStore from "../store/habitStore";
import { useTheme } from "../hooks/useTheme";

export default function GlobalNav({ onOpenSidebar }) {
  const currentUser = useHabitStore((s) => s.currentUser);
  const logout = useHabitStore((s) => s.logout);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (!window.confirm("Logout?")) return;
    await saveUserData();
    await logout();
  };

  // Shorten display name: "john.doe@gmail.com" → "John"
  const displayName = (() => {
    if (!currentUser) return "";
    const base = currentUser.includes("@")
      ? currentUser.split("@")[0]
      : currentUser;
    return base.charAt(0).toUpperCase() + base.slice(1);
  })();

  return (
    <nav
      className="glass-nav sticky top-0 z-50 flex items-center gap-2 md:gap-4"
      style={{
        borderBottom: "1px solid var(--border)",
        paddingLeft: "max(12px, env(safe-area-inset-left))",
        paddingRight: "max(12px, env(safe-area-inset-right))",
        paddingTop: "env(safe-area-inset-top)",
        height: "calc(52px + env(safe-area-inset-top))",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 mr-auto min-w-0">
        <span className="text-xl md:text-2xl flex-shrink-0">🎯</span>
        <span className="font-extrabold text-sm tracking-tight t1 hidden xs:block truncate">
          Habit Builder Kit
        </span>
        {/* Abbreviated on tiny screens */}
        <span className="font-extrabold text-sm tracking-tight t1 xs:hidden">
          HabitKit
        </span>
      </div>

      {/* Welcome — only on desktop */}
      {currentUser && (
        <span className="text-sm t2 hidden md:block flex-shrink-0">
          Welcome, <strong className="t1">{displayName}</strong> 👋
        </span>
      )}

      {/* Mobile: open sidebar drawer button */}
      {onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          className="icon-btn md:hidden"
          style={{ width: 36, height: 36, fontSize: 18 }}
          aria-label="Open analysis panel"
          title="Analysis"
        >
          📊
        </button>
      )}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="icon-btn"
        style={{ width: 36, height: 36, fontSize: 18 }}
        title="Toggle theme"
        aria-label="Toggle dark/light theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0"
        style={{
          background: "rgba(239,68,68,0.12)",
          color: "#f87171",
          border: "1px solid rgba(239,68,68,0.2)",
          minHeight: 36,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(239,68,68,0.22)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(239,68,68,0.12)")
        }
        aria-label="Logout"
      >
        {/* Short label on mobile */}
        <span className="md:hidden">Out</span>
        <span className="hidden md:inline">Logout</span>
      </button>
    </nav>
  );
}
