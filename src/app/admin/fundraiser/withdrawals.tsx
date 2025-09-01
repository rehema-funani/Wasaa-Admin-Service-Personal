import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Filter,
  Search,
  ChevronDown,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Shield,
  Loader,
  User,
} from "lucide-react";
import { format, subDays, addHours } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";
import { useNavigate } from "react-router-dom";

const generateDummyWithdrawals = () => {
  const statusOptions = ["pending", "approved", "rejected"];
  const campaignTitles = [
    "Build a School in Rural Kenya",
    "Hurricane Relief Fund",
    "Cancer Treatment Support",
    "Community Garden Project",
    "Youth Basketball League",
    "Local Theater Renovation",
    "College Scholarship Fund",
    "Animal Shelter Expansion",
    "Clean Water Initiative",
    "Wheelchair Accessibility Project",
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const amount = Math.round((Math.random() * 5000 + 500) / 10) * 10;
    const status =
      statusOptions[Math.floor(Math.random() * (i > 15 ? 3 : 1.2))]; // Make most of them pending
    const requestDate = subDays(new Date(), Math.floor(Math.random() * 14));
    const reviewDate =
      status !== "pending"
        ? addHours(requestDate, Math.floor(Math.random() * 72) + 1)
        : null;
    const campaignTitle =
      campaignTitles[Math.floor(Math.random() * campaignTitles.length)];

    return {
      id: `wdr-${i + 1}`,
      amount,
      fee: Math.round(amount * 0.025 * 100) / 100,
      netAmount: Math.round((amount - amount * 0.025) * 100) / 100,
      status,
      requestDate,
      reviewDate,
      campaignId: `camp-${Math.floor(Math.random() * 10) + 1}`,
      campaignTitle,
      paymentMethod: Math.random() > 0.6 ? "bank_transfer" : "mobile_money",
      accountDetails: {
        accountName: [
          "Jane Cooper",
          "Robert Fox",
          "Esther Howard",
          "Cameron Williamson",
          "Brooklyn Simmons",
        ][i % 5],
        accountNumber:
          Math.random() > 0.6
            ? `****${Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}`
            : `+254${Math.floor(Math.random() * 10000000)
                .toString()
                .padStart(8, "0")}`,
        bankName:
          Math.random() > 0.6
            ? [
                "Equity Bank",
                "KCB",
                "Cooperative Bank",
                "Absa Bank",
                "Standard Chartered",
              ][i % 5]
            : ["M-Pesa", "Airtel Money"][i % 2],
      },
      documents:
        Math.random() > 0.7
          ? ["id_verification.pdf", "bank_statement.pdf"]
          : [],
      notes:
        Math.random() > 0.8
          ? "Verified account details via phone call. Beneficiary confirmed withdrawal request."
          : "",
      reviewedBy:
        status !== "pending"
          ? {
              id: `admin-${Math.floor(Math.random() * 5) + 1}`,
              name: [
                "Admin User",
                "John Admin",
                "Mary Manager",
                "Finance Team",
                "Compliance Officer",
              ][Math.floor(Math.random() * 5)],
            }
          : null,
      riskScore: Math.floor(Math.random() * 100),
      reason:
        status === "rejected"
          ? [
              "Suspicious activity detected",
              "Incomplete documentation",
              "Failed verification",
              "Invalid bank details",
            ][Math.floor(Math.random() * 4)]
          : "",
    };
  });
};

const WithdrawalRequestsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    dateRange: "all",
    amountRange: "all",
    paymentMethod: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await fundraiserService.getPayouts();
        setPayouts(response.payouts || []);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const dummyWithdrawals = generateDummyWithdrawals();
        setWithdrawals(dummyWithdrawals);
        setFilteredWithdrawals(dummyWithdrawals);
      } catch (error) {
        console.error("Error loading withdrawal requests:", error);
        toast.error("Failed to load withdrawal requests");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters(filters, withdrawals);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = withdrawals.filter(
      (withdrawal) =>
        withdrawal.campaignTitle.toLowerCase().includes(lowercaseQuery) ||
        withdrawal.accountDetails.accountName
          .toLowerCase()
          .includes(lowercaseQuery) ||
        withdrawal.id.toLowerCase().includes(lowercaseQuery)
    );

    applyFilters(filters, filtered);
  };

  const applyFilters = (newFilters, items = withdrawals) => {
    setFilters(newFilters);

    let filtered = [...items];

    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter((w) => newFilters.status.includes(w.status));
    }

    if (newFilters.paymentMethod) {
      filtered = filtered.filter(
        (w) => w.paymentMethod === newFilters.paymentMethod
      );
    }

    if (newFilters.dateRange !== "all") {
      const daysMap = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };

      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
      filtered = filtered.filter((w) => new Date(w.requestDate) >= cutoffDate);
    }

    if (newFilters.amountRange !== "all") {
      const rangeMaps = {
        small: { min: 0, max: 1000 },
        medium: { min: 1000, max: 5000 },
        large: { min: 5000, max: Infinity },
      };

      const range = rangeMaps[newFilters.amountRange];
      filtered = filtered.filter(
        (w) => w.amount >= range.min && w.amount < range.max
      );
    }

    setFilteredWithdrawals(filtered);
  };

  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: [],
      dateRange: "all",
      amountRange: "all",
      paymentMethod: "",
    };

    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredWithdrawals(withdrawals);
  };

  const handleViewDetails = (withdrawal: any) => {
    navigate(`/admin/fundraising/withdrawals/${withdrawal.id}`);
  };

  const getPendingCount = () => {
    return withdrawals.filter((w) => w.status === "pending").length;
  };

  const getTotalPendingAmount = () => {
    return withdrawals
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + w.amount, 0);
  };

  const getApprovedCount = () => {
    return withdrawals.filter((w) => w.status === "approved").length;
  };

  const getRejectedCount = () => {
    return withdrawals.filter((w) => w.status === "rejected").length;
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center text-amber-600 dark:text-amber-400">
            <Clock size={14} className="mr-1" />
            <span>Pending</span>
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={14} className="mr-1" />
            <span>Approved</span>
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center text-red-600 dark:text-red-400">
            <XCircle size={14} className="mr-1" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="text-slate-500 dark:text-gray-400">Unknown</span>
        );
    }
  };

  const getRiskIndicator = (score: number) => {
    if (score < 30) {
      return (
        <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs">
          <Shield size={12} className="mr-1" />
          Low Risk
        </span>
      );
    } else if (score < 70) {
      return (
        <span className="flex items-center text-amber-600 dark:text-amber-400 text-xs">
          <AlertTriangle size={12} className="mr-1" />
          Medium Risk
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-red-600 dark:text-red-400 text-xs">
          <AlertTriangle size={12} className="mr-1" />
          High Risk
        </span>
      );
    }
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
            Withdrawal Requests
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Review and manage campaign withdrawal requests
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending Requests
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getPendingCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Awaiting review
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending Amount
            </p>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            ${isLoading ? "..." : getTotalPendingAmount().toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Total pending amount
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Approved
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getApprovedCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Successfully processed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Rejected
            </p>
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <XCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getRejectedCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Declined requests
          </p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by campaign name, requester, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg flex items-center text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "approved", "rejected"].map((status) => (
                        <label
                          key={status}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 mr-1.5"
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
                          <span className="text-sm text-slate-600 dark:text-gray-400 capitalize mr-2">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Amount Range
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.amountRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          amountRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; $1,000)</option>
                      <option value="medium">Medium ($1,000 - $5,000)</option>
                      <option value="large">Large ({">"} $5,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Payment Method
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.paymentMethod}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option value="">All Methods</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                    </select>
                  </div>

                  <div className="md:col-span-4 flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-slate-600 dark:text-gray-400 text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Withdrawal Requests List */}
        <motion.div
          className="flex-grow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Withdrawal Requests
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader
                  size={30}
                  className="text-primary-500 animate-spin mr-3"
                />
                <span className="text-slate-500 dark:text-gray-400">
                  Loading withdrawal requests...
                </span>
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-gray-700 rounded-full mb-4">
                  <CreditCard
                    size={24}
                    className="text-slate-400 dark:text-gray-500"
                  />
                </div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-2">
                  No withdrawal requests found
                </h3>
                <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-gray-700">
                {filteredWithdrawals.map((withdrawal) => (
                  <motion.div
                    key={withdrawal.id}
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                      activeRequest?.id === withdrawal.id
                        ? "bg-primary-50 dark:bg-primary-900/30"
                        : ""
                    }`}
                    onClick={() => handleViewDetails(withdrawal)}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <CreditCard className="text-primary-500" size={18} />
                        </div>

                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                              {withdrawal.id}
                            </h3>
                            <span className="mx-2 text-slate-300 dark:text-gray-600">
                              •
                            </span>
                            {getStatusIndicator(withdrawal.status)}
                          </div>

                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                            {withdrawal.campaignTitle}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-white">
                          ${withdrawal.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          {format(
                            new Date(withdrawal.requestDate),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <User
                          size={12}
                          className="text-slate-400 dark:text-gray-500 mr-1"
                        />
                        <span className="text-slate-600 dark:text-gray-400">
                          {withdrawal.accountDetails.accountName}
                        </span>
                        <span className="mx-2 text-slate-300 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-slate-600 dark:text-gray-400 capitalize">
                          {withdrawal.paymentMethod.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {getRiskIndicator(withdrawal.riskScore)}

                        <button
                          className="ml-3 p-1 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(withdrawal);
                          }}
                        >
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WithdrawalRequestsPage;
