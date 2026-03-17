// ─── Demo data for Guest Mode ─────────────────────────────────
// 15 habits across 5 categories with 3 months of realistic data

export const GUEST_HABITS = [
  { id: 1,  name: "Drink 8 Glasses",    emoji: "💧", category: "health",      board: "all" }, // 100%
  { id: 2,  name: "Morning Meditation", emoji: "🧘", category: "mindfulness", board: "all" }, // > 80% (Green)
  { id: 3,  name: "Daily Walk",         emoji: "👟", category: "fitness",     board: "all" }, // > 80% (Green)
  { id: 4,  name: "Deep Work Block",    emoji: "🎯", category: "focus",       board: "all" }, // > 60% (Blue)
  { id: 5,  name: "Read 20 Pages",      emoji: "📚", category: "learning",    board: "all" }, // > 60% (Blue)
  { id: 6,  name: "Sleep by 11 PM",     emoji: "😴", category: "health",      board: "all" }, // > 40% (Yellow)
  { id: 7,  name: "No Social Media",    emoji: "📵", category: "focus",       board: "all" }, // > 40% (Yellow)
  { id: 8,  name: "Gratitude Journal",  emoji: "📓", category: "mindfulness", board: "all" }, // > 20% (Orange)
  { id: 9,  name: "Practice Coding",    emoji: "💻", category: "learning",    board: "all" }, // > 1% (Red)
  { id: 10, name: "Stretch / Yoga",     emoji: "🤸", category: "fitness",     board: "all" }, // 0% (Gray)
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
    { target: 1.00 }, // Water (100% - custom accent)
    { target: 0.90 }, // Meditation (90% - emerald)
    { target: 0.85 }, // Walk (85% - emerald)
    { target: 0.70 }, // Deep work (70% - blue)
    { target: 0.65 }, // Reading (65% - blue)
    { target: 0.50 }, // Sleep (50% - yellow)
    { target: 0.45 }, // No Social Media (45% - yellow)
    { target: 0.30 }, // Journal (30% - orange)
    { target: 0.10 }, // Coding (10% - red)
    { target: 0.00 }, // Stretch (0% - gray)
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
      const { target } = profiles[hi];

      // To hit exact percentages for current month, do a strict ratio distribution
      for (let d = 1; d <= dim; d++) {
        const ds = fmt(y, m, d);
        if (isCurrentMonth && d > todayD) continue; // no future completions
        
        // Use a seeded approach so gaps look random but math holds true
        const seed = ((h.id * 37) + (d * 13) + (m * 7)) % 100;
        completions[h.id][ds] = seed < (target * 100);
      }
    });
  }

  return completions;
}

function generateMentalState() {
  const mood = {};
  const motivation = {};
  const now = new Date();

  // Create a continuous day counter for smooth wave functions
  let absoluteDay = 0;

  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const dim = daysInMonth(y, m);
    const isCurrentMonth = monthOffset === 0;
    const todayD = now.getDate();

    for (let d = 1; d <= dim; d++) {
      absoluteDay++;
      if (isCurrentMonth && d > todayD) continue;
      
      const ds = fmt(y, m, d);
      const currentDate = new Date(y, m - 1, d);
      const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday

      // Weekend bump for Mood (Happy on Fri/Sat, dips on Mon/Tue)
      let weekendMoodBoost = (dayOfWeek === 5 || dayOfWeek === 6) ? 1.5 : (dayOfWeek === 0) ? 0.5 : (dayOfWeek === 1 || dayOfWeek === 2) ? -1.0 : 0;
      
      // Motivation bump (High early in the week, low on Fri/Sat)
      let weekendMotivBoost = (dayOfWeek === 1 || dayOfWeek === 2) ? 1.5 : (dayOfWeek === 5 || dayOfWeek === 6) ? -1.0 : 0;

      // Long wave to simulate "good weeks" and "bad weeks"
      let longWaveMood = Math.sin(absoluteDay / 14 * Math.PI * 2) * 1.5;
      let longWaveMotiv = Math.cos(absoluteDay / 10 * Math.PI * 2) * 1.5;

      // Random noise seed
      const noise = ((d * 17 + m * 5) % 100) / 100; // 0.0 to 1.0
      
      // Calculate base values (typically around 6.5 out of 10)
      let baseMood = 6.5 + weekendMoodBoost + longWaveMood + (noise * 2 - 1);
      let baseMotiv = 6.5 + weekendMotivBoost + longWaveMotiv + (noise * 2 - 1);

      // Add a slight upward trend over the 3 months to show general improvement
      const trendBoost = monthOffset === 0 ? 0.8 : monthOffset === 1 ? 0 : -0.8;
      
      mood[ds] = Math.max(1, Math.min(10, Math.round(baseMood + trendBoost)));
      motivation[ds] = Math.max(1, Math.min(10, Math.round(baseMotiv + trendBoost)));
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
