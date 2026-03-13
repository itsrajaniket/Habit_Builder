import { useState } from "react";
import useHabitStore from "../../store/habitStore";

// Metadata for each gateable feature
const FEATURE_META = {
  analytics: {
    icon: "📈",
    title: "Analytics",
    desc: "Mental state tracking, progress charts & rings",
  },
  xp: {
    icon: "🏆",
    title: "XP & Level System",
    desc: "Earn XP, level up and track your growth",
  },
  analysis: {
    icon: "📊",
    title: "Habit Analysis",
    desc: "Deep insights into your habit patterns",
  },
  export: {
    icon: "💾",
    title: "Data Export",
    desc: "Export all your data as CSV or JSON",
  },
  badges: {
    icon: "🏅",
    title: "Achievements",
    desc: "Unlock badges and celebrate milestones",
  },
};

function LockOverlay({ feature, onUpgrade }) {
  const meta = FEATURE_META[feature] || {
    icon: "⭐",
    title: "Pro Feature",
    desc: "Upgrade to unlock this feature",
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl">
      {/* Frosted glass backdrop */}
      <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-[3px]" />

      {/* Upgrade card */}
      <div
        className="relative z-10 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-gray-900/90 px-6 py-5 text-center shadow-2xl"
        style={{ maxWidth: 260 }}
      >
        {/* Icon with glow ring */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-2xl ring-1 ring-violet-400/40">
          {meta.icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{meta.title}</p>
          <p className="mt-0.5 text-xs text-gray-400">{meta.desc}</p>
        </div>

        <button
          onClick={onUpgrade}
          className="mt-1 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-900/50 transition hover:bg-violet-500 active:scale-95"
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

/**
 * Usage:
 *   <ProGate feature="analytics"><MentalStatePanel /></ProGate>
 *   <ProGate feature="xp"><XPLevelCard /></ProGate>
 *   <ProGate feature="analysis"><HabitAnalysis /></ProGate>
 *   <ProGate feature="export"><DataExport /></ProGate>
 *   <ProGate feature="badges"><BadgesPanel /></ProGate>
 *
 * Pro users → children rendered normally
 * Free users → blurred preview + upgrade prompt overlay
 */
export function ProGate({ children, feature }) {
  const isPro = useHabitStore((s) => s.isPro);
  const [showPricing, setShowPricing] = useState(false);
  const [PricingModal, setPricingModal] = useState(null);

  // Pro users: render children as-is
  if (isPro) return <>{children}</>;

  // Free users: show blurred preview + lock overlay
  const handleUpgradeClick = async () => {
    // Lazy-load PricingModal to avoid circular dependency issues
    if (!PricingModal) {
      const mod = await import("../../components/PricingModal");
      setPricingModal(() => mod.default);
    }
    setShowPricing(true);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Blurred content preview */}
        <div
          className="pointer-events-none select-none"
          style={{ filter: "blur(4px)", opacity: 0.3 }}
          aria-hidden="true"
        >
          {children}
        </div>

        <LockOverlay feature={feature} onUpgrade={handleUpgradeClick} />
      </div>

      {/* PricingModal rendered OUTSIDE the blurred container */}
      {showPricing && PricingModal && (
        <PricingModal onClose={() => setShowPricing(false)} />
      )}
    </>
  );
}

export default ProGate;
