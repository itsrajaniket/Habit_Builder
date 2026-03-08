import React from 'react';

const DATE  = "March 8, 2026";
const EMAIL = "aniketrajid@gmail.com";
const DEV   = "Aniket Raj";

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontSize: 20, fontWeight: 800, color: 'var(--text-1)',
        margin: '0 0 14px', paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
      }}>{title}</h2>
      {children}
    </section>
  );
}

function Sub({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 8px' }}>{title}</h3>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, margin: '0 0 12px' }}>{children}</p>;
}

function Ul({ items }) {
  return (
    <ul style={{ margin: '0 0 12px', paddingLeft: 24 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="app-root min-h-screen" style={{ paddingBottom: 80 }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: 400, height: 400,
                      borderRadius: '50%', background: 'var(--green)', opacity: 0.04, filter: 'blur(100px)' }} />
      </div>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '14px 24px',
                      display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700,
            color: 'var(--text-2)', cursor: 'pointer',
          }}>← Back</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-1)' }}>Habit Builder Kit</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 0', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 99, marginBottom: 16,
            background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
            fontSize: 11, fontWeight: 700, color: 'var(--green)',
          }}>Legal Document</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-1)',
                       margin: '0 0 12px', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', margin: 0 }}>
            Effective Date: <strong style={{ color: 'var(--text-2)' }}>{DATE}</strong>
            &nbsp;·&nbsp; Developer: <strong style={{ color: 'var(--text-2)' }}>{DEV}</strong>
          </p>
        </div>

        <Section title="1. Introduction">
          <P>Welcome to Habit Builder Kit ("the App"), developed and operated by {DEV}. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our habit tracking application.</P>
          <P>By creating an account or using the App, you agree to the collection and use of information in accordance with this Privacy Policy.</P>
        </Section>

        <Section title="2. Information We Collect">
          <Sub title="2.1 Account Information">
            <P>When you create an account, we collect:</P>
            <Ul items={[
              "Email address (used as your unique identifier)",
              "Password (stored as a secure hash — we never store your plain-text password)",
              "Account creation date and last login timestamp",
            ]} />
          </Sub>
          <Sub title="2.2 App Usage Data">
            <P>As you use the App, we store data you voluntarily provide:</P>
            <Ul items={[
              "Habit names, icons, categories, and boards you create",
              "Daily habit completion records (which habits you checked and on which dates)",
              "Mood and motivation ratings you log",
              "Daily notes and journal entries",
              "Streak counts and streak freeze usage",
              "App preferences (theme, board filters, calendar view)",
            ]} />
          </Sub>
          <Sub title="2.3 Technical Data">
            <P>We automatically collect limited technical information:</P>
            <Ul items={[
              "Browser type and version",
              "Device type (desktop, mobile, tablet)",
              "General geographic region (country-level only, derived from IP address)",
              "Error logs and crash reports to help us fix bugs",
            ]} />
            <P>We do not collect precise location data, device identifiers, or sensitive personal information.</P>
          </Sub>
        </Section>

        <Section title="3. How We Use Your Information">
          <P>We use collected data solely to provide and improve the App:</P>
          <Ul items={[
            "To create and authenticate your account",
            "To store and sync your habit data across devices",
            "To calculate streaks, XP levels, and analytics shown in the App",
            "To send transactional emails (account confirmation, password reset)",
            "To diagnose technical problems and improve performance",
            "To comply with applicable legal obligations",
          ]} />
          <P>We do NOT use your data for advertising, sell it to third parties, or use it to train AI models.</P>
        </Section>

        <Section title="4. Data Storage and Security">
          <P>Your data is stored using Supabase, a SOC 2 Type II compliant cloud database platform with encryption at rest and in transit (TLS 1.2+). Your browser's localStorage also caches data for offline access.</P>
          <P>Security measures include:</P>
          <Ul items={[
            "Passwords are hashed using bcrypt — we cannot read your password",
            "All data transmission uses HTTPS/TLS encryption",
            "Row Level Security (RLS) ensures you can only access your own data",
            "Authentication tokens are short-lived and automatically refreshed",
          ]} />
        </Section>

        <Section title="5. Google Sign-In (OAuth)">
          <P>If you sign in using Google, we receive your email address, Google account identifier, and display name only. We do not access your Google Drive, Gmail, contacts, or any other Google services.</P>
          <P>By using Google Sign-In, you also agree to <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>Google's Privacy Policy</a>.</P>
        </Section>

        <Section title="6. Data Sharing and Third Parties">
          <P>We do not sell, trade, or rent your personal information. We share data only with these service providers:</P>
          <Ul items={[
            "Supabase (database and authentication) — supabase.com/privacy",
            "Vercel (app hosting) — vercel.com/legal/privacy-policy",
          ]} />
          <P>We may disclose information if required by law or to protect the rights and safety of others.</P>
        </Section>

        <Section title="7. Data Retention and Deletion">
          <P>We retain your data while your account is active. Upon account deletion, all personal information and habit data is permanently removed within 30 days.</P>
          <P>To request deletion, email <a href={`mailto:${EMAIL}`} style={{ color: 'var(--green)' }}>{EMAIL}</a> with subject "Account Deletion Request" from your registered address.</P>
        </Section>

        <Section title="8. Children's Privacy">
          <P>The App is not directed at children under 13. We do not knowingly collect personal information from children under 13. Contact us immediately if you believe we have inadvertently done so.</P>
        </Section>

        <Section title="9. Your Rights">
          <P>You may have the following rights regarding your personal data:</P>
          <Ul items={[
            "Access: Request a copy of the personal data we hold about you",
            "Correction: Request correction of inaccurate or incomplete data",
            "Deletion: Request deletion of your account and all associated data",
            "Portability: Export your habit data in JSON format via the built-in export feature",
          ]} />
          <P>To exercise any rights, contact <a href={`mailto:${EMAIL}`} style={{ color: 'var(--green)' }}>{EMAIL}</a>.</P>
        </Section>

        <Section title="10. Cookies and Local Storage">
          <P>The App uses authentication cookies set by Supabase to maintain your login session, and localStorage to cache habit data for faster loading. We do not use advertising cookies, tracking pixels, or third-party analytics.</P>
        </Section>

        <Section title="11. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. We will update the Effective Date when significant changes are made. Continued use of the App constitutes acceptance of the revised policy.</P>
        </Section>

        <Section title="12. Contact Us">
          <P>Questions about this Privacy Policy? Contact us:</P>
          <div style={{
            padding: '20px 24px', borderRadius: 12,
            background: 'var(--surface-1)', border: '1px solid var(--border)',
          }}>
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{DEV}</p>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-2)' }}>
              📧 <a href={`mailto:${EMAIL}`} style={{ color: 'var(--green)' }}>{EMAIL}</a>
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-3)' }}>📍 Indore, Madhya Pradesh, India</p>
          </div>
        </Section>

        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 48, fontStyle: 'italic' }}>
          This Privacy Policy was last updated on {DATE}.
        </p>
      </div>
    </div>
  );
}
