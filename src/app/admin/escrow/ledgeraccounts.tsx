import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Database,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Activity,
  Wallet,
  CreditCard,
  Shield,
  ChevronRight,
  Users,
  Calendar,
  Download
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const LedgerAccountsPage = () => {
  const [ledgerAccounts, setLedgerAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("balance");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLedgerAccounts();
  }, []);

  const fetchLedgerAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await escrowService.getLedgerAccounts();

      const accountsArray = Array.isArray(response)
        ? response
        : Object.values(response);

      setLedgerAccounts(accountsArray);
    } catch (error) {
      console.error("Error fetching ledger accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: any) => {
    if (
      dateString &&
      typeof dateString === "object" &&
      Object.keys(dateString).length === 0
    ) {
      return "N/A";
    }

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

  const filteredAccounts = ledgerAccounts
    .filter((account) => {
      const searchTerms = searchQuery.toLowerCase().split(" ");
      const accountText =
        `${account.id} ${account.ownerId} ${account.kind} ${account.currency} ${account.escrowAgreementId}`.toLowerCase();

      const matchesSearch = searchTerms.every((term) =>
        accountText.includes(term)
      );

      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "balance") {
        return sortDirection === "asc"
          ? a.balance - b.balance
          : b.balance - a.balance;
      } else if (sortBy === "created") {
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "id") {
        return sortDirection === "asc"
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      }

      return sortDirection === "asc"
        ? a.balance - b.balance
        : b.balance - a.balance;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary metrics
  const summaryMetrics = {
    totalAccounts: ledgerAccounts.length,
    activeAccounts: ledgerAccounts.filter((acc) => acc.status === "ACTIVE")
      .length,
    totalBalance: ledgerAccounts.reduce(
      (sum, acc) => sum + (acc.balance || 0),
      0
    ),
    totalDebit: ledgerAccounts.reduce((sum, acc) => sum + (acc.debit || 0), 0),
    totalCredit: ledgerAccounts.reduce(
      (sum, acc) => sum + (acc.credit || 0),
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
                  Ledger Accounts
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {ledgerAccounts.length} accounts found
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchLedgerAccounts}
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.totalAccounts}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Accounts
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
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.activeAccounts}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Active Accounts
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
                <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summaryMetrics.totalBalance)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Balance
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
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summaryMetrics.totalDebit)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Debits
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summaryMetrics.totalCredit)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Credits
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
              placeholder="Search by ID, owner, or escrow agreement..."
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="FROZEN">Frozen</option>
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
                <option value="balance">Balance</option>
                <option value="created">Created Date</option>
                <option value="id">Account ID</option>
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
                  Account Kind
                </label>
                <select className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Kinds</option>
                  <option value="TRUST">Trust</option>
                  <option value="OPERATIONAL">Operational</option>
                  <option value="RESERVE">Reserve</option>
                </select>
              </div>

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
            </motion.div>
          )}
        </div>

        {/* Accounts List */}
        {paginatedAccounts.length === 0 ? (
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
              No Accounts Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No ledger accounts match your current filters. Try adjusting your
              search criteria or check back later.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {paginatedAccounts.map((account, index) => (
              <motion.div
                key={account.id}
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
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            account.status === "ACTIVE"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              account.status === "ACTIVE"
                                ? "bg-green-500 animate-pulse"
                                : "bg-gray-500"
                            } mr-1`}
                          ></div>
                          {account.status || "UNKNOWN"}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {account.kind || "UNKNOWN"}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {account.currency || "KES"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white truncate mr-2">
                          Account ID:
                        </h3>
                        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 truncate">
                          {account.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(
                          account.balance || 0,
                          account.currency || "KES"
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Current Balance
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Owner Type
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200 flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                        {account.ownerType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Owner ID
                      </label>
                      <p className="font-mono text-xs text-gray-800 dark:text-gray-200 truncate">
                        {account.ownerId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Created
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                        {formatDate(account.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Escrow Agreement
                      </label>
                      <p className="font-mono text-xs text-gray-800 dark:text-gray-200 truncate">
                        {account.escrowAgreementId?.slice(0, 12) || "N/A"}...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700">
                  <div className="p-3 text-center">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Debit
                    </label>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(
                        account.debit || 0,
                        account.currency || "KES"
                      )}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Credit
                    </label>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(
                        account.credit || 0,
                        account.currency || "KES"
                      )}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Net Position
                    </label>
                    <p
                      className={`text-sm font-medium ${
                        (account.credit || 0) - (account.debit || 0) >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(
                        (account.credit || 0) - (account.debit || 0),
                        account.currency || "KES"
                      )}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <motion.button
                      className="w-full px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        navigate(`/admin/escrow/ledger-account/${account.id}`)
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
                {Math.min(currentPage * itemsPerPage, filteredAccounts.length)}{" "}
                of {filteredAccounts.length}
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
      </div>
    </div>
  );
};

export default LedgerAccountsPage;