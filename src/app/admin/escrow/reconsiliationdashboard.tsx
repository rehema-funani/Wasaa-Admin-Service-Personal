import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  FileText,
  Clock,
  ExternalLink,
  BarChart2,
  Repeat,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Check,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  Briefcase,
  Edit,
  ArrowRight
} from 'lucide-react';

// Dummy data for reconciliation
const dummyReconciliationData = [
  {
    id: 'MA-001234',
    name: 'Save Nairobi Orphanage',
    type: 'FUNDRAISER',
    balance: 3200000,
    payouts: 3100000,
    variance: 100000,
    status: 'CLEARED',
    currency: 'KES'
  },
  {
    id: 'MA-001235',
    name: 'Youth Savings Circle',
    type: 'GROUP',
    balance: 1800000,
    payouts: 1800000,
    variance: 0,
    status: 'CLEARED',
    currency: 'KES'
  },
  {
    id: 'MA-001236',
    name: 'Afrobeat Concert 2025',
    type: 'EVENT',
    balance: 42500000,
    payouts: 42200000,
    variance: 300000,
    status: 'VARIANCE',
    currency: 'KES'
  },
  {
    id: 'MA-001237',
    name: 'Rural Health Initiative',
    type: 'FUNDRAISER',
    balance: 450000,
    payouts: 450000,
    variance: 0,
    status: 'CLEARED',
    currency: 'KES'
  },
  {
    id: 'MA-001238',
    name: 'Tech Startup Incubator',
    type: 'GROUP',
    balance: 5600000,
    payouts: 5550000,
    variance: 50000,
    status: 'REVIEW',
    currency: 'USD'
  },
  {
    id: 'MA-001239',
    name: 'Community Football Tournament',
    type: 'EVENT',
    balance: 850000,
    payouts: 845000,
    variance: 5000,
    status: 'REVIEW',
    currency: 'KES'
  },
];

// Dummy data for the selected account reconciliation
const dummySelectedAccount = {
  id: 'MA-001236',
  name: 'Afrobeat Concert 2025',
  type: 'EVENT',
  systemBalance: 42500000,
  bankBalance: 42200000,
  variance: 300000,
  currency: 'KES',
  status: 'VARIANCE',
  discrepancies: [
    { 
      id: 'TXN-001', 
      description: 'Released funds not yet settled in bank',
      amount: 250000,
      date: '2025-09-10T14:30:00Z',
      status: 'PENDING'
    },
    { 
      id: 'TXN-002', 
      description: 'Pending reversal - bank shows early debit',
      amount: 50000,
      date: '2025-09-09T11:15:00Z',
      status: 'PENDING'
    }
  ]
};

// Summary metrics calculation
const summaryMetrics = {
  totalFloat: dummyReconciliationData.reduce((sum, item) => sum + item.balance, 0),
  releasedFunds: dummyReconciliationData.reduce((sum, item) => sum + item.payouts, 0),
  pendingPayouts: 12500000, // Dummy value
  varianceDetected: dummyReconciliationData.reduce((sum, item) => sum + Math.abs(item.variance), 0)
};

const ReconciliationDashboardPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reconciliationData, setReconciliationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("variance");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [metrics, setMetrics] = useState({
    totalFloat: 0,
    releasedFunds: 0,
    pendingPayouts: 0,
    varianceDetected: 0,
  });

  // States for manual reconciliation
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showManualReconciliation, setShowManualReconciliation] =
    useState(false);

  useEffect(() => {
    // Simulate API fetch with delay
    setTimeout(() => {
      setReconciliationData(dummyReconciliationData);
      setMetrics(summaryMetrics);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    reconciliationData,
    searchQuery,
    typeFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  const applyFilters = () => {
    let result = [...reconciliationData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          (item.name && item.name.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      // Handle numeric fields
      if (["balance", "payouts", "variance"].includes(sortField)) {
        fieldA = Number(fieldA);
        fieldB = Number(fieldB);
      }

      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(result);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount, currency = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CLEARED: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      VARIANCE: {
        color:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        icon: <AlertTriangle className="w-3 h-3 mr-1" />,
      },
      REVIEW: {
        color:
          "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      PENDING: {
        color:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
    };

    const config = statusConfig[status] || statusConfig["REVIEW"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.icon}
        {status}
      </span>
    );
  };

  const getVarianceIndicator = (variance) => {
    if (variance === 0) return null;

    return variance > 0 ? (
      <span className="inline-flex items-center text-red-600 dark:text-red-400">
        <TrendingUp className="w-3 h-3 mr-1" />+
        {formatCurrency(variance, "KES")}
      </span>
    ) : (
      <span className="inline-flex items-center text-amber-600 dark:text-amber-400">
        <TrendingDown className="w-3 h-3 mr-1" />
        {formatCurrency(variance, "KES")}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "FUNDRAISER":
        return (
          <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        );
      case "GROUP":
        return <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "EVENT":
        return (
          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      default:
        return (
          <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  // Handle opening manual reconciliation for an account
  const handleOpenManualReconciliation = (account) => {
    setSelectedAccount(dummySelectedAccount);
    setShowManualReconciliation(true);
  };

  // Export functionality
  const exportData = (format) => {
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50 dark:from-slate-900 dark:via-teal-900/20 dark:to-blue-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/escrow/master")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Reconciliation Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and monitor escrow reconciliation across accounts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => window.location.reload()}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData("pdf")}
              >
                <Download className="w-4 h-4" />
                Export Report
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.totalFloat)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Escrow Float
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.releasedFunds)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Released Funds
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.pendingPayouts)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Pending Payouts
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.varianceDetected)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Variance Detected
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reconciliation Table Panel */}
          <div
            className={`${
              showManualReconciliation ? "lg:col-span-1" : "lg:col-span-3"
            }`}
          >
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Repeat className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Reconciliation Status
                  </h2>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        placeholder="Search accounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <motion.button
                      className="p-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
                      onClick={() => setShowFilters(!showFilters)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Filter className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {showFilters && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-slate-700 mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <select
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="CLEARED">Cleared</option>
                        <option value="VARIANCE">Variance</option>
                        <option value="REVIEW">Review</option>
                      </select>
                    </div>

                    <div>
                      <select
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="FUNDRAISER">Fundraiser</option>
                        <option value="GROUP">Group</option>
                        <option value="EVENT">Event</option>
                      </select>
                    </div>

                    <div>
                      <select
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                        value={`${sortField}-${sortDirection}`}
                        onChange={(e) => {
                          const [field, direction] = e.target.value.split("-");
                          setSortField(field);
                          setSortDirection(direction);
                        }}
                      >
                        <option value="variance-desc">Highest Variance</option>
                        <option value="variance-asc">Lowest Variance</option>
                        <option value="balance-desc">Highest Balance</option>
                        <option value="balance-asc">Lowest Balance</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="relative">
                    <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 dark:border-teal-800 dark:border-t-teal-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-r-blue-400 dark:border-r-blue-500 rounded-full animate-spin animation-delay-75" />
                  </div>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Repeat className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No Accounts Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    No accounts match your current filters. Try adjusting your
                    search criteria.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50/80 dark:bg-slate-700/80">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("id")}
                          >
                            Master ID
                            {sortField === "id" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            Name/Title
                            {sortField === "name" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("type")}
                          >
                            Type
                            {sortField === "type" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("balance")}
                          >
                            Balance
                            {sortField === "balance" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("payouts")}
                          >
                            Payouts
                            {sortField === "payouts" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("variance")}
                          >
                            Variance
                            {sortField === "variance" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("status")}
                          >
                            Status
                            {sortField === "status" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData.map((account, index) => (
                        <motion.tr
                          key={account.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {account.id.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 mr-2">
                                {getTypeIcon(account.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {account.type}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {account.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(account.balance, account.currency)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(account.payouts, account.currency)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {account.variance === 0 ? (
                              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                {formatCurrency(0, account.currency)}
                              </span>
                            ) : (
                              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                {formatCurrency(
                                  account.variance,
                                  account.currency
                                )}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {getStatusBadge(account.status)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <motion.button
                              className="inline-flex items-center px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleOpenManualReconciliation(account)
                              }
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Reconcile
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>

          {/* Manual Reconciliation Panel */}
          {showManualReconciliation && selectedAccount && (
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <motion.button
                        className="lg:hidden p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                        onClick={() => setShowManualReconciliation(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </motion.button>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Repeat className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        Manual Reconciliation
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        className="p-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
                        onClick={() => window.location.reload()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        className="p-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
                        onClick={() => setShowManualReconciliation(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* Account Details */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        {getTypeIcon(selectedAccount.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {selectedAccount.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{selectedAccount.id}</span>
                          <span>•</span>
                          <span>{selectedAccount.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balance Comparison */}
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-teal-100 dark:border-teal-800/30 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Balance Comparison
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-teal-100 dark:border-teal-800/30">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          System Balance
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(
                            selectedAccount.systemBalance,
                            selectedAccount.currency
                          )}
                        </div>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Bank Float Statement
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(
                            selectedAccount.bankBalance,
                            selectedAccount.currency
                          )}
                        </div>
                      </div>

                      <div
                        className={`bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border ${
                          selectedAccount.variance > 0
                            ? "border-red-100 dark:border-red-800/30"
                            : "border-green-100 dark:border-green-800/30"
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Variance
                        </div>
                        <div
                          className={`text-xl font-bold ${
                            selectedAccount.variance > 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {selectedAccount.variance > 0 ? "+" : ""}
                          {formatCurrency(
                            selectedAccount.variance,
                            selectedAccount.currency
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discrepancy Log */}
                  <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Discrepancy Log
                      </h3>
                    </div>

                    {selectedAccount.discrepancies.length === 0 ? (
                      <div className="p-6 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No discrepancies found for this account.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedAccount.discrepancies.map(
                          (discrepancy, index) => (
                            <motion.div
                              key={discrepancy.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                              className="p-4"
                            >
                              <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {discrepancy.id}
                                    </span>
                                    {getStatusBadge(discrepancy.status)}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {discrepancy.description}
                                  </p>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Transaction Date:{" "}
                                    {new Date(
                                      discrepancy.date
                                    ).toLocaleDateString()}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end">
                                  <div className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                                    {formatCurrency(
                                      discrepancy.amount,
                                      selectedAccount.currency
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <motion.button
                                      className="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Mark as Pending
                                    </motion.button>

                                    <motion.button
                                      className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Escalate
                                    </motion.button>

                                    <motion.button
                                      className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Resolve
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-end gap-3">
                    <motion.button
                      className="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowManualReconciliation(false)}
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Escalate to Finance
                    </motion.button>

                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white rounded-lg hover:shadow-md transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Mark as Resolved
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Reconciliation Insights */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 rounded-xl">
              <BarChart2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Reconciliation Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3">
                Reconciliation Status
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cleared
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {filteredData.filter((a) => a.status === "CLEARED").length}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 dark:bg-green-600 rounded-full"
                    style={{
                      width: `${
                        (filteredData.filter((a) => a.status === "CLEARED")
                          .length /
                          filteredData.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Variance
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {filteredData.filter((a) => a.status === "VARIANCE").length}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 dark:bg-red-600 rounded-full"
                    style={{
                      width: `${
                        (filteredData.filter((a) => a.status === "VARIANCE")
                          .length /
                          filteredData.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Review
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {filteredData.filter((a) => a.status === "REVIEW").length}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 dark:bg-amber-600 rounded-full"
                    style={{
                      width: `${
                        (filteredData.filter((a) => a.status === "REVIEW")
                          .length /
                          filteredData.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3">
                Account Type Distribution
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        FUNDRAISER
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                          filteredData.filter((a) => a.type === "FUNDRAISER")
                            .length
                        }
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 dark:bg-purple-600 rounded-full"
                        style={{
                          width: `${
                            (filteredData.filter((a) => a.type === "FUNDRAISER")
                              .length /
                              filteredData.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        GROUP
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {filteredData.filter((a) => a.type === "GROUP").length}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 dark:bg-blue-600 rounded-full"
                        style={{
                          width: `${
                            (filteredData.filter((a) => a.type === "GROUP")
                              .length /
                              filteredData.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        EVENT
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {filteredData.filter((a) => a.type === "EVENT").length}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 dark:bg-green-600 rounded-full"
                        style={{
                          width: `${
                            (filteredData.filter((a) => a.type === "EVENT")
                              .length /
                              filteredData.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-3">
                Actions Required
              </h3>

              <div className="space-y-3">
                <div className="bg-red-50/70 dark:bg-red-900/20 rounded-lg p-3 border border-red-100 dark:border-red-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">
                      Critical Variances
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded text-xs">
                      {
                        filteredData.filter(
                          (a) => a.status === "VARIANCE" && a.variance > 100000
                        ).length
                      }
                    </span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    Accounts with variance over KES 100,000
                  </p>
                </div>

                <div className="bg-amber-50/70 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Pending Reviews
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded text-xs">
                      {filteredData.filter((a) => a.status === "REVIEW").length}
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Accounts awaiting reconciliation review
                  </p>
                </div>

                <div className="bg-blue-50/70 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Total Variance
                    </span>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      {formatCurrency(
                        filteredData.reduce(
                          (sum, item) => sum + Math.abs(item.variance),
                          0
                        )
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Cumulative variance across all accounts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReconciliationDashboardPage;