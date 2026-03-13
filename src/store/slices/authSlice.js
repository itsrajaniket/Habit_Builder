import { supabase } from "../../lib/supabase";
import { GUEST_DATA } from "../../utils/guestData";

export const createAuthSlice = (set, get) => ({
  currentUser: null,
  currentUserId: null,
  authLoading: true,
  isPro: false,
  proPlan: null,
  proExpiresAt: null,

  // ─── Guest mode ───────────────────────────────────────────────
  isGuest: false,

  enterGuestMode: () => {
    set({
      isGuest: true,
      currentUser: "guest",
      currentUserId: "guest",
      authLoading: false,
      isPro: true, // show full pro UI so guests see what they're missing
      ...GUEST_DATA,
    });
  },

  exitGuestMode: () => {
    set({
      isGuest: false,
      currentUser: null,
      currentUserId: null,
      isPro: false,
      proPlan: null,
      proExpiresAt: null,
      authLoading: false,
    });
  },

  // ─── Helper: fetch pro status from habit_data ─────────────────
  _loadProStatus: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("habit_data")
        .select("is_pro, pro_plan, pro_expires_at")
        .eq("user_id", userId)
        .single();

      if (error || !data) return;

      const expired =
        data.pro_expires_at && new Date(data.pro_expires_at) < new Date();

      set({
        isPro: data.is_pro && !expired,
        proPlan: data.pro_plan ?? null,
        proExpiresAt: data.pro_expires_at ?? null,
      });
    } catch (err) {
      console.error("_loadProStatus error:", err);
    }
  },

  // ─── Call after successful payment ────────────────────────────
  refreshProStatus: async () => {
    const userId = get().currentUserId;
    if (!userId || userId === "guest") return;

    await get()._loadProStatus(userId);

    if (!get().isPro) {
      await new Promise((r) => setTimeout(r, 1000));
      await get()._loadProStatus(userId);
    }

    if (!get().isPro) {
      await new Promise((r) => setTimeout(r, 2000));
      await get()._loadProStatus(userId);
    }
  },

  // ─── Boot ─────────────────────────────────────────────────────
  initAuth: async () => {
    if (get().isGuest) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          currentUser: session.user.email,
          currentUserId: session.user.id,
          authLoading: false,
        });
        await get().initUserData(session.user.id);
        await get()._loadProStatus(session.user.id);
      } else {
        set({ authLoading: false });
      }
    } catch (err) {
      console.error("initAuth error:", err);
      set({ authLoading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (get().isGuest) return;
      if (session?.user) {
        set({
          currentUser: session.user.email,
          currentUserId: session.user.id,
        });
        if (event === "SIGNED_IN") {
          await get().initUserData(session.user.id);
          await get()._loadProStatus(session.user.id);
        }
      } else {
        set({
          currentUser: null,
          currentUserId: null,
          isPro: false,
          proPlan: null,
          proExpiresAt: null,
        });
      }
    });
  },

  // ─── Sign up ──────────────────────────────────────────────────
  signup: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.session) {
      set({
        isGuest: false,
        currentUser: data.user.email,
        currentUserId: data.user.id,
      });
      await get().initUserData(data.user.id);
      await get()._loadProStatus(data.user.id);
      return { success: true, confirmed: true };
    }
    return {
      success: true,
      confirmed: false,
      message: "Check your inbox to confirm your email.",
    };
  },

  // ─── Sign in ──────────────────────────────────────────────────
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error: error.message };
    set({
      isGuest: false,
      currentUser: data.user.email,
      currentUserId: data.user.id,
    });
    await get().initUserData(data.user.id);
    await get()._loadProStatus(data.user.id);
    return { success: true };
  },

  // ─── Google OAuth ─────────────────────────────────────────────
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  // ─── Password reset ───────────────────────────────────────────
  sendPasswordReset: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  // ─── Sign out ─────────────────────────────────────────────────
  logout: async () => {
    if (get().isGuest) {
      get().exitGuestMode();
      return;
    }
    await supabase.auth.signOut();
    const userId = get().currentUserId;
    if (userId) localStorage.removeItem(`habitData_${userId}`);
    set({
      currentUser: null,
      currentUserId: null,
      isPro: false,
      proPlan: null,
      proExpiresAt: null,
    });
  },

  restoreSession: () => {},
});
