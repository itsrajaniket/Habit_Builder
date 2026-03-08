export const TEST_USERS = { user1: '1234', user2: '1234', user3: '1234' };

export const DEFAULT_HABITS = [
  { id: 1, name: 'Wake up at 05:00', emoji: '⏰', category: 'mindset', board: 'all' },
  { id: 2, name: 'Gym', emoji: '💪', category: 'health', board: 'health' },
  { id: 3, name: 'Reading/Learning', emoji: '📚', category: 'learning', board: 'personal' },
  { id: 4, name: 'Day Planning', emoji: '📝', category: 'mindset', board: 'work' },
  { id: 5, name: 'Budget Tracking', emoji: '💰', category: 'finance', board: 'personal' },
  { id: 6, name: 'Project Work', emoji: '🎯', category: 'learning', board: 'work' },
  { id: 7, name: 'No Alcohol', emoji: '🚫', category: 'health', board: 'health' },
  { id: 8, name: 'Social Media Detox', emoji: '🌿', category: 'mindset', board: 'personal' },
  { id: 9, name: 'Goal Journaling', emoji: '📓', category: 'mindset', board: 'personal' },
  { id: 10, name: 'Cold Shower', emoji: '🚿', category: 'health', board: 'health' },
];

export const CATEGORY_COLORS = {
  health:   { bg: '#e3f2fd', accent: '#1976d2', label: '🔵 Health' },
  finance:  { bg: '#fffde7', accent: '#f9a825', label: '🟡 Finance' },
  learning: { bg: '#e8f5e9', accent: '#388e3c', label: '🟢 Learning' },
  mindset:  { bg: '#f3e5f5', accent: '#7b1fa2', label: '🟣 Mindset' },
  other:    { bg: '#f5f5f5', accent: '#757575', label: '⚪ Other' },
};

export const EMOJIS = [
  '⏰','💪','📚','📝','💰','🎯','🚫','🌿','📓','🚿',
  '🏃','🧘','💧','🥗','😴','🎨','🎵','🧠','💻','📱',
  '🚶','🚴','🏊','⚽','🎮','📖','✍️','🗣️',
];

export const MOOD_EMOJIS = ['😞','😕','😐','🙂','😊','😄','🤩','💪','🔥','⚡'];

export const BADGES = [
  { id: 'first_day',    name: 'First Step',    icon: '👣', desc: 'Complete 1 day' },
  { id: 'week_warrior', name: 'Week Warrior',  icon: '⚔️', desc: '7 day streak' },
  { id: 'month_master', name: 'Month Master',  icon: '👑', desc: '30 day streak' },
  { id: 'perfect_week', name: 'Perfect Week',  icon: '✨', desc: '100% for 7 days' },
  { id: 'century',      name: 'Centurion',     icon: '💯', desc: '100 completions' },
  { id: 'dedication',   name: 'Dedicated',     icon: '🔥', desc: '50 day streak' },
  { id: 'freeze_pro',   name: 'Ice Cold',      icon: '🧊', desc: 'Use a streak freeze' },
];

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export const DAY_NAMES_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const DAY_NAMES_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];
export const DAY_NAMES_3 = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const BOARDS = [
  { value: 'all',      label: '🌐 All' },
  { value: 'health',   label: '💪 Health' },
  { value: 'work',     label: '💼 Work' },
  { value: 'personal', label: '🏠 Personal' },
];

export const CATEGORIES = [
  { value: 'all',      label: 'All' },
  { value: 'health',   label: '🔵 Health' },
  { value: 'finance',  label: '🟡 Finance' },
  { value: 'learning', label: '🟢 Learning' },
  { value: 'mindset',  label: '🟣 Mindset' },
  { value: 'other',    label: '⚪ Other' },
];

// ─── HABIT STARTER KITS ──────────────────────────────────────
export const HABIT_KITS = [
  {
    id: 'morning_warrior',
    name: 'Morning Warrior',
    icon: '🌅',
    description: 'Win your mornings, win your day',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.2)',
    habits: [
      { name: 'Drink water', emoji: '💧', category: 'health', board: 'health' },
      { name: 'Cold shower', emoji: '🚿', category: 'health', board: 'health' },
      { name: 'Morning stretch', emoji: '🧘', category: 'health', board: 'health' },
      { name: 'Journal 3 things', emoji: '📓', category: 'mindset', board: 'personal' },
      { name: 'No phone first hour', emoji: '📵', category: 'mindset', board: 'personal' },
      { name: 'Take vitamins', emoji: '💊', category: 'health', board: 'health' },
    ],
  },
  {
    id: 'fitness_focus',
    name: 'Fitness Focus',
    icon: '💪',
    description: 'Build a body you are proud of',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.2)',
    habits: [
      { name: 'Workout', emoji: '💪', category: 'health', board: 'health' },
      { name: '10k steps', emoji: '🚶', category: 'health', board: 'health' },
      { name: 'No junk food', emoji: '🥗', category: 'health', board: 'health' },
      { name: 'Drink 2L water', emoji: '💧', category: 'health', board: 'health' },
      { name: 'Sleep by midnight', emoji: '😴', category: 'health', board: 'health' },
      { name: 'Post-workout stretch', emoji: '🧘', category: 'health', board: 'health' },
    ],
  },
  {
    id: 'deep_work',
    name: 'Deep Work',
    icon: '🧠',
    description: 'Sharpen your focus and output',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.2)',
    habits: [
      { name: '2hr focused work', emoji: '💻', category: 'learning', board: 'work' },
      { name: 'No social media AM', emoji: '🚫', category: 'mindset', board: 'personal' },
      { name: 'Read 20 pages', emoji: '📖', category: 'learning', board: 'personal' },
      { name: 'One big task done', emoji: '🎯', category: 'learning', board: 'work' },
      { name: 'Evening review', emoji: '📝', category: 'mindset', board: 'work' },
      { name: 'Learn something new', emoji: '🧠', category: 'learning', board: 'personal' },
    ],
  },
  {
    id: 'financial_discipline',
    name: 'Financial Discipline',
    icon: '💰',
    description: 'Take control of your money',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.2)',
    habits: [
      { name: 'Log expenses', emoji: '💰', category: 'finance', board: 'personal' },
      { name: 'No impulse buy', emoji: '🛒', category: 'finance', board: 'personal' },
      { name: 'Cook at home', emoji: '🍳', category: 'finance', board: 'personal' },
      { name: 'Check savings goal', emoji: '📊', category: 'finance', board: 'personal' },
      { name: '15min finance review', emoji: '📈', category: 'finance', board: 'personal' },
    ],
  },
  {
    id: 'mental_wellness',
    name: 'Mental Wellness',
    icon: '😌',
    description: 'Nurture your mind and soul',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.2)',
    habits: [
      { name: 'Meditate 10 mins', emoji: '🧘', category: 'mindset', board: 'personal' },
      { name: 'Gratitude journal', emoji: '📓', category: 'mindset', board: 'personal' },
      { name: 'No doomscrolling', emoji: '🌿', category: 'mindset', board: 'personal' },
      { name: '20 mins outside', emoji: '🌤️', category: 'health', board: 'personal' },
      { name: 'Screen-free hour', emoji: '📵', category: 'mindset', board: 'personal' },
      { name: 'Call someone you care', emoji: '📞', category: 'mindset', board: 'personal' },
    ],
  },
  {
    id: 'evening_ritual',
    name: 'Evening Ritual',
    icon: '🌙',
    description: 'End each day with intention',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.2)',
    habits: [
      { name: 'Plan tomorrow', emoji: '📝', category: 'mindset', board: 'personal' },
      { name: 'No screens after 10', emoji: '📵', category: 'mindset', board: 'personal' },
      { name: 'Reflect on the day', emoji: '📓', category: 'mindset', board: 'personal' },
      { name: 'Light stretching', emoji: '🧘', category: 'health', board: 'health' },
      { name: 'Read fiction', emoji: '📚', category: 'learning', board: 'personal' },
      { name: 'Consistent bedtime', emoji: '😴', category: 'health', board: 'health' },
    ],
  },
];
