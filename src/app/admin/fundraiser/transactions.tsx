import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Clock,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Gift,
  CheckCircle,
  XCircle,
  RotateCcw,
  Shield,
  Info,
  UserCheck,
  Loader,
  ChevronRight,
  ChevronLeft,
  Eye,
  Lock,
  AlertOctagon,
  Users,
  ArrowUpRight,
  Wallet,
  ArrowLeft
} from "lucide-react";
import { format, subDays, formatDistance } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const transactionService = {
  getTransactions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = Array.from({ length: 50 }).map((_, index) => {
          const types = ["donation", "payout", "refund", "chargeback"];
          const type = types[Math.floor(Math.random() * types.length)];
          
          let statuses;
          if (type === "donation") {
            statuses = ["completed", "pending", "failed"];
          } else if (type === "payout") {
            statuses = ["completed", "pending", "rejected", "processing"];
          } else if (type === "refund") {
            statuses = ["completed", "pending", "processing", "rejected"];
          } else {
            statuses = ["pending", "disputed", "settled", "lost"];
          }
          
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          let amount;
          if (type === "donation") {
            amount = Math.floor(Math.random() * 10000) + 100;
          } else if (type === "payout") {
            amount = Math.floor(Math.random() * 50000) + 5000;
          } else {
            amount = Math.floor(Math.random() * 5000) + 100;
          }
          
          const daysAgo = Math.floor(Math.random() * 60);
          const createdAt = subDays(new Date(), daysAgo);
          
          const reconciliationStatuses = ["matched", "pending", "mismatch", "manual_override"];
          const reconciliationStatus = reconciliationStatuses[Math.floor(Math.random() * reconciliationStatuses.length)];
          
          const suspicious = Math.random() < 0.15;
          const suspiciousReason = suspicious ? 
            [
              "Unusual transaction pattern",
              "Multiple large donations in short time",
              "IP address mismatch",
              "Suspicious location",
              "Fraudulent card reported"
            ][Math.floor(Math.random() * 5)] : null;
          
          // Audit log entries
          const auditLogCount = Math.floor(Math.random() * 5) + 1;
          const auditTrail = Array.from({ length: auditLogCount }).map((_, i) => {
            const actionTypes = ["created", "updated", "status_changed", "verified", "flagged", "escalated"];
            const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
            const actorRoles = ["system", "admin", "compliance_officer", "finance_manager"];
            const actor = actorRoles[Math.floor(Math.random() * actorRoles.length)];
            
            return {
              id: `log-${index}-${i}`,
              action,
              actor,
              actor_id: `user-${Math.floor(Math.random() * 100)}`,
              timestamp: subDays(createdAt, Math.floor(Math.random() * 3)),
              details: action === "status_changed" 
                ? `Status changed from ${["pending", "processing", "completed"][Math.floor(Math.random() * 3)]} to ${status}`
                : `Transaction ${action} by ${actor}`,
              ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
            };
          }).sort((a, b) => b.timestamp - a.timestamp); // Sort from newest to oldest
          
          // Campaign data
          const campaignTitles = [
            "Medical Fund for Sarah",
            "Build a School in Nakuru",
            "Emergency Relief for Flood Victims",
            "Support Local Artists Initiative",
            "Children's Cancer Treatment Fund",
            "Community Garden Project",
            "Elderly Care Program",
            "Youth Sports Equipment Drive",
            "Scholarship for Underprivileged Students",
            "Wildlife Conservation Effort"
          ];
          
          return {
            id: `txn-${index + 1000}`,
            type,
            status,
            amount,
            createdAt,
            updatedAt: subDays(createdAt, Math.floor(Math.random() * 2)),
            currency: "KES",
            fee: type === "payout" ? Math.floor(amount * 0.025) : 0,
            campaignId: `camp-${Math.floor(Math.random() * 20) + 1}`,
            campaignTitle: campaignTitles[Math.floor(Math.random() * campaignTitles.length)],
            walletId: `wallet-${Math.floor(Math.random() * 100) + 1}`,
            userId: `user-${Math.floor(Math.random() * 50) + 1}`,
            userName: `${["John", "Mary", "Peter", "Sarah", "David"][Math.floor(Math.random() * 5)]} ${["Doe", "Smith", "Johnson", "Kimani", "Ochieng"][Math.floor(Math.random() * 5)]}`,
            paymentMethod: type === "donation" ? ["wallet", "mpesa", "card", "bank_transfer"][Math.floor(Math.random() * 4)] : null,
            payoutMethod: type === "payout" ? ["mpesa", "bank_transfer"][Math.floor(Math.random() * 2)] : null,
            referenceNumber: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
            escrowReleaseDate: type === "payout" && status !== "rejected" ? subDays(createdAt, -5) : null,
            notes: Math.random() > 0.7 ? "Manual verification required due to transaction size" : null,
            suspicious,
            suspiciousReason,
            reconciliationStatus,
            auditTrail,
            hashValue: `0x${Array.from({length: 40}, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join('')}`, // Mock blockchain hash
          };
        });
        
        resolve({
          data: transactions,
          pagination: {
            page: 1,
            limit: 20,
            total: 50
          }
        });
      }, 1000);
    });
  }
};

const TransactionTypeBadge = ({ type }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <DollarSign size={12} className="mr-1.5" />;
  
  switch (type) {
    case "donation":
      bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
      icon = <Gift size={12} className="mr-1.5" />;
      break;
    case "payout":
      bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      icon = <CreditCard size={12} className="mr-1.5" />;
      break;
    case "refund":
      bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      icon = <RotateCcw size={12} className="mr-1.5" />;
      break;
    case "chargeback":
      bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      icon = <AlertTriangle size={12} className="mr-1.5" />;
      break;
    default:
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const StatusBadge = ({ status, type }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <Info size={12} className="mr-1.5" />;
  
  if (type === "chargeback") {
    switch (status) {
      case "pending":
        bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "disputed":
        bgColor = "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
        icon = <AlertOctagon size={12} className="mr-1.5" />;
        break;
      case "settled":
        bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "lost":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <XCircle size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  } else {
    switch (status) {
      case "completed":
        bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "pending":
        bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "processing":
        bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <RefreshCw size={12} className="mr-1.5" />;
        break;
      case "rejected":
      case "failed":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <XCircle size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Reconciliation Status Badge
const ReconciliationBadge = ({ status }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <Info size={12} className="mr-1.5" />;
  let label = "Unknown";
  
  switch (status) {
    case "matched":
      bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
      icon = <CheckCircle size={12} className="mr-1.5" />;
      label = "Matched";
      break;
    case "pending":
      bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      icon = <Clock size={12} className="mr-1.5" />;
      label = "Pending";
      break;
    case "mismatch":
      bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      icon = <AlertTriangle size={12} className="mr-1.5" />;
      label = "Mismatch";
      break;
    case "manual_override":
      bgColor = "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      icon = <Shield size={12} className="mr-1.5" />;
      label = "Manual Override";
      break;
    default:
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {label}
    </span>
  );
};

const TransactionHistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    status: [],
    dateRange: "all",
    amountRange: "all",
    suspicious: false,
    reconciliationStatus: "all",
    sortBy: "newest",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [statsData, setStatsData] = useState({
    totalAmount: 0,
    donationsCount: 0,
    payoutsCount: 0,
    refundsCount: 0,
    suspiciousCount: 0,
    mismatchCount: 0,
  });

  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await transactionService.getTransactions();

        setTransactions(response.data);
        setFilteredTransactions(response.data);
        setPagination(response.pagination);

        // Calculate stats
        const stats = {
          totalAmount: response.data.reduce(
            (sum, txn) => sum + (txn.type === "donation" ? txn.amount : 0),
            0
          ),
          donationsCount: response.data.filter((txn) => txn.type === "donation")
            .length,
          payoutsCount: response.data.filter((txn) => txn.type === "payout")
            .length,
          refundsCount: response.data.filter(
            (txn) => txn.type === "refund" || txn.type === "chargeback"
          ).length,
          suspiciousCount: response.data.filter((txn) => txn.suspicious).length,
          mismatchCount: response.data.filter(
            (txn) => txn.reconciliationStatus === "mismatch"
          ).length,
        };

        setStatsData(stats);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast.error("Failed to load transaction data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Close transaction details when clicking outside
    const handleClickOutside = (event) => {
      if (
        selectedTransaction &&
        !event.target.closest(".transaction-details-panel")
      ) {
        setSelectedTransaction(null);
        setShowAuditTrail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters(filters, transactions);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().includes(lowercaseQuery) ||
        transaction.referenceNumber.toLowerCase().includes(lowercaseQuery) ||
        transaction.campaignTitle.toLowerCase().includes(lowercaseQuery) ||
        transaction.userName.toLowerCase().includes(lowercaseQuery)
    );

    applyFilters(filters, filtered);
  };

  const applyFilters = (newFilters, items = transactions) => {
    setFilters(newFilters);

    let filtered = [...items];

    if (newFilters.type && newFilters.type.length > 0) {
      filtered = filtered.filter((t) => newFilters.type.includes(t.type));
    }

    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter((t) => newFilters.status.includes(t.status));
    }

    if (newFilters.dateRange !== "all") {
      const daysMap = {
        today: 1,
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };

      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
      filtered = filtered.filter((t) => new Date(t.createdAt) >= cutoffDate);
    }

    if (newFilters.amountRange !== "all") {
      const rangeMaps = {
        small: { min: 0, max: 1000 },
        medium: { min: 1000, max: 10000 },
        large: { min: 10000, max: Infinity },
      };

      const range = rangeMaps[newFilters.amountRange];
      filtered = filtered.filter(
        (t) => t.amount >= range.min && t.amount < range.max
      );
    }

    // Filter by suspicious flag
    if (newFilters.suspicious) {
      filtered = filtered.filter((t) => t.suspicious);
    }

    // Filter by reconciliation status
    if (newFilters.reconciliationStatus !== "all") {
      filtered = filtered.filter(
        (t) => t.reconciliationStatus === newFilters.reconciliationStatus
      );
    }

    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
        case "newest":
          filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "oldest":
          filtered.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "amount_high":
          filtered.sort((a, b) => b.amount - a.amount);
          break;
        case "amount_low":
          filtered.sort((a, b) => a.amount - b.amount);
          break;
        default:
          break;
      }
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      type: [],
      status: [],
      dateRange: "all",
      amountRange: "all",
      suspicious: false,
      reconciliationStatus: "all",
      sortBy: "newest",
    };

    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredTransactions(transactions);
  };

  const handleExport = () => {
    toast.success("Transaction data exported successfully");
  };

  const refreshData = async () => {
    setIsFetching(true);

    try {
      const response = await transactionService.getTransactions();

      setTransactions(response.data);
      setFilteredTransactions(response.data);
      setPagination(response.pagination);

      // Calculate stats
      const stats = {
        totalAmount: response.data.reduce(
          (sum, txn) => sum + (txn.type === "donation" ? txn.amount : 0),
          0
        ),
        donationsCount: response.data.filter((txn) => txn.type === "donation")
          .length,
        payoutsCount: response.data.filter((txn) => txn.type === "payout")
          .length,
        refundsCount: response.data.filter(
          (txn) => txn.type === "refund" || txn.type === "chargeback"
        ).length,
        suspiciousCount: response.data.filter((txn) => txn.suspicious).length,
        mismatchCount: response.data.filter(
          (txn) => txn.reconciliationStatus === "mismatch"
        ).length,
      };

      setStatsData(stats);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowAuditTrail(false);
  };

  const viewTransactionAudit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowAuditTrail(true);
  };

  const downloadAuditTrail = (transactionId) => {
    toast.success(`Audit trail for transaction ${transactionId} downloaded`);
  };

  const changePage = (newPage) => {
    if (
      newPage > 0 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      setPagination({
        ...pagination,
        page: newPage,
      });

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, pagination.page - delta);
      i <= Math.min(totalPages - 1, pagination.page + delta);
      i++
    ) {
      range.push(i);
    }

    if (pagination.page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div
      ref={containerRef}
      className="p-6 sm:p-8 w-full mx-auto max-w-[1600px] bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-4 bg-gradient-to-br from-[#FF6B81] to-[#B75BFF] w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <CreditCard className="text-white" size={20} />
            </span>
            Transaction History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-14">
            Track, audit, and manage all financial transactions
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </motion.button>
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={refreshData}
            disabled={isFetching}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Total Donations Amount */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Donations
            </p>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading
              ? "..."
              : `KES ${statsData.totalAmount.toLocaleString()}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total amount collected
          </p>
        </motion.div>

        {/* Total Donations Count */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Donations
            </p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Gift size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.donationsCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total donation transactions
          </p>
        </motion.div>

        {/* Total Payouts */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Payouts
            </p>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Wallet size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.payoutsCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total payouts to organizers
          </p>
        </motion.div>

        {/* Refunds */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Refunds
            </p>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <RotateCcw size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.refundsCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Refunds & chargebacks
          </p>
        </motion.div>

        {/* Suspicious */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Suspicious
            </p>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.suspiciousCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Flagged transactions
          </p>
        </motion.div>

        {/* Reconciliation Mismatches */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Mismatches
            </p>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <AlertOctagon size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.mismatchCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Reconciliation issues
          </p>
        </motion.div>
      </motion.div>

      {/* Search & Filter Controls */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, reference number, campaign, or user name..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-transparent transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              whileHover={{
                y: -2,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
                backgroundColor: "#f9fafb",
              }}
              whileTap={{ y: 0 }}
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Transaction Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transaction Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["donation", "payout", "refund", "chargeback"].map(
                        (type) => (
                          <label
                            key={type}
                            className="inline-flex items-center"
                          >
                            <input
                              type="checkbox"
                              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                              checked={filters.type.includes(type)}
                              onChange={(e) => {
                                const newType = e.target.checked
                                  ? [...filters.type, type]
                                  : filters.type.filter((t) => t !== type);
                                handleFilterChange({
                                  ...filters,
                                  type: newType,
                                });
                              }}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                              {type}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transaction Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "completed",
                        "pending",
                        "processing",
                        "rejected",
                        "failed",
                        "disputed",
                        "settled",
                        "lost",
                      ].map((status) => (
                        <label
                          key={status}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              const newStatus = e.target.checked
                                ? [...filters.status, status]
                                : filters.status.filter((s) => s !== status);
                              handleFilterChange({
                                ...filters,
                                status: newStatus,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                    </select>
                  </div>

                  {/* Amount Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.amountRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          amountRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; 1,000 KES)</option>
                      <option value="medium">
                        Medium (1,000 - 10,000 KES)
                      </option>
                      <option value="large">Large (&gt; 10,000 KES)</option>
                    </select>
                  </div>

                  {/* Reconciliation Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reconciliation Status
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.reconciliationStatus}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          reconciliationStatus: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Statuses</option>
                      <option value="matched">Matched</option>
                      <option value="pending">Pending</option>
                      <option value="mismatch">Mismatch</option>
                      <option value="manual_override">Manual Override</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          sortBy: e.target.value,
                        })
                      }
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="amount_high">Amount (High to Low)</option>
                      <option value="amount_low">Amount (Low to High)</option>
                    </select>
                  </div>

                  {/* Suspicious Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Suspicious Transactions
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                          checked={filters.suspicious}
                          onChange={(e) => {
                            handleFilterChange({
                              ...filters,
                              suspicious: e.target.checked,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Show only suspicious transactions
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-end">
                    <motion.button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 text-[#FF6B81] dark:text-[#FF6B81] bg-[#FF6B81]/5 hover:bg-[#FF6B81]/10 rounded-xl text-sm transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Transaction Count Display */}
      <motion.div
        className="flex items-center justify-between mb-5 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <CreditCard size={14} className="mr-2 text-[#FF6B81]" />
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
            {filteredTransactions.length}
          </span>
          {filteredTransactions.length !== pagination.total && (
            <>
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
                {pagination.total}
              </span>
            </>
          )}
          transactions
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={36} className="text-[#FF6B81] animate-spin mr-4" />
          <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Loading transactions...
          </span>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm py-16 px-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-700 rounded-full mb-5">
            <CreditCard
              size={28}
              className="text-gray-400 dark:text-gray-500"
            />
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
            No transactions found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <motion.button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-[#FF6B81]/10 text-[#FF6B81] rounded-xl text-sm hover:bg-[#FF6B81]/20 transition-colors shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Clear filters
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Transactions Table */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.3,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID & Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reconciliation
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        transaction.suspicious
                          ? "bg-red-50 dark:bg-red-900/10"
                          : ""
                      } ${
                        transaction.reconciliationStatus === "mismatch"
                          ? "bg-amber-50 dark:bg-amber-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {transaction.id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {format(
                            new Date(transaction.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TransactionTypeBadge type={transaction.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            transaction.type === "donation"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {transaction.type === "donation" ? "+" : "-"} KES{" "}
                          {transaction.amount.toLocaleString()}
                        </div>
                        {transaction.fee > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Fee: KES {transaction.fee.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-1">
                          {transaction.campaignTitle}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Users size={12} className="mr-1" />
                          {transaction.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={transaction.status}
                          type={transaction.type}
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Ref: {transaction.referenceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ReconciliationBadge
                          status={transaction.reconciliationStatus}
                        />
                        {transaction.suspicious && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            Suspicious
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => viewTransactionDetails(transaction)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => viewTransactionAudit(transaction)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10 rounded-lg transition-colors"
                            title="View Audit Trail"
                          >
                            <Shield size={18} />
                          </button>
                          {transaction.reconciliationStatus === "mismatch" && (
                            <button
                              className="p-2 text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                              title="Resolve Mismatch"
                            >
                              <AlertOctagon size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          {!isLoading && filteredTransactions.length > 0 && totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {startItem}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pagination.total}
                    </span>{" "}
                    transactions
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === 1
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof pageNumber === "number" &&
                          changePage(pageNumber)
                        }
                        disabled={pageNumber === "..."}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pageNumber === pagination.page
                            ? "bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white shadow-sm"
                            : pageNumber === "..."
                            ? "text-gray-400 dark:text-gray-500 cursor-default"
                            : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === totalPages
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction Details Panel */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedTransaction(null);
              setShowAuditTrail(false);
            }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden transaction-details-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center 
                     ${
                       selectedTransaction.type === "donation"
                         ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                         : selectedTransaction.type === "payout"
                         ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                         : selectedTransaction.type === "refund"
                         ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                         : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                     }`}
                    >
                      {selectedTransaction.type === "donation" ? (
                        <Gift size={20} />
                      ) : selectedTransaction.type === "payout" ? (
                        <CreditCard size={20} />
                      ) : selectedTransaction.type === "refund" ? (
                        <RotateCcw size={20} />
                      ) : (
                        <AlertTriangle size={20} />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {showAuditTrail
                        ? "Transaction Audit Trail"
                        : "Transaction Details"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedTransaction.id} •{" "}
                      {format(
                        new Date(selectedTransaction.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  onClick={() => {
                    setSelectedTransaction(null);
                    setShowAuditTrail(false);
                  }}
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Regular Transaction Details */}
                {!showAuditTrail ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Left Column */}
                      <div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Type & Status
                          </p>
                          <div className="flex gap-2 mb-1">
                            <TransactionTypeBadge
                              type={selectedTransaction.type}
                            />
                            <StatusBadge
                              status={selectedTransaction.status}
                              type={selectedTransaction.type}
                            />
                          </div>
                          <div className="flex gap-2">
                            <ReconciliationBadge
                              status={selectedTransaction.reconciliationStatus}
                            />
                            {selectedTransaction.suspicious && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                <AlertTriangle size={12} className="mr-1.5" />
                                Suspicious
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Amount
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            KES {selectedTransaction.amount.toLocaleString()}
                          </p>
                          {selectedTransaction.fee > 0 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Fee: KES{" "}
                              {selectedTransaction.fee.toLocaleString()} (
                              {(
                                (selectedTransaction.fee /
                                  selectedTransaction.amount) *
                                100
                              ).toFixed(1)}
                              %)
                            </p>
                          )}
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Campaign
                          </p>
                          <p className="text-base text-gray-900 dark:text-white">
                            {selectedTransaction.campaignTitle}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {selectedTransaction.campaignId}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            User
                          </p>
                          <p className="text-base text-gray-900 dark:text-white">
                            {selectedTransaction.userName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {selectedTransaction.userId}
                          </p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Reference Number
                          </p>
                          <p className="text-base text-gray-900 dark:text-white font-mono">
                            {selectedTransaction.referenceNumber}
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Payment Method
                          </p>
                          <p className="text-base text-gray-900 dark:text-white capitalize">
                            {selectedTransaction.type === "donation"
                              ? selectedTransaction.paymentMethod.replace(
                                  "_",
                                  " "
                                )
                              : selectedTransaction.type === "payout"
                              ? selectedTransaction.payoutMethod.replace(
                                  "_",
                                  " "
                                )
                              : "N/A"}
                          </p>
                        </div>

                        {selectedTransaction.type === "payout" &&
                          selectedTransaction.escrowReleaseDate && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Escrow Release Date
                              </p>
                              <p className="text-base text-gray-900 dark:text-white">
                                {format(
                                  new Date(
                                    selectedTransaction.escrowReleaseDate
                                  ),
                                  "MMM d, yyyy h:mm a"
                                )}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {formatDistance(
                                  new Date(
                                    selectedTransaction.escrowReleaseDate
                                  ),
                                  new Date(selectedTransaction.createdAt),
                                  { addSuffix: true }
                                )}{" "}
                                from creation
                              </p>
                            </div>
                          )}

                        {selectedTransaction.suspicious && (
                          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                            <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1 flex items-center">
                              <AlertTriangle size={16} className="mr-1.5" />
                              Suspicious Activity Detected
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedTransaction.suspiciousReason}
                            </p>
                          </div>
                        )}

                        {selectedTransaction.notes && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Notes
                            </p>
                            <p className="text-base text-gray-900 dark:text-white">
                              {selectedTransaction.notes}
                            </p>
                          </div>
                        )}

                        {/* Tamper-proof hash display */}
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                            <Lock size={16} className="mr-1.5" />
                            Tamper-Proof Hash
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                            {selectedTransaction.hashValue}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This cryptographic hash ensures transaction
                            integrity and prevents modification
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-sm flex items-center transition-colors"
                        onClick={() => setShowAuditTrail(true)}
                      >
                        <Shield size={16} className="mr-1.5" />
                        View Audit Trail
                      </button>

                      {selectedTransaction.reconciliationStatus ===
                        "mismatch" && (
                        <button
                          className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl text-sm flex items-center transition-colors"
                          onClick={() =>
                            toast.success(
                              `Opened reconciliation wizard for ${selectedTransaction.id}`
                            )
                          }
                        >
                          <AlertOctagon size={16} className="mr-1.5" />
                          Resolve Mismatch
                        </button>
                      )}

                      {selectedTransaction.suspicious && (
                        <button
                          className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-sm flex items-center transition-colors"
                          onClick={() =>
                            toast.error(
                              `Escalated ${selectedTransaction.id} to Compliance`
                            )
                          }
                        >
                          <ArrowUpRight size={16} className="mr-1.5" />
                          Escalate to Compliance
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  /* Audit Trail View */
                  <>
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                        <Lock size={16} className="mr-2" />
                        Tamper-Proof Audit Trail
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This audit trail provides an immutable record of all
                        actions performed on this transaction. Each entry is
                        cryptographically secured and cannot be modified or
                        deleted.
                      </p>
                    </div>

                    <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                      {selectedTransaction.auditTrail.map((entry, index) => (
                        <div key={entry.id} className="mb-8 relative">
                          <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute inset-1 rounded-full bg-gray-500 dark:bg-gray-400"></div>
                          </div>

                          <div className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                               ${
                                 entry.action === "created"
                                   ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                   : entry.action === "status_changed"
                                   ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                   : entry.action === "flagged"
                                   ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                   : entry.action === "escalated"
                                   ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                   : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                               }`}
                              >
                                {entry.action.replace("_", " ")}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {format(
                                  new Date(entry.timestamp),
                                  "MMM d, yyyy h:mm:ss a"
                                )}
                              </span>
                            </div>

                            <p className="text-sm text-gray-900 dark:text-white mb-1">
                              {entry.details}
                            </p>

                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span className="inline-flex items-center mr-3">
                                <UserCheck size={12} className="mr-1" />
                                {entry.actor} ({entry.actor_id})
                              </span>
                              <span className="inline-flex items-center">
                                <Shield size={12} className="mr-1" />
                                IP: {entry.ipAddress}
                              </span>
                            </div>
                          </div>

                          {/* Line connecting to next item */}
                          {index <
                            selectedTransaction.auditTrail.length - 1 && (
                            <div className="absolute h-full left-[-17px] top-4 w-[2px]"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-sm flex items-center transition-colors"
                        onClick={() => setShowAuditTrail(false)}
                      >
                        <ArrowLeft size={16} className="mr-1.5" />
                        Back to Details
                      </button>

                      <button
                        className="px-4 py-2 bg-[#FF6B81]/10 text-[#FF6B81] hover:bg-[#FF6B81]/20 rounded-xl text-sm flex items-center transition-colors"
                        onClick={() =>
                          downloadAuditTrail(selectedTransaction.id)
                        }
                      >
                        <Download size={16} className="mr-1.5" />
                        Download Audit Trail
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionHistoryPage;