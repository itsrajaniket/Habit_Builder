import React, { useState, useEffect } from 'react';

const YEAR = new Date().getFullYear();

const LINKS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    label: 'GitHub',
    href: 'https://github.com/itsrajaniket',
    handle: '@itsrajaniket',
    color: '#e2e8f0',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/itsaniketraj',
    handle: 'itsaniketraj',
    color: '#60a5fa',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    href: 'mailto:aniketrajid@gmail.com',
    handle: 'aniketrajid@gmail.com',
    color: '#34d399',
  },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Open Source', href: 'https://github.com/itsrajaniket' },
];

export default function AppFooter() {
  const [hovered, setHovered] = useState(null);
  const [copied, setCopied]   = useState(false);

  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('aniketrajid@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        marginTop: 8,
      }}
    >
      {/* Main footer body */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 28px' }}>

        {/* Top row — brand + tagline left, links right */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 36 }}>

          {/* Left: Brand */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>🎯</span>
              <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                Habit Builder Kit
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65, margin: 0 }}>
              Build streaks. Build yourself. A free, open-source habit tracker built for people who take their growth seriously.
            </p>

            {/* Location badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 14, padding: '5px 11px', borderRadius: 99,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              fontSize: 11, color: 'var(--text-3)', fontWeight: 600,
            }}>
              <span>📍</span>
              <span>Indore, India</span>
            </div>
          </div>

          {/* Right: Social links */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 12 }}>
              Connect
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LINKS.map((link) => {
                const isEmail  = link.label === 'Email';
                const isHov    = hovered === link.label;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={isEmail ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    onClick={isEmail ? copyEmail : undefined}
                    onMouseEnter={() => setHovered(link.label)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 14px', borderRadius: 10,
                      textDecoration: 'none',
                      background: isHov ? 'var(--surface-2)' : 'var(--surface-1)',
                      border: `1px solid ${isHov ? 'var(--border-hi)' : 'var(--border)'}`,
                      transition: 'all 0.15s',
                      color: isHov ? link.color : 'var(--text-2)',
                      minWidth: 220,
                    }}
                  >
                    <span style={{ color: link.color, opacity: isHov ? 1 : 0.7, flexShrink: 0, display: 'flex' }}>
                      {link.icon}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{link.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto' }}>
                      {isEmail && copied ? '✅ Copied!' : link.handle}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider with glow */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{ height: 1, background: 'var(--border)' }} />
          <div style={{
            position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
            width: 120, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--green), transparent)',
          }} />
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

          {/* Left: copyright + author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              © {YEAR} Habit Builder Kit
            </span>
            <span style={{ color: 'var(--border-hi)', fontSize: 12 }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Made with <span style={{ color: '#e25555' }}>♥</span> by{' '}
              <a
                href="https://linkedin.com/in/itsaniketraj"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                Aniket Raj
              </a>
            </span>
            <span style={{ color: 'var(--border-hi)', fontSize: 12 }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Indore, India 🇮🇳</span>
          </div>

          {/* Right: legal links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {LEGAL_LINKS.map((l, i) => (
              <React.Fragment key={l.label}>
                {i > 0 && <span style={{ color: 'var(--border-hi)', fontSize: 11 }}>·</span>}
                <a
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.13s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  {l.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
