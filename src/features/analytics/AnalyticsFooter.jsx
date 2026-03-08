import React, { useState } from "react";
import YearHeatmap from "./YearHeatmap";
import MonthlyReportCard from "./MonthlyReportCard";
import DayOfWeekChart from "./DayOfWeekChart";
import ShareCardDownload from "../sidebar/ShareCardDownload";

export default function AnalyticsFooter() {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);

  const toggle = () =>
    setOpen((prev) => {
      if (!prev && !rendered) setRendered(true);
      return !prev;
    });

  return (
    <section
      className="card rounded-2xl overflow-hidden"
      style={{
        /* Edge-to-edge on mobile, small margin on desktop */
        margin: "0 8px 24px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold t1">📈 Deep Analytics</h2>
          <p className="text-xs t3 mt-0.5 hidden xs:block">
            Patterns, insights &amp; reflections
          </p>
        </div>
        <button
          onClick={toggle}
          className="btn-ghost rounded-full text-xs font-semibold flex-shrink-0"
          style={{ padding: "7px 14px", minHeight: 36 }}
        >
          {open ? "Hide ▴" : "Show ▾"}
        </button>
      </div>

      {/* Body — lazy-rendered */}
      {open && rendered && (
        <div className="p-3 md:p-5 flex flex-col gap-4">
          {/* Year heatmap — needs horizontal scroll on mobile */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <YearHeatmap />
          </div>

          {/* Report cards — stacked on mobile, 2-col on tablet+ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: 12,
            }}
          >
            <MonthlyReportCard />
            <DayOfWeekChart />
          </div>

          {/* Share card */}
          <ShareCardDownload defaultOpen />
        </div>
      )}
    </section>
  );
}
