import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import useHabitStore from '../../store/habitStore';
import { fmt, daysInMonth } from '../../utils/dateUtils';
import { getChartTheme } from '../../utils/chartTheme';

Chart.register(...registerables);

export default function MentalChart({ mode = 'both' }) {
  const canvasRef   = useRef(null);
  const chartRef    = useRef(null);
  const mentalState = useHabitStore(s => s.mentalState);
  const year        = useHabitStore(s => s.currentYear);
  const month       = useHabitStore(s => s.currentMonth);
  const theme       = useHabitStore(s => s.theme);

  const buildDatasets = () => {
    const dim = daysInMonth(year, month);
    const labels = [], moodData = [], motData = [];
    for (let d = 1; d <= dim; d++) {
      const ds = fmt(year, month + 1, d);
      labels.push(d);
      moodData.push((mentalState.mood[ds] || 0) * 10);
      motData.push((mentalState.motivation[ds] || 0) * 10);
    }
    const datasets = [];
    if (mode === 'mood' || mode === 'both') {
      datasets.push({
        label: 'Mood',
        data: moodData,
        backgroundColor: 'rgba(167,139,250,0.10)',
        borderColor: 'rgba(167,139,250,0.85)',
        borderWidth: 2, fill: mode !== 'both', tension: 0.45, pointRadius: 0, pointHoverRadius: 4,
      });
    }
    if (mode === 'motivation' || mode === 'both') {
      datasets.push({
        label: 'Motivation',
        data: motData,
        backgroundColor: 'rgba(52,211,153,0.08)',
        borderColor: 'rgba(52,211,153,0.80)',
        borderWidth: 2, fill: mode !== 'both', tension: 0.45, pointRadius: 0, pointHoverRadius: 4,
      });
    }
    return { labels, datasets };
  };

  const buildChart = () => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    const { labels, datasets } = buildDatasets();
    const ct = getChartTheme();

    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 350 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: ct.tooltipBg,
            titleColor: ct.tooltipText,
            bodyColor: ct.tooltipText,
            borderColor: ct.gridColor,
            borderWidth: 1,
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` },
          },
        },
        scales: {
          y: {
            beginAtZero: true, max: 100,
            ticks: { callback: v => v + '%', color: ct.tickColor, font: { size: 10 }, maxTicksLimit: 5 },
            grid: { color: ct.gridColor }, border: { display: false },
          },
          x: {
            ticks: { color: ct.tickColor, font: { size: 11 }, maxTicksLimit: 10 },
            grid: { display: false }, border: { display: false },
          },
        },
      },
    });
  };

  useEffect(() => {
    buildChart();
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [year, month, mode, theme]);

  useEffect(() => {
    if (!chartRef.current) return;
    const { datasets } = buildDatasets();
    chartRef.current.data.datasets.forEach((ds, i) => {
      if (datasets[i]) ds.data = datasets[i].data;
    });
    chartRef.current.update('active');
  }, [mentalState]);

  return <div style={{ height: 160 }}><canvas ref={canvasRef} /></div>;
}
