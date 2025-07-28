import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatErrorMessage } from "../../../utils/formatting";
import userService from "../../../api/services/users";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userService.login(email, password);

      navigate("/auth/login/verify-otp", {
        state: { user_id: response.user_id },
      });
    } catch (err) {
      setErrors({
        general: formatErrorMessage(err) || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900">
      {/* Left Sidebar - Desktop Only */}
      <div className="hidden lg:block lg:w-2/5 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 dark:from-blue-600/20 dark:to-teal-600/20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-500/10 dark:bg-teal-400/10"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-400/10"
        />

        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-teal-500/5 dark:bg-teal-400/5" />
        <div className="absolute bottom-20 right-10 w-36 h-36 rounded-full bg-blue-500/5 dark:bg-blue-400/5" />

        <div className="absolute top-8 left-8 z-10">
          <img src="/chat-icon.ico" className="w-8 h-8" />
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
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Wasaachat
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome to your admin dashboard
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md shadow-lg rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Daily Transactions
                  </p>
                  <span className="text-xs font-medium px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400 rounded-full">
                    +24%
                  </span>
                </div>
                <div className="h-16 flex items-end space-x-1">
                  {[40, 25, 60, 42, 55, 85, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        delay: i * 0.1 + 0.5,
                        duration: 0.7,
                        type: "spring",
                      }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-teal-500 to-blue-500"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400 dark:text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Active Users
                  </p>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 dark:bg-blue-400"></div>
                  </div>
                </div>
                <p className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
                  1,248,352
                </p>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-600 rounded-full mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
                    className="h-1.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Weekly goal: 78%
                  </span>
                  <span className="text-teal-500 dark:text-teal-400 font-medium">
                    +12.4%
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-100/20 to-teal-100/20 dark:from-blue-600/10 dark:to-teal-600/10 backdrop-blur-md"></div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white/10 dark:from-gray-800/20 to-transparent"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L10.5 13.5L15 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Wasaachat
            </span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600"
            >
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300">
                  {errors.general}
                </span>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="block w-full px-4 py-3.5 text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 peer"
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-teal-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                className="block w-full px-4 py-3.5 text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 peer"
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-teal-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm font-medium text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Remember Me & Social Icons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <div className="relative inline-flex items-center">
                  <input
                    id="remember-device"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-gray-300 dark:border-gray-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-0 dark:bg-gray-800"
                  />
                  <label
                    htmlFor="remember-device"
                    className="ml-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.01,
                boxShadow:
                  "0 10px 15px -3px rgba(45, 212, 191, 0.1), 0 4px 6px -2px rgba(45, 212, 191, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center py-3.5 px-4 mt-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No account?{" "}
              <a
                href="#"
                className="font-medium text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
              >
                Request access
              </a>
            </p>
          </div>

          <div className="mt-10 pt-5 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
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

export default Page;
