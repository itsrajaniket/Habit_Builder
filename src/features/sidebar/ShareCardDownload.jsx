import React from 'react';
import Collapsible from '../../components/ui/Collapsible';
import ShareCard, { useShareData } from './ShareCard';
import { MONTH_NAMES } from '../../utils/constants';
import { showToast } from '../../components/ui/Toast';

export default function ShareCardDownload({ defaultOpen = false }) {
  const { year, month, pct, total, possible, maxStreak, currentUser } = useShareData();

  const handleDownload = () => {
    const w = 320, h = 220, canvas = document.createElement('canvas');
    canvas.width = w*2; canvas.height = h*2;
    const ctx = canvas.getContext('2d'); ctx.scale(2, 2);
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#0b1120'); g.addColorStop(1,'#111827');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = '#34d399'; ctx.fillText('🎯 Habit Builder Kit',16,30);
    if (currentUser) { ctx.font='12px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText(currentUser.toUpperCase(),16,52); }
    ctx.font='13px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fillText(`${MONTH_NAMES[month]} ${year}`,16,72);
    ctx.font='bold 60px sans-serif'; ctx.fillStyle='#fff'; ctx.fillText(`${pct}%`,16,142);
    ctx.font='12px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillText(`${total}/${possible} habits completed`,16,164);
    if (maxStreak > 0) { ctx.font='13px sans-serif'; ctx.fillStyle='#f59e0b'; ctx.fillText(`🔥 Best Streak: ${maxStreak} days`,16,186); }
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `habit-${MONTH_NAMES[month]}-${year}.png`; a.click();
    showToast('📥 Progress card downloaded!');
  };

  return (
    <Collapsible title="📤 Share Progress" defaultOpen={defaultOpen} storageKey="shareBody">
      <ShareCard />
      <button onClick={handleDownload}
        className="mt-3 w-full py-2 rounded-xl text-sm font-semibold transition-all"
        style={{ background:'rgba(96,165,250,0.12)', color:'var(--blue)', border:'1px solid rgba(96,165,250,0.2)' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(96,165,250,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(96,165,250,0.12)'}>
        📥 Download Card
      </button>
    </Collapsible>
  );
}
