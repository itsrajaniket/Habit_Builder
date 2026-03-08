import { useEffect } from 'react';

export function useHotkeys(keyMap) {
  useEffect(() => {
    const handler = (e) => {
      const key = [
        e.ctrlKey  ? 'ctrl'  : '',
        e.metaKey  ? 'meta'  : '',
        e.shiftKey ? 'shift' : '',
        e.key.toLowerCase(),
      ].filter(Boolean).join('+');
      if (keyMap[key]) {
        e.preventDefault();
        keyMap[key](e);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [keyMap]);
}
