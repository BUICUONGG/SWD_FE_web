import { create } from 'zustand';

/**
 * Auth Store - Quản lý authentication state
 * Sử dụng Zustand + Persist middleware để lưu state vào localStorage
 */

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MENTOR' | 'STUDENT';
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Login
  login: (user: User, accessToken: string, refreshToken: string) => void;
  
  // Logout
  logout: () => void;
  
  // Register
  register: (user: User) => void;
  
  // Update user
  updateUser: (user: Partial<User>) => void;
  
  // Set tokens
  setTokens: (accessToken: string, refreshToken: string) => void;
  
  // Restore from storage
  restoreAuth: () => void;

  // Check auth
  isAdmin: () => boolean;
  isStudent: () => boolean;
  isMentor: () => boolean;
}

/**
 * Zustand Auth Store
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Login action
  login: (user: User, accessToken: string, refreshToken: string) => {
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  // Logout action
  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Register action
  register: (user: User) => {
    set({
      user,
      isAuthenticated: false, // Cần login sau register
      isLoading: false,
    });
  },

  // Update user info
  updateUser: (userUpdate: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userUpdate } : null,
    }));
  },

  // Set tokens
  setTokens: (accessToken: string, refreshToken: string) => {
    set({ accessToken, refreshToken });
  },

  // Restore from localStorage (init)
  restoreAuth: () => {
    try {
      const userStr = localStorage.getItem('auth-userInfo');
      const accessToken = localStorage.getItem('auth-accessToken');
      const refreshToken = localStorage.getItem('auth-refreshToken');

      if (userStr && accessToken) {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to restore auth:', error);
    }
  },

  // Check if admin
  isAdmin: () => {
    return get().user?.role === 'ADMIN';
  },

  // Check if student
  isStudent: () => {
    return get().user?.role === 'STUDENT';
  },

  // Check if mentor
  isMentor: () => {
    return get().user?.role === 'MENTOR';
  },
}));

/**
 * Export hook
 */
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // State
    user: store.user,
    accessToken: store.accessToken,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Role checks
    isAdmin: store.isAdmin(),
    isStudent: store.isStudent(),
    isMentor: store.isMentor(),

    // Actions
    setLoading: store.setLoading,
    setError: store.setError,
    login: store.login,
    logout: store.logout,
    register: store.register,
    updateUser: store.updateUser,
    setTokens: store.setTokens,
    restoreAuth: store.restoreAuth,
  };
};
