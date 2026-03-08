import { useEffect } from 'react';
import useHabitStore from '../store/habitStore';

export function useTheme() {
  const theme = useHabitStore(s => s.theme);
  const toggleTheme = useHabitStore(s => s.toggleTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('habitTheme', theme);
  }, [theme]);

  return { theme, toggleTheme };
}
