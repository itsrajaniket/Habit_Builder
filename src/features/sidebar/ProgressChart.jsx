import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import useHabitStore from '../../store/habitStore';
import { fmt, daysInMonth, todayStr } from '../../utils/dateUtils';
import { calcDayPct } from '../../utils/statsCalc';
import { getChartTheme } from '../../utils/chartTheme';

Chart.register(...registerables);

export default function ProgressChart() {
  const canvasRef      = useRef(null);
  const chartRef       = useRef(null);
  const completions    = useHabitStore(s => s.completions);
  const year           = useHabitStore(s => s.currentYear);
  const month          = useHabitStore(s => s.currentMonth);
  const activeBoard    = useHabitStore(s => s.activeBoard);
  const activeCategory = useHabitStore(s => s.activeCategory);
  const theme          = useHabitStore(s => s.theme);

  const visibleHabits = useHabitStore(s => {
    const { habits, activeBoard, activeCategory } = s;
    let h = activeBoard === 'all' ? habits : habits.filter(x => x.board === activeBoard || x.board === 'all');
    if (activeCategory !== 'all') h = h.filter(x => x.category === activeCategory);
    return h;
  });

  const buildData = () => {
    const dim    = daysInMonth(year, month);
    const today  = todayStr();
    const labels = [], data = [], bgColors = [];
    for (let d = 1; d <= dim; d++) {
      const ds  = fmt(year, month + 1, d);
      const pct = calcDayPct(ds, visibleHabits, completions);
      labels.push(d);
      data.push(pct);
      // Color each bar: today = bright green, 100% = emerald, good = teal, low = muted
      if (ds === today)   bgColors.push('rgba(52,211,153,0.95)');
      else if (pct >= 100) bgColors.push('rgba(16,185,129,0.80)');
      else if (pct >= 70)  bgColors.push('rgba(52,211,153,0.60)');
      else if (pct >= 40)  bgColors.push('rgba(52,211,153,0.35)');
      else if (pct > 0)    bgColors.push('rgba(52,211,153,0.18)');
      else                 bgColors.push('rgba(52,211,153,0.06)');
    }
    return { labels, data, bgColors };
  };

  const buildChart = () => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    const { labels, data, bgColors } = buildData();
    const ct = getChartTheme();

    // Today's index for annotation line
    const now       = new Date();
    const isCurrent = now.getMonth() === month && now.getFullYear() === year;
    const todayIdx  = isCurrent ? now.getDate() - 1 : -1;

    // Average line data
    const filled    = data.filter(v => v > 0);
    const avg       = filled.length ? Math.round(filled.reduce((a, b) => a + b, 0) / filled.length) : 0;
    const avgLine   = data.map(() => avg);

    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Daily %',
            data,
            backgroundColor: bgColors,
            borderRadius: 4,
            borderSkipped: false,
            borderWidth: 0,
            order: 2,
          },
          {
            label: 'Avg',
            data: avgLine,
            type: 'line',
            borderColor: 'rgba(167,139,250,0.55)',
            borderWidth: 1.5,
            borderDash: [4, 3],
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: ct.tooltipBg,
            titleColor: ct.tooltipText,
            bodyColor: ct.tooltipText,
            borderColor: 'rgba(52,211,153,0.3)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              title: ctx => `Day ${ctx[0].label}`,
              label: ctx => {
                if (ctx.datasetIndex === 1) return ` Avg: ${avg}%`;
                const v = ctx.raw;
                return ` ${v}% ${v === 100 ? '🔥' : v >= 70 ? '✅' : v > 0 ? '📈' : '—'}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: v => v + '%',
              color: ct.tickColor,
              font: { size: 10 },
              maxTicksLimit: 5,
            },
            grid: { color: ct.gridColor },
            border: { display: false },
          },
          x: {
            ticks: {
              color: (ctx) => ctx.index === todayIdx ? 'rgba(52,211,153,0.9)' : ct.tickColor,
              font: (ctx) => ({ size: 10, weight: ctx.index === todayIdx ? '700' : '400' }),
              maxTicksLimit: 10,
            },
            grid: { display: false },
            border: { display: false },
          },
        },
      },
    });
  };

  useEffect(() => {
    buildChart();
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [year, month, theme]);

  useEffect(() => {
    if (!chartRef.current) return;
    const { data, bgColors } = buildData();
    chartRef.current.data.datasets[0].data            = data;
    chartRef.current.data.datasets[0].backgroundColor = bgColors;
    chartRef.current.update('active');
  }, [completions, activeBoard, activeCategory]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Legend chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {[
          { color: 'rgba(52,211,153,0.95)', label: 'Today' },
          { color: 'rgba(16,185,129,0.80)', label: '100%' },
          { color: 'rgba(52,211,153,0.55)', label: '≥70%' },
          { color: 'rgba(167,139,250,0.7)', label: 'Avg', dashed: true },
        ].map(({ color, label, dashed }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {dashed
              ? <div style={{ width: 14, height: 0, borderTop: `2px dashed ${color}` }} />
              : <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />}
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 130 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
