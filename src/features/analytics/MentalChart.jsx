import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import useHabitStore from "../../store/habitStore";
import { fmt, daysInMonth } from "../../utils/dateUtils";
import { getChartTheme } from "../../utils/chartTheme";

Chart.register(...registerables);

export default function MentalChart({ mode = "both" }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const mentalState = useHabitStore((s) => s.mentalState);
  const year = useHabitStore((s) => s.currentYear);
  const month = useHabitStore((s) => s.currentMonth);
  const theme = useHabitStore((s) => s.theme);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 767,
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const h = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);

  const buildDatasets = () => {
    const dim = daysInMonth(year, month);
    const labels = [],
      moodData = [],
      motData = [];
    for (let d = 1; d <= dim; d++) {
      const ds = fmt(year, month + 1, d);
      labels.push(d);
      moodData.push((mentalState.mood[ds] || 0) * 10);
      motData.push((mentalState.motivation[ds] || 0) * 10);
    }
    const datasets = [];
    if (mode === "mood" || mode === "both") {
      datasets.push({
        label: "Mood",
        data: moodData,
        backgroundColor: "rgba(167,139,250,0.10)",
        borderColor: "rgba(167,139,250,0.85)",
        borderWidth: 2,
        fill: mode !== "both",
        tension: 0.45,
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    }
    if (mode === "motivation" || mode === "both") {
      datasets.push({
        label: "Motivation",
        data: motData,
        backgroundColor: "rgba(52,211,153,0.08)",
        borderColor: "rgba(52,211,153,0.80)",
        borderWidth: 2,
        fill: mode !== "both",
        tension: 0.45,
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    }
    return { labels, datasets };
  };

  const buildChart = () => {
    if (!canvasRef.current) return;
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const { labels, datasets } = buildDatasets();
    const ct = getChartTheme();
    const mobile = isMobile;

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: ct.tooltipBg,
            titleColor: ct.tooltipText,
            bodyColor: ct.tooltipText,
            borderColor: ct.gridColor,
            borderWidth: 1,
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%` },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (v) => v + "%",
              color: ct.tickColor,
              font: { size: mobile ? 9 : 10 },
              maxTicksLimit: mobile ? 4 : 5,
            },
            grid: { color: ct.gridColor },
            border: { display: false },
          },
          x: {
            ticks: {
              color: ct.tickColor,
              font: { size: mobile ? 9 : 11 },
              /* Show fewer labels on mobile so they don't overlap */
              maxTicksLimit: mobile ? 8 : 15,
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
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [year, month, mode, theme, isMobile]);

  useEffect(() => {
    if (!chartRef.current) return;
    const { datasets } = buildDatasets();
    chartRef.current.data.datasets.forEach((ds, i) => {
      if (datasets[i]) ds.data = datasets[i].data;
    });
    chartRef.current.update("active");
  }, [mentalState]);

  return (
    /* Shorter on mobile to save vertical space */
    <div style={{ height: isMobile ? 130 : 160 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
