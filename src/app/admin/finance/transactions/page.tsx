import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Minus,
  Calendar,
  ArrowUpDown,
  CircleDollarSign,
  BarChart2,
  FileCheck,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Copy,
  X,
  Lock,
} from "lucide-react";
import { FilterOptions } from "../../../../types/finance";
import { useTransactions } from "../../../../hooks/useFinance";
import financeService from "../../../../api/services/finance";
import { exportSecureReport } from "../../../../components/finance/exportreport";

interface Wallet {
  id: string;
  user_uuid: string;
  group_uuid: string | null;
  type: string;
  status: string;
  availableBalance: string;
  lockedBalance: string;
  debit: string;
  credit: string;
  currencyId: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  user_uuid: string;
  amount: string;
  description: string;
  source: string | null;
  type: string;
  debit: string;
  credit: string;
  status: string;
  counterpartyId: string | null;
  reference: string;
  createdAt: string;
  wallet: Wallet;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

const STORAGE_KEY = "mylocalstoragetransactionsstoragekey";

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const enableProtection = true;

  useEffect(() => {
    if (!enableProtection) return;

    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }

      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }

      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }

      if (e.keyCode === 44) {
        e.preventDefault();
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 2000);
        return false;
      }

      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }

      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Potential screenshot attempt detected");
      }
    };

    const disableSelection = () => {
      document.onselectstart = () => false;
      document.onmousedown = () => false;
    };

    let devtools = { open: false, orientation: null };
    const threshold = 160;

    const checkDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          console.log("DevTools detected");
          if (contentRef.current) {
            contentRef.current.style.filter = "blur(10px)";
          }
        }
      } else {
        if (devtools.open) {
          devtools.open = false;
          if (contentRef.current) {
            contentRef.current.style.filter = "none";
          }
        }
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableKeyboardShortcuts);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    disableSelection();

    const devToolsInterval = setInterval(checkDevTools, 500);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeyboardShortcuts);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.onselectstart = null;
      document.onmousedown = null;
      clearInterval(devToolsInterval);
    };
  }, [enableProtection]);

  const loadInitialState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error("Error loading saved state:", error);
    }
    return null;
  };

  const savedState = loadInitialState();

  const [searchQuery, setSearchQuery] = useState(savedState?.searchQuery || "");
  const [currentPage, setCurrentPage] = useState(savedState?.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    savedState?.itemsPerPage || 50
  );
  const [filterStatus, setFilterStatus] = useState(
    savedState?.filterStatus || "all"
  );
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: savedState?.sortKey || "createdAt",
    direction: savedState?.sortDirection || "desc",
  });
  const [paginationData, setPaginationData] = useState<PaginationData>({
    total: 0,
    page: currentPage,
    pages: 1,
  });

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportPasscode, setExportPasscode] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeExpiryTimer, setPasscodeExpiryTimer] = useState(0);

  const filterOptions = useMemo<FilterOptions>(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined,
      status: filterStatus !== "all" ? filterStatus : undefined,
      sortBy: sortConfig.key,
      sortOrder: sortConfig.direction,
    }),
    [currentPage, itemsPerPage, searchQuery, filterStatus, sortConfig]
  );

  const {
    transactions: fetchedTransactions,
    isLoading,
    error,
  } = useTransactions(filterOptions, false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Generate a secure random passcode
  const generatePasscode = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let passcode = "";
    for (let i = 0; i < 8; i++) {
      passcode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return passcode;
  };

  // Copy passcode to clipboard
  const copyPasscodeToClipboard = () => {
    navigator.clipboard
      .writeText(exportPasscode)
      .then(() => {
        alert("Passcode copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy passcode: ", err);
      });
  };

  // Handle export button click
  const handleExportClick = () => {
    setExportModalOpen(true);
  };

  // Format the timer as MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle export confirmation
  const handleExportConfirm = async () => {
    setIsExporting(true);

    try {
      // Generate passcode
      const passcode = generatePasscode();
      setExportPasscode(passcode);

      // Map transactions to match the expected Transaction type for export
      const exportTransactions = transactions.map((t) => ({
        ...t,
        walletId: t.wallet?.id ?? "",
        walletName: t.wallet?.type ?? "",
        timestamp: t.createdAt ?? "",
      }));
      await exportSecureReport(exportTransactions, passcode);

      setPasscodeExpiryTimer(10 * 60);

      setShowPasscodeModal(true);

      const timer = setInterval(() => {
        setPasscodeExpiryTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed: " + error.message);
    } finally {
      setIsExporting(false);
      setExportModalOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      const stateToSave = {
        currentPage,
        itemsPerPage,
        searchQuery,
        filterStatus,
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    };
  }, [currentPage, itemsPerPage, searchQuery, filterStatus, sortConfig]);

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLocalLoading(true);
      try {
        const filters = {
          page: currentPage,
          limit: itemsPerPage,
        };

        const response = await financeService.getAllTransactions(filters);

        const result: {
          transactions: Transaction[];
          total: number;
          page: number;
          pages: number;
        } = Array.isArray(response)
          ? {
              transactions: response,
              total: response.length,
              page: currentPage,
              pages: 1,
            }
          : response;

        if (result) {
          setTransactions(result.transactions || []);
          setPaginationData({
            total: result.total || 0,
            page: result.page || currentPage,
            pages: result.pages || 1,
          });
          setLocalError(null);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setLocalError("Failed to fetch transaction data. Please try again.");
      } finally {
        setIsLocalLoading(false);
      }
    };

    loadTransactions();
  }, [currentPage, itemsPerPage, searchQuery, filterStatus]);

  const sortTransactions = useCallback(
    (
      transactionsToSort: Transaction[],
      key: string,
      direction: "asc" | "desc"
    ) => {
      return [...transactionsToSort].sort((a, b) => {
        if (key === "amount") {
          const aAmount = parseFloat(a.amount);
          const bAmount = parseFloat(b.amount);
          return direction === "asc" ? aAmount - bAmount : bAmount - aAmount;
        } else if (key === "createdAt") {
          return direction === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (key === "walletBalance") {
          const aBalance = a.wallet
            ? parseFloat(a.wallet.availableBalance || "0")
            : 0;
          const bBalance = b.wallet
            ? parseFloat(b.wallet.availableBalance || "0")
            : 0;
          return direction === "asc"
            ? aBalance - bBalance
            : bBalance - aBalance;
        } else if (key === "type") {
          const aType = getTransactionType(a);
          const bType = getTransactionType(b);
          return direction === "asc"
            ? aType.localeCompare(bType)
            : bType.localeCompare(aType);
        }
        return 0;
      });
    },
    []
  );

  useEffect(() => {
    if (transactions.length > 0) {
      const sorted = sortTransactions(
        transactions,
        sortConfig.key,
        sortConfig.direction
      );
      setTransactions(sorted);
    }
  }, [sortConfig, sortTransactions]);

  const formatDateTime = (
    dateString: string
  ): { date: string; time: string } => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch (error) {
      return { date: "Invalid", time: "--" };
    }
  };

  const getTransactionType = (transaction: Transaction): string => {
    if (!transaction.type) return "Other";

    switch (transaction.type.toUpperCase()) {
      case "TOPUP":
        return "Deposit";
      case "WITHDRAW":
        return "Withdrawal";
      case "TRANSFER":
        return "Transfer";
      default:
        return transaction.type;
    }
  };

  const getTransactionAmount = (transaction: Transaction): number => {
    return parseFloat(transaction.amount) || 0;
  };

  const handleViewTransaction = (transaction: Transaction) => {
    const stateToSave = {
      currentPage,
      itemsPerPage,
      searchQuery,
      filterStatus,
      sortKey: sortConfig.key,
      sortDirection: sortConfig.direction,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

    navigate(`/admin/finance/transactions/receipt/${transaction.id}`, {
      state: { transaction },
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationData.pages) {
      setCurrentPage(page);
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  const renderTransactionIcon = (transaction: Transaction) => {
    const type = getTransactionType(transaction);

    let icon;
    let bgColor;
    let iconColor;

    switch (type) {
      case "Deposit":
        icon = <CircleDollarSign size={16} strokeWidth={2} />;
        bgColor = "bg-success-100 dark:bg-success-900/30";
        iconColor = "text-success-600 dark:text-success-400";
        break;
      case "Withdrawal":
        icon = <CircleDollarSign size={16} strokeWidth={2} />;
        bgColor = "bg-danger-100 dark:bg-red-900/30";
        iconColor = "text-danger-600 dark:text-red-400";
        break;
      case "Transfer":
        icon = <ArrowDownUp size={16} strokeWidth={2} />;
        bgColor = "bg-primary-100 dark:bg-blue-900/30";
        iconColor = "text-primary-600 dark:text-blue-400";
        break;
      default:
        icon = <Minus size={16} strokeWidth={2} />;
        bgColor = "bg-neutral-100 dark:bg-gray-700";
        iconColor = "text-neutral-600 dark:text-gray-400";
    }

    return (
      <div
        className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center ${iconColor}`}
      >
        {icon}
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    const million = 1_000_000;
    const billion = 1_000_000_000;
    const trillion = 1_000_000_000_000;

    if (Math.abs(amount) >= trillion) {
      const formatted = (amount / trillion).toFixed(2);
      const trimmed = formatted.replace(/\.00$/, "");
      return `KES ${trimmed} trillion`;
    } else if (Math.abs(amount) >= billion) {
      const formatted = (amount / billion).toFixed(2);
      const trimmed = formatted.replace(/\.00$/, "");
      return `KES ${trimmed} billion`;
    } else if (Math.abs(amount) >= million) {
      const formatted = (amount / million).toFixed(2);
      const trimmed = formatted.replace(/\.00$/, "");
      return `KES ${trimmed} million`;
    }

    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const renderAmount = (transaction: Transaction) => {
    const amount = getTransactionAmount(transaction);
    const type = getTransactionType(transaction);

    let textColor = "text-neutral-900 dark:text-gray-100";
    let prefix = "";

    if (type === "Deposit") {
      textColor = "text-success-600 dark:text-success-400";
      prefix = "+";
    } else if (type === "Withdrawal") {
      textColor = "text-danger-600 dark:text-red-400";
      prefix = "-";
    }

    return (
      <div className={`font-semibold text-right ${textColor}`}>
        <div className="text-sm whitespace-nowrap">
          {prefix}
          {formatCurrency(amount)}
        </div>
      </div>
    );
  };

  const mapTransactionStatus = (status: string): string => {
    if (!status) return "pending";

    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "completed";
      case "PENDING":
        return "pending";
      case "FAILED":
        return "failed";
      default:
        return status.toLowerCase();
    }
  };

  const renderStatusBadge = (status: string) => {
    const mappedStatus = mapTransactionStatus(status);
    let bgColor = "bg-neutral-100 dark:bg-gray-700";
    let textColor = "text-neutral-700 dark:text-gray-300";
    let borderColor = "border-neutral-200 dark:border-gray-600";
    let icon = null;

    switch (mappedStatus) {
      case "completed":
        bgColor = "bg-success-50 dark:bg-success-900/30";
        textColor = "text-success-700 dark:text-success-400";
        borderColor = "border-success-200 dark:border-success-500/30";
        icon = (
          <CheckCircle
            size={12}
            className="mr-1 text-success-500 dark:text-success-400"
          />
        );
        break;
      case "pending":
        bgColor = "bg-warning-50 dark:bg-yellow-900/30";
        textColor = "text-warning-700 dark:text-yellow-400";
        borderColor = "border-warning-200 dark:border-yellow-500/30";
        icon = (
          <Clock
            size={12}
            className="mr-1 text-warning-500 dark:text-yellow-400"
          />
        );
        break;
      case "failed":
        bgColor = "bg-danger-50 dark:bg-red-900/30";
        textColor = "text-danger-700 dark:text-red-400";
        borderColor = "border-danger-200 dark:border-red-500/30";
        icon = (
          <XCircle
            size={12}
            className="mr-1 text-danger-500 dark:text-red-400"
          />
        );
        break;
    }

    return (
      <div
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${bgColor} ${textColor} ${borderColor}`}
      >
        {icon}
        {mappedStatus.charAt(0).toUpperCase() + mappedStatus.slice(1)}
      </div>
    );
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return (
        <ArrowUpDown
          size={14}
          className="ml-1 text-neutral-400 dark:text-gray-500"
        />
      );
    }

    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-primary-500 dark:text-blue-400" />
    ) : (
      <ArrowDown
        size={14}
        className="ml-1 text-primary-500 dark:text-blue-400"
      />
    );
  };

  const renderPagination = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, paginationData.total);

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-t border-neutral-200 dark:border-gray-700">
        <div className="text-sm text-neutral-600 dark:text-gray-400">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">
            {paginationData.total.toLocaleString()}
          </span>{" "}
          transactions
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-sm border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-blue-500/30 transition-all"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>

          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-neutral-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsLeft
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-neutral-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>

            <div className="px-4 py-2 text-sm font-medium text-neutral-900 dark:text-gray-100 border border-neutral-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              Page {currentPage} of {paginationData.pages}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationData.pages}
              className="p-2 rounded-lg border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-neutral-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
            <button
              onClick={() => handlePageChange(paginationData.pages)}
              disabled={currentPage === paginationData.pages}
              className="p-2 rounded-lg border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-neutral-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsRight
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getWalletBalance = (wallet: Wallet): string => {
    if (!wallet) return "0.00";

    const availableBalance = wallet.availableBalance;
    if (availableBalance === "NaN") {
      const credit = parseFloat(wallet.credit || "0");
      const debit = parseFloat(wallet.debit || "0");

      if (isNaN(debit)) {
        return credit.toFixed(2);
      }

      return (credit - debit).toFixed(2);
    }

    return parseFloat(availableBalance).toFixed(2);
  };

  const formatReference = (reference: string): string => {
    if (!reference) return "N/A";

    if (reference.startsWith("CREDIT-") || reference.startsWith("DEBIT-")) {
      return reference.split("-")[1];
    }

    return reference;
  };

  if (localError || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-gray-900 to-white dark:to-gray-800 flex items-center justify-center p-6">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-xl border border-primary-100 dark:border-gray-700 shadow-card text-center max-w-md">
          <div className="w-16 h-16 bg-danger-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle
              size={24}
              className="text-danger-600 dark:text-red-400"
            />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-gray-100 mb-2">
            Transaction Data Unavailable
          </h3>
          <p className="text-neutral-600 dark:text-gray-400 mb-6">
            {localError || error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-blue-700 transition-colors shadow-button"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border-b border-primary-100 dark:border-gray-700">
        <div className="w-full mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-gray-100 flex items-center">
                <ClipboardList
                  size={24}
                  className="mr-2 text-primary-600 dark:text-blue-400"
                />
                Transaction Registry
              </h1>
              <p className="text-neutral-600 dark:text-gray-400 mt-1">
                Monitor and analyze all financial activities
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700 text-neutral-700 dark:text-gray-300 rounded-lg font-medium transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BarChart2
                  size={16}
                  className="mr-2 text-primary-600 dark:text-blue-400"
                />
                Analytics
              </motion.button>
              <motion.button
                className="flex items-center px-4 py-2 bg-primary-600 dark:bg-blue-600 hover:bg-primary-700 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportClick}
              >
                <FileText size={16} className="mr-2" />
                Export Secure Report
              </motion.button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-500"
              />
              <input
                type="text"
                placeholder="Search by ID, reference, or description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg text-neutral-900 dark:text-gray-100 placeholder-neutral-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-blue-500/30 transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center space-x-3 ml-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg text-neutral-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-blue-500/30 transition-all shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <button className="p-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <Filter
                  size={18}
                  className="text-neutral-600 dark:text-gray-400"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-4 mx-auto px-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700 overflow-hidden shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {isLoading || isLocalLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-primary-200 dark:border-blue-200 border-t-primary-600 dark:border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-500 dark:text-gray-400">
                Loading transaction data...
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-gray-400">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <FileText
                  size={24}
                  className="text-neutral-400 dark:text-gray-500"
                />
              </div>
              <p className="text-lg font-medium text-neutral-900 dark:text-gray-100">
                No transactions found
              </p>
              <p className="text-sm text-neutral-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-gray-700/50 border-b border-neutral-200 dark:border-gray-600">
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => handleSort("type")}
                        >
                          Transaction Type
                          {renderSortIcon("type")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => handleSort("createdAt")}
                        >
                          Date & Time
                          {renderSortIcon("createdAt")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          className="flex items-center ml-auto focus:outline-none"
                          onClick={() => handleSort("amount")}
                        >
                          Amount
                          {renderSortIcon("amount")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          className="flex items-center ml-auto focus:outline-none"
                          onClick={() => handleSort("walletBalance")}
                        >
                          Wallet Balance
                          {renderSortIcon("walletBalance")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                    <AnimatePresence>
                      {transactions.map((transaction, index) => {
                        const { date, time } = formatDateTime(
                          transaction.createdAt
                        );
                        const type = getTransactionType(transaction);
                        const isSelected = selectedTransactions.includes(
                          transaction.id
                        );
                        const rowNumber =
                          (currentPage - 1) * itemsPerPage + index + 1;

                        return (
                          <motion.tr
                            key={transaction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.01 }}
                            className={`hover:bg-primary-50/30 dark:hover:bg-blue-900/20 transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary-50/50 dark:bg-blue-900/30"
                                : ""
                            }`}
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-neutral-500 dark:text-gray-400">
                              {rowNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {renderTransactionIcon(transaction)}
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-neutral-900 dark:text-gray-100">
                                    {type}
                                  </p>
                                  <p className="text-xs text-neutral-500 dark:text-gray-400">
                                    {transaction.description
                                      ? transaction.description.length > 14
                                        ? `${transaction.description.slice(
                                            0,
                                            14
                                          )}...`
                                        : transaction.description
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm text-neutral-900 dark:text-gray-100">
                                {date}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-gray-400">
                                {time}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm text-neutral-700 dark:text-gray-300">
                                {formatReference(transaction.reference)}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderStatusBadge(transaction.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {renderAmount(transaction)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm font-medium text-neutral-900 dark:text-gray-100">
                                {formatCurrency(
                                  parseFloat(
                                    getWalletBalance(transaction.wallet)
                                  )
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                className="p-2 text-neutral-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-blue-400 hover:bg-primary-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewTransaction(transaction);
                                }}
                              >
                                <Eye size={16} />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </>
          )}
        </motion.div>

        <div className="mt-4 px-4 pb-4 text-xs text-neutral-500 dark:text-gray-400 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>Data refreshed at {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <FileCheck
              size={14}
              className="mr-1 text-primary-600 dark:text-blue-400"
            />
            <span>This report is generated for financial audit purposes</span>
          </div>
        </div>
      </div>

      {exportModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-gray-100">
                Export Secure Report
              </h3>
              <button
                className="p-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-700"
                onClick={() => !isExporting && setExportModalOpen(false)}
                disabled={isExporting}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-neutral-600 dark:text-gray-400 mb-4">
              This will generate a secure HTML report protected with a passcode.
              You'll need to enter the passcode to view the report.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Lock
                  size={20}
                  className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5"
                />
                <div>
                  <p className="text-blue-800 dark:text-blue-300 font-medium">
                    Security Information
                  </p>
                  <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                    The exported report will be password-protected for security.
                    After viewing, you can save it as a PDF.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-neutral-100 dark:bg-gray-700 text-neutral-700 dark:text-gray-300 rounded-lg mr-3 font-medium hover:bg-neutral-200 dark:hover:bg-gray-600 transition-all"
                onClick={() => setExportModalOpen(false)}
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-blue-700 transition-all flex items-center"
                onClick={handleExportConfirm}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Generate Secure Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-gray-100">
                Your Secure Passcode
              </h3>
              <button
                className="p-2 text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-700"
                onClick={() => setShowPasscodeModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-warning-50 dark:bg-yellow-900/30 border border-warning-200 dark:border-yellow-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <Lock
                  size={20}
                  className="text-warning-600 dark:text-yellow-400 mr-3 mt-0.5"
                />
                <div>
                  <p className="text-warning-800 dark:text-yellow-300 font-medium">
                    Important Security Notice
                  </p>
                  <p className="text-warning-700 dark:text-yellow-400 text-sm mt-1">
                    This passcode will be required to open the exported file.
                    Please save it securely. For your security, this passcode
                    will expire in {formatTimer(passcodeExpiryTimer)}.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-100 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="font-mono text-xl font-bold tracking-wider text-neutral-800 dark:text-gray-200">
                {exportPasscode}
              </div>
              <button
                className="p-2 text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 hover:bg-primary-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                onClick={copyPasscodeToClipboard}
              >
                <Copy size={18} />
              </button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-gray-400 mb-6">
              Your report has been downloaded. Open it in your web browser and
              enter this passcode to view the contents. You can then save it as
              a PDF for permanent storage.
            </p>

            <div className="flex justify-end">
              <button
                className="px-6 py-2.5 bg-primary-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-blue-700 transition-all"
                onClick={() => setShowPasscodeModal(false)}
              >
                I've Saved My Passcode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
