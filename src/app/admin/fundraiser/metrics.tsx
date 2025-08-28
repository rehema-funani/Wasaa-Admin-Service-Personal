import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ChevronDown,
  Filter,
  Users,
  DollarSign,
  LineChart,
  Activity,
  Eye,
  HelpCircle,
  Info,
  Printer,
  Loader,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  CheckCircle,
  Gift,
  FileText,
  Target,
} from "lucide-react";
import { format, subMonths, eachMonthOfInterval } from "date-fns";
import { toast } from "react-hot-toast";

const generatePerformanceMetrics = () => {
  const currentMonth = new Date();
  const previousMonth = subMonths(currentMonth, 1);
  const last6Months = eachMonthOfInterval({
    start: subMonths(currentMonth, 5),
    end: currentMonth,
  });

  const overallMetrics = {
    totalRaised: 547830,
    totalDonations: 4826,
    totalDonors: 3124,
    averageDonation: 113.5,
    successRate: 73,
    conversionRate: 3.4,
    activeHours: 18.7,
    campaignCompletionTime: 42,
  };

  const generateMonthlyGrowth = () => {
    let baseAmount = 40000;
    let baseCount = 350;

    return last6Months.map((month) => {
      const randomGrowth = 1 + (Math.random() * 0.3 - 0.05);
      baseAmount = Math.round(baseAmount * randomGrowth);
      baseCount = Math.round(baseCount * randomGrowth);

      return {
        month: format(month, "MMM yyyy"),
        amount: baseAmount,
        count: baseCount,
        uniqueDonors: Math.round(baseCount * 0.75),
        averageDonation: Math.round(baseAmount / baseCount),
        growthRate: Math.round((randomGrowth - 1) * 100),
      };
    });
  };

  const growthTrends = generateMonthlyGrowth();

  const campaignMetrics = {
    avgCompletionRate: 78,
    avgTimeToGoal: 42,
    avgDonorsPerCampaign: 76,
    campaignViewsToConversion: 4.2,
    repeatCampaignCreators: 34,
    avgCampaignViews: 1240,
    socialShares: 38,
    featuredPerformanceBoost: 210,
  };

  const engagementMetrics = {
    avgTimeOnPage: 3.4,
    bounceRate: 42,
    pageViewsPerVisit: 3.8,
    returnVisitRate: 29,
    socialShareClickRate: 4.6,
    commentRate: 2.3,
    newsletterSignupRate: 8.7,
    mobileUsage: 68,
  };

  const acquisitionMetrics = {
    organicTraffic: 48,
    directTraffic: 22,
    socialMediaTraffic: 17,
    referralTraffic: 9,
    emailTraffic: 4,
    costPerAcquisition: 1.2,
    conversionBySource: [
      { source: "Organic", rate: 3.8 },
      { source: "Direct", rate: 5.2 },
      { source: "Social", rate: 4.3 },
      { source: "Referral", rate: 7.1 },
      { source: "Email", rate: 9.4 },
    ],
  };

  const kpiTrends = {
    donationVolume: [
      {
        period: "Current Month",
        value: growthTrends[5].amount,
        change: growthTrends[5].growthRate,
      },
      {
        period: "Previous Month",
        value: growthTrends[4].amount,
        change: growthTrends[4].growthRate,
      },
      { period: "Year to Date", value: overallMetrics.totalRaised, change: 24 },
    ],
    donorAcquisition: [
      {
        period: "Current Month",
        value: growthTrends[5].uniqueDonors,
        change: Math.round(
          (growthTrends[5].uniqueDonors / growthTrends[4].uniqueDonors - 1) *
            100
        ),
      },
      {
        period: "Previous Month",
        value: growthTrends[4].uniqueDonors,
        change: Math.round(
          (growthTrends[4].uniqueDonors / growthTrends[3].uniqueDonors - 1) *
            100
        ),
      },
      { period: "Year to Date", value: overallMetrics.totalDonors, change: 31 },
    ],
    campaignSuccess: [
      { period: "Current Month", value: 82, change: 4 },
      { period: "Previous Month", value: 78, change: -2 },
      { period: "Year to Date", value: 73, change: 8 },
    ],
    conversionRate: [
      { period: "Current Month", value: 3.7, change: 0.3 },
      { period: "Previous Month", value: 3.4, change: -0.1 },
      { period: "Year to Date", value: 3.2, change: 0.4 },
    ],
  };

  const platformMetrics = {
    systemUptime: 99.98,
    avgPageLoadTime: 1.8,
    apiResponseTime: 320,
    errorRate: 0.12,
    mobileCompatibility: 97,
    accessibilityScore: 92,
    securityIncidents: 0,
    paymentProcessingTime: 2.4,
  };

  const benchmarks = {
    industryAvgDonation: 86,
    platformAvgDonation: 113.5,
    industryConversionRate: 2.8,
    platformConversionRate: 3.4,
    industryCampaignSuccess: 64,
    platformCampaignSuccess: 73,
    industryDonorRetention: 51,
    platformDonorRetention: 68,
  };

  return {
    overallMetrics,
    growthTrends,
    campaignMetrics,
    engagementMetrics,
    acquisitionMetrics,
    kpiTrends,
    platformMetrics,
    benchmarks,
  };
};

const PerformanceMetricsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState("month");
  const [showFilters, setShowFilters] = useState(false);
  type HelpTooltipKeys =
    | "totalRaised"
    | "totalDonors"
    | "successRate"
    | "conversionRate";
  const [showHelpTooltip, setShowHelpTooltip] = useState<
    Record<HelpTooltipKeys, boolean>
  >({
    totalRaised: false,
    totalDonors: false,
    successRate: false,
    conversionRate: false,
  });
  const [activeBenchmark, setActiveBenchmark] = useState("donation");
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const data = generatePerformanceMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error loading metrics data:", error);
        toast.error("Failed to load performance metrics");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleExport = (format) => {
    toast.success(`Metrics exported in ${format.toUpperCase()} format`);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    toast.success("Preparing metrics for printing...");
    // In a real app, you would use window.print() or a printing library
  };

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
    toast.success(`Timeframe updated to ${value}`);
    // In a real app, you would reload data based on the selected timeframe
  };

  const toggleHelpTooltip = (metricId) => {
    setShowHelpTooltip((prev) => ({
      ...prev,
      [metricId]: !prev[metricId],
    }));
  };

  // Get comparison indicator (up/down arrow with color)
  const getComparisonIndicator = (value) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight size={14} className="mr-1" />
          <span>+{value}%</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center text-red-600 dark:text-red-400">
          <ArrowDownRight size={14} className="mr-1" />
          <span>{value}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-slate-500 dark:text-gray-400">
          <span>0%</span>
        </div>
      );
    }
  };

  // Get platform vs industry comparison
  const getBenchmarkComparison = (platform, industry) => {
    const diff = Math.round(((platform - industry) / industry) * 100);
    return (
      <div className="flex items-center">
        <div
          className={`flex items-center ${
            diff >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {diff >= 0 ? (
            <ArrowUpRight size={14} className="mr-1" />
          ) : (
            <ArrowDownRight size={14} className="mr-1" />
          )}
          <span>
            {Math.abs(diff)}% {diff >= 0 ? "better" : "worse"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-full mx-auto max-w-[1600px]">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-light text-slate-900 dark:text-gray-100">
            Performance Metrics
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Detailed analytics and KPIs for the fundraising platform
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <motion.button
              className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm shadow-sm"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
              }}
              whileTap={{ y: 0 }}
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} className="mr-2" />
              <span>Export Metrics</span>
              <ChevronDown size={16} className="ml-2" />
            </motion.button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-100 dark:border-gray-700 py-1 z-10">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                  onClick={() => handleExport("pdf")}
                >
                  <FileText size={14} className="mr-2" />
                  Export as PDF
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                  onClick={() => handleExport("excel")}
                >
                  <FileText size={14} className="mr-2" />
                  Export as Excel
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                  onClick={() => handleExport("csv")}
                >
                  <FileText size={14} className="mr-2" />
                  Export as CSV
                </button>
                <div className="border-t border-slate-100 dark:border-gray-700 my-1"></div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                  onClick={handlePrint}
                >
                  <Printer size={14} className="mr-2" />
                  Print Metrics
                </button>
              </div>
            )}
          </div>

          <motion.button
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            <span>Filters</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Timeframe
                </label>
                <select
                  className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={timeframe}
                  onChange={(e) => handleTimeframeChange(e.target.value)}
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 90 Days</option>
                  <option value="year">Last 12 Months</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Campaign Category
                </label>
                <select className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Categories</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="DisasterRelief">Disaster Relief</option>
                  <option value="Community">Community</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Comparison
                </label>
                <select className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="previous">Previous Period</option>
                  <option value="year">Same Period Last Year</option>
                  <option value="target">Target Goals</option>
                  <option value="industry">Industry Benchmark</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={30} className="text-primary-500 animate-spin mr-3" />
          <span className="text-slate-500 dark:text-gray-400">
            Loading performance metrics...
          </span>
        </div>
      ) : metrics ? (
        <>
          {/* KPI Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Total Raised */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    Total Donations
                  </p>
                  <button
                    className="ml-1 text-slate-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
                    onClick={() => toggleHelpTooltip("totalRaised")}
                  >
                    <HelpCircle size={14} />
                  </button>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <DollarSign size={16} />
                </div>
              </div>
              {showHelpTooltip.totalRaised && (
                <div className="mb-2 text-xs bg-slate-50 dark:bg-gray-700 p-2 rounded text-slate-600 dark:text-gray-300">
                  Total amount raised across all campaigns during the selected
                  timeframe.
                </div>
              )}
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  ${metrics.overallMetrics.totalRaised.toLocaleString()}
                </p>
                {getComparisonIndicator(
                  metrics.kpiTrends.donationVolume[0].change
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {metrics.overallMetrics.totalDonations.toLocaleString()}{" "}
                donations
              </p>
            </div>

            {/* Donor Acquisition */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    Total Donors
                  </p>
                  <button
                    className="ml-1 text-slate-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
                    onClick={() => toggleHelpTooltip("totalDonors")}
                  >
                    <HelpCircle size={14} />
                  </button>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Users size={16} />
                </div>
              </div>
              {showHelpTooltip.totalDonors && (
                <div className="mb-2 text-xs bg-slate-50 dark:bg-gray-700 p-2 rounded text-slate-600 dark:text-gray-300">
                  Unique donors who have contributed to campaigns during the
                  selected timeframe.
                </div>
              )}
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  {metrics.overallMetrics.totalDonors.toLocaleString()}
                </p>
                {getComparisonIndicator(
                  metrics.kpiTrends.donorAcquisition[0].change
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {Math.round(
                  (metrics.overallMetrics.totalDonations /
                    metrics.overallMetrics.totalDonors) *
                    10
                ) / 10}{" "}
                donations per donor
              </p>
            </div>

            {/* Campaign Success Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    Campaign Success
                  </p>
                  <button
                    className="ml-1 text-slate-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
                    onClick={() => toggleHelpTooltip("successRate")}
                  >
                    <HelpCircle size={14} />
                  </button>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <CheckCircle size={16} />
                </div>
              </div>
              {showHelpTooltip.successRate && (
                <div className="mb-2 text-xs bg-slate-50 dark:bg-gray-700 p-2 rounded text-slate-600 dark:text-gray-300">
                  Percentage of campaigns that reach at least 80% of their
                  funding goal.
                </div>
              )}
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  {metrics.overallMetrics.successRate}%
                </p>
                {getComparisonIndicator(
                  metrics.kpiTrends.campaignSuccess[0].change
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Average goal completion:{" "}
                {metrics.overallMetrics.averageGoalCompletion}%
              </p>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    Conversion Rate
                  </p>
                  <button
                    className="ml-1 text-slate-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400"
                    onClick={() => toggleHelpTooltip("conversionRate")}
                  >
                    <HelpCircle size={14} />
                  </button>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Target size={16} />
                </div>
              </div>
              {showHelpTooltip.conversionRate && (
                <div className="mb-2 text-xs bg-slate-50 dark:bg-gray-700 p-2 rounded text-slate-600 dark:text-gray-300">
                  Percentage of campaign page visitors who make a donation.
                </div>
              )}
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  {metrics.overallMetrics.conversionRate}%
                </p>
                {getComparisonIndicator(
                  metrics.kpiTrends.conversionRate[0].change
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Industry average: {metrics.benchmarks.industryConversionRate}%
              </p>
            </div>
          </motion.div>

          {/* Main Metrics Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Growth Trends */}
            <motion.div
              className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Donation Growth Trends
                </h2>
                <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                  <span className="mr-2">Last 6 months</span>
                  <LineChart size={18} />
                </div>
              </div>
              <div className="p-4 h-80 flex items-center justify-center">
                <div className="w-full h-full flex flex-col">
                  <div className="flex-grow relative">
                    {/* This would be a real chart in a production app */}
                    <div className="absolute inset-0">
                      {metrics.growthTrends.map((month, index) => (
                        <div
                          key={index}
                          className="absolute bottom-0 bg-primary-500 rounded-t-sm"
                          style={{
                            left: `${
                              (index / metrics.growthTrends.length) * 100
                            }%`,
                            width: `${
                              (1 / metrics.growthTrends.length) * 100 - 2
                            }%`,
                            height: `${
                              (month.amount /
                                Math.max(
                                  ...metrics.growthTrends.map((m) => m.amount)
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      ))}
                      {/* Line for average donation */}
                      <div
                        className="absolute left-0 right-0 border-t-2 border-dashed border-purple-500 dark:border-purple-400"
                        style={{
                          bottom: `${
                            (metrics.growthTrends.reduce(
                              (acc, month) => acc + month.averageDonation,
                              0
                            ) /
                              metrics.growthTrends.length /
                              Math.max(
                                ...metrics.growthTrends.map((m) => m.amount)
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="h-6 flex">
                    {metrics.growthTrends.map((month, index) => (
                      <div
                        key={index}
                        className="flex-1 text-xs text-slate-500 dark:text-gray-400 text-center"
                      >
                        {month.month.substring(0, 3)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-gray-700 flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-sm mr-1"></div>
                  <span className="text-slate-600 dark:text-gray-400">
                    Monthly Donation Volume
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0 border-t-2 border-dashed border-purple-500 dark:border-purple-400 mr-1"></div>
                  <span className="text-slate-600 dark:text-gray-400">
                    Average Donation Size
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Performance Metrics Summary */}
            <motion.div
              className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Performance Summary
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-gray-700">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300">
                      Growth Rate
                    </h3>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                      <ArrowUpRight size={14} className="mr-1" />
                      <span>{metrics.growthTrends[5].growthRate}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Monthly growth in donation volume compared to previous
                    period
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300">
                      Campaign Performance
                    </h3>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                      <CheckCircle size={14} className="mr-1" />
                      <span>{metrics.campaignMetrics.avgCompletionRate}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Average campaign completion rate
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300">
                      Platform Efficiency
                    </h3>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                      <Zap size={14} className="mr-1" />
                      <span>{metrics.platformMetrics.avgPageLoadTime}s</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Average page load time across the platform
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300">
                      User Engagement
                    </h3>
                    <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                      <Eye size={14} className="mr-1" />
                      <span>{metrics.engagementMetrics.avgTimeOnPage} min</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Average time spent on campaign pages
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Benchmark Comparisons */}
            <motion.div
              className="col-span-12 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Industry Benchmarks
                </h2>
              </div>
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="space-x-1 bg-slate-100 dark:bg-gray-700 p-1 rounded-lg inline-flex mb-4">
                  {[
                    { id: "donation", label: "Donation" },
                    { id: "conversion", label: "Conversion" },
                    { id: "success", label: "Success" },
                    { id: "retention", label: "Retention" },
                  ].map((bench) => (
                    <button
                      key={bench.id}
                      className={`px-3 py-1 text-sm rounded-md ${
                        activeBenchmark === bench.id
                          ? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
                          : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                      }`}
                      onClick={() => setActiveBenchmark(bench.id)}
                    >
                      {bench.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                        <span className="text-sm text-slate-700 dark:text-gray-300">
                          Your Platform
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {activeBenchmark === "donation" &&
                          `$${metrics.benchmarks.platformAvgDonation}`}
                        {activeBenchmark === "conversion" &&
                          `${metrics.benchmarks.platformConversionRate}%`}
                        {activeBenchmark === "success" &&
                          `${metrics.benchmarks.platformCampaignSuccess}%`}
                        {activeBenchmark === "retention" &&
                          `${metrics.benchmarks.platformDonorRetention}%`}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-slate-300 dark:bg-gray-600 rounded-full mr-2"></div>
                        <span className="text-sm text-slate-700 dark:text-gray-300">
                          Industry Average
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {activeBenchmark === "donation" &&
                          `$${metrics.benchmarks.industryAvgDonation}`}
                        {activeBenchmark === "conversion" &&
                          `${metrics.benchmarks.industryConversionRate}%`}
                        {activeBenchmark === "success" &&
                          `${metrics.benchmarks.industryCampaignSuccess}%`}
                        {activeBenchmark === "retention" &&
                          `${metrics.benchmarks.industryDonorRetention}%`}
                      </span>
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div className="flex h-full">
                        <div
                          className="bg-primary-500 h-full"
                          style={{
                            width:
                              activeBenchmark === "donation"
                                ? `${
                                    (metrics.benchmarks.platformAvgDonation /
                                      (metrics.benchmarks.platformAvgDonation +
                                        metrics.benchmarks
                                          .industryAvgDonation)) *
                                    100
                                  }%`
                                : activeBenchmark === "conversion"
                                ? `${
                                    (metrics.benchmarks.platformConversionRate /
                                      (metrics.benchmarks
                                        .platformConversionRate +
                                        metrics.benchmarks
                                          .industryConversionRate)) *
                                    100
                                  }%`
                                : activeBenchmark === "success"
                                ? `${
                                    (metrics.benchmarks
                                      .platformCampaignSuccess /
                                      (metrics.benchmarks
                                        .platformCampaignSuccess +
                                        metrics.benchmarks
                                          .industryCampaignSuccess)) *
                                    100
                                  }%`
                                : `${
                                    (metrics.benchmarks.platformDonorRetention /
                                      (metrics.benchmarks
                                        .platformDonorRetention +
                                        metrics.benchmarks
                                          .industryDonorRetention)) *
                                    100
                                  }%`,
                          }}
                        ></div>
                        <div
                          className="bg-slate-300 dark:bg-gray-600 h-full"
                          style={{
                            width:
                              activeBenchmark === "donation"
                                ? `${
                                    (metrics.benchmarks.industryAvgDonation /
                                      (metrics.benchmarks.platformAvgDonation +
                                        metrics.benchmarks
                                          .industryAvgDonation)) *
                                    100
                                  }%`
                                : activeBenchmark === "conversion"
                                ? `${
                                    (metrics.benchmarks.industryConversionRate /
                                      (metrics.benchmarks
                                        .platformConversionRate +
                                        metrics.benchmarks
                                          .industryConversionRate)) *
                                    100
                                  }%`
                                : activeBenchmark === "success"
                                ? `${
                                    (metrics.benchmarks
                                      .industryCampaignSuccess /
                                      (metrics.benchmarks
                                        .platformCampaignSuccess +
                                        metrics.benchmarks
                                          .industryCampaignSuccess)) *
                                    100
                                  }%`
                                : `${
                                    (metrics.benchmarks.industryDonorRetention /
                                      (metrics.benchmarks
                                        .platformDonorRetention +
                                        metrics.benchmarks
                                          .industryDonorRetention)) *
                                    100
                                  }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      {getBenchmarkComparison(
                        activeBenchmark === "donation"
                          ? metrics.benchmarks.platformAvgDonation
                          : activeBenchmark === "conversion"
                          ? metrics.benchmarks.platformConversionRate
                          : activeBenchmark === "success"
                          ? metrics.benchmarks.platformCampaignSuccess
                          : metrics.benchmarks.platformDonorRetention,
                        activeBenchmark === "donation"
                          ? metrics.benchmarks.industryAvgDonation
                          : activeBenchmark === "conversion"
                          ? metrics.benchmarks.industryConversionRate
                          : activeBenchmark === "success"
                          ? metrics.benchmarks.industryCampaignSuccess
                          : metrics.benchmarks.industryDonorRetention
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-slate-700 dark:text-gray-300 font-medium">
                      {activeBenchmark === "donation" &&
                        "Average Donation Size"}
                      {activeBenchmark === "conversion" &&
                        "Visitor-to-Donor Conversion Rate"}
                      {activeBenchmark === "success" && "Campaign Success Rate"}
                      {activeBenchmark === "retention" &&
                        "Donor Retention Rate"}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      {activeBenchmark === "donation" &&
                        "Your platform's average donation is significantly higher than the industry average, indicating strong donor engagement and effective fundraising strategies."}
                      {activeBenchmark === "conversion" &&
                        "Your conversion rate outperforms the industry standard, showing effective campaign pages and donor journeys that successfully convert visitors into contributors."}
                      {activeBenchmark === "success" &&
                        "Your platform helps campaigns reach their goals at a higher rate than the industry average, demonstrating the effectiveness of your campaign tools and community."}
                      {activeBenchmark === "retention" &&
                        "Your donor retention rate exceeds industry benchmarks, indicating strong donor relationships, effective communication, and meaningful impact reporting."}
                    </p>
                    <div className="text-xs flex items-center">
                      <Info
                        size={14}
                        className="text-primary-500 mr-1 flex-shrink-0"
                      />
                      <span className="text-slate-600 dark:text-gray-400">
                        {activeBenchmark === "donation" &&
                          "Data sourced from Fundraising Effectiveness Project Q2 2025 Report"}
                        {activeBenchmark === "conversion" &&
                          "Data sourced from M+R Benchmarks 2025 Study"}
                        {activeBenchmark === "success" &&
                          "Data sourced from Crowdfunding Industry Report 2025"}
                        {activeBenchmark === "retention" &&
                          "Data sourced from Giving USA Foundation 2025 Annual Report"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Campaign Metrics */}
            <motion.div
              className="col-span-12 md:col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Campaign Metrics
                </h2>
                <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                  <Gift size={18} />
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Average Completion Rate
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.campaignMetrics.avgCompletionRate}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{
                          width: `${metrics.campaignMetrics.avgCompletionRate}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Average Time to Goal
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.campaignMetrics.avgTimeToGoal} days
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            (metrics.campaignMetrics.avgTimeToGoal / 90) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Average Donors per Campaign
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.campaignMetrics.avgDonorsPerCampaign}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${
                            (metrics.campaignMetrics.avgDonorsPerCampaign /
                              100) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Conversion Rate
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.campaignMetrics.campaignViewsToConversion}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${
                            (metrics.campaignMetrics.campaignViewsToConversion /
                              10) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Engagement Metrics */}
            <motion.div
              className="col-span-12 md:col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Engagement Metrics
                </h2>
                <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                  <Activity size={18} />
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Average Time on Page
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.engagementMetrics.avgTimeOnPage} minutes
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{
                          width: `${
                            (metrics.engagementMetrics.avgTimeOnPage / 5) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Bounce Rate
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.engagementMetrics.bounceRate}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${metrics.engagementMetrics.bounceRate}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Social Share Rate
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.engagementMetrics.socialShareClickRate}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{
                          width: `${
                            (metrics.engagementMetrics.socialShareClickRate /
                              10) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Mobile Usage
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {metrics.engagementMetrics.mobileUsage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${metrics.engagementMetrics.mobileUsage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Platform Health Metrics */}
            <motion.div
              className="col-span-12 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Platform Health
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-gray-700">
                <div className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-light text-emerald-600 dark:text-emerald-400 mb-1">
                      {metrics.platformMetrics.systemUptime}%
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      System Uptime
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-light text-blue-600 dark:text-blue-400 mb-1">
                      {metrics.platformMetrics.avgPageLoadTime}s
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      Page Load Time
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-light text-amber-600 dark:text-amber-400 mb-1">
                      {metrics.platformMetrics.apiResponseTime}ms
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      API Response Time
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-light text-red-600 dark:text-red-400 mb-1">
                      {metrics.platformMetrics.errorRate}%
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      Error Rate
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
          <span>
            Failed to load performance metrics. Please try again later.
          </span>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricsPage;
