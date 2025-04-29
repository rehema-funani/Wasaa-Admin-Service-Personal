import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import userService from '../api/services/users';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add any other user properties
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Create the auth provider component
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated using the token in storage
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getStorageItem('authToken');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      // Verify token and get user data
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      // Token might be invalid or expired
      removeStorageItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Added checkAuth to dependency array to fix eslint warning

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call login API
      const { user, token } = await userService.login(email, password);
      
      // Store token in local storage
      setStorageItem('authToken', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return user;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Call logout API
      await userService.logout();
    } catch (error) {
      // Even if the API call fails, we still want to clear the local state
      console.error('Logout API error:', error);
    } finally {
      // Remove token and clear state
      removeStorageItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Create context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;