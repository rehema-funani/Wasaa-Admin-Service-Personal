import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpDown,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  CreditCard,
  DollarSign,
  Target,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  Settings,
  Share2,
  Database,
  LineChart,
  MoreVertical,
  Maximize2,
  CalendarDays,
  Scale,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Timer,
  Award,
  ThumbsUp,
  ThumbsDown,
  Building,
  Wallet,
  Smartphone,
  Banknote,
  TrendingDown as TrendDown,
  Calculator,
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts';

const RevenueCommissionsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("quarterly");
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState("gross_revenue");
  const [commissionTier, setCommissionTier] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Complex revenue data structure
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
      ebitda: 19.8
    },
    margins: {
      gross: 83.7,
      net: 56.4,
      commission: 16.3,
      operating: 27.3
    }
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
        { name: "Premium Services", amount: 3143300, rate: "3.8%" }
      ]
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
        { name: "Multi-Party Escrow", amount: 1456800, rate: "3.5%" }
      ]
    },
    { 
      name: "Premium Subscriptions", 
      amount: 6789000, 
      percentage: 14.9, 
      growth: 45.2, 
      color: "#F59E0B",
      subCategories: [
        { name: "Business Pro", amount: 3456000, rate: "Monthly" },
        { name: "Enterprise", amount: 2234000, rate: "Annual" },
        { name: "White Label", amount: 1099000, rate: "Custom" }
      ]
    },
    { 
      name: "Currency Exchange", 
      amount: 4234500, 
      percentage: 9.3, 
      growth: 67.8, 
      color: "#EF4444",
      subCategories: [
        { name: "Forex Spread", amount: 2456700, rate: "0.8%" },
        { name: "Cross-border Fees", amount: 1234500, rate: "1.2%" },
        { name: "Hedge Premiums", amount: 543300, rate: "0.3%" }
      ]
    },
    { 
      name: "API & Integration", 
      amount: 2134000, 
      percentage: 4.7, 
      growth: 89.3, 
      color: "#8B5CF6",
      subCategories: [
        { name: "API Calls", amount: 1234500, rate: "Per Call" },
        { name: "SDK Licensing", amount: 567800, rate: "Annual" },
        { name: "Custom Integration", amount: 331700, rate: "Project" }
      ]
    },
    { 
      name: "Interest & Investment", 
      amount: 1008000, 
      percentage: 2.2, 
      growth: 12.4, 
      color: "#EC4899",
      subCategories: [
        { name: "Float Interest", amount: 567800, rate: "3.2%" },
        { name: "Treasury Yield", amount: 287600, rate: "4.1%" },
        { name: "Investment Returns", amount: 152600, rate: "8.7%" }
      ]
    }
  ];

  // Commission structure data
  const commissionTiers = [
    {
      tier: "Platinum Partners",
      level: 5,
      count: 23,
      minVolume: 50000000,
      rate: "0.8%",
      totalCommissions: 2456789,
      avgMonthly: 106817,
      topPerformer: "GlobalTech Solutions",
      growth: 34.2,
      requirements: ["$50M+ monthly volume", "99% SLA", "Premium support"]
    },
    {
      tier: "Gold Partners",
      level: 4,
      count: 67,
      minVolume: 20000000,
      rate: "1.2%",
      totalCommissions: 1998765,
      avgMonthly: 29834,
      topPerformer: "FinanceFlow Inc",
      growth: 28.7,
      requirements: ["$20M+ monthly volume", "97% SLA", "Standard support"]
    },
    {
      tier: "Silver Partners",
      level: 3,
      count: 156,
      minVolume: 5000000,
      rate: "1.8%",
      totalCommissions: 1678432,
      avgMonthly: 10759,
      topPerformer: "PayStream Ltd",
      growth: 22.1,
      requirements: ["$5M+ monthly volume", "95% SLA", "Basic support"]
    },
    {
      tier: "Bronze Partners",
      level: 2,
      count: 342,
      minVolume: 1000000,
      rate: "2.5%",
      totalCommissions: 987654,
      avgMonthly: 2888,
      topPerformer: "QuickPay Pro",
      growth: 19.3,
      requirements: ["$1M+ monthly volume", "90% SLA", "Community support"]
    },
    {
      tier: "Standard Partners",
      level: 1,
      count: 1247,
      minVolume: 100000,
      rate: "3.2%",
      totalCommissions: 322543,
      avgMonthly: 259,
      topPerformer: "StartupPay",
      growth: 15.8,
      requirements: ["$100K+ monthly volume", "85% SLA", "Self-service"]
    }
  ];

  // Time series revenue data
  const revenueTimeSeriesData = [
    { month: "Jan", gross: 3234567, net: 2567890, commissions: 456789, expenses: 987654, profit: 1580236 },
    { month: "Feb", gross: 3567890, net: 2890123, commissions: 567890, expenses: 1023456, profit: 1866667 },
    { month: "Mar", gross: 3890123, net: 3123456, commissions: 678901, expenses: 1098765, profit: 2024691 },
    { month: "Apr", gross: 4123456, net: 3345678, commissions: 789012, expenses: 1134567, profit: 2211111 },
    { month: "May", gross: 4345678, net: 3567890, commissions: 890123, expenses: 1176543, profit: 2391347 },
    { month: "Jun", gross: 4567890, net: 3789012, commissions: 987654, expenses: 1234567, profit: 2554445 },
    { month: "Jul", gross: 4234567, net: 3456789, commissions: 876543, expenses: 1198765, profit: 2258024 },
    { month: "Aug", gross: 4456789, net: 3678901, commissions: 934567, expenses: 1245678, profit: 2433223 },
    { month: "Sep", gross: 4678901, net: 3890123, commissions: 998765, expenses: 1287654, profit: 2602469 },
    { month: "Oct", gross: 4890123, net: 4098765, commissions: 1045678, expenses: 1334567, profit: 2764198 },
    { month: "Nov", gross: 5012345, net: 4234567, commissions: 1134567, expenses: 1387654, profit: 2846913 },
    { month: "Dec", gross: 5234567, net: 4456789, commissions: 1234567, expenses: 1445678, profit: 3011111 }
  ];

  // Geographic revenue distribution
  const geographicRevenue = [
    { region: "East Africa", revenue: 18456789, growth: 34.2, partners: 567, commissions: 2456789 },
    { region: "West Africa", revenue: 12345678, growth: 28.7, partners: 423, commissions: 1678432 },
    { region: "Southern Africa", revenue: 8901234, growth: 22.1, partners: 289, commissions: 1234567 },
    { region: "North Africa", revenue: 4567890, growth: 19.3, partners: 156, commissions: 876543 },
    { region: "Central Africa", revenue: 1407309, growth: 15.8, partners: 78, commissions: 198765 }
  ];

  // Commission payout trends
  const commissionPayoutData = [
    { month: "Jan", scheduled: 456789, paid: 445678, pending: 11111, disputed: 890 },
    { month: "Feb", scheduled: 567890, paid: 556789, pending: 10234, disputed: 867 },
    { month: "Mar", scheduled: 678901, paid: 667890, pending: 9876, disputed: 1135 },
    { month: "Apr", scheduled: 789012, paid: 778901, pending: 8765, disputed: 1346 },
    { month: "May", scheduled: 890123, paid: 879012, pending: 9234, disputed: 1877 },
    { month: "Jun", scheduled: 987654, paid: 976543, pending: 8876, disputed: 2235 },
    { month: "Jul", scheduled: 876543, paid: 865432, pending: 8765, disputed: 2346 },
    { month: "Aug", scheduled: 934567, paid: 923456, pending: 9012, disputed: 2099 },
    { month: "Sep", scheduled: 998765, paid: 987654, pending: 8901, dried: 2210 },
    { month: "Oct", scheduled: 1045678, paid: 1034567, pending: 9012, disputed: 2099 },
    { month: "Nov", scheduled: 1134567, paid: 1123456, pending: 9123, disputed: 1988 },
    { month: "Dec", scheduled: 1234567, paid: 1223456, pending: 9234, disputed: 1877 }
  ];

  // Performance cohort analysis
  const cohortAnalysis = [
    { cohort: "Q1 2024", revenue_m1: 100, revenue_m3: 150, revenue_m6: 220, revenue_m12: 340, retention: 87.5 },
    { cohort: "Q2 2024", revenue_m1: 100, revenue_m3: 145, revenue_m6: 210, revenue_m9: 290, retention: 84.2 },
    { cohort: "Q3 2024", revenue_m1: 100, revenue_m3: 140, revenue_m6: 195, retention: 82.1 },
    { cohort: "Q4 2024", revenue_m1: 100, revenue_m3: 135, retention: 79.8 },
    { cohort: "Q1 2025", revenue_m1: 100, retention: 85.3 }
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
      maximumFractionDigits: compact ? 1 : 0
    }).format(num);
  };

  const formatPercentage = (num: number, decimals: number = 1) => {
    return `${num.toFixed(decimals)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}:</span>
              </div>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name.includes('Rate') || entry.name.includes('%') ? 
                  formatPercentage(entry.value) : 
                  formatCurrency(entry.value, true)
                }
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
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={2} />
            {refreshing ? 'Syncing...' : 'Refresh'}
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm shadow-lg"
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={2} />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* Executive KPI Dashboard */}
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
                  +{formatPercentage(revenueMetrics.growth.grossRevenue)} vs last period
                </span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Revenue</p>
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Commissions</p>
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Profit</p>
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">EBITDA</p>
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
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
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
                Detailed breakdown with growth analysis and sub-category insights
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
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{stream.name}</h4>
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
                      <span className="text-sm text-green-600