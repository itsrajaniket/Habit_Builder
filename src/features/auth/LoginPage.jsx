import React, { useState, useEffect, useId } from "react";
import useHabitStore from "../../store/habitStore";

// ─── ONBOARDING DATA ──────────────────────────────────────────
const STEPS = [
  {
    icon: "🎯",
    title: "Track every habit",
    desc: "A beautiful calendar grid shows your completions at a glance. Month, week, or daily views.",
  },
  {
    icon: "🔥",
    title: "Build streaks",
    desc: "Streaks and freezes keep you on track even on rough days. Momentum is everything.",
  },
  {
    icon: "🧠",
    title: "Know yourself",
    desc: "Mood, motivation, XP levels, deep analytics — understand your patterns and grow.",
  },
];

const FEATURES = [
  { icon: "📅", label: "Calendar grid" },
  { icon: "🔥", label: "Streak tracking" },
  { icon: "🧠", label: "Mental state" },
  { icon: "📈", label: "Deep analytics" },
  { icon: "⚔️", label: "XP & levels" },
  { icon: "🏆", label: "Achievements" },
  { icon: "📦", label: "Habit kits" },
  { icon: "☁️", label: "Cloud sync" },
];

// ─── SHARED UI COMPONENTS ─────────────────────────────────────
function Field({ label, type, value, onChange, placeholder, children }) {
  const inputId = useId(); // a11y fix: auto-generate unique IDs
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-[11px] font-bold uppercase tracking-wider text-slate-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full px-4 py-3 rounded-xl text-sm bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
        />
        {children}
      </div>
    </div>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="px-4 py-3 rounded-xl text-xs text-red-400 bg-red-500/10 border border-red-500/20">
      {msg}
    </div>
  );
}

function OkBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="px-4 py-3 rounded-xl text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
      {msg}
    </div>
  );
}

function NeonBtn({ onClick, loading, loadingText, children, type = "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 ${
        loading
          ? "bg-emerald-500/50 text-slate-900 cursor-wait"
          : "bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 hover:from-emerald-300 hover:to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] cursor-pointer"
      }`}
    >
      {loading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
  );
}

function GoogleBtn({ onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700 transition-all duration-200"
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 39.5 16.3 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l6.2 5.2C36.9 40 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"
        />
      </svg>
      {loading ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-slate-800" />
      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
        or
      </span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>
  );
}

function AuthCard({ children }) {
  // Glassmorphism wrapper
  return (
    <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
      {children}
    </div>
  );
}

// ─── AUTHENTICATION FORMS ─────────────────────────────────────
function SignInForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const login = useHabitStore((s) => s.login);
  const loginWithGoogle = useHabitStore((s) => s.loginWithGoogle);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await login(email.trim(), password);
    if (!r.success) setError(r.error);
    setLoading(false); // Fix: always clear loading state
  };

  const handleGoogle = async () => {
    setGLoading(true);
    const r = await loginWithGoogle();
    if (!r.success) setError(r.error);
    setGLoading(false); // Fix: always clear loading state
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <button
              type="button"
              onClick={() => onSwitch("forgot")}
              className="text-[11px] text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Field
              label=""
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <ErrBox msg={error} />
        <NeonBtn loading={loading} loadingText="Signing in…">
          Sign In →
        </NeonBtn>
        <Divider />
        <GoogleBtn onClick={handleGoogle} loading={gLoading} />
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        No account yet?{" "}
        <button
          onClick={() => onSwitch("signup")}
          className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
        >
          Create one →
        </button>
      </p>
    </AuthCard>
  );
}

function SignUpForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [showPass, setShow] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoad] = useState(false);

  const signup = useHabitStore((s) => s.signup);
  const loginWithGoogle = useHabitStore((s) => s.loginWithGoogle);

  const strength = !pass
    ? 0
    : pass.length < 6
      ? 1
      : pass.length < 10
        ? 2
        : /[A-Z]/.test(pass) && /\d/.test(pass)
          ? 4
          : 3;
  const strengthLabel = ["", "Too short", "Weak", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-500 text-red-500",
    "bg-amber-500 text-amber-500",
    "bg-emerald-400 text-emerald-400",
    "bg-emerald-500 text-emerald-500",
  ][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass !== conf) {
      setError("Passwords do not match.");
      return;
    }
    if (pass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setOk("");
    const r = await signup(email.trim(), pass);
    if (r.success) {
      setOk(
        r.confirmed
          ? "🎉 Account created! Loading dashboard…"
          : "📧 Check your inbox to confirm your email.",
      );
    } else {
      setError(r.error);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGLoad(true);
    const r = await loginWithGoogle();
    if (!r.success) setError(r.error);
    setGLoad(false);
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Password
          </label>
          <div className="relative">
            <Field
              label=""
              type={showPass ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Minimum 6 characters"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          {pass && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strengthColor.split(" ")[0]}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-bold min-w-[48px] ${strengthColor.split(" ")[1]}`}
              >
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        <Field
          label="Confirm Password"
          type={showPass ? "text" : "password"}
          value={conf}
          onChange={(e) => setConf(e.target.value)}
          placeholder="Repeat your password"
        />

        <ErrBox msg={error} />
        <OkBox msg={ok} />

        <NeonBtn loading={loading} loadingText="Creating account…">
          Create Account →
        </NeonBtn>
        <Divider />
        <GoogleBtn onClick={handleGoogle} loading={gLoading} />
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        Already have an account?{" "}
        <button
          onClick={() => onSwitch("signin")}
          className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
        >
          Sign in →
        </button>
      </p>
    </AuthCard>
  );
}

function ForgotForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPasswordReset = useHabitStore((s) => s.sendPasswordReset);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    const r = await sendPasswordReset(email.trim());
    r.success
      ? setOk("📧 Reset link sent! Check your inbox.")
      : setError(r.error);
    setLoading(false);
  };

  return (
    <AuthCard>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        Enter your email and we will send you a password reset link.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <ErrBox msg={error} />
        <OkBox msg={ok} />
        <NeonBtn loading={loading} loadingText="Sending…">
          Send Reset Link
        </NeonBtn>
      </form>
      <p className="text-center mt-6">
        <button
          onClick={() => onSwitch("signin")}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          ← Back to Sign In
        </button>
      </p>
    </AuthCard>
  );
}

// ─── ONBOARDING WIZARD ────────────────────────────────────────
function OnboardView({ onDone }) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  useEffect(() => {
    const t = setTimeout(() => {
      if (step < STEPS.length - 1) setStep((n) => n + 1);
    }, 2800);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="max-w-md w-full text-center animate-fade-in-up">
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {step + 1} of {STEPS.length}
        </span>
      </div>
      <div className="p-10 rounded-3xl mb-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
        <div className="text-6xl mb-6">{s.icon}</div>
        <h2 className="text-2xl font-black text-slate-100 mb-3 tracking-tight">
          {s.title}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed m-0">{s.desc}</p>
      </div>

      <div className="flex gap-2 justify-center mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ease-out ${i === step ? "w-6 bg-emerald-400" : "w-1.5 bg-slate-800"}`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDone}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          Skip
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((n) => n + 1)}
            className="flex-[2] py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onDone}
            className="flex-[2] py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all"
          >
            Let's go! 🚀
          </button>
        )}
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────
function LandingView({ onGetStarted, onSignIn }) {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Container */}
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between py-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <span className="font-black text-base text-slate-100 tracking-tight">
              Habit Builder Kit
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onSignIn}
              className="px-5 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all"
            >
              Get Started →
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center py-20 pb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            ✨ Cloud sync · real auth · offline-first
          </div>

          <h1 className="text-[clamp(36px,6vw,64px)] font-black leading-[1.1] text-slate-100 mb-6 tracking-tight">
            Build habits that
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.4)]">
              actually stick
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Track streaks, log your mood, earn XP, and understand your patterns
            — all synced to the cloud.
          </p>

          {/* SIMPLIFIED CTA SECTION */}
          <div className="flex flex-col items-center gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-10 py-4 rounded-2xl text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-105 transition-transform duration-200"
            >
              🚀 Start for Free
            </button>

            {/* Optional: A very subtle text link for mobile users who might miss the top nav */}
            <button
              onClick={onSignIn}
              className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors mt-2"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
        {/* Feature chips */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-16">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300"
            >
              <span>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-slate-800/50 mb-16 bg-slate-900/40 backdrop-blur-sm">
          {[
            { v: "6 Kits", l: "Starter packs", c: "text-emerald-400" },
            { v: "50+", l: "XP levels", c: "text-amber-400" },
            { v: "∞", l: "Streaks", c: "text-cyan-400" },
          ].map(({ v, l, c }, i) => (
            <div
              key={l}
              className={`py-8 px-5 text-center ${i < 2 ? "border-r border-slate-800/50" : ""}`}
            >
              <div className={`text-3xl font-black mb-1.5 ${c}`}>{v}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────
const TITLES = {
  signin: "Welcome back",
  signup: "Create your account",
  forgot: "Reset password",
};

export default function LoginPage() {
  const [view, setView] = useState("landing"); // 'landing' | 'onboard' | 'signin' | 'signup' | 'forgot'

  // Shared Background Layout
  const BaseLayout = ({ children }) => (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans selection:bg-emerald-500/30 relative flex items-center justify-center">
      {/* Ambient glowing orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[90px]" />
      </div>
      {children}
    </div>
  );

  if (view === "landing")
    return (
      <BaseLayout>
        <LandingView
          onGetStarted={() => setView("onboard")}
          onSignIn={() => setView("signin")}
        />
      </BaseLayout>
    );
  if (view === "onboard")
    return (
      <BaseLayout>
        <OnboardView onDone={() => setView("signup")} />
      </BaseLayout>
    );

  return (
    <BaseLayout>
      <div className="w-full max-w-[390px] px-4 relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="text-[40px] mb-3">🎯</div>
          <h1 className="text-2xl font-black text-slate-100 mb-1 tracking-tight">
            {TITLES[view]}
          </h1>
          <p className="text-sm text-slate-400">Habit Builder Kit</p>
        </div>

        {view === "signin" && <SignInForm onSwitch={setView} />}
        {view === "signup" && <SignUpForm onSwitch={setView} />}
        {view === "forgot" && <ForgotForm onSwitch={setView} />}

        <button
          onClick={() => setView("landing")}
          className="block mx-auto mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium"
        >
          ← Back to home
        </button>
      </div>
    </BaseLayout>
  );
}
