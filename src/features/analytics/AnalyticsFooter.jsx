import React, { useState } from 'react';
import YearHeatmap from './YearHeatmap';
import MonthlyReportCard from './MonthlyReportCard';
import DayOfWeekChart from './DayOfWeekChart';
import ShareCardDownload from '../sidebar/ShareCardDownload';

export default function AnalyticsFooter() {
  const [open, setOpen]         = useState(false);
  const [rendered, setRendered] = useState(false);

  const toggle = () => setOpen(prev => {
    if (!prev && !rendered) setRendered(true);
    return !prev;
  });

  return (
    <section className="mx-5 mb-6 rounded-2xl overflow-hidden card">
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex-1">
          <h2 className="text-sm font-bold t1">📈 Deep Analytics</h2>
          <p className="text-xs t3 mt-0.5">Patterns, insights &amp; reflections</p>
        </div>
        <button onClick={toggle} className="btn-ghost px-4 py-1.5 rounded-full text-xs font-semibold">
          {open ? 'Hide ▴' : 'Show ▾'}
        </button>
      </div>

      {open && rendered && (
        <div className="p-5 flex flex-col gap-4">
          <YearHeatmap />
          <div className="grid grid-cols-2 gap-4">
            <MonthlyReportCard />
            <DayOfWeekChart />
          </div>
          {/* Share Progress moved here from sidebar */}
          <ShareCardDownload defaultOpen />
        </div>
      )}
    </section>
  );
}
