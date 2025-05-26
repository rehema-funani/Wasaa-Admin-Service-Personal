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
  Wallet
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

  const statsData = [
    {
      title: 'Total Users',
      value: '24,892',
      change: '+12.5%',
      isPositive: true,
      icon: <Users size={20} className="text-primary-500" strokeWidth={1.8} />,
      bgColor: 'from-primary-50 to-primary-50'
    },
    {
      title: 'Active Users',
      value: '3,745',
      change: '+8.2%',
      isPositive: true,
      icon: <UserCheck size={20} className="text-green-500" strokeWidth={1.8} />,
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Transaction Volume',
      value: '$934,128',
      change: '+23.1%',
      isPositive: true,
      icon: <TrendingUp size={20} className="text-primary-500" strokeWidth={1.8} />,
      bgColor: 'from-primary-50 to-cyan-50'
    },
    {
      title: 'Revenue',
      value: '$87,291',
      change: '-2.4%',
      isPositive: false,
      icon: <DollarSign size={20} className="text-amber-500" strokeWidth={1.8} />,
      bgColor: 'from-amber-50 to-yellow-50'
    }
  ];

  const handleTimeframeChange = (timeframe: any) => {
    setActiveTimeframe(timeframe);
  };

  const handleTabChange = (tab: any) => {
    setSelectedTab(tab);
  };

  return (
    <motion.div
      className="p-6 max-w-[1600px] mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Dashboard Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-[24px] font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-[13px]">Welcome back, see the latest updates</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <motion.div
            className="flex items-center py-1 px-1.5 bg-gray-100/80 backdrop-blur-sm rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => handleTimeframeChange('day')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'day'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              Day
            </button>
            <button
              onClick={() => handleTimeframeChange('week')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'week'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              Week
            </button>
            <button
              onClick={() => handleTimeframeChange('month')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'month'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              Month
            </button>
            <button
              onClick={() => handleTimeframeChange('year')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${activeTimeframe === 'year'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              Year
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
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

      {/* Main Chart Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        variants={itemVariants}
      >
        {/* User Activity Chart - Takes up 2/3 of the space */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:col-span-2 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">User Activity</h2>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => handleTabChange('users')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedTab === 'users'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Users
              </motion.button>
              <motion.button
                onClick={() => handleTabChange('groups')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedTab === 'groups'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Groups
              </motion.button>
              <motion.button
                onClick={() => handleTabChange('transactions')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${selectedTab === 'transactions'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
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
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Login Devices</h2>
          <LoginTypesPieChart />

          <div className="mt-4 grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-primary-50 mr-3">
                  <Smartphone size={16} className="text-primary-500" strokeWidth={1.8} />
                </div>
                <span className="text-sm text-gray-700">Mobile</span>
              </div>
              <span className="text-sm font-medium text-gray-700">68%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-primary-50 mr-3">
                  <Laptop size={16} className="text-primary-500" strokeWidth={1.8} />
                </div>
                <span className="text-sm text-gray-700">Desktop</span>
              </div>
              <span className="text-sm font-medium text-gray-700">26%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-violet-50 mr-3">
                  <Tablet size={16} className="text-violet-500" strokeWidth={1.8} />
                </div>
                <span className="text-sm text-gray-700">Tablet</span>
              </div>
              <span className="text-sm font-medium text-gray-700">6%</span>
            </div>
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
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
                <motion.button
                  className="text-xs text-primary-600 flex items-center"
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
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Groups</h2>
                <motion.button
                  className="text-xs text-primary-600 flex items-center"
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
          {/* Active Users */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Active Users</h2>
                  <div className="ml-2 px-2 py-0.5 bg-green-100 rounded-full text-xs text-green-700 flex items-center">
                    <Clock size={10} className="mr-1" /> 30m
                  </div>
                </div>
                <div className="bg-gray-50 py-1 px-2 rounded-lg text-sm text-gray-800 font-medium">
                  328
                </div>
              </div>
            </div>
            <ActiveEntitiesList type="users" />
          </motion.div>

          {/* Active Groups */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="p-5 border-b border-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Active Groups</h2>
                  <div className="ml-2 px-2 py-0.5 bg-green-100 rounded-full text-xs text-green-700 flex items-center">
                    <Clock size={10} className="mr-1" /> 30m
                  </div>
                </div>
                <div className="bg-gray-50 py-1 px-2 rounded-lg text-sm text-gray-800 font-medium">
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
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <Activity size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Livestream Metrics</h2>
            </div>
            <motion.button
              className="text-xs text-primary-600 flex items-center"
              whileHover={{ x: 3 }}
            >
              View details <ChevronRight size={14} />
            </motion.button>
          </div>
          <LivestreamMetrics />
        </motion.div>

        {/* Wallet Analytics */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden"
          whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center mr-3">
                <Wallet size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Wallet Analytics</h2>
            </div>
            <motion.button
              className="text-xs text-primary-600 flex items-center"
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