import React, { useState } from 'react';
import useHabitStore from '../../store/habitStore';
import { showToast } from '../../components/ui/Toast';
import Collapsible from '../../components/ui/Collapsible';

export default function DataExport() {
  const [exporting, setExporting] = useState(false);

  const habits          = useHabitStore(s => s.habits);
  const completions     = useHabitStore(s => s.completions);
  const mentalState     = useHabitStore(s => s.mentalState);
  const streakFreezes   = useHabitStore(s => s.streakFreezes);
  const freezeUsedDates = useHabitStore(s => s.freezeUsedDates);
  const currentUser     = useHabitStore(s => s.currentUser);
  const dayNotes        = useHabitStore(s => s.dayNotes);

  const handleExport = () => {
    setExporting(true);
    try {
      const data = {
        exported_at: new Date().toISOString(),
        exported_by: currentUser,
        version: '1.0',
        habits,
        completions,
        mental_state: mentalState,
        streak_freezes: streakFreezes,
        freeze_used_dates: freezeUsedDates,
        day_notes: dayNotes,
        // summary stats
        stats: {
          total_habits: habits.length,
          total_completions: Object.values(completions).reduce(
            (acc, hc) => acc + Object.values(hc).filter(Boolean).length, 0
          ),
          total_days_tracked: new Set(
            Object.values(completions).flatMap(hc => Object.keys(hc))
          ).size,
        },
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `habit-tracker-${currentUser}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('✅ Data exported successfully!');
    } catch {
      showToast('❌ Export failed. Try again.');
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.habits || !data.completions) throw new Error('Invalid file');
        // Store in localStorage under current user
        const storageKey = `habitData_${currentUser}`;
        const toSave = {
          habits: data.habits,
          completions: data.completions,
          mentalState: data.mental_state || { mood: {}, motivation: {} },
          dayNotes: data.day_notes || {},
          streakFreezes: data.streak_freezes || 0,
          freezeUsedDates: data.freeze_used_dates || [],
        };
        localStorage.setItem(storageKey, JSON.stringify(toSave));
        showToast('✅ Data imported! Refresh to see changes.');
      } catch {
        showToast('❌ Invalid file. Please use a valid export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const totalCompletions = Object.values(completions).reduce(
    (acc, hc) => acc + Object.values(hc).filter(Boolean).length, 0
  );

  return (
    <Collapsible title="💾 Data & Export" defaultOpen={false} storageKey="dataExport">
      {/* Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14,
      }}>
        {[
          { v: habits.length,     l: 'Habits',      c: 'var(--blue)'   },
          { v: totalCompletions,  l: 'Check-ins',   c: 'var(--green)'  },
          { v: freezeUsedDates.length, l: 'Freezes used', c: '#67e8f9' },
        ].map(({ v, l, c }) => (
          <div key={l} style={{
            textAlign: 'center', padding: '8px 6px', borderRadius: 10,
            background: 'var(--surface-1)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: c }}>{v}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Export button */}
      <button onClick={handleExport} disabled={exporting}
        style={{
          width: '100%', padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: exporting ? 'var(--surface-2)' : 'rgba(52,211,153,0.12)',
          color: exporting ? 'var(--text-3)' : 'var(--green)',
          border: `1px solid ${exporting ? 'var(--border)' : 'rgba(52,211,153,0.25)'}`,
          cursor: exporting ? 'wait' : 'pointer', marginBottom: 8, transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
        {exporting ? '⏳ Exporting…' : '⬇️ Export as JSON'}
      </button>

      {/* Import */}
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: '100%', padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700,
        background: 'var(--surface-1)', color: 'var(--text-2)',
        border: '1px solid var(--border)', cursor: 'pointer',
        boxSizing: 'border-box', transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-1)'; }}
      >
        ⬆️ Import from JSON
        <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
      </label>

      <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 10, lineHeight: 1.5 }}>
        Export backs up all your habits, completions, mood data, and notes as a JSON file you can restore anytime.
      </p>
    </Collapsible>
  );
}
