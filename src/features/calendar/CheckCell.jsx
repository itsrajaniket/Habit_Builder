import React, { memo, useRef, useCallback } from 'react';
import useHabitStore from '../../store/habitStore';
import { useSound } from '../../hooks/useSound';

// tiny confetti burst from click position
function spawnBurst(cellEl) {
  if (!cellEl) return;
  const rect = cellEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const burst = document.createElement('div');
  burst.className = 'chk-burst';
  burst.style.cssText = `left:${cx}px;top:${cy}px;position:fixed;`;

  const colors = ['#34d399','#059669','#6ee7b7','#fbbf24','#a78bfa'];
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const dist  = 18 + Math.random() * 14;
    const span  = document.createElement('span');
    span.style.cssText = `
      background:${colors[i % colors.length]};
      --tx:${Math.cos(angle) * dist}px;
      --ty:${Math.sin(angle) * dist}px;
      animation-delay:${i * 0.015}s;
    `;
    burst.appendChild(span);
  }
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 600);
}

const CheckCell = memo(function CheckCell({ habitId, dateStr, isYesterday, isToday, isFrozen, tipLabel }) {
  const done             = useHabitStore(s => !!s.completions[habitId]?.[dateStr]);
  const toggleCompletion = useHabitStore(s => s.toggleCompletion);
  const saveUserData     = useHabitStore(s => s.saveUserData);
  const { playCheck, playUncheck } = useSound();
  const cellRef = useRef(null);

  const onClick = useCallback(() => {
    const nowDone = !done;
    toggleCompletion(habitId, dateStr);
    saveUserData();

    // animation class
    const el = cellRef.current;
    if (el) {
      el.classList.remove('pop-anim', 'unpop-anim');
      void el.offsetWidth; // reflow
      el.classList.add(nowDone ? 'pop-anim' : 'unpop-anim');
      setTimeout(() => el.classList.remove('pop-anim', 'unpop-anim'), 400);
    }

    if (nowDone) {
      playCheck();
      spawnBurst(cellRef.current);
    } else {
      playUncheck();
    }
  }, [done, habitId, dateStr, toggleCompletion, saveUserData, playCheck, playUncheck]);

  return (
    <td className={`cal-td${isToday ? ' col-today' : isYesterday ? ' col-yesterday' : ''}`}>
      <div
        ref={cellRef}
        className={`chk${done ? ' done' : ''}${isFrozen ? ' frozen' : ''}`}
        onClick={onClick}
        title={tipLabel}
        role="checkbox"
        aria-checked={done}
        tabIndex={0}
        onKeyDown={e => e.key === ' ' && onClick()}
        style={{ position: 'relative' }}
      />
    </td>
  );
});

export default CheckCell;
