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

function Callout({ children }) {
  return (
    <div style={{
      padding: '14px 18px', borderRadius: 10, marginBottom: 12,
      background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
      fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65,
    }}>
      {children}
    </div>
  );
}

export default function TermsOfService({ onBack }) {
  return (
    <div className="app-root min-h-screen" style={{ paddingBottom: 80 }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: 400, height: 400,
                      borderRadius: '50%', background: 'var(--purple)', opacity: 0.04, filter: 'blur(100px)' }} />
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
            background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
            fontSize: 11, fontWeight: 700, color: 'var(--purple)',
          }}>Legal Document</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-1)',
                       margin: '0 0 12px', letterSpacing: '-0.02em' }}>Terms of Service</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', margin: 0 }}>
            Effective Date: <strong style={{ color: 'var(--text-2)' }}>{DATE}</strong>
            &nbsp;·&nbsp; Developer: <strong style={{ color: 'var(--text-2)' }}>{DEV}</strong>
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <P>These Terms of Service ("Terms") govern your use of Habit Builder Kit ("the App"), developed and operated by {DEV}. By accessing or using the App, you agree to be bound by these Terms and our Privacy Policy.</P>
          <P>If you do not agree with any part of these Terms, you must not use the App.</P>
        </Section>

        <Section title="2. Description of the Service">
          <P>Habit Builder Kit is a personal productivity tool that allows users to:</P>
          <Ul items={[
            "Create and manage personal habit lists with custom categories and boards",
            "Track daily habit completions on a visual calendar grid",
            "Monitor streaks, use streak freezes, and earn XP levels",
            "Log daily mood and motivation scores",
            "View analytics, trends, and progress statistics",
            "Load pre-built habit starter kits",
            "Export and import personal habit data in JSON format",
            "Sync data across devices via cloud storage",
          ]} />
          <P>The App is provided as-is for personal, non-commercial use. We reserve the right to modify, suspend, or discontinue the App or any feature at any time with or without notice.</P>
        </Section>

        <Section title="3. User Accounts">
          <Sub title="3.1 Registration">
            <P>To use the full features of the App, you must create an account with a valid email address and password, or sign in using Google OAuth. You agree to provide accurate information and keep it up to date.</P>
          </Sub>
          <Sub title="3.2 Account Security">
            <P>You are responsible for all activities that occur under your account. You agree to:</P>
            <Ul items={[
              "Use a strong, unique password",
              "Notify us at " + EMAIL + " if you suspect any unauthorised access",
              "Not share your credentials with others",
            ]} />
          </Sub>
          <Sub title="3.3 One Account Per Person">
            <P>Each person may maintain only one account. Creating multiple accounts to circumvent restrictions is prohibited.</P>
          </Sub>
        </Section>

        <Section title="4. Acceptable Use">
          <P>You agree to use the App only for lawful purposes. You must NOT:</P>
          <Ul items={[
            "Use the App for any unlawful, harmful, or fraudulent purpose",
            "Attempt to gain unauthorised access to the App, server, or database",
            "Reverse engineer, decompile, or disassemble any part of the App",
            "Upload viruses, malware, or any malicious code",
            "Scrape or extract data using automated tools",
            "Impersonate any person or entity",
            "Use the App in any way that could disable, overburden, or impair its functioning",
          ]} />
          <P>Violations may result in immediate account termination and, where applicable, legal action.</P>
        </Section>

        <Section title="5. Your Content">
          <P>You retain full ownership of the personal content you create in the App (habit names, notes, mood logs). By using the App, you grant us a limited licence to store and process your content solely to provide the App's functionality to you.</P>
          <P>We are not responsible for the accuracy or appropriateness of your content.</P>
        </Section>

        <Section title="6. Intellectual Property">
          <P>The App, including its design, code, UI, and documentation, is owned by {DEV} and protected by applicable intellectual property laws. You are granted a limited, revocable, non-transferable licence to use the App for personal, non-commercial purposes.</P>
          <P>You may not copy, modify, distribute, sell, or create derivative works from any part of the App without prior written permission.</P>
        </Section>

        <Section title="7. Third-Party Services">
          <P>The App integrates with the following third-party services:</P>
          <Ul items={[
            "Supabase — authentication and database storage (supabase.com/terms)",
            "Google OAuth — optional sign-in via Google accounts (policies.google.com/terms)",
            "Vercel — web hosting (vercel.com/legal/terms)",
          ]} />
          <P>Your use of these services is subject to their respective terms and privacy policies.</P>
        </Section>

        <Section title="8. Disclaimers">
          <Callout>
            THE APP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </Callout>
          <P>Habit Builder Kit is a personal productivity tool only. We make no claims that using the App will improve your health, productivity, finances, or wellbeing.</P>
        </Section>

        <Section title="9. Limitation of Liability">
          <Callout>
            TO THE FULLEST EXTENT PERMITTED BY LAW, {DEV.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR DATA ARISING FROM YOUR USE OF THE APP.
          </Callout>
          <P>In no event shall our total liability exceed the amount you paid us in the past twelve months (which, as the App is currently free, is zero).</P>
        </Section>

        <Section title="10. Indemnification">
          <P>You agree to defend, indemnify, and hold harmless {DEV} from any claims, damages, or expenses arising out of your use of the App, your content, or your violation of these Terms.</P>
        </Section>

        <Section title="11. Termination">
          <P>We may suspend or terminate your account at any time for violation of these Terms. You may terminate your account by contacting us at <a href={`mailto:${EMAIL}`} style={{ color: 'var(--green)' }}>{EMAIL}</a>. Upon termination, your data will be deleted within 30 days.</P>
        </Section>

        <Section title="12. Governing Law">
          <P>These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts in Indore, Madhya Pradesh, India. We encourage resolving disputes informally first by contacting <a href={`mailto:${EMAIL}`} style={{ color: 'var(--green)' }}>{EMAIL}</a>.</P>
        </Section>

        <Section title="13. Changes to These Terms">
          <P>We may update these Terms at any time. Material changes will be reflected in an updated Effective Date. Continued use of the App constitutes acceptance of the revised Terms.</P>
        </Section>

        <Section title="14. Miscellaneous">
          <Sub title="14.1 Entire Agreement">
            <P>These Terms and our Privacy Policy constitute the entire agreement between you and us regarding the App.</P>
          </Sub>
          <Sub title="14.2 Severability">
            <P>If any provision is found unenforceable, the remaining provisions remain in full effect.</P>
          </Sub>
          <Sub title="14.3 No Waiver">
            <P>Failure to enforce any right does not constitute a waiver of that right.</P>
          </Sub>
        </Section>

        <Section title="15. Contact Information">
          <P>Questions about these Terms? Contact us:</P>
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
          These Terms of Service were last updated on {DATE}.
        </p>
      </div>
    </div>
  );
}
