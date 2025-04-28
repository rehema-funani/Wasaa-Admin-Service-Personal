import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
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

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('auth_token');

                if (token) {
                    setUser({
                        id: '1',
                        name: 'Admin User',
                        email: 'admin@streampay.com',
                        role: 'admin'
                    });
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                localStorage.removeItem('auth_token');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // In a real implementation, this would be an API call
            // For demo purposes, we'll just simulate a successful login
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check credentials (demo only - in real app would be done server-side)
            if (email === 'admin@streampay.com' && password === 'password') {
                // Store token
                localStorage.setItem('auth_token', 'demo_token_12345');

                // Set user
                setUser({
                    id: '1',
                    name: 'Admin User',
                    email: 'admin@streampay.com',
                    role: 'admin'
                });
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('User registered:', { name, email });

        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Password reset requested for:', email);
        } catch (error) {
            console.error('Password reset request failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (token: string, newPassword: string) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Password reset completed with token:', token);
        } catch (error) {
            console.error('Password reset failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;