import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  TrendingUp,
  FileText,
  CheckCircle,
  CreditCard,
  DollarSign,
  Target,
  Activity,
  ArrowRight,
  RefreshCw,
  MoreVertical,
  CalendarDays,
  Wallet,
  Smartphone,
  Building,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { escrowService } from "../../../../api/services/escrow";
import TransactionVolumeTrend from "../../../../components/escrow/TransactionVolumeTrend";
import PaymentMethodPerformance from "../../../../components/escrow/PaymentMethodPerformance";

const TransactionReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [refreshing, setRefreshing] = useState(false);
  const [volume, setVolume] = useState<any>(null);
  const [successRate, setSuccessRate] = useState<any>(null);

  const [transactionTrendData, setTransactionTrendData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("volume");
  const [pieStats, setPieStats] = useState<any>(null);
  const [paymentMethodStats, setPaymentMethodStats] = useState<any>(null);
  const [averageSize, setAverageSize] = useState<any>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getMonday(new Date())
  );
  const [weekLabel, setWeekLabel] = useState("");

  function getMonday(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const fetchWeekData = async (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const from = formatDate(start);
    const to = formatDate(end);

    try {
      const response = await escrowService.getLedgerEntryDailyVolumeTrend(
        from,
        to
      );
      setTransactionTrendData(response);
      setWeekLabel(`${from} → ${to}`);
    } catch (err) {
      console.error("Error fetching weekly trend:", err);
    }
  };

  const handleWeekChange = (direction: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + direction * 7);
    setCurrentWeekStart(newStart);
    fetchWeekData(newStart);
  };

  const fetchVolume = async () => {
    try {
      const response = await escrowService.getEscrowVolumeTrend();
      setVolume(response);
    } catch (error) {
      console.error("Error fetching volume trend:", error);
    }
  };

  const fetchPieStats = async () => {
    try {
      const response = await escrowService.getLedgerTransactionPieStats();
      setPieStats(response);
    } catch (error) {
      console.error("Error fetching pie stats:", error);
    }
  };

  const fetchPaymentMethodStats = async () => {
    try {
      const response = await escrowService.getLedgerEntryStatsByPaymentMethod();
      setPaymentMethodStats(response);
    } catch (error) {
      console.error("Error fetching payment method stats:", error);
    }
  };

  const fetchAverageSize = async () => {
    try {
      const response = await escrowService.getLedgerEntryAverageStats();
      setAverageSize(response);
    } catch (error) {
      console.error("Error fetching payment method stats:", error);
    }
  };

  const fetchSuccessRate = async () => {
    try {
      const response = await escrowService.getLedgerEntrySuccessRate();
      setSuccessRate(response);
    } catch (error) {
      console.error("Error fetching volume trend:", error);
    }
  };

  useEffect(() => {
    fetchVolume();
    fetchSuccessRate();
    fetchWeekData(currentWeekStart);
    fetchPieStats();
    fetchPaymentMethodStats();
    fetchAverageSize();
  }, []);

  const categoryData = [
    { name: "Goods", value: 523, volume: 18500000, color: "#3B82F6" },
    { name: "Services", value: 389, volume: 14200000, color: "#10B981" },
    { name: "Digital", value: 245, volume: 8900000, color: "#F59E0B" },
    { name: "Real Estate", value: 90, volume: 4000000, color: "#EF4444" },
  ];

  const performanceMetrics = {
    totalVolume: 325600000,
    totalTransactions: 8934,
    successRate: 96.7,
    averageAmount: 36447,
    growth: {
      volume: 12.3,
      transactions: 8.7,
      successRate: 2.1,
      averageAmount: 3.4,
    },
  };

  const hourlyData = [
    { hour: "00", transactions: 45, volume: 1200000 },
    { hour: "02", transactions: 23, volume: 780000 },
    { hour: "04", transactions: 12, volume: 340000 },
    { hour: "06", transactions: 67, volume: 2100000 },
    { hour: "08", transactions: 134, volume: 4500000 },
    { hour: "10", transactions: 189, volume: 6700000 },
    { hour: "12", transactions: 234, volume: 8900000 },
    { hour: "14", transactions: 198, volume: 7200000 },
    { hour: "16", transactions: 167, volume: 5800000 },
    { hour: "18", transactions: 145, volume: 4900000 },
    { hour: "20", transactions: 98, volume: 3400000 },
    { hour: "22", transactions: 76, volume: 2600000 },
  ];

  const refreshData = async () => {
    fetchVolume();
    fetchSuccessRate();
    fetchWeekData(currentWeekStart);
    fetchPieStats();
    fetchPaymentMethodStats();
    fetchAverageSize();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-KE", { notation: "compact" }).format(num);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name === "volume"
                ? formatCurrency(entry.value)
                : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Transaction Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time insights and comprehensive transaction reporting
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            onClick={refreshData}
            disabled={refreshing}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
              strokeWidth={1.8}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-blue-600 text-white dark:bg-blue-700 rounded-lg text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: "#2563eb" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Volume
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(performanceMetrics.totalVolume)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{performanceMetrics.growth.volume}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Transactions
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {formatNumber(performanceMetrics.totalTransactions)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{performanceMetrics.growth.transactions}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {successRate?.thisMonthRate}%
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{successRate?.percentChange}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Amount
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(averageSize?.thisMonthAverage)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{averageSize?.percentChange}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <TransactionVolumeTrend
            transactionTrendData={transactionTrendData}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            CustomTooltip={CustomTooltip}
            weekLabel={weekLabel}
            handleWeekChange={handleWeekChange}
          />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Transaction Categories
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Distribution by category type
              </p>
            </div>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip
                  formatter={(value, name) => [
                    formatNumber(value as number),
                    name,
                  ]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Payment Methods Performance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Success rates and volume by payment method
              </p>
            </div>
          </div>
          <PaymentMethodPerformance
            paymentMethodStats={paymentMethodStats}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Hourly Activity
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transaction patterns by hour
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#6B7280" fontSize={10} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={10}
                  tickFormatter={formatNumber}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === "transactions"
                      ? formatNumber(value as number)
                      : formatCurrency(value as number),
                    name,
                  ]}
                />
                <Bar
                  dataKey="transactions"
                  fill="#3B82F6"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quick Reports
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate instant reports for common requirements
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.button
            className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Daily Summary
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Today's overview
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </motion.button>

          <motion.button
            className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Weekly Trends
                </h4>
                <p className="text-xs text-green-600 dark:text-green-300">
                  7-day analysis
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
          </motion.button>

          <motion.button
            className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <h4 className="font-medium text-purple-800 dark:text-purple-200">
                  High Value
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Above threshold
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </motion.button>

          <motion.button
            className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <div className="text-left">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                  Compliance
                </h4>
                <p className="text-xs text-orange-600 dark:text-orange-300">
                  Regulatory report
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionReportsPage;
