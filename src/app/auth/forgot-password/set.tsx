import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const checkPasswordStrength = (password: string): { strength: number; message: string } => {
    if (!password) return { strength: 0, message: 'Password is required' };
    if (password.length < 6) return { strength: 1, message: 'Weak - Too short' };

    let strength = 0;

    if (/[a-z]/.test(password)) strength += 1;

    if (/[A-Z]/.test(password)) strength += 1;

    if (/\d/.test(password)) strength += 1;

    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    let message = '';
    if (strength <= 1) message = 'Weak';
    else if (strength === 2) message = 'Fair';
    else if (strength === 3) message = 'Good';
    else message = 'Strong';

    return { strength, message };
};

const resetPasswordRequest = async (password: string, token: string) => {
    try {
        const response = await axios.post('http://138.68.190.213:3010/admin/set-password',
            { password },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'x-api-key': 'QgR1v+o16jphR9AMSJ9Qf8SnOqmMd4HPziLZvMU1Mt0t7ocaT38q/8AsuOII2YxM60WaXQMkFIYv2bqo+pS/sw=='
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const set: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [strengthCheck, setStrengthCheck] = useState({ strength: 0, message: '' });

    const location = useLocation();
    const navigate = useNavigate();

    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        setStrengthCheck(checkPasswordStrength(password));
    }, [password]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await resetPasswordRequest(password, token || '');
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);
        } catch (err) {
            let errorMessage = 'Failed to reset password. Please try again.';

            if ((err as any).response && (err as any).response.data && (err as any).response.data.message) {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err instanceof Error && err.message) {
                errorMessage = err.message;
            }

            setErrors({
                general: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white">
            <div className="hidden lg:block lg:w-2/5 bg-zinc-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-teal-500/10" />

                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-500/10" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-primary-500/10" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                        className="relative w-full max-w-xs"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-10">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-500 to-primary-500 flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-medium text-gray-500">Security Level</p>
                                    <span className="text-xs font-medium text-teal-500">Protected</span>
                                </div>
                                <div className="h-12 flex items-end space-x-1">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "100%" }}
                                        transition={{ duration: 0.5 }}
                                        className="w-6 rounded-t bg-gradient-to-t from-teal-500 to-primary-500"
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "60%" }}
                                        transition={{ delay: 0.1, duration: 0.5 }}
                                        className="w-6 rounded-t bg-gradient-to-t from-teal-500 to-primary-500"
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "80%" }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="w-6 rounded-t bg-gradient-to-t from-teal-500 to-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-medium text-gray-500">Password Reset</p>
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-300"></div>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold mb-1">Create New Password</p>
                                <div className="h-1 w-full bg-gray-100 rounded-full mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "75%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-1 bg-teal-500 rounded-full"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Almost done</span>
                                    <span className="text-teal-500 font-medium">Final step</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="w-full lg:w-3/5 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm"
                >
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-primary-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900">Set new password</h2>
                        <p className="text-xs text-gray-500 mt-1">Create a secure password for your account</p>
                    </div>

                    {isSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-teal-50 rounded-xl border border-teal-100 mb-4"
                        >
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-teal-800">Password successfully reset!</h3>
                                    <div className="mt-1 text-xs text-teal-600">
                                        <p>Redirecting to login page...</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {errors?.general && (
                                <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                                    <p className="text-xs text-red-500">{errors?.general}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full px-4 py-2.5 pr-10 rounded-xl text-sm
                      ${errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'}
                      focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {errors.password ? (
                                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                                    ) : password ? (
                                        <div className="mt-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center space-x-1">
                                                    <span className={`w-2 h-2 rounded-full ${strengthCheck.strength >= 1 ? 'bg-teal-500' : 'bg-gray-300'}`}></span>
                                                    <span className={`w-2 h-2 rounded-full ${strengthCheck.strength >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></span>
                                                    <span className={`w-2 h-2 rounded-full ${strengthCheck.strength >= 3 ? 'bg-teal-500' : 'bg-gray-300'}`}></span>
                                                    <span className={`w-2 h-2 rounded-full ${strengthCheck.strength >= 4 ? 'bg-teal-500' : 'bg-gray-300'}`}></span>
                                                </div>
                                                <span className={`text-xs font-medium ${strengthCheck.strength <= 1 ? 'text-red-500' :
                                                    strengthCheck.strength === 2 ? 'text-orange-500' :
                                                        strengthCheck.strength === 3 ? 'text-primary-500' :
                                                            'text-teal-500'
                                                    }`}>
                                                    {strengthCheck.message}
                                                </span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 rounded-full">
                                                <div
                                                    className={`h-1 rounded-full ${strengthCheck.strength <= 1 ? 'bg-red-500' :
                                                        strengthCheck.strength === 2 ? 'bg-orange-500' :
                                                            strengthCheck.strength === 3 ? 'bg-primary-500' :
                                                                'bg-teal-500'
                                                        }`}
                                                    style={{ width: `${strengthCheck.strength * 25}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full px-4 py-2.5 pr-10 rounded-xl text-sm
                      ${errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'}
                      focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <p className="text-xs text-gray-500 mb-3">
                                        Your password should:
                                    </p>
                                    <ul className="space-y-1 text-xs text-gray-500">
                                        <li className="flex items-center">
                                            <span className={`mr-1.5 ${password.length >= 6 ? 'text-teal-500' : 'text-gray-400'}`}>
                                                {password.length >= 6 ? (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-9a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                            Be at least 6 characters long
                                        </li>
                                        <li className="flex items-center">
                                            <span className={`mr-1.5 ${/[A-Z]/.test(password) ? 'text-teal-500' : 'text-gray-400'}`}>
                                                {/[A-Z]/.test(password) ? (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-9a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                            Include at least one uppercase letter
                                        </li>
                                        <li className="flex items-center">
                                            <span className={`mr-1.5 ${/\d/.test(password) ? 'text-teal-500' : 'text-gray-400'}`}>
                                                {/\d/.test(password) ? (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-9a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                            Include at least one number
                                        </li>
                                        <li className="flex items-center">
                                            <span className={`mr-1.5 ${/[^A-Za-z0-9]/.test(password) ? 'text-teal-500' : 'text-gray-400'}`}>
                                                {/[^A-Za-z0-9]/.test(password) ? (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-9a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                            Include at least one special character
                                        </li>
                                    </ul>
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex justify-center items-center py-2.5 px-4 mt-6 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : "Set New Password"}
                                </motion.button>
                            </form>
                        </>
                    )}

                    <div className="mt-10 pt-5 border-t border-gray-100">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Secure password reset</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default set;