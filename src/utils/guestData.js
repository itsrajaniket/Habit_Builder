// ─── Demo data for Guest Mode ─────────────────────────────────
// 15 habits across 5 categories with 3 months of realistic data

export const GUEST_HABITS = [
  // Morning / Mindfulness
  {
    id: 1,
    name: "Morning Meditation",
    emoji: "🧘",
    category: "mindfulness",
    board: "all",
  },
  {
    id: 2,
    name: "Gratitude Journal",
    emoji: "📓",
    category: "mindfulness",
    board: "all",
  },
  {
    id: 3,
    name: "5-min Deep Breathing",
    emoji: "🌬️",
    category: "mindfulness",
    board: "all",
  },

  // Fitness
  {
    id: 4,
    name: "Exercise 30 min",
    emoji: "🏃",
    category: "fitness",
    board: "all",
  },
  {
    id: 5,
    name: "10,000 Steps",
    emoji: "👟",
    category: "fitness",
    board: "all",
  },
  {
    id: 6,
    name: "Stretch / Yoga",
    emoji: "🤸",
    category: "fitness",
    board: "all",
  },

  // Health
  {
    id: 7,
    name: "Drink 8 Glasses",
    emoji: "💧",
    category: "health",
    board: "all",
  },
  {
    id: 8,
    name: "Sleep by 11 PM",
    emoji: "😴",
    category: "health",
    board: "all",
  },
  {
    id: 9,
    name: "No Junk Food",
    emoji: "🥗",
    category: "health",
    board: "all",
  },

  // Learning
  {
    id: 10,
    name: "Read 20 Pages",
    emoji: "📚",
    category: "learning",
    board: "all",
  },
  {
    id: 11,
    name: "Learn Something New",
    emoji: "🧠",
    category: "learning",
    board: "all",
  },
  {
    id: 12,
    name: "Practice Coding",
    emoji: "💻",
    category: "learning",
    board: "all",
  },

  // Focus / Productivity
  {
    id: 13,
    name: "No Social Media",
    emoji: "📵",
    category: "focus",
    board: "all",
  },
  {
    id: 14,
    name: "Deep Work Block",
    emoji: "🎯",
    category: "focus",
    board: "all",
  },
  {
    id: 15,
    name: "Plan Tomorrow",
    emoji: "📋",
    category: "focus",
    board: "all",
  },
];

function fmt(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

function generateCompletions() {
  const completions = {};
  const now = new Date();

  // Each habit has its own "personality" — some very consistent, some streaky
  // Index matches GUEST_HABITS order (0-based)
  const profiles = [
    { rate: 0.88, streak: true }, // Meditation — very consistent
    { rate: 0.75, streak: false }, // Journal — good but occasional misses
    { rate: 0.7, streak: false }, // Breathing
    { rate: 0.65, streak: true }, // Exercise — building habit
    { rate: 0.8, streak: false }, // Steps — usually hits it
    { rate: 0.55, streak: false }, // Yoga — inconsistent
    { rate: 0.92, streak: true }, // Water — nearly every day
    { rate: 0.6, streak: false }, // Sleep — hard one
    { rate: 0.5, streak: false }, // No junk — toughest
    { rate: 0.78, streak: false }, // Reading
    { rate: 0.62, streak: false }, // Learn
    { rate: 0.58, streak: false }, // Coding
    { rate: 0.7, streak: true }, // No social media
    { rate: 0.72, streak: false }, // Deep work
    { rate: 0.85, streak: false }, // Plan tomorrow — easy win habit
  ];

  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const dim = daysInMonth(y, m);
    const isCurrentMonth = monthOffset === 0;
    const todayD = now.getDate();

    GUEST_HABITS.forEach((h, hi) => {
      if (!completions[h.id]) completions[h.id] = {};
      const { rate, streak } = profiles[hi];

      for (let d = 1; d <= dim; d++) {
        if (isCurrentMonth && d > todayD) continue;
        const ds = fmt(y, m, d);

        if (streak) {
          // Streak personality: long runs of success with occasional breaks
          const phase = Math.floor((d + hi * 3) / 7) % 3;
          completions[h.id][ds] = phase < 2; // 2 weeks on, 1 week patchy
        } else {
          // Regular personality: seeded pseudo-random based on habit + day
          const seed = (h.id * 37 + d * 13 + m * 7) % 100;
          completions[h.id][ds] = seed < rate * 100;
        }
      }
    });
  }

  return completions;
}

function generateMentalState() {
  const mood = {};
  const motivation = {};
  const now = new Date();

  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const dim = daysInMonth(y, m);
    const isCurrentMonth = monthOffset === 0;
    const todayD = now.getDate();

    for (let d = 1; d <= dim; d++) {
      if (isCurrentMonth && d > todayD) continue;
      const ds = fmt(y, m, d);
      // Slightly upward trend over time to show progress
      const trendBoost = monthOffset === 0 ? 1 : monthOffset === 1 ? 0 : -1;
      const moodSeed = (d * 17 + m * 5) % 5;
      const motivSeed = (d * 11 + m * 9) % 5;
      mood[ds] = Math.max(3, Math.min(10, 6 + moodSeed - 2 + trendBoost));
      motivation[ds] = Math.max(
        3,
        Math.min(10, 7 + motivSeed - 2 + trendBoost),
      );
    }
  }

  return { mood, motivation };
}

function generateNotes() {
  const now = new Date();
  const notes = {};
  const samples = [
    "🔥 Hit all 15 habits today — best day this month!",
    "Skipped yoga and coding but everything else done ✅",
    "Tough day. Only managed morning habits. Tomorrow better.",
    "Started a new reading streak — on page 240 of the book 📚",
    "Meal prepped on Sunday, no-junk streak is at 6 days!",
    "Meditation really helping with focus this week 🧘",
    "Missed sleep target again. Need to set a phone alarm.",
  ];

  for (let i = 0; i < samples.length; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i * 3);
    const ds = fmt(d.getFullYear(), d.getMonth() + 1, d.getDate());
    notes[ds] = samples[i];
  }

  return notes;
}

export const GUEST_DATA = {
  habits: GUEST_HABITS,
  completions: generateCompletions(),
  mentalState: generateMentalState(),
  dayNotes: generateNotes(),
  streakFreezes: 3,
  freezeUsedDates: [],
  perfectDaysCount: 11,
  _lastPerfectDayRecorded: null,
  bestMonthScores: {},
  habitCreatedDates: Object.fromEntries(
    GUEST_HABITS.map((h) => [h.id, "2024-01-01"]),
  ),
  activeBoard: "all",
  activeCategory: "all",
  calendarView: "month",
  theme: "dark",
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  currentWeekStart: null,
};
