import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getStorageItem, removeStorageItem } from '../utils/storage';
import userService from '../api/services/users';
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

type ApiLoginResponse = {
    tokens: {
        access_token: string;
        refresh_token: string;
    };
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string | null;
        phone_number: string;
        profile_picture: string | null;
        role_id: string;
        last_password_reset: string | null;
        last_login: string;
        account_status: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        role: {
            id: string;
            title: string;
            role_permissions: Array<{
                id: number;
                permissions: {
                    id: string;
                    title: string;
                };
            }>;
        };
    };
    message: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<LoginResponse>;
    verifyOtp: (payload: { otp: string; user_id: string; source?: string }) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = getStorageItem('authToken');

            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            await userService.testConnection();

            const userData = await userService.getCurrentUser();
            setUser(userData);
        } catch (err) {
            removeStorageItem('authToken');
            setUser(null);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Authentication failed');
            }
            console.error('Auth check failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (email: string, password: string): Promise<LoginResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await userService.login(email, password);
            return response;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Login failed');
            }
            console.error('Login failed:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const normalizeApiResponse = (apiResponse: ApiLoginResponse): LoginResponse => {
        return {
            success: true,
            message: apiResponse.message,
            accessToken: apiResponse.tokens.access_token,
            refreshToken: apiResponse.tokens.refresh_token,
            user: apiResponse.user
        };
    };

    const verifyOtp = async (payload: { otp: string; user_id: string; source?: string }): Promise<LoginResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const rawResponse: ApiLoginResponse = await userService.verifyOtp(payload);

            const response = normalizeApiResponse(rawResponse);

            try {
                const cookieOptions = {
                    expires: 1,
                    secure: window.location.protocol === 'https:',
                    sameSite: 'strict' as const
                };

                // Store tokens using the normalized response
                Cookies.set('authToken', response.accessToken || '', cookieOptions);
                Cookies.set('refreshToken', response.refreshToken || '', cookieOptions);

                if (response.user) {
                    const userData: User = {
                        id: response.user.id,
                        name: `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim(),
                        email: response.user.email || '',
                        role: response.user.role?.title || '',
                        avatar: response.user.profile_picture,
                        roleId: response.user.role_id,
                        permissions: response.user.role?.role_permissions?.map(rp => rp.permissions?.title) || []
                    };

                    setUser(userData);
                    Cookies.set('userData', JSON.stringify(userData), cookieOptions);
                }

                // Optional: Log for debugging
                console.log('Auth tokens stored successfully');

            } catch (storageError) {
                console.error('Error storing auth data in cookies:', storageError);
            }

            // Return the normalized response
            return response;

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to verify OTP');
            }
            console.error('OTP verification failed:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);

        try {
            await userService.logout();
        } catch (err) {
            console.error('Logout API error:', err);
        } finally {
            // Clear all auth-related cookies and storage
            Cookies.remove('authToken');
            Cookies.remove('refreshToken');
            Cookies.remove('userData');
            removeStorageItem('authToken');
            setUser(null);
            setIsLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await userService.forgotPassword(email);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to send reset email');
            }
            console.error('Forgot password failed:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (token: string, newPassword: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await userService.resetPassword(token, newPassword);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to reset password');
            }
            console.error('Password reset failed:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        verifyOtp,
        logout,
        forgotPassword,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;