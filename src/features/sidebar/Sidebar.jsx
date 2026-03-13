import React from "react";
import StatsBar from "./StatsBar";
import BadgesPanel from "./BadgesPanel";
import HabitAnalysis from "./HabitAnalysis";
import Collapsible from "../../components/ui/Collapsible";
import DataExport from "./DataExport";
import XPLevelCard from "./XPLevelCard";
import useHabitStore from "../../store/habitStore";
import { calcStreak } from "../../utils/streakCalc";
import { CATEGORY_COLORS } from "../../utils/constants";
import { ProGate } from "../auth/ProGate";

function StreaksSection() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const freezeUsedDates = useHabitStore((s) => s.freezeUsedDates);

  const items = habits
    .map((h) => ({ h, s: calcStreak(h.id, completions, freezeUsedDates) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s);

  return (
    <Collapsible
      title="🔥 Current Streaks"
      defaultOpen
      storageKey="streaksBody"
    >
      {items.length === 0 ? (
        <p className="text-xs t3 py-1">
          Start completing habits to build streaks!
        </p>
      ) : (
        <div className="flex flex-col">
          {items.map(({ h, s }) => {
            const cat = CATEGORY_COLORS[h.category] || CATEGORY_COLORS.other;
            return (
              <div
                key={h.id}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-0.5 h-4 rounded-full shrink-0"
                    style={{ background: cat.accent }}
                  />
                  <span className="text-[13px] t1 truncate">
                    {h.emoji} {h.name}
                  </span>
                </div>
                <span
                  className="text-xs font-bold ml-2 shrink-0"
                  style={{ color: "var(--orange)" }}
                >
                  {s}d 🔥
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Collapsible>
  );
}

export default function Sidebar({ onRemoveHabit }) {
  return (
    <aside className="flex flex-col gap-3">
      {/* ── Free features ── */}
      <StatsBar />
      <StreaksSection />

      {/* ── Pro: XP & Level ── */}
      <Collapsible
        title="🏆 XP & Level"
        defaultOpen={false}
        storageKey="xpBody"
      >
        <ProGate feature="xp">
          <XPLevelCard />
        </ProGate>
      </Collapsible>

      {/* ── Pro: Habit Analysis ── */}
      <ProGate feature="analysis">
        <HabitAnalysis onRemove={onRemoveHabit} />
      </ProGate>

      {/* ── Pro: Badges ── */}
      <ProGate feature="badges">
        <BadgesPanel />
      </ProGate>

      {/* ── Pro: Data Export ── */}
      <ProGate feature="export">
        <DataExport />
      </ProGate>
    </aside>
  );
}
