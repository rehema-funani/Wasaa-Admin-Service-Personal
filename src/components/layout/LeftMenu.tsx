import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  BarChart3,
  LogOut,
  UserCheck,
  Shield,
  Clock,
  Lock,
  Database,
  DollarSign,
  ChevronRight,
  Activity,
  Zap,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SlimSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [systemStatus, setSystemStatus] = useState("operational");
  const [riskAlerts, setRiskAlerts] = useState(3);
  const [userSecurityLevel, setUserSecurityLevel] = useState("level-3");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ y: 0 });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedByPin, setExpandedByPin] = useState(false);
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);

  const location = useLocation();
  const user = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        if (e.clientX - rect.left < rect.width) {
          setMousePosition({ y: e.clientY });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    navigate("/auth/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-emerald-500 dark:bg-emerald-400";
      case "degraded":
        return "bg-amber-500 dark:bg-amber-400";
      case "critical":
        return "bg-red-500 dark:bg-red-400";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getSecurityLevelIndicator = (level: string) => {
    switch (level) {
      case "level-1":
        return {
          color: "bg-gray-400 dark:bg-gray-500",
          label: "Basic",
          bars: 1,
        };
      case "level-2":
        return {
          color: "bg-blue-500 dark:bg-blue-600",
          label: "Standard",
          bars: 2,
        };
      case "level-3":
        return {
          color: "bg-violet-500 dark:bg-violet-600",
          label: "Enhanced",
          bars: 3,
        };
      case "level-4":
        return {
          color: "bg-amber-500 dark:bg-amber-600",
          label: "Advanced",
          bars: 4,
        };
      case "level-5":
        return {
          color: "bg-red-500 dark:bg-red-600",
          label: "Critical",
          bars: 5,
        };
      default:
        return {
          color: "bg-gray-400 dark:bg-gray-500",
          label: "Unknown",
          bars: 0,
        };
    }
  };

  const securityLevel = getSecurityLevelIndicator(userSecurityLevel);

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedByPin(!expandedByPin);
  };

  const handleMouseEnter = () => {
    if (!expandedByPin) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!expandedByPin) {
      setIsExpanded(false);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`flex flex-col h-full transition-all duration-500 ease-in-out z-50 relative group ${
        isExpanded || expandedByPin ? "w-64" : "w-[60px]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 dark:from-gray-950 via-indigo-950/90 dark:via-gray-900/90 to-slate-900 dark:to-gray-950"></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600/5 dark:via-indigo-500/3 to-transparent opacity-70 dark:opacity-50 animate-pulse-slow"></div>

      {/* Decorative top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] animate-gradient-flow"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-3">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Interactive glow effect */}
      <div
        className="absolute w-40 h-40 rounded-full blur-3xl bg-indigo-500/5 dark:bg-indigo-400/3 pointer-events-none transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"
        style={{
          left: "50%",
          top: mousePosition.y - 150,
          transform: "translateX(-50%)",
        }}
      ></div>

      {/* Main content container */}
      <div
        className={`relative flex flex-col h-full px-3 py-6 space-y-4 z-10 ${
          isExpanded || expandedByPin ? "px-5" : "px-2"
        }`}
      >
        {/* Expansion pin button (only shows when expanded) */}
        {(isExpanded || expandedByPin) && (
          <button
            onClick={togglePin}
            className="absolute top-3 right-3 p-1.5 rounded-full transition-all duration-300 hover:bg-indigo-600/20 dark:hover:bg-indigo-500/20 group/pin"
          >
            <Lock
              size={14}
              className={`transition-all duration-300 ${
                expandedByPin
                  ? "text-indigo-400 dark:text-indigo-400"
                  : "text-slate-500 dark:text-gray-500 group-hover/pin:text-indigo-400 dark:group-hover/pin:text-indigo-400"
              }`}
            />
            <span className="absolute left-full ml-2 px-2 py-1 bg-indigo-900/90 dark:bg-gray-800/90 text-indigo-100 dark:text-indigo-200 text-xs rounded-md whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity duration-300 pointer-events-none">
              {expandedByPin ? "Unpin sidebar" : "Pin sidebar"}
            </span>
          </button>
        )}

        {/* User Profile Section */}
        <div className="mb-4 relative">
          <div className="flex items-center">
            <div className="relative group/avatar">
              {/* Avatar with glowing border effect */}
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 opacity-70 dark:opacity-60 blur-sm group-hover/avatar:opacity-100 dark:group-hover/avatar:opacity-80 transition-opacity duration-300"></div>
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-500 flex items-center justify-center text-white font-medium shadow-lg shadow-indigo-950/30 dark:shadow-gray-950/50 overflow-hidden">
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
                <span className="relative z-10 text-lg">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              {/* Online status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 flex">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 dark:bg-emerald-400 border border-slate-900 dark:border-gray-950"></span>
                </span>
              </div>
            </div>

            {/* User info (only shows when expanded) */}
            {(isExpanded || expandedByPin) && (
              <div className="ml-3 animate-fadeIn">
                <p className="text-sm font-medium text-white dark:text-gray-100 flex items-center">
                  {user?.first_name} {user?.last_name}
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-indigo-500/20 dark:bg-indigo-500/30 text-indigo-300 dark:text-indigo-200 rounded-full flex items-center">
                    <Shield size={10} className="mr-0.5" />
                    Admin
                  </span>
                </p>
                <div className="flex items-center">
                  <div
                    className="flex space-x-0.5 mr-1.5 cursor-pointer relative"
                    onMouseEnter={() => setShowSecurityTooltip(true)}
                    onMouseLeave={() => setShowSecurityTooltip(false)}
                  >
                    {showSecurityTooltip && (
                      <div className="absolute left-0 top-full mt-1 px-2 py-1 bg-indigo-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-indigo-100 dark:text-indigo-200 text-xs rounded-md whitespace-nowrap z-50 animate-fadeIn">
                        Security: {securityLevel.label}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-gray-400 truncate max-w-[140px]">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {(isExpanded || expandedByPin) && (
          <div className="space-y-2 mb-2">
            <div className="bg-slate-800/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2.5 flex justify-between items-center border border-slate-700/20 dark:border-gray-700/30">
              <div className="flex items-center">
                <div
                  className={`relative w-2 h-2 rounded-full ${getStatusColor(
                    systemStatus
                  )} ${
                    systemStatus !== "operational" ? "animate-pulse" : ""
                  } mr-2`}
                >
                  {systemStatus === "operational" && (
                    <span className="absolute inset-0 rounded-full bg-emerald-500/50 dark:bg-emerald-400/50 animate-ping-slow"></span>
                  )}
                </div>
                <span className="text-xs text-slate-300 dark:text-gray-300">
                  System Status
                </span>
              </div>
              <span className="text-xs font-medium text-slate-200 dark:text-gray-200 capitalize">
                {systemStatus}
              </span>
            </div>

            <div className="bg-slate-800/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2.5 flex justify-between items-center border border-slate-700/20 dark:border-gray-700/30 relative overflow-hidden">
              <div className="flex items-center relative z-10">
                <Clock
                  size={14}
                  className="text-indigo-400 dark:text-indigo-400 mr-2"
                />
                <span className="text-xs text-slate-300 dark:text-gray-300">
                  EAT Time
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-200 dark:text-gray-200 relative z-10">
                {formatTime()}
              </span>

              <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-indigo-500/5 dark:bg-indigo-400/3 animate-pulse-slow"></div>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-1 py-1">
          {(isExpanded || expandedByPin) && (
            <div className="mb-2">
              <div className="flex items-center">
                <p className="text-[10px] uppercase tracking-wider text-indigo-400/70 dark:text-indigo-400/60 font-medium px-1 mb-1.5">
                  Main Navigation
                </p>
                <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/20 dark:from-indigo-400/15 to-transparent ml-2"></div>
              </div>
            </div>
          )}

          <Link
            to="/"
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              isActive("/")
                ? "bg-gradient-to-r from-indigo-600/20 dark:from-indigo-500/25 via-violet-600/20 dark:via-violet-500/25 to-indigo-600/10 dark:to-indigo-500/15 text-indigo-200 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/25"
                : "text-slate-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15"
            }`}
            onMouseEnter={() => setActiveSection("dashboard")}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div
              className={`relative ${
                isActive("/") ? "text-indigo-300 dark:text-indigo-300" : ""
              }`}
            >
              <DollarSign size={20} strokeWidth={isActive("/") ? 2.5 : 1.5} />

              {isActive("/") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400 animate-ping-slow opacity-75"></span>
              )}
            </div>

            {(isExpanded || expandedByPin) && (
              <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                <span
                  className={`text-sm ${isActive("/") ? "font-medium" : ""}`}
                >
                  Dashboard
                </span>
                {isActive("/") && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400"></div>
                )}
              </div>
            )}

            {activeSection === "dashboard" && !isActive("/") && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 dark:via-indigo-400/3 to-transparent -translate-x-full animate-shimmer-slow pointer-events-none"></div>
            )}
          </Link>

          <Link
            to="/admin/logs"
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              isActive("/admin/logs")
                ? "bg-gradient-to-r from-indigo-600/20 dark:from-indigo-500/25 via-violet-600/20 dark:via-violet-500/25 to-indigo-600/10 dark:to-indigo-500/15 text-indigo-200 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/25"
                : "text-slate-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15"
            }`}
            onMouseEnter={() => setActiveSection("activity")}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div
              className={`relative ${
                isActive("/admin/logs")
                  ? "text-indigo-300 dark:text-indigo-300"
                  : ""
              }`}
            >
              <Activity
                size={20}
                strokeWidth={isActive("/admin/logs") ? 2.5 : 1.5}
              />

              {riskAlerts > 0 && (
                <div className="absolute -top-1.5 -right-1.5 flex">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-400 opacity-75"></span>
                  <span className="relative w-4 h-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full text-[10px] font-medium flex items-center justify-center text-white border border-slate-900/10 dark:border-gray-950/20">
                    {riskAlerts}
                  </span>
                </div>
              )}
            </div>

            {(isExpanded || expandedByPin) && (
              <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                <span
                  className={`text-sm ${
                    isActive("/admin/logs") ? "font-medium" : ""
                  }`}
                >
                  Activity
                </span>
                {isActive("/admin/logs") && !riskAlerts && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400"></div>
                )}
              </div>
            )}

            {activeSection === "activity" && !isActive("/admin/logs") && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 dark:via-indigo-400/3 to-transparent -translate-x-full animate-shimmer-slow pointer-events-none"></div>
            )}
          </Link>

          <Link
            to="/admin/finance/reports"
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              isActive("/admin/finance/reports")
                ? "bg-gradient-to-r from-indigo-600/20 dark:from-indigo-500/25 via-violet-600/20 dark:via-violet-500/25 to-indigo-600/10 dark:to-indigo-500/15 text-indigo-200 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/25"
                : "text-slate-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15"
            }`}
            onMouseEnter={() => setActiveSection("analytics")}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div
              className={`relative ${
                isActive("/admin/finance/reports")
                  ? "text-indigo-300 dark:text-indigo-300"
                  : ""
              }`}
            >
              <BarChart3
                size={20}
                strokeWidth={isActive("/admin/finance/reports") ? 2.5 : 1.5}
              />

              {isActive("/admin/finance/reports") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400 animate-ping-slow opacity-75"></span>
              )}
            </div>

            {(isExpanded || expandedByPin) && (
              <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                <span
                  className={`text-sm ${
                    isActive("/admin/finance/reports") ? "font-medium" : ""
                  }`}
                >
                  Analytics
                </span>
                {isActive("/admin/finance/reports") && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400"></div>
                )}
              </div>
            )}

            {activeSection === "analytics" &&
              !isActive("/admin/finance/reports") && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 dark:via-indigo-400/3 to-transparent -translate-x-full animate-shimmer-slow pointer-events-none"></div>
              )}
          </Link>

          {isExpanded || expandedByPin ? (
            <div className="pt-4 pb-2 mt-3">
              <div className="flex items-center">
                <p className="text-[10px] uppercase tracking-wider text-indigo-400/70 dark:text-indigo-400/60 font-medium px-1">
                  Account
                </p>
                <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/20 dark:from-indigo-400/15 to-transparent ml-2"></div>
              </div>
            </div>
          ) : (
            <div className="my-3 h-px bg-gradient-to-r from-indigo-500/20 dark:from-indigo-400/15 via-indigo-500/10 dark:via-indigo-400/8 to-indigo-500/5 dark:to-indigo-400/3"></div>
          )}

          {/* Profile Link */}
          <Link
            to="/accounts/profile"
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              isActive("/accounts/profile")
                ? "bg-gradient-to-r from-indigo-600/20 dark:from-indigo-500/25 via-violet-600/20 dark:via-violet-500/25 to-indigo-600/10 dark:to-indigo-500/15 text-indigo-200 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/25"
                : "text-slate-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15"
            }`}
            onMouseEnter={() => setActiveSection("profile")}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div
              className={`relative ${
                isActive("/accounts/profile")
                  ? "text-indigo-300 dark:text-indigo-300"
                  : ""
              }`}
            >
              <UserCheck
                size={20}
                strokeWidth={isActive("/accounts/profile") ? 2.5 : 1.5}
              />

              {/* Active indicator animation */}
              {isActive("/accounts/profile") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400 animate-ping-slow opacity-75"></span>
              )}
            </div>

            {(isExpanded || expandedByPin) && (
              <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                <span
                  className={`text-sm ${
                    isActive("/accounts/profile") ? "font-medium" : ""
                  }`}
                >
                  Profile
                </span>
                {isActive("/accounts/profile") && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400"></div>
                )}
              </div>
            )}

            {/* Animated hover effect */}
            {activeSection === "profile" && !isActive("/accounts/profile") && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 dark:via-indigo-400/3 to-transparent -translate-x-full animate-shimmer-slow pointer-events-none"></div>
            )}
          </Link>

          {/* Settings Link */}
          <Link
            to="/admin/settings"
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              isActive("/admin/settings")
                ? "bg-gradient-to-r from-indigo-600/20 dark:from-indigo-500/25 via-violet-600/20 dark:via-violet-500/25 to-indigo-600/10 dark:to-indigo-500/15 text-indigo-200 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/25"
                : "text-slate-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15"
            }`}
            onMouseEnter={() => setActiveSection("settings")}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div
              className={`relative ${
                isActive("/admin/settings")
                  ? "text-indigo-300 dark:text-indigo-300"
                  : ""
              }`}
            >
              <Settings
                size={20}
                strokeWidth={isActive("/admin/settings") ? 2.5 : 1.5}
                className="transform transition-transform duration-700 group-hover:rotate-90"
              />

              {/* Active indicator animation */}
              {isActive("/admin/settings") && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400 animate-ping-slow opacity-75"></span>
              )}
            </div>

            {(isExpanded || expandedByPin) && (
              <div className="ml-3 flex items-center justify-between flex-1 animate-fadeIn">
                <span
                  className={`text-sm ${
                    isActive("/admin/settings") ? "font-medium" : ""
                  }`}
                >
                  Settings
                </span>
                {isActive("/admin/settings") && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400"></div>
                )}
              </div>
            )}

            {/* Animated hover effect */}
            {activeSection === "settings" && !isActive("/admin/settings") && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 dark:via-indigo-400/3 to-transparent -translate-x-full animate-shimmer-slow pointer-events-none"></div>
            )}
          </Link>
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-3 border-t border-indigo-500/10 dark:border-indigo-400/8 relative">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-xl text-red-300 dark:text-red-300 hover:text-white dark:hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 dark:hover:from-red-500/25 hover:to-red-500/10 dark:hover:to-red-500/15 transition-all duration-300 group relative overflow-hidden"
            onMouseEnter={() => setActiveSection("logout")}
            onMouseLeave={() => setActiveSection(null)}
          >
            <LogOut size={20} strokeWidth={1.5} />

            {(isExpanded || expandedByPin) && (
              <span className="ml-3 text-sm animate-fadeIn">Logout</span>
            )}

            {/* Animated hover effect */}
            {activeSection === "logout" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 dark:via-red-400/3 to-transparent -translate-x-full animate-shimmer-slow pointer-events-none"></div>
            )}
          </button>
        </div>

        {/* Footer Info (only when expanded) */}
        {(isExpanded || expandedByPin) && (
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center">
              <Database
                size={12}
                className="text-indigo-500/40 dark:text-indigo-400/30 mr-1.5"
              />
              <span className="text-[10px] text-indigo-500/40 dark:text-indigo-400/30">
                v2.4.5
              </span>
            </div>
            <div className="flex items-center">
              <Shield
                size={12}
                className="text-indigo-500/40 dark:text-indigo-400/30 mr-1.5"
              />
              <span className="text-[10px] text-indigo-500/40 dark:text-indigo-400/30">
                PCI DSS
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.8; }
                    70%, 100% { transform: scale(2); opacity: 0; }
                }
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                
                @keyframes shimmer-slow {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer-slow {
                    animation: shimmer-slow 3s infinite;
                }
                
                @keyframes gradient-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-flow {
                    animation: gradient-flow 5s ease infinite;
                }
            `}</style>
    </div>
  );
};

export default SlimSidebar;
