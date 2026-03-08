import React, { useState } from 'react';
import useHabitStore from '../../store/habitStore';
import MoodPickerPopover from './MoodPickerPopover';
import MentalChart from './MentalChart';
import { fmt, daysInMonth, weekStart } from '../../utils/dateUtils';
import { MOOD_EMOJIS } from '../../utils/constants';

const MOT_COLORS = [
  '', '#ef4444', '#f97316', '#eab308', '#84cc16',
  '#22c55e', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7',
];

const CHART_MODES = [
  { value: 'both',       label: 'Both',       color: 'var(--green)' },
  { value: 'mood',       label: 'Mood',        color: 'var(--purple)' },
  { value: 'motivation', label: 'Motivation',  color: 'var(--green)' },
];

export default function MentalStatePanel() {
  const mentalState      = useHabitStore(s => s.mentalState);
  const setMood          = useHabitStore(s => s.setMood);
  const setMotivation    = useHabitStore(s => s.setMotivation);
  const saveUserData     = useHabitStore(s => s.saveUserData);
  const year             = useHabitStore(s => s.currentYear);
  const month            = useHabitStore(s => s.currentMonth);
  const calendarView     = useHabitStore(s => s.calendarView);
  const currentWeekStart = useHabitStore(s => s.currentWeekStart);

  const [moodPicker, setMoodPicker] = useState(null);
  const [motPicker,  setMotPicker]  = useState(null);
  const [chartMode,  setChartMode]  = useState('both');

  // Build day list
  let days = [];
  if (calendarView === 'week') {
    const ws = new Date((currentWeekStart || weekStart(new Date())) + 'T00:00:00');
    for (let i = 0; i < 7; i++) {
      const d = new Date(ws); d.setDate(d.getDate() + i);
      days.push({ d: d.getDate(), ds: fmt(d.getFullYear(), d.getMonth() + 1, d.getDate()) });
    }
  } else {
    const dim = daysInMonth(year, month);
    for (let d = 1; d <= dim; d++) days.push({ d, ds: fmt(year, month + 1, d) });
  }

  const cellBase = {
    width: 28, height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, cursor: 'pointer', transition: 'background 0.13s',
    border: '1px solid var(--border)',
    background: 'var(--surface-1)',
  };

  return (
    <div className="p-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xs font-bold t2 uppercase tracking-widest">🧠 Mental State</h3>
          <span className="text-[10px] t3">click mood · click number for motivation</span>
        </div>
      </div>

      {/* Scrollable grid */}
      <div className="overflow-x-auto pb-1">
        <table style={{ borderSpacing: '3px 5px', borderCollapse: 'separate', fontSize: 12 }}>
          <tbody>
            {/* Day numbers */}
            <tr>
              <td className="text-[11px] font-bold t3 pr-4 whitespace-nowrap">Day</td>
              {days.map(({ d }) => (
                <td key={d} className="text-center text-[11px] font-semibold t3"
                    style={{ minWidth: 28 }}>{d}</td>
              ))}
            </tr>

            {/* Mood row */}
            <tr>
              <td className="text-[11px] font-bold whitespace-nowrap pr-4"
                  style={{ color: 'var(--purple)' }}>Mood</td>
              {days.map(({ ds }) => {
                const val = mentalState.mood[ds];
                return (
                  <td key={ds}>
                    <div
                      data-mood-date={ds}
                      style={{ ...cellBase, fontSize: 16 }}
                      onClick={() => {
                        const el = document.querySelector(`[data-mood-date="${ds}"]`);
                        setMoodPicker({ dateStr: ds, rect: el?.getBoundingClientRect() });
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,139,250,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-1)'}
                    >
                      {val != null ? (MOOD_EMOJIS[val - 1] || val) : <span className="t3" style={{ fontSize: 14 }}>·</span>}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Motivation row */}
            <tr>
              <td className="text-[11px] font-bold whitespace-nowrap pr-4"
                  style={{ color: 'var(--green)' }}>Motivation</td>
              {days.map(({ d, ds }) => {
                const val = mentalState.motivation[ds];
                return (
                  <td key={ds}>
                    <div
                      style={{
                        ...cellBase,
                        fontSize: 11, fontWeight: 700,
                        color: val != null ? MOT_COLORS[val] : 'var(--text-3)',
                      }}
                      onClick={() => setMotPicker({ dateStr: ds, day: d })}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-1)'}
                    >
                      {val ?? '·'}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Chart toggle + chart */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold t3 uppercase tracking-widest">Graph View</span>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-hi)' }}>
            {CHART_MODES.map(m => (
              <button
                key={m.value}
                onClick={() => setChartMode(m.value)}
                className="px-3 py-1 text-[10px] font-bold transition-all"
                style={{
                  background: chartMode === m.value ? 'var(--surface-3)' : 'transparent',
                  color: chartMode === m.value ? m.color : 'var(--text-3)',
                  borderRight: '1px solid var(--border)',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend dots */}
        <div className="flex items-center gap-4 mb-2">
          {(chartMode === 'mood' || chartMode === 'both') && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(167,139,250,0.85)' }} />
              <span className="text-[10px] t3">Mood</span>
            </div>
          )}
          {(chartMode === 'motivation' || chartMode === 'both') && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(52,211,153,0.85)' }} />
              <span className="text-[10px] t3">Motivation</span>
            </div>
          )}
        </div>

        <MentalChart mode={chartMode} />
      </div>

      {/* Mood picker popover */}
      {moodPicker && (
        <MoodPickerPopover
          dateStr={moodPicker.dateStr}
          anchorRect={moodPicker.rect}
          onSelect={(ds, v) => { setMood(ds, v); saveUserData(); setMoodPicker(null); }}
          onClose={() => setMoodPicker(null)}
        />
      )}

      {/* Motivation picker modal */}
      {motPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
             style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
             onClick={() => setMotPicker(null)}>
          <div className="rounded-2xl p-5 shadow-2xl slide-up"
               style={{ background: 'var(--bg-card-hi)', border: '1px solid var(--border-hi)', minWidth: 230 }}
               onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold t1 mb-1">Day {motPicker.day} — Motivation</p>
            <p className="text-[10px] t3 mb-3">Rate from 1 (low) to 10 (high)</p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
                const active = mentalState.motivation[motPicker.dateStr] === n;
                return (
                  <button key={n}
                    className="rounded-xl text-sm font-bold transition-all"
                    style={{
                      width: 40, height: 40,
                      background: active ? MOT_COLORS[n] : 'var(--surface-2)',
                      color: active ? '#fff' : 'var(--text-2)',
                      transform: active ? 'scale(1.1)' : 'scale(1)',
                      border: `1px solid ${active ? MOT_COLORS[n] : 'var(--border)'}`,
                    }}
                    onClick={() => { setMotivation(motPicker.dateStr, n); saveUserData(); setMotPicker(null); }}>
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
