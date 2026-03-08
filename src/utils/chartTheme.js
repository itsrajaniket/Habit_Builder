/**
 * Returns Chart.js-compatible color values by reading the current CSS tokens.
 * Needed because Chart.js can't resolve CSS custom properties directly.
 */
export function getChartTheme() {
  const style = getComputedStyle(document.documentElement);
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  return {
    gridColor:   isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)',
    tickColor:   isDark ? 'rgba(200,200,220,0.45)' : 'rgba(60,60,80,0.55)',
    tooltipBg:   isDark ? '#1e1e30'                : '#ffffff',
    tooltipText: isDark ? '#e8e8f2'                : '#111827',
  };
}
