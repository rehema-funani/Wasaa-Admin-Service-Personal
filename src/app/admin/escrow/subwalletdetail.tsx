import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Database,
  DollarSign,
  Users,
  Briefcase,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  CreditCard,
  Download,
  Lock,
  Unlock,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const SubwalletDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subwallet, setSubwallet] = useState(null);
  const [error, setError] = useState(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(true);
  const [showAuditTrail, setShowAuditTrail] = useState(true);

  // For transaction history pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchSubwalletDetails();
  }, [id]);

  const fetchSubwalletDetails = async () => {
    setIsLoading(true);
    try {
      const response = await escrowService.getSubwalletById(id);
      setSubwallet(response);
    } catch (error) {
      console.error("Error fetching subwallet details:", error);
      setError("Failed to load subwallet details. Please try again later.");
    } finally {
      setIsLoading(false);
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
      hour: "2-digit",
      minute: "2-digit",
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

  const getKycStatusBadge = (status) => {
    const statusConfig = {
      VERIFIED: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      PENDING: {
        color:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      REJECTED: {
        color:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        icon: <X className="w-3 h-3 mr-1" />,
      },
      NOT_SUBMITTED: {
        color:
          "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
        icon: <Info className="w-3 h-3 mr-1" />,
      },
    };

    const config = statusConfig[status] || statusConfig["NOT_SUBMITTED"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.icon}
        {status.replace("_", " ")}
      </span>
    );
  };

  const toggleFreezeSubwallet = async () => {
    if (!subwallet) return;

    try {
      const newStatus = subwallet.status === "FROZEN" ? "ACTIVE" : "FROZEN";
      await escrowService.updateSubwalletStatus(id, newStatus);

      // Update local state
      setSubwallet({
        ...subwallet,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating subwallet status:", error);
    }
  };

  const closeSubwallet = async () => {
    if (!subwallet || subwallet.status === "CLOSED") return;

    try {
      await escrowService.updateSubwalletStatus(id, "CLOSED");

      // Update local state
      setSubwallet({
        ...subwallet,
        status: "CLOSED",
      });
    } catch (error) {
      console.error("Error closing subwallet:", error);
    }
  };

  // For transaction history pagination
  const totalTransactionPages = subwallet?.transactions
    ? Math.ceil(subwallet.transactions.length / itemsPerPage)
    : 0;

  const paginatedTransactions = subwallet?.transactions
    ? subwallet.transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 dark:border-r-purple-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subwallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || "Subwallet Not Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't load the subwallet details. Please try again or check
              if the subwallet exists.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/admin/escrow/subwallets")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Subwallets
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/escrow/subwallets")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                  Subwallet Details
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {subwallet.id.slice(0, 8)}...
                  </span>
                  {getStatusBadge(subwallet.status)}
                  {subwallet.riskLevel && getRiskBadge(subwallet.riskLevel)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchSubwalletDetails}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                Export Details
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                {subwallet.ownerType === "USER" ? (
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {subwallet.ownerName || "Unknown Owner"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {subwallet.ownerType}{" "}
                  {subwallet.ownerId && `(${subwallet.ownerId})`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subwallet ID
                  </label>
                  <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <p className="font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
                      {subwallet.id}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tenant ID
                  </label>
                  <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <p className="font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
                      {subwallet.tenantId || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Owner ID
                  </label>
                  <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <p className="font-mono text-sm text-gray-800 dark:text-gray-200 overflow-auto">
                      {subwallet.ownerId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Created On
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {formatDate(subwallet.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Activity
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {formatDate(
                        subwallet.lastActivity ||
                          subwallet.updatedAt ||
                          subwallet.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Escrow Agreement ID
                  </label>
                  <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm text-gray-800 dark:text-gray-200 truncate">
                        {subwallet.escrowAgreementId || "N/A"}
                      </p>
                      {subwallet.escrowAgreementId && (
                        <motion.button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(
                              `/admin/escrow/agreements/${subwallet.escrowAgreementId}`
                            )
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Balance Card */}
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Financial Summary
                </h2>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Current Balance
                </p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                  {formatCurrency(subwallet.balance, subwallet.currency)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subwallet.currency}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Credit
                </p>
                <p className="text-lg font-medium text-green-700 dark:text-green-400">
                  {formatCurrency(subwallet.credit || 0, subwallet.currency)}
                </p>
              </div>

              <div className="bg-red-50/50 dark:bg-red-900/20 rounded-lg p-3 border border-red-100 dark:border-red-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Debit
                </p>
                <p className="text-lg font-medium text-red-700 dark:text-red-400">
                  {formatCurrency(subwallet.debit || 0, subwallet.currency)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type
                </label>
                <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {subwallet.kind || "TRUST"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(subwallet.status)}
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {subwallet.status === "FROZEN"
                        ? "Account is currently frozen"
                        : subwallet.status === "CLOSED"
                        ? "Account is permanently closed"
                        : "Account is active and operational"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transaction History Section */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Transaction History
              </h2>
            </div>

            <motion.button
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setShowTransactionHistory(!showTransactionHistory)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showTransactionHistory ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm">Hide</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm">Show</span>
                </>
              )}
            </motion.button>
          </div>

          {showTransactionHistory && (
            <>
              {!subwallet.transactions ||
              subwallet.transactions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50/50 dark:bg-slate-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                  <Activity className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No Transactions Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    This subwallet doesn't have any transaction history yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50/80 dark:bg-slate-700/80">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Transaction ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Direction
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Reference
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedTransactions.map((transaction, index) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.id.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {transaction.txnType || "TRANSFER"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatCurrency(
                                transaction.amountMinor || 0,
                                subwallet.currency
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.direction === "DEBIT"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                }`}
                              >
                                {transaction.direction}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(transaction.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {transaction.reference || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalTransactionPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700 mt-4 rounded-b-xl">
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
                              subwallet.transactions.length
                            )}
                          </span>
                          of
                          <span className="mx-1 font-medium">
                            {subwallet.transactions.length}
                          </span>
                          transactions
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
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
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

                          <button
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0"
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalTransactionPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalTransactionPages}
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
                </>
              )}
            </>
          )}
        </motion.div>

        {/* Compliance Section */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Compliance Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                KYC Status
              </h3>
              <div className="flex items-center gap-2">
                {getKycStatusBadge(subwallet.kycStatus || "NOT_SUBMITTED")}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subwallet.kycStatus === "VERIFIED"
                    ? "Verified on " +
                      formatDate(subwallet.kycVerifiedAt || subwallet.createdAt)
                    : subwallet.kycStatus === "PENDING"
                    ? "Pending verification"
                    : subwallet.kycStatus === "REJECTED"
                    ? "Verification rejected"
                    : "KYC not submitted"}
                </p>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                AML Status
              </h3>
              <div className="flex items-center gap-2">
                {subwallet.amlFlagged ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Flagged
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Clear
                  </span>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subwallet.amlFlagged
                    ? "Flagged on " +
                      formatDate(subwallet.amlFlaggedAt || subwallet.updatedAt)
                    : "No AML flags detected"}
                </p>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                SAR History
              </h3>
              {subwallet.sarCount ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {subwallet.sarCount}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    SAR{subwallet.sarCount > 1 ? "s" : ""} filed
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No SARs filed
                </p>
              )}
            </div>
          </div>

          {subwallet.amlFlagged && (
            <div className="bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    AML Alert
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {subwallet.amlReason ||
                      "This account has been flagged for suspicious activity. Please review and take appropriate action."}
                  </p>
                  {subwallet.amlRecommendation && (
                    <p className="mt-2 text-sm text-red-700 dark:text-red-400">
                      <span className="font-medium">Recommendation:</span>{" "}
                      {subwallet.amlRecommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Risk Assessment
            </h3>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getRiskBadge(subwallet.riskLevel || "LOW")}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Risk Score: {subwallet.riskScore || "0"}/100
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last assessed:{" "}
                  {formatDate(
                    subwallet.riskAssessedAt ||
                      subwallet.updatedAt ||
                      subwallet.createdAt
                  )}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    (subwallet.riskScore || 0) > 75
                      ? "bg-red-500 dark:bg-red-600"
                      : (subwallet.riskScore || 0) > 50
                      ? "bg-yellow-500 dark:bg-yellow-600"
                      : "bg-green-500 dark:bg-green-600"
                  }`}
                  style={{ width: `${subwallet.riskScore || 0}%` }}
                ></div>
              </div>
              {subwallet.riskFactors && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Risk Factors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {subwallet.riskFactors.map((factor, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Audit Trail Section */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Audit Trail
              </h2>
            </div>

            <motion.button
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAuditTrail ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm">Hide</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm">Show</span>
                </>
              )}
            </motion.button>
          </div>

          {showAuditTrail && (
            <>
              {!subwallet.auditTrail || subwallet.auditTrail.length === 0 ? (
                <div className="text-center py-8 bg-gray-50/50 dark:bg-slate-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                  <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No Audit Trail Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    No actions have been recorded for this subwallet yet.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-6 relative">
                    {subwallet.auditTrail.map((entry, index) => (
                      <motion.div
                        key={entry.id || index}
                        className="ml-9 relative"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 z-10"></div>
                        <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {entry.action}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(entry.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {entry.details || "No additional details provided"}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">
                              By: {entry.userId || entry.user || "System"}
                            </span>
                            {entry.reason && (
                              <span className="text-gray-500 dark:text-gray-400">
                                Reason: {entry.reason}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Action Panel */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subwallet.status !== "CLOSED" && (
              <>
                <motion.button
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${
                    subwallet.status === "FROZEN"
                      ? "bg-green-50/70 dark:bg-green-900/20 border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      : "bg-blue-50/70 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  }`}
                  onClick={toggleFreezeSubwallet}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {subwallet.status === "FROZEN" ? (
                    <>
                      <Unlock className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        Unfreeze Subwallet
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        Freeze Subwallet
                      </span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  className="p-4 bg-red-50/70 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl text-red-700 dark:text-red-400 flex flex-col items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  onClick={closeSubwallet}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={subwallet.status === "CLOSED"}
                >
                  <X className="w-6 h-6" />
                  <span className="text-sm font-medium">Close Subwallet</span>
                </motion.button>

                <motion.button
                  className="p-4 bg-purple-50/70 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl text-purple-700 dark:text-purple-400 flex flex-col items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm font-medium">Transfer Funds</span>
                </motion.button>
              </>
            )}

            <motion.button
              className="p-4 bg-gray-50/70 dark:bg-slate-700/30 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate(
                  `/admin/escrow/reports/generate?subwalletId=${subwallet.id}`
                )
              }
            >
              <Download className="w-6 h-6" />
              <span className="text-sm font-medium">Generate Report</span>
            </motion.button>
          </div>

          {subwallet.status === "CLOSED" && (
            <div className="mt-4 p-4 bg-gray-50/80 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subwallet Closed
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This subwallet is permanently closed and no further actions
                    can be taken on it.
                    {subwallet.closedAt &&
                      ` It was closed on ${formatDate(subwallet.closedAt)}.`}
                    {subwallet.closedBy && ` Closed by: ${subwallet.closedBy}.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SubwalletDetailPage;