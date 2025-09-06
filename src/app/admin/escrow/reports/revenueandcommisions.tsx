import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Globe,
  DollarSign,
  Target,
  RefreshCw,
  MoreVertical,
  Maximize2,
  Zap,
  ArrowUpRight,
  Award,
  Banknote,
  TrendingDown as TrendDown,
  Crown,
  Star,
  Coins,
  Receipt,
  PiggyBank,
  Briefcase
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  Area,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Pie,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

const RevenueCommissionsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("quarterly");
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState("gross_revenue");
  const [refreshing, setRefreshing] = useState(false);

  const revenueMetrics = {
    grossRevenue: 45678900,
    netRevenue: 38234567,
    totalCommissions: 7444333,
    operatingExpenses: 12456789,
    netProfit: 25777778,
    ebitda: 28234567,
    growth: {
      grossRevenue: 23.4,
      netRevenue: 18.7,
      commissions: 31.2,
      profit: 15.3,
      ebitda: 19.8,
    },
    margins: {
      gross: 83.7,
      net: 56.4,
      commission: 16.3,
      operating: 27.3,
    },
  };

  // Revenue streams breakdown
  const revenueStreams = [
    {
      name: "Transaction Fees",
      amount: 18945600,
      percentage: 41.5,
      growth: 24.3,
      color: "#3B82F6",
      subCategories: [
        { name: "Basic Transactions", amount: 11234500, rate: "1.2%" },
        { name: "Express Transactions", amount: 4567800, rate: "2.5%" },
        { name: "Premium Services", amount: 3143300, rate: "3.8%" },
      ],
    },
    {
      name: "Escrow Commissions",
      amount: 12567800,
      percentage: 27.5,
      growth: 19.7,
      color: "#10B981",
      subCategories: [
        { name: "Standard Escrow", amount: 8234500, rate: "2.0%" },
        { name: "High-Value Escrow", amount: 2876500, rate: "1.5%" },
        { name: "Multi-Party Escrow", amount: 1456800, rate: "3.5%" },
      ],
    }
  ];

  const commissionTiers = [];

  const revenueTimeSeriesData = [
    {
      month: "Jan",
      gross: 3234567,
      net: 2567890,
      commissions: 456789,
      expenses: 987654,
      profit: 1580236,
    },
    {
      month: "Feb",
      gross: 3567890,
      net: 2890123,
      commissions: 567890,
      expenses: 1023456,
      profit: 1866667,
    },
    {
      month: "Mar",
      gross: 3890123,
      net: 3123456,
      commissions: 678901,
      expenses: 1098765,
      profit: 2024691,
    },
    {
      month: "Apr",
      gross: 4123456,
      net: 3345678,
      commissions: 789012,
      expenses: 1134567,
      profit: 2211111,
    },
    {
      month: "May",
      gross: 4345678,
      net: 3567890,
      commissions: 890123,
      expenses: 1176543,
      profit: 2391347,
    },
    {
      month: "Jun",
      gross: 4567890,
      net: 3789012,
      commissions: 987654,
      expenses: 1234567,
      profit: 2554445,
    },
    {
      month: "Jul",
      gross: 4234567,
      net: 3456789,
      commissions: 876543,
      expenses: 1198765,
      profit: 2258024,
    },
    {
      month: "Aug",
      gross: 4456789,
      net: 3678901,
      commissions: 934567,
      expenses: 1245678,
      profit: 2433223,
    },
    {
      month: "Sep",
      gross: 4678901,
      net: 3890123,
      commissions: 998765,
      expenses: 1287654,
      profit: 2602469,
    },
    {
      month: "Oct",
      gross: 4890123,
      net: 4098765,
      commissions: 1045678,
      expenses: 1334567,
      profit: 2764198,
    },
    {
      month: "Nov",
      gross: 5012345,
      net: 4234567,
      commissions: 1134567,
      expenses: 1387654,
      profit: 2846913,
    },
    {
      month: "Dec",
      gross: 5234567,
      net: 4456789,
      commissions: 1234567,
      expenses: 1445678,
      profit: 3011111,
    },
  ];

  const geographicRevenue = [
    {
      region: "Nairobian Area",
      revenue: 18456789,
      growth: 34.2,
      partners: 567,
      commissions: 2456789,
    },
    {
      region: "Kiambu County",
      revenue: 12345678,
      growth: 28.7,
      partners: 423,
      commissions: 1678432,
    },
    {
      region: "Coast Region",
      revenue: 8901234,
      growth: 22.1,
      partners: 289,
      commissions: 1234567,
    },
    {
      region: "Rift Valley",
      revenue: 4567890,
      growth: 19.3,
      partners: 156,
      commissions: 876543,
    },
  ];

  // Commission payout trends
  const commissionPayoutData = [
    {
      month: "Jan",
      scheduled: 456789,
      paid: 445678,
      pending: 11111,
      disputed: 890,
    },
    {
      month: "Feb",
      scheduled: 567890,
      paid: 556789,
      pending: 10234,
      disputed: 867,
    },
    {
      month: "Mar",
      scheduled: 678901,
      paid: 667890,
      pending: 9876,
      disputed: 1135,
    },
    {
      month: "Apr",
      scheduled: 789012,
      paid: 778901,
      pending: 8765,
      disputed: 1346,
    },
    {
      month: "May",
      scheduled: 890123,
      paid: 879012,
      pending: 9234,
      disputed: 1877,
    },
    {
      month: "Jun",
      scheduled: 987654,
      paid: 976543,
      pending: 8876,
      disputed: 2235,
    },
    {
      month: "Jul",
      scheduled: 876543,
      paid: 865432,
      pending: 8765,
      disputed: 2346,
    },
    {
      month: "Aug",
      scheduled: 934567,
      paid: 923456,
      pending: 9012,
      disputed: 2099,
    },
    {
      month: "Sep",
      scheduled: 998765,
      paid: 987654,
      pending: 8901,
      dried: 2210,
    },
    {
      month: "Oct",
      scheduled: 1045678,
      paid: 1034567,
      pending: 9012,
      disputed: 2099,
    },
    {
      month: "Nov",
      scheduled: 1134567,
      paid: 1123456,
      pending: 9123,
      disputed: 1988,
    },
    {
      month: "Dec",
      scheduled: 1234567,
      paid: 1223456,
      pending: 9234,
      disputed: 1877,
    },
  ];

  // Performance cohort analysis
  const cohortAnalysis = [
    {
      cohort: "Q1 2024",
      revenue_m1: 100,
      revenue_m3: 150,
      revenue_m6: 220,
      revenue_m12: 340,
      retention: 87.5,
    },
    {
      cohort: "Q2 2024",
      revenue_m1: 100,
      revenue_m3: 145,
      revenue_m6: 210,
      revenue_m9: 290,
      retention: 84.2,
    },
    {
      cohort: "Q3 2024",
      revenue_m1: 100,
      revenue_m3: 140,
      revenue_m6: 195,
      retention: 82.1,
    },
    { cohort: "Q4 2024", revenue_m1: 100, revenue_m3: 135, retention: 79.8 },
    { cohort: "Q1 2025", revenue_m1: 100, retention: 85.3 },
  ];

  const refreshData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const formatCurrency = (amount: number, compact: boolean = false) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 0,
    }).format(amount);
  };

  const formatNumber = (num: number, compact: boolean = false) => {
    return new Intl.NumberFormat("en-KE", {
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 0,
    }).format(num);
  };

  const formatPercentage = (num: number, decimals: number = 1) => {
    return `${num.toFixed(decimals)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.name}:
                </span>
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: entry.color }}
              >
                {entry.name.includes("Rate") || entry.name.includes("%")
                  ? formatPercentage(entry.value)
                  : formatCurrency(entry.value, true)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Advanced Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Revenue & Commissions Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Comprehensive financial performance and partner commission insights
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="monthly">Monthly View</option>
            <option value="quarterly">Quarterly View</option>
            <option value="yearly">Yearly View</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="overview">Executive Overview</option>
            <option value="detailed">Detailed Analysis</option>
            <option value="commission">Commission Focus</option>
            <option value="forecast">Predictive Analytics</option>
          </select>
          <motion.button
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            onClick={refreshData}
            disabled={refreshing}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
              strokeWidth={2}
            />
            {refreshing ? "Syncing..." : "Refresh"}
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm shadow-lg"
            whileHover={{
              y: -2,
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={2} />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        <motion.div
          className="col-span-1 lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Gross Revenue</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(revenueMetrics.grossRevenue, true)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  +{formatPercentage(revenueMetrics.growth.grossRevenue)} vs
                  last period
                </span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Net Revenue
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(revenueMetrics.netRevenue, true)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +{formatPercentage(revenueMetrics.growth.netRevenue)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Banknote className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Total Commissions
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(revenueMetrics.totalCommissions, true)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  +{formatPercentage(revenueMetrics.growth.commissions)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Coins className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Net Profit
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(revenueMetrics.netProfit, true)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  +{formatPercentage(revenueMetrics.growth.profit)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <PiggyBank className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                EBITDA
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(revenueMetrics.ebitda, true)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  +{formatPercentage(revenueMetrics.growth.ebitda)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
              <Briefcase className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Streams Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Revenue Streams Performance
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Detailed breakdown with growth analysis and sub-category
                insights
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {revenueStreams.map((stream, index) => (
              <motion.div
                key={stream.name}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stream.color }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {stream.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stream.percentage}% of total revenue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(stream.amount, true)}
                    </p>
                    <div className="flex items-center justify-end">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        +{formatPercentage(stream.growth)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stream.percentage}%`,
                        backgroundColor: stream.color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Sub-categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {stream.subCategories.map((sub, subIndex) => (
                    <div
                      key={sub.name}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {sub.name}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {sub.rate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(sub.amount, true)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-fit hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Revenue Composition
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current period breakdown
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value as number, true),
                    name,
                  ]}
                  labelFormatter={(label) => `Source: ${label}`}
                />
                <Pie
                  data={revenueStreams}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percentage }) => `${percentage}%`}
                >
                  {revenueStreams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {revenueStreams.slice(0, 3).map((stream) => (
              <div
                key={stream.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stream.color }}
                  ></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {stream.name}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatPercentage(stream.percentage)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Advanced Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Analysis */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Revenue Trend Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Multi-metric performance over time with predictive overlay
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="gross_revenue">Gross Revenue</option>
                <option value="net_revenue">Net Revenue</option>
                <option value="commissions">Commissions</option>
                <option value="profit">Net Profit</option>
              </select>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueTimeSeriesData}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="gross"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorGross)"
                  name="Gross Revenue"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="net"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorNet)"
                  name="Net Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="profit"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Net Profit"
                  dot={{ fill: "#8B5CF6", r: 4 }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="expenses"
                  fill="#EF4444"
                  opacity={0.7}
                  name="Operating Expenses"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Commission Tier Performance */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Commission Tier Performance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Partner performance across commission tiers
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {commissionTiers.map((tier, index) => (
              <motion.div
                key={tier.tier}
                className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-500"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tier.level === 5
                          ? "bg-purple-100 dark:bg-purple-900/20"
                          : tier.level === 4
                          ? "bg-yellow-100 dark:bg-yellow-900/20"
                          : tier.level === 3
                          ? "bg-gray-100 dark:bg-gray-900/20"
                          : tier.level === 2
                          ? "bg-orange-100 dark:bg-orange-900/20"
                          : "bg-blue-100 dark:bg-blue-900/20"
                      }`}
                    >
                      {tier.level === 5 ? (
                        <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : tier.level === 4 ? (
                        <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      ) : tier.level === 3 ? (
                        <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : tier.level === 2 ? (
                        <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      ) : (
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        {tier.tier}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(tier.count)} partners • {tier.rate}{" "}
                        commission
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(tier.totalCommissions, true)}
                    </p>
                    <div className="flex items-center justify-end">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        +{formatPercentage(tier.growth)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Min Volume
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(tier.minVolume, true)}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Avg Monthly
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(tier.avgMonthly, true)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-300">
                    Top: {tier.topPerformer}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {tier.requirements.length} requirements
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Geographic and Commission Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Geographic Revenue Distribution */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Geographic Performance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Revenue distribution across regions with growth metrics
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {geographicRevenue.map((region, index) => (
              <div
                key={region.region}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {region.region}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Commissions: {formatCurrency(region.commissions, true)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(region.revenue, true)}
                  </p>
                  <div className="flex items-center justify-end">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      +{formatPercentage(region.growth)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Commission Payout Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monthly payout trends and dispute resolution
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={commissionPayoutData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="paid"
                  stackId="a"
                  fill="#10B981"
                  name="Paid Out"
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#F59E0B"
                  name="Pending"
                />
                <Bar
                  dataKey="disputed"
                  stackId="a"
                  fill="#EF4444"
                  name="Disputed"
                />
                <Line
                  type="monotone"
                  dataKey="scheduled"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Scheduled"
                  dot={{ fill: "#3B82F6", r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Partner Cohort Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Revenue growth and retention by signup period
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {cohortAnalysis.map((cohort, index) => (
              <div
                key={cohort.cohort}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {cohort.cohort}
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatPercentage(cohort.retention)}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    cohort.revenue_m1,
                    cohort.revenue_m3,
                    cohort.revenue_m6,
                    cohort.revenue_m12,
                  ].map((value, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded ${
                        value ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Revenue progression: {cohort.revenue_m1}% →{" "}
                  {cohort.revenue_m12 || "TBD"}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Margin Analysis */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Margin Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Profitability metrics and efficiency ratios
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Gross Margin
                </span>
                <span className="text-lg font-bold text-green-900 dark:text-green-100">
                  {formatPercentage(revenueMetrics.margins.gross)}
                </span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${revenueMetrics.margins.gross}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Net Margin
                </span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {formatPercentage(revenueMetrics.margins.net)}
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${revenueMetrics.margins.net}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Commission Rate
                </span>
                <span className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {formatPercentage(revenueMetrics.margins.commission)}
                </span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${revenueMetrics.margins.commission}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Operating Margin
                </span>
                <span className="text-lg font-bold text-orange-900 dark:text-orange-100">
                  {formatPercentage(revenueMetrics.margins.operating)}
                </span>
              </div>
              <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2 mt-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${revenueMetrics.margins.operating}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions & Insights */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Strategic Actions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                AI-driven recommendations and quick actions
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Optimize Commission Tiers
                  </h4>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    23 partners are close to tier upgrade. Expected +$234K
                    revenue impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Focus on API Revenue
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    Fastest growing stream at +89.3%. Consider premium API
                    tiers.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-1" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Payout Efficiency
                  </h4>
                  <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                    $89K in pending payouts. Automation could reduce processing
                    time by 67%.
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              className="w-full mt-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate Detailed Financial Report
            </motion.button>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <motion.button
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Export to Excel
              </motion.button>
              <motion.button
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Report
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* <motion.div
        className="bg-gradient-to-br from-gray-50 to-gray-50 dark:from-gray-900 dark:to-black rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-primary-900 dark:text-gray-100">
              Executive Financial Summary
            </h3>
            <p className="dark:text-gray-300 text-gray-300 text-lg">
              Comprehensive overview for C-level decision making and strategic
              planning
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400 dark:text-gray-400">
                Period Performance
              </p>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400 dark:text-green-400" />
                <span className="text-xl font-bold text-green-400 dark:text-green-400">
                  +18.7%
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-full flex items-center justify-center">
              <Receipt className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
\          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/20 dark:bg-green-500/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400 dark:text-green-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Financial Health
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Revenue Growth:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  +23.4%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Profit Margin:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  56.4%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Cash Flow:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  Positive
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">ROI:</span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  34.2%
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-400 dark:text-blue-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Market Position
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Market Share:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  12.8%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Partner Growth:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  +156
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Retention Rate:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  94.7%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  NPS Score:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  72
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg">
                <Zap className="w-6 h-6 text-purple-400 dark:text-purple-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Opportunities
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full mt-1.5"></div>
                <span className="text-gray-300 dark:text-gray-300">
                  API monetization expansion
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full mt-1.5"></div>
                <span className="text-gray-300 dark:text-gray-300">
                  Premium tier optimization
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full mt-1.5"></div>
                <span className="text-gray-300 dark:text-gray-300">
                  Geographic expansion
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full mt-1.5"></div>
                <span className="text-gray-300 dark:text-gray-300">
                  Commission automation
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-500/20 dark:bg-orange-500/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-400 dark:text-orange-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Risk Factors
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Concentration Risk:
                </span>
                <span className="font-semibold text-yellow-400 dark:text-yellow-300">
                  Medium
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Currency Exposure:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  Low
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Regulatory Risk:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  Low
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Competition:
                </span>
                <span className="font-semibold text-orange-400 dark:text-orange-300">
                  High
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10">
          <h4 className="text-xl font-bold mb-4 flex items-center text-white dark:text-gray-100">
            <Crown className="w-6 h-6 text-yellow-400 dark:text-yellow-300 mr-2" />
            Strategic Recommendations for Q2 2025
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-green-400 dark:text-green-300">
                Revenue Optimization
              </h5>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-300">
                <li>• Introduce premium API tiers (+$2.1M projected)</li>
                <li>• Optimize commission structure for Platinum partners</li>
                <li>• Expand currency exchange services</li>
                <li>• Launch enterprise subscription packages</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-blue-400 dark:text-blue-300">
                Operational Excellence
              </h5>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-300">
                <li>• Automate 80% of commission processing</li>
                <li>• Implement real-time payout systems</li>
                <li>• Enhance partner onboarding experience</li>
                <li>• Deploy predictive analytics for churn</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-purple-400 dark:text-purple-300">
                Strategic Growth
              </h5>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-300">
                <li>• Target Central & North Africa expansion</li>
                <li>• Develop white-label solutions</li>
                <li>• Partner with fintech ecosystem</li>
                <li>• Invest in AI-driven pricing models</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-600/30 dark:to-purple-600/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10">
          <h4 className="text-xl font-bold mb-4 flex items-center text-white dark:text-gray-100">
            <TrendingUp className="w-6 h-6 text-blue-400 dark:text-blue-300 mr-2" />
            Q2 2025 Financial Projections
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                Projected Revenue
              </p>
              <p className="text-2xl font-bold text-blue-400 dark:text-blue-300">
                {formatCurrency(52800000, true)}
              </p>
              <p className="text-sm text-green-400 dark:text-green-300">
                +15.6% growth
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                Projected Profit
              </p>
              <p className="text-2xl font-bold text-green-400 dark:text-green-300">
                {formatCurrency(29600000, true)}
              </p>
              <p className="text-sm text-green-400 dark:text-green-300">
                +14.8% growth
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                Partner Commissions
              </p>
              <p className="text-2xl font-bold text-purple-400 dark:text-purple-300">
                {formatCurrency(8600000, true)}
              </p>
              <p className="text-sm text-purple-400 dark:text-purple-300">
                +15.5% growth
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                EBITDA Margin
              </p>
              <p className="text-2xl font-bold text-orange-400 dark:text-orange-300">
                61.2%
              </p>
              <p className="text-sm text-orange-400 dark:text-orange-300">
                +3.7% improvement
              </p>
            </div>
          </div>
        </div>
      </motion.div> */}
    </div>
  );
};

export default RevenueCommissionsPage;