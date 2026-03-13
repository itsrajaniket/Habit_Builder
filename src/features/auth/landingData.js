// src/features/auth/landingData.js

import IMG_YESTERDAY from "../../assets/images/IMG_YESTERDAY.jpeg";
import IMG_MENTAL from "../../assets/images/IMG_MENTAL.jpeg";
import IMG_XP from "../../assets/images/IMG_XP.jpeg";
import IMG_STREAKS from "../../assets/images/IMG_STREAKS.jpeg";
import IMG_ACHIEVEMENTS from "../../assets/images/IMG_ACHIEVEMENTS.jpeg";
import IMG_BESTDAY from "../../assets/images/IMG_BESTDAY.jpeg";

export const HEADLINE_WORDS = [
  "Level",
  "up",
  "your",
  "life,",
  "one",
  "habit",
  "at",
  "a",
  "time.",
];

export const FEATURES = [
  {
    icon: "📅",
    label: "Calendar Grid",
    desc: "Visual month/week view",
    img: IMG_YESTERDAY,
  },
  {
    icon: "📊",
    label: "Analytics",
    desc: "Understand your patterns",
    img: IMG_BESTDAY,
  },
  {
    icon: "🧠",
    label: "Mental State",
    desc: "Track mood & motivation",
    img: IMG_MENTAL,
  },
  {
    icon: "🔥",
    label: "Streaks",
    desc: "Momentum that sticks",
    img: IMG_STREAKS,
  },

  {
    icon: "⚔️",
    label: "XP & Levels",
    desc: "Gamified progression",
    img: IMG_XP,
  },
  {
    icon: "🏆",
    label: "Achievements",
    desc: "Unlock rewards",
    img: IMG_ACHIEVEMENTS,
  },
];

export const TESTIMONIALS = [
  {
    name: "Aisha K.",
    avatar: "👩🏾",
    role: "Product Designer",
    stars: 5,
    quote:
      "I've tried every habit app. This one actually made me understand *why* I was failing. The mental state tracking changed everything.",
  },
  {
    name: "Marcus T.",
    avatar: "👨🏻",
    role: "Software Engineer",
    stars: 5,
    quote:
      "The XP system sounds gimmicky but it genuinely keeps me coming back. 47-day streak. Never thought I'd say that.",
  },
  {
    name: "Priya S.",
    avatar: "👩🏽",
    role: "Entrepreneur",
    stars: 5,
    quote:
      "The monthly report card is brutal (Day Planning: F 😅) but that honesty is exactly what I needed. Week 3 and already improving.",
  },
  {
    name: "Jordan L.",
    avatar: "🧑🏼",
    role: "Fitness Coach",
    stars: 5,
    quote:
      "My clients use this now. The streak visualization and achievement system keeps motivation high between sessions.",
  },
];

export const BENEFIT_BULLETS = [
  { icon: "🔒", text: "Free forever · No credit card" },
  { icon: "☁️", text: "Cloud sync across all devices" },
  { icon: "📴", text: "Offline-first — works anywhere" },
];

export const STEPS = [
  {
    icon: "📅",
    title: "Visual habit calendar",
    desc: "See your entire month at a glance. Green squares fill up as you build momentum.",
  },
  {
    icon: "🔥",
    title: "Build streaks & earn XP",
    desc: "Every habit completed earns XP. Level up from Rookie to Legend across 50 tiers.",
  },
  {
    icon: "🧠",
    title: "Understand yourself",
    desc: "Log mood & motivation daily. Spot patterns that unlock real growth.",
  },
];

export const ALL_TESTIMONIALS = [
  ...TESTIMONIALS,
  {
    name: "Rohan V.",
    avatar: "👨🏽",
    role: "Student",
    quote:
      "₹99 lifetime is genuinely the best money I spent this year. The analytics alone are worth it — I finally understand my own patterns.",
  },
  {
    name: "Meera N.",
    avatar: "👩🏻",
    role: "Writer",
    quote:
      "Progress rings + streak freezes = I haven't broken my writing habit in 60 days. This app just gets it.",
  },
];

export const PRICING_PLANS = [
  {
    id: "free",
    label: "Free",
    price: "₹0",
    period: "forever",
    popular: false,
    cta: "Get Started",
    features: [
      { ok: true, text: "Up to 5 habits" },
      { ok: true, text: "Calendar view" },
      { ok: true, text: "Basic streaks" },
      { ok: true, text: "Cloud sync" },
      { ok: false, text: "Analytics & charts" },
      { ok: false, text: "XP & level system" },
      { ok: false, text: "Mental state tracking" },
      { ok: false, text: "Data export" },
      { ok: false, text: "Achievements & badges" },
    ],
  },
  {
    id: "weekly",
    label: "1-Week Trial",
    price: "₹11",
    period: "try for 7 days",
    popular: false,
    cta: "Try for ₹11",
    features: [
      { ok: true, text: "Unlimited habits" },
      { ok: true, text: "Calendar view" },
      { ok: true, text: "Streaks + freeze tokens" },
      { ok: true, text: "Cloud sync" },
      { ok: true, text: "Analytics & charts" },
      { ok: true, text: "XP & level system" },
      { ok: true, text: "Mental state tracking" },
      { ok: true, text: "Data export" },
      { ok: true, text: "Achievements & badges" },
    ],
  },
  {
    id: "lifetime",
    label: "Lifetime Pro",
    price: "₹99",
    period: "pay once, own forever",
    popular: true,
    cta: "Get Lifetime Access",
    features: [
      { ok: true, text: "Unlimited habits" },
      { ok: true, text: "Calendar view" },
      { ok: true, text: "Streaks + freeze tokens" },
      { ok: true, text: "Cloud sync" },
      { ok: true, text: "Analytics & charts" },
      { ok: true, text: "XP & level system" },
      { ok: true, text: "Mental state tracking" },
      { ok: true, text: "Data export" },
      { ok: true, text: "Achievements & badges" },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    q: "Is my data safe if I close the app?",
    a: "Yes. Everything syncs to your personal cloud account. Your habits, streaks, and history are always secure and available from any device you sign in to.",
  },
  {
    q: "What's the difference between weekly and lifetime?",
    a: "The weekly plan (₹11) gives you full Pro access for 7 days — perfect for testing everything. Lifetime (₹99) is a one-time payment that never expires. No subscription, no renewals.",
  },
  {
    q: "What happens to my streak if I miss a day?",
    a: "You earn streak freeze tokens by completing all habits on milestone days. Use one on any missed day to protect your streak — it's a safety net, not a cheat.",
  },
  {
    q: "Can I export my data?",
    a: "Pro users can export all habit history, completions, and mental state logs as CSV or JSON at any time. Your data is always yours.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Habit Builder Kit is offline-first — log completions even without internet. Data syncs automatically when you reconnect.",
  },
  {
    q: "Is payment secure?",
    a: "Payments are processed by Razorpay, one of India's most trusted payment gateways. We never store your card details. UPI, cards, and net banking are all supported.",
  },
];
