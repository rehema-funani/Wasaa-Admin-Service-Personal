import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { setStorageItem } from '../../../utils/storage';
import { formatErrorMessage } from '../../../utils/formatting';

const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/');
  //   }
  // }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, password);

      if (rememberMe) {
        setStorageItem('rememberedEmail', email);
      }

      if (response && response.user_id) {
        navigate('/auth/login/verify-otp', {
          state: { user_id: response.user_id }
        });
      } else if (response && response.user && response.user.id) {
        navigate('/auth/login/verify-otp', {
          state: { user_id: response.user.id }
        });
      } else {
        console.error('User ID not found in response:', response);
        setErrors({
          ...errors,
          general: 'Authentication error: Unable to proceed to verification'
        });
      }
    } catch (err) {
      setErrors({
        ...errors,
        general: formatErrorMessage(err) || 'Login failed. Please try again.'
      });
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
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500">Daily Transactions</p>
                  <span className="text-xs font-medium text-teal-500">+24%</span>
                </div>
                <div className="h-12 flex items-end space-x-1">
                  {[40, 25, 60, 42, 55, 85, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-teal-500 to-primary-500"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-medium text-gray-500">Active Users</p>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-300"></div>
                  </div>
                </div>
                <p className="text-lg font-semibold mb-1">1,248,352</p>
                <div className="h-1 w-full bg-gray-100 rounded-full mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-1 bg-teal-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Weekly goal: 78%</span>
                  <span className="text-teal-500 font-medium">+12.4%</span>
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
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L10.5 13.5L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Sign in to Wasaachat</h2>
            <p className="text-xs text-gray-500 mt-1">Access your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email
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

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-teal-500 hover:text-teal-600">
                  Forgot?
                </a>
              </div>
              <motion.div
                whileFocus={{ scale: 1.005 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative"
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-device"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-sm border-gray-300 text-teal-500 focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="remember-device" className="ml-2 text-xs text-gray-500">
                  Remember this device
                </label>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center py-2.5 px-4 mt-2 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-primary-500 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500 transition-all duration-150"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign in"}
            </motion.button>
          </form>

          {errors.general && (
            <div className="mt-4 p-2 text-xs text-red-500 bg-red-50 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              No account? <a href="#" className="font-medium text-teal-500 hover:text-teal-600">Request access</a>
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
