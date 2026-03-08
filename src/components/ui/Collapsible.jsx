import React, { useState } from 'react';

export default function Collapsible({ title, defaultOpen = true, children, storageKey }) {
  const getInit = () => {
    if (!storageKey) return defaultOpen;
    try {
      const s = JSON.parse(localStorage.getItem('ht_collapse') || '{}');
      return s[storageKey] !== undefined ? !s[storageKey] : defaultOpen;
    } catch { return defaultOpen; }
  };

  const [open, setOpen] = useState(getInit);

  const toggle = () => setOpen(prev => {
    const next = !prev;
    if (storageKey) {
      try {
        const s = JSON.parse(localStorage.getItem('ht_collapse') || '{}');
        s[storageKey] = !next;
        localStorage.setItem('ht_collapse', JSON.stringify(s));
      } catch {}
    }
    return next;
  });

  return (
    <div className="card rounded-2xl overflow-hidden">
      <button onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
        style={{ background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.background='var(--surface-1)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
        <span className="text-xs font-bold t1">{title}</span>
        <span className="text-[10px] t3">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
