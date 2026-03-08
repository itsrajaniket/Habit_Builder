import React, { useState, useRef, useEffect } from 'react';

export default function InlineEdit({ value, onCommit, onCancel }) {
  const [text, setText] = useState(value);
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

  const commit = () => {
    const t = text.trim();
    if (t && t !== value) onCommit(t); else onCancel();
  };

  return (
    <input ref={ref} type="text" className="inline-edit flex-1"
      value={text} onChange={e => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') { setText(value); onCancel(); } }}
      aria-label="Rename habit" />
  );
}
