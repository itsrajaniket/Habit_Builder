import React from 'react';
import useHabitStore from '../store/habitStore';
import { useTheme } from '../hooks/useTheme';

export default function GlobalNav() {
  const currentUser  = useHabitStore(s => s.currentUser);
  const logout       = useHabitStore(s => s.logout);
  const saveUserData = useHabitStore(s => s.saveUserData);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (!window.confirm('Logout?')) return;
    await saveUserData();
    await logout();
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 flex items-center gap-4 px-5 py-3"
         style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2.5 mr-auto">
        <span className="text-2xl">🎯</span>
        <span className="font-extrabold text-sm tracking-tight t1">Habit Builder Kit</span>
      </div>

      {currentUser && (
        <span className="text-sm t2">
          Welcome, <strong className="t1">{(currentUser.includes('@') ? currentUser.split('@')[0] : currentUser).charAt(0).toUpperCase() + (currentUser.includes('@') ? currentUser.split('@')[0] : currentUser).slice(1)}</strong> 👋
        </span>
      )}

      <button onClick={toggleTheme} className="icon-btn w-9 h-9 text-lg" title="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <button onClick={handleLogout}
        className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
        style={{ background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.12)'}>
        Logout
      </button>
    </nav>
  );
}
