import React, { useEffect, useState, useCallback } from "react";
import AuthGuard from "./features/auth/AuthGuard";
import GlobalNav from "./components/GlobalNav";
import CommandBar from "./components/CommandBar";
import CalendarTable from "./features/calendar/CalendarTable";
import Sidebar from "./features/sidebar/Sidebar";
import AnalyticsFooter from "./features/analytics/AnalyticsFooter";
import AppFooter from "./components/AppFooter";
import MentalStatePanel from "./features/analytics/MentalStatePanel";
import ProgressChart from "./features/sidebar/ProgressChart";
import ProgressRings from "./features/analytics/ProgressRings";
import XPLevelCard from "./features/sidebar/XPLevelCard";
import Collapsible from "./components/ui/Collapsible";
import HabitModal from "./features/habits/HabitModal";
import TodayPanel from "./features/habits/TodayPanel";
import EmptyState from "./features/habits/EmptyState";
import Toast, { showToast } from "./components/ui/Toast";
import useHabitStore from "./store/habitStore";
import { useTheme } from "./hooks/useTheme";
import { useConfetti } from "./hooks/useConfetti";
import { todayStr } from "./utils/dateUtils";

/* ── tiny hook: returns true when window width ≤ maxWidth ── */
function useIsMobile(maxWidth = 767) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= maxWidth : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, [maxWidth]);
  return isMobile;
}

/* ── Mobile bottom navigation bar ── */
function MobileBottomNav({ activeSection, onSection, onOpenHabitModal }) {
  const tabs = [
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "today", icon: "☀️", label: "Today" },
    { id: "add", icon: "＋", label: "Add", isAction: true },
    { id: "analytics", icon: "📈", label: "Stats" },
    { id: "sidebar", icon: "📊", label: "More" },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`mobile-nav-btn ${activeSection === tab.id ? "active" : ""}`}
            onClick={() => {
              if (tab.id === "add") {
                onOpenHabitModal();
                return;
              }
              onSection(tab.id);
            }}
            aria-label={tab.label}
            style={
              tab.isAction
                ? {
                    background: "var(--green)",
                    color: "#000",
                    borderRadius: 14,
                    fontWeight: 900,
                    fontSize: 22,
                  }
                : {}
            }
          >
            <span className="nav-icon">{tab.icon}</span>
            {!tab.isAction && <span>{tab.label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ── Mobile sidebar drawer ── */
function MobileSidebarDrawer({ isOpen, onClose, onRemoveHabit }) {
  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="mobile-drawer-overlay"
          style={{ display: "block" }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Drawer panel */}
      <div
        className={`mobile-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Sidebar"
      >
        <div className="mobile-drawer-header">
          <span className="text-sm font-bold t1">📊 Analysis & Data</span>
          <button
            onClick={onClose}
            className="icon-btn w-9 h-9 text-lg"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "12px" }}>
          <Sidebar onRemoveHabit={onRemoveHabit} />
        </div>
      </div>
    </>
  );
}

function AppContent() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const streakFreezes = useHabitStore((s) => s.streakFreezes);
  const addHabit = useHabitStore((s) => s.addHabit);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const saveUserData = useHabitStore((s) => s.saveUserData);
  const checkAndAwardFreezes = useHabitStore((s) => s.checkAndAwardFreezes);
  const useStreakFreezeAction = useHabitStore((s) => s.useStreakFreeze);

  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const [activeSection, setActiveSection] = useState("calendar");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useIsMobile(767);
  const { canvasRef, trigger: triggerConfetti } = useConfetti();
  useTheme();

  useEffect(() => {
    if (!habits.length) return;
    const today = todayStr();
    if (habits.every((h) => completions[h.id]?.[today])) {
      triggerConfetti();
      const r = checkAndAwardFreezes();
      if (r === "freeze_earned") showToast("🧊 Streak freeze earned!");
      saveUserData();
    }
  }, [completions]);

  // Sync mobile nav section changes
  useEffect(() => {
    if (!isMobile) return;
    if (activeSection === "today") {
      setShowToday(true);
    } else {
      setShowToday(false);
    }
    if (activeSection === "sidebar") {
      setDrawerOpen(true);
      setActiveSection("calendar"); // reset so drawer can be re-opened
    }
  }, [activeSection, isMobile]);

  const handleRemove = (id) => {
    const h = habits.find((x) => x.id === id);
    if (!h || !window.confirm(`Remove "${h.name}"?`)) return;
    removeHabit(id);
    saveUserData();
    showToast("🗑 Habit removed.");
  };

  const handleAdd = (name, emoji, category, board) => {
    addHabit(name, emoji, category, board);
    saveUserData();
    showToast("✅ Habit added!");
  };

  const handleFreeze = () => {
    const r = useStreakFreezeAction();
    if (r === "no_freezes") showToast("❌ No freezes available!");
    if (r === "already_used") showToast("✅ Already used a freeze today.");
    if (r === "success") {
      saveUserData();
      showToast("🧊 Freeze applied!");
    }
  };

  const openHabitModal = useCallback(() => setShowHabitModal(true), []);

  /* ─── Determine visible sections on mobile ─── */
  const showCalendar = !isMobile || activeSection === "calendar";
  const showAnalytics = !isMobile || activeSection === "analytics";

  return (
    <div
      className="app-root mobile-page-clearance"
      style={{ minHeight: "100dvh" }}
    >
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        hidden
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* Top nav */}
      <GlobalNav onOpenSidebar={() => setDrawerOpen(true)} />

      {/* Filter / board command bar */}
      <CommandBar
        onOpenToday={() => {
          setShowToday((v) => !v);
          if (isMobile) setActiveSection("today");
        }}
      />

      {/* ── Banners ── */}
      {(showToday || streakFreezes > 0) && (
        <div className="px-3 xs:px-4 md:px-5 pt-3 md:pt-4 flex flex-col gap-2">
          {showToday && (
            <TodayPanel
              onClose={() => {
                setShowToday(false);
                if (isMobile) setActiveSection("calendar");
              }}
            />
          )}

          {streakFreezes > 0 && (
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-xl slide-up freeze-banner"
              style={{
                background: "rgba(96,165,250,0.07)",
                border: "1px solid rgba(96,165,250,0.18)",
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-2)" }}>
                🧊{" "}
                <strong style={{ color: "var(--blue)" }}>
                  {streakFreezes}
                </strong>{" "}
                streak freeze(s) available
              </span>
              <button
                onClick={handleFreeze}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0"
                style={{
                  background: "rgba(96,165,250,0.15)",
                  color: "var(--blue)",
                  border: "1px solid rgba(96,165,250,0.2)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(96,165,250,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(96,165,250,0.15)")
                }
              >
                Use Today
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Main layout ── */}
      <div
        className="main-two-col grid gap-4 px-3 xs:px-4 md:px-5 pt-4 pb-4"
        style={{ gridTemplateColumns: isMobile ? "1fr" : "1fr 340px" }}
      >
        {/* LEFT column — always visible on desktop; section-gated on mobile */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Calendar card */}
          {showCalendar && (
            <div className="card rounded-2xl p-3 xs:p-4 md:p-5 slide-up">
              {habits.length === 0 ? (
                <EmptyState onAddHabit={openHabitModal} />
              ) : (
                <CalendarTable onRemove={handleRemove} />
              )}
              <button
                onClick={openHabitModal}
                className="mt-4 w-full py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  border: "1.5px dashed rgba(52,211,153,0.35)",
                  color: "var(--green)",
                  background: "rgba(52,211,153,0.04)",
                  minHeight: 44,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(52,211,153,0.09)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(52,211,153,0.04)")
                }
              >
                <span className="text-lg leading-none">＋</span> Add Habit
              </button>
            </div>
          )}

          {/* Analytics sections */}
          {showAnalytics && (
            <>
              <Collapsible
                title="🧠 Mental State"
                defaultOpen
                storageKey="mentalStatePanel"
              >
                <MentalStatePanel />
              </Collapsible>

              <Collapsible
                title="📈 Daily Progress"
                defaultOpen
                storageKey="progressChartPanel"
              >
                <ProgressChart />
              </Collapsible>

              <Collapsible
                title="🎯 Habit Progress Rings"
                defaultOpen
                storageKey="progressRingsPanel"
              >
                <ProgressRings />
              </Collapsible>

              <Collapsible
                title="⚔️ XP & Level"
                defaultOpen
                storageKey="xpLevelPanel"
              >
                <XPLevelCard />
              </Collapsible>
            </>
          )}
        </div>

        {/* RIGHT column — desktop sidebar (hidden on mobile; shown in drawer instead) */}
        <div className="sidebar-desktop">
          <Sidebar onRemoveHabit={handleRemove} />
        </div>
      </div>

      {/* ── Deep Analytics (full width) ── */}
      <div className="px-0 pt-3 md:pt-5">
        <AnalyticsFooter />
      </div>

      {/* ── Footer ── */}
      <AppFooter />

      {/* ── Mobile bottom nav ── */}
      <MobileBottomNav
        activeSection={activeSection}
        onSection={setActiveSection}
        onOpenHabitModal={openHabitModal}
      />

      {/* ── Mobile sidebar drawer ── */}
      <MobileSidebarDrawer
        isOpen={isMobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRemoveHabit={handleRemove}
      />

      {/* ── Modals ── */}
      <HabitModal
        isOpen={showHabitModal}
        onClose={() => setShowHabitModal(false)}
        onAdd={handleAdd}
      />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthGuard>
      <AppContent />
    </AuthGuard>
  );
}
