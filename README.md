# 🎯 Habit Builder Kit

![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-4.5.5-orange?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-2.98.0-green?style=for-the-badge&logo=supabase)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)

## 1. Project Overview
Habit Builder Kit is a modern, high-fidelity daily habit tracker built for a premium user experience. It helps users maintain consistency in their routines through visually rewarding gamification, seamless offline capabilities, and built-in mental wellness tracking. Built for professionals and self-improvement enthusiasts, it solves the problem of abandoned goals by turning daily check-ins into an addictive, rewarding loop.

**Value Proposition**: Build better habits with a visually stunning, local-first tracker that gamifies consistency and holistically tracks your mental wellness.

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Live Demo & Visuals](#2-live-demo--visuals)
3. [Tech Stack & Choices](#3-tech-stack--choices)
4. [Comprehensive Features & Capabilities](#4-comprehensive-features--capabilities)
5. [Project Structure](#5-project-structure)
6. [State Management & Data Flow](#6-state-management--data-flow)
7. [Browser APIs & Technical Highlights](#7-browser-apis--technical-highlights)
8. [Getting Started & Installation](#8-getting-started--installation)
9. [Future Roadmap / Contributing](#9-future-roadmap--contributing)
10. [License](#10-license)

---

## 2. Live Demo & Visuals

*Live Demo link coming soon!*

### Screenshots
- ![Dashboard View](./screenshots/dashboard.png)
- ![Mental State Analytics](./screenshots/analytics.png)
- ![Calendar Heatmap](./screenshots/calendar.png)
- ![XP & Leveling System](./screenshots/leveling.png)

---

## 3. Tech Stack & Choices

| Technology | Version | Category | Why Chosen |
|------------|---------|----------|------------|
| **React** | `^18.3.1` | Core | Component-based architecture with a robust ecosystem, perfect for a highly interactive calendar grid. |
| **Vite** | `^5.4.2` | Core | Lightning-fast development server and highly optimized production builds compared to traditional bundlers like Webpack. |
| **Zustand** | `^4.5.5` | State Mgmt | Boilerplate-free, modular state management that natively supports persisting state to `localStorage` for offline use. |
| **Tailwind CSS** | `^3.4.4` | Styling | Rapid, utility-first styling enabling a perfectly consistent dark-mode aesthetic and smooth micro-animations. |
| **Supabase (JS)** | `^2.98.0` | Storage/API| Instant PostgreSQL backend providing secure authentication and background syncing for a seamless user experience. |
| **Chart.js** | `^4.4.4` | UI/Viz | Extremely capable, canvas-based charting for visualizing complex mood data and completion trends. |
| **Razorpay** | *via script* | Payments | Simple, secure Indian payment gateway integration for the Pro tier upgrade flow. |

---

## 4. Comprehensive Features & Capabilities

Here is every single feature packed into the Habit Builder Kit and exactly how it functions:

### 🛠 Core Tracking & Workflows
- **Multi-View Calendar Trackers**: Users can comfortably check off habits using an exhaustive `Month` grid, a highly-focused `Week` view, or a dedicated `Yesterday` tab to quickly catch up on late logs.
- **Categorization & Filtering (`CommandBar`)**: Habits can be assigned specific custom Boards or colored Categories. The CommandBar allows users to instantly filter the entire application view to show only specific segments (e.g., "Health" or "Work").
- **Day Notes / Journaling**: A built-in modal allows users to attach text notes to any passing day, giving them context for why they missed a habit or hit a perfect streak.
- **Bulk Logging**: Allows users to quickly select and "Check All" past habits across the board to save time.

### 🎮 Gamification & Rewards
- ⭐ **XP & Leveling Engine**: Checking off habits accumulates XP. At set thresholds, the user's global "Level" increases, giving a visual ranking of their overall dedication.
- ⭐ **Streak Freezes & Grace Periods**: When users hit "Perfect Days" consistently, they automatically earn Streak Freeze tokens. A freeze will autonomously deploy if the user misses a day, keeping a hard-earned streak alive entirely guilt-free.
- **Procedural Soundscapes (Web Audio API)**: Clicking checkboxes fires procedurally synthesized, music-less Chime sound effects (`useSound.js`). Unchecking plays a softer, descending pitch. 
- **Confetti Engine**: Native canvas-based confetti cascades across the screen automatically upon hitting a 100% completion rate for the day.
- **Badges Board**: Users organically unlock UI badges (e.g., "7 Day Streak", "100 Habits Completed") to display proudly on their dashboard.

### 🧠 Mental Wellness Analytics
- ⭐ **Mental State Tracker**: Independent of habit checking, users log their daily "Mood" and "Motivation" on a simple 1-10 slider system.
- **Correlation Charts**: The `MentalChart.jsx` maps out checking-consistency against Mood & Motivation using `Chart.js` line graphs, allowing users to visually see if their mood correlates with their habits.
- **Habit Progress Rings**: Displays beautiful, animated circular progress SVGs displaying precisely how close they are to clearing the active board's load.
- **Yearly GitHub-Style Heatmap**: A massive 365-day block chart tracking absolute habit intensity throughout the full year.

### 💼 Account & Data Ownership
- **Guest Mode Bypass**: Users can instantly trial the app offline without signing up; standard dummy `GUEST_DATA` handles the visualization previews.
- **Supabase Authentication**: Secure login via email/password or Google OAuth. 
- **Pro Tier Gate (Razorpay)**: Free users are soft-capped at 5 habits. An integrated Razorpay checkout lets users upgrade to a lifetime Pro plan, unlocking deep analytics and infinite rows.
- **Total Local Export/Import**: Users can download their entire JSON store state (completions, habits, notes, mood, streaks) to their device. This grants ultimate privacy and acts as an offline backup that can be re-imported via `FileReader` anytime.
- **Social 'Share Card' Generator**: Uses HTML Canvas APIs to generate and download a gradient, highly-stylized graphic showcasing the user's monthly progress to share on social networks.

### ⚡ Architectural Features
- ⭐ **Zero-Latency Local Sync Engine**: The app never forces the user to wait on a loading spinner to check a box. Every interaction is instantly written to `localStorage`. A silent background worker then uses `upsert` to sync this cache to the Supabase Postgres instance seamlessly.
- **Custom Theme Engine**: Supports instant Light/Dark mode toggling by directly manipulating CSS variable injections (`document.documentElement`).

---

## 5. Project Structure

```text
src/
├── App.jsx                     # Top-level layout, grid shell, and background listeners
├── main.jsx                    # App entry point with custom hash-router setup
├── assets/                     # Static files and stylesheets
│   ├── fonts/
│   ├── images/
│   ├── index.css
│   ├── style.css               # Contains custom glassmorphism and animation CSS
│   └── tailwind.css
├── components/                 # Reusable, stateless UI components
│   ├── AppFooter.jsx
│   ├── CommandBar.jsx          # Top bar for board/category filtering
│   ├── ConfirmModal.jsx
│   ├── GlobalNav.jsx
│   ├── GuestBanner.jsx
│   ├── PricingModal.jsx        # Free vs Pro tier modal and Razorpay UI
│   ├── ProBadge.jsx
│   └── ui/                     # Baseline UI primitives
│       ├── Button.jsx
│       ├── Collapsible.jsx
│       ├── Modal.jsx
│       ├── Pill.jsx
│       ├── PillGroup.jsx
│       └── Toast.jsx           # Global notification UI wrapper
├── features/                   # Domain-driven modular features
│   ├── analytics/              # Deep charts and visualization components
│   │   ├── AnalyticsFooter.jsx
│   │   ├── DayOfWeekChart.jsx
│   │   ├── MentalChart.jsx     # Line graph correlating Mood/Motivation
│   │   ├── MentalStatePanel.jsx
│   │   ├── MonthlyReportCard.jsx
│   │   ├── MoodCell.jsx
│   │   ├── MoodPickerPopover.jsx
│   │   ├── MotivationCell.jsx
│   │   ├── ProgressRings.jsx
│   │   └── YearHeatmap.jsx     # Github-style 365-day block chart
│   ├── auth/                   # Identity and gating
│   │   ├── AuthForms.jsx       # Email/password input forms
│   │   ├── AuthGuard.jsx       # Wrapper to prevent unauthenticated access
│   │   ├── LoginPage.jsx       # Main landing and sign-in interface
│   │   ├── ProGate.jsx         # Guards premium UI from free users
│   │   ├── landingData.js
│   │   └── useAuth.js
│   ├── calendar/               # Core tracking grid system
│   │   ├── CalendarTable.jsx   # Centerpiece controlling time loops
│   │   ├── CheckCell.jsx       # The interactive day/habit toggler
│   │   ├── DayHeaderCell.jsx
│   │   ├── DayNotesModal.jsx
│   │   ├── MonthView.jsx
│   │   ├── TodayView.jsx
│   │   ├── WeekView.jsx
│   │   ├── YesterdayView.jsx
│   │   └── useCalendar.js
│   ├── habits/                 # Habit creation and list management
│   │   ├── BulkCheckin.jsx
│   │   ├── EmptyState.jsx
│   │   ├── HabitModal.jsx      # Creation/Edit drawer for habits
│   │   ├── HabitRow.jsx
│   │   ├── HabitRowHeader.jsx
│   │   ├── InlineEdit.jsx
│   │   ├── MeatballMenu.jsx
│   │   ├── TodayPanel.jsx
│   │   └── useHabits.js
│   └── sidebar/                # Right-pane analytical widgets
│       ├── Badge.jsx
│       ├── BadgesPanel.jsx
│       ├── DataExport.jsx      # JSON Blob generation and FileReader parsing
│       ├── HabitAnalysis.jsx
│       ├── HabitAnalysisRow.jsx
│       ├── ProgressChart.jsx
│       ├── ShareCard.jsx
│       ├── ShareCardDownload.jsx # Generates PNG Share-Card from Canvas
│       ├── Sidebar.jsx
│       ├── StatCard.jsx
│       ├── StatsBar.jsx
│       └── XPLevelCard.jsx     # Gamification leveling tracking
├── hooks/                      # Custom native-API wrappers
│   ├── useClickOutside.js
│   ├── useConfetti.js          # Handles canvas confetti rendering
│   ├── useHotkeys.js
│   ├── useLocalStorage.js      # Synced local cache handler
│   ├── useRazorpay.js          # Payment processing engine
│   ├── useSound.js             # Synthesizes web audio beeps and chimes
│   └── useTheme.js             # Injects Light/Dark mode CSS classes
├── lib/
│   └── supabase.js             # Initialized Supabase client singleton
├── pages/                      # Static routing content
│   ├── PrivacyPolicy.jsx
│   └── TermsOfService.jsx
├── store/                      # Zustand global state system
│   ├── habitStore.js           # Root persisted store coordinating everything
│   ├── selectors.js
│   └── slices/                 # Modular domain state logic files
│       ├── authSlice.js        # Supabase session handlers
│       ├── completionsSlice.js # Central dictionary of checked dates
│       ├── habitsSlice.js
│       ├── mentalStateSlice.js
│       ├── notesSlice.js
│       ├── streakSlice.js
│       └── uiSlice.js
└── utils/                      # Pure javascript helpers
    ├── badgeCalc.js
    ├── chartTheme.js
    ├── constants.js
    ├── dateUtils.js            # Complex date shifting and parsing math
    ├── dowUtils.js
    ├── guestData.js            # Sandbox fallback data for offline testing
    ├── heatmapUtils.js
    ├── sanitize.js
    ├── statsCalc.js
    └── streakCalc.js
```

---

## 6. State Management & Data Flow

### State Architecture
The global state uses **Zustand** combined with its `persist` middleware. Instead of one massive store file, the logic is divided into modular slices (`authSlice`, `habitsSlice`, `completionsSlice`, `streakSlice`, `mentalStateSlice`, `notesSlice` etc.) which are then merged into the `useHabitStore` inside `store/habitStore.js`.

The critical data objects are:
- `habits`: An array of objects defining active habits (title, icon, category).
- `completions`: A master dictionary mapping `habitId` -> `dateStr` -> `boolean` representing historical check-ins.
- `mentalState`: A categorized object storing daily 1-10 scale rankings for `mood` and `motivation`.

### Data Flow Walkthrough: Completing a Habit
When a user clicks on a table cell to check off a habit on a specific date:
1. The `CheckCell.jsx` component registers the click.
2. It plays a custom Audio effect using the `useSound.js` hook's `playCheck()` method.
3. It triggers the `toggleCompletion(habitId, dateStr)` action on the global Zustand store.
4. Zustand instantly updates the `completions` object in memory. 
5. The `useEffect` inside `App.jsx` reacts to the `completions` state change. It verifies if every active habit for "today" has been checked (a "Perfect Day").
6. If the day is perfect, the `App` fires `triggerConfetti()` (from `useConfetti.js`) and invokes `checkAndAwardFreezes()` granting streaks.
7. Finally, `saveUserData()` is triggered. This immediately serializes the new state out to `localStorage` (for instant persistence), and fires off a background, non-blocking `supabase.from('habit_data').upsert()` request to keep the Postgres cloud up to date.

---

## 7. Browser APIs & Technical Highlights

This application opts for pure native browser APIs whenever possible to reduce dependency bloat, ensuring maximum performance and longevity offline.

### Native Browser APIs Utilized:
- **`localStorage` API (`hooks/useLocalStorage.js`, `store/habitStore.js`):** Forms the core of the offline-first caching mechanism. Allows for 0ms initial load times and protects data when network connections drop.
- **Web Audio API (`hooks/useSound.js`):** Generates purely programmatic synthesizer sound effects for checking/unchecking and leveling up. Using `window.AudioContext`, `createOscillator`, and `createGain`, it completely negates the need for fetching external `.mp3` files.
- **HTML Canvas API (`hooks/useConfetti.js` & `hooks/ShareCardDownload.jsx`):** 
  - Uses `requestAnimationFrame` and a `<canvas>` element to mathematically calculate and draw 120 custom confetti particles falling across the screen upon "Perfect Days".
  - Draws a fully composited "Share Your Progress" image with custom gradients and text properties via `getContext('2d')`, then triggers a `HTMLAnchorElement` (`<a>`) download.
- **Blob / File / URL API (`features/sidebar/DataExport.jsx`):** Enables complete portability by packaging the user's Zustand JSON state into a downloadable `Blob` via `URL.createObjectURL()`. Similarly, it parses file uploads back into state strings using `FileReader`.
- **Location Storage & DOM Mutability (`hooks/useTheme.js` & `main.jsx`):** Employs a custom, tiny zero-dependency hash-based router using listening to `window.addEventListener('hashchange')`. Theme manipulation directly writes to `document.documentElement` attributes.

### Performance Optimizations:
- **Zero-Wait Database Sink:** All database operations are purely background syncs. `localStorage` is treated as the source of truth for UI renders, obliterating loading spinners. 
- **CSS-Driven Layouts for Heatmaps:** The intricate Calendar and Yearly Heatmaps rely on CSS Grid & Flexbox calculations (managed by `dateUtils.js`) instead of heavy JS reflowing, remaining highly performant even when calculating the entire year visually.

---

## 8. Getting Started & Installation

To run the Habit Builder Kit locally, you need to set up the Node environment and configure the required Supabase and Razorpay credentials.

### Prerequisites
- Node.js (`v18` or higher)
- A Supabase Project
- A Razorpay Testing Account

### 1. Install Dependencies
```bash
git clone <repository-url>
cd habit_builder_kit
npm install
```

### 2. Environment Variables Configuration
Create a `.env.local` file at the root of the project to match the required API keys:
```env
VITE_APP_NAME="Habit Builder Kit"
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

### 3. Supabase Database Schema
For the app to successfully sync user data in the background, you must create a `habit_data` table in your Supabase SQL editor:

```sql
CREATE TABLE public.habit_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_pro BOOLEAN DEFAULT false,
  pro_plan TEXT,
  pro_expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.habit_data ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select and upsert their own data
CREATE POLICY "Users can manage their own habit data"
  ON public.habit_data
  FOR ALL
  USING (auth.uid() = user_id);
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will start immediately on `http://localhost:5173`.

---

## 9. Future Roadmap / Contributing

We are constantly looking to expand the Habit Builder Kit. Current goals for the future include:
- Integrating Push Notifications for daily reminders via Service Workers.
- Creating a native mobile bundle wrapper utilizing Ionic/Capacitor.
- Introducing a "Social Leaderboard" for users to compete on streaks.

Contributions are highly welcome! If you'd like to improve the codebase, please open an Issue to discuss your idea before submitting a Pull Request. Focus on maintaining the local-first, zero-latency rendering standard.

---

## 10. License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software as long as you provide proper attribution.
