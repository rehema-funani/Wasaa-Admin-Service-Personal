import React, { useState, useEffect } from "react";
import {
  User,
  ChevronRight,
  Calendar,
  Shield,
  LogOut,
  Key,
  Clock,
  Bell,
  Lock,
  Mail,
  Phone,
  Plus,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Eye,
  Edit,
  Trash,
  ArrowRight,
  Zap,
  Settings,
  LineChart,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Permission {
  id: string;
  title: string;
}

interface RolePermission {
  id: number;
  permissions: Permission;
}

interface Role {
  id: string;
  title: string;
  role_permissions: RolePermission[];
}

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string | null;
  account_status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  last_login: string;
  last_password_reset: string;
  role_id: string;
  role: Role;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("account");
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");

      if (!storedUserData) {
        throw new Error("No user data found");
      }

      const parsedUserData: UserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load user profile"
      );
      setIsLoading(false);
    }
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "Invalid date";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    navigate("/auth/login");
  };

  const getTimeSince = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (diffDays === 0) {
        if (diffHours === 0) return "Just now";
        return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
      }
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30)
        return `${Math.floor(diffDays / 7)} week${
          Math.floor(diffDays / 7) !== 1 ? "s" : ""
        } ago`;
      return `${Math.floor(diffDays / 30)} month${
        Math.floor(diffDays / 30) !== 1 ? "s" : ""
      } ago`;
    } catch {
      return "Unknown";
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const groupPermissionsByCategory = (permissions) => {
    const grouped = {};

    permissions.forEach((rp) => {
      const perm = rp.permissions;
      const parts = perm.title.split("_");
      let category = "General";

      if (parts.length >= 2 && parts[0] === "can") {
        const entityParts = parts.slice(1);
        const entities = [
          "user",
          "ticket",
          "report",
          "dashboard",
          "payment",
          "account",
          "profile",
        ];
        const foundEntity = entityParts.find((part) => entities.includes(part));

        if (foundEntity) {
          category = foundEntity.charAt(0).toUpperCase() + foundEntity.slice(1);
        }
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(perm);
    });

    return grouped;
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const formatPermissionTitle = (title) => {
    let formatted = title.replace(/^can_/, "").replace(/_/g, " ");
    formatted = formatted
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formatted;
  };

  const getPermissionIcon = (title) => {
    if (title.includes("view")) return <Eye size={14} />;
    if (title.includes("edit") || title.includes("update"))
      return <Edit size={14} />;
    if (title.includes("delete") || title.includes("remove"))
      return <Trash size={14} />;
    if (title.includes("create") || title.includes("add"))
      return <Plus size={14} />;
    return <ChevronRight size={14} />;
  };

  const groupedPermissions = userData?.role?.role_permissions
    ? groupPermissionsByCategory(userData?.role?.role_permissions)
    : {};

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
          <p className="text-slate-500 text-sm font-light mt-4">
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-slate-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Unable to load profile
            </h2>
            <p className="text-slate-500 mb-6">
              {error || "User data not found"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const MenuButton = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-5 py-4 text-left transition-all ${
        active
          ? "bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 text-blue-700"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {React.cloneElement(icon, {
        size: 18,
        className: active ? "text-blue-500 mr-4" : "text-slate-400 mr-4",
      })}
      <span className={`text-sm ${active ? "font-medium" : ""}`}>{label}</span>
      {active && <ChevronRight size={16} className="ml-auto text-blue-500" />}
    </button>
  );

  const InfoCard = ({ icon, title, value }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="text-sm font-medium text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const StatusDot = ({ status }) => (
    <div className="relative flex items-center">
      <div
        className={`w-2 h-2 rounded-full ${
          status === "active" ? "bg-emerald-500" : "bg-slate-400"
        }`}
      ></div>
      <div
        className={`absolute w-2 h-2 rounded-full ${
          status === "active" ? "bg-emerald-500" : "bg-slate-400"
        } animate-ping opacity-75`}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden z-0 opacity-5">
          <div className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-blue-400"></div>
          <div className="absolute left-1/3 top-1/4 w-96 h-96 rounded-full bg-blue-300"></div>
          <div className="absolute right-1/4 bottom-10 w-64 h-64 rounded-full bg-blue-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col mb-8">
            <h1 className="text-3xl font-light text-slate-800 tracking-tight">
              My Profile
            </h1>
            <div className="flex items-center mt-2">
              <div
                className={`mr-2 ${
                  userData.account_status === "active"
                    ? "text-emerald-500"
                    : "text-slate-400"
                }`}
              >
                <StatusDot status={userData.account_status} />
              </div>
              <p className="text-sm text-slate-500">
                <span
                  className={
                    userData.account_status === "active"
                      ? "text-emerald-600 font-medium"
                      : "text-slate-500"
                  }
                >
                  {userData.account_status.charAt(0).toUpperCase() +
                    userData.account_status.slice(1)}
                </span>{" "}
                • Online
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 pt-6 pb-10 px-6 relative">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,0 L100,0 L100,100 Z"
                          fill="white"
                          opacity="0.1"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* User avatar */}
                  <div className="relative z-10 flex justify-center">
                    {userData.profile_picture ? (
                      <img
                        src={userData.profile_picture}
                        alt={`${userData.first_name} ${userData.last_name}`}
                        className="w-20 h-20 rounded-xl border-2 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-white text-blue-600 flex items-center justify-center text-xl font-semibold border-2 border-white shadow-lg">
                        {getInitials(userData.first_name, userData.last_name)}
                      </div>
                    )}
                  </div>
                </div>

                {/* User info */}
                <div className="px-6 pt-0 pb-6 -mt-6">
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                    <div className="text-center mb-2">
                      <h2 className="text-lg font-medium text-slate-800">
                        {userData.first_name} {userData.last_name}
                      </h2>
                      <p className="text-sm text-slate-500 flex items-center justify-center mt-1">
                        <Mail size={14} className="mr-1.5" />
                        {userData.email}
                      </p>
                    </div>

                    <div className="flex justify-center mt-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                        {userData.role.title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <InfoCard
                      icon={<Clock size={16} className="text-blue-500" />}
                      title="Last Login"
                      value={getTimeSince(userData.last_login)}
                    />
                    <InfoCard
                      icon={<Calendar size={16} className="text-blue-500" />}
                      title="Member Since"
                      value={formatDate(userData.createdAt)}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 py-2 px-5">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Account Menu
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  <MenuButton
                    icon={<User />}
                    label="Account Information"
                    active={activeSection === "account"}
                    onClick={() => setActiveSection("account")}
                  />
                  <MenuButton
                    icon={<Lock />}
                    label="Security & Login"
                    active={activeSection === "security"}
                    onClick={() => setActiveSection("security")}
                  />
                  <MenuButton
                    icon={<Shield />}
                    label="Roles & Permissions"
                    active={activeSection === "permissions"}
                    onClick={() => setActiveSection("permissions")}
                  />
                </div>

                <div className="p-5 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-grow">
              {activeSection === "account" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center">
                      <User size={20} className="text-blue-500 mr-3" />
                      <h2 className="text-lg font-medium text-slate-800">
                        Account Information
                      </h2>
                    </div>
                    <button className="px-3 py-1 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center">
                      <Edit size={14} className="mr-1.5" />
                      Edit
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        {/* First Name */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                            First Name
                          </label>
                          <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="text-slate-800 text-sm">
                              {userData.first_name}
                            </span>
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                            Email Address
                          </label>
                          <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50 border border-slate-100">
                            <Mail size={16} className="text-slate-400 mr-2" />
                            <span className="text-slate-800 text-sm">
                              {userData.email}
                            </span>
                          </div>
                        </div>

                        {/* Account Status */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                            Account Status
                          </label>
                          <div className="flex items-center">
                            <div
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg ${
                                userData.account_status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              <StatusDot status={userData.account_status} />
                              <span className="ml-2 text-sm font-medium capitalize">
                                {userData.account_status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Last Name */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                            Last Name
                          </label>
                          <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="text-slate-800 text-sm">
                              {userData.last_name}
                            </span>
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                            Phone Number
                          </label>
                          <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50 border border-slate-100">
                            <Phone size={16} className="text-slate-400 mr-2" />
                            <span className="text-slate-800 text-sm">
                              {userData.phone_number}
                            </span>
                          </div>
                        </div>

                        {/* Role */}
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                            Role
                          </label>
                          <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50 border border-slate-100">
                            <Shield size={16} className="text-slate-400 mr-2" />
                            <span className="text-slate-800 text-sm">
                              {userData.role.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100">
                      <div className="flex items-center mb-4">
                        <LineChart size={18} className="text-blue-500 mr-2" />
                        <h3 className="text-sm font-medium text-slate-700">
                          Account Activity
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                              <Calendar size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">
                                Account Created
                              </p>
                              <p className="text-sm font-medium text-slate-800">
                                {formatDate(userData.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                              <Clock size={16} className="text-amber-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">
                                Last Updated
                              </p>
                              <p className="text-sm font-medium text-slate-800">
                                {formatDate(userData.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                              <Zap size={16} className="text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">
                                Recent Activity
                              </p>
                              <p className="text-sm font-medium text-slate-800">
                                Login {getTimeSince(userData.last_login)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "security" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center">
                      <Lock size={20} className="text-blue-500 mr-3" />
                      <h2 className="text-lg font-medium text-slate-800">
                        Security & Login
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Current Session */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-700 flex items-center">
                          <Clock size={16} className="text-blue-500 mr-2" />
                          Current Session
                        </h3>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100 flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                          Active
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-slate-100">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                            <CheckCircle2 size={18} className="text-blue-600" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm text-slate-800 font-medium">
                              Last login {getTimeSince(userData.last_login)}
                            </p>
                            <div className="flex mt-2 items-center text-xs text-slate-500">
                              <div className="flex items-center pr-3 mr-3 border-r border-slate-200">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                                Active Now
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium mr-1">IP:</span>
                                192.168.1.1
                              </div>
                            </div>
                          </div>
                          <button className="ml-4 px-3 py-1.5 text-xs text-red-600 font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex-shrink-0">
                            End Session
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 text-right">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center ml-auto">
                          <span>View All Sessions</span>
                          <ArrowRight size={14} className="ml-1" />
                        </button>
                      </div>
                    </div>

                    {/* Password Management */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-700 flex items-center">
                          <Key size={16} className="text-blue-500 mr-2" />
                          Password Management
                        </h3>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              Password Security
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Last changed{" "}
                              {getTimeSince(userData.last_password_reset)}
                            </p>
                          </div>
                          <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
                            Change Password
                          </button>
                        </div>

                        <div className="flex items-center">
                          <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                          <span className="ml-3 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                            Strong
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-700 flex items-center">
                          <Shield size={16} className="text-blue-500 mr-2" />
                          Two-Factor Authentication
                        </h3>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-slate-100">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mr-4 flex-shrink-0">
                            <AlertCircle size={18} className="text-amber-600" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-slate-800">
                              Not Enabled
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Add an extra layer of security to your account by
                              requiring both your password and a verification
                              code.
                            </p>
                          </div>
                          <button className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm flex-shrink-0">
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "permissions" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center">
                      <Shield size={20} className="text-blue-500 mr-3" />
                      <h2 className="text-lg font-medium text-slate-800">
                        Roles & Permissions
                      </h2>
                    </div>
                    <div className="px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                      <span className="text-sm font-medium text-blue-700">
                        {userData.role.title}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl mb-6 border border-blue-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Info size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-medium mb-1">
                          Role-Based Access Control
                        </p>
                        <p className="text-xs text-slate-600">
                          Your access is determined by your role:{" "}
                          <span className="font-medium text-blue-700">
                            {userData.role.title}
                          </span>
                          . The permissions below outline what actions you can
                          perform in the system.
                        </p>
                      </div>
                    </div>

                    {/* Permissions Overview */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-700 flex items-center">
                          <Settings size={16} className="text-blue-500 mr-2" />
                          Permissions Overview
                        </h3>
                        <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1 border border-slate-100">
                          <span className="text-xs font-medium text-blue-700 mr-1">
                            {Object.values(groupedPermissions).flat().length}
                          </span>
                          <span className="text-xs text-slate-500">
                            total permissions
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {Object.entries(groupedPermissions).map(
                          ([category, perms]) => (
                            <button
                              key={category}
                              onClick={() => toggleCategory(category)}
                              className={`flex items-center px-3 py-1.5 rounded-lg text-xs transition-all ${
                                expandedCategories[category]
                                  ? "bg-blue-100 text-blue-700 font-medium border border-blue-200"
                                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                              }`}
                            >
                              <span className="mr-1.5">{category}</span>
                              <span
                                className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                                  expandedCategories[category]
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {perms.length}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(groupedPermissions).map(
                        ([category, permissions]) =>
                          expandedCategories[category] && (
                            <div
                              key={category}
                              className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100"
                            >
                              <div className="bg-white px-4 py-3 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                                      <Shield
                                        size={14}
                                        className="text-blue-600"
                                      />
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-800">
                                      {category} Permissions
                                    </h3>
                                  </div>
                                  <button
                                    onClick={() => toggleCategory(category)}
                                    className="text-slate-400 hover:text-slate-600 p-1"
                                  >
                                    <ChevronDown
                                      size={16}
                                      className="transform rotate-0"
                                    />
                                  </button>
                                </div>
                              </div>

                              <div className="p-4">
                                <div className="flex flex-wrap gap-2">
                                  {permissions.map((permission) => {
                                    const permTitle = permission.title;
                                    let actionType = "view";

                                    if (
                                      permTitle.includes("create") ||
                                      permTitle.includes("add")
                                    ) {
                                      actionType = "create";
                                    } else if (
                                      permTitle.includes("edit") ||
                                      permTitle.includes("update")
                                    ) {
                                      actionType = "edit";
                                    } else if (
                                      permTitle.includes("delete") ||
                                      permTitle.includes("remove")
                                    ) {
                                      actionType = "delete";
                                    }

                                    // Determine color based on action type
                                    const colors = {
                                      view: "bg-blue-50 text-blue-700 border-blue-100",
                                      create:
                                        "bg-green-50 text-green-700 border-green-100",
                                      edit: "bg-amber-50 text-amber-700 border-amber-100",
                                      delete:
                                        "bg-red-50 text-red-700 border-red-100",
                                    };

                                    return (
                                      <div
                                        key={permission.id}
                                        className={`px-3 py-1.5 rounded-lg text-xs border flex items-center ${colors[actionType]}`}
                                        title={permission.title}
                                      >
                                        <span className="mr-1.5">
                                          {getPermissionIcon(permission.title)}
                                        </span>
                                        {formatPermissionTitle(
                                          permission.title
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )
                      )}

                      {Object.values(expandedCategories).every(
                        (expanded) => !expanded
                      ) && (
                        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Shield size={24} className="text-blue-600" />
                          </div>
                          <h4 className="text-slate-800 font-medium mb-2">
                            Select a permission category
                          </h4>
                          <p className="text-slate-500 text-xs max-w-md mx-auto">
                            Click on any of the permission categories above to
                            view the detailed permissions for that section.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 p-4 border border-slate-100 rounded-xl bg-slate-50">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                          <Plus size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-800">
                            Need Additional Access?
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Contact your system administrator if you require
                            additional permissions.
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
      </div>
    </div>
  );
};

export default UserProfile;
