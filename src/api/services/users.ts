import axios from 'axios';
import Cookies from 'js-cookie';


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

const baseURL = import.meta.env.VITE_API_URL || 'http://138.68.190.213:3010/';
const apiKey = import.meta.env.VITE_API_KEY || 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw==';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': apiKey
  },
  timeout: 30_000,
});

// Request interceptor using js-cookie
api.interceptors.request.use(
  (config) => {
    try {
      // Get token from cookies
      const token = Cookies.get('authToken');
      
      // Add token to headers if it exists
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      // Log error but don't block the request
      console.error('Error accessing token from cookies:', error);
      return config;
    }
  },
  (error) => {
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
    const response = await api.post<any>('/auth/verify-otp', payload);
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
  },

async getUsers(): Promise<any> {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get users');
    }
    throw new Error('Failed to get users. Please check your network connection.');
  }
},

async deleteUser(userId: string): Promise<any> {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete user');
    }
    throw new Error('Failed to delete user. Please check your network connection.');
  }
},

async updateUser(userId: string, userData: any): Promise<any> {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update user');
    }
    throw new Error('Failed to update user. Please check your network connection.');
  }
},

async createUser(userData: any): Promise<any> {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create user');
    }
    throw new Error('Failed to create user. Please check your network connection.');
  }
},

async getAdminUsers(): Promise<any> {
  try {
    const response = await api.get('/users?role=admin');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get admin users');
    }
    throw new Error('Failed to get admin users. Please check your network connection.');
  }
}
};

export default userService;