import axios from 'axios';
import { getStorageItem } from '../../utils/storage';

type User = {
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
    user?: {
        id: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        phone_number?: string;
        profile_picture?: string;
        role_id?: string;
        role?: {
            id: string;
            title: string;
            role_permissions: Array<any>;
        };
    };
    refreshToken?: string;
    user_id?: string;
};

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://138.68.190.213:3010/';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY || 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==',
  },
  timeout: 30000, 
});

api.interceptors.request.use(
  (config) => {
    const token = getStorageItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} from ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`❌ Response error ${error.response.status}:`, error.response.data);
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
      } else {
        console.error('❌ Request setup error:', error.message);
      }
    } else {
      console.error('❌ Non-Axios error:', error);
    }
    return Promise.reject(error);
  }
);

export const userService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/admin-signin', { email, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Login failed. Please check your network connection.');
    }
  },

  async verifyOtp(payload: { otp: string; user_id: string; source?: string }): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/verify-otp', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'OTP verification failed');
    }
    throw new Error('OTP verification failed. Please check your network connection.');
  }
},

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to get user data');
      }
      throw new Error('Failed to get user data. Please check your network connection.');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to send reset email');
      }
      throw new Error('Failed to send reset email. Please check your network connection.');
    }
  },

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      const response = await api.get(`/auth/verify-reset-token/${token}`);
      return response.data.valid;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Invalid or expired token');
      }
      throw new Error('Failed to verify reset token. Please check your network connection.');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, password: newPassword });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to reset password');
      }
      throw new Error('Failed to reset password. Please check your network connection.');
    }
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>('/auth/profile', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update profile');
      }
      throw new Error('Failed to update profile. Please check your network connection.');
    }
  },


  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to change password');
      }
      throw new Error('Failed to change password. Please check your network connection.');
    }
  },
  
  async testConnection(): Promise<boolean> {
    try {
      const response = await api.get('/');
      console.log('API connection test successful:', response.status);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
};

export default userService;