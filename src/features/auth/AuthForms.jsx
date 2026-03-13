// src/features/auth/AuthForms.jsx
import React, { useState, useCallback, useEffect, useId } from "react";
import useHabitStore from "../../store/habitStore";
import { TESTIMONIALS, BENEFIT_BULLETS } from "./landingData";

// --- REUSABLE UI ---
function Field({ label, type, value, onChange, placeholder, children, icon }) {
  const inputId = useId();
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#64748b",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "15px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: icon ? "13px 16px 13px 42px" : "13px 16px",
            borderRadius: "14px",
            fontSize: "14px",
            background: focused ? "rgba(30,41,59,0.9)" : "rgba(15,23,42,0.7)",
            border: focused
              ? "1.5px solid rgba(52,211,153,0.5)"
              : "1.5px solid rgba(51,65,85,0.6)",
            color: "#f1f5f9",
            outline: "none",
            boxShadow: focused
              ? "0 0 0 4px rgba(52,211,153,0.08), 0 4px 12px rgba(0,0,0,0.2)"
              : "0 2px 6px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
        />
        {children}
      </div>
    </div>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div
      style={{
        padding: "11px 14px",
        borderRadius: "12px",
        fontSize: "13px",
        color: "#f87171",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span>⚠️</span>
      {msg}
    </div>
  );
}

function OkBox({ msg }) {
  if (!msg) return null;
  return (
    <div
      style={{
        padding: "11px 14px",
        borderRadius: "12px",
        fontSize: "13px",
        color: "#34d399",
        background: "rgba(52,211,153,0.08)",
        border: "1px solid rgba(52,211,153,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span>✅</span>
      {msg}
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        border: "2px solid rgba(15,23,42,0.2)",
        borderTopColor: "#0f172a",
        animation: "spin 0.6s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

function PrimaryBtn({
  onClick,
  loading,
  loadingText,
  children,
  type = "submit",
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "15px",
        borderRadius: "14px",
        fontSize: "15px",
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        border: "none",
        cursor: loading ? "wait" : "pointer",
        background: loading
          ? "rgba(52,211,153,0.5)"
          : "linear-gradient(135deg, #34d399 0%, #10b981 60%, #059669 100%)",
        color: "#032212",
        boxShadow:
          hov && !loading
            ? "0 0 40px rgba(52,211,153,0.55), 0 8px 25px rgba(52,211,153,0.3), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 0 20px rgba(52,211,153,0.25), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        transform: hov && !loading ? "translateY(-2px) scale(1.01)" : "none",
        transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
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

function GoogleBtn({ onClick, loading }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        fontSize: "14px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: loading ? "wait" : "pointer",
        background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        color: "#e2e8f0",
        border: "1.5px solid rgba(255,255,255,0.12)",
        boxShadow: hov
          ? "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        transform: hov ? "translateY(-1px)" : "none",
        transition: "all 0.2s ease",
      }}
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
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(51,65,85,0.6))",
        }}
      />
      <span
        style={{
          fontSize: "11px",
          color: "#475569",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        or
      </span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, rgba(51,65,85,0.6), transparent)",
        }}
      />
    </div>
  );
}

// --- FORMS ---
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
    setLoading(false);
  };
  const handleGoogle = async () => {
    setGLoading(true);
    const r = await loginWithGoogle();
    if (!r.success) setError(r.error);
    setGLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
    >
      <GoogleBtn onClick={handleGoogle} loading={gLoading} />
      <Divider />
      <Field
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        icon="✉️"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#64748b",
            }}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => onSwitch("forgot")}
            style={{
              fontSize: "11px",
              color: "#34d399",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Forgot?
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <Field
            label=""
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            icon="🔑"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              padding: 0,
            }}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      <ErrBox msg={error} />
      <PrimaryBtn loading={loading} loadingText="Signing in…">
        Sign In →
      </PrimaryBtn>
      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          color: "#64748b",
          margin: "4px 0 0",
        }}
      >
        No account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("signup")}
          style={{
            color: "#34d399",
            fontWeight: 800,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Create one free
        </button>
      </p>
    </form>
  );
}

function SignUpForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const signup = useHabitStore((s) => s.signup);
  const loginWithGoogle = useHabitStore((s) => s.loginWithGoogle);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await signup(email.trim(), password, username.trim());
    if (!r.success) setError(r.error);
    setLoading(false);
  };
  const handleGoogle = async () => {
    setGLoading(true);
    const r = await loginWithGoogle();
    if (!r.success) setError(r.error);
    setGLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
    >
      <GoogleBtn onClick={handleGoogle} loading={gLoading} />
      <Divider />
      <Field
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="habitmaster007"
        icon="🧑"
      />
      <Field
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        icon="✉️"
      />
      <Field
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Min 6 characters"
        icon="🔑"
      />
      <ErrBox msg={error} />
      <PrimaryBtn loading={loading} loadingText="Creating account…">
        🚀 Start for Free
      </PrimaryBtn>
      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          color: "#64748b",
          margin: "4px 0 0",
        }}
      >
        Already a member?{" "}
        <button
          type="button"
          onClick={() => onSwitch("signin")}
          style={{
            color: "#34d399",
            fontWeight: 800,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

function ForgotForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const resetPassword = useHabitStore((s) => s.resetPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk("");
    const r = await resetPassword(email.trim());
    if (r.success) setOk("Reset link sent! Check your inbox.");
    else setError(r.error);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
    >
      <Field
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        icon="✉️"
      />
      <ErrBox msg={error} />
      <OkBox msg={ok} />
      <PrimaryBtn loading={loading} loadingText="Sending…">
        Send Reset Link
      </PrimaryBtn>
      <button
        type="button"
        onClick={() => onSwitch("signin")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "13px",
          color: "#64748b",
          textAlign: "center",
          marginTop: "4px",
        }}
      >
        ← Back to Sign In
      </button>
    </form>
  );
}

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [anim, setAnim] = useState(false);
  const go = useCallback(
    (next) => {
      setDir(next > idx ? 1 : -1);
      setAnim(true);
      setTimeout(() => {
        setIdx(next);
        setAnim(false);
      }, 200);
    },
    [idx],
  );
  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, [idx, go]);
  const t = TESTIMONIALS[idx];

  return (
    <div
      style={{
        padding: "28px 32px",
        borderRadius: "20px",
        background: "rgba(15,23,42,0.6)",
        border: "1px solid rgba(51,65,85,0.4)",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "20px",
          fontSize: "60px",
          color: "rgba(52,211,153,0.08)",
          fontFamily: "Georgia,serif",
          lineHeight: 1,
        }}
      >
        "
      </div>
      <div
        style={{
          opacity: anim ? 0 : 1,
          transform: anim ? `translateX(${dir * 20}px)` : "none",
          transition: "opacity 0.2s, transform 0.2s",
        }}
      >
        <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
          {"★★★★★".split("").map((s, i) => (
            <span key={i} style={{ color: "#f59e0b", fontSize: "14px" }}>
              {s}
            </span>
          ))}
        </div>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#cbd5e1",
            margin: "0 0 20px",
            fontStyle: "italic",
          }}
        >
          "{t.quote}"
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>{t.avatar}</span>
          <div>
            <div
              style={{ fontSize: "13px", fontWeight: 800, color: "#f1f5f9" }}
            >
              {t.name}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{t.role}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "20px" }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === idx ? "20px" : "6px",
              height: "6px",
              borderRadius: "99px",
              background: i === idx ? "#34d399" : "rgba(51,65,85,0.6)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// --- MAIN EXPORTED COMPONENT ---
export default function AuthView({ view, setView }) {
  const TITLES = {
    signin: "Welcome back",
    signup: "Join the builders",
    forgot: "Reset password",
  };
  const SUBTITLES = {
    signin: "Your streak is waiting for you.",
    signup: "Free forever. No credit card.",
    forgot: "We'll email you a reset link.",
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          flex: "0 0 460px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <button
          onClick={() => setView("landing")}
          style={{
            position: "absolute",
            top: "28px",
            left: "28px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(51,65,85,0.5)",
            borderRadius: "99px",
            padding: "6px 14px 6px 10px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 700,
            color: "#94a3b8",
            backdropFilter: "blur(10px)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(51,65,85,0.7)";
            e.currentTarget.style.color = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(30,41,59,0.6)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M7.5 2L3.5 6L7.5 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>{" "}
          Back to home
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "48px",
            marginTop: "12px",
          }}
        >
          <span style={{ fontSize: "22px" }}>🎯</span>
          <span style={{ fontWeight: 900, fontSize: "14px", color: "#94a3b8" }}>
            Habit Builder Kit
          </span>
        </div>
        <div
          style={{ marginBottom: "32px", animation: "fadeUp 0.5s ease both" }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 900,
              color: "#f1f5f9",
              margin: "0 0 6px",
            }}
          >
            {TITLES[view]}
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {SUBTITLES[view]}
          </p>
        </div>
        <div style={{ animation: "fadeUp 0.5s ease 0.05s both" }}>
          {view === "signin" && <SignInForm onSwitch={setView} />}
          {view === "signup" && <SignUpForm onSwitch={setView} />}
          {view === "forgot" && <ForgotForm onSwitch={setView} />}
        </div>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            animation: "fadeUp 0.5s ease 0.1s both",
          }}
        >
          {BENEFIT_BULLETS.map((b) => (
            <div
              key={b.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#475569",
              }}
            >
              <span>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.5) 0%, rgba(8,13,24,0.8) 100%)",
          borderLeft: "1px solid rgba(51,65,85,0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 40px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "60%",
            height: "40%",
            background:
              "radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            animation: "fadeUp 0.7s ease 0.15s both",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#34d399",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            ✦ What awaits you inside
          </p>
          <TestimonialCarousel />
          <div
            style={{
              marginTop: "24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            {[
              { icon: "🔥", v: "47d", l: "avg streak" },
              { icon: "⚔️", v: "Lv.50", l: "max level" },
              { icon: "🏆", v: "12", l: "achievements" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  textAlign: "center",
                  padding: "14px 10px",
                  borderRadius: "14px",
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(51,65,85,0.4)",
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>
                  {s.icon}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    color: "#f1f5f9",
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    marginTop: "2px",
                    fontWeight: 600,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
