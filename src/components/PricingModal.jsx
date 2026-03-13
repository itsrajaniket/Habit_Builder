import { useState, useEffect } from "react";
import useHabitStore from "../store/habitStore";
import { useRazorpay } from "../hooks/useRazorpay";

const PLANS = {
  weekly: {
    id: "weekly",
    label: "1 Week Trial",
    price: "₹11",
    subtext: "try it for a week",
    badge: null,
  },
  lifetime: {
    id: "lifetime",
    label: "Lifetime",
    price: "₹99",
    subtext: "pay once, own forever",
    badge: "Best Value",
  },
};

const PRO_FEATURES = [
  { icon: "📈", label: "Analytics & Mental State Charts" },
  { icon: "🏆", label: "XP & Level System" },
  { icon: "📊", label: "Deep Habit Analysis" },
  { icon: "💾", label: "Data Export (CSV / JSON)" },
  { icon: "🏅", label: "Achievements & Badges" },
];

const FREE_FEATURES = [
  { icon: "✅", label: "Unlimited habits" },
  { icon: "✅", label: "Calendar view" },
  { icon: "✅", label: "Basic streaks" },
];

export default function PricingModal({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("lifetime");
  const [toast, setToast] = useState(null);

  const currentUser = useHabitStore((s) => s.currentUser);
  const currentUserId = useHabitStore((s) => s.currentUserId);
  const isPro = useHabitStore((s) => s.isPro);
  const proPlan = useHabitStore((s) => s.proPlan);
  const proExpiresAt = useHabitStore((s) => s.proExpiresAt);
  const refreshProStatus = useHabitStore((s) => s.refreshProStatus);

  const { initiatePayment, loading } = useRazorpay();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpgrade = async () => {
    if (!currentUserId) {
      showToast("Please log in first.", "error");
      return;
    }

    try {
      await initiatePayment(selectedPlan, {
        id: currentUserId,
        email: currentUser,
      });

      // Refresh pro status from DB — retries up to 3x internally
      await refreshProStatus();
      showToast("🎉 Welcome to Pro! All features are now unlocked.");

      // Reload the page after toast so all ProGate components
      // re-render with the new isPro = true state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      if (err.message === "Payment dismissed") return;
      showToast(err.message || "Payment failed. Please try again.", "error");
    }
  };

  const formatExpiry = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Plan label shown in "Active plan:" section
  const planDisplayName =
    proPlan === "lifetime"
      ? "Lifetime"
      : proPlan === "weekly"
        ? "1-Week Trial"
        : proPlan;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* ── Modal card ── */}
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          style={{
            maxWidth: 480,
            background: "linear-gradient(160deg, #0f0f1a 0%, #12101f 100%)",
          }}
        >
          {/* Top accent line */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #a78bfa, transparent)",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-white/10 hover:text-white"
            aria-label="Close pricing modal"
          >
            ✕
          </button>

          <div className="p-6 pb-0">
            {/* Header */}
            <div className="mb-5 text-center">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                ⭐ Habit Builder Pro
              </div>
              <h2
                className="text-2xl font-bold text-white"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: -0.5,
                }}
              >
                {isPro ? "You're on Pro 🎉" : "Unlock your full potential"}
              </h2>
              {!isPro && (
                <p className="mt-1 text-sm text-gray-400">
                  Everything you need to build lasting habits
                </p>
              )}
            </div>

            {/* ── ALREADY PRO ── */}
            {isPro ? (
              <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-center text-sm text-violet-200">
                  Active plan:{" "}
                  <span className="font-semibold capitalize">
                    {planDisplayName}
                  </span>
                </p>
                {proExpiresAt && proPlan !== "lifetime" && (
                  <p className="mt-1 text-center text-xs text-gray-400">
                    Expires on {formatExpiry(proExpiresAt)}
                  </p>
                )}
                {proPlan === "lifetime" && (
                  <p className="mt-1 text-center text-xs text-gray-400">
                    Never expires ✨
                  </p>
                )}
                <div className="mt-4 space-y-2">
                  {PRO_FEATURES.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <span>{f.icon}</span>
                      <span>{f.label}</span>
                      <span className="ml-auto text-xs text-violet-400">
                        ✓ Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* ── Free vs Pro columns ── */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Free
                    </p>
                    <div className="space-y-1.5">
                      {FREE_FEATURES.map((f) => (
                        <div
                          key={f.label}
                          className="flex items-start gap-1.5 text-xs text-gray-400"
                        >
                          <span className="mt-px">{f.icon}</span>
                          <span>{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
                      Pro
                    </p>
                    <div className="space-y-1.5">
                      {PRO_FEATURES.map((f) => (
                        <div
                          key={f.label}
                          className="flex items-start gap-1.5 text-xs text-gray-300"
                        >
                          <span className="mt-px">{f.icon}</span>
                          <span>{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Plan selector ── */}
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {Object.values(PLANS).map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative rounded-xl border p-3 text-left transition-all ${
                        selectedPlan === plan.id
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 right-2 rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {plan.badge}
                        </span>
                      )}
                      <p className="text-xs text-gray-400">{plan.label}</p>
                      <p className="text-lg font-bold text-white">
                        {plan.price}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {plan.subtext}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="p-6 pt-3">
            {!isPro ? (
              <>
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    boxShadow: "0 0 24px rgba(139,92,246,0.4)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    `Upgrade to Pro — ${PLANS[selectedPlan].price}`
                  )}
                </button>
                <p className="mt-3 text-center text-[11px] text-gray-600">
                  Secure payment via Razorpay
                  {selectedPlan === "weekly" && " · Auto-expires after 7 days"}
                  {selectedPlan === "lifetime" &&
                    " · One-time payment, no subscription"}
                </p>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-white/10 py-2.5 text-sm text-gray-400 transition hover:border-white/20 hover:text-white"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-2xl transition-all ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
          style={{ whiteSpace: "nowrap" }}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
