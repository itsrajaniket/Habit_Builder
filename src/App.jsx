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

/* ── Reliable mobile detection using matchMedia ── */
function useIsMobile(maxWidth = 767) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    // Set immediately after mount (avoids SSR mismatch)
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
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
            {!tab.isAction && (
              <span style={{ fontSize: 9, marginTop: 1 }}>{tab.label}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ── Mobile sidebar drawer ── */
function MobileSidebarDrawer({ isOpen, onClose, onRemoveHabit }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="mobile-drawer-overlay"
          style={{ display: "block" }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`mobile-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Sidebar"
        aria-modal="true"
      >
        <div className="mobile-drawer-header">
          <span className="text-sm font-bold t1">📊 Analysis & Data</span>
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ width: 36, height: 36, fontSize: 18 }}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "0 12px 24px" }}>
          <Sidebar onRemoveHabit={onRemoveHabit} />
        </div>
      </div>
    </>
  );
}

/* ── Main app content ── */
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
  /* Default section: calendar */
  const [activeSection, setActiveSection] = useState("calendar");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useIsMobile(767);
  const { canvasRef, trigger: triggerConfetti } = useConfetti();
  useTheme();

  /* Perfect day confetti */
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

  /* Keep Today panel in sync with nav section */
  useEffect(() => {
    if (!isMobile) return;
    if (activeSection === "today") {
      setShowToday(true);
    } else {
      setShowToday(false);
    }
    if (activeSection === "sidebar") {
      setDrawerOpen(true);
      /* Reset so tapping "More" again re-opens drawer */
      setActiveSection("calendar");
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

  /*
    On mobile we show ONE section at a time to avoid the giant
    "everything stacked" problem.
    On desktop all sections are visible in the two-column layout.
  */
  const showCalendar = !isMobile || activeSection === "calendar";
  const showAnalytics = !isMobile || activeSection === "analytics";

  return (
    <div
      className="app-root mobile-page-clearance"
      style={{ minHeight: "100dvh", background: "var(--bg-app)" }}
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

      {/* ── Top nav ── */}
      <GlobalNav onOpenSidebar={() => setDrawerOpen(true)} />

      {/* ── Filter / board bar ── */}
      <CommandBar
        onOpenToday={() => {
          setShowToday((v) => !v);
          if (isMobile) setActiveSection("today");
        }}
      />

      {/* ── Banners ── */}
      {(showToday || streakFreezes > 0) && (
        <div style={{ padding: "12px 12px 0" }} className="flex flex-col gap-2">
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
              className="flex items-center justify-between rounded-xl freeze-banner"
              style={{
                padding: "10px 14px",
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
                style={{
                  padding: "6px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "rgba(96,165,250,0.15)",
                  color: "var(--blue)",
                  border: "1px solid rgba(96,165,250,0.2)",
                  cursor: "pointer",
                  minHeight: 36,
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                Use Today
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Main two-column layout ── */}
      <div
        className="main-two-col"
        style={{
          display: "grid",
          /*
            Mobile: single column.
            Desktop: content + 340px sidebar.
            The !important on the CSS rule handles this,
            but we also set it inline for JS-driven isMobile.
          */
          gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
          gap: 16,
          padding: isMobile ? "12px 10px" : "16px 20px",
        }}
      >
        {/* ── LEFT column ── */}
        <div className="flex flex-col gap-4" style={{ minWidth: 0 }}>
          {/* Calendar card — only on calendar tab (mobile) */}
          {showCalendar && (
            <div
              className="card rounded-2xl"
              style={{ padding: isMobile ? "12px" : "20px" }}
            >
              {habits.length === 0 ? (
                <EmptyState onAddHabit={openHabitModal} />
              ) : (
                <CalendarTable onRemove={handleRemove} />
              )}
              <button
                onClick={openHabitModal}
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "12px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  border: "1.5px dashed rgba(52,211,153,0.35)",
                  color: "var(--green)",
                  background: "rgba(52,211,153,0.04)",
                  cursor: "pointer",
                  minHeight: 48,
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(52,211,153,0.09)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(52,211,153,0.04)")
                }
              >
                <span style={{ fontSize: 18 }}>＋</span> Add Habit
              </button>
            </div>
          )}

          {/* Analytics sections — only on analytics tab (mobile) */}
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

        {/* ── RIGHT column — desktop sidebar only ── */}
        {!isMobile && (
          <div className="sidebar-desktop">
            <Sidebar onRemoveHabit={handleRemove} />
          </div>
        )}
      </div>

      {/* ── Deep Analytics (full width) ── */}
      <div style={{ paddingTop: 8 }}>
        <AnalyticsFooter />
      </div>

      {/* ── Footer ── */}
      <AppFooter />

      {/* ── Mobile bottom nav — rendered always, CSS hides on desktop ── */}
      <MobileBottomNav
        activeSection={activeSection}
        onSection={setActiveSection}
        onOpenHabitModal={openHabitModal}
      />

      {/* ── Mobile sidebar drawer ── */}
      <MobileSidebarDrawer
        isOpen={drawerOpen}
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
