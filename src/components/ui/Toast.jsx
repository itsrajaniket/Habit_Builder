import React, { useEffect, useState } from 'react';

let _setMsg = null;
export function showToast(msg) { if (_setMsg) _setMsg(msg); }

export default function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    _setMsg = (msg) => {
      setMessage(msg); setVisible(true);
      setTimeout(() => setVisible(false), 2800);
    };
    return () => { _setMsg = null; };
  }, []);

  if (!message) return null;

  return (
    <div role="status" aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl text-sm font-semibold t1 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)`,
        background: 'var(--bg-card-hi)',
        border: '1px solid var(--border-hi)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(12px)',
      }}>
      {message}
    </div>
  );
}
