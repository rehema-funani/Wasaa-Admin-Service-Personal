import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Settings,
  AlertTriangle,
  Info,
  DollarSign,
  Percent,
  Tag,
  Users,
  Activity,
  ChevronDown,
  X,
  Check,
  Clock,
  Shield,
  Lock,
  Eye,
  BarChart3,
  ArrowUpRight,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import financeService from "../../../../api/services/finance";
import toast from "react-hot-toast";

interface FeeRule {
  id: string;
  operation: string;
  flat_fee: string;
  percent_fee: string;
  min_amount: string;
  max_amount: string;
  is_active: boolean;
  tier: string;
  kyc_level: string;
  applied_to: string;
  created_at: string;
}

interface ChartData {
  operation: string;
  percentage: number;
  count: number;
  color: string;
}

const FeeRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [feeRules, setFeeRules] = useState<FeeRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [operationFilter, setOperationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({
    title: "",
    content: "",
  });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<ChartData[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<FeeRule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchFeeRules();
  }, []);

  const fetchFeeRules = async () => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      const response = await financeService.getAllFeeRules();
      setFeeRules(response.rules);
      setLastUpdated(new Date());

      generateAnalyticsData(response.rules);
    } catch (err) {
      setError("Failed to fetch fee rules. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const generateAnalyticsData = (rules: FeeRule[]) => {
    // Count operations
    const opCounts: Record<string, number> = {};
    rules.forEach((rule) => {
      opCounts[rule.operation] = (opCounts[rule.operation] || 0) + 1;
    });

    // Generate colors
    const colorMap: Record<string, string> = {
      WITHDRAW: "#f59e0b", // amber-500
      DEPOSIT: "#10b981", // emerald-500
      TRANSFER: "#6366f1", // indigo-500
    };

    // Create chart data
    const totalRules = rules.length;
    const data: ChartData[] = Object.entries(opCounts).map(
      ([operation, count]) => ({
        operation,
        count,
        percentage: Math.round((count / totalRules) * 100),
        color: colorMap[operation] || "#9ca3af", // gray-400 as fallback
      })
    );

    setAnalyticsData(data);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const sortedRules = useMemo(() => {
    if (!feeRules.length) return [];

    return [...feeRules].sort((a, b) => {
      let compareResult = 0;

      switch (sortBy) {
        case "date":
          compareResult =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "operation":
          compareResult = a.operation.localeCompare(b.operation);
          break;
        case "fee":
          compareResult = parseFloat(a.flat_fee) - parseFloat(b.flat_fee);
          break;
        case "percentage":
          compareResult = parseFloat(a.percent_fee) - parseFloat(b.percent_fee);
          break;
        case "tier":
          compareResult = a.tier.localeCompare(b.tier);
          break;
        default:
          compareResult =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  }, [feeRules, sortBy, sortDirection]);

  const filteredRules = useMemo(() => {
    return sortedRules.filter((rule) => {
      const matchesSearch =
        rule.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.tier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.kyc_level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatCurrency(rule.flat_fee)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && rule.is_active) ||
        (statusFilter === "inactive" && !rule.is_active);

      const matchesOperation =
        operationFilter === "all" || rule.operation === operationFilter;

      return matchesSearch && matchesStatus && matchesOperation;
    });
  }, [sortedRules, searchQuery, statusFilter, operationFilter]);

  // Rule deletion handlers
  const handleDeleteClick = (rule: FeeRule) => {
    setRuleToDelete(rule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;

    setIsDeleting(true);
    try {
      await financeService.deleteFeeRule(ruleToDelete.id);
      setFeeRules(feeRules.filter((r) => r.id !== ruleToDelete.id));
      setShowDeleteModal(false);
      setRuleToDelete(null);

      // Update analytics after deletion
      generateAnalyticsData(feeRules.filter((r) => r.id !== ruleToDelete.id));

      toast.success("Fee rule deleted successfully", {
        style: {
          background: "#10B981",
          color: "white",
          borderRadius: "12px",
        },
      });
    } catch (err) {
      toast.error("Failed to delete fee rule");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRuleToDelete(null);
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case "WITHDRAW":
        return (
          <Activity size={18} className="text-amber-600 dark:text-amber-400" />
        );
      case "DEPOSIT":
        return (
          <DollarSign
            size={18}
            className="text-emerald-600 dark:text-emerald-400"
          />
        );
      case "TRANSFER":
        return (
          <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
        );
      default:
        return <Tag size={18} className="text-slate-600 dark:text-gray-400" />;
    }
  };

  const getOperationBackground = (operation: string) => {
    switch (operation) {
      case "WITHDRAW":
        return "bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-700/50";
      case "DEPOSIT":
        return "bg-emerald-100/80 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-700/50";
      case "TRANSFER":
        return "bg-indigo-100/80 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50";
      default:
        return "bg-slate-100/80 dark:bg-gray-700 border border-slate-200/50 dark:border-gray-600";
    }
  };

  const getOperationGradient = (operation: string) => {
    switch (operation) {
      case "WITHDRAW":
        return "from-amber-500/10 dark:from-amber-400/10 to-amber-300/5 dark:to-amber-600/5";
      case "DEPOSIT":
        return "from-emerald-500/10 dark:from-emerald-400/10 to-emerald-300/5 dark:to-emerald-600/5";
      case "TRANSFER":
        return "from-indigo-500/10 dark:from-indigo-400/10 to-indigo-300/5 dark:to-indigo-600/5";
      default:
        return "from-slate-500/10 dark:from-gray-500/10 to-slate-300/5 dark:to-gray-600/5";
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "WITHDRAW":
        return "text-amber-700 dark:text-amber-300";
      case "DEPOSIT":
        return "text-emerald-700 dark:text-emerald-300";
      case "TRANSFER":
        return "text-indigo-700 dark:text-indigo-300";
      default:
        return "text-slate-700 dark:text-gray-300";
    }
  };

  const formatCurrency = (value: string) => {
    return `KES ${parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  };

  // Get unique operations for filtering
  const operations = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(feeRules.map((rule) => rule.operation))),
    ];
  }, [feeRules]);

  // Get unique tiers for filtering
  const tiers = useMemo(() => {
    return Array.from(new Set(feeRules.map((rule) => rule.tier)));
  }, [feeRules]);

  // Get unique KYC levels for filtering
  const kycLevels = useMemo(() => {
    return Array.from(new Set(feeRules.map((rule) => rule.kyc_level)));
  }, [feeRules]);

  const showTooltipWithContent = (e, title, content) => {
    setTooltipContent({ title, content });
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  // Calculate some analytics data
  const totalActive = useMemo(
    () => feeRules.filter((r) => r.is_active).length,
    [feeRules]
  );
  const totalInactive = useMemo(
    () => feeRules.filter((r) => !r.is_active).length,
    [feeRules]
  );
  const averageFlatFee = useMemo(() => {
    if (feeRules.length === 0) return 0;
    const sum = feeRules.reduce(
      (acc, rule) => acc + parseFloat(rule.flat_fee),
      0
    );
    return sum / feeRules.length;
  }, [feeRules]);
  const averagePercentFee = useMemo(() => {
    if (feeRules.length === 0) return 0;
    const sum = feeRules.reduce(
      (acc, rule) => acc + parseFloat(rule.percent_fee),
      0
    );
    return sum / feeRules.length;
  }, [feeRules]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-gray-900 via-white dark:via-gray-800 to-slate-50/50 dark:to-gray-900/50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/50 dark:border-gray-700/50 text-center max-w-md shadow-xl"
        >
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle
              size={24}
              className="text-rose-600 dark:text-rose-400"
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h3>
          <p className="text-slate-600 dark:text-gray-400 mb-6">{error}</p>
          <motion.button
            onClick={fetchFeeRules}
            className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-gray-900 via-white dark:via-gray-800 to-slate-50/50 dark:to-gray-900/50">
      {/* Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-slate-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-indigo-50/80 dark:bg-indigo-900/50 border border-indigo-100/80 dark:border-indigo-700/50 rounded-lg text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-2 backdrop-blur-sm">
                <div className="flex items-center">
                  <DollarSign
                    size={12}
                    className="text-indigo-500 dark:text-indigo-400 mr-1.5"
                  />
                  <span>Financial Management</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100 flex items-center">
                <Settings
                  size={26}
                  className="text-indigo-600 dark:text-indigo-400 mr-3"
                />
                Fee Rules Management
                <div className="ml-3 px-2 py-0.5 text-xs rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center">
                  <Shield size={10} className="mr-1" />
                  PCI-DSS
                </div>
              </h1>
              <p className="text-slate-600 dark:text-gray-400 mt-1">
                Configure transaction fees and pricing structure
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-all ${
                  isAnalyticsOpen
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                    : "bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BarChart3 size={18} className="mr-2" />
                Analytics
              </motion.button>

              <motion.button
                onClick={() => navigate("/admin/finance/fee-rules/add")}
                className="flex items-center px-4 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <Plus size={18} className="mr-2" />
                New Fee Rule
              </motion.button>
            </div>
          </div>

          {/* Analytics section */}
          <AnimatePresence>
            {isAnalyticsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-100 flex items-center">
                      <Sparkles
                        size={18}
                        className="text-indigo-500 dark:text-indigo-400 mr-2"
                      />
                      Fee Rules Analytics
                    </h2>
                    <div className="flex items-center text-xs text-slate-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1.5 text-indigo-400" />
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Summary metrics */}
                    <div className="bg-gradient-to-br from-indigo-50/80 dark:from-indigo-900/30 to-white dark:to-gray-800 rounded-xl border border-indigo-100/50 dark:border-indigo-800/50 p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-indigo-100/50 dark:bg-indigo-800/30"></div>
                      <h3 className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2">
                        Total Rules
                      </h3>
                      <div className="text-3xl font-bold text-slate-900 dark:text-gray-100">
                        {feeRules.length}
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-gray-400 flex items-center">
                        <Activity
                          size={14}
                          className="mr-1.5 text-indigo-500 dark:text-indigo-400"
                        />
                        <span>
                          {totalActive} active, {totalInactive} inactive
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50/80 dark:from-emerald-900/30 to-white dark:to-gray-800 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50 p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-emerald-100/50 dark:bg-emerald-800/30"></div>
                      <h3 className="text-xs font-medium text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-2">
                        Deposit Rules
                      </h3>
                      <div className="text-3xl font-bold text-slate-900 dark:text-gray-100">
                        {
                          feeRules.filter((r) => r.operation === "DEPOSIT")
                            .length
                        }
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-gray-400 flex items-center">
                        <DollarSign
                          size={14}
                          className="mr-1.5 text-emerald-500 dark:text-emerald-400"
                        />
                        <span>
                          Average flat fee:{" "}
                          {formatCurrency(averageFlatFee.toString())}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50/80 dark:from-amber-900/30 to-white dark:to-gray-800 rounded-xl border border-amber-100/50 dark:border-amber-800/50 p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-amber-100/50 dark:bg-amber-800/30"></div>
                      <h3 className="text-xs font-medium text-amber-500 dark:text-amber-400 uppercase tracking-wider mb-2">
                        Withdraw Rules
                      </h3>
                      <div className="text-3xl font-bold text-slate-900 dark:text-gray-100">
                        {
                          feeRules.filter((r) => r.operation === "WITHDRAW")
                            .length
                        }
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-gray-400 flex items-center">
                        <Activity
                          size={14}
                          className="mr-1.5 text-amber-500 dark:text-amber-400"
                        />
                        <span>
                          Average percentage: {averagePercentFee.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-50/80 dark:from-violet-900/30 to-white dark:to-gray-800 rounded-xl border border-violet-100/50 dark:border-violet-800/50 p-4 relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-violet-100/50 dark:bg-violet-800/30"></div>
                      <h3 className="text-xs font-medium text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-2">
                        Transfer Rules
                      </h3>
                      <div className="text-3xl font-bold text-slate-900 dark:text-gray-100">
                        {
                          feeRules.filter((r) => r.operation === "TRANSFER")
                            .length
                        }
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-gray-400 flex items-center">
                        <Users
                          size={14}
                          className="mr-1.5 text-violet-500 dark:text-violet-400"
                        />
                        <span>
                          {tiers.length} tiers, {kycLevels.length} KYC levels
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Operation distribution chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5 md:col-span-2">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-4">
                        Fee Rules Distribution
                      </h3>
                      <div className="h-[180px] flex items-end justify-around gap-4">
                        {analyticsData.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <div
                              className="w-full text-center mb-2 text-xs font-medium"
                              style={{ color: item.color }}
                            >
                              {item.percentage}%
                            </div>
                            <div
                              className="w-16 rounded-t-lg relative group"
                              style={{
                                height: `${Math.max(
                                  20,
                                  (item.percentage / 100) * 150
                                )}px`,
                                backgroundColor: item.color,
                                boxShadow: `0 4px 6px -1px ${item.color}20`,
                              }}
                            >
                              <div className="absolute inset-0 rounded-t-lg bg-white/30 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="mt-2 text-xs font-medium text-slate-700 dark:text-gray-300">
                              {item.operation}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-gray-400">
                              {item.count} rules
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tiers and KYC levels */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-4">
                        Tiers & KYC Levels
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase mb-2">
                            Tiers
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {tiers.map((tier, index) => (
                              <div
                                key={index}
                                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-800"
                              >
                                {tier}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-gray-700">
                          <h4 className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase mb-2">
                            KYC Levels
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {kycLevels.map((level, index) => (
                              <div
                                key={index}
                                className="px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium border border-violet-100 dark:border-violet-800 flex items-center"
                              >
                                <Shield size={12} className="mr-1.5" />
                                {level}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by operation, tier, KYC level or fee amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 border border-slate-200 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "all"
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "active"
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "inactive"
                    ? "bg-slate-600 dark:bg-gray-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700"
                }`}
              >
                Inactive
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`p-3 rounded-xl transition-colors flex items-center ${
                  isFiltersOpen || operationFilter !== "all"
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700"
                }`}
              >
                <Filter size={18} className="mr-2" />
                <span className="text-sm font-medium">
                  {operationFilter !== "all" ? operationFilter : "Operations"}
                </span>
                <ChevronDown
                  size={16}
                  className={`ml-2 transition-transform duration-300 ${
                    isFiltersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isFiltersOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 p-2 w-48 z-20"
                  >
                    {operations.map((op) => (
                      <button
                        key={op}
                        onClick={() => {
                          setOperationFilter(op);
                          setIsFiltersOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${
                          operationFilter === op
                            ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium"
                            : "text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {op === "all" ? (
                          <>
                            <Tag
                              size={16}
                              className="mr-2 text-slate-400 dark:text-gray-500"
                            />
                            All Operations
                          </>
                        ) : (
                          <>
                            {getOperationIcon(op)}
                            <span className="ml-2">{op}</span>
                          </>
                        )}

                        {operationFilter === op && (
                          <Check
                            size={16}
                            className="ml-auto text-indigo-600 dark:text-indigo-400"
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchFeeRules();
              }}
              disabled={isRefreshing}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors flex items-center relative overflow-hidden"
            >
              <RefreshCw
                size={18}
                className={`mr-2 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : ""
                }`}
              />
              <span className="text-sm font-medium">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 dark:border-t-indigo-500 animate-spin opacity-70"
                  style={{ animationDuration: "1.5s" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Settings
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              </div>
              <p className="text-slate-500 dark:text-gray-400 text-center">
                <span className="font-medium text-slate-700 dark:text-gray-300 block mb-1">
                  Loading fee rules
                </span>
                <span className="text-sm">
                  Please wait while we fetch the data...
                </span>
              </p>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                <Settings
                  size={24}
                  className="text-slate-400 dark:text-gray-500"
                />
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-gray-100 mb-1">
                No fee rules found
              </p>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 text-center max-w-md">
                {searchQuery ||
                statusFilter !== "all" ||
                operationFilter !== "all"
                  ? "No rules match your current filters. Try adjusting your search criteria."
                  : "Get started by creating your first fee rule to configure transaction pricing."}
              </p>

              {searchQuery ||
              statusFilter !== "all" ||
              operationFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setOperationFilter("all");
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                >
                  <X size={16} className="mr-2" />
                  Clear filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/admin/finance/fee-rules/add")}
                  className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200/40 dark:shadow-indigo-900/30 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Create Fee Rule
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-gray-700/50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("operation")}
                          className="flex items-center focus:outline-none"
                        >
                          Operation
                          {sortBy === "operation" && (
                            <ChevronDown
                              size={14}
                              className={`ml-1 transition-transform ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("fee")}
                          className="flex items-center focus:outline-none"
                        >
                          Fees
                          {sortBy === "fee" && (
                            <ChevronDown
                              size={14}
                              className={`ml-1 transition-transform ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount Range
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("tier")}
                          className="flex items-center focus:outline-none"
                        >
                          Details
                          {sortBy === "tier" && (
                            <ChevronDown
                              size={14}
                              className={`ml-1 transition-transform ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center ml-auto focus:outline-none"
                        >
                          Created
                          {sortBy === "date" && (
                            <ChevronDown
                              size={14}
                              className={`ml-1 transition-transform ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                    <AnimatePresence initial={false}>
                      {filteredRules.map((rule, index) => (
                        <motion.tr
                          key={rule.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="group hover:bg-slate-50/80 dark:hover:bg-gray-700/50 transition-all duration-200 relative"
                          onMouseEnter={() => setHoveredRow(rule.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 ${getOperationBackground(
                                  rule.operation
                                )} rounded-xl flex items-center justify-center shadow-sm`}
                              >
                                {getOperationIcon(rule.operation)}
                              </div>
                              <div className="ml-4">
                                <div
                                  className={`text-sm font-medium ${getOperationColor(
                                    rule.operation
                                  )}`}
                                >
                                  {rule.operation}
                                </div>
                                <div
                                  className="text-xs text-slate-500 dark:text-gray-400 flex items-center cursor-help"
                                  onMouseEnter={(e) =>
                                    showTooltipWithContent(
                                      e,
                                      "Rule Details",
                                      `ID: ${rule.id}\nApplies to: ${rule.applied_to}`
                                    )
                                  }
                                  onMouseLeave={() => setShowTooltip(false)}
                                >
                                  <Info
                                    size={12}
                                    className="mr-1 text-slate-400 dark:text-gray-500"
                                  />
                                  <span>View details</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-900 dark:text-gray-100 flex items-center">
                                <DollarSign
                                  size={14}
                                  className="mr-1 text-emerald-500 dark:text-emerald-400"
                                />
                                Flat:{" "}
                                <span className="font-medium ml-1">
                                  {formatCurrency(rule.flat_fee)}
                                </span>
                              </span>
                              <span className="text-sm text-slate-900 dark:text-gray-100 flex items-center mt-1">
                                <Percent
                                  size={14}
                                  className="mr-1 text-violet-500 dark:text-violet-400"
                                />
                                Percentage:{" "}
                                <span className="font-medium ml-1">
                                  {parseFloat(rule.percent_fee).toFixed(2)}%
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 dark:text-gray-100 font-medium">
                              {formatCurrency(rule.min_amount)}{" "}
                              <span className="text-slate-400 dark:text-gray-500 font-normal">
                                to
                              </span>{" "}
                              {rule.max_amount ? (
                                formatCurrency(rule.max_amount)
                              ) : (
                                <span className="text-indigo-600 dark:text-indigo-400 font-normal">
                                  Unlimited
                                </span>
                              )}
                            </div>
                            <div className="mt-1 w-full h-1.5 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${getOperationGradient(
                                  rule.operation
                                )}`}
                                style={{
                                  width: rule.max_amount
                                    ? `${Math.min(
                                        100,
                                        (parseFloat(rule.min_amount) /
                                          parseFloat(rule.max_amount)) *
                                          100
                                      )}%`
                                    : "100%",
                                }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1.5">
                              <span className="text-sm text-slate-700 dark:text-gray-300 flex items-center">
                                <Tag
                                  size={14}
                                  className="mr-1.5 text-slate-400 dark:text-gray-500"
                                />
                                Tier:{" "}
                                <span className="font-medium ml-1">
                                  {rule.tier}
                                </span>
                              </span>
                              <span className="text-sm text-slate-700 dark:text-gray-300 flex items-center">
                                <Shield
                                  size={14}
                                  className="mr-1.5 text-slate-400 dark:text-gray-500"
                                />
                                KYC:{" "}
                                <span className="font-medium ml-1">
                                  {rule.kyc_level}
                                </span>
                              </span>
                              <span className="text-sm text-slate-700 dark:text-gray-300 flex items-center">
                                <Users
                                  size={14}
                                  className="mr-1.5 text-slate-400 dark:text-gray-500"
                                />
                                Applied to:{" "}
                                <span className="font-medium ml-1">
                                  {rule.applied_to}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`px-3 py-1.5 inline-flex items-center rounded-full text-xs font-medium ${
                                rule.is_active
                                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                                  : "bg-slate-50 dark:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-600"
                              }`}
                            >
                              {rule.is_active ? (
                                <>
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5 animate-pulse"></div>
                                  Active
                                </>
                              ) : (
                                <>
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-gray-500 mr-1.5"></div>
                                  Inactive
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-xs text-slate-500 dark:text-gray-400">
                              <div className="font-medium text-slate-700 dark:text-gray-300">
                                {formatDate(rule.created_at)}
                              </div>
                              <div>{formatTimeAgo(rule.created_at)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <motion.button
                                onClick={() =>
                                  navigate(
                                    `/admin/finance/fee-rules/edit/${rule.id}`,
                                    {
                                      state: { rule },
                                    }
                                  )
                                }
                                className="p-2 text-slate-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Edit size={16} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleDeleteClick(rule)}
                                className="p-2 text-slate-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isLoading}
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>

                          {/* Hover animation effect */}
                          {hoveredRow === rule.id && (
                            <td className="absolute inset-0 pointer-events-none overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/20 dark:via-indigo-900/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-slate-50/80 dark:bg-gray-700/50 border-t border-slate-200 dark:border-gray-600 flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-gray-400 flex items-center">
                  <Eye
                    size={16}
                    className="mr-2 text-indigo-500 dark:text-indigo-400"
                  />
                  Showing{" "}
                  <span className="font-medium text-slate-700 dark:text-gray-300 px-1">
                    {filteredRules.length}
                  </span>
                  of{" "}
                  <span className="font-medium text-slate-700 dark:text-gray-300 px-1">
                    {feeRules.length}
                  </span>{" "}
                  fee rules
                </div>

                <div className="flex items-center">
                  <div className="text-xs text-slate-500 dark:text-gray-400 flex items-center mr-6">
                    <Clock size={14} className="mr-1.5 text-indigo-400" />
                    <span>
                      Last updated:{" "}
                      {formatDate(lastUpdated.toLocaleDateString())}{" "}
                      {formatTime(lastUpdated.toLocaleTimeString())}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/admin/finance/fee-rules/history")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center"
                  >
                    <ArrowUpRight size={14} className="mr-1" />
                    View Rule History
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          className="mt-6 bg-gradient-to-r from-indigo-50/80 dark:from-indigo-900/30 to-white dark:to-gray-800 backdrop-blur-sm rounded-xl p-6 border border-indigo-100/50 dark:border-indigo-800/50 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center shadow-sm">
              <Info
                size={18}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center">
                About Fee Rules
                <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                  PCI-DSS Compliant
                </span>
              </h3>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
                Fee rules define how transaction fees are calculated based on
                operation type, amount range, user tier, and KYC level. Each
                rule can have both a flat fee and a percentage component.
                Changes take effect immediately and apply to all new
                transactions.
              </p>

              <div className="mt-4 flex items-center">
                <button className="text-xs flex items-center text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium mr-6">
                  <HelpCircle size={14} className="mr-1.5" />
                  View Documentation
                </button>
                <button className="text-xs flex items-center text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium">
                  <Shield size={14} className="mr-1.5" />
                  Learn about Fee Security
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed bg-slate-900/95 dark:bg-gray-800/95 text-white p-3 rounded-lg shadow-xl text-xs z-50 backdrop-blur-sm border border-slate-700 dark:border-gray-600"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y + 20}px`,
            transform: "translateX(-50%)",
            maxWidth: "250px",
          }}
        >
          <div className="font-medium mb-1">{tooltipContent.title}</div>
          <div className="text-slate-300 dark:text-gray-300 whitespace-pre-line">
            {tooltipContent.content}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showDeleteModal && ruleToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl max-h-[85vh] mt-6 overflow-y-auto rounded-2xl border border-slate-200/50 dark:border-gray-700/50 p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-xl bg-rose-100 dark:bg-rose-900/30 animate-pulse-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle
                    size={28}
                    className="text-rose-600 dark:text-rose-400"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 text-center mb-3">
                Delete Fee Rule
              </h3>

              {/* Rule Info */}
              <div className="bg-slate-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-200 dark:border-gray-600 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={`w-10 h-10 ${getOperationBackground(
                      ruleToDelete.operation
                    )} rounded-xl flex items-center justify-center shadow-sm`}
                  >
                    {getOperationIcon(ruleToDelete.operation)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-gray-100">
                      {ruleToDelete.operation}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      {ruleToDelete.tier} tier, {ruleToDelete.kyc_level} KYC
                    </p>
                  </div>
                  <div
                    className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                      ruleToDelete.is_active
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                        : "bg-slate-50 dark:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-600"
                    }`}
                  >
                    {ruleToDelete.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-slate-700 dark:text-gray-300 flex items-center">
                    <DollarSign
                      size={14}
                      className="mr-1.5 text-emerald-500 dark:text-emerald-400"
                    />
                    <span className="font-medium w-24">Flat Fee:</span>{" "}
                    {formatCurrency(ruleToDelete.flat_fee)}
                  </p>
                  <p className="text-slate-700 dark:text-gray-300 flex items-center">
                    <Percent
                      size={14}
                      className="mr-1.5 text-violet-500 dark:text-violet-400"
                    />
                    <span className="font-medium w-24">Percentage Fee:</span>{" "}
                    {parseFloat(ruleToDelete.percent_fee).toFixed(2)}%
                  </p>
                  <p className="text-slate-700 dark:text-gray-300 flex items-center">
                    <ArrowUpRight
                      size={14}
                      className="mr-1.5 text-indigo-500 dark:text-indigo-400"
                    />
                    <span className="font-medium w-24">Amount Range:</span>{" "}
                    {formatCurrency(ruleToDelete.min_amount)} -{" "}
                    {ruleToDelete.max_amount
                      ? formatCurrency(ruleToDelete.max_amount)
                      : "Unlimited"}
                  </p>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-rose-50/80 dark:bg-rose-900/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-rose-200 dark:border-rose-700 shadow-sm">
                <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-2 flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  Permanent Action Warning
                </h4>
                <div className="space-y-2 text-sm text-rose-800 dark:text-rose-300">
                  <p className="flex items-start">
                    <span className="w-4 h-4 flex-shrink-0 rounded-full bg-rose-100 dark:bg-rose-800 flex items-center justify-center mr-2 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-rose-500 dark:bg-rose-400"></span>
                    </span>
                    This action cannot be undone
                  </p>
                  <p className="flex items-start">
                    <span className="w-4 h-4 flex-shrink-0 rounded-full bg-rose-100 dark:bg-rose-800 flex items-center justify-center mr-2 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-rose-500 dark:bg-rose-400"></span>
                    </span>
                    All historical fee calculations using this rule will lose
                    their reference
                  </p>
                  <p className="flex items-start">
                    <span className="w-4 h-4 flex-shrink-0 rounded-full bg-rose-100 dark:bg-rose-800 flex items-center justify-center mr-2 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-rose-500 dark:bg-rose-400"></span>
                    </span>
                    Future transactions will not be able to use this pricing
                    structure
                  </p>
                  <p className="flex items-start">
                    <span className="w-4 h-4 flex-shrink-0 rounded-full bg-rose-100 dark:bg-rose-800 flex items-center justify-center mr-2 mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-rose-500 dark:bg-rose-400"></span>
                    </span>
                    Reports and analytics may be affected
                  </p>
                  {ruleToDelete.is_active && (
                    <p className="font-medium mt-3 flex items-center">
                      <AlertTriangle
                        size={14}
                        className="mr-2 text-rose-600 dark:text-rose-400"
                      />
                      This fee rule is currently ACTIVE and may be in use
                    </p>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center">
                  <Sparkles
                    size={16}
                    className="mr-2 text-indigo-500 dark:text-indigo-400"
                  />
                  Recommendation
                </h4>
                <p className="text-sm text-indigo-800 dark:text-indigo-300">
                  Consider setting the fee rule to{" "}
                  <span className="font-medium">"inactive"</span> instead of
                  deleting it. This preserves historical data while preventing
                  future use.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={handleCancelDelete}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-800 dark:text-gray-200 rounded-xl font-medium transition-all shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isDeleting}
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-6 py-3 bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 dark:hover:bg-rose-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30"
                  whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                  whileTap={{ scale: isDeleting ? 1 : 0.98 }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </>
                  )}
                </motion.button>
              </div>

              <div className="mt-4 p-3 bg-indigo-900/5 dark:bg-indigo-800/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-gray-400 text-center flex items-center justify-center">
                  <Lock
                    size={12}
                    className="mr-1.5 text-indigo-500 dark:text-indigo-400"
                  />
                  This action will be securely logged for compliance purposes
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeeRulesPage;
