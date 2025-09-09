import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Target,
  ArrowRight,
  RefreshCw,
  MoreVertical,
  Maximize2,
  Scale,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
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
  ComposedChart,
} from "recharts";
import { escrowService } from "../../../../api/services/escrow";

const DisputeAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedMetric, setSelectedMetric] = useState("count");
  const [resolutionRate, setResolutionRate] = useState(null);
  const [escalationRate, setEscalationRate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  type DisputeCountStats = {
    thisPeriodCount: number;
    percentChange: number;
  };

  const [count, setCount] = useState<DisputeCountStats>({
    thisPeriodCount: 0,
    percentChange: 0,
  });

  const fetchDisputeCount = async () => {
    try {
      const response = await escrowService.getDisputeCountStats();
      setCount(response);
    } catch (error) {
      console.error("Error fetching dispute count stats:", error);
    }
  };
  const fetchDisputeResolutionRate = async () => {
    try {
      const response = await escrowService.getDisputeResolutionRateStats();
      setResolutionRate(response);
    } catch (error) {
      console.error("Error fetching dispute count stats:", error);
    }
  };
  const fetchDisputeEscalationRate = async () => {
    try {
      const response = await escrowService.getDisputeEscalationStats();
      setEscalationRate(response);
    } catch (error) {
      console.error("Error fetching dispute count stats:", error);
    }
  };

  useEffect(() => {
    fetchDisputeCount();
    fetchDisputeResolutionRate();
    fetchDisputeEscalationRate();
  }, []);

  const disputeTrendData = [
    {
      date: "Jan 01",
      count: 23,
      resolved: 18,
      escalated: 3,
      pending: 2,
      avgResolution: 2.3,
      satisfaction: 4.1,
    },
    {
      date: "Jan 02",
      count: 31,
      resolved: 25,
      escalated: 4,
      pending: 2,
      avgResolution: 1.8,
      satisfaction: 4.3,
    },
    {
      date: "Jan 03",
      count: 19,
      resolved: 16,
      escalated: 2,
      pending: 1,
      avgResolution: 2.1,
      satisfaction: 4.0,
    },
    {
      date: "Jan 04",
      count: 27,
      resolved: 22,
      escalated: 3,
      pending: 2,
      avgResolution: 1.9,
      satisfaction: 4.2,
    },
    {
      date: "Jan 05",
      count: 35,
      resolved: 28,
      escalated: 5,
      pending: 2,
      avgResolution: 2.5,
      satisfaction: 3.9,
    },
    {
      date: "Jan 06",
      count: 22,
      resolved: 19,
      escalated: 2,
      pending: 1,
      avgResolution: 1.7,
      satisfaction: 4.4,
    },
    {
      date: "Jan 07",
      count: 29,
      resolved: 24,
      escalated: 3,
      pending: 2,
      avgResolution: 2.0,
      satisfaction: 4.1,
    },
  ];

  const disputeTypeData = [
    {
      name: "Non-delivery",
      value: 156,
      percentage: 35.2,
      color: "#EF4444",
      avgResolution: 1.8,
      satisfaction: 4.2,
    },
    {
      name: "Quality Issues",
      value: 89,
      percentage: 20.1,
      color: "#F59E0B",
      avgResolution: 2.3,
      satisfaction: 3.8,
    },
    {
      name: "Wrong Item",
      value: 67,
      percentage: 15.1,
      color: "#3B82F6",
      avgResolution: 1.5,
      satisfaction: 4.1,
    },
    {
      name: "Payment Issues",
      value: 54,
      percentage: 12.2,
      color: "#10B981",
      avgResolution: 2.1,
      satisfaction: 3.9,
    },
    {
      name: "Fraud Suspected",
      value: 43,
      percentage: 9.7,
      color: "#8B5CF6",
      avgResolution: 4.2,
      satisfaction: 3.5,
    },
    {
      name: "Service Dispute",
      value: 34,
      percentage: 7.7,
      color: "#EC4899",
      avgResolution: 2.8,
      satisfaction: 3.7,
    },
  ];

  const resolutionOutcomeData = [
    {
      outcome: "Refund Buyer",
      count: 167,
      percentage: 42.3,
      satisfaction: 4.3,
      timeAvg: 1.8,
    },
    {
      outcome: "Release Seller",
      count: 124,
      percentage: 31.4,
      satisfaction: 3.9,
      timeAvg: 2.1,
    },
    {
      outcome: "Partial Refund",
      count: 78,
      percentage: 19.7,
      satisfaction: 4.1,
      timeAvg: 2.5,
    },
    {
      outcome: "No Action",
      count: 26,
      percentage: 6.6,
      satisfaction: 2.8,
      timeAvg: 1.2,
    },
  ];

  const performanceMetrics = {
    totalDisputes: 395,
    resolutionRate: 94.7,
    avgResolutionTime: 2.1,
    satisfactionScore: 4.0,
    escalationRate: 8.4,
    slaCompliance: 96.2,
    growth: {
      disputes: -5.2,
      resolutionRate: 3.1,
      avgResolutionTime: -12.4,
      satisfaction: 2.8,
      escalation: -15.6,
      slaCompliance: 4.2,
    },
  };

  const categoryTrendData = [
    {
      month: "Sep",
      nonDelivery: 45,
      quality: 32,
      wrongItem: 28,
      payment: 19,
      fraud: 15,
    },
    {
      month: "Oct",
      nonDelivery: 52,
      quality: 38,
      wrongItem: 31,
      payment: 22,
      fraud: 18,
    },
    {
      month: "Nov",
      nonDelivery: 48,
      quality: 35,
      wrongItem: 29,
      payment: 25,
      fraud: 21,
    },
    {
      month: "Dec",
      nonDelivery: 44,
      quality: 29,
      wrongItem: 26,
      payment: 23,
      fraud: 19,
    },
    {
      month: "Jan",
      nonDelivery: 39,
      quality: 25,
      wrongItem: 22,
      payment: 18,
      fraud: 16,
    },
  ];

  const resolutionMethodData = [
    {
      method: "Admin Decision",
      count: 156,
      avgTime: 1.2,
      satisfaction: 3.8,
      complexity: "High",
    },
    {
      method: "Mediation",
      count: 89,
      avgTime: 3.1,
      satisfaction: 4.2,
      complexity: "Medium",
    },
    {
      method: "Mutual Agreement",
      count: 78,
      avgTime: 0.8,
      satisfaction: 4.5,
      complexity: "Low",
    },
    {
      method: "Evidence Review",
      count: 45,
      avgTime: 2.4,
      satisfaction: 3.9,
      complexity: "Medium",
    },
    {
      method: "Auto Resolution",
      count: 27,
      avgTime: 0.1,
      satisfaction: 4.1,
      complexity: "Low",
    },
  ];

  const slaPerformanceData = [
    { tier: "Tier 1", target: 24, actual: 18.5, compliance: 97.2, count: 234 },
    { tier: "Tier 2", target: 48, actual: 42.1, compliance: 94.8, count: 89 },
    { tier: "Tier 3", target: 72, actual: 68.9, compliance: 92.3, count: 34 },
  ];

  const refreshData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-KE").format(num);
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${(hours / 24).toFixed(1)}d`;
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
              {entry.name.includes("Time")
                ? formatTime(entry.value)
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
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Dispute Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Comprehensive insights into dispute patterns and resolution
            performance
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="6months">Last 6 Months</option>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Disputes
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {count?.thisPeriodCount || 0}
              </p>
              <div className="flex items-center mt-1">
                <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  {Math.abs(count?.percentChange)}%
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resolution Rate
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {resolutionRate?.thisPeriodRate}%
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  +{resolutionRate?.percentChange}%
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Resolution
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {formatTime(performanceMetrics.avgResolutionTime)}
              </p>
              <div className="flex items-center mt-1">
                <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  {Math.abs(performanceMetrics.growth.avgResolutionTime)}%
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escalation Rate
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {escalationRate?.thisPeriodRate}%
              </p>
              <div className="flex items-center mt-1">
                <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  {Math.abs(escalationRate?.percentChange)}%
                </span>
              </div>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Dispute Volume Trend
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Daily dispute counts and resolution patterns
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="count">Total Count</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
                <option value="avgResolution">Avg Resolution Time</option>
              </select>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Maximize2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={disputeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} yAxisId="left" />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  fill="#3B82F6"
                  name="Total Disputes"
                />
                <Bar
                  yAxisId="left"
                  dataKey="resolved"
                  fill="#10B981"
                  name="Resolved"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgResolution"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Avg Resolution (hrs)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dispute Types Distribution */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Dispute Types Distribution
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Breakdown by dispute category
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
                  labelFormatter={(label) => `Type: ${label}`}
                />
                <Legend />
                <Pie
                  data={disputeTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {disputeTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Resolution Methods Performance */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Resolution Methods Performance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Efficiency and satisfaction by resolution method
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {resolutionMethodData.map((method, index) => (
              <div
                key={method.method}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                    <Scale className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {method.method}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(method.count)} cases • {method.complexity}{" "}
                      complexity
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(method.avgTime)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Avg Time
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        method.satisfaction > 4.2
                          ? "text-green-600 dark:text-green-400"
                          : method.satisfaction > 3.8
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {method.satisfaction}/5.0
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Satisfaction
                    </p>
                  </div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        method.satisfaction > 4.2
                          ? "bg-green-500"
                          : method.satisfaction > 3.8
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(method.satisfaction / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                SLA Performance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Compliance by tier
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {slaPerformanceData.map((tier, index) => (
              <div key={tier.tier} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {tier.tier}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(tier.count)} cases
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        tier.compliance > 95
                          ? "text-green-600 dark:text-green-400"
                          : tier.compliance > 90
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {tier.compliance}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(tier.actual)}/{formatTime(tier.target)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      tier.compliance > 95
                        ? "bg-green-500"
                        : tier.compliance > 90
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${tier.compliance}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Target: {formatTime(tier.target)}</span>
                  <span>Actual: {formatTime(tier.actual)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Category Trends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly dispute trends by category
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={categoryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="nonDelivery"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Non-delivery"
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Quality Issues"
                />
                <Line
                  type="monotone"
                  dataKey="wrongItem"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Wrong Item"
                />
                <Line
                  type="monotone"
                  dataKey="payment"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Payment Issues"
                />
                <Line
                  type="monotone"
                  dataKey="fraud"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  name="Fraud"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Resolution Outcomes
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Distribution and satisfaction by outcome
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {resolutionOutcomeData.map((outcome, index) => (
              <div
                key={outcome.outcome}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      outcome.outcome === "Refund Buyer"
                        ? "bg-blue-500"
                        : outcome.outcome === "Release Seller"
                        ? "bg-green-500"
                        : outcome.outcome === "Partial Refund"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {outcome.outcome}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(outcome.count)} cases ({outcome.percentage}
                      %)
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {outcome.satisfaction}/5.0
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full mr-1 ${
                            i < Math.floor(outcome.satisfaction)
                              ? "bg-yellow-400"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(outcome.timeAvg)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Avg Time
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Key Insights */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Key Insights
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered analysis and recommendations
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Resolution Time Improved
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Average resolution time decreased by 12.4% this month,
                    primarily due to increased use of mutual agreements.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Quality Issues Pattern
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    43% of quality disputes involve the same 5 sellers. Consider
                    enhanced seller screening.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Peak Hours Impact
                  </h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                    Disputes filed during 2-6 PM have 23% longer resolution
                    times. Consider staffing adjustments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generate targeted reports and take action
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <motion.button
              className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">
                    Performance Report
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Team & SLA metrics
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
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Satisfaction Survey
                  </h4>
                  <p className="text-xs text-green-600 dark:text-green-300">
                    Send to recent cases
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
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div className="text-left">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">
                    Process Optimization
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-300">
                    AI recommendations
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
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div className="text-left">
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Risk Analysis
                  </h4>
                  <p className="text-xs text-orange-600 dark:text-orange-300">
                    Identify patterns
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Executive Summary */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Executive Summary
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Key takeaways and strategic insights for leadership
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Performance Highlights
              </h4>
            </div>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li>• 5.2% reduction in total disputes</li>
              <li>• 96.2% SLA compliance maintained</li>
              <li>• Customer satisfaction up 2.8%</li>
              <li>• Resolution time improved by 12.4%</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Strategic Opportunities
              </h4>
            </div>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>• Automate 35% more simple cases</li>
              <li>• Enhance seller quality programs</li>
              <li>• Optimize peak hour staffing</li>
              <li>• Expand mediation services</li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <h4 className="font-medium text-orange-800 dark:text-orange-200">
                Areas for Improvement
              </h4>
            </div>
            <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
              <li>• Fraud detection accuracy</li>
              <li>• Complex case resolution time</li>
              <li>• Tier 3 escalation volume</li>
              <li>• Multi-language support gaps</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DisputeAnalyticsPage;
