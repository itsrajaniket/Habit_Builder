export const createMentalStateSlice = (set, get) => ({
  mentalState: { mood: {}, motivation: {} },

  setMood: (dateStr, value) => {
    set(state => ({
      mentalState: {
        ...state.mentalState,
        mood: { ...state.mentalState.mood, [dateStr]: value },
      },
    }));
  },

  setMotivation: (dateStr, value) => {
    set(state => ({
      mentalState: {
        ...state.mentalState,
        motivation: { ...state.mentalState.motivation, [dateStr]: value },
      },
    }));
  },
});
