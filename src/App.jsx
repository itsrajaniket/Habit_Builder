import React, { useEffect, useState } from "react";
import AuthGuard from "./features/auth/AuthGuard";
import { ProGate } from "./features/auth/ProGate";
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
import ConfirmModal from "./components/ConfirmModal";
import useHabitStore from "./store/habitStore";
import { useTheme } from "./hooks/useTheme";
import { useConfetti } from "./hooks/useConfetti";
import { todayStr } from "./utils/dateUtils";

// ── Error Boundary ────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("App error boundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
            background: "var(--bg)",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ color: "var(--text-1)", fontWeight: 700, fontSize: 20 }}>
            Something went wrong
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: 14, maxWidth: 360 }}>
            An unexpected error occurred. Your data is safe — please reload the
            page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              background: "rgba(52,211,153,0.12)",
              color: "var(--green)",
              border: "1px solid rgba(52,211,153,0.3)",
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Main App Content ──────────────────────────────────────────────
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
  const [confirm, setConfirm] = useState(null); // { title, message, onConfirm }

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

  // Replaces window.confirm for habit removal
  const handleRemove = (id) => {
    const h = habits.find((x) => x.id === id);
    if (!h) return;
    setConfirm({
      title: `Remove "${h.name}"?`,
      message: "This habit and all its history will be deleted.",
      confirmLabel: "Remove",
      danger: true,
      onConfirm: () => {
        removeHabit(id);
        saveUserData();
        showToast("🗑 Habit removed.");
        setConfirm(null);
      },
    });
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

  return (
    <div className="app-root min-h-screen">
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

      <GlobalNav />
      <CommandBar onOpenToday={() => setShowToday((v) => !v)} />

      {/* ── Banners row ── */}
      {(showToday || streakFreezes > 0) && (
        <div className="px-3 md:px-5 pt-4 flex flex-col gap-2">
          {showToday && <TodayPanel onClose={() => setShowToday(false)} />}

          {streakFreezes > 0 && (
            <div
              className="flex items-center justify-between px-4 py-2.5 rounded-xl slide-up"
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
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
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

      {/* ── Main two-column grid ── */}
      <div className="grid gap-5 px-3 md:px-5 pt-5 pb-0 grid-cols-1 lg:grid-cols-[1fr_340px] items-start">
        {/* LEFT col */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="card rounded-2xl p-5 slide-up">
            {habits.length === 0 ? (
              <EmptyState onAddHabit={() => setShowHabitModal(true)} />
            ) : (
              <CalendarTable onRemove={handleRemove} />
            )}
            <button
              onClick={() => setShowHabitModal(true)}
              className="mt-4 w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                border: "1.5px dashed rgba(52,211,153,0.35)",
                color: "var(--green)",
                background: "rgba(52,211,153,0.04)",
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

          <Collapsible
            title="🧠 Mental State"
            defaultOpen
            storageKey="mentalStatePanel"
          >
            <ProGate feature="analytics">
              <MentalStatePanel />
            </ProGate>
          </Collapsible>
          <Collapsible
            title="📈 Daily Progress"
            defaultOpen
            storageKey="progressChartPanel"
          >
            <ProGate feature="analytics">
              <ProgressChart />
            </ProGate>
          </Collapsible>
          <Collapsible
            title="🎯 Habit Progress Rings"
            defaultOpen
            storageKey="progressRingsPanel"
          >
            <ProGate feature="analytics">
              <ProgressRings />
            </ProGate>
          </Collapsible>
          <Collapsible
            title="⚔️ XP & Level"
            defaultOpen
            storageKey="xpLevelPanel"
          >
            <ProGate feature="xp">
              <XPLevelCard />
            </ProGate>
          </Collapsible>
        </div>

        {/* RIGHT col */}
        <Sidebar onRemoveHabit={handleRemove} />
      </div>

      {/* ── Deep Analytics ── */}
      <div className="px-0 pt-5">
        <ProGate feature="analytics">
          <AnalyticsFooter />
        </ProGate>
      </div>

      <AppFooter />

      <HabitModal
        isOpen={showHabitModal}
        onClose={() => setShowHabitModal(false)}
        onAdd={handleAdd}
      />
      <Toast />

      {/* ── Confirm dialog (replaces window.confirm) ── */}
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthGuard>
        <AppContent />
      </AuthGuard>
    </ErrorBoundary>
  );
}
