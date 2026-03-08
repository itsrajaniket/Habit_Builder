# 🎯 Habit Builder Kit

> Build habits that actually stick — track streaks, log your mood, earn XP, and understand your patterns. Cloud-synced, offline-first, free forever.

---

## ✨ Features

| Feature              | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| 📅 Calendar Grid     | Visual month/week view — check off habits day by day                |
| 🔥 Streak Tracking   | Active streaks with freeze protection for rough days                |
| 📦 Starter Kits      | 6 pre-built habit packs (Morning Warrior, Deep Work, Fitness, etc.) |
| 🧠 Mental State      | Daily mood & motivation logging with trend charts                   |
| 📈 Deep Analytics    | Year heatmap, day-of-week patterns, monthly reports                 |
| 🎯 Progress Rings    | Per-habit completion rings for the current month                    |
| ⚔️ XP & Levels       | Earn XP for completions, streaks, and perfect days — 50 levels      |
| 🏆 Achievements      | Unlock badges for milestones like Week Warrior and Month Master     |
| ☁️ Cloud Sync        | Data synced to Supabase — access from any device                    |
| 💾 Data Export       | Download all your data as JSON, import it back anytime              |
| 🌙 Dark / Light Mode | Fully themed UI, remembers your preference                          |
| ☑️ Bulk Delete       | Select and remove multiple habits at once                           |

---

## 🚀 Tech Stack

- **Frontend** — React 18 + Vite
- **Styling** — Tailwind CSS + custom CSS design tokens
- **State** — Zustand (with localStorage cache)
- **Auth & DB** — Supabase (email/password + Google OAuth)
- **Charts** — Chart.js
- **Animations** — Web Audio API (sound), CSS keyframes (particle bursts)
- **Hosting** — Vercel

---

## 🏁 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/itsrajaniket/habit-builder-kit.git
cd habit-builder-kit

# 2. Install dependencies
npm install

# 3. Add your Supabase credentials
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Run locally
npm run dev
```

---

## 🗄️ Supabase Setup

Run this SQL in your Supabase SQL Editor:

```sql
create table public.habit_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

create unique index habit_data_user_idx on public.habit_data(user_id);
alter table public.habit_data enable row level security;

create policy "Users can read own data" on public.habit_data
  for select using (auth.uid() = user_id);
create policy "Users can upsert own data" on public.habit_data
  for insert with check (auth.uid() = user_id);
create policy "Users can update own data" on public.habit_data
  for update using (auth.uid() = user_id);
```

---

## ⚙️ Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=Habit Builder Kit
```

---

## 🗂️ Project Structure

```
src/
├── features/
│   ├── auth/          # Login, signup, onboarding, AuthGuard
│   ├── calendar/      # Month/week views, CheckCell, DayHeader
│   ├── habits/        # HabitModal, EmptyState, TodayPanel, starter kits
│   ├── analytics/     # MentalState, ProgressRings, heatmap, reports
│   └── sidebar/       # HabitAnalysis, XPLevelCard, ProgressChart, DataExport
├── store/
│   └── slices/        # Zustand slices: auth, habits, completions, streaks...
├── components/        # GlobalNav, CommandBar, AppFooter, UI primitives
├── pages/             # PrivacyPolicy, TermsOfService
├── hooks/             # useSound, useConfetti, useTheme, useHotkeys
└── utils/             # dateUtils, statsCalc, streakCalc, chartTheme
```

---

## 💡 XP System

| Action                   | XP           |
| ------------------------ | ------------ |
| Habit completed          | +10          |
| Streak ≥ 3 days bonus    | +5           |
| Perfect day (all habits) | +25          |
| Level up                 | every 200 XP |
| Max level                | 50           |

XP resets on the 1st of each month — race fresh every month.

---

## 🔐 Auth

- Email + password via Supabase Auth
- Google OAuth (enable in Supabase dashboard → Providers → Google)
- Session persists across browser restarts
- Password reset via email link
- Row Level Security — users can only access their own data

---

## 📄 Legal

- [Privacy Policy](/#privacy)
- [Terms of Service](/#terms)

---

## 👨‍💻 Developer

**Aniket Raj** — [@itsrajaniket](https://github.com/itsrajaniket) · [LinkedIn](https://linkedin.com/in/itsaniketraj) · Indore, India

---

> _"We are what we repeatedly do. Excellence, then, is not an act, but a habit."_ — Aristotle
