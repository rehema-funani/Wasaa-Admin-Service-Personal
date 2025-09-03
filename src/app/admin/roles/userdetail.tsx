import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  UserCheck,
  Activity,
  KeyRound,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  LogOut,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Info,
  Cpu,
  FileText,
  Edit,
  MoreHorizontal,
  Layers,
  User,
  XCircle,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import userService from "../../../api/services/users";
import StatusBadge from "../../../components/common/StatusBadge";
import TabNavigation from "../../../components/common/TabNavigation";
import EditAdmin from "../../../components/users/EditAdmin";
import { UserAdmin } from "../../../types/user";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserAdmin | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    show: boolean;
    action: string;
    title: string;
    message: string;
  }>({
    show: false,
    action: "",
    title: "",
    message: "",
  });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role_id: "",
    account_status: "active",
  });

  const openEditModal = () => {
    if (!user) return;

    setEditFormData({
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone_number: user.phone_number || "",
      role_id: user.role?.id || "",
      account_status: user.status || "active",
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateUser(id, editFormData);
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUserData();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  const fetchUserData = async () => {
    setIsLoadingUser(true);
    try {
      const userData = await userService.getAdminUserbyId(id);
      setUser({
        ...userData,
        name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        lastActive: userData.last_login
          ? formatDistanceToNow(new Date(userData.last_login), {
              addSuffix: true,
            })
          : "Never",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to load user details");
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (activeTab === "sessions" && user) {
      fetchUserSessions();
    } else if (activeTab === "login-history" && user) {
      fetchLoginHistory();
    }
  }, [activeTab, user]);

  const fetchUserSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const sessions = await userService.getUserSessions(id);
      setActiveSessions(sessions.sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to load user sessions");
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const fetchLoginHistory = async () => {
    setIsLoadingLogs(true);
    try {
      const history = await userService.getUserLoginHistory(id);
      setLoginHistory(history);
    } catch (error) {
      console.error("Failed to fetch login history:", error);
      toast.error("Failed to load login history");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleSendPasswordReset = async () => {
    try {
      setIsSendingReset(true);
      await userService.sendPasswordReset(id);
      setResetSent(true);
      toast.success("Password reset email sent successfully");

      setTimeout(() => {
        setResetSent(false);
      }, 10000);
    } catch (error) {
      console.error("Failed to send password reset:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const showConfirmationDialog = (
    action: string,
    title: string,
    message: string
  ) => {
    setShowConfirmDialog({
      show: true,
      action,
      title,
      message,
    });
  };

  const handleConfirmAction = async () => {
    setIsActionLoading(true);
    try {
      switch (showConfirmDialog.action) {
        case "terminate-all-sessions":
          await handleTerminateAllSessions();
          break;
        case "toggle-status":
          await handleToggleUserStatus();
          break;
        case "reset-mfa":
          await handleResetMFA();
          break;
        default:
          break;
      }
    } finally {
      setIsActionLoading(false);
      setShowConfirmDialog({ show: false, action: "", title: "", message: "" });
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      await userService.revokeSession(sessionId);
      toast.success("Session terminated successfully");
      fetchUserSessions();
    } catch (error) {
      console.error("Failed to terminate session:", error);
      toast.error("Failed to terminate session");
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      await userService.terminateAllUserSessions(id);
      toast.success("All sessions terminated successfully");
      fetchUserSessions();
    } catch (error) {
      console.error("Failed to terminate all sessions:", error);
      toast.error("Failed to terminate sessions");
    }
  };

  const handleToggleUserStatus = async () => {
    if (!user) return;

    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await userService.updateUserStatus(id, newStatus);
      setUser({ ...user, status: newStatus });
      toast.success(
        `User ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleResetMFA = async () => {
    try {
      await userService.resetUserMFA(id);
      toast.success("MFA has been reset successfully");
      fetchUserData();
    } catch (error) {
      console.error("Failed to reset MFA:", error);
      toast.error("Failed to reset MFA");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Eye size={16} /> },
    { id: "sessions", label: "Active Sessions", icon: <Globe size={16} /> },
    { id: "login-history", label: "Login History", icon: <Clock size={16} /> },
    {
      id: "security",
      label: "Security",
      icon: <Shield size={16} />,
    },
  ];

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-700"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  // User not found
  if (!user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="bg-amber-50 dark:bg-amber-900/30 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <button
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex items-center mx-auto"
            onClick={handleGoBack}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center mb-4">
                {showConfirmDialog.action.includes("terminate") ? (
                  <div className="mx-auto h-16 w-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <LogOut size={28} className="text-red-500" />
                  </div>
                ) : showConfirmDialog.action === "toggle-status" ? (
                  <div className="mx-auto h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                    {user?.status === "active" ? (
                      <Lock size={28} className="text-amber-500" />
                    ) : (
                      <Unlock size={28} className="text-green-500" />
                    )}
                  </div>
                ) : (
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <Shield size={28} className="text-primary-500" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {showConfirmDialog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {showConfirmDialog.message}
                </p>
              </div>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() =>
                    setShowConfirmDialog({
                      show: false,
                      action: "",
                      title: "",
                      message: "",
                    })
                  }
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isActionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 rounded-xl font-medium flex items-center ${
                    showConfirmDialog.action.includes("terminate") ||
                    (showConfirmDialog.action === "toggle-status" &&
                      user?.status === "active")
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.button
        className="group mb-6 flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ x: -5 }}
        onClick={handleGoBack}
      >
        <ArrowLeft size={18} className="mr-2 group-hover:animate-pulse" />
        Back to Users
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-6"
          >
            {/* User Card Header */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400"></div>
              <div className="absolute bottom-0 w-full transform translate-y-1/2 flex justify-center">
                <div className="h-24 w-24 rounded-xl bg-white dark:bg-gray-800 p-1 shadow-md">
                  <div className="h-full w-full rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "??"}
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10"
                      >
                        <div className="p-2">
                          <button
                            onClick={() => {
                              openEditModal();
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            <Edit
                              size={16}
                              className="mr-2 text-gray-500 dark:text-gray-400"
                            />
                            Edit User
                          </button>

                          <button
                            onClick={() => {
                              showConfirmationDialog(
                                "toggle-status",
                                user.status === "active"
                                  ? "Deactivate User"
                                  : "Activate User",
                                user.status === "active"
                                  ? `Are you sure you want to deactivate ${user.name}'s account? They will lose access to the platform.`
                                  : `Are you sure you want to activate ${user.name}'s account? They will regain access to the platform.`
                              );
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            {user.status === "active" ? (
                              <Lock
                                size={16}
                                className="mr-2 text-gray-500 dark:text-gray-400"
                              />
                            ) : (
                              <Unlock
                                size={16}
                                className="mr-2 text-gray-500 dark:text-gray-400"
                              />
                            )}
                            {user.status === "active"
                              ? "Deactivate User"
                              : "Activate User"}
                          </button>
                          {user.mfa_enabled && (
                            <button
                              onClick={() => {
                                showConfirmationDialog(
                                  "reset-mfa",
                                  "Reset MFA",
                                  `This will remove all enrolled MFA devices for ${user.name}. They will need to set up MFA again. Continue?`
                                );
                                setShowDropdown(false);
                              }}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                              <EyeOff
                                size={16}
                                className="mr-2 text-gray-500 dark:text-gray-400"
                              />
                              Reset MFA
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="pt-16 px-6 pb-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1">
                  <Mail size={14} className="mr-1.5" />
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-xs font-medium flex items-center">
                  <Shield size={14} className="mr-1.5" />
                  {user.role.title || "No role assigned"}
                </span>

                <StatusBadge
                  status={user.status as any}
                  size="lg"
                  withIcon
                  withDot={user.status === "active"}
                />

                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center ${
                    user.mfa_enabled
                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  <Cpu size={14} className="mr-1.5" />
                  {user.mfa_enabled ? "MFA Enabled" : "MFA Disabled"}
                </span>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Contact Information
                </h3>

                <div className="flex items-center text-sm">
                  <Mail
                    size={16}
                    className="text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Email
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Phone
                    size={16}
                    className="text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Phone
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {user.phone_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <MapPin
                    size={16}
                    className="text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Location
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {user.location || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={14} className="inline mr-1.5" />
                    Last Active
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.last_login
                      ? formatDistanceToNow(new Date(user.last_login), {
                          addSuffix: true,
                        })
                      : "Never"}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <CalendarDays size={14} className="inline mr-1.5" />
                    Joined
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.createdAt
                      ? format(new Date(user.createdAt), "MMM d, yyyy")
                      : "Unknown"}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <CreditCard size={14} className="inline mr-1.5" />
                    Transactions
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.transactions_count || 0}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleSendPasswordReset}
                    disabled={isSendingReset || resetSent}
                    className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                      resetSent
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
                        : isSendingReset
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-wait"
                        : "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50"
                    }`}
                  >
                    {resetSent ? (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Reset email sent
                      </>
                    ) : isSendingReset ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} className="mr-2" />
                        Send Password Reset
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-1">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="pills"
              className="p-1.5"
              scrollable={false}
            />
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <User size={20} className="mr-2 text-primary-500" />
                  User Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Role Card */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                        <Shield
                          size={20}
                          className="text-primary-600 dark:text-primary-400"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Role
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.role.title || "No role assigned"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.role.description || "No role description available"}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          user.status === "active"
                            ? "bg-green-50 dark:bg-green-900/30"
                            : "bg-red-50 dark:bg-red-900/30"
                        }`}
                      >
                        {user.status === "active" ? (
                          <CheckCircle
                            size={20}
                            className="text-green-600 dark:text-green-400"
                          />
                        ) : (
                          <XCircle
                            size={20}
                            className="text-red-600 dark:text-red-400"
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Account Status
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                          {user.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.status === "active"
                        ? "User has full access to the platform."
                        : "User access is currently restricted."}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          user.mfa_enabled
                            ? "bg-green-50 dark:bg-green-900/30"
                            : "bg-amber-50 dark:bg-amber-900/30"
                        }`}
                      >
                        {user.mfa_enabled ? (
                          <Layers
                            size={20}
                            className="text-green-600 dark:text-green-400"
                          />
                        ) : (
                          <AlertTriangle
                            size={20}
                            className="text-amber-600 dark:text-amber-400"
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          MFA Status
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.mfa_enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.mfa_enabled
                        ? "User has set up multi-factor authentication."
                        : "User has not enabled multi-factor authentication."}
                    </p>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Activity size={18} className="mr-2 text-primary-500" />
                    Activity Timeline
                  </h3>

                  <div className="relative pl-8 ml-2 border-l-2 border-gray-200 dark:border-gray-600 space-y-6">
                    {/* Account Created */}
                    <div className="relative">
                      <div className="absolute -left-10 top-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center ring-4 ring-white dark:ring-gray-700">
                        <User size={12} className="text-white" />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Account Created
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.createdAt
                            ? format(
                                new Date(user.createdAt),
                                "MMMM d, yyyy 'at' h:mm a"
                              )
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>

                    {/* Last Login */}
                    {user.last_login && (
                      <div className="relative">
                        <div className="absolute -left-10 top-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-white dark:ring-gray-700">
                          <Zap size={12} className="text-white" />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Last Login
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {format(
                              new Date(user.last_login),
                              "MMMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.transactions_count > 0 && (
                      <div className="relative">
                        <div className="absolute -left-10 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white dark:ring-gray-700">
                          <CreditCard size={12} className="text-white" />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Transactions
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {user.transactions_count} total transactions
                          </p>
                        </div>
                      </div>
                    )}

                    {resetSent && (
                      <div className="relative">
                        <div className="absolute -left-10 top-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center ring-4 ring-white dark:ring-gray-700">
                          <KeyRound size={12} className="text-white" />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Password Reset Email
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Sent{" "}
                            {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sessions" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Globe size={20} className="mr-2 text-primary-500" />
                    Active Sessions
                  </h2>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 overflow-hidden">
                  {isLoadingSessions ? (
                    <div className="p-8 flex justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Loading sessions...
                        </p>
                      </div>
                    </div>
                  ) : activeSessions.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Globe
                          size={24}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No active sessions
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        No active sessions found for this user.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Device
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Location
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              IP Address
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Started
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Last Active
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                          {activeSessions.map((session, index) => (
                            <motion.tr
                              key={session.id || index}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Smartphone
                                    size={16}
                                    className="mr-2 text-gray-400 dark:text-gray-500"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                      {session.device_name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {session.user_agent || "Unknown browser"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Globe
                                    size={16}
                                    className="mr-2 text-gray-400 dark:text-gray-500"
                                  />
                                  <span className="text-gray-900 dark:text-gray-100">
                                    {session.location || "Unknown location"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {session.ip_address || "Unknown"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {session.createdAt
                                  ? formatDistanceToNow(
                                      new Date(session.createdAt),
                                      { addSuffix: true }
                                    )
                                  : "Unknown"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {session.last_accessed
                                  ? formatDistanceToNow(
                                      new Date(session.last_accessed),
                                      { addSuffix: true }
                                    )
                                  : "Unknown"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <motion.button
                                  className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleTerminateSession(session.id)
                                  }
                                >
                                  Terminate
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-xl text-sm flex items-start">
                  <AlertTriangle
                    size={18}
                    className="mr-2 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium mb-1">Session Termination</p>
                    <p>
                      Terminating a session will immediately log the user out of
                      that device. The user will need to log in again to regain
                      access.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "login-history" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Clock size={20} className="mr-2 text-primary-500" />
                  Login History
                </h2>

                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 overflow-hidden">
                  {isLoadingLogs ? (
                    <div className="p-8 flex justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Loading login history...
                        </p>
                      </div>
                    </div>
                  ) : loginHistory.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Clock
                          size={24}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No login history
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        No login history found for this user.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Time
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Method
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Location
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Device/Browser
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              IP Address
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                          {loginHistory.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <p className="text-gray-900 dark:text-gray-100">
                                    {item.timestamp
                                      ? format(
                                          new Date(item.timestamp),
                                          "MMM d, yyyy"
                                        )
                                      : "Unknown"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.timestamp
                                      ? format(
                                          new Date(item.timestamp),
                                          "h:mm a"
                                        )
                                      : ""}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                                    item.status === "success"
                                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                      : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                  }`}
                                >
                                  {item.status === "success"
                                    ? "Success"
                                    : "Failed"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {item.method || "Unknown"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {item.location || "Unknown"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {item.device || "Unknown"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {item.ip_address || "Unknown"}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-xl text-sm flex items-start">
                  <Info size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Login History</p>
                    <p>
                      This table shows all login attempts, both successful and
                      failed. This information can be useful for identifying
                      suspicious activity.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Shield size={20} className="mr-2 text-primary-500" />
                  Security Settings
                </h2>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                        <KeyRound
                          size={20}
                          className="text-primary-600 dark:text-primary-400"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Password Management
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Manage the user's password and send password reset
                          links
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSendPasswordReset}
                        disabled={isSendingReset || resetSent}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                          resetSent
                            ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
                            : isSendingReset
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-wait"
                            : "bg-primary-600 hover:bg-primary-700 text-white"
                        }`}
                      >
                        {resetSent ? (
                          <>
                            <CheckCircle size={16} className="mr-2" />
                            Reset email sent
                          </>
                        ) : isSendingReset ? (
                          <>
                            <RefreshCw
                              size={16}
                              className="mr-2 animate-spin"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <KeyRound size={16} className="mr-2" />
                            Send Password Reset
                          </>
                        )}
                      </button>

                      {user.status === "active" && (
                        <button
                          onClick={() => {
                            toast("Force password change feature coming soon");
                          }}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                        >
                          <Eye size={16} className="mr-2" />
                          Force Password Change
                        </button>
                      )}
                    </div>

                    {resetSent && (
                      <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-xl text-sm flex items-start">
                        <CheckCircle
                          size={18}
                          className="mr-2 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="font-medium mb-1">Reset Email Sent</p>
                          <p>
                            Password reset email sent successfully to{" "}
                            {user.email}. The link will expire in 24 hours.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Multi-Factor Authentication */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                        <Shield
                          size={20}
                          className="text-primary-600 dark:text-primary-400"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Multi-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.mfa_enabled
                            ? "The user has enabled MFA for their account"
                            : "The user has not enabled MFA for their account"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mt-4">
                      <div className="flex items-center">
                        {user.mfa_enabled ? (
                          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                            <CheckCircle
                              size={18}
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                            <AlertTriangle
                              size={18}
                              className="text-amber-600 dark:text-amber-400"
                            />
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.mfa_enabled
                              ? "MFA is enabled"
                              : "MFA is not enabled"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.mfa_enabled
                              ? "User is using additional security verification"
                              : "Recommend enabling MFA for increased security"}
                          </p>
                        </div>
                      </div>

                      <div>
                        {user.mfa_enabled ? (
                          <button
                            onClick={() => {
                              showConfirmationDialog(
                                "reset-mfa",
                                "Reset MFA",
                                `This will remove all enrolled MFA devices for ${user.name}. They will need to set up MFA again. Continue?`
                              );
                            }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            <EyeOff size={16} className="mr-2" />
                            Reset MFA
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              toast("Require MFA setup feature coming soon");
                            }}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            <Eye size={16} className="mr-2" />
                            Require MFA Setup
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-800 dark:text-primary-300 px-4 py-3 rounded-xl text-sm flex items-start">
                      <AlertCircle
                        size={18}
                        className="mr-2 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="font-medium mb-1">About MFA</p>
                        <p>
                          Multi-Factor Authentication adds an extra layer of
                          security to the user's account. Resetting MFA will
                          remove all enrolled devices and require the user to
                          set up MFA again.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                        <UserCheck
                          size={20}
                          className="text-primary-600 dark:text-primary-400"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Account Status
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Control the user's access to the platform
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mt-4">
                      <div className="flex items-center">
                        {user.status === "active" ? (
                          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                            <CheckCircle
                              size={18}
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                            <XCircle
                              size={18}
                              className="text-red-600 dark:text-red-400"
                            />
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {user.status}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.status === "active"
                              ? "User has full access to the platform"
                              : "User access is currently restricted"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            showConfirmationDialog(
                              "toggle-status",
                              user.status === "active"
                                ? "Deactivate User"
                                : "Activate User",
                              user.status === "active"
                                ? `Are you sure you want to deactivate ${user.name}'s account? They will lose access to the platform.`
                                : `Are you sure you want to activate ${user.name}'s account? They will regain access to the platform.`
                            );
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                            user.status === "active"
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {user.status === "active" ? (
                            <>
                              <Lock size={16} className="mr-2" />
                              Deactivate User
                            </>
                          ) : (
                            <>
                              <Unlock size={16} className="mr-2" />
                              Activate User
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            toast("View audit logs feature coming soon");
                          }}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                        >
                          <FileText size={16} className="mr-2" />
                          View Audit Logs
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-xl text-sm flex items-start">
                      <AlertTriangle
                        size={18}
                        className="mr-2 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="font-medium mb-1">
                          Account Status Warning
                        </p>
                        <p>
                          {user.status === "active"
                            ? "Deactivating this account will prevent the user from accessing the platform until reactivated."
                            : "This account is currently inactive. The user cannot access the platform until the account is reactivated."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditAdmin
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleEditFormChange={handleEditFormChange}
          handleEditSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default UserDetailsPage;
