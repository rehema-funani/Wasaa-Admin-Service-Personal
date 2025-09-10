import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Users,
  Database,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Eye,
  Lock,
  Unlock,
  X,
  Briefcase
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const SystemEscrowSubwalletsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subwallets, setSubwallets] = useState([]);
  const [filteredSubwallets, setFilteredSubwallets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [sortField, setSortField] = useState("lastActivity");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalFloat: 0,
    activeCount: 0,
    frozenCount: 0,
    closedCount: 0,
    amlFlaggedCount: 0,
  });

  useEffect(() => {
    fetchSubwallets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    subwallets,
    searchQuery,
    statusFilter,
    riskFilter,
    ownerFilter,
    sortField,
    sortDirection,
  ]);

  const fetchSubwallets = async () => {
    setIsLoading(true);
    try {
      const response = await escrowService.getEscrowSubwallets();
      setSubwallets(response);

      // Calculate summary metrics
      const metrics = {
        totalFloat: response.reduce((sum, item) => sum + item.balance, 0),
        activeCount: response.filter((item) => item.status === "ACTIVE").length,
        frozenCount: response.filter((item) => item.status === "FROZEN").length,
        closedCount: response.filter((item) => item.status === "CLOSED").length,
        amlFlaggedCount: response.filter(
          (item) => item.riskLevel === "HIGH" || item.amlFlagged
        ).length,
      };
      setSummaryMetrics(metrics);
    } catch (error) {
      console.error("Error fetching subwallets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...subwallets];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          (item.ownerName && item.ownerName.toLowerCase().includes(query)) ||
          (item.ownerId && item.ownerId.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply risk filter
    if (riskFilter !== "all") {
      result = result.filter((item) => item.riskLevel === riskFilter);
    }

    // Apply owner filter
    if (ownerFilter) {
      result = result.filter((item) => item.ownerType === ownerFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      // Handle date fields
      if (sortField === "createdOn" || sortField === "lastActivity") {
        fieldA = new Date(fieldA).getTime();
        fieldB = new Date(fieldB).getTime();
      }

      // Handle numeric fields
      if (sortField === "balance") {
        fieldA = Number(fieldA);
        fieldB = Number(fieldB);
      }

      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredSubwallets(result);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleFreezeSubwallet = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "FROZEN" ? "ACTIVE" : "FROZEN";
      await escrowService.updateSubwalletStatus(id, newStatus);

      // Update local state
      const updatedSubwallets = subwallets.map((wallet) => {
        if (wallet.id === id) {
          return { ...wallet, status: newStatus };
        }
        return wallet;
      });

      setSubwallets(updatedSubwallets);

      // Update metrics
      setSummaryMetrics((prev) => ({
        ...prev,
        activeCount:
          newStatus === "FROZEN" ? prev.activeCount - 1 : prev.activeCount + 1,
        frozenCount:
          newStatus === "FROZEN" ? prev.frozenCount + 1 : prev.frozenCount - 1,
      }));
    } catch (error) {
      console.error("Error updating subwallet status:", error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        dot: "bg-green-500",
      },
      FROZEN: {
        color:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500",
      },
      CLOSED: {
        color:
          "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
        dot: "bg-gray-500",
      },
    };

    const config = statusConfig[status] || statusConfig["ACTIVE"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5 ${
            status === "ACTIVE" ? "animate-pulse" : ""
          }`}
        ></span>
        {status}
      </span>
    );
  };

  const getRiskBadge = (riskLevel) => {
    const riskConfig = {
      HIGH: {
        color:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        icon: <AlertTriangle className="w-3 h-3 mr-1" />,
      },
      MEDIUM: {
        color:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      LOW: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
    };

    const config = riskConfig[riskLevel] || riskConfig["LOW"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.icon}
        {riskLevel}
      </span>
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredSubwallets.length / itemsPerPage);
  const paginatedSubwallets = filteredSubwallets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export functionality
  const exportData = (format) => {
    // Implement export logic here (CSV, PDF)
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                System Escrow Accounts
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage and monitor escrow subwallets across the platform
              </p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchSubwallets}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/escrow/subwallet/create")}
              >
                <Database className="w-4 h-4" />
                Create Subwallet
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summaryMetrics.totalFloat)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Float
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
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.activeCount}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Active Subwallets
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
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.frozenCount}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Frozen Subwallets
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
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.closedCount}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Closed Subwallets
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.amlFlaggedCount}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  AML Flagged
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search by Subwallet ID, User ID, or Business Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <motion.button
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 flex items-center gap-2 border border-gray-200/50 dark:border-slate-700/50"
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                Filters
                <span className="ml-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {statusFilter !== "all" || riskFilter !== "all" || ownerFilter
                    ? "!"
                    : "0"}
                </span>
              </motion.button>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="FROZEN">Frozen</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-700/70"
                onClick={() => exportData("csv")}
              >
                <Download className="w-4 h-4" />
              </button>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split("-");
                  setSortField(field);
                  setSortDirection(direction);
                }}
              >
                <option value="lastActivity-desc">Latest Activity</option>
                <option value="lastActivity-asc">Oldest Activity</option>
                <option value="balance-desc">Highest Balance</option>
                <option value="balance-asc">Lowest Balance</option>
                <option value="createdOn-desc">Newest</option>
                <option value="createdOn-asc">Oldest</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-slate-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Owner Type
                </label>
                <select
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                >
                  <option value="">All Owners</option>
                  <option value="USER">User</option>
                  <option value="BUSINESS">Business</option>
                  <option value="TRANSACTION">Transaction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Balance Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Date Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex justify-end mt-2">
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg mr-2"
                  onClick={() => {
                    setStatusFilter("all");
                    setRiskFilter("all");
                    setOwnerFilter("");
                    setShowFilters(false);
                  }}
                >
                  Reset Filters
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Subwallets List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 dark:border-r-purple-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        ) : paginatedSubwallets.length === 0 ? (
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/30 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Subwallets Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No subwallets match your current filters. Try adjusting your
              search criteria or creating a new subwallet.
            </p>
          </motion.div>
        ) : (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50/80 dark:bg-slate-700/80">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("id")}
                      >
                        Subwallet ID
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("ownerName")}
                      >
                        Owner
                        {sortField === "ownerName" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("riskLevel")}
                      >
                        Risk
                        {sortField === "riskLevel" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("lastActivity")}
                      >
                        Last Activity
                        {sortField === "lastActivity" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedSubwallets.map((subwallet, index) => (
                    <motion.tr
                      key={subwallet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subwallet.id.slice(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {subwallet.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {subwallet.ownerType === "USER" ? (
                              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {subwallet.ownerName || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {subwallet.ownerType}{" "}
                              {subwallet.ownerId &&
                                `(${subwallet.ownerId.slice(0, 8)}...)`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {subwallet.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(
                            subwallet.balance,
                            subwallet.currency
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {subwallet.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subwallet.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRiskBadge(subwallet.riskLevel || "LOW")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(subwallet.lastActivity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            className="p-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              navigate(
                                `/admin/escrow/subwallet/${subwallet.id}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>

                          <motion.button
                            className={`p-1.5 ${
                              subwallet.status === "FROZEN"
                                ? "text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              toggleFreezeSubwallet(
                                subwallet.id,
                                subwallet.status
                              )
                            }
                          >
                            {subwallet.status === "FROZEN" ? (
                              <Unlock className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing
                    <span className="mx-1 font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>
                    to
                    <span className="mx-1 font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredSubwallets.length
                      )}
                    </span>
                    of
                    <span className="mx-1 font-medium">
                      {filteredSubwallets.length}
                    </span>
                    results
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>

                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            pageNumber === currentPage
                              ? "z-10 bg-blue-600 dark:bg-blue-700 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0"
                          }`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemEscrowSubwalletsPage;