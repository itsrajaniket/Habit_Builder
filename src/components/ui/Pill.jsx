import React from 'react';

export default function Pill({ label, active, onClick }) {
  return (
    <button className={`pill-btn${active ? ' active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}
