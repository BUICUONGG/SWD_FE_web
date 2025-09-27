import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store interface
interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
  setUser: (user: any) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (user, token) => {
        localStorage.setItem('authToken', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// App Store interface
interface AppState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  notifications: Notification[];
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

// App Store
export const useAppStore = create<AppState>()((set, get) => ({
  theme: 'light',
  isLoading: false,
  notifications: [],
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    set({ notifications: [...get().notifications, newNotification] });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(newNotification.id);
    }, 5000);
  },
  removeNotification: (id) =>
    set({ notifications: get().notifications.filter((n) => n.id !== id) }),
}));