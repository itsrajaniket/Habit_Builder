import React from 'react';
import Pill from './Pill';

export default function PillGroup({ options, value, onChange }) {
  return (
    <div className="pill-group">
      {options.map(opt => (
        <Pill
          key={opt.value}
          label={opt.label}
          active={value === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
}
