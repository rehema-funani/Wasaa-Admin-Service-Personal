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
  Clock,
  Users,
  FileText,
  CheckCircle,
  ExternalLink,
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
  Database
} from "lucide-react";

const TransactionReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortField, setSortField] = useState("generatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock transaction reports data
  const mockReports = [
    {
      id: "RPT-TXN-2025-001120",
      name: "Daily Transaction Summary",
      type: "daily_summary",
      status: "completed",
      generatedAt: "2025-01-08T23:59:00Z",
      generatedBy: "System Auto-Generate",
      period: "2025-01-08",
      periodType: "daily",
      totalTransactions: 1247,
      totalVolume: 45600000,
      currency: "KES",
      successfulTransactions: 1198,
      failedTransactions: 49,
      successRate: 96.1,
      averageAmount: 36597,
      categories: {
        goods: 523,
        services: 389,
        digital: 245,
        real_estate: 90,
      },
      paymentMethods: {
        wallet: 489,
        mobile_money: 356,
        bank_transfer: 278,
        card: 124,
      },
      fileSize: "2.3 MB",
      downloadCount: 15,
      lastDownloaded: "2025-01-09T08:30:00Z",
      recipients: ["admin@wasaachat.com", "finance@wasaachat.com"],
      description:
        "Comprehensive daily transaction activity report including volume, success rates, and category breakdowns",
    },
    {
      id: "RPT-TXN-2025-001119",
      name: "Weekly Performance Analytics",
      type: "weekly_analytics",
      status: "completed",
      generatedAt: "2025-01-07T23:59:00Z",
      generatedBy: "Jane W. (Admin)",
      period: "2025-01-01 to 2025-01-07",
      periodType: "weekly",
      totalTransactions: 8934,
      totalVolume: 324500000,
      currency: "KES",
      successfulTransactions: 8567,
      failedTransactions: 367,
      successRate: 95.9,
      averageAmount: 36324,
      categories: {
        goods: 3721,
        services: 2845,
        digital: 1789,
        real_estate: 579,
      },
      paymentMethods: {
        wallet: 3456,
        mobile_money: 2789,
        bank_transfer: 1934,
        card: 755,
      },
      fileSize: "15.7 MB",
      downloadCount: 28,
      lastDownloaded: "2025-01-08T14:22:00Z",
      recipients: [
        "admin@wasaachat.com",
        "finance@wasaachat.com",
        "compliance@wasaachat.com",
      ],
      description:
        "Weekly transaction trends, performance metrics, and comparative analysis with previous periods",
    },
    {
      id: "RPT-TXN-2025-001118",
      name: "Monthly Compliance Report",
      type: "compliance_monthly",
      status: "completed",
      generatedAt: "2025-01-01T00:15:00Z",
      generatedBy: "Paul K. (Compliance)",
      period: "December 2024",
      periodType: "monthly",
      totalTransactions: 35678,
      totalVolume: 1250000000,
      currency: "KES",
      successfulTransactions: 34234,
      failedTransactions: 1444,
      successRate: 95.9,
      averageAmount: 35024,
      categories: {
        goods: 14567,
        services: 12345,
        digital: 6234,
        real_estate: 2532,
      },
      paymentMethods: {
        wallet: 13456,
        mobile_money: 11234,
        bank_transfer: 7834,
        card: 3154,
      },
      fileSize: "45.2 MB",
      downloadCount: 45,
      lastDownloaded: "2025-01-05T16:45:00Z",
      recipients: [
        "compliance@wasaachat.com",
        "legal@wasaachat.com",
        "ceo@wasaachat.com",
      ],
      description:
        "Monthly regulatory compliance report including AML metrics, threshold monitoring, and audit trails",
    },
    {
      id: "RPT-TXN-2025-001117",
      name: "High Value Transactions Report",
      type: "high_value",
      status: "completed",
      generatedAt: "2025-01-06T18:30:00Z",
      generatedBy: "System Auto-Generate",
      period: "2025-01-01 to 2025-01-06",
      periodType: "custom",
      totalTransactions: 234,
      totalVolume: 567800000,
      currency: "KES",
      successfulTransactions: 228,
      failedTransactions: 6,
      successRate: 97.4,
      averageAmount: 2427350,
      categories: {
        real_estate: 145,
        goods: 56,
        services: 33,
        digital: 0,
      },
      paymentMethods: {
        bank_transfer: 189,
        wallet: 34,
        mobile_money: 11,
        card: 0,
      },
      fileSize: "8.9 MB",
      downloadCount: 22,
      lastDownloaded: "2025-01-07T10:15:00Z",
      recipients: ["compliance@wasaachat.com", "risk@wasaachat.com"],
      description:
        "Detailed analysis of transactions above KES 1,000,000 threshold with enhanced due diligence data",
    },
    {
      id: "RPT-TXN-2025-001116",
      name: "Payment Method Analysis",
      type: "payment_analysis",
      status: "generating",
      generatedAt: "2025-01-08T16:00:00Z",
      generatedBy: "Mark T. (Analytics)",
      period: "Q4 2024",
      periodType: "quarterly",
      totalTransactions: 0,
      totalVolume: 0,
      currency: "KES",
      successfulTransactions: 0,
      failedTransactions: 0,
      successRate: 0,
      averageAmount: 0,
      categories: {},
      paymentMethods: {},
      fileSize: "0 MB",
      downloadCount: 0,
      lastDownloaded: null,
      recipients: ["product@wasaachat.com", "finance@wasaachat.com"],
      description:
        "Quarterly analysis of payment method preferences, success rates, and transaction patterns by method",
    },
    {
      id: "RPT-TXN-2025-001115",
      name: "Failed Transaction Analysis",
      type: "failure_analysis",
      status: "failed",
      generatedAt: "2025-01-05T12:00:00Z",
      generatedBy: "System Auto-Generate",
      period: "2025-01-04",
      periodType: "daily",
      totalTransactions: 0,
      totalVolume: 0,
      currency: "KES",
      successfulTransactions: 0,
      failedTransactions: 0,
      successRate: 0,
      averageAmount: 0,
      categories: {},
      paymentMethods: {},
      fileSize: "0 MB",
      downloadCount: 0,
      lastDownloaded: null,
      recipients: ["tech@wasaachat.com", "support@wasaachat.com"],
      description:
        "Analysis of transaction failures, error patterns, and recommendations for system improvements",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setReports(mockReports);
      setFilteredReports(mockReports);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = reports.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || report.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      let matchesPeriod = true;
      if (periodFilter !== "all") {
        matchesPeriod = report.periodType === periodFilter;
      }

      return matchesSearch && matchesType && matchesStatus && matchesPeriod;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (
        sortField === "totalTransactions" ||
        sortField === "totalVolume" ||
        sortField === "successRate"
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === "generatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    typeFilter,
    statusFilter,
    periodFilter,
    sortField,
    sortDirection,
    reports,
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      generating: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: RefreshCw,
      },
      failed: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: ExternalLink,
      },
      scheduled: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent
          className={`w-3 h-3 mr-1 ${
            status === "generating" ? "animate-spin" : ""
          }`}
        />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      daily_summary:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      weekly_analytics:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      compliance_monthly:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      high_value: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      payment_analysis:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      failure_analysis:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    const typeLabels = {
      daily_summary: "Daily Summary",
      weekly_analytics: "Weekly Analytics",
      compliance_monthly: "Compliance Monthly",
      high_value: "High Value",
      payment_analysis: "Payment Analysis",
      failure_analysis: "Failure Analysis",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          typeConfig[type as keyof typeof typeConfig]
        }`}
      >
        {typeLabels[type as keyof typeof typeLabels]}
      </span>
    );
  };

  const generateNewReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // Add new report to the list (in real app, would refresh from API)
    }, 3000);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectReport = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id)
        ? prev.filter((reportId) => reportId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedReports.map((r) => r.id);
    if (selectedReports.length === currentPageIds.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(currentPageIds);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-KE").format(num);
  };

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary stats
  const completedReports = filteredReports.filter(
    (r) => r.status === "completed"
  ).length;
  const totalVolume = filteredReports.reduce(
    (sum, r) => sum + r.totalVolume,
    0
  );
  const avgSuccessRate =
    filteredReports
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.successRate, 0) / completedReports || 0;
  const generatingCount = filteredReports.filter(
    (r) => r.status === "generating"
  ).length;

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
            Transaction Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Generate and manage comprehensive transaction analytics and reports
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Settings size={16} className="mr-2" strokeWidth={1.8} />
            Report Settings
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-blue-600 text-white dark:bg-blue-700 rounded-xl text-sm shadow-sm"
            onClick={generateNewReport}
            disabled={isGenerating}
            whileHover={{ y: -2, backgroundColor: "#2563eb" }}
            whileTap={{ y: 0 }}
          >
            {isGenerating ? (
              <>
                <RefreshCw
                  size={16}
                  className="mr-2 animate-spin"
                  strokeWidth={1.8}
                />
                Generating...
              </>
            ) : (
              <>
                <BarChart3 size={16} className="mr-2" strokeWidth={1.8} />
                Generate Report
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
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
                Total Reports
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {filteredReports.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                Completed
              </p>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                {completedReports}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
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
                Avg Success Rate
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {avgSuccessRate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Volume
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalVolume, "KES")}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by report name, ID, description, or generated by..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="daily_summary">Daily Summary</option>
              <option value="weekly_analytics">Weekly Analytics</option>
              <option value="compliance_monthly">Compliance Monthly</option>
              <option value="high_value">High Value</option>
              <option value="payment_analysis">Payment Analysis</option>
              <option value="failure_analysis">Failure Analysis</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="generating">Generating</option>
              <option value="failed">Failed</option>
              <option value="scheduled">Scheduled</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="all">All Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="custom">Custom</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
            </select>
          </div>
        </div>

        {selectedReports.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedReports.length} report(s) selected
              </span>
              <div className="flex gap-2">
                <button className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700">
                  Bulk Download
                </button>
                <button className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-700">
                  Share Selected
                </button>
                <button className="text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700">
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Reports Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Loading reports...
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600"
                        checked={
                          selectedReports.length === paginatedReports.length &&
                          paginatedReports.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Report Details
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Metrics
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status & Distribution
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("generatedAt")}
                    >
                      <div className="flex items-center">
                        Timeline
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => handleSelectReport(report.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {report.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {report.id}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getTypeBadge(report.type)}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {report.period}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                            {report.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatNumber(report.totalTransactions)}{" "}
                            transactions
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {formatCurrency(
                              report.totalVolume,
                              report.currency
                            )}
                          </div>
                          {report.status === "completed" && (
                            <>
                              <div className="text-xs text-green-600 dark:text-green-400">
                                Success: {report.successRate.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Avg:{" "}
                                {formatCurrency(
                                  report.averageAmount,
                                  report.currency
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(report.status)}
                          </div>
                          {report.status === "completed" && (
                            <>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Size: {report.fileSize}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Downloads: {report.downloadCount}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Recipients: {report.recipients.length}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Generated: {formatDate(report.generatedAt)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          By: {report.generatedBy}
                        </div>
                        {report.lastDownloaded && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Last downloaded: {formatDate(report.lastDownloaded)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {report.status === "completed" && (
                            <>
                              <motion.button
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="View Report"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Share"
                              >
                                <Share2 className="w-4 h-4" />
                              </motion.button>
                            </>
                          )}
                          {report.status === "generating" && (
                            <motion.button
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Progress"
                            >
                              <Activity className="w-4 h-4" />
                            </motion.button>
                          )}
                          {report.status === "failed" && (
                            <motion.button
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Retry Generation"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredReports.length)}{" "}
                  of {filteredReports.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Quick Report Templates */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quick Report Templates
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Generate common reports with pre-configured settings
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Daily Summary
              </h4>
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
              Generate today's transaction summary with key metrics and trends
            </p>
            <div className="flex items-center text-xs text-blue-700 dark:text-blue-200">
              <ArrowRight className="w-3 h-3 mr-1" />
              Generate Now
            </div>
          </motion.div>

          <motion.div
            className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 cursor-pointer"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(147, 51, 234, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">
                Weekly Analytics
              </h4>
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-300 mb-3">
              Comprehensive weekly performance analysis with comparisons
            </p>
            <div className="flex items-center text-xs text-purple-700 dark:text-purple-200">
              <ArrowRight className="w-3 h-3 mr-1" />
              Generate Now
            </div>
          </motion.div>

          <motion.div
            className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 cursor-pointer"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-orange-800 dark:text-orange-200">
                High Value Report
              </h4>
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-300 mb-3">
              Analysis of transactions above threshold with compliance data
            </p>
            <div className="flex items-center text-xs text-orange-700 dark:text-orange-200">
              <ArrowRight className="w-3 h-3 mr-1" />
              Generate Now
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Report Metrics Overview */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Report Generation Statistics
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Overview of report generation activity and usage
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  This Month
                </h4>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  47
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  reports generated
                </p>
              </div>
              <Database className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Total Downloads
                </h4>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  1,247
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  across all reports
                </p>
              </div>
              <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-800 dark:text-purple-200">
                  Avg Generation Time
                </h4>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  2.3m
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  for complex reports
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                  Success Rate
                </h4>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  98.7%
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  generation success
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionReportsPage;