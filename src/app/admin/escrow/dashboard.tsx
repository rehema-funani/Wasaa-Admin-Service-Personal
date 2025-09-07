import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Filter,
  Calendar,
  ArrowRight,
  Shield,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  FileText,
  Activity,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { escrowService } from "../../../api/services/escrow";
import MonthlyEscrowTransactionsChart from "../../../components/escrow/MonthlyEscrowTransactionsChart";
import DisputeResolution from "../../../components/escrow/DisputeResolution";
import VolumeTrends from "../../../components/escrow/VolumeTrends";

const EscrowDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedQuarter, setSelectedQuarter] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [disputeData, setDisputeData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  
  const [activeStats, setActiveStats] = useState<any>(null);
  const [pendingDisputes, setPendingDisputes] = useState<any[]>([]);
  const [volumeMetrics, setVolumeMetrics] = useState<any>(null);
  const [escrowData, setEscrowData] = useState<any[]>([]);
  const [transactionTrends, setTransactionTrends] = useState<any[]>([]);


   useEffect(() => {
     fetchDashboardData();
   }, [selectedPeriod, selectedYear, selectedMonth, selectedQuarter]);

   useEffect(() => {
      fetchTransactionTrends();
      fetchDisputeStats();
      fetchEScrowVolumeTrends();
   }, []);

   const fetchTransactionTrends = async () => {
      try {
        const trends = await escrowService.getTransactionReports();
        setTransactionTrends(trends);
      } catch (error) {
        console.error("Error fetching transaction trends:", error);
      }
   }

   const fetchDisputeStats = async () => {
      try {
        const disputes = await escrowService.getDisputeReports();
        setDisputeData(disputes);
      } catch (error) {
        console.error("Error fetching dispute stats:", error);
      }
   }

   const fetchEScrowVolumeTrends = async () => {
      try {
        const volumeTrends = await escrowService.getEscrowVolumeTrend();
        setVolumeData(volumeTrends);
      } catch (error) {
        console.error("Error fetching escrow volume trends:", error);
      }
   }

   const fetchDashboardData = async () => {
     setIsLoading(true);
     try {
       const [stats, disputes, volume] = await Promise.all([
         escrowService.getActiveEscrowStats(),
         escrowService.getPendingDisputes(),
         escrowService.getTotalVolumeMetrics(),
       ]);

       setActiveStats(stats);
       setPendingDisputes(disputes);
       setVolumeMetrics(volume);
     } catch (error) {
       console.error("Error fetching dashboard data:", error);
     } finally {
       setIsLoading(false);
     }
   };

   const formatCurrency = (amount: number, abbreviated = false) => {
     if (abbreviated && amount >= 1000000) {
       return `KES ${(amount / 1000000).toFixed(1)}M`;
     } else if (abbreviated && amount >= 1000) {
       return `KES ${(amount / 1000).toFixed(0)}K`;
     }
     return `KES ${amount.toLocaleString()}`;
   };

   const formatPercentageChange = (change: number) => {
     const sign = change >= 0 ? "+" : "";
     return `${sign}${change.toFixed(1)}%`;
   };

   const dashboardStats = {
     activeEscrows: {
       current: activeStats?.currentCount || 0,
       previous: activeStats?.previousCount || 0,
       change: activeStats?.percentChange || 0,
     },
     pendingDisputesCount: {
       current: pendingDisputes?.currentCount || 0,
       previous: activeStats?.previousCount || 0,
       change: activeStats?.percentChange || 0,
     },
     totalVolume: {
       current: volumeMetrics?.currentVolume || 0,
       previous: volumeMetrics?.previousVolume || 0,
       change: volumeMetrics?.percentChange || 0,
     },
     fraudAlerts: {
       current: activeStats?.fraudAlertCount || 0,
       actionRequired: activeStats?.fraudAlertsRequiringAction || 0,
     },
   };

  const monthlyEscrowData = [
    {
      name: "Jan",
      totalEscrows: 2450,
      activeEscrows: 1890,
      releasedEscrows: 2180,
      disputedEscrows: 95,
      volume: 125000000,
    },
    {
      name: "Feb",
      totalEscrows: 2780,
      activeEscrows: 2150,
      releasedEscrows: 2520,
      disputedEscrows: 110,
      volume: 142000000,
    },
    {
      name: "Mar",
      totalEscrows: 3150,
      activeEscrows: 2480,
      releasedEscrows: 2890,
      disputedEscrows: 125,
      volume: 168000000,
    },
    {
      name: "Apr",
      totalEscrows: 3680,
      activeEscrows: 2950,
      releasedEscrows: 3420,
      disputedEscrows: 95,
      volume: 195000000,
    },
  ];

  const disputeStatusData = [
    { name: "Resolved - Buyer Favor", value: 45, count: 892 },
    { name: "Resolved - Seller Favor", value: 35, count: 694 },
    { name: "Under Review", value: 12, count: 238 },
    { name: "Escalated", value: 5, count: 99 },
    { name: "Pending Evidence", value: 3, count: 59 },
  ];

  const riskAssessmentData = [
    { name: "Jan", lowRisk: 85, mediumRisk: 12, highRisk: 3 },
    { name: "Feb", lowRisk: 82, mediumRisk: 15, highRisk: 3 },
    { name: "Mar", lowRisk: 88, mediumRisk: 10, highRisk: 2 },
    { name: "Apr", lowRisk: 91, mediumRisk: 7, highRisk: 2 },
  ];

  const escrowVolumeData = [
    { name: "Jan", volume: 125000000, transactions: 2450, avgValue: 51020 },
    { name: "Feb", volume: 142000000, transactions: 2780, avgValue: 51079 },
    { name: "Mar", volume: 168000000, transactions: 3150, avgValue: 53333 },
    { name: "Apr", volume: 195000000, transactions: 3680, avgValue: 52989 },
  ];

  const complianceMetrics = [
    { metric: "KYC Verification Rate", value: "98.5%", change: "+1.2%" },
    {
      metric: "AML Flag Resolution Time",
      value: "4.2 hrs",
      change: "-0.8 hrs",
    },
    { metric: "SAR Submissions", value: "23", change: "+5" },
    {
      metric: "Dispute Resolution Time",
      value: "18.5 hrs",
      change: "-2.3 hrs",
    },
    { metric: "Fraud Detection Rate", value: "0.08%", change: "-0.02%" },
    { metric: "Compliance Score", value: "96.8%", change: "+2.1%" },
    { metric: "Escrow Success Rate", value: "97.4%", change: "+0.6%" },
    { metric: "Average Escrow Value", value: "KES 52,989", change: "+3.8%" },
  ];

  const COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setEscrowData(monthlyEscrowData);
      setDisputeData(disputeStatusData);
      setRiskData(riskAssessmentData);
      setVolumeData(escrowVolumeData);
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedYear, selectedMonth, selectedQuarter]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-KE").format(value);
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
            TrustBridge Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor escrow transactions, disputes, and compliance metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 flex items-center">
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
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm"
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
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Filter size={16} className="mr-2" strokeWidth={1.8} />
            Filters
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Active Escrows
              </p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 w-20 rounded mt-1"></div>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {dashboardStats.activeEscrows.current.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      dashboardStats.activeEscrows.change >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatPercentageChange(
                      dashboardStats.activeEscrows.change
                    )}{" "}
                    from last period
                  </p>
                </>
              )}
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Pending Disputes
              </p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 w-16 rounded mt-1"></div>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {dashboardStats.pendingDisputesCount.current}
                  </p>
                  <p
                    className={`text-sm ${
                      dashboardStats.pendingDisputesCount.change <= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatPercentageChange(
                      dashboardStats.pendingDisputesCount.change
                    )}{" "}
                    from last period
                  </p>
                </>
              )}
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Volume
              </p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 w-24 rounded mt-1"></div>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {formatCurrency(dashboardStats.totalVolume.current, true)}
                  </p>
                  <p
                    className={`text-sm ${
                      dashboardStats.totalVolume.change >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatPercentageChange(dashboardStats.totalVolume.change)}{" "}
                    from last period
                  </p>
                </>
              )}
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Fraud Alerts
              </p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 w-12 rounded mt-1"></div>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {dashboardStats.fraudAlerts.current}
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 text-sm">
                    {dashboardStats.fraudAlerts.actionRequired} require action
                  </p>
                </>
              )}
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5 lg:col-span-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Escrow Transaction Trends
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Monthly escrow activity and status distribution
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Active
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Released
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Disputed
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
              <MonthlyEscrowTransactionsChart
                formatNumber={formatNumber}
                escrowData={transactionTrends}
              />
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Dispute Resolution
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Current dispute status breakdown
            </p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <DisputeResolution disputeData={disputeData} COLORS={COLORS} />
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Risk Assessment Distribution
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Monthly risk scoring trends (percentage)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Low Risk
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Medium Risk
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  High Risk
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
                  data={riskData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="lowRisk"
                    stackId="1"
                    stroke="#10b981"
                    fill="#6ee7b7"
                  />
                  <Area
                    type="monotone"
                    dataKey="mediumRisk"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#fcd34d"
                  />
                  <Area
                    type="monotone"
                    dataKey="highRisk"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#fca5a5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Escrow Volume Trends
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Monthly transaction volume in KES
            </p>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
              </div>
            ) : (
              <VolumeTrends volumeData={volumeData} formatCurrency={formatCurrency} />
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Compliance & Performance Metrics
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Key compliance and operational performance indicators
          </p>
        </div>
        <div className="h-60 overflow-y-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md w-full h-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {complianceMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {metric.metric}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {metric.value}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      metric.change.startsWith("+")
                        ? "text-green-600 dark:text-green-400"
                        : metric.change.startsWith("-") &&
                          metric.metric.includes("Time")
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quick Actions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Frequently used escrow management actions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <Eye
                size={16}
                className="mr-2 text-blue-600 dark:text-blue-400"
                strokeWidth={1.8}
              />
              Review Pending
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <AlertTriangle
                size={16}
                className="mr-2 text-amber-600 dark:text-amber-400"
                strokeWidth={1.8}
              />
              Resolve Disputes
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <CheckCircle
                size={16}
                className="mr-2 text-green-600 dark:text-green-400"
                strokeWidth={1.8}
              />
              KYC Verification
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ y: 0 }}
            >
              <Shield
                size={16}
                className="mr-2 text-red-600 dark:text-red-400"
                strokeWidth={1.8}
              />
              AML Review
            </motion.button>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <motion.button
            className="flex items-center px-4 py-2 bg-primary-600 text-white dark:bg-primary-700 dark:text-gray-100 rounded-xl text-sm hover:bg-primary-700 dark:hover:bg-primary-600"
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

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Recent Activity
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Latest escrow transactions and system alerts
            </p>
          </div>
          <motion.button
            className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
            whileHover={{ y: -1 }}
          >
            View All
          </motion.button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Escrow #TXN-2025-001247 released
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  KES 250,000 • 2 minutes ago
                </p>
              </div>
            </div>
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
              Completed
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Dispute raised for #TXN-2025-001245
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Non-delivery claim • 15 minutes ago
                </p>
              </div>
            </div>
            <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full">
              Pending
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  High-value escrow created
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  KES 2,500,000 • 32 minutes ago
                </p>
              </div>
            </div>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
              Review Required
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  AML alert triggered
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  User flagged for review • 1 hour ago
                </p>
              </div>
            </div>
            <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
              Action Required
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Priority Alerts
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Critical items requiring immediate attention
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    5 escrows {">"} 72h pending approval
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-300">
                    SLA breach risk
                  </p>
                </div>
              </div>
              <motion.button
                className="text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Review
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    12 KYC documents expiring in 7 days
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-300">
                    Renewal required
                  </p>
                </div>
              </div>
              <motion.button
                className="text-xs bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 px-3 py-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Notify
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    3 high-value escrows ({">"}KES 5M)
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Awaiting compliance clearance
                  </p>
                </div>
              </div>
              <motion.button
                className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Process
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.3 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              System Health
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Platform performance and operational status
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                API Response Time
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  142ms
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Transaction Success Rate
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "97%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  97.4%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Fraud Detection Accuracy
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  94.2%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Compliance Processing
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  78%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Transaction Pipeline
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Current status distribution
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Pending Approval
                </span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                432
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Active Escrow
                </span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                2,950
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  In Dispute
                </span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                95
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Pending Release
                </span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                156
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Completed Today
                </span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                1,247
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.5 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Top User Segments
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Most active user categories
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  SME Businesses
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  42% of volume
                </p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                KES 82M
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Individual Traders
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  35% of volume
                </p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                KES 68M
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  E-commerce
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  18% of volume
                </p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                KES 35M
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Freelancers
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  5% of volume
                </p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                KES 10M
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.6 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Geographic Distribution
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Escrow activity by region
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  🇰🇪 Kenya
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  65%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2,392 transactions
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  🇳🇬 Nigeria
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  20%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  736 transactions
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  🇿🇦 South Africa
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  10%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  368 transactions
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  🌍 Others
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  5%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  184 transactions
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.7 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Security & Fraud Detection
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Real-time security monitoring and threat assessment
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                System Secure
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-1 rounded-full">
                Normal
              </span>
            </div>
            <p className="text-lg font-semibold text-green-800 dark:text-green-200">
              99.2%
            </p>
            <p className="text-sm text-green-600 dark:text-green-300">
              Fraud Prevention Rate
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              24/7
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Monitoring Status
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 px-2 py-1 rounded-full">
                Medium
              </span>
            </div>
            <p className="text-lg font-semibold text-amber-800 dark:text-amber-200">
              7
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-300">
              Pending Investigations
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-2 py-1 rounded-full">
                Updated
              </span>
            </div>
            <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
              3
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-300">
              SARs Filed This Month
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EscrowDashboard;
