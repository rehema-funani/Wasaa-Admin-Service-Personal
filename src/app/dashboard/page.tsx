import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronRight,
  Smartphone,
  Laptop,
  Tablet,
  Activity,
  Wallet,
  Bell,
  RefreshCw,
  Shield,
  AlertCircle,
  Check,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import UserActivityChart from "../../components/dashboard/UserActivityChart";
import LoginTypesPieChart from "../../components/dashboard/LoginTypesPieChart";
import RecentUsersTable from "../../components/dashboard/RecentUsersTable";
import RecentGroupsTable from "../../components/dashboard/RecentGroupsTable";
import ActiveEntitiesList from "../../components/dashboard/ActiveEntitiesList";
import LivestreamMetrics from "../../components/dashboard/LivestreamMetrics";
import WalletMetrics from "../../components/dashboard/WalletMetrics";
import userService from "../../api/services/users";

const Dashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("week");
  const [selectedTab, setSelectedTab] = useState("users");
  const [forexTab, setForexTab] = useState("rates");
  const [notificationCount, setNotificationCount] = useState(4);
  const [securityScore, setSecurityScore] = useState(86);
  const [stats, setStats] = useState([]);

  const getStats = async () => {
    try {
      const response = await userService.getReports();
      setStats(response);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecurityScore((prev) =>
        Math.min(100, prev + Math.floor(Math.random() * 3) - 1)
      );
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 28 },
    },
  };

  // Modern stats data with gradients
  const statsData = [
    {
      title: "Total Users",
      value: "24,892",
      change: "+12.5%",
      isPositive: true,
      icon: <Users size={20} className="text-white" strokeWidth={1.8} />,
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      title: "Active Users",
      value: "3,745",
      change: "+8.2%",
      isPositive: true,
      icon: <UserCheck size={20} className="text-white" strokeWidth={1.8} />,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      title: "Transaction Volume",
      value: "Ksh 934,128",
      change: "+23.1%",
      isPositive: true,
      icon: <TrendingUp size={20} className="text-white" strokeWidth={1.8} />,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      title: "Revenue",
      value: "Ksh 87,291",
      change: "-2.4%",
      isPositive: false,
      icon: <DollarSign size={20} className="text-white" strokeWidth={1.8} />,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
  ];

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleForexTabChange = (tab) => {
    setForexTab(tab);
  };

  const exchangeRates = [
    {
      pair: "USD/KES",
      rate: "130.45",
      change: "+0.3%",
      isUp: true,
      source: "Fixer.io",
    },
    {
      pair: "EUR/KES",
      rate: "142.18",
      change: "-0.2%",
      isUp: false,
      source: "OpenExchangeRates",
    },
    {
      pair: "GBP/KES",
      rate: "168.92",
      change: "+0.5%",
      isUp: true,
      source: "Fixer.io",
    },
    {
      pair: "JPY/KES",
      rate: "0.8734",
      change: "+0.1%",
      isUp: true,
      source: "Central Bank",
    },
    {
      pair: "USD/UGX",
      rate: "3710.25",
      change: "-0.4%",
      isUp: false,
      source: "OpenExchangeRates",
    },
    {
      pair: "USD/TZS",
      rate: "2513.75",
      change: "+0.2%",
      isUp: true,
      source: "Central Bank",
    },
  ];

  return (
    <motion.div
      className="w-full bg-gray-50 dark:bg-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-2">
        <div>
          <h1 className="text-[28px] font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-[14px]">
            Welcome back, see the latest updates
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
            whileHover={{
              y: -4,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              transition: { duration: 0.2 },
            }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    stat.isPositive
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  <div className="flex items-center">
                    {stat.isPositive ? (
                      <ArrowUpRight size={12} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={12} className="mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {stat.title}
                </p>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:col-span-2 overflow-hidden"
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              User Activity
            </h2>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => handleTabChange("users")}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  selectedTab === "users"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Users
              </motion.button>
              <motion.button
                onClick={() => handleTabChange("groups")}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  selectedTab === "groups"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Groups
              </motion.button>
              <motion.button
                onClick={() => handleTabChange("transactions")}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  selectedTab === "transactions"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Transactions
              </motion.button>
            </div>
          </div>
          <UserActivityChart
            timeframe={activeTimeframe}
            dataType={selectedTab}
          />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden"
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Login Devices
          </h2>
          <LoginTypesPieChart />

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 mr-3">
                  <Smartphone
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                    strokeWidth={1.8}
                  />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mobile
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                68%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 mr-3">
                  <Laptop
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                    strokeWidth={1.8}
                  />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Desktop
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                26%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50 mr-3">
                  <Tablet
                    size={16}
                    className="text-violet-600 dark:text-violet-400"
                    strokeWidth={1.8}
                  />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tablet
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                6%
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Alert Status, System Health, Recent Conversions */}
      <motion.div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert Status */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50 mr-3">
                  <Bell
                    size={16}
                    className="text-violet-600 dark:text-violet-400"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Alert Status
                </h3>
              </div>
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={() => handleForexTabChange("day")}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-all ${
                    forexTab === "day"
                      ? "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  24h
                </motion.button>
                <motion.button
                  onClick={() => handleForexTabChange("week")}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-all ${
                    forexTab === "week"
                      ? "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  7d
                </motion.button>
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="w-36 h-36 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-[10px] border-violet-100 dark:border-violet-900/50"></div>
                <div
                  className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-violet-500 dark:border-t-violet-400 border-r-violet-500 dark:border-r-violet-400"
                  style={{ transform: `rotate(225deg)` }}
                ></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-white">
                    63%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Triggered
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/50 mr-3">
                    <Check
                      size={14}
                      className="text-green-600 dark:text-green-400"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Triggered
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  162
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/50 mr-3">
                    <Clock
                      size={14}
                      className="text-amber-600 dark:text-amber-400"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Pending
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  96
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/50 mr-3">
                    <AlertCircle
                      size={14}
                      className="text-red-600 dark:text-red-400"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Expired
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  45
                </span>
              </div>
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 mr-3">
                  <Shield
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  System Health
                </h3>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                All Systems Online
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Rate Sync
                  </span>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1"></div>
                    <span className="text-xs">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    2 minutes ago
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    28ms
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Alert Evaluator
                  </span>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1"></div>
                    <span className="text-xs">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    5 minutes ago
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    357ms
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    WebSocket/API
                  </span>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1"></div>
                    <span className="text-xs">Connected</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Real-time
                  </span>
                  <motion.button
                    className="text-xs text-blue-600 dark:text-blue-400 flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    Force sync
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Conversions */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 mr-3">
                    <RefreshCw
                      size={16}
                      className="text-cyan-600 dark:text-cyan-400"
                      strokeWidth={1.8}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Conversions
                  </h3>
                </div>
                <motion.button
                  className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                  whileHover={{ x: 3 }}
                >
                  View all <ChevronRight size={16} className="ml-1" />
                </motion.button>
              </div>
            </div>

            {/* Recent Conversions Table */}
            <div className="p-4">
              {/* Conversion 1 */}
              <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/50 h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw
                        size={16}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        USD → KES
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        User #3829
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      $500 → KSh 65,225
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      3 mins ago
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion 2 */}
              <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/50 h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw
                        size={16}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        EUR → KES
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        User #2771
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      €200 → KSh 28,436
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      12 mins ago
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion 3 */}
              <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/50 h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw
                        size={16}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        GBP → KES
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        User #4526
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      £750 → KSh 126,690
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      23 mins ago
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion 4 */}
              <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/50 h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw
                        size={16}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        USD → UGX
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        User #1845
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      $300 → UGX 1,113,075
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      45 mins ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Users & Groups */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Users
                </h2>
                <motion.button
                  className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                  whileHover={{ x: 3 }}
                >
                  View all <ChevronRight size={16} className="ml-1" />
                </motion.button>
              </div>
            </div>
            <RecentUsersTable recentUsers={stats.recent_users} />
          </motion.div>

          {/* Recent Groups */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Groups
                </h2>
                <motion.button
                  className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
                  whileHover={{ x: 3 }}
                >
                  View all <ChevronRight size={16} className="ml-1" />
                </motion.button>
              </div>
            </div>
            <RecentGroupsTable />
          </motion.div>
        </motion.div>

        {/* Active Users & Groups Split Panel */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Users */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Active Users
                  </h2>
                  <div className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 rounded-full text-xs text-green-700 dark:text-green-400 flex items-center">
                    <Clock size={10} className="mr-1" /> 30m
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 py-1 px-3 rounded-lg text-sm text-gray-800 dark:text-gray-200 font-medium">
                  328
                </div>
              </div>
            </div>
            <ActiveEntitiesList type="users" />
          </motion.div>

          {/* Active Groups */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Active Groups
                  </h2>
                  <div className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 rounded-full text-xs text-green-700 dark:text-green-400 flex items-center">
                    <Clock size={10} className="mr-1" /> 30m
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 py-1 px-3 rounded-lg text-sm text-gray-800 dark:text-gray-200 font-medium">
                  42
                </div>
              </div>
            </div>
            <ActiveEntitiesList type="groups" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden"
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                <Activity size={20} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Livestream Metrics
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Performance and engagement analytics
                </p>
              </div>
            </div>
            <motion.button
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
              whileHover={{ x: 3 }}
            >
              View details <ChevronRight size={16} className="ml-1" />
            </motion.button>
          </div>
          <LivestreamMetrics />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden"
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                <Wallet size={20} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Wallet Analytics
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Transaction and balance insights
                </p>
              </div>
            </div>
            <motion.button
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
              whileHover={{ x: 3 }}
            >
              View details <ChevronRight size={16} className="ml-1" />
            </motion.button>
          </div>
          <WalletMetrics />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
