import React from 'react';
import Collapsible from '../../components/ui/Collapsible';
import useHabitStore from '../../store/habitStore';
import { BADGES } from '../../utils/constants';
import { getEarnedBadges } from '../../utils/statsCalc';

export default function BadgesPanel() {
  const habits          = useHabitStore(s => s.habits);
  const completions     = useHabitStore(s => s.completions);
  const freezeUsedDates = useHabitStore(s => s.freezeUsedDates);
  const earned = getEarnedBadges(habits, completions, freezeUsedDates);

  return (
    <Collapsible title="🏆 Achievements" defaultOpen={false} storageKey="badgesBody">
      <div className="grid grid-cols-4 gap-2">
        {BADGES.map(b => {
          const e = earned.includes(b.id);
          return (
            <div key={b.id} title={b.desc}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
              style={{
                background: e ? 'rgba(245,158,11,0.1)' : 'var(--surface-1)',
                border: `1px solid ${e ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                opacity: e ? 1 : 0.38,
                filter: e ? 'none' : 'grayscale(0.7)',
              }}>
              <span className="text-xl">{b.icon}</span>
              <span className="text-[10px] text-center leading-tight t2">{b.name}</span>
            </div>
          );
        })}
      </div>
    </Collapsible>
  );
}
