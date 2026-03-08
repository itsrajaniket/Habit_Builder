import useHabitStore from '../../store/habitStore';

export function useAuth() {
  const currentUser       = useHabitStore(s => s.currentUser);
  const currentUserId     = useHabitStore(s => s.currentUserId);
  const authLoading       = useHabitStore(s => s.authLoading);
  const login             = useHabitStore(s => s.login);
  const signup            = useHabitStore(s => s.signup);
  const logout            = useHabitStore(s => s.logout);
  const loginWithGoogle   = useHabitStore(s => s.loginWithGoogle);
  const sendPasswordReset = useHabitStore(s => s.sendPasswordReset);
  const initUserData      = useHabitStore(s => s.initUserData);
  return { currentUser, currentUserId, authLoading, login, signup, logout, loginWithGoogle, sendPasswordReset, initUserData };
}
