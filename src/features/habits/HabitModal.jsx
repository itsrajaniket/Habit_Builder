import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { EMOJIS, BOARDS, CATEGORIES, HABIT_KITS } from '../../utils/constants';
import useHabitStore from '../../store/habitStore';
import { showToast } from '../../components/ui/Toast';

// ─── KIT CARD ─────────────────────────────────────────────────
function KitCard({ kit, onLoad }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onLoad(kit)}
      style={{
        cursor: 'pointer',
        borderRadius: 14,
        padding: '14px 16px',
        background: hov ? `${kit.color}12` : 'var(--surface-1)',
        border: `1px solid ${hov ? kit.color + '45' : 'var(--border)'}`,
        transition: 'all 0.18s',
        '--kit-glow': kit.glow,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{kit.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: hov ? kit.color : 'var(--text-1)' }}>{kit.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{kit.description}</div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
          background: `${kit.color}18`, color: kit.color,
          border: `1px solid ${kit.color}30`, whiteSpace: 'nowrap',
        }}>
          {kit.habits.length} habits
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {kit.habits.slice(0, 4).map(h => (
          <span key={h.name} style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 99,
            background: 'var(--surface-2)', color: 'var(--text-3)',
            border: '1px solid var(--border)',
          }}>
            {h.emoji} {h.name}
          </span>
        ))}
        {kit.habits.length > 4 && (
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, color: 'var(--text-3)' }}>
            +{kit.habits.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
}

// ─── MAIN MODAL ───────────────────────────────────────────────
export default function HabitModal({ isOpen, onClose, onAdd }) {
  const [tab, setTab]             = useState('custom'); // 'custom' | 'kits'
  const [name, setName]           = useState('');
  const [emoji, setEmoji]         = useState('⏰');
  const [category, setCategory]   = useState('health');
  const [board, setBoard]         = useState('all');
  const [nameError, setNameError] = useState(false);

  const addHabit     = useHabitStore(s => s.addHabit);
  const saveUserData = useHabitStore(s => s.saveUserData);
  const habits       = useHabitStore(s => s.habits);
  const isPro        = useHabitStore(s => s.isPro);

  const isLimitReached = !isPro && habits.length >= 5;

  const [showPricing, setShowPricing] = useState(false);
  const [PricingModalComponent, setPricingModalComponent] = useState(null);

  const handleUpgradeClick = async () => {
    if (!PricingModalComponent) {
      const mod = await import('../../components/PricingModal');
      setPricingModalComponent(() => mod.default);
    }
    setShowPricing(true);
  };

  const handleAdd = () => {
    if (isLimitReached) return;
    if (!name.trim()) { setNameError(true); setTimeout(() => setNameError(false), 2000); return; }
    onAdd(name.trim(), emoji, category, board);
    setName(''); setEmoji('⏰'); setCategory('health'); setBoard('all');
    onClose();
  };

  const handleLoadKit = (kit) => {
    if (!isPro && habits.length + kit.habits.length > 5) {
      showToast(`Free plan limit (5 habits) exceeded. Upgrade to Pro to add this kit.`, 'error');
      handleUpgradeClick();
      return;
    }
    kit.habits.forEach(h => addHabit(h.name, h.emoji, h.category, h.board));
    saveUserData();
    showToast(`${kit.icon} ${kit.name} kit loaded — ${kit.habits.length} habits added!`);
    onClose();
  };

  const handleClose = () => { setName(''); setNameError(false); setTab('custom'); onClose(); };

  const pillCls = (active, color) => ({
    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    background: active ? (color ? `${color}20` : 'rgba(52,211,153,0.15)') : 'var(--surface-1)',
    color: active ? (color || 'var(--green)') : 'var(--text-3)',
    border: `1px solid ${active ? (color ? color + '40' : 'rgba(52,211,153,0.35)') : 'var(--border)'}`,
    transition: 'all 0.15s',
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Habit">
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, padding: '2px', borderRadius: 10,
                    background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
        {[
          { key: 'custom', label: '✏️ Custom', },
          { key: 'kits',   label: '📦 Starter Kits', },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: tab === t.key ? 'var(--bg-card-hi)' : 'transparent',
              color: tab === t.key ? 'var(--text-1)' : 'var(--text-3)',
              boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CUSTOM TAB ── */}
      {tab === 'custom' && (
        <>
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.1em', color: 'var(--text-3)' }}>Habit Name</label>
            <input
              type="text" placeholder="e.g., Morning Exercise"
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
              style={{
                padding: '10px 14px', borderRadius: 10, fontSize: 13, outline: 'none',
                background: nameError ? 'rgba(239,68,68,0.06)' : 'var(--surface-2)',
                border: `1px solid ${nameError ? 'rgba(239,68,68,0.5)' : 'var(--border-hi)'}`,
                color: 'var(--text-1)', transition: 'all 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(52,211,153,0.5)'}
              onBlur={e => e.target.style.borderColor = nameError ? 'rgba(239,68,68,0.5)' : 'var(--border-hi)'}
            />
            {nameError && <p style={{ fontSize: 11, color: '#f87171', margin: 0 }}>⚠️ Please enter a habit name</p>}
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.1em', color: 'var(--text-3)' }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                <div key={c.value} style={pillCls(category === c.value)} onClick={() => setCategory(c.value)}>
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* Board */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.1em', color: 'var(--text-3)' }}>Board</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {BOARDS.map(b => (
                <div key={b.value} style={pillCls(board === b.value)} onClick={() => setBoard(b.value)}>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.1em', color: 'var(--text-3)' }}>Icon</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4,
                          maxHeight: 120, overflowY: 'auto' }}>
              {EMOJIS.map(em => (
                <div key={em} onClick={() => setEmoji(em)}
                  style={{
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 8, cursor: 'pointer', fontSize: 16, transition: 'all 0.12s',
                    background: emoji === em ? 'rgba(52,211,153,0.2)' : 'transparent',
                    border: `1px solid ${emoji === em ? 'rgba(52,211,153,0.4)' : 'transparent'}`,
                  }}
                >{em}</div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleClose} className="btn-ghost flex-1 py-2 rounded-xl text-sm font-semibold">Cancel</button>
            {isLimitReached ? (
              <button onClick={handleUpgradeClick}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 13, fontWeight: 800,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#fff', border: 'none', cursor: 'pointer',
                  boxShadow: '0 0 18px rgba(139,92,246,0.4)',
                }}>
                ⭐ Upgrade to Add More
              </button>
            ) : (
              <button onClick={handleAdd}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 13, fontWeight: 800,
                  background: 'var(--green)', color: '#000', border: 'none', cursor: 'pointer',
                  boxShadow: '0 0 18px var(--green-glow)',
                }}>
                ＋ Add Habit
              </button>
            )}
          </div>
        </>
      )}

      {/* ── KITS TAB ── */}
      {tab === 'kits' && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>
            Load a pre-built pack and start tracking immediately. You can edit or remove any habit after loading.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8,
                        maxHeight: 420, overflowY: 'auto', paddingRight: 2 }}>
            {HABIT_KITS.map(kit => (
              <KitCard key={kit.id} kit={kit} onLoad={handleLoadKit} />
            ))}
          </div>
          <button onClick={handleClose} className="btn-ghost w-full py-2 rounded-xl text-sm font-semibold">
            Cancel
          </button>
        </>
      )}
      {/* Pricing Modal Overlay */}
      {showPricing && PricingModalComponent && (
        <PricingModalComponent onClose={() => setShowPricing(false)} />
      )}
    </Modal>
  );
}
