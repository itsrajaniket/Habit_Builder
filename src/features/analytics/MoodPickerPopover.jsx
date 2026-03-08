import React, { useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { MOOD_EMOJIS } from '../../utils/constants';

export default function MoodPickerPopover({ dateStr, anchorRect, onSelect, onClose }) {
  const ref = useRef(null);
  useClickOutside(ref, onClose);

  const style = anchorRect ? {
    position: 'fixed',
    top: (anchorRect.bottom || 0) + 4,
    left: Math.min(anchorRect.left || 0, window.innerWidth - 230),
    zIndex: 999,
  } : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 999 };

  return (
    <div
      ref={ref}
      style={style}
      role="dialog"
      aria-label="Select mood"
      className="bg-[#1e1e35] border border-white/10 rounded-2xl p-3 shadow-2xl"
    >
      <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-2 text-center">
        How are you feeling?
      </p>
      <div className="flex flex-wrap gap-1.5 max-w-[210px]">
        {MOOD_EMOJIS.map((em, i) => (
          <button
            key={i}
            title={`Level ${i + 1}`}
            onClick={() => { onSelect(dateStr, i + 1); onClose(); }}
            className="w-9 h-9 flex items-center justify-center text-xl rounded-xl
                       bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.1]
                       hover:scale-110 transition-all"
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}
