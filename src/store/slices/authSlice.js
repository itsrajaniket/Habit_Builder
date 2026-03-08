import { supabase } from '../../lib/supabase';

export const createAuthSlice = (set, get) => ({
  currentUser:   null,   // email string
  currentUserId: null,   // uuid from supabase auth
  authLoading:   true,   // true while we check the session on boot

  // ─── Boot: restore session & subscribe to auth changes ────────
  initAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          currentUser:   session.user.email,
          currentUserId: session.user.id,
          authLoading:   false,
        });
        await get().initUserData(session.user.id);
      } else {
        set({ authLoading: false });
      }
    } catch (err) {
      console.error('initAuth error:', err);
      set({ authLoading: false });
    }

    // Live listener — handles token refresh, sign-out from another tab, etc.
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({
          currentUser:   session.user.email,
          currentUserId: session.user.id,
        });
        if (event === 'SIGNED_IN') {
          await get().initUserData(session.user.id);
        }
      } else {
        set({ currentUser: null, currentUserId: null });
      }
    });
  },

  // ─── Sign up ──────────────────────────────────────────────────
  signup: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.session) {
      set({ currentUser: data.user.email, currentUserId: data.user.id });
      await get().initUserData(data.user.id);
      return { success: true, confirmed: true };
    }
    return { success: true, confirmed: false, message: 'Check your inbox to confirm your email.' };
  },

  // ─── Sign in with email + password ───────────────────────────
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    set({ currentUser: data.user.email, currentUserId: data.user.id });
    await get().initUserData(data.user.id);
    return { success: true };
  },

  // ─── Google OAuth ─────────────────────────────────────────────
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  // ─── Password reset email ─────────────────────────────────────
  sendPasswordReset: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  // ─── Sign out ─────────────────────────────────────────────────
  logout: async () => {
    await supabase.auth.signOut();
    const userId = get().currentUserId;
    if (userId) localStorage.removeItem(`habitData_${userId}`);
    set({ currentUser: null, currentUserId: null });
  },

  // Legacy shim so other components don't break
  restoreSession: () => {},
});
