import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../../utils/validation';
import userService from '../../../api/services/users';
import { formatErrorMessage } from '../../../utils/formatting';

const page = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
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
      await userService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(formatErrorMessage(err) || 'Failed to send reset link. Please try again.');
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

              {/* Email Visualization */}
              <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <div className="w-32 h-1 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Process Steps */}
              <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-medium text-gray-500">Password Recovery Steps</p>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-300"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center mr-2">
                      <span className="text-xs">1</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Enter your email</p>
                      <p className="text-xs text-gray-500">We'll verify your account</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-2">
                      <span className="text-xs">2</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">Check your inbox</p>
                      <p className="text-xs text-gray-400">Follow the link we send you</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-2">
                      <span className="text-xs">3</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">Create a new password</p>
                      <p className="text-xs text-gray-400">Set up your new secure password</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel with forgot password form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo - visible on smaller screens */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-primary-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Forgot password?</h2>
            <p className="text-xs text-gray-500 mt-1">We'll send you a link to reset your password</p>
          </div>

          {!isSubmitted ? (
            <div className="space-y-5">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <motion.div
                  whileFocus={{ scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </motion.div>
              </div>

              {/* Submit button */}
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex justify-center items-center py-2.5 px-4 mt-2 border border-transparent rounded-xl text-sm font-medium text-white 
                  ${email ? "bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md" : "bg-gray-400 cursor-not-allowed"}
                  focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500 transition-all duration-150`}
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Send Reset Link"}
              </motion.button>
            </div>
          ) : (
            <div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-5"
              >
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                    <svg className="h-3 w-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-teal-800">Check your email</p>
                </div>
                <p className="text-xs text-teal-700 ml-8">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
              </motion.div>

              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-3">Didn't receive the email?</p>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li className="flex items-start">
                    <svg className="h-3 w-3 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Check your spam or junk folder
                  </li>
                  <li className="flex items-start">
                    <svg className="h-3 w-3 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify you entered the correct email
                  </li>
                </ul>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full mt-4 py-2 px-3 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-150"
                >
                  Try a different email
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Remember your password? <a href="/auth/login" className="font-medium text-teal-500 hover:text-teal-600">Back to login</a>
            </p>
          </div>

          {/* Security info */}
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

export default page;