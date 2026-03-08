import React from 'react';

export default function Badge({ badge, earned }) {
  return (
    <div className={`badge${earned ? ' earned' : ''}`} title={badge.desc}>
      <div className="badge-icon">{badge.icon}</div>
      <div className="badge-name">{badge.name}</div>
    </div>
  );
}
