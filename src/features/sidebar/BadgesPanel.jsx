import React from "react";
import Collapsible from "../../components/ui/Collapsible";
import useHabitStore from "../../store/habitStore";
import { BADGES } from "../../utils/constants";
import { getEarnedBadges } from "../../utils/statsCalc";

export default function BadgesPanel() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const freezeUsedDates = useHabitStore((s) => s.freezeUsedDates);
  const earned = getEarnedBadges(habits, completions, freezeUsedDates);

  return (
    <Collapsible
      title="🏆 Achievements"
      defaultOpen={false}
      storageKey="badgesBody"
    >
      <div
        style={{
          display: "grid",
          /* auto-fill means it picks the best column count for available width:
             on mobile sidebar (~300px) → 4 cols; in mobile drawer → 5–6 cols */
          gridTemplateColumns: "repeat(auto-fill, minmax(58px, 1fr))",
          gap: 6,
        }}
      >
        {BADGES.map((b) => {
          const e = earned.includes(b.id);
          return (
            <div
              key={b.id}
              title={b.desc}
              aria-label={`${b.name}${e ? " — earned" : " — locked"}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 4px",
                borderRadius: 12,
                transition: "all 0.15s",
                background: e ? "rgba(245,158,11,0.1)" : "var(--surface-1)",
                border: `1px solid ${e ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
                opacity: e ? 1 : 0.38,
                filter: e ? "none" : "grayscale(0.7)",
                /* Touch target */
                minHeight: 56,
                cursor: "default",
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{b.icon}</span>
              <span
                style={{
                  fontSize: 9,
                  textAlign: "center",
                  lineHeight: 1.3,
                  color: "var(--text-2)",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {b.name}
              </span>
            </div>
          );
        })}
      </div>
    </Collapsible>
  );
}
