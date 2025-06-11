// src/hooks/useAuth.ts
import { useAuthStore } from '../stores/useAuthStore';

const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuthStatus,
    forgotPassword,
    resetPassword,
    verifyOtp,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth: checkAuthStatus,
    forgotPassword,
    resetPassword,
    verifyOtp,
  };
};

export default useAuth;
