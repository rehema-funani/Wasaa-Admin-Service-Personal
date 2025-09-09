import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  DollarSign,
  Users,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Tag,
  Shield,
  Download,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const SystemEscrowsPage = () => {
  const [systemEscrows, setSystemEscrows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSystemEscrows();
  }, []);

  const fetchSystemEscrows = async () => {
    try {
      setIsLoading(true);
      const response = await escrowService.getSystemEscrowAgreements();

      // Convert object to array if needed
      const escrowsArray = Array.isArray(response)
        ? response
        : Object.values(response);

      setSystemEscrows(escrowsArray);
    } catch (error) {
      console.error("Error fetching system escrows:", error);
      setSystemEscrows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: string | number, currency = "KES") => {
    const numericAmount =
      typeof amount === "string" ? parseInt(amount) : amount;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getTimeRemaining = (deadline: string) => {
    if (!deadline) return "No deadline";

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();

    if (diffTime <= 0) {
      return "Expired";
    }

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days left`;
  };

  // Filter and sort the system escrows
  const filteredEscrows = systemEscrows
    .filter((escrow) => {
      // Apply search filter
      const searchTerms = searchQuery.toLowerCase().split(" ");
      const escrowText =
        `${escrow.id} ${escrow.initiator} ${escrow.counterparty} ${escrow.purpose}`.toLowerCase();

      const matchesSearch = searchTerms.every((term) =>
        escrowText.includes(term)
      );

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" || escrow.status === statusFilter;

      // Apply type filter
      const matchesType =
        typeFilter === "all" || escrow.agreementType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "amount") {
        const amountA = parseInt(a.amountMinor) || 0;
        const amountB = parseInt(b.amountMinor) || 0;
        return sortDirection === "asc" ? amountA - amountB : amountB - amountA;
      } else if (sortBy === "deadline") {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Default sort by creation date
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Pagination
  const totalPages = Math.ceil(filteredEscrows.length / itemsPerPage);
  const paginatedEscrows = filteredEscrows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary metrics
  const summaryMetrics = {
    totalEscrows: systemEscrows.length,
    totalFunded: systemEscrows.reduce(
      (sum, escrow) => sum + parseInt(escrow.fundedMinor || "0"),
      0
    ),
    totalReleased: systemEscrows.reduce(
      (sum, escrow) => sum + parseInt(escrow.releasedMinor || "0"),
      0
    ),
    activeMilestones: systemEscrows.reduce(
      (sum, escrow) =>
        sum +
        (escrow.milestones?.filter((m) => m.status === "PENDING").length || 0),
      0
    ),
  };

  // Handle sorting toggle
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING_FUNDING: {
        color:
          "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        dot: "bg-blue-400 dark:bg-blue-600",
      },
      FUNDED: {
        color:
          "bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        dot: "bg-green-400 dark:bg-green-600",
      },
      PARTIALLY_RELEASED: {
        color:
          "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        dot: "bg-amber-400 dark:bg-amber-600",
      },
      RELEASED: {
        color:
          "bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        dot: "bg-emerald-400 dark:bg-emerald-600",
      },
      DISPUTED: {
        color:
          "bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
        dot: "bg-red-400 dark:bg-red-600",
      },
      CANCELLED: {
        color:
          "bg-gray-100/80 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600",
        dot: "bg-gray-400 dark:bg-gray-600",
      },
    };

    const config = statusConfig[status] || {
      color:
        "bg-gray-100/80 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600",
      dot: "bg-gray-400 dark:bg-gray-600",
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{status.replace(/_/g, " ")}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-400 dark:border-r-orange-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 bg-clip-text text-transparent">
                  System Escrow Agreements
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {systemEscrows.length} system escrows
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchSystemEscrows}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 inline-block mr-2" />
                Export CSV
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {systemEscrows.length}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total System Escrows
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summaryMetrics.totalFunded)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Funded
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summaryMetrics.totalReleased)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Released
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.activeMilestones}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Active Milestones
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
              placeholder="Search by ID, initiator, or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <motion.button
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="PENDING_FUNDING">Pending Funding</option>
                <option value="FUNDED">Funded</option>
                <option value="PARTIALLY_RELEASED">Partially Released</option>
                <option value="RELEASED">Released</option>
                <option value="DISPUTED">Disputed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="USER">User</option>
                <option value="BUSINESS">Business</option>
                <option value="FUNDRAISER">Fundraiser</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Sort by:
              </span>
              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={sortBy}
                onChange={(e) => toggleSort(e.target.value)}
              >
                <option value="createdAt">Creation Date</option>
                <option value="amount">Amount</option>
                <option value="deadline">Deadline</option>
              </select>
              <button
                className="p-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
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
                  Currency
                </label>
                <select className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Currencies</option>
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Has Milestones
                </label>
                <select className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount Range
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
            </motion.div>
          )}
        </div>

        {/* Escrows List */}
        {paginatedEscrows.length === 0 ? (
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/30 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No System Escrows Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No system escrow agreements match your current filters. Try
              adjusting your search criteria.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {paginatedEscrows.map((escrow, index) => (
              <motion.div
                key={escrow.id}
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(escrow.status)}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {escrow.agreementType}
                        </span>
                        {escrow.has_milestone && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <Target className="w-3 h-3 mr-1" />
                            Milestones
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          #{escrow.id.slice(0, 8)}...
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {escrow.purpose}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {escrow.initiator} → {escrow.counterparty}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {formatDate(escrow.createdAt)}
                          </span>
                        </div>
                        {escrow.deadline && (
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {getTimeRemaining(escrow.deadline)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(escrow.amountMinor, escrow.currency)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {escrow.currency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Funded
                      </label>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(escrow.fundedMinor, escrow.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Released
                      </label>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {formatCurrency(escrow.releasedMinor, escrow.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Payment Method
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {escrow.paymentMethodId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Milestones
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {escrow.milestones ? escrow.milestones.length : 0} total
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700">
                  <div className="p-3 text-center">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Ledger Accounts
                    </label>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {escrow.ledgerAccounts ? escrow.ledgerAccounts.length : 0}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Refunded
                    </label>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {formatCurrency(
                        escrow.refundedMinor || 0,
                        escrow.currency
                      )}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      System
                    </label>
                    <p
                      className={`text-sm font-medium ${
                        escrow.system === "yes"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {escrow.system === "yes" ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <motion.button
                      className="w-full px-3 py-1.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        navigate(`/admin/escrow/escrow-details/${escrow.id}`)
                      }
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/30">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Show
              </span>
              <select
                className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                per page
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredEscrows.length)}{" "}
                of {filteredEscrows.length}
              </span>

              <div className="flex gap-1">
                <button
                  className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
                <button
                  className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lsaquo;
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)]
                  .map((_, i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        currentPage === i + 1
                          ? "bg-primary-600 dark:bg-primary-500 text-white font-medium"
                          : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))
                  .slice(
                    Math.max(0, Math.min(currentPage - 3, totalPages - 5)),
                    Math.max(5, Math.min(currentPage + 2, totalPages))
                  )}

                <button
                  className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &rsaquo;
                </button>
                <button
                  className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Escrow Summary */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-500" />
            System Escrow Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 border border-blue-50 dark:border-blue-900/20">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Status Distribution
              </h4>
              <div className="space-y-3">
                {[
                  "PENDING_FUNDING",
                  "FUNDED",
                  "PARTIALLY_RELEASED",
                  "RELEASED",
                  "DISPUTED",
                  "CANCELLED",
                ].map((status) => {
                  const count = systemEscrows.filter(
                    (e) => e.status === status
                  ).length;
                  const percentage = (count / systemEscrows.length) * 100 || 0;

                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {status.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === "FUNDED"
                              ? "bg-green-500 dark:bg-green-600"
                              : status === "RELEASED"
                              ? "bg-blue-500 dark:bg-blue-600"
                              : status === "DISPUTED"
                              ? "bg-red-500 dark:bg-red-600"
                              : "bg-gray-400 dark:bg-gray-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 border border-blue-50 dark:border-blue-900/20">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Agreement Type Distribution
              </h4>
              <div className="space-y-4">
                {["USER", "BUSINESS", "FUNDRAISER"].map((type) => {
                  const count = systemEscrows.filter(
                    (e) => e.agreementType === type
                  ).length;
                  const percentage = (count / systemEscrows.length) * 100 || 0;

                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          type === "USER"
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                            : type === "BUSINESS"
                            ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                            : "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {type === "USER" ? (
                          <Users className="w-6 h-6" />
                        ) : type === "BUSINESS" ? (
                          <Briefcase className="w-6 h-6" />
                        ) : (
                          <DollarSign className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {type}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              type === "USER"
                                ? "bg-blue-500 dark:bg-blue-600"
                                : type === "BUSINESS"
                                ? "bg-purple-500 dark:bg-purple-600"
                                : "bg-amber-500 dark:bg-amber-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 border border-blue-50 dark:border-blue-900/20">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Financial Overview
              </h4>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Funded vs Released
                    </span>
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {(
                        (summaryMetrics.totalReleased /
                          summaryMetrics.totalFunded) *
                          100 || 0
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 dark:bg-green-600 rounded-full"
                      style={{
                        width: `${
                          (summaryMetrics.totalReleased /
                            summaryMetrics.totalFunded) *
                            100 || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Currency Distribution
                  </h5>
                  <div className="space-y-2">
                    {[...new Set(systemEscrows.map((e) => e.currency))].map(
                      (currency) => {
                        const currencyEscrows = systemEscrows.filter(
                          (e) => e.currency === currency
                        );
                        const totalAmount = currencyEscrows.reduce(
                          (sum, e) => sum + parseInt(e.amountMinor),
                          0
                        );

                        return (
                          <div
                            key={currency}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                                {currency}
                              </div>
                              <span className="text-sm text-gray-800 dark:text-gray-200">
                                {currencyEscrows.length} escrows
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formatCurrency(totalAmount, currency)}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemEscrowsPage;