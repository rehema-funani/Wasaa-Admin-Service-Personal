import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStorageItem, removeStorageItem } from '../utils/storage';
import userService from '../api/services/users';
import Cookies from 'js-cookie';

export type User = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  roleId?: string;
  permissions?: string[];
};

type LoginResponse = {
  success?: boolean;
  requiresOtp?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  user_id?: string;
};

type ApiLoginResponse = {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: any;
  message: string;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  verifyOtp: (payload: { otp: string; user_id: string; source?: string }) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      checkAuthStatus: async () => {
        set({ isLoading: true, error: null });

        try {
          const token = getStorageItem('authToken');
          if (!token) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          await userService.testConnection();
          const userData = await userService.getCurrentUser();

          set({ user: userData, isAuthenticated: true });
        } catch (err: any) {
          removeStorageItem('authToken');
          set({ user: null, error: err?.message || 'Authentication failed', isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await userService.login(email, password);
          return response;
        } catch (err: any) {
          set({ error: err?.message || 'Login failed' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async ({ otp, user_id, source }) => {
        set({ isLoading: true, error: null });

        try {
          const raw = await userService.verifyOtp({ otp, user_id, source }) as ApiLoginResponse;
          const response: LoginResponse = {
            success: true,
            message: raw.message,
            accessToken: raw.tokens.access_token,
            refreshToken: raw.tokens.refresh_token,
            user: raw.user,
          };

          const cookieOptions = {
            expires: 1,
            secure: window.location.protocol === 'https:',
            sameSite: 'strict' as const,
          };

          Cookies.set('authToken', response.accessToken || '', cookieOptions);
          Cookies.set('refreshToken', response.refreshToken || '', cookieOptions);

          const userData: User = {
            id: raw.user.id,
            name: `${raw.user.first_name || ''} ${raw.user.last_name || ''}`.trim(),
            email: raw.user.email || '',
            role: raw.user.role?.title || '',
            avatar: raw.user.profile_picture,
            roleId: raw.user.role_id,
            permissions: raw.user.role?.role_permissions?.map((rp) => rp.permissions?.title) || [],
          };

          set({ user: userData, isAuthenticated: true });
          Cookies.set('userData', JSON.stringify(userData), cookieOptions);

          return response;
        } catch (err: any) {
          set({ error: err?.message || 'Failed to verify OTP' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await userService.logout();
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          Cookies.remove('authToken');
          Cookies.remove('refreshToken');
          Cookies.remove('userData');
          removeStorageItem('authToken');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          await userService.forgotPassword(email);
        } catch (err: any) {
          set({ error: err?.message || 'Failed to send reset email' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });

        try {
          await userService.resetPassword(token, newPassword);
        } catch (err: any) {
          set({ error: err?.message || 'Failed to reset password' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
