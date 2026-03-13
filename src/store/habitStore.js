import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slices/authSlice";
import { createHabitsSlice } from "./slices/habitsSlice";
import { createCompletionsSlice } from "./slices/completionsSlice";
import { createStreakSlice } from "./slices/streakSlice";
import { createMentalStateSlice } from "./slices/mentalStateSlice";
import { createNotesSlice } from "./slices/notesSlice";
import { createUiSlice } from "./slices/uiSlice";
import { DEFAULT_HABITS } from "../utils/constants";
import { fmt, daysInMonth } from "../utils/dateUtils";

function generateSampleCompletions(habits, year, month) {
  const completions = {};
  const dim = daysInMonth(year, month);
  habits.forEach((h) => {
    completions[h.id] = {};
    for (let d = 1; d <= dim; d++) {
      const ds = fmt(year, month + 1, d);
      if (Math.random() > 0.3) completions[h.id][ds] = true;
    }
  });
  return completions;
}

function generateSampleMentalState(year, month) {
  const mood = {},
    motivation = {};
  const dim = daysInMonth(year, month);
  for (let d = 1; d <= dim; d++) {
    const ds = fmt(year, month + 1, d);
    mood[ds] = Math.floor(Math.random() * 5) + 5;
    motivation[ds] = Math.floor(Math.random() * 5) + 4;
  }
  return { mood, motivation };
}

const useHabitStore = create(
  persist(
    (set, get) => ({
      ...createAuthSlice(set, get),
      ...createHabitsSlice(set, get),
      ...createCompletionsSlice(set, get),
      ...createStreakSlice(set, get),
      ...createMentalStateSlice(set, get),
      ...createNotesSlice(set, get),
      ...createUiSlice(set, get),

      // ─── Load user data: localStorage first (instant), then Supabase ───
      initUserData: async (userId) => {
        // Never run for guest — their data comes from guestData.js
        if (get().isGuest) return;

        const { supabase } = await import("../lib/supabase");
        const storageKey = `habitData_${userId}`;

        const applyData = (saved) => {
          const now = new Date();
          set({
            habits: saved.habits || JSON.parse(JSON.stringify(DEFAULT_HABITS)),
            completions: saved.completions || {},
            mentalState: saved.mentalState || { mood: {}, motivation: {} },
            dayNotes: saved.dayNotes || {},
            streakFreezes: saved.streakFreezes || 0,
            freezeUsedDates: saved.freezeUsedDates || [],
            perfectDaysCount: saved.perfectDaysCount || 0,
            _lastPerfectDayRecorded: saved._lastPerfectDayRecorded || null,
            bestMonthScores: saved.bestMonthScores || {},
            habitCreatedDates: saved.habitCreatedDates || {},
            activeBoard: saved.activeBoard || "all",
            activeCategory: saved.activeCategory || "all",
            calendarView: saved.calendarView || "month",
            theme: saved.theme || "dark",
            currentMonth: saved.currentMonth ?? now.getMonth(),
            currentYear: saved.currentYear ?? now.getFullYear(),
            currentWeekStart: saved.currentWeekStart || null,
          });
        };

        // 1. Apply localStorage cache immediately so UI is instant
        const raw = localStorage.getItem(storageKey);
        let hasLocalData = false;
        if (raw) {
          try {
            applyData(JSON.parse(raw));
            hasLocalData = true;
          } catch (_) {}
        }

        // 2. Fetch from Supabase (authoritative — overwrites local if newer)
        try {
          const { data, error } = await supabase
            .from("habit_data")
            .select("data")
            .eq("user_id", userId)
            .maybeSingle();

          if (!error && data?.data) {
            applyData(data.data);
            localStorage.setItem(storageKey, JSON.stringify(data.data));
          } else if (!hasLocalData) {
            // Brand new user — blank slate
            const habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
            set({
              habits,
              completions: {},
              mentalState: { mood: {}, motivation: {} },
            });
            get().saveUserData();
          }
        } catch (err) {
          console.warn("Supabase fetch failed, using local cache:", err);
          if (!hasLocalData) {
            const habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
            set({
              habits,
              completions: {},
              mentalState: { mood: {}, motivation: {} },
            });
          }
        }
      },

      // ─── Save: write to localStorage instantly, sync Supabase in bg ───
      saveUserData: async () => {
        const state = get();
        // ✅ Guest guard — never save guest data anywhere
        if (!state.currentUserId || state.isGuest) return;

        const toSave = {
          habits: state.habits,
          completions: state.completions,
          mentalState: state.mentalState,
          dayNotes: state.dayNotes,
          streakFreezes: state.streakFreezes,
          freezeUsedDates: state.freezeUsedDates,
          perfectDaysCount: state.perfectDaysCount,
          _lastPerfectDayRecorded: state._lastPerfectDayRecorded,
          bestMonthScores: state.bestMonthScores,
          habitCreatedDates: state.habitCreatedDates,
          activeBoard: state.activeBoard,
          activeCategory: state.activeCategory,
          calendarView: state.calendarView,
          theme: state.theme,
          currentMonth: state.currentMonth,
          currentYear: state.currentYear,
          currentWeekStart: state.currentWeekStart,
        };

        // Instant local write
        try {
          localStorage.setItem(
            `habitData_${state.currentUserId}`,
            JSON.stringify(toSave),
          );
        } catch (e) {
          if (e?.name === "QuotaExceededError")
            console.warn("localStorage full");
        }

        // Background Supabase sync
        try {
          const { supabase } = await import("../lib/supabase");
          await supabase.from("habit_data").upsert(
            {
              user_id: state.currentUserId,
              data: toSave,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
        } catch (err) {
          console.warn(
            "Supabase sync failed (data is safe in localStorage):",
            err,
          );
        }
      },

      getVisibleHabits: () => {
        const { habits, activeBoard, activeCategory } = get();
        let h =
          activeBoard === "all"
            ? habits
            : habits.filter(
                (x) => x.board === activeBoard || x.board === "all",
              );
        if (activeCategory !== "all")
          h = h.filter((x) => x.category === activeCategory);
        return h;
      },

      getActiveHabitCountOnDate: (ds) => {
        const { habits, habitCreatedDates } = get();
        const allTracked = Object.keys(habitCreatedDates).length > 0;
        if (!allTracked) return habits.length;
        return (
          habits.filter((h) => {
            const created = habitCreatedDates[h.id];
            return !created || created <= ds;
          }).length || habits.length
        );
      },
    }),
    {
      name: "habit-tracker-session",
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);

export default useHabitStore;
