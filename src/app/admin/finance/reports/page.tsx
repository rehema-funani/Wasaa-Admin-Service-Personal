import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Filter,
  Calendar,
  ArrowRight,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  FileText
} from "lucide-react";
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
  Area,
} from "recharts";
import TransactionTrends from "../../../../components/finance/TransactionTrends";
import TransactionStats from "../../../../components/finance/TransactionStats";

const page: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedQuarter, setSelectedQuarter] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [profitMarginData, setProfitMarginData] = useState<any[]>([]);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);

  const monthlyRevenueData = [
    {
      name: "Jan",
      revenue: 11475000,
      expenses: 7800000,
      profit: 3675000,
      margin: 32.0,
    },
    {
      name: "Feb",
      revenue: 12345000,
      expenses: 8250000,
      profit: 4095000,
      margin: 33.2,
    },
    {
      name: "Mar",
      revenue: 13725000,
      expenses: 8850000,
      profit: 4875000,
      margin: 35.5,
    },
    {
      name: "Apr",
      revenue: 19868400,
      expenses: 10950000,
      profit: 8918400,
      margin: 44.9,
    },
  ];

  const expenseBreakdownData = [
    { name: "Operations", value: 35, amount: 3832500 },
    { name: "Marketing", value: 20, amount: 2190000 },
    { name: "Technology", value: 25, amount: 2737500 },
    { name: "Personnel", value: 15, amount: 1642500 },
    { name: "Other", value: 5, amount: 547500 },
  ];

  const monthlyCashFlowData = [
    { name: "Jan", inflow: 11475000, outflow: 7800000, netFlow: 3675000 },
    { name: "Feb", inflow: 12345000, outflow: 8250000, netFlow: 4095000 },
    { name: "Mar", inflow: 13725000, outflow: 8850000, netFlow: 4875000 },
    { name: "Apr", inflow: 19868400, outflow: 10950000, netFlow: 8918400 },
  ];

  const profitMarginTrendData = [
    { name: "Jan", grossMargin: 68.0, netMargin: 32.0, operatingMargin: 42.0 },
    { name: "Feb", grossMargin: 66.8, netMargin: 33.2, operatingMargin: 43.5 },
    { name: "Mar", grossMargin: 64.5, netMargin: 35.5, operatingMargin: 45.2 },
    { name: "Apr", grossMargin: 55.1, netMargin: 44.9, operatingMargin: 52.3 },
  ];

  const revenueCategoryData = [
    { name: "Transaction Fees", value: 45, amount: 8940780 },
    { name: "Subscription Revenue", value: 25, amount: 4967100 },
    { name: "Interest Income", value: 15, amount: 2980260 },
    { name: "Service Charges", value: 10, amount: 1986840 },
    { name: "Other Revenue", value: 5, amount: 993420 },
  ];

  const financialKpiData = [
    { metric: "Revenue Growth Rate", value: "44.7%", change: "+12.2%" },
    { metric: "Gross Profit Margin", value: "55.1%", change: "-13.4%" },
    { metric: "Net Profit Margin", value: "44.9%", change: "+9.4%" },
    { metric: "Return on Assets (ROA)", value: "18.5%", change: "+3.2%" },
    { metric: "Return on Equity (ROE)", value: "24.8%", change: "+5.1%" },
    { metric: "Current Ratio", value: "2.45", change: "+0.15" },
    { metric: "Debt-to-Equity Ratio", value: "0.32", change: "-0.08" },
    { metric: "Operating Cash Flow", value: "KES 8,918,400", change: "+83.0%" },
  ];

  const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setRevenueData(monthlyRevenueData);
      setExpenseData(expenseBreakdownData);
      setProfitMarginData(profitMarginTrendData);
      setCashFlowData(monthlyCashFlowData);
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedYear, selectedMonth, selectedQuarter]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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
            Financial Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track revenue, transactions, and financial metrics in KES
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 flex items-center shadow-sm">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedPeriod === "weekly"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handlePeriodChange("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedPeriod === "monthly"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handlePeriodChange("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedPeriod === "quarterly"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handlePeriodChange("quarterly")}
            >
              Quarterly
            </button>
          </div>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Calendar size={16} className="mr-2" strokeWidth={1.8} />
            {selectedPeriod === "monthly" && `April ${selectedYear}`}
            {selectedPeriod === "quarterly" &&
              `Q${selectedQuarter} ${selectedYear}`}
            {selectedPeriod === "weekly" && `April Week 4, ${selectedYear}`}
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Filter size={16} className="mr-2" strokeWidth={1.8} />
            Filters
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* API-driven Transaction Statistics */}
      <TransactionStats />

      {/* Financial Revenue & Profit Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Revenue & Profitability
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Revenue, expenses, and profit trends in KES
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary-500 dark:bg-primary-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Revenue
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Expenses
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Profit
                </span>
              </div>
            </div>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
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
                  <Bar
                    dataKey="expenses"
                    fill="#f87171"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Revenue Sources
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Breakdown by revenue category
            </p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={revenueCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {revenueCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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

      {/* Cash Flow & Profit Margins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Cash Flow Analysis
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Monthly cash inflows and outflows in KES
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Inflow
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Outflow
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Net Flow
                </span>
              </div>
            </div>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="inflow"
                    stackId="1"
                    stroke="#10b981"
                    fill="#6ee7b7"
                  />
                  <Area
                    type="monotone"
                    dataKey="outflow"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#fca5a5"
                  />
                  <Area
                    type="monotone"
                    dataKey="netFlow"
                    stackId="3"
                    stroke="#3b82f6"
                    fill="#93c5fd"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* API-driven Transaction Trends */}
        <TransactionTrends />
      </div>

      {/* Financial KPIs and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Expense Breakdown
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Operating expenses by category in KES
            </p>
          </div>
          <div className="h-60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}%`,
                      formatCurrency(props.payload.amount),
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Profit Margin Trends
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Gross, operating, and net margins
            </p>
          </div>
          <div className="h-60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={profitMarginData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="grossMargin"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="operatingMargin"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="netMargin"
                    stroke="#ffc658"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Financial KPIs
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Key financial performance indicators
            </p>
          </div>
          <div className="h-60 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {financialKpiData.map((kpi, index) => (
                    <tr key={index}>
                      <td className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {kpi.metric}
                      </td>
                      <td className="py-2 text-sm text-gray-800 dark:text-gray-200 text-right">
                        {kpi.value}
                      </td>
                      <td
                        className={`py-2 text-sm text-right font-medium ${
                          kpi.change.startsWith("+")
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
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

      {/* Financial Reports Generation */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Generate Financial Reports
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Create detailed financial analysis reports in KES
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <FileText
                size={16}
                className="mr-2 text-gray-600 dark:text-gray-400"
                strokeWidth={1.8}
              />
              P&L Statement
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <BarChart3
                size={16}
                className="mr-2 text-green-600 dark:text-green-400"
                strokeWidth={1.8}
              />
              Cash Flow Report
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <PieChart
                size={16}
                className="mr-2 text-primary-600 dark:text-primary-400"
                strokeWidth={1.8}
              />
              Financial Analysis
            </motion.button>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <motion.button
            className="flex items-center px-4 py-2 bg-primary-600 text-white dark:bg-primary-700 dark:text-gray-100 rounded-xl text-sm shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600"
            whileHover={{
              y: -2,
              backgroundColor: "#4f46e5",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
            }}
            whileTap={{ y: 0 }}
          >
            Generate Reports
            <ArrowRight size={16} className="ml-2" strokeWidth={1.8} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default page;
