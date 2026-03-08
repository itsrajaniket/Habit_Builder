import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import useHabitStore from '../../store/habitStore';

export default function DayNotesModal({ dateStr, label, onClose }) {
  const dayNotes     = useHabitStore(s => s.dayNotes);
  const setDayNote   = useHabitStore(s => s.setDayNote);
  const saveUserData = useHabitStore(s => s.saveUserData);
  const [text, setText]   = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setText(dayNotes[dateStr] || ''); setSaved(false); }, [dateStr, dayNotes]);

  const handleSave = () => {
    setDayNote(dateStr, text.trim());
    saveUserData();
    setSaved(true);
    setTimeout(onClose, 900);
  };

  return (
    <Modal isOpen={!!dateStr} onClose={onClose} title={`📝 Notes for ${label}`}>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">📝 Daily Friction Log</label>
        <textarea
          rows={5}
          placeholder="e.g., Skipped gym because I slept poorly…"
          value={text} onChange={e => setText(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm
                     placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 resize-none transition-all"
        />
      </div>
      {saved && <p className="text-xs text-emerald-400 font-semibold">✅ Note saved!</p>}
      <div className="flex gap-2">
        <button onClick={onClose}
          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] text-white/60
                     hover:bg-white/[0.1] transition-colors border border-white/[0.06]">Cancel</button>
        <button onClick={handleSave}
          className="flex-1 py-2 rounded-xl text-sm font-bold text-black
                     bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 transition-all">Save Note</button>
      </div>
    </Modal>
  );
}
