import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Percent,
  RefreshCw,
  Radio,
  ArrowUp,
  ArrowDown,
  Shield,
  AlertCircle,
  Check
} from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import UserActivityChart from '../../components/dashboard/UserActivityChart';
import LoginTypesPieChart from '../../components/dashboard/LoginTypesPieChart';
import RecentUsersTable from '../../components/dashboard/RecentUsersTable';
import RecentGroupsTable from '../../components/dashboard/RecentGroupsTable';
import ActiveEntitiesList from '../../components/dashboard/ActiveEntitiesList';
import LivestreamMetrics from '../../components/dashboard/LivestreamMetrics';
import WalletMetrics from '../../components/dashboard/WalletMetrics';
// import ExchangeRateTicker from '../../components/dashboard/forex/ExchangeRateTicker';
// import AlertStatusChart from '../../components/dashboard/forex/AlertStatusChart';
// import SystemHealthStatus from '../../components/dashboard/forex/SystemHealthStatus';
// import RecentConversionsTable from '../../components/dashboard/forex/RecentConversionsTable';

const Dashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('week');
  const [selectedTab, setSelectedTab] = useState('users');
  const [forexTab, setForexTab] = useState('rates');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Original stats data
  const statsData = [
    {
      title: 'Total Users',
      value: '24,892',
      change: '+12.5%',
      isPositive: true,
      icon: <Users size={20} className="text-primary-500 dark:text-primary-400" strokeWidth={1.8} />,
      bgColor: 'from-primary-50 to-primary-50 dark:from-primary-950/30 dark:to-primary-900/20'
    },
    {
      title: 'Active Users',
      value: '3,745',
      change: '+8.2%',
      isPositive: true,
      icon: <UserCheck size={20} className="text-green-500 dark:text-green-400" strokeWidth={1.8} />,
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/20'
    },
    {
      title: 'Transaction Volume',
      value: '$934,128',
      change: '+23.1%',
      isPositive: true,
      icon: <TrendingUp size={20} className="text-primary-500 dark:text-primary-400" strokeWidth={1.8} />,
      bgColor: 'from-primary-50 to-cyan-50 dark:from-primary-950/30 dark:to-cyan-900/20'
    },
    {
      title: 'Revenue',
      value: '$87,291',
      change: '-2.4%',
      isPositive: false,
      icon: <DollarSign size={20} className="text-amber-500 dark:text-amber-400" strokeWidth={1.8} />,
      bgColor: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-900/20'
    }
  ];

  // New Forex stats data
  const forexStatsData = [
    {
      title: 'Forex Conversions',
      value: '1,487',
      change: '+15.3%',
      isPositive: true,
      icon: <RefreshCw size={20} className="text-cyan-500 dark:text-cyan-400" strokeWidth={1.8} />,
      bgColor: 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-900/20'
    },
    {
      title: 'Active Alerts',
      value: '258',
      change: '+5.7%',
      isPositive: true,
      icon: <Bell size={20} className="text-violet-500 dark:text-violet-400" strokeWidth={1.8} />,
      bgColor: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-900/20'
    },
    {
      title: 'Current Spread',
      value: '1.85%',
      change: '-0.2%',
      isPositive: true,
      icon: <Percent size={20} className="text-indigo-500 dark:text-indigo-400" strokeWidth={1.8} />,
      bgColor: 'from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/20'
    },
    {
      title: 'Rate Sources',
      value: '4/4',
      change: 'All Active',
      isPositive: true,
      icon: <Radio size={20} className="text-emerald-500 dark:text-emerald-400" strokeWidth={1.8} />,
      bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-900/20'
    }
  ];

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
  };

  const handleTabChange = (tab: any) => {
    setSelectedTab(tab);
  };

  const handleForexTabChange = (tab: any) => {
    setForexTab(tab);
  };

  // Sample exchange rate data
  const exchangeRates = [
    { pair: 'USD/KES', rate: '130.45', change: '+0.3%', isUp: true, source: 'Fixer.io' },
    { pair: 'EUR/KES', rate: '142.18', change: '-0.2%', isUp: false, source: 'OpenExchangeRates' },
    { pair: 'GBP/KES', rate: '168.92', change: '+0.5%', isUp: true, source: 'Fixer.io' },
    { pair: 'JPY/KES', rate: '0.8734', change: '+0.1%', isUp: true, source: 'Central Bank' },
    { pair: 'USD/UGX', rate: '3710.25', change: '-0.4%', isUp: false, source: 'OpenExchangeRates' },
    { pair: 'USD/TZS', rate: '2513.75', change: '+0.2%', isUp: true, source: 'Central Bank' }
  ];

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-[24px] font-semibold text-gray-800 dark:text-neutral-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 text-[13px]">Welcome back, see the latest updates</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <motion.div
            className="flex items-center py-1 px-1.5 bg-gray-100/80 dark:bg-dark-elevated backdrop-blur-sm rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => handleTimeframeChange('day')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'day'
                ? 'bg-white dark:bg-dark-active text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
            >
              Day
            </button>
            <button
              onClick={() => handleTimeframeChange('week')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'week'
                ? 'bg-white dark:bg-dark-active text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
            >
              Week
            </button>
            <button
              onClick={() => handleTimeframeChange('month')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'month'
                ? 'bg-white dark:bg-dark-active text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
            >
              Month
            </button>
            <button
              onClick={() => handleTimeframeChange('year')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'year'
                ? 'bg-white dark:bg-dark-active text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
            >
              Year
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Original Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        variants={itemVariants}
      >
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </motion.div>

      {/* Forex Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        variants={itemVariants}
      >
        {forexStatsData.map((stat, index) => (
          <StatCard
            key={`forex-${index}`}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </motion.div>

      {/* Main Chart Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        variants={itemVariants}
      >
        {/* User Activity Chart - Takes up 2/3 of the space */}
        <motion.div
          className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border p-5 lg:col-span-2 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">User Activity</h2>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => handleTabChange('users')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedTab === 'users'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Users
              </motion.button>
              <motion.button
                onClick={() => handleTabChange('groups')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedTab === 'groups'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Groups
              </motion.button>
              <motion.button
                onClick={() => handleTabChange('transactions')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedTab === 'transactions'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Transactions
              </motion.button>
            </div>
          </div>
          <UserActivityChart timeframe={activeTimeframe} dataType={selectedTab} />
        </motion.div>

        {/* Login Types Pie Chart */}
        <motion.div
          className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 mb-4">Login Devices</h2>
          <LoginTypesPieChart />

          <div className="mt-4 grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 dark:bg-dark-active/50">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 mr-3">
                  <Smartphone size={16} className="text-primary-500 dark:text-primary-400" strokeWidth={1.8} />
                </div>
                <span className="text-sm text-gray-700 dark:text-neutral-300">Mobile</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">68%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 dark:bg-dark-active/50">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 mr-3">
                  <Laptop size={16} className="text-primary-500 dark:text-primary-400" strokeWidth={1.8} />
                </div>
                <span className="text-sm text-gray-700 dark:text-neutral-300">Desktop</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">26%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 dark:bg-dark-active/50">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30 mr-3">
                  <Tablet size={16} className="text-violet-500 dark:text-violet-400" strokeWidth={1.8} />
                </div>
                <span className="text-sm text-gray-700 dark:text-neutral-300">Tablet</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">6%</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Forex Section */}
      <motion.div
        className="mb-8"
        variants={itemVariants}
      >

        {/* Live Exchange Rate Ticker */}
        <motion.div
          className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border p-5 mb-6 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Live Exchange Rates</h3>
            <motion.button
              className="text-xs text-primary-600 dark:text-primary-400 flex items-center"
              whileHover={{ x: 3 }}
            >
              View all rates <ChevronRight size={14} />
            </motion.button>
          </div>

          {/* Custom Exchange Rate Ticker Component */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {exchangeRates.map((rate, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 dark:bg-dark-active/50 border border-gray-100/80 dark:border-dark-border/50 hover:bg-gray-100/80 dark:hover:bg-dark-active/70 transition-all duration-200"
                whileHover={{ y: -3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 mr-3">
                    <RefreshCw size={14} className="text-cyan-500 dark:text-cyan-400" strokeWidth={1.8} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">{rate.pair}</span>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">{rate.source}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800 dark:text-neutral-200">{rate.rate}</div>
                  <div className={`text-xs flex items-center justify-end ${rate.isUp ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {rate.isUp ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                    {rate.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Forex Charts & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Alert Status Chart */}
          <motion.div
            className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border p-5 overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 mr-2">
                  <Bell size={14} className="text-violet-500 dark:text-violet-400" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-neutral-200">Alert Status</h3>
              </div>
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={() => handleForexTabChange('day')}
                  className={`px-2 py-1 text-xs rounded-lg transition-all ${forexTab === 'day'
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  24h
                </motion.button>
                <motion.button
                  onClick={() => handleForexTabChange('week')}
                  className={`px-2 py-1 text-xs rounded-lg transition-all ${forexTab === 'week'
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  7d
                </motion.button>
              </div>
            </div>

            {/* Alert Status Chart Component Would Go Here */}
            <div className="mb-3 flex justify-center">
              {/* Placeholder for chart */}
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-dark-active/50 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-8 border-violet-500/20 dark:border-violet-500/10"></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-violet-500 border-r-violet-500 rotate-45"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-neutral-200">63%</div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400">Triggered</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/70 dark:bg-dark-active/50">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 mr-2">
                    <Check size={12} className="text-green-500 dark:text-green-400" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-neutral-300">Triggered</span>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-neutral-300">162</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/70 dark:bg-dark-active/50">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 mr-2">
                    <Clock size={12} className="text-amber-500 dark:text-amber-400" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-neutral-300">Pending</span>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-neutral-300">96</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/70 dark:bg-dark-active/50">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30 mr-2">
                    <AlertCircle size={12} className="text-red-500 dark:text-red-400" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-gray-700 dark:text-neutral-300">Expired</span>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-neutral-300">45</span>
              </div>
            </div>
          </motion.div>

          {/* System Health & Last Sync Status */}
          <motion.div
            className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border p-5 overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 mr-2">
                  <Shield size={14} className="text-emerald-500 dark:text-emerald-400" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-neutral-200">System Health</h3>
              </div>
              <div className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                All Systems Online
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-gray-50/70 dark:bg-dark-active/50 border border-gray-100/80 dark:border-dark-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">Last Rate Sync</span>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1"></div>
                    <span className="text-xs">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">2 minutes ago</span>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">28ms</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50/70 dark:bg-dark-active/50 border border-gray-100/80 dark:border-dark-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">Alert Evaluator</span>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1"></div>
                    <span className="text-xs">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">5 minutes ago</span>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">357ms</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50/70 dark:bg-dark-active/50 border border-gray-100/80 dark:border-dark-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">WebSocket/API</span>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1"></div>
                    <span className="text-xs">Connected</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">Real-time</span>
                  <motion.button
                    className="text-xs text-primary-600 dark:text-primary-400 flex items-center"
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
            className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50 dark:border-dark-border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 mr-2">
                    <RefreshCw size={14} className="text-cyan-500 dark:text-cyan-400" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-neutral-200">Recent Conversions</h3>
                </div>
                <motion.button
                  className="text-xs text-primary-600 dark:text-primary-400 flex items-center"
                  whileHover={{ x: 3 }}
                >
                  View all <ChevronRight size={14} />
                </motion.button>
              </div>
            </div>

            {/* Recent Conversions Table */}
            <div className="p-3">
              {/* Conversion 1 */}
              <div className="p-3 rounded-xl hover:bg-gray-50/70 dark:hover:bg-dark-active/50 transition-colors mb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw size={14} className="text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">USD → KES</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">User #3829</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">$500 → KSh 65,225</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">3 mins ago</div>
                  </div>
                </div>
              </div>

              {/* Conversion 2 */}
              <div className="p-3 rounded-xl hover:bg-gray-50/70 dark:hover:bg-dark-active/50 transition-colors mb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw size={14} className="text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">EUR → KES</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">User #2771</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">€200 → KSh 28,436</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">12 mins ago</div>
                  </div>
                </div>
              </div>

              {/* Conversion 3 */}
              <div className="p-3 rounded-xl hover:bg-gray-50/70 dark:hover:bg-dark-active/50 transition-colors mb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw size={14} className="text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">GBP → KES</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">User #4526</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">£750 → KSh 126,690</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">23 mins ago</div>
                  </div>
                </div>
              </div>

              {/* Conversion 4 */}
              <div className="p-3 rounded-xl hover:bg-gray-50/70 dark:hover:bg-dark-active/50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                      <RefreshCw size={14} className="text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">USD → UGX</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">User #1845</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800 dark:text-neutral-200">$300 → UGX 1,113,075</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">45 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Activity and Live Data Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        variants={itemVariants}
      >
        {/* Recent Activity & Active Users/Groups Split Panel */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Users */}
          <motion.div
            className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50 dark:border-dark-border">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Recent Users</h2>
                <motion.button
                  className="text-xs text-primary-600 dark:text-primary-400 flex items-center"
                  whileHover={{ x: 3 }}
                >
                  View all <ChevronRight size={14} />
                </motion.button>
              </div>
            </div>
            <RecentUsersTable />
          </motion.div>

          {/* Recent Groups */}
          <motion.div
            className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50 dark:border-dark-border">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Recent Groups</h2>
                <motion.button
                  className="text-xs text-primary-600 dark:text-primary-400 flex items-center"
                  whileHover={{ x: 3 }}
                >
                  View all <ChevronRight size={14} />
                </motion.button>
              </div>
            </div>
            <RecentGroupsTable />
          </motion.div>
        </motion.div>

        {/* Active Users & Groups Split Panel */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50 dark:border-dark-border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Active Users</h2>
                  <div className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full text-xs text-green-700 dark:text-green-400 flex items-center">
                    <Clock size={10} className="mr-1" /> 30m
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-active py-1 px-2 rounded-lg text-sm text-gray-800 dark:text-neutral-200 font-medium">
                  328
                </div>
              </div>
            </div>
            <ActiveEntitiesList type="users" />
          </motion.div>

          {/* Active Groups */}
          <motion.div
            className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50 dark:border-dark-border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Active Groups</h2>
                  <div className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full text-xs text-green-700 dark:text-green-400 flex items-center">
                    <Clock size={10} className="mr-1" /> 30m
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-active py-1 px-2 rounded-lg text-sm text-gray-800 dark:text-neutral-200 font-medium">
                  42
                </div>
              </div>
            </div>
            <ActiveEntitiesList type="groups" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Livestream & Wallet Metrics */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Livestream Metrics */}
        <motion.div
          className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <Activity size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Livestream Metrics</h2>
            </div>
            <motion.button
              className="text-xs text-primary-600 dark:text-primary-400 flex items-center"
              whileHover={{ x: 3 }}
            >
              View details <ChevronRight size={14} />
            </motion.button>
          </div>
          <LivestreamMetrics />
        </motion.div>

        {/* Wallet Analytics */}
        <motion.div
          className="bg-white dark:bg-dark-elevated rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center mr-3">
                <Wallet size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Wallet Analytics</h2>
            </div>
            <motion.button
              className="text-xs text-primary-600 dark:text-primary-400 flex items-center"
              whileHover={{ x: 3 }}
            >
              View details <ChevronRight size={14} />
            </motion.button>
          </div>
          <WalletMetrics />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;