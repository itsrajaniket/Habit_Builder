import React from 'react';

const LEVEL_COLORS = ['','text-red-400','text-orange-400','text-yellow-400','text-lime-400','text-emerald-400',
                      'text-emerald-400','text-cyan-400','text-blue-400','text-violet-400','text-purple-400'];

export default function MotivationCell({ dateStr, day, value, onClick }) {
  return (
    <div
      onClick={() => onClick(dateStr, day)}
      title="Set motivation"
      className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer text-xs font-bold
                  bg-white/[0.04] hover:bg-white/[0.1] transition-colors border border-white/[0.06]
                  ${value != null ? LEVEL_COLORS[value] : 'text-white/20'}`}
    >
      {value ?? '·'}
    </div>
  );
}
