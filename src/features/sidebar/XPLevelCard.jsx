import React from 'react';
import useHabitStore from '../../store/habitStore';
import { fmt, daysInMonth } from '../../utils/dateUtils';
import { calcStreak } from '../../utils/streakCalc';

// ─── SIMPLE XP RULES (shown to user) ─────────────────────────
// +10 XP   per habit completed today
// +5  XP   bonus if that habit has a streak ≥ 3
// +25 XP   bonus for a perfect day (all habits done)
// Resets monthly — race each month fresh

const XP_HABIT   = 10;
const XP_STREAK  = 5;
const XP_PERFECT = 25;

// Simple flat levels: every 100 XP = 1 level, capped at 50
const XP_PER_LEVEL = 200;
const MAX_LEVEL    = 50;

const TIERS = [
  { minLv: 1,  maxLv: 5,  name: 'Novice',    icon: '🌱', color: '#94a3b8' },
  { minLv: 6,  maxLv: 15, name: 'Builder',   icon: '⚡', color: '#60a5fa' },
  { minLv: 16, maxLv: 30, name: 'Ninja',     icon: '🥷', color: '#a78bfa' },
  { minLv: 31, maxLv: 45, name: 'Master',    icon: '🏆', color: '#fbbf24' },
  { minLv: 46, maxLv: 50, name: 'Architect', icon: '🧘', color: '#34d399' },
];

function getTier(level) {
  return TIERS.find(t => level >= t.minLv && level <= t.maxLv) || TIERS[0];
}

export default function XPLevelCard() {
  const completions    = useHabitStore(s => s.completions);
  const habits         = useHabitStore(s => s.habits);
  const freezeUsedDates = useHabitStore(s => s.freezeUsedDates);

  // Monthly XP — only current month
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const dim   = daysInMonth(year, month);

  let totalXP = 0;
  for (let d = 1; d <= dim; d++) {
    const ds       = fmt(year, month + 1, d);
    const doneList = habits.filter(h => completions[h.id]?.[ds]);
    const perfect  = doneList.length === habits.length && habits.length > 0;

    doneList.forEach(h => {
      totalXP += XP_HABIT;
      const streak = calcStreak(h.id, completions, freezeUsedDates);
      if (streak >= 3) totalXP += XP_STREAK;
    });
    if (perfect) totalXP += XP_PERFECT;
  }

  const level   = Math.min(MAX_LEVEL, Math.floor(totalXP / XP_PER_LEVEL) + 1);
  const tier    = getTier(level);
  const xpInLv  = totalXP % XP_PER_LEVEL;
  const pct     = Math.round((xpInLv / XP_PER_LEVEL) * 100);
  const toNext  = XP_PER_LEVEL - xpInLv;

  // Today's XP
  const todayDs   = fmt(year, month + 1, now.getDate());
  const todayDone = habits.filter(h => completions[h.id]?.[todayDs]);
  const perfect   = todayDone.length === habits.length && habits.length > 0;
  let todayXP     = todayDone.length * XP_HABIT;
  todayDone.forEach(h => { if (calcStreak(h.id, completions, freezeUsedDates) >= 3) todayXP += XP_STREAK; });
  if (perfect) todayXP += XP_PERFECT;

  return (
    <div style={{ padding: '16px 18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 28 }}>{tier.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: tier.color }}>Lv.{level}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{tier.name}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
            {totalXP.toLocaleString()} XP this month
          </div>
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
          background: `${tier.color}18`, color: tier.color, border: `1px solid ${tier.color}30`,
        }}>
          {toNext} to next
        </div>
      </div>

      {/* XP Bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>
            {xpInLv} / {XP_PER_LEVEL} XP
          </span>
          <span style={{ fontSize: 10, color: tier.color, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${tier.color}aa, ${tier.color})`,
            transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: `0 0 8px ${tier.color}50`,
          }} />
        </div>
      </div>

      {/* Today + Simple rules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{ textAlign: 'center', padding: '10px 8px', borderRadius: 10,
                      background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--green)' }}>+{todayXP}</div>
          <div style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's XP</div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px 8px', borderRadius: 10,
                      background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: tier.color }}>{level}/{MAX_LEVEL}</div>
          <div style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Level</div>
        </div>
      </div>

      {/* How XP works */}
      <div style={{
        padding: '10px 12px', borderRadius: 10,
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        fontSize: 11, color: 'var(--text-3)', lineHeight: 1.7,
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-2)', marginBottom: 4, fontSize: 10,
                      textTransform: 'uppercase', letterSpacing: '0.08em' }}>How XP works</div>
        {[
          [`+${XP_HABIT} XP`, 'per habit completed'],
          [`+${XP_STREAK} XP`, 'if streak ≥ 3 days'],
          [`+${XP_PERFECT} XP`, 'perfect day bonus'],
          [`${XP_PER_LEVEL} XP`, '= 1 level up'],
        ].map(([bold, rest]) => (
          <div key={bold} style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontWeight: 700, color: tier.color, minWidth: 48 }}>{bold}</span>
            <span>{rest}</span>
          </div>
        ))}
        <div style={{ marginTop: 4, color: 'var(--text-3)', fontSize: 10 }}>Resets on the 1st of each month</div>
      </div>
    </div>
  );
}
