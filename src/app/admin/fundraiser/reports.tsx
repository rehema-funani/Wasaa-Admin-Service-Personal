import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  PieChart,
  LineChart,
  TrendingUp,
  Download,
  ChevronDown,
  Filter,
  Users,
  DollarSign,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  FileText,
  Mail,
  ArrowRight,
  Loader,
  Info,
  AlertTriangle,
  Gift,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, addMonths, subMonths } from "date-fns";
import { toast } from "react-hot-toast";

const generateReportData = () => {
  const donationTrends = [];
  const today = new Date();
  const twelveMonthsAgo = subMonths(today, 11);
  
  const monthsRange = eachMonthOfInterval({
    start: twelveMonthsAgo,
    end: today
  });
  
  monthsRange.forEach((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const donationsCount = Math.floor(Math.random() * 200) + 50;
    const donationsAmount = Math.round((Math.random() * 25000 + 5000) / 100) * 100;
    const uniqueDonors = Math.floor(donationsCount * (0.7 + Math.random() * 0.2));
    const averageDonation = Math.round(donationsAmount / donationsCount);
    
    donationTrends.push({
      month: format(monthStart, "MMM yyyy"),
      date: monthStart,
      donationsCount,
      donationsAmount,
      uniqueDonors,
      averageDonation,
      recurringDonationsCount: Math.floor(donationsCount * (0.1 + Math.random() * 0.2)),
      recurringDonationsAmount: Math.round(donationsAmount * (0.1 + Math.random() * 0.2)),
    });
  });
  
  // Campaign performance data
  const campaignPerformance = [
    "Build a School in Rural Kenya",
    "Hurricane Relief Fund",
    "Cancer Treatment Support",
    "Community Garden Project",
    "Youth Basketball League",
    "Local Theater Renovation",
    "College Scholarship Fund",
    "Animal Shelter Expansion",
  ].map((title, index) => {
    const goal = Math.round((Math.random() * 50000 + 10000) / 100) * 100;
    const raised = Math.round((Math.random() * goal) / 100) * 100;
    return {
      id: `camp-${index + 1}`,
      title,
      goal,
      raised,
      progress: Math.round((raised / goal) * 100),
      donorsCount: Math.floor(Math.random() * 500) + 50,
      viewsCount: Math.floor(Math.random() * 5000) + 500,
      clickThroughRate: Math.round((Math.random() * 15 + 5) * 10) / 10,
      conversionRate: Math.round((Math.random() * 7 + 1) * 10) / 10,
      shareCount: Math.floor(Math.random() * 200) + 20,
    };
  });
  
  // Geographic distribution
  const geoDistribution = [
    { country: "Kenya", donorsCount: 342, amount: 18500 },
    { country: "United States", donorsCount: 156, amount: 25600 },
    { country: "United Kingdom", donorsCount: 89, amount: 12400 },
    { country: "Canada", donorsCount: 64, amount: 8900 },
    { country: "Australia", donorsCount: 43, amount: 7200 },
    { country: "Germany", donorsCount: 38, amount: 6100 },
    { country: "South Africa", donorsCount: 52, amount: 5800 },
    { country: "Nigeria", donorsCount: 47, amount: 4300 },
    { country: "Others", donorsCount: 127, amount: 15600 },
  ];
  
  // Payment methods
  const paymentMethods = [
    { method: "Credit Card", percentage: 42, count: 428, amount: 45600 },
    { method: "Mobile Money", percentage: 31, count: 326, amount: 28900 },
    { method: "Bank Transfer", percentage: 18, count: 187, amount: 19400 },
    { method: "PayPal", percentage: 9, count: 94, amount: 10500 },
  ];
  
  // Donor retention
  const donorRetention = {
    retentionRate: 68,
    returningDonors: 422,
    newDonors: 198,
    churned: 197,
    retentionTrend: [65, 63, 67, 68, 70, 69, 68], // Last 7 months
    donorLifetimeValue: 285,
    averageDonationsPerDonor: 2.4,
  };
  
  // Campaign categories performance
  const categoryPerformance = [
    { category: "Medical", campaigns: 12, donationsAmount: 68500, donorsCount: 523 },
    { category: "Education", campaigns: 9, donationsAmount: 52400, donorsCount: 412 },
    { category: "Disaster Relief", campaigns: 5, donationsAmount: 47800, donorsCount: 378 },
    { category: "Community", campaigns: 8, donationsAmount: 32900, donorsCount: 297 },
    { category: "Arts", campaigns: 6, donationsAmount: 25600, donorsCount: 216 },
    { category: "Sports", campaigns: 4, donationsAmount: 19700, donorsCount: 163 },
  ];
  
  // Overall metrics
  const overallMetrics = {
    totalRaised: donationTrends.reduce((sum, month) => sum + month.donationsAmount, 0),
    totalDonations: donationTrends.reduce((sum, month) => sum + month.donationsCount, 0),
    totalDonors: Math.floor(donationTrends.reduce((sum, month) => sum + month.uniqueDonors, 0) * 0.7), // Accounting for repeat donors
    activeCampaigns: 15,
    completedCampaigns: 8,
    successRate: 74,
    averageCampaignLength: 68, // days
    averageGoalCompletion: 83, // percentage
  };
  
  return {
    donationTrends,
    campaignPerformance,
    geoDistribution,
    paymentMethods,
    donorRetention,
    categoryPerformance,
    overallMetrics,
  };
};

const CampaignReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState("last12Months");
  const [showFilters, setShowFilters] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [reportType, setReportType] = useState("overview");
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    // Simulate API request
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const data = generateReportData();
        setReportData(data);
      } catch (error) {
        console.error("Error loading report data:", error);
        toast.error("Failed to load report data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleExport = (format) => {
    toast.success(`Report exported in ${format.toUpperCase()} format`);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    toast.success("Preparing report for printing...");
    // In a real app, you would use window.print() or a printing library
  };

  const handleShareReport = () => {
    toast.success("Share options opened");
    // In a real app, you would implement sharing functionality
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    toast.success(`Date range updated to ${range}`);
    // In a real app, you would reload data based on the selected range
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  // Helper function to calculate percentage change
  const calculateChange = (current, previous) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Get metrics for KPI cards
  const getMetrics = () => {
    if (!reportData) return {};

    const { donationTrends, overallMetrics } = reportData;

    // Get current and previous month data
    const currentMonth = donationTrends[donationTrends.length - 1];
    const previousMonth = donationTrends[donationTrends.length - 2];

    const donationsChange = calculateChange(
      currentMonth.donationsAmount,
      previousMonth.donationsAmount
    );

    const donorsChange = calculateChange(
      currentMonth.uniqueDonors,
      previousMonth.uniqueDonors
    );

    const averageDonationChange = calculateChange(
      currentMonth.averageDonation,
      previousMonth.averageDonation
    );

    const conversionRateChange = calculateChange(
      reportData.campaignPerformance[0].conversionRate,
      reportData.campaignPerformance[1].conversionRate
    );

    return {
      currentMonthDonations: currentMonth.donationsAmount,
      donationsChange,
      currentMonthDonors: currentMonth.uniqueDonors,
      donorsChange,
      currentAverageDonation: currentMonth.averageDonation,
      averageDonationChange,
      conversionRate: reportData.campaignPerformance[0].conversionRate,
      conversionRateChange,
      totalRaised: overallMetrics.totalRaised,
      totalDonors: overallMetrics.totalDonors,
      successRate: overallMetrics.successRate,
    };
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
            Campaign Reports
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Analytics and insights for fundraising campaigns
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
              <span>Export Report</span>
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
                  Print Report
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                  onClick={handleShareReport}
                >
                  <Mail size={14} className="mr-2" />
                  Email Report
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
                  Date Range
                </label>
                <select
                  className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={dateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                >
                  <option value="last30Days">Last 30 Days</option>
                  <option value="last90Days">Last 90 Days</option>
                  <option value="last6Months">Last 6 Months</option>
                  <option value="last12Months">Last 12 Months</option>
                  <option value="thisYear">This Year</option>
                  <option value="lastYear">Last Year</option>
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
                  Geographic Region
                </label>
                <select className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Regions</option>
                  <option value="Africa">Africa</option>
                  <option value="Europe">Europe</option>
                  <option value="NorthAmerica">North America</option>
                  <option value="SouthAmerica">South America</option>
                  <option value="Asia">Asia</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Type Tabs */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-2 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex overflow-x-auto space-x-1">
          {["overview", "donations", "campaigns", "donors", "geography"].map(
            (type) => (
              <button
                key={type}
                onClick={() => handleReportTypeChange(type)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  reportType === type
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {type === "overview" && (
                  <BarChart2 size={16} className="inline mr-2" />
                )}
                {type === "donations" && (
                  <DollarSign size={16} className="inline mr-2" />
                )}
                {type === "campaigns" && (
                  <Gift size={16} className="inline mr-2" />
                )}
                {type === "donors" && (
                  <Users size={16} className="inline mr-2" />
                )}
                {type === "geography" && (
                  <Globe size={16} className="inline mr-2" />
                )}
                {type.charAt(0).toUpperCase() + type.slice(1)} Report
              </button>
            )
          )}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={30} className="text-primary-500 animate-spin mr-3" />
          <span className="text-slate-500 dark:text-gray-400">
            Loading report data...
          </span>
        </div>
      ) : reportData ? (
        <>
          {/* KPI Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Monthly Donations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Monthly Donations
                </p>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  ${getMetrics().currentMonthDonations?.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    getMetrics().donationsChange >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {getMetrics().donationsChange >= 0 ? (
                    <ArrowUpRight size={12} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={12} className="mr-1" />
                  )}
                  <span>
                    {Math.abs(getMetrics().donationsChange)}% from last month
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Donors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Monthly Donors
                </p>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Users size={16} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  {getMetrics().currentMonthDonors?.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    getMetrics().donorsChange >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {getMetrics().donorsChange >= 0 ? (
                    <ArrowUpRight size={12} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={12} className="mr-1" />
                  )}
                  <span>
                    {Math.abs(getMetrics().donorsChange)}% from last month
                  </span>
                </div>
              </div>
            </div>

            {/* Average Donation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Average Donation
                </p>
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  ${getMetrics().currentAverageDonation?.toLocaleString()}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    getMetrics().averageDonationChange >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {getMetrics().averageDonationChange >= 0 ? (
                    <ArrowUpRight size={12} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={12} className="mr-1" />
                  )}
                  <span>
                    {Math.abs(getMetrics().averageDonationChange)}% from last
                    month
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                  Conversion Rate
                </p>
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <PieChart size={16} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
                  {getMetrics().conversionRate}%
                </p>
                <div
                  className={`flex items-center text-xs ${
                    getMetrics().conversionRateChange >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {getMetrics().conversionRateChange >= 0 ? (
                    <ArrowUpRight size={12} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={12} className="mr-1" />
                  )}
                  <span>
                    {Math.abs(getMetrics().conversionRateChange)}% from last
                    month
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Report Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Overview Report */}
            {reportType === "overview" && (
              <>
                {/* Total Statistics */}
                <motion.div
                  className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                      Total Statistics
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-gray-400">
                          Total Raised
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          $
                          {reportData.overallMetrics.totalRaised.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-gray-400">
                          Total Donations
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reportData.overallMetrics.totalDonations.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-gray-400">
                          Total Donors
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reportData.overallMetrics.totalDonors.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-gray-400">
                          Active Campaigns
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reportData.overallMetrics.activeCampaigns}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-gray-400">
                          Completed Campaigns
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reportData.overallMetrics.completedCampaigns}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-gray-400">
                          Campaign Success Rate
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reportData.overallMetrics.successRate}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-gray-400">
                          Avg. Campaign Length
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reportData.overallMetrics.averageCampaignLength} days
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Monthly Trends Chart */}
                <motion.div
                  className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                      Monthly Donation Trends
                    </h2>
                    <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                      <span className="mr-2">Last 12 months</span>
                      <LineChart size={18} />
                    </div>
                  </div>
                  <div className="p-4 h-80 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col">
                      <div className="flex-grow relative">
                        {/* This would be a real chart in a production app */}
                        <div className="absolute inset-0">
                          {reportData.donationTrends.map((month, index) => (
                            <div
                              key={index}
                              className="absolute bottom-0 bg-primary-500 rounded-t-sm"
                              style={{
                                left: `${
                                  (index / reportData.donationTrends.length) *
                                  100
                                }%`,
                                width: `${
                                  (1 / reportData.donationTrends.length) * 100 -
                                  2
                                }%`,
                                height: `${
                                  (month.donationsAmount /
                                    Math.max(
                                      ...reportData.donationTrends.map(
                                        (m) => m.donationsAmount
                                      )
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
                                (reportData.donationTrends.reduce(
                                  (acc, month) => acc + month.averageDonation,
                                  0
                                ) /
                                  reportData.donationTrends.length /
                                  Math.max(
                                    ...reportData.donationTrends.map(
                                      (m) => m.donationsAmount
                                    )
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="h-6 flex">
                        {reportData.donationTrends.map((month, index) => (
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
                </motion.div>

                {/* Campaign Performance */}
                <motion.div
                  className="col-span-12 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                      Campaign Performance
                    </h2>
                    <button className="text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center">
                      View All Campaigns
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-gray-700 border-b border-slate-100 dark:border-gray-600">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                            Campaign
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                            Goal
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                            Raised
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                            Donors
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                            Conversion
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.campaignPerformance.map(
                          (campaign, index) => (
                            <tr
                              key={campaign.id}
                              className={`border-b border-slate-100 dark:border-gray-600 ${
                                index % 2 === 0
                                  ? "bg-white dark:bg-gray-800"
                                  : "bg-slate-50/30 dark:bg-gray-700/30"
                              } hover:bg-slate-50 dark:hover:bg-gray-700`}
                            >
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {campaign.title}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-gray-400">
                                ${campaign.goal.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-gray-400">
                                ${campaign.raised.toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                                    <div
                                      className="h-full bg-primary-500 rounded-full"
                                      style={{ width: `${campaign.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-slate-600 dark:text-gray-400">
                                    {campaign.progress}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-gray-400">
                                {campaign.donorsCount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-gray-400">
                                {campaign.conversionRate}%
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Category Performance */}
                <motion.div
                  className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                      Category Performance
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {reportData.categoryPerformance.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-700 dark:text-gray-300">
                              {category.category}
                            </span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              ${category.donationsAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                index === 0
                                  ? "bg-primary-500"
                                  : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                  ? "bg-emerald-500"
                                  : index === 3
                                  ? "bg-amber-500"
                                  : index === 4
                                  ? "bg-purple-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${
                                  (category.donationsAmount /
                                    Math.max(
                                      ...reportData.categoryPerformance.map(
                                        (c) => c.donationsAmount
                                      )
                                    )) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400 mt-1">
                            <span>{category.campaigns} campaigns</span>
                            <span>{category.donorsCount} donors</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Geographic Distribution */}
                <motion.div
                  className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                      Geographic Distribution
                    </h2>
                    <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                      <Globe size={18} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {reportData.geoDistribution.map((geo, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-700 dark:text-gray-300">
                              {geo.country}
                            </span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              ${geo.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{
                                width: `${
                                  (geo.amount /
                                    Math.max(
                                      ...reportData.geoDistribution.map(
                                        (g) => g.amount
                                      )
                                    )) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400 mt-1">
                            <span>{geo.donorsCount} donors</span>
                            <span>
                              {Math.round(
                                (geo.amount /
                                  reportData.overallMetrics.totalRaised) *
                                  100
                              )}
                              % of total
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Donations Report */}
            {reportType === "donations" && (
              <>
                <div className="col-span-12">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <Info size={18} className="mr-2 flex-shrink-0" />
                    <span>
                      The Donations Report section would display detailed
                      donation analytics, trends over time, payment method
                      breakdowns, and recurring donation statistics.
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Campaigns Report */}
            {reportType === "campaigns" && (
              <>
                <div className="col-span-12">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <Info size={18} className="mr-2 flex-shrink-0" />
                    <span>
                      The Campaigns Report section would display detailed
                      campaign performance metrics, success rates by category,
                      campaign duration analysis, and goal achievement
                      statistics.
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Donors Report */}
            {reportType === "donors" && (
              <>
                <div className="col-span-12">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <Info size={18} className="mr-2 flex-shrink-0" />
                    <span>
                      The Donors Report section would display donor acquisition
                      trends, retention rates, lifetime value analysis, and
                      demographic information about your donor base.
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Geography Report */}
            {reportType === "geography" && (
              <>
                <div className="col-span-12">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <Info size={18} className="mr-2 flex-shrink-0" />
                    <span>
                      The Geographic Report section would display an interactive
                      map with donation distribution, regional campaign
                      performance, and location-based donor analytics.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
          <span>Failed to load report data. Please try again later.</span>
        </div>
      )}
    </div>
  );
};

export default CampaignReportsPage;