import { useAuthStore } from '../store/authStore';

/**
 * Custom Hook: useAuth
 * Hook để dễ dàng truy cập auth state và actions từ Zustand store
 * Thay thế cho cách import trực tiếp useAuthStore
 */
export const useAuth = () => {
  const authStore = useAuthStore();

  return {
    // State
    user: authStore.user,
    accessToken: authStore.accessToken,
    refreshToken: authStore.refreshToken,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,

    // Role checks
    isAdmin: authStore.isAdmin(),
    isStudent: authStore.isStudent(),
    isMentor: authStore.isMentor(),

    // Actions
    setLoading: authStore.setLoading,
    setError: authStore.setError,
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    updateUser: authStore.updateUser,
    setTokens: authStore.setTokens,
    restoreAuth: authStore.restoreAuth,
  };
};

export default useAuth;
