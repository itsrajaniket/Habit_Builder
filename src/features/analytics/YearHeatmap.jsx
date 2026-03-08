import React from 'react';
import useHabitStore from '../../store/habitStore';
import { buildHeatmapData } from '../../utils/heatmapUtils';

export default function YearHeatmap() {
  const habits            = useHabitStore(s => s.habits);
  const completions       = useHabitStore(s => s.completions);
  const habitCreatedDates = useHabitStore(s => s.habitCreatedDates);

  const getActiveCount = (ds) => {
    const keys = Object.keys(habitCreatedDates);
    if (!keys.length) return habits.length;
    const c = habits.filter(h => { const cr = habitCreatedDates[h.id]; return !cr || cr <= ds; }).length;
    return c || habits.length;
  };

  const { cells, totalCols, monthCols } = buildHeatmapData(habits, completions, getActiveCount);

  return (
    <div className="card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold t2 uppercase tracking-widest">📅 Year at a Glance</h3>
        <div className="flex items-center gap-1.5 text-[10px] t3">
          <span>Less</span>
          {[0,1,2,3,4].map(l => (
            <div key={l} className={`w-3 h-3 rounded-sm hm-lv${l}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-[3px]">
            {Array.from({ length: totalCols }, (_, c) => (
              <div key={c} className="w-[13px] text-[9px] t3 overflow-hidden">{monthCols[c]||''}</div>
            ))}
          </div>
          {/* Week columns */}
          <div className="flex gap-[3px]">
            {Array.from({ length: totalCols }, (_, col) => (
              <div key={col} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, row) => {
                  const cell = cells[col * 7 + row];
                  if (!cell) return <div key={row} className="w-[13px] h-[13px]" />;
                  return (
                    <div key={row}
                      className={`w-[13px] h-[13px] rounded-sm hm-lv${cell.level} cursor-default`}
                      title={`${cell.ds}: ${cell.done}/${cell.activeCount}`} />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
