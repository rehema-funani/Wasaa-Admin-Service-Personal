import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { formatErrorMessage } from "../../../utils/formatting";
import userService from "../../../api/services/users";

const PasswordSetupPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  let token = searchParams.get("token");

  if (!token || token.length < 20) {
    const queryString = location.search;
    const tokenMatch = queryString.match(/[?&]token=([^&]+)/);
    if (tokenMatch && tokenMatch[1]) {
      token = decodeURIComponent(tokenMatch[1]);
    }
  }

  if (!token || token.length < 20) {
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart.length >= 20) {
      token = lastPart;
    }
  }

  const navigate = useNavigate();

  const requirements = [
    { id: "length", label: "At least 8 characters", met: password.length >= 8 },
    {
      id: "lowercase",
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    { id: "number", label: "One number", met: /[0-9]/.test(password) },
    {
      id: "special",
      label: "One special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  useEffect(() => {
    const metRequirements = requirements.filter((req) => req.met).length;
    setPasswordStrength(metRequirements / requirements.length);

    if (errors.password && password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    if (errors.confirmPassword && confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  }, [password, confirmPassword, errors]);

  useEffect(() => {
    if (!token) {
      setErrors((prev) => ({
        ...prev,
        general:
          "Invalid or missing password reset token. Please request a new password reset link.",
      }));
    }
  }, [token]);

  const getStrengthColor = () => {
    if (passwordStrength <= 0.3) return "from-red-500 to-red-600";
    if (passwordStrength <= 0.6) return "from-amber-500 to-orange-500";
    if (passwordStrength <= 0.8) return "from-yellow-500 to-amber-500";
    return "from-emerald-500 to-teal-500";
  };

  const validateForm = () => {
    const newErrors = {
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!token) {
      newErrors.general =
        "Invalid or missing token. Please request a new password reset link.";
      return false;
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors({ ...errors, ...newErrors });
    return (
      !newErrors.password && !newErrors.confirmPassword && !newErrors.general
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await userService.setPassword(token, password);
      setSuccess(true);

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      setErrors({
        ...errors,
        general:
          formatErrorMessage(err) ||
          "Failed to set password. Please try again or request a new password reset link.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900">
      <div className="hidden lg:block lg:w-2/5 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 dark:from-teal-600/20 dark:to-blue-600/20" />

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
          <img src="/chat-icon.ico" className="w-8 h-8" alt="Logo" />
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
                  Secure communication platform
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md shadow-lg rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-500 dark:text-teal-400 mr-3">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      Security First
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your data is always protected
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[0, 1, 2].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
                      className="h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-3">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      Password Protection
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Create a strong, unique password
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-100/20 to-teal-100/20 dark:from-blue-600/10 dark:to-teal-600/10 backdrop-blur-md"></div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white/10 dark:from-gray-800/20 to-transparent"></div>
      </div>

      {/* Right Panel - Password Setup Form */}
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Set your password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a secure password for your account
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-600"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-100 dark:bg-teal-800/50 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-teal-600 dark:text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-teal-800 dark:text-teal-300">
                    Password set successfully!
                  </h3>
                  <p className="mt-1 text-xs text-teal-700 dark:text-teal-400">
                    Redirecting you to the login page...
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password field */}
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      required
                      className={`block w-full px-4 py-3.5 text-gray-700 dark:text-gray-100 border ${
                        errors.password
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-200 dark:border-gray-600 focus:ring-teal-500"
                      } rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 peer`}
                    />
                    <label
                      htmlFor="password"
                      className={`absolute text-sm ${
                        errors.password
                          ? "text-red-500"
                          : "text-gray-500 dark:text-gray-400 peer-focus:text-teal-500"
                      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3`}
                    >
                      New Password
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
                  {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.password}
                    </p>
                  )}

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-1.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Password strength
                        </span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {passwordStrength <= 0.3 && "Weak"}
                          {passwordStrength > 0.3 &&
                            passwordStrength <= 0.6 &&
                            "Fair"}
                          {passwordStrength > 0.6 &&
                            passwordStrength <= 0.8 &&
                            "Good"}
                          {passwordStrength > 0.8 && "Strong"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength * 100}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-1.5 rounded-full bg-gradient-to-r ${getStrengthColor()}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password field */}
                <div>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder=" "
                      required
                      className={`block w-full px-4 py-3.5 text-gray-700 dark:text-gray-100 border ${
                        errors.confirmPassword
                          ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                          : "border-gray-200 dark:border-gray-600 focus:ring-teal-500"
                      } rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 peer`}
                    />
                    <label
                      htmlFor="confirm-password"
                      className={`absolute text-sm ${
                        errors.confirmPassword
                          ? "text-red-500"
                          : "text-gray-500 dark:text-gray-400 peer-focus:text-teal-500"
                      } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3`}
                    >
                      Confirm Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
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
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password requirements:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {requirements.map((req) => (
                      <div key={req.id} className="flex items-center">
                        <div
                          className={`flex-shrink-0 w-4 h-4 rounded-full ${
                            req.met
                              ? "bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                          } flex items-center justify-center mr-2`}
                        >
                          {req.met && (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-xs ${
                            req.met
                              ? "text-gray-700 dark:text-gray-300"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
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
                  className="w-full flex justify-center items-center py-3.5 px-4 mt-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-900 transition-all duration-200"
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
                    "Set Password"
                  )}
                </motion.button>
              </form>
            </>
          )}

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Footer */}
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

export default PasswordSetupPage;
