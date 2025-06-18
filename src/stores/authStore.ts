import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://138.68.190.213:3030/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==';

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

type UserType = 'admin' | 'customer' | 'merchant';
type Source = 'web' | 'mobile';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  userType: UserType | null;
  source: Source | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string, userType?: UserType, source?: Source) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<string | null>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: localStorage.getItem('authToken') || null,
      refreshToken: localStorage.getItem('refreshToken') || null,
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
      userType: (localStorage.getItem('userType') as UserType) || 'admin',
      source: (localStorage.getItem('source') as Source) || 'web',
      isAuthenticated: !!localStorage.getItem('authToken'),
      isLoading: false,
      error: null,

      login: async (email, password, userType = 'admin', source = 'web') => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(
            `${API_URL}/auth/login`,
            { email, password, user_type: userType, source },
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': API_KEY
              }
            }
          );

          if (response.data && response.data.token) {
            const { token, refresh_token, user } = response.data;

            Cookies.set('authToken', token);
            Cookies.set('refreshToken', refresh_token);
            Cookies.set('user', JSON.stringify(user));
            Cookies.set('userType', userType);
            Cookies.set('source', source);

            set({
              accessToken: token,
              refreshToken: refresh_token,
              user,
              userType,
              source,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            throw new Error('Invalid login response');
          }
        } catch (error) {
          let errorMessage = 'Login failed';

          if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.message || 'Authentication failed';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // Logout action
      logout: () => {
        // Clear cookies
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        Cookies.remove('userType');
        Cookies.remove('source');

        // Reset state
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          error: null
        });

        // Redirect to login
        window.location.href = '/auth/login';
      },

      // Refresh authentication
      refreshAuth: async () => {
        const refreshToken = get().refreshToken || localStorage.getItem('refreshToken');
        const userType = get().userType || 'admin';
        const source = get().source || 'web';

        if (!refreshToken) {
          get().logout();
          return null;
        }

        try {
          const response = await axios.post(
            `${API_URL}/auth/refresh-token`,
            {
              refresh_token: refreshToken,
              source,
              user_type: userType
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': API_KEY
              }
            }
          );

          if (response.data && response.data.new_access_token) {
            const newAccessToken = response.data.new_access_token;
            const newRefreshToken = response.data.new_refresh_token || refreshToken;

            // Update cookies
            Cookies.set('authToken', newAccessToken);

            if (response.data.new_refresh_token) {
              Cookies.set('refreshToken', newRefreshToken);
            }

            // Update state
            set({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              isAuthenticated: true
            });

            return newAccessToken;
          } else {
            throw new Error('Invalid refresh token response');
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          return null;
        }
      },

      // Set tokens manually
      setTokens: (accessToken, refreshToken) => {
        // Update cookies
        Cookies.set('authToken', accessToken);
        Cookies.set('refreshToken', refreshToken);

        // Update state
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true
        });
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      // Only persist these values in localStorage
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        userType: state.userType,
        source: state.source,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Helper hooks for components
export const useAuth = () => {
  const { isAuthenticated, user, isLoading, error } = useAuthStore();
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);
  const clearError = useAuthStore(state => state.clearError);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    clearError
  };
};

export const useAuthToken = () => useAuthStore(state => state.accessToken);
