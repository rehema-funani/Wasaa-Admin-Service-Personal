import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { formatErrorMessage } from '../../../utils/formatting';

const page = () => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [errors, setErrors] = useState<{ otp?: string; general?: string }>({});
    const location = useLocation();
    const userId = location.state?.user_id;

    const navigate = useNavigate();
    const { verifyOtp, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer, canResend]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length < 4) {
            setErrors({ otp: 'Please enter a valid OTP code' });
            return;
        }

        const payload = {
            otp,
            user_id: userId,
            source: 'web'
        }

        try {
            await verifyOtp(payload);
            navigate('/');
        } catch (err) {
            setErrors({
                general: formatErrorMessage(err) || 'Verification failed. Please try again.'
            });
        }
    };

    const handleResendOtp = () => {
        setCanResend(false);
        setTimer(60);
        setErrors({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value);
            setErrors({});
        }
    };

    return (
        <div className="flex h-screen w-full bg-white">
            <div className="hidden lg:block lg:w-2/5 bg-zinc-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10" />

                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-500/10" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-500/10" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                        className="relative w-full max-w-xs"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-10">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-medium text-gray-500">Security Level</p>
                                    <span className="text-xs font-medium text-teal-500">High</span>
                                </div>
                                <div className="h-12 flex items-end space-x-1">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "100%" }}
                                        transition={{ duration: 0.5 }}
                                        className="w-6 rounded-t bg-gradient-to-t from-teal-500 to-blue-500"
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "80%" }}
                                        transition={{ delay: 0.1, duration: 0.5 }}
                                        className="w-6 rounded-t bg-gradient-to-t from-teal-500 to-blue-500"
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "90%" }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="w-6 rounded-t bg-gradient-to-t from-teal-500 to-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-medium text-gray-500">Verification Status</p>
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold mb-1">Secure Authentication</p>
                                <div className="h-1 w-full bg-gray-100 rounded-full mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "50%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-1 bg-teal-500 rounded-full"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Step 2 of 2</span>
                                    <span className="text-teal-500 font-medium">Almost there</span>
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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900">Verify your account</h2>
                        <p className="text-xs text-gray-500 mt-1">Enter the verification code sent to your email</p>
                    </div>

                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                            <p className="text-xs text-red-500">{errors.general}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="otp" className="block text-xs font-medium text-gray-700 mb-1">
                                Verification Code
                            </label>
                            <motion.div
                                whileFocus={{ scale: 1.005 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={handleInputChange}
                                    placeholder="Enter 6-digit code"
                                    required
                                    className={`w-full px-3 py-2.5 rounded-xl text-center tracking-widest text-lg font-medium border ${errors.otp ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'
                                        } focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent transition-all duration-200`}
                                />
                                {errors.otp && (
                                    <p className="mt-1 text-xs text-red-500">{errors.otp}</p>
                                )}
                            </motion.div>
                        </div>

                        <motion.button
                            onClick={handleSubmit}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex justify-center items-center py-2.5 px-4 mt-2 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500 transition-all duration-150"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Verify Code"}
                        </motion.button>

                        <div className="text-center mt-3">
                            <p className="text-xs text-gray-500">
                                Didn't receive the code?{" "}
                                {canResend ? (
                                    <button
                                        onClick={handleResendOtp}
                                        className="font-medium text-teal-500 hover:text-teal-600"
                                    >
                                        Resend code
                                    </button>
                                ) : (
                                    <span className="text-gray-400">
                                        Resend in <span className="font-medium">{timer}</span>s
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-5 border-t border-gray-100">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Secure authentication</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default page;