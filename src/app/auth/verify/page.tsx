import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatErrorMessage } from '../../../utils/formatting';
import userService from '../../../api/services/users';

const OtpVerificationPage = () => {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  type Errors = {
    general?: string;
    otp?: string;
  };

  const [errors, setErrors] = useState<Errors>({});
  const location = useLocation();
  const userId = location.state?.user_id;
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

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

  const handleSubmit = async (e?: React.FormEvent, manualOtp?: string) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (isSubmitting) return;

    const otpValue = manualOtp || otpValues.join('');
    console.log("Submitting OTP:", otpValue, "Length:", otpValue.length);

    if (!otpValue || otpValue.length < 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP code' });
      return;
    }

    if (!userId) {
      setErrors({ general: 'User ID is missing. Please go back to login page.' });
      return;
    }

    setIsLoading(true);
    setIsSubmitting(true);

    const payload = {
      otp: otpValue,
      user_id: userId,
      source: 'web'
    };

    try {
      setShowSuccess(true);

      setTimeout(async () => {
        const response = await userService.verifyOtp(payload);
        console.log(response);
        const accessToken = response.tokens?.access_token;
        const refreshToken = response.tokens?.refresh_token;
        const userData = response.user;

        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data saved to localStorage:', userData);

        navigate('/');
      }, 600);
    } catch (err) {
      setErrors({
        general: formatErrorMessage(err) || 'Verification failed. Please try again.'
      });
      setShowSuccess(false);
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userId) {
      setErrors({ general: 'User ID is missing. Cannot resend OTP.' });
      return;
    }

    setIsLoading(true);
    try {
      // await userService.resendOtp({ user_id: userId, source: 'web' });

      setCanResend(false);
      setTimer(60);
      setErrors({});
      setOtpValues(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setErrors({
        general: formatErrorMessage(err) || 'Failed to resend OTP. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);

    setOtpValues(newOtpValues);
    setErrors({});

    if (value && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    if (index === 5 && value) {
      const completeOtp = [...newOtpValues];

      const previousDigitsFilled = completeOtp.slice(0, 5).every(digit => digit !== '');

      if (previousDigitsFilled) {
        const fullOtp = completeOtp.join('');
        console.log("Auto-submitting with complete OTP:", fullOtp);

        setTimeout(() => {
          handleSubmit(undefined, fullOtp);
        }, 300);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    const newOtpValues = [...otpValues];

    digits.forEach((digit, i) => {
      if (i < 6) newOtpValues[i] = digit;
    });

    setOtpValues(newOtpValues);

    const focusIndex = Math.min(digits.length, 5);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]?.focus();
    }

    if (digits.length >= 6) {
      const fullOtp = newOtpValues.join('');
      console.log("Auto-submitting pasted OTP:", fullOtp);

      setTimeout(() => {
        handleSubmit(undefined, fullOtp);
      }, 300);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="hidden lg:block lg:w-2/5 bg-zinc-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-teal-500/10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-500/10"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-primary-500/10"
        />

        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-teal-500/5" />
        <div className="absolute bottom-20 right-10 w-36 h-36 rounded-full bg-primary-500/5" />

        <div className="absolute top-8 left-8 z-10">
          <img src='/chat-icon.ico' className='w-8 h-8' />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-xs px-6"
          >
            <div className="relative z-10">
              <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Wasaachat</h1>
                <p className="text-sm text-gray-600">Two-factor authentication</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-5 mb-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-medium text-gray-500">Security Level</p>
                  <span className="px-2 py-1 bg-teal-50 text-xs font-medium text-teal-600 rounded-full">Enhanced</span>
                </div>
                <div className="h-16 flex items-end space-x-2">
                  {['Basic', '2FA', 'Encrypted'].map((label, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: i === 0 ? "40%" : i === 1 ? "80%" : "100%" }}
                        transition={{ delay: i * 0.2 + 0.5, duration: 0.7, type: "spring" }}
                        className={`w-full rounded-t-md ${i < 2 ? 'bg-gradient-to-t from-gray-400 to-gray-300' : 'bg-gradient-to-t from-teal-500 to-primary-500'
                          }`}
                      />
                      <span className="text-xs mt-2 text-gray-500">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Progress card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-medium text-gray-500">Verification Status</p>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-300"></div>
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2">Almost there</p>
                <div className="relative h-2.5 w-full bg-gray-100 rounded-full mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: showSuccess ? "100%" : "75%" }}
                    transition={{
                      width: { duration: showSuccess ? 0.5 : 1, ease: "easeOut" },
                      delay: 0.7
                    }}
                    className="h-full bg-gradient-to-r from-teal-500 to-primary-500 rounded-full"
                  />

                  {/* Progress markers */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full flex justify-between px-1">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="w-4 h-4 bg-white rounded-full border-2 border-teal-500 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, borderColor: showSuccess ? "rgb(20, 184, 166)" : "rgb(99, 102, 241)" }}
                        transition={{
                          delay: 1.2,
                          type: "spring",
                          borderColor: { duration: 0.3 }
                        }}
                        className="w-4 h-4 bg-white rounded-full border-2 border-primary-500 relative left-[-0.75rem] flex items-center justify-center"
                      >
                        {showSuccess && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-teal-500 rounded-full"
                          />
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Login complete</span>
                  <span className={`${showSuccess ? "text-teal-500 font-medium" : "text-gray-500"}`}>
                    {showSuccess ? "Verified ✓" : "Verification"}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white/10 to-transparent"></div>
      </div>

      {/* OTP form panel */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-500 to-primary-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">Wasaachat</span>
          </div>

          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-gray-800">Verify your identity</h2>
            <p className="text-sm text-gray-600 mt-2">
              We've sent a 6-digit verification code to your email. Enter it below to continue.
            </p>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {errors?.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500"
              >
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm text-red-700">{errors?.general}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6">
            {/* OTP input fields */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <span className="text-xs text-gray-500">6-digit code</span>
              </div>

              <div className="flex gap-2 mb-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                    className="flex-1"
                  >
                    <div
                      className={`relative ${otpValues[index] ? 'bg-white' : 'bg-gray-50'
                        } rounded-xl border ${errors.otp ? 'border-red-300 shadow-sm shadow-red-100' :
                          otpValues[index] ? 'border-teal-300 shadow-sm shadow-teal-100' : 'border-gray-200'
                        } transition-all duration-200 ${showSuccess ? 'border-teal-300 shadow-sm shadow-teal-100' : ''
                        }`}
                    >
                      <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otpValues[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        disabled={isLoading || showSuccess}
                        className={`w-full aspect-square text-center text-lg font-medium bg-transparent focus:outline-none transition-all duration-200 disabled:text-gray-500`}
                      />

                      {/* Success animation */}
                      {showSuccess && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div className={`absolute inset-0 bg-teal-50 opacity-30 rounded-xl`}></div>
                        </motion.div>
                      )}

                      {/* Animated underline effect */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: inputRefs.current[index] === document.activeElement && !showSuccess ? 1 : 0
                        }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-primary-500 origin-left"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {errors.otp && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.otp}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Auto-detect hint */}
              <p className="mt-3 text-xs text-gray-500 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You can paste the code directly into the first field
              </p>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(45, 212, 191, 0.1), 0 4px 6px -2px rgba(45, 212, 191, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex justify-center items-center py-3.5 px-4 mt-4 border border-transparent rounded-xl text-sm font-medium text-white transition-all duration-200 ${showSuccess
                  ? "bg-teal-500 shadow-md shadow-teal-100"
                  : "bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md"
                }`}
              disabled={isLoading || showSuccess}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : showSuccess ? (
                <div className="flex items-center">
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-5 w-5 mr-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </motion.svg>
                  Verification Successful
                </div>
              ) : (
                "Verify & Continue"
              )}
            </motion.button>
          </form>

          {/* Resend code section */}
          <div className="mt-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Didn't receive the code?</p>
                    <p className="text-xs text-gray-500 mt-0.5">Check your spam folder or request a new code</p>
                  </div>
                </div>

                {canResend ? (
                  <motion.button
                    onClick={handleResendOtp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors"
                    disabled={showSuccess}
                  >
                    Resend Code
                  </motion.button>
                ) : (
                  <div className="relative">
                    <svg className="w-10 h-10" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="16" stroke="#E5E7EB" strokeWidth="2" />
                      <motion.path
                        d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 - timer / 60 }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{timer}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/auth/login')}
              className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
              disabled={showSuccess}
            >
              ← Back to login
            </button>
          </div>

          <div className="mt-10 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default OtpVerificationPage;
