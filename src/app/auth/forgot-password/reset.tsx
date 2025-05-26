import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { formatErrorMessage } from '../../../utils/formatting';
import userService from '../../../api/services/users';

const Reset = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const emailFromQuery = searchParams.get('email');

    useEffect(() => {
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, [emailFromQuery]);

    const checkPasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 8) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[0-9]/.test(pass)) strength += 25;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
        setPasswordStrength(strength);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
    };

    const validateForm = (): boolean => {
        if (!password || password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        setError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            if (!token) {
                throw new Error('Missing reset token');
            }

            await userService.resetPassword(token, password);
            setIsSubmitted(true);

            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);
        } catch (err) {
            setError(formatErrorMessage(err) || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
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
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5 mb-4">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xs font-medium text-center mb-2">Creating a new password</h3>
                                <p className="text-xs text-gray-500 text-center">
                                    Choose a strong password that you don't use for other websites
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-medium text-gray-500">Password Tips</p>
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-300"></div>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {[
                                        'Use at least 8 characters',
                                        'Include uppercase & lowercase letters',
                                        'Add numbers and symbols',
                                        'Avoid using personal information'
                                    ].map((tip, i) => (
                                        <li key={i} className="flex items-center text-xs">
                                            <svg className="w-3 h-3 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
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
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900">Reset your password</h2>
                        <p className="text-xs text-gray-500 mt-1">Create a new secure password for your account</p>
                        {email && <p className="text-xs font-medium text-teal-600 mt-1">{email}</p>}
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-xs rounded-lg"
                        >
                            <div className="flex items-center mb-1">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium">Password successfully reset!</span>
                            </div>
                            <p>Redirecting you to the login page...</p>
                        </motion.div>
                    )}

                    {!isSubmitted && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <motion.div
                                    whileFocus={{ scale: 1.005 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="relative"
                                >
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </motion.div>

                                {password.length > 0 && (
                                    <div className="mt-2">
                                        <div className="h-1 w-full bg-gray-100 rounded-full">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${passwordStrength}%` }}
                                                transition={{ duration: 0.3 }}
                                                className={`h-1 rounded-full ${passwordStrength < 50 ? "bg-red-400" :
                                                    passwordStrength < 75 ? "bg-yellow-400" :
                                                        "bg-teal-500"
                                                    }`}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {passwordStrength < 50 ? "Weak" :
                                                passwordStrength < 75 ? "Good" :
                                                    "Strong"} password
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <motion.div
                                    whileFocus={{ scale: 1.005 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="relative"
                                >
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className={`w-full px-3 py-2.5 rounded-xl text-sm border ${confirmPassword && password !== confirmPassword ?
                                            "border-red-300 focus:ring-red-500" :
                                            "border-gray-200 focus:ring-teal-500"
                                            } bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:border-transparent transition-all duration-200`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </motion.div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex justify-center items-center py-2.5 px-4 mt-2 border border-transparent rounded-xl text-sm font-medium text-white ${password === confirmPassword && password.length > 0 ?
                                    "bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md" :
                                    "bg-gray-400 cursor-not-allowed"
                                    } focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500 transition-all duration-150`}
                                disabled={isLoading || password !== confirmPassword || password.length === 0}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : "Reset Password"}
                            </motion.button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Remember your password? <a href="/auth/login" className="font-medium text-teal-500 hover:text-teal-600">Back to login</a>
                        </p>
                    </div>

                    <div className="mt-10 pt-5 border-t border-gray-100">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>End-to-end encrypted</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Reset;