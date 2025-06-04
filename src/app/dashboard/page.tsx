import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Check,
  Sparkles,
  MapPin,
  Globe,
  Zap,
  BarChart3,
  Lock,
  MessageCircle,
  Settings,
  User,
  Heart
} from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import UserActivityChart from '../../components/dashboard/UserActivityChart';
import LoginTypesPieChart from '../../components/dashboard/LoginTypesPieChart';
import RecentUsersTable from '../../components/dashboard/RecentUsersTable';
import RecentGroupsTable from '../../components/dashboard/RecentGroupsTable';
import ActiveEntitiesList from '../../components/dashboard/ActiveEntitiesList';
import LivestreamMetrics from '../../components/dashboard/LivestreamMetrics';
import WalletMetrics from '../../components/dashboard/WalletMetrics';

const Dashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('week');
  const [selectedTab, setSelectedTab] = useState('users');
  const [forexTab, setForexTab] = useState('rates');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [notificationCount, setNotificationCount] = useState(4);
  const [securityScore, setSecurityScore] = useState(86);

  // New state for the advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState('last30');
  const [userSegment, setUserSegment] = useState('all');

  useEffect(() => {
    // Simulate security score changing occasionally
    const timer = setInterval(() => {
      setSecurityScore(prev => Math.min(100, prev + Math.floor(Math.random() * 3) - 1));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 350, damping: 24 }
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

  // New user engagement stats
  const engagementStatsData = [
    {
      title: 'Avg. Session Time',
      value: '8m 24s',
      change: '+1.2m',
      isPositive: true,
      icon: <Clock size={20} className="text-violet-500 dark:text-violet-400" strokeWidth={1.8} />,
      bgColor: 'from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-900/20'
    },
    {
      title: 'Message Sent',
      value: '1.4M',
      change: '+18.5%',
      isPositive: true,
      icon: <MessageCircle size={20} className="text-blue-500 dark:text-blue-400" strokeWidth={1.8} />,
      bgColor: 'from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-900/20'
    },
    {
      title: 'Daily Active Users',
      value: '1,892',
      change: '+4.3%',
      isPositive: true,
      icon: <User size={20} className="text-teal-500 dark:text-teal-400" strokeWidth={1.8} />,
      bgColor: 'from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-900/20'
    },
    {
      title: 'Engagement Rate',
      value: '67.8%',
      change: '+3.2%',
      isPositive: true,
      icon: <Heart size={20} className="text-pink-500 dark:text-pink-400" strokeWidth={1.8} />,
      bgColor: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-900/20'
    }
  ];

  // Forex stats data
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

  // New regional performance data
  const regionalPerformance = [
    { region: 'Kenya', users: 12583, growth: '+14.2%', revenue: '$43,291', color: 'emerald' },
    { region: 'Uganda', users: 5721, growth: '+22.5%', revenue: '$18,490', color: 'violet' },
    { region: 'Tanzania', users: 4892, growth: '+10.3%', revenue: '$15,720', color: 'blue' },
    { region: 'Nigeria', users: 1342, growth: '+45.8%', revenue: '$8,890', color: 'amber' },
    { region: 'Ghana', users: 354, growth: '+28.1%', revenue: '$2,900', color: 'pink' }
  ];

  const handleTimeframeChange = (timeframe: any) => {
    setActiveTimeframe(timeframe);
  };

  const handleTabChange = (tab: any) => {
    setSelectedTab(tab);
  };

  const handleForexTabChange = (tab: any) => {
    setForexTab(tab);
  };

  const handleRegionChange = (region: any) => {
    setSelectedRegion(region);
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

  // AI-generated insights
  const aiInsights = [
    { id: 1, title: 'User Growth Opportunity', message: 'Kenyan user signups spike on weekends. Consider weekend-targeted promotions.', impact: 'High', category: 'growth' },
    { id: 2, title: 'Conversion Rate Drop', message: 'Forex conversions from USD to KES dropped 12% this week. Check for rate competitiveness.', impact: 'Medium', category: 'alert' },
    { id: 3, title: 'Revenue Prediction', message: 'Based on current trends, revenue expected to increase 8.5% next month.', impact: 'Medium', category: 'forecast' }
  ];

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Header with Notifications and User Info */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-[28px] font-bold text-gray-800 dark:text-neutral-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 text-[14px]">Welcome back, see the latest updates</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          {/* Notification Icon with Badge */}
          <div className="relative">
            <motion.button
              className="w-10 h-10 rounded-full bg-white dark:bg-dark-elevated shadow-sm dark:shadow-dark-sm border border-gray-100 dark:border-dark-border flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={18} className="text-gray-600 dark:text-neutral-300" strokeWidth={1.8} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Time Period Selector - iOS 18 Style */}
          <motion.div
            className="flex items-center py-1 px-1.5 bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-full shadow-sm border border-gray-100/60 dark:border-dark-border/60"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => handleTimeframeChange('day')}
              className={`px-4 py-2 text-sm rounded-full transition-all ${activeTimeframe === 'day'
                ? 'bg-primary-500 text-white shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
            >
              Day
            </button>
            <button
              onClick={() => handleTimeframeChange('week')}
              className={`px-4 py-2 text-sm rounded-full transition-all ${activeTimeframe === 'week'
                ? 'bg-primary-500 text-white shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
            >
              Week
            </button>
            <button
              onClick={() => handleTimeframeChange('month')}
              className={`px-4 py-2 text-sm rounded-full transition-all ${activeTimeframe === 'month'
                ? 'bg-primary-500 text-white shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
            >
              Month
            </button>
            <button
              onClick={() => handleTimeframeChange('year')}
              className={`px-4 py-2 text-sm rounded-full transition-all ${activeTimeframe === 'year'
                ? 'bg-primary-500 text-white shadow-sm dark:shadow-dark-sm'
                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
            >
              Year
            </button>
          </motion.div>

          {/* Advanced Filters Button */}
          <motion.button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-all border ${showAdvancedFilters
                ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-700/30 dark:text-primary-400'
                : 'bg-white border-gray-200 text-gray-600 dark:bg-dark-elevated dark:border-dark-border dark:text-neutral-300'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings size={14} />
            Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Advanced Filters Panel - Slides down when active */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100/60 dark:border-dark-border/60 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex flex-wrap gap-6">
                {/* Date Range Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Date Range</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDateRange('last7')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${dateRange === 'last7'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => setDateRange('last30')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${dateRange === 'last30'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Last 30 days
                    </button>
                    <button
                      onClick={() => setDateRange('last90')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${dateRange === 'last90'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Last 90 days
                    </button>
                    <button
                      onClick={() => setDateRange('custom')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${dateRange === 'custom'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {/* User Segment Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">User Segment</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUserSegment('all')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${userSegment === 'all'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      All Users
                    </button>
                    <button
                      onClick={() => setUserSegment('new')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${userSegment === 'new'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      New Users
                    </button>
                    <button
                      onClick={() => setUserSegment('active')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${userSegment === 'active'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Active Users
                    </button>
                    <button
                      onClick={() => setUserSegment('inactive')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${userSegment === 'inactive'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Inactive Users
                    </button>
                  </div>
                </div>

                {/* Region Filter */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Region</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRegionChange('all')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedRegion === 'all'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      All Regions
                    </button>
                    <button
                      onClick={() => handleRegionChange('kenya')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedRegion === 'kenya'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Kenya
                    </button>
                    <button
                      onClick={() => handleRegionChange('uganda')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedRegion === 'uganda'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Uganda
                    </button>
                    <button
                      onClick={() => handleRegionChange('tanzania')}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedRegion === 'tanzania'
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-50 text-gray-600 dark:bg-dark-active/50 dark:text-neutral-400 hover:bg-gray-100'
                        }`}
                    >
                      Tanzania
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Panel - iOS 18 Style */}
      <AnimatePresence>
        {showAIInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-violet-500/90 to-purple-600/90 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
              <div className="p-5 flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <Sparkles size={20} className="text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI-Powered Insights</h3>
                    <p className="text-violet-100 text-sm">Actionable recommendations based on your data</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIInsights(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.map(insight => (
                  <motion.div
                    key={insight.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                    whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg flex-shrink-0 ${insight.category === 'growth' ? 'bg-emerald-500/20' :
                          insight.category === 'alert' ? 'bg-amber-500/20' :
                            'bg-blue-500/20'
                        }`}>
                        {insight.category === 'growth' ? <TrendingUp size={16} className="text-emerald-100" /> :
                          insight.category === 'alert' ? <AlertCircle size={16} className="text-amber-100" /> :
                            <BarChart3 size={16} className="text-blue-100" />}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                        <p className="text-violet-100 text-xs mt-1">{insight.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-violet-100">
                            {insight.impact} Impact
                          </span>
                          <button className="text-xs text-violet-200 hover:text-white transition-colors">
                            Take Action
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Original Stats Cards - Enhanced Design */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
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

      {/* New Engagement Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={itemVariants}
      >
        {engagementStatsData.map((stat, index) => (
          <StatCard
            key={`engagement-${index}`}
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
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
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 lg:col-span-2 overflow-hidden"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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

      {/* NEW: Security Overview Section */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <motion.div
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                <Shield size={20} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Security Overview</h2>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">System health and security status</p>
              </div>
            </div>
            <motion.button
              className="text-sm text-primary-600 dark:text-primary-400 flex items-center bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lock size={14} className="mr-1.5" strokeWidth={1.8} />
              Security Center
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security Score */}
            <div className="flex flex-col bg-gray-50/70 dark:bg-dark-active/50 rounded-xl p-4 border border-gray-100 dark:border-dark-border/70">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">Security Score</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${securityScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    securityScore >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {securityScore >= 80 ? 'Good' : securityScore >= 60 ? 'Fair' : 'Poor'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-200 dark:bg-dark-hover rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full rounded-full ${securityScore >= 80 ? 'bg-green-500' :
                      securityScore >= 60 ? 'bg-amber-500' :
                        'bg-red-500'
                    }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${securityScore}%` }}
                  transition={{ duration: 1, type: 'spring' }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-neutral-200">{securityScore}</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">Last updated 5 mins ago</span>
              </div>

              <div className="mt-3">
                <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  2 recommendations available
                </button>
              </div>
            </div>

            {/* Recent Security Events */}
            <div className="flex flex-col bg-gray-50/70 dark:bg-dark-active/50 rounded-xl p-4 border border-gray-100 dark:border-dark-border/70">
              <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">Recent Security Events</h3>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 mt-0.5">
                    <AlertCircle size={12} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-neutral-200">Login from new device</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">5 minutes ago · iPhone 15 · Nairobi</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 mt-0.5">
                    <Check size={12} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-neutral-200">Password changed</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">2 hours ago · Admin user</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 mt-0.5">
                    <AlertCircle size={12} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-neutral-200">Failed login attempts</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">Yesterday · 3 attempts · Blocked IP</p>
                  </div>
                </div>
              </div>

              <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-3">
                View all events
              </button>
            </div>

            {/* System Health */}
            <div className="flex flex-col bg-gray-50/70 dark:bg-dark-active/50 rounded-xl p-4 border border-gray-100 dark:border-dark-border/70">
              <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">System Health</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-800 dark:text-neutral-200">API Services</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">100% uptime</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-800 dark:text-neutral-200">Database</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">100% uptime</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-800 dark:text-neutral-200">Storage</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">100% uptime</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-800 dark:text-neutral-200">Authentication</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">100% uptime</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-gray-800 dark:text-neutral-200">Payment Gateway</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">99.2% uptime</span>
                </div>
              </div>

              <div className="mt-3 text-center">
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Forex Section - Updated Design */}
      <motion.div
        className="mb-8"
        variants={itemVariants}
      >
        {/* Live Exchange Rate Ticker - New iOS 18 Design */}
        <motion.div
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 mb-6 overflow-hidden"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
                <RefreshCw size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Live Exchange Rates</h3>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Real-time currency exchange rates</p>
              </div>
            </div>
            <motion.button
              className="text-sm text-primary-600 dark:text-primary-400 flex items-center"
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
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50/70 dark:bg-dark-active/50 border border-gray-100/80 dark:border-dark-border/50 hover:bg-gray-100/80 dark:hover:bg-dark-active/70 transition-all duration-200"
                whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)' }}
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
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 overflow-hidden"
            whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 overflow-hidden"
            whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 overflow-hidden"
            whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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

      {/* NEW: Regional Performance */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <motion.div
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                <Globe size={20} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Regional Performance</h2>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">User distribution and market performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {['all', 'kenya', 'uganda', 'tanzania', 'other'].map(region => (
                <motion.button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedRegion === region
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {regionalPerformance.map((region, index) => (
              <motion.div
                key={index}
                className={`bg-gray-50/70 dark:bg-dark-active/50 rounded-xl p-4 border border-gray-100 dark:border-dark-border/70 ${selectedRegion !== 'all' && selectedRegion !== region.region.toLowerCase() ? 'opacity-50' : ''
                  }`}
                whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)' }}
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg bg-${region.color}-100 dark:bg-${region.color}-900/30 mr-2`}>
                    <MapPin size={14} className={`text-${region.color}-500 dark:text-${region.color}-400`} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-neutral-200">{region.region}</h3>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 dark:text-neutral-400">Users</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-neutral-300">{region.users.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 dark:text-neutral-400">Growth</span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">{region.growth}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-neutral-400">Revenue</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-neutral-300">{region.revenue}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 overflow-hidden"
            whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 overflow-hidden"
            whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 overflow-hidden"
            whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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
            className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 overflow-hidden"
            whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
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
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <Activity size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Livestream Metrics</h2>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Performance and engagement analytics</p>
              </div>
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
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-md rounded-2xl shadow-sm dark:shadow-dark-sm border border-gray-100/60 dark:border-dark-border/60 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center mr-3">
                <Wallet size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Wallet Analytics</h2>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">Transaction and balance insights</p>
              </div>
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

      {/* Upcoming Features Teaser */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <motion.div
          className="bg-gradient-to-r from-blue-500/90 to-primary-600/90 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm p-5"
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                <Zap size={24} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Coming Soon: Predictive Analytics</h3>
                <p className="text-blue-100 text-sm max-w-md">Get ahead with AI-powered forecasting and predictive insights for your business metrics</p>
              </div>
            </div>
            <motion.button
              className="px-5 py-2.5 bg-white text-primary-600 rounded-xl font-medium text-sm shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              Join Waitlist
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;