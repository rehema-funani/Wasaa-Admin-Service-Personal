import {
  X,
  Loader2,
  Check,
  Save,
  AlertCircle,
  Users,
  UserCog,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { roleService } from "../../api/services/roles";

const EditAdmin = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editFormData,
  setEditFormData,
  handleEditFormChange,
  handleEditSubmit,
}) => {
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [roleError, setRoleError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditModalOpen) {
      fetchRoles();
    }
  }, [isEditModalOpen]);

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    setRoleError(null);

    try {
      const response = await roleService.getRoles();
      setRoles(response);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoleError("Failed to load roles. Please try again.");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleEditSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isEditModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/30 dark:bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="max-w-md w-full mx-auto overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100/80 dark:border-gray-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100/80 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                  <UserCog
                    size={20}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Edit User
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update user information
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 p-2"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <form onSubmit={onSubmit}>
                <div className="space-y-5">
                  {/* Email Field */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-300/40 to-primary-400/40 dark:from-primary-700/40 dark:to-primary-600/40 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        required
                        className="relative w-full py-3 px-4 bg-white/80 dark:bg-gray-700/50 border border-gray-200/80 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 dark:text-gray-200 text-sm transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        First Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 to-purple-400/30 dark:from-blue-700/30 dark:to-purple-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={editFormData.first_name}
                          onChange={handleEditFormChange}
                          className="relative w-full py-3 px-4 bg-white/80 dark:bg-gray-700/50 border border-gray-200/80 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 dark:text-gray-200 text-sm transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                      >
                        Last Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 to-purple-400/30 dark:from-blue-700/30 dark:to-purple-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={editFormData.last_name}
                          onChange={handleEditFormChange}
                          className="relative w-full py-3 px-4 bg-white/80 dark:bg-gray-700/50 border border-gray-200/80 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 dark:text-gray-200 text-sm transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-300/30 to-teal-400/30 dark:from-green-700/30 dark:to-teal-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={editFormData.phone_number}
                        onChange={handleEditFormChange}
                        className="relative w-full py-3 px-4 bg-white/80 dark:bg-gray-700/50 border border-gray-200/80 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 dark:text-gray-200 text-sm transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="+254700000000"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label
                      htmlFor="role_id"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Role
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-300/30 to-orange-400/30 dark:from-amber-700/30 dark:to-orange-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        id="role_id"
                        name="role_id"
                        value={editFormData.role_id}
                        onChange={handleEditFormChange}
                        className="relative w-full py-3 px-4 bg-white/80 dark:bg-gray-700/50 border border-gray-200/80 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 dark:text-gray-200 text-sm appearance-none transition-all duration-200"
                        disabled={isLoadingRoles}
                      >
                        <option value="">Select Role</option>
                        {isLoadingRoles ? (
                          <option disabled>Loading roles...</option>
                        ) : roleError ? (
                          <option disabled>Error loading roles</option>
                        ) : (
                          roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.title}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {isLoadingRoles ? (
                          <Loader2
                            size={16}
                            className="text-gray-400 dark:text-gray-500 animate-spin"
                          />
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    {roleError && (
                      <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-xs">
                        <AlertCircle size={14} className="mr-1.5" />
                        {roleError}
                      </div>
                    )}
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Account Status
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          value: "active",
                          color: "emerald",
                          icon: <Check size={14} className="mr-1.5" />,
                          lightBg: "bg-emerald-50",
                          darkBg: "dark:bg-emerald-900/20",
                          lightBorder: "border-emerald-200",
                          darkBorder: "dark:border-emerald-800/50",
                          lightText: "text-emerald-700",
                          darkText: "dark:text-emerald-400",
                          lightHover: "hover:bg-emerald-100/80",
                          darkHover: "dark:hover:bg-emerald-900/30",
                        },
                        {
                          value: "inactive",
                          color: "gray",
                          icon: null,
                          lightBg: "bg-gray-50",
                          darkBg: "dark:bg-gray-800/50",
                          lightBorder: "border-gray-200",
                          darkBorder: "dark:border-gray-700/50",
                          lightText: "text-gray-700",
                          darkText: "dark:text-gray-400",
                          lightHover: "hover:bg-gray-100/80",
                          darkHover: "dark:hover:bg-gray-700/70",
                        },
                        {
                          value: "blocked",
                          color: "amber",
                          icon: null,
                          lightBg: "bg-amber-50",
                          darkBg: "dark:bg-amber-900/20",
                          lightBorder: "border-amber-200",
                          darkBorder: "dark:border-amber-800/50",
                          lightText: "text-amber-700",
                          darkText: "dark:text-amber-400",
                          lightHover: "hover:bg-amber-100/80",
                          darkHover: "dark:hover:bg-amber-900/30",
                        },
                        {
                          value: "terminated",
                          color: "red",
                          icon: <XCircle size={14} className="mr-1.5" />,
                          lightBg: "bg-red-50",
                          darkBg: "dark:bg-red-900/20",
                          lightBorder: "border-red-200",
                          darkBorder: "dark:border-red-800/50",
                          lightText: "text-red-700",
                          darkText: "dark:text-red-400",
                          lightHover: "hover:bg-red-100/80",
                          darkHover: "dark:hover:bg-red-900/30",
                        },
                      ].map((status) => (
                        <motion.button
                          key={status.value}
                          type="button"
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          onClick={() =>
                            setEditFormData((prev) => ({
                              ...prev,
                              account_status: status.value,
                            }))
                          }
                          className={`
                            px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center border
                            ${
                              editFormData.account_status === status.value
                                ? `${status.lightBg} ${status.darkBg} ${status.lightBorder} ${status.darkBorder} ${status.lightText} ${status.darkText} shadow-sm`
                                : `bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 ${status.lightHover} ${status.darkHover} border-gray-200/50 dark:border-gray-700/50`
                            }
                          `}
                        >
                          {status.icon}
                          <span className="capitalize">{status.value}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100/50 dark:border-gray-700/30">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md
                      bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400
                      dark:from-primary-600 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-400
                      text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="mt-5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100/80 dark:border-gray-700/50">
                  <p className="flex items-start">
                    <AlertCircle
                      size={12}
                      className="mr-1.5 mt-0.5 flex-shrink-0"
                    />
                    <span>
                      Changes will be applied immediately. Users with inactive,
                      blocked, or terminated status will lose access to the
                      platform.
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAdmin;
