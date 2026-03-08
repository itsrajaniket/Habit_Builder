import React, { useEffect, useRef } from 'react';

export default function MeatballMenu({ onRename, onDelete, onClose, anchorRect }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('click', handler), 50);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  const style = anchorRect ? {
    position: 'fixed',
    top: anchorRect.bottom + 4,
    left: Math.min(anchorRect.left, window.innerWidth - 160),
    zIndex: 999,
  } : {};

  return (
    <div ref={ref} className="meatball-menu" style={style}>
      <button className="meatball-item" onClick={() => { onClose(); onRename(); }}>✏️ Rename</button>
      <button className="meatball-item danger" onClick={() => { onClose(); onDelete(); }}>🗑 Delete</button>
    </div>
  );
}
