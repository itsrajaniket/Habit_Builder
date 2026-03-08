export const createCompletionsSlice = (set, get) => ({
  completions: {},

  initCompletions: (habitId) => {
    set(state => ({
      completions: { ...state.completions, [habitId]: state.completions[habitId] || {} },
    }));
  },

  toggleCompletion: (habitId, dateStr) => {
    set(state => {
      const habitCompletions = { ...(state.completions[habitId] || {}) };
      habitCompletions[dateStr] = !habitCompletions[dateStr];
      return {
        completions: { ...state.completions, [habitId]: habitCompletions },
      };
    });
  },

  setCompletion: (habitId, dateStr, value) => {
    set(state => {
      const habitCompletions = { ...(state.completions[habitId] || {}) };
      habitCompletions[dateStr] = value;
      return {
        completions: { ...state.completions, [habitId]: habitCompletions },
      };
    });
  },
});
