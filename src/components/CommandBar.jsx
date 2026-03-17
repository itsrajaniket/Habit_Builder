import React, { useState } from 'react';
import useHabitStore from '../store/habitStore';
import { BOARDS, CATEGORIES } from '../utils/constants';

export default function CommandBar({ onOpenToday }) {
  const activeBoard       = useHabitStore(s => s.activeBoard);
  const activeCategory    = useHabitStore(s => s.activeCategory);
  const setActiveBoard    = useHabitStore(s => s.setActiveBoard);
  const setActiveCategory = useHabitStore(s => s.setActiveCategory);
  const saveUserData      = useHabitStore(s => s.saveUserData);
  const [showFilters, setShowFilters] = useState(false);

  const hasFilter = activeBoard !== 'all' || activeCategory !== 'all';

  const clearAll = () => {
    setActiveBoard('all');
    setActiveCategory('all');
    saveUserData();
  };

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Main bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', flexWrap: 'wrap',
      }}>
        {/* Board quick pills — just the 4 boards, compact */}
        <div style={{ display: 'flex', gap: 4, flex: '1 1 auto', overflowX: 'auto', paddingBottom: 1, minWidth: 160 }} className="scrollbar-hide">
          {BOARDS.map(b => {
            const active = activeBoard === b.value;
            return (
              <button key={b.value}
                onClick={() => { setActiveBoard(b.value); saveUserData(); }}
                style={{
                  padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                  whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.15s',
                  background: active ? 'rgba(52,211,153,0.15)' : 'var(--surface-1)',
                  color: active ? 'var(--green)' : 'var(--text-3)',
                  border: `1px solid ${active ? 'rgba(52,211,153,0.35)' : 'var(--border)'}`,
                }}>
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
            background: hasFilter && activeCategory !== 'all' ? 'rgba(52,211,153,0.1)' : 'var(--surface-1)',
            color: hasFilter && activeCategory !== 'all' ? 'var(--green)' : 'var(--text-3)',
            border: `1px solid ${hasFilter && activeCategory !== 'all' ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`,
            cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
          }}>
          {showFilters ? '▲' : '▼'} Category
          {activeCategory !== 'all' && (
            <span style={{
              background: 'var(--green)', color: '#000',
              borderRadius: 99, width: 14, height: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 900,
            }}>1</span>
          )}
        </button>

        {/* Clear button — only visible when something is active */}
        {hasFilter && (
          <button onClick={clearAll}
            style={{
              padding: '5px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700,
              background: 'rgba(239,68,68,0.08)', color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', flexShrink: 0,
            }}>
            ✕ Clear
          </button>
        )}

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border-hi)', flexShrink: 0 }} />

        {/* Today CTA */}
        <button onClick={onOpenToday}
          style={{
            padding: '6px 16px', borderRadius: 99, fontSize: 11, fontWeight: 800,
            background: 'var(--green)', color: '#000', border: 'none', cursor: 'pointer',
            boxShadow: '0 0 14px var(--green-glow)', flexShrink: 0,
          }}>
          ☀️ Today
        </button>
      </div>

      {/* Category filter drawer — slides open */}
      {showFilters && (
        <div style={{
          display: 'flex', gap: 5, padding: '6px 20px 10px', flexWrap: 'wrap',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface-1)',
          animation: 'fadeIn 0.15s ease',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
                         textTransform: 'uppercase', letterSpacing: '0.08em',
                         alignSelf: 'center', marginRight: 4 }}>
            Category
          </span>
          {CATEGORIES.map(c => {
            const active = activeCategory === c.value;
            return (
              <button key={c.value}
                onClick={() => { setActiveCategory(c.value); saveUserData(); }}
                style={{
                  padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: active ? 'rgba(52,211,153,0.15)' : 'transparent',
                  color: active ? 'var(--green)' : 'var(--text-3)',
                  border: `1px solid ${active ? 'rgba(52,211,153,0.35)' : 'var(--border)'}`,
                }}>
                {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
