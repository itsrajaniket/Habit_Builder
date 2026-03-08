import useHabitStore from '../../store/habitStore';

export function useHabits() {
  const habits          = useHabitStore(s => s.habits);
  const addHabit        = useHabitStore(s => s.addHabit);
  const removeHabit     = useHabitStore(s => s.removeHabit);
  const renameHabit     = useHabitStore(s => s.renameHabit);
  const reorderHabits   = useHabitStore(s => s.reorderHabits);
  const saveUserData    = useHabitStore(s => s.saveUserData);
  const getVisibleHabits = useHabitStore(s => s.getVisibleHabits);
  return { habits, addHabit, removeHabit, renameHabit, reorderHabits, saveUserData, getVisibleHabits };
}
