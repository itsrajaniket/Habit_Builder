import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
         style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(12px)' }}
         onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card-hi w-full max-w-md rounded-2xl max-h-[90vh] overflow-y-auto slide-up"
           style={{ border:'1px solid var(--border-hi)', boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
            <h3 className="text-base font-bold t1">{title}</h3>
            <button onClick={onClose} className="icon-btn w-7 h-7 text-lg">×</button>
          </div>
        )}
        <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
