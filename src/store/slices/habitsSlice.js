import { DEFAULT_HABITS } from '../../utils/constants';
import { todayStr } from '../../utils/dateUtils';

export const createHabitsSlice = (set, get) => ({
  habits: JSON.parse(JSON.stringify(DEFAULT_HABITS)),
  habitCreatedDates: {},

  addHabit: (name, emoji, category, board) => {
    const { habits } = get();
    const newId = Math.max(0, ...habits.map(h => h.id)) + 1;
    const newHabit = { id: newId, name, emoji, category, board };
    set(state => ({
      habits: [...state.habits, newHabit],
      habitCreatedDates: { ...state.habitCreatedDates, [newId]: todayStr() },
    }));
    // init completions for new habit
    get().initCompletions(newId);
  },

  removeHabit: (id) => {
    set(state => {
      const completions = { ...state.completions };
      delete completions[id];
      const habitCreatedDates = { ...state.habitCreatedDates };
      delete habitCreatedDates[id];
      return {
        habits: state.habits.filter(h => h.id !== id),
        completions,
        habitCreatedDates,
      };
    });
  },

  renameHabit: (id, newName) => {
    set(state => ({
      habits: state.habits.map(h => h.id === id ? { ...h, name: newName } : h),
    }));
  },

  reorderHabits: (fromId, toId) => {
    set(state => {
      const habits = [...state.habits];
      const fromIdx = habits.findIndex(h => h.id === fromId);
      const toIdx   = habits.findIndex(h => h.id === toId);
      if (fromIdx < 0 || toIdx < 0) return {};
      const [moved] = habits.splice(fromIdx, 1);
      habits.splice(toIdx, 0, moved);
      return { habits };
    });
  },
});
