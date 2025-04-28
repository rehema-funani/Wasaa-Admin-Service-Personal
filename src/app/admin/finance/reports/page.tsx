import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Wallet,
  ArrowRight,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  FileText,
  Mail,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const page = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(4); // April
  const [selectedQuarter, setSelectedQuarter] = useState(2); // Q2
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [paymentDistribution, setPaymentDistribution] = useState<any[]>([]);

  // Statistics Cards Data
  const statsData = [
    {
      title: 'Total Revenue',
      value: '$132,456.89',
      change: '+12.5%',
      trend: 'up',
      period: 'vs. last month',
      icon: <DollarSign size={24} />,
      color: 'blue'
    },
    {
      title: 'Total Transactions',
      value: '8,745',
      change: '+8.2%',
      trend: 'up',
      period: 'vs. last month',
      icon: <CreditCard size={24} />,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '3,251',
      change: '+15.7%',
      trend: 'up',
      period: 'vs. last month',
      icon: <Users size={24} />,
      color: 'purple'
    },
    {
      title: 'Average Transaction',
      value: '$42.35',
      change: '-3.2%',
      trend: 'down',
      period: 'vs. last month',
      icon: <Wallet size={24} />,
      color: 'orange'
    }
  ];

  // Monthly Revenue Data
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 76500, expenses: 52000, profit: 24500 },
    { name: 'Feb', revenue: 82300, expenses: 55000, profit: 27300 },
    { name: 'Mar', revenue: 91500, expenses: 59000, profit: 32500 },
    { name: 'Apr', revenue: 132456, expenses: 73000, profit: 59456 },
    { name: 'May', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Jun', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Jul', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Aug', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Sep', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Oct', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Nov', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Dec', revenue: 0, expenses: 0, profit: 0 }
  ];

  // Quarterly Revenue Data
  const quarterlyRevenueData = [
    { name: 'Q1', revenue: 250300, expenses: 166000, profit: 84300 },
    { name: 'Q2', revenue: 132456, expenses: 73000, profit: 59456 },
    { name: 'Q3', revenue: 0, expenses: 0, profit: 0 },
    { name: 'Q4', revenue: 0, expenses: 0, profit: 0 }
  ];

  // Weekly Revenue Data for current month
  const weeklyRevenueData = [
    { name: 'Week 1', revenue: 32500, expenses: 18000, profit: 14500 },
    { name: 'Week 2', revenue: 28900, expenses: 16000, profit: 12900 },
    { name: 'Week 3', revenue: 35700, expenses: 19500, profit: 16200 },
    { name: 'Week 4', revenue: 35356, expenses: 19500, profit: 15856 }
  ];

  // User Growth Data
  const userGrowthData = [
    { name: 'Jan', total: 2100, new: 350, active: 1900 },
    { name: 'Feb', total: 2300, new: 200, active: 2050 },
    { name: 'Mar', total: 2800, new: 500, active: 2450 },
    { name: 'Apr', total: 3251, new: 451, active: 2800 }
  ];

  // Payment Method Distribution
  const paymentMethodData = [
    { name: 'Credit Card', value: 65 },
    { name: 'Bank Transfer', value: 15 },
    { name: 'PayPal', value: 10 },
    { name: 'Digital Wallets', value: 8 },
    { name: 'Other', value: 2 }
  ];

  // Transaction data by type
  const transactionTypeData = [
    { name: 'Top-ups', count: 3240, amount: 245000 },
    { name: 'Transfers', count: 4560, amount: 368000 },
    { name: 'Withdrawals', count: 945, amount: 152000 }
  ];

  // Daily transactions for current month
  const dailyTransactionsData = [
    { name: '04/01', count: 120, amount: 5200 },
    { name: '04/02', count: 145, amount: 6100 },
    { name: '04/03', count: 132, amount: 5500 },
    { name: '04/04', count: 121, amount: 4900 },
    { name: '04/05', count: 110, amount: 4600 },
    { name: '04/06', count: 95, amount: 4000 },
    { name: '04/07', count: 130, amount: 5300 },
    { name: '04/08', count: 140, amount: 5800 },
    { name: '04/09', count: 150, amount: 6200 },
    { name: '04/10', count: 165, amount: 6800 },
    { name: '04/11', count: 155, amount: 6400 },
    { name: '04/12', count: 130, amount: 5400 },
    { name: '04/13', count: 120, amount: 5000 },
    { name: '04/14', count: 138, amount: 5700 },
    { name: '04/15', count: 145, amount: 6000 },
    { name: '04/16', count: 160, amount: 6600 },
    { name: '04/17', count: 155, amount: 6400 },
    { name: '04/18', count: 140, amount: 5800 },
    { name: '04/19', count: 125, amount: 5200 },
    { name: '04/20', count: 115, amount: 4800 },
    { name: '04/21', count: 130, amount: 5400 },
    { name: '04/22', count: 142, amount: 5900 },
    { name: '04/23', count: 155, amount: 6400 },
    { name: '04/24', count: 165, amount: 6900 },
    { name: '04/25', count: 170, amount: 7100 },
    { name: '04/26', count: 168, amount: 7000 },
    { name: '04/27', count: 160, amount: 6600 },
    { name: '04/28', count: 155, amount: 6400 },
    { name: '04/29', count: 0, amount: 0 },
    { name: '04/30', count: 0, amount: 0 }
  ];

  // Top 5 Revenue Sources
  const topRevenueSourcesData = [
    { name: 'Transaction Fees', value: 45 },
    { name: 'Subscription Fees', value: 25 },
    { name: 'Currency Exchange', value: 15 },
    { name: 'Premium Features', value: 10 },
    { name: 'API Access', value: 5 }
  ];

  // Geographic distribution
  const geographicData = [
    { name: 'North America', value: 40 },
    { name: 'Europe', value: 30 },
    { name: 'Asia', value: 20 },
    { name: 'Other Regions', value: 10 }
  ];

  // Financial KPI table data
  const kpiTableData = [
    { metric: 'Monthly Recurring Revenue (MRR)', value: '$98,750', change: '+12.4%' },
    { metric: 'Average Revenue Per User (ARPU)', value: '$42.35', change: '-3.2%' },
    { metric: 'Customer Acquisition Cost (CAC)', value: '$24.18', change: '-8.5%' },
    { metric: 'Lifetime Value (LTV)', value: '$1,235', change: '+15.3%' },
    { metric: 'Churn Rate', value: '3.2%', change: '-0.8%' },
    { metric: 'Gross Margin', value: '72%', change: '+2.1%' },
    { metric: 'Revenue Growth Rate', value: '18.5%', change: '+2.7%' },
    { metric: 'Payment Processing Costs', value: '$18,420', change: '+9.2%' }
  ];

  // Colors
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Select data based on period
      if (selectedPeriod === 'monthly') {
        setRevenueData(monthlyRevenueData);
        setUsersData(userGrowthData);
        setTransactionsData(dailyTransactionsData);
      } else if (selectedPeriod === 'quarterly') {
        setRevenueData(quarterlyRevenueData);
        setUsersData(userGrowthData);
        setTransactionsData(transactionTypeData);
      } else if (selectedPeriod === 'weekly') {
        setRevenueData(weeklyRevenueData);
        setUsersData(userGrowthData);
        setTransactionsData(dailyTransactionsData.slice(0, 7));
      }

      setPaymentDistribution(paymentMethodData);
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedYear, selectedMonth, selectedQuarter]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Financial Reports</h1>
          <p className="text-gray-500 mt-1">Track revenue, transactions, and financial metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex items-center shadow-sm">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedPeriod === 'weekly'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => handlePeriodChange('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedPeriod === 'monthly'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => handlePeriodChange('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedPeriod === 'quarterly'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => handlePeriodChange('quarterly')}
            >
              Quarterly
            </button>
          </div>
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Calendar size={16} className="mr-2" strokeWidth={1.8} />
            {selectedPeriod === 'monthly' && `April ${selectedYear}`}
            {selectedPeriod === 'quarterly' && `Q${selectedQuarter} ${selectedYear}`}
            {selectedPeriod === 'weekly' && `April Week 4, ${selectedYear}`}
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Filter size={16} className="mr-2" strokeWidth={1.8} />
            Filters
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">{stat.period}</span>
                </div>
              </div>
              <div className={`
                p-3 rounded-lg 
                ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                    stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'}
              `}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 lg:col-span-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
              <p className="text-gray-500 text-sm">Revenue, expenses, and profit trends</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-1"></div>
                <span className="text-xs text-gray-600">Expenses</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-600">Profit</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Payment Methods Distribution */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>
            <p className="text-gray-500 text-sm">Distribution by payment type</p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={paymentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* User Growth and Transaction Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">User Growth</h3>
              <p className="text-gray-500 text-sm">Total, new and active users</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-600">Total</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-600">Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                <span className="text-xs text-gray-600">New</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={usersData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="total" stackId="1" stroke="#3b82f6" fill="#93c5fd" />
                  <Area type="monotone" dataKey="active" stackId="2" stroke="#10b981" fill="#6ee7b7" />
                  <Area type="monotone" dataKey="new" stackId="3" stroke="#8b5cf6" fill="#c4b5fd" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Transaction Trends */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Transaction Trends</h3>
              <p className="text-gray-500 text-sm">Daily transaction volume and amount</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
                <span className="text-xs text-gray-600">Count</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-600">Amount</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={transactionsData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    activeDot={{ r: 8 }}
                    name="Transaction Count"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    name="Transaction Amount"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Sources */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Sources</h3>
            <p className="text-gray-500 text-sm">Breakdown by source</p>
          </div>
          <div className="h-60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={topRevenueSourcesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {topRevenueSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Geographic Distribution</h3>
            <p className="text-gray-500 text-sm">Revenue by region</p>
          </div>
          <div className="h-60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={geographicData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={(value) => `${value}%`} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                    {geographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Financial KPIs Summary */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Financial KPIs</h3>
            <p className="text-gray-500 text-sm">Key performance indicators</p>
          </div>
          <div className="h-60 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {kpiTableData.map((kpi, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm font-medium text-gray-800">{kpi.metric}</td>
                      <td className="py-2 text-sm text-gray-800 text-right">{kpi.value}</td>
                      <td className={`py-2 text-sm text-right font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {kpi.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Report Generation */}
      <motion.div
        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Generate Reports</h3>
            <p className="text-gray-500 text-sm">Create customized financial reports</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm shadow-sm"
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ y: 0 }}
            >
              <FileText size={16} className="mr-2 text-gray-600" strokeWidth={1.8} />
              PDF Report
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm shadow-sm"
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ y: 0 }}
            >
              <FileText size={16} className="mr-2 text-green-600" strokeWidth={1.8} />
              Excel Export
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm shadow-sm"
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ y: 0 }}
            >
              <Mail size={16} className="mr-2 text-blue-600" strokeWidth={1.8} />
              Email Report
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm shadow-sm"
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ y: 0 }}
            >
              <Printer size={16} className="mr-2 text-gray-600" strokeWidth={1.8} />
              Print Report
            </motion.button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
              <option>Revenue Report</option>
              <option>Transaction Report</option>
              <option>User Activity Report</option>
              <option>Financial Performance</option>
              <option>Custom Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
              <option>Current Month</option>
              <option>Previous Month</option>
              <option>Current Quarter</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comparison</label>
            <select className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
              <option>Previous Period</option>
              <option>Same Period Last Year</option>
              <option>Year Over Year</option>
              <option>No Comparison</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
              <option>Detailed Report</option>
              <option>Summary Report</option>
              <option>Charts & Graphs</option>
              <option>Data Table Only</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <motion.button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0 }}
          >
            Generate Report
            <ArrowRight size={16} className="ml-2" strokeWidth={1.8} />
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Reports */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.0 }}
      >
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
          <div className="mr-4 p-3 bg-blue-100 text-blue-600 rounded-lg">
            <BarChart3 size={24} strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Revenue Report</h4>
            <p className="text-gray-500 text-sm">Detailed revenue breakdown</p>
          </div>
          <div className="ml-auto">
            <motion.button
              className="text-blue-600 hover:text-blue-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={20} strokeWidth={1.8} />
            </motion.button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
          <div className="mr-4 p-3 bg-purple-100 text-purple-600 rounded-lg">
            <PieChart size={24} strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Transaction Analysis</h4>
            <p className="text-gray-500 text-sm">Transaction patterns and trends</p>
          </div>
          <div className="ml-auto">
            <motion.button
              className="text-purple-600 hover:text-purple-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={20} strokeWidth={1.8} />
            </motion.button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
          <div className="mr-4 p-3 bg-green-100 text-green-600 rounded-lg">
            <LineChartIcon size={24} strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Growth Metrics</h4>
            <p className="text-gray-500 text-sm">User and revenue growth trends</p>
          </div>
          <div className="ml-auto">
            <motion.button
              className="text-green-600 hover:text-green-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={20} strokeWidth={1.8} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default page;