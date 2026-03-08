import React, { useState } from 'react';
import { HABIT_KITS } from '../../utils/constants';
import useHabitStore from '../../store/habitStore';
import { showToast } from '../../components/ui/Toast';

function KitCard({ kit, onLoad }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onLoad(kit)}
      style={{
        cursor: 'pointer', borderRadius: 14, padding: '14px',
        background: hov ? `${kit.color}10` : 'var(--surface-1)',
        border: `1px solid ${hov ? kit.color + '40' : 'var(--border)'}`,
        transition: 'all 0.18s', transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? `0 8px 24px ${kit.glow}` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>{kit.icon}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: hov ? kit.color : 'var(--text-1)' }}>{kit.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{kit.description}</div>
        </div>
        <div style={{
          marginLeft: 'auto', fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 99,
          background: `${kit.color}18`, color: kit.color,
        }}>{kit.habits.length} habits</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {kit.habits.slice(0, 3).map(h => (
          <span key={h.name} style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 99,
            background: 'var(--surface-2)', color: 'var(--text-3)',
          }}>{h.emoji} {h.name}</span>
        ))}
        {kit.habits.length > 3 && (
          <span style={{ fontSize: 10, padding: '2px 7px', color: 'var(--text-3)' }}>
            +{kit.habits.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

export default function EmptyState({ onAddHabit }) {
  const addHabit     = useHabitStore(s => s.addHabit);
  const saveUserData = useHabitStore(s => s.saveUserData);

  const handleLoadKit = (kit) => {
    kit.habits.forEach(h => addHabit(h.name, h.emoji, h.category, h.board));
    saveUserData();
    showToast(`${kit.icon} ${kit.name} kit loaded — ${kit.habits.length} habits added!`);
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🎯</div>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-1)', margin: '0 0 6px' }}>
          Start your habit journey
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0, lineHeight: 1.6 }}>
          Pick a starter kit to load habits instantly, or build your own from scratch.
        </p>
      </div>

      {/* Kit grid */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 10 }}>
          ⚡ Quick Start — pick a kit
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {HABIT_KITS.map(kit => (
            <KitCard key={kit.id} kit={kit} onLoad={handleLoadKit} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>or start from scratch</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Custom button */}
      <button onClick={onAddHabit}
        style={{
          width: '100%', padding: '11px 0', borderRadius: 12,
          fontSize: 13, fontWeight: 800, cursor: 'pointer',
          background: 'transparent', color: 'var(--green)',
          border: '1.5px dashed rgba(52,211,153,0.4)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.07)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        ＋ Add Custom Habit
      </button>
    </div>
  );
}
