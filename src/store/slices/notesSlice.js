export const createNotesSlice = (set, get) => ({
  dayNotes: {},

  setDayNote: (dateStr, text) => {
    set(state => ({
      dayNotes: { ...state.dayNotes, [dateStr]: text },
    }));
  },
});
