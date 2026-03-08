import React, { useState, useEffect } from 'react';
import useHabitStore from '../../store/habitStore';

// ─── ONBOARDING ───────────────────────────────────────────────
const STEPS = [
  { icon: '🎯', title: 'Track every habit', desc: 'A beautiful calendar grid shows your completions at a glance. Month, week, or daily views.' },
  { icon: '🔥', title: 'Build streaks',      desc: 'Streaks and freezes keep you on track even on rough days. Momentum is everything.' },
  { icon: '🧠', title: 'Know yourself',      desc: 'Mood, motivation, XP levels, deep analytics — understand your patterns and grow.' },
];

const FEATURES = [
  { icon: '📅', label: 'Calendar grid' }, { icon: '🔥', label: 'Streak tracking' },
  { icon: '🧠', label: 'Mental state' },  { icon: '📈', label: 'Deep analytics' },
  { icon: '⚔️', label: 'XP & levels' },  { icon: '🏆', label: 'Achievements' },
  { icon: '📦', label: 'Habit kits' },    { icon: '☁️', label: 'Cloud sync' },
];

// ─── SHARED STYLES ────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
  background: 'var(--surface-2)', border: '1px solid var(--border-hi)',
  color: 'var(--text-1)', transition: 'border-color 0.15s',
};

const labelStyle = {
  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: 'var(--text-3)',
};

function Field({ label, type, value, onChange, placeholder, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(52,211,153,0.55)'}
          onBlur={e  => e.target.style.borderColor = 'var(--border-hi)'}
        />
        {children}
      </div>
    </div>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 12,
                  color: '#f87171', background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)' }}>
      {msg}
    </div>
  );
}

function OkBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 12,
                  color: '#34d399', background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.2)' }}>
      {msg}
    </div>
  );
}

function GreenBtn({ onClick, loading, loadingText, children, type = 'submit' }) {
  return (
    <button type={type} onClick={onClick} disabled={loading}
      style={{
        width: '100%', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 800,
        background: loading ? 'rgba(52,211,153,0.5)' : 'var(--green)',
        color: '#000', border: 'none', cursor: loading ? 'wait' : 'pointer',
        boxShadow: '0 0 24px var(--green-glow)', transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
      {loading
        ? <><Spinner />{loadingText}</>
        : children}
    </button>
  );
}

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
      border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}

function GoogleBtn({ onClick, loading }) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      style={{
        width: '100%', padding: '12px 0', borderRadius: 12, fontSize: 13, fontWeight: 700,
        background: 'var(--surface-2)', color: 'var(--text-1)',
        border: '1px solid var(--border-hi)', cursor: loading ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l6.2 5.2C36.9 40 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/>
      </svg>
      {loading ? 'Redirecting…' : 'Continue with Google'}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>or</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

// ─── AUTH CARD WRAPPER ────────────────────────────────────────
function AuthCard({ children }) {
  return (
    <div style={{
      padding: '32px 28px', borderRadius: 20,
      background: 'var(--bg-card-hi)', border: '1px solid var(--border-hi)',
      boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
    }}>
      {children}
    </div>
  );
}

// ─── SIGN IN ──────────────────────────────────────────────────
function SignInForm({ onSwitch }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const login           = useHabitStore(s => s.login);
  const loginWithGoogle = useHabitStore(s => s.loginWithGoogle);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const r = await login(email.trim(), password);
    if (!r.success) { setError(r.error); setLoading(false); }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    const r = await loginWithGoogle();
    if (!r.success) { setError(r.error); setGLoading(false); }
    // on success browser redirects — no need to setGLoading(false)
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={labelStyle}>Password</label>
            <button type="button" onClick={() => onSwitch('forgot')}
              style={{ fontSize: 11, color: 'var(--green)', background: 'none',
                       border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Forgot password?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Your password" required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(52,211,153,0.55)'}
              onBlur={e  => e.target.style.borderColor = 'var(--border-hi)'}
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                       background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
                       color: 'var(--text-3)' }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <ErrBox msg={error} />

        <GreenBtn loading={loading} loadingText="Signing in…">Sign In →</GreenBtn>
        <Divider />
        <GoogleBtn onClick={handleGoogle} loading={gLoading} />
      </form>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 20 }}>
        No account yet?{' '}
        <button onClick={() => onSwitch('signup')}
          style={{ color: 'var(--green)', background: 'none', border: 'none',
                   cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
          Create one →
        </button>
      </p>
    </AuthCard>
  );
}

// ─── SIGN UP ──────────────────────────────────────────────────
function SignUpForm({ onSwitch }) {
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [conf, setConf]       = useState('');
  const [showPass, setShow]   = useState(false);
  const [error, setError]     = useState('');
  const [ok, setOk]           = useState('');
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoad]  = useState(false);

  const signup          = useHabitStore(s => s.signup);
  const loginWithGoogle = useHabitStore(s => s.loginWithGoogle);

  const strength = !pass ? 0 : pass.length < 6 ? 1 : pass.length < 10 ? 2 : /[A-Z]/.test(pass) && /\d/.test(pass) ? 4 : 3;
  const strengthLabel = ['', 'Too short', 'Weak', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#34d399', '#10b981'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass !== conf) { setError('Passwords do not match.'); return; }
    if (pass.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError(''); setOk('');
    const r = await signup(email.trim(), pass);
    if (r.success) {
      if (r.confirmed) {
        setOk('🎉 Account created! Loading your dashboard…');
      } else {
        setOk('📧 ' + (r.message || 'Check your inbox to confirm your email.'));
        setLoading(false);
      }
    } else {
      setError(r.error); setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoad(true);
    const r = await loginWithGoogle();
    if (!r.success) { setError(r.error); setGLoad(false); }
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} value={pass}
              onChange={e => setPass(e.target.value)} placeholder="Minimum 6 characters" required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(52,211,153,0.55)'}
              onBlur={e  => e.target.style.borderColor = 'var(--border-hi)'}
            />
            <button type="button" onClick={() => setShow(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                       background: 'none', border: 'none', cursor: 'pointer',
                       fontSize: 16, color: 'var(--text-3)' }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
          {pass && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 99, transition: 'all 0.3s',
                              width: `${(strength / 4) * 100}%`, background: strengthColor }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: strengthColor, minWidth: 48 }}>
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        <Field label="Confirm Password" type={showPass ? 'text' : 'password'} value={conf}
          onChange={e => setConf(e.target.value)} placeholder="Repeat your password" />

        <ErrBox msg={error} />
        <OkBox  msg={ok}    />

        <GreenBtn loading={loading} loadingText="Creating account…">Create Account →</GreenBtn>
        <Divider />
        <GoogleBtn onClick={handleGoogle} loading={gLoading} />
      </form>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 20 }}>
        Already have an account?{' '}
        <button onClick={() => onSwitch('signin')}
          style={{ color: 'var(--green)', background: 'none', border: 'none',
                   cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
          Sign in →
        </button>
      </p>
    </AuthCard>
  );
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────
function ForgotForm({ onSwitch }) {
  const [email, setEmail]     = useState('');
  const [ok, setOk]           = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const sendPasswordReset = useHabitStore(s => s.sendPasswordReset);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setOk('');
    const r = await sendPasswordReset(email.trim());
    if (r.success) {
      setOk('📧 Reset link sent! Check your inbox.');
    } else {
      setError(r.error);
    }
    setLoading(false);
  };

  return (
    <AuthCard>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 18, lineHeight: 1.6 }}>
        Enter your email and we will send you a password reset link.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <ErrBox msg={error} />
        <OkBox  msg={ok}    />
        <GreenBtn loading={loading} loadingText="Sending…">Send Reset Link</GreenBtn>
      </form>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 20 }}>
        <button onClick={() => onSwitch('signin')}
          style={{ color: 'var(--green)', background: 'none', border: 'none',
                   cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
          ← Back to Sign In
        </button>
      </p>
    </AuthCard>
  );
}

// ─── ONBOARDING WIZARD ───────────────────────────────────────
function OnboardView({ onDone }) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  useEffect(() => {
    const t = setTimeout(() => {
      if (step < STEPS.length - 1) setStep(n => n + 1);
    }, 2800);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }} className="slide-up">
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                       letterSpacing: '0.1em', color: 'var(--text-3)' }}>
          {step + 1} of {STEPS.length}
        </span>
      </div>
      <div style={{
        padding: '48px 40px', borderRadius: 24, marginBottom: 28,
        background: 'var(--bg-card)', border: '1px solid var(--border-hi)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{s.icon}</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-1)',
                     margin: '0 0 12px', letterSpacing: '-0.02em' }}>{s.title}</h2>
        <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: 6, borderRadius: 99, transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            width: i === step ? 20 : 6, background: i === step ? 'var(--green)' : 'var(--surface-3)',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onDone} className="btn-ghost"
          style={{ flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 13, fontWeight: 600 }}>
          Skip
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(n => n + 1)}
            style={{ flex: 2, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 800,
                     background: 'var(--green)', color: '#000', border: 'none', cursor: 'pointer',
                     boxShadow: '0 0 20px var(--green-glow)' }}>
            Next →
          </button>
        ) : (
          <button onClick={onDone}
            style={{ flex: 2, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 800,
                     background: 'var(--green)', color: '#000', border: 'none', cursor: 'pointer',
                     boxShadow: '0 0 20px var(--green-glow)' }}>
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
    <div className="app-root min-h-screen" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { top: '-10%', left: '-5%',  w: 500, c: 'var(--green)',  o: 0.05, blur: 120 },
          { bottom: '10%', right: '-5%', w: 400, c: 'var(--purple)', o: 0.06, blur: 100 },
          { top: '40%', right: '20%', w: 300, c: 'var(--orange)', o: 0.04, blur: 90 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            top: b.top, left: b.left, bottom: b.bottom, right: b.right,
            width: b.w, height: b.w,
            background: b.c, opacity: b.o, filter: `blur(${b.blur}px)`,
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🎯</span>
            <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--text-1)' }}>Habit Builder Kit</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onSignIn} className="btn-ghost"
              style={{ padding: '8px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600 }}>
              Sign In
            </button>
            <button onClick={onGetStarted}
              style={{ padding: '8px 20px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                       background: 'var(--green)', color: '#000', border: 'none', cursor: 'pointer',
                       boxShadow: '0 0 20px var(--green-glow)' }}>
              Get Started →
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '72px 0 48px' }} className="slide-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99, marginBottom: 28,
            background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
            fontSize: 12, fontWeight: 700, color: 'var(--green)',
          }}>
            ✨ Cloud sync · real auth · offline-first
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1,
            color: 'var(--text-1)', margin: '0 0 20px', letterSpacing: '-0.03em',
          }}>
            Build habits that<br />
            <span style={{ color: 'var(--green)', textShadow: '0 0 40px var(--green-glow)' }}>
              actually stick
            </span>
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.65 }}>
            Track streaks, log your mood, earn XP, and understand your patterns — all synced to the cloud.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted}
              style={{ padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 800,
                       background: 'var(--green)', color: '#000', border: 'none', cursor: 'pointer',
                       boxShadow: '0 0 32px var(--green-glow)', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              🚀 Start for Free
            </button>
            <button onClick={onSignIn} className="btn-ghost"
              style={{ padding: '14px 28px', borderRadius: 14, fontSize: 15, fontWeight: 700 }}>
              Sign In
            </button>
          </div>
        </div>

        {/* Feature chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 56 }}>
          {FEATURES.map(f => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 99, background: 'var(--surface-1)', border: '1px solid var(--border)',
              fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
            }}>
              <span>{f.icon}</span>{f.label}
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 56,
        }}>
          {[
            { v: '6 Kits', l: 'Starter habit packs', c: 'var(--green)'  },
            { v: '50+',    l: 'XP levels to climb',  c: 'var(--orange)' },
            { v: '∞',      l: 'Streaks to build',    c: 'var(--purple)' },
          ].map(({ v, l, c }, i) => (
            <div key={l} style={{ padding: '28px 20px', textAlign: 'center',
                                  background: 'var(--bg-card)',
                                  borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: c, marginBottom: 6 }}>{v}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 64 }}>
          <button onClick={onSignIn}
            style={{ padding: '12px 28px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                     background: 'var(--surface-2)', color: 'var(--text-2)',
                     border: '1px solid var(--border)', cursor: 'pointer' }}>
            Already have an account? Sign in →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────
const TITLES = { signin: 'Welcome back', signup: 'Create your account', forgot: 'Reset password' };

export default function LoginPage() {
  const [view, setView] = useState('landing'); // 'landing' | 'onboard' | 'signin' | 'signup' | 'forgot'

  // Shared auth card layout (signin / signup / forgot)
  const renderAuthView = () => (
    <div className="app-root min-h-screen flex items-center justify-center px-4">
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '25%', left: '30%', width: 400, height: 400,
                      borderRadius: '50%', background: 'var(--green)', opacity: 0.05, filter: 'blur(110px)' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: 300, height: 300,
                      borderRadius: '50%', background: 'var(--purple)', opacity: 0.05, filter: 'blur(90px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 390, position: 'relative' }} className="slide-up">
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎯</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-1)',
                       margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            {TITLES[view]}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>Habit Builder Kit</p>
        </div>

        {view === 'signin'  && <SignInForm  onSwitch={setView} />}
        {view === 'signup'  && <SignUpForm  onSwitch={setView} />}
        {view === 'forgot'  && <ForgotForm  onSwitch={setView} />}

        <button onClick={() => setView('landing')}
          style={{ display: 'block', margin: '20px auto 0', background: 'none', border: 'none',
                   cursor: 'pointer', fontSize: 12, color: 'var(--text-3)' }}>
          ← Back to home
        </button>
      </div>
    </div>
  );

  if (view === 'landing')  return <LandingView onGetStarted={() => setView('onboard')} onSignIn={() => setView('signin')} />;
  if (view === 'onboard')  return (
    <div className="app-root min-h-screen flex items-center justify-center px-4">
      <OnboardView onDone={() => setView('signup')} />
    </div>
  );
  return renderAuthView();
}
