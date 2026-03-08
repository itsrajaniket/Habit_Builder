import React from 'react';
import { MOOD_EMOJIS } from '../../utils/constants';

export default function MoodCell({ dateStr, value, onClick }) {
  const display = value != null ? (MOOD_EMOJIS[value - 1] || value) : '·';
  return (
    <div
      data-mood-date={dateStr}
      onClick={onClick}
      title="Set mood"
      className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer
                 text-base bg-white/[0.04] hover:bg-white/[0.1] transition-colors border border-white/[0.06]"
    >
      {display}
    </div>
  );
}
