import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  ExternalLink,
  Globe,
  CreditCard,
  Scale,
  Flag,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Award,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

const ResolutionHistoryPage: React.FC = () => {
  const [resolutions, setResolutions] = useState<any[]>([]);
  const [filteredResolutions, setFilteredResolutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [sortField, setSortField] = useState("resolvedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);

  // Mock resolution history data
  const mockResolutions = [
    {
      id: "RES-2025-001120",
      disputeId: "D-2025-001118",
      transactionId: "TXN-2025-001238",
      outcome: "refund_buyer",
      resolutionMethod: "admin_decision",
      resolvedBy: "Jane W. (Admin)",
      resolvedAt: "2025-01-08T16:45:00Z",
      resolutionTime: "2d 5h 25m",
      buyer: {
        name: "David Chen",
        email: "david.c@example.com",
        verified: true,
        satisfaction: "satisfied",
      },
      seller: {
        name: "Sarah Ahmed",
        email: "sarah.a@example.com",
        verified: true,
        satisfaction: "neutral",
      },
      amount: 1200000,
      refundAmount: 1200000,
      currency: "KES",
      category: "Goods",
      disputeType: "non_delivery",
      reason:
        "Seller failed to provide delivery confirmation within agreed timeframe",
      evidenceReviewed: 8,
      messagesExchanged: 15,
      escalationLevel: "tier_2",
      slaCompliance: "within_sla",
      satisfactionScore: 4.2,
      appealSubmitted: false,
      tags: ["delivery_issue", "documentation_missing"],
    },
    {
      id: "RES-2025-001119",
      disputeId: "D-2025-001116",
      transactionId: "TXN-2025-001235",
      outcome: "release_seller",
      resolutionMethod: "mediation",
      resolvedBy: "Paul K. (Compliance)",
      resolvedAt: "2025-01-07T14:30:00Z",
      resolutionTime: "1d 18h 15m",
      buyer: {
        name: "Emma Thompson",
        email: "emma.t@example.com",
        verified: true,
        satisfaction: "dissatisfied",
      },
      seller: {
        name: "Michael Brown",
        email: "michael.b@example.com",
        verified: true,
        satisfaction: "satisfied",
      },
      amount: 450000,
      refundAmount: 0,
      currency: "KES",
      category: "Services",
      disputeType: "quality_issues",
      reason:
        "Evidence showed service was delivered according to contract specifications",
      evidenceReviewed: 12,
      messagesExchanged: 28,
      escalationLevel: "tier_3",
      slaCompliance: "within_sla",
      satisfactionScore: 2.8,
      appealSubmitted: true,
      tags: ["service_delivery", "contract_dispute", "evidence_based"],
    },
    {
      id: "RES-2025-001118",
      disputeId: "D-2025-001114",
      transactionId: "TXN-2025-001232",
      outcome: "partial_refund",
      resolutionMethod: "mutual_agreement",
      resolvedBy: "Sarah M. (Support)",
      resolvedAt: "2025-01-06T11:20:00Z",
      resolutionTime: "22h 50m",
      buyer: {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        verified: true,
        satisfaction: "satisfied",
      },
      seller: {
        name: "Robert Kim",
        email: "robert.k@example.com",
        verified: true,
        satisfaction: "satisfied",
      },
      amount: 180000,
      refundAmount: 90000,
      currency: "KES",
      category: "Digital Goods",
      disputeType: "wrong_item",
      reason:
        "Parties agreed to 50% refund due to partial delivery of digital assets",
      evidenceReviewed: 5,
      messagesExchanged: 12,
      escalationLevel: "tier_1",
      slaCompliance: "within_sla",
      satisfactionScore: 4.5,
      appealSubmitted: false,
      tags: ["mutual_agreement", "partial_delivery", "digital_goods"],
    },
    {
      id: "RES-2025-001117",
      disputeId: "D-2025-001112",
      transactionId: "TXN-2025-001229",
      outcome: "no_action",
      resolutionMethod: "evidence_review",
      resolvedBy: "Mark T. (Support)",
      resolvedAt: "2025-01-05T09:45:00Z",
      resolutionTime: "8h 30m",
      buyer: {
        name: "Peter Wilson",
        email: "peter.w@example.com",
        verified: false,
        satisfaction: "dissatisfied",
      },
      seller: {
        name: "Tech Solutions Ltd",
        email: "support@techsol.com",
        verified: true,
        satisfaction: "satisfied",
      },
      amount: 75000,
      refundAmount: 0,
      currency: "KES",
      category: "Services",
      disputeType: "fraud_suspected",
      reason:
        "Insufficient evidence to support fraud claim. Transaction proceeds as normal",
      evidenceReviewed: 3,
      messagesExchanged: 6,
      escalationLevel: "tier_1",
      slaCompliance: "within_sla",
      satisfactionScore: 2.1,
      appealSubmitted: true,
      tags: ["insufficient_evidence", "fraud_claim", "dismissed"],
    },
    {
      id: "RES-2025-001116",
      disputeId: "D-2025-001110",
      transactionId: "TXN-2025-001225",
      outcome: "refund_buyer",
      resolutionMethod: "automatic_resolution",
      resolvedBy: "System Auto-Resolution",
      resolvedAt: "2025-01-04T16:00:00Z",
      resolutionTime: "72h 0m",
      buyer: {
        name: "Maria Santos",
        email: "maria.s@example.com",
        verified: true,
        satisfaction: "satisfied",
      },
      seller: {
        name: "Global Supplies",
        email: "orders@globalsup.com",
        verified: true,
        satisfaction: "neutral",
      },
      amount: 320000,
      refundAmount: 320000,
      currency: "KES",
      category: "Goods",
      disputeType: "non_delivery",
      reason:
        "Seller failed to respond within 72-hour deadline. Automatic refund triggered",
      evidenceReviewed: 2,
      messagesExchanged: 4,
      escalationLevel: "tier_1",
      slaCompliance: "auto_resolved",
      satisfactionScore: 4.0,
      appealSubmitted: false,
      tags: ["auto_resolution", "seller_non_response", "timeout"],
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setResolutions(mockResolutions);
      setFilteredResolutions(mockResolutions);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = resolutions.filter((resolution) => {
      const matchesSearch =
        resolution.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resolution.disputeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resolution.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        resolution.buyer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        resolution.seller.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        resolution.buyer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        resolution.seller.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesOutcome =
        outcomeFilter === "all" || resolution.outcome === outcomeFilter;
      const matchesMethod =
        methodFilter === "all" || resolution.resolutionMethod === methodFilter;

      let matchesDateRange = true;
      if (dateRangeFilter !== "all") {
        const resolvedDate = new Date(resolution.resolvedAt);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - resolvedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (dateRangeFilter) {
          case "7days":
            matchesDateRange = daysDiff <= 7;
            break;
          case "30days":
            matchesDateRange = daysDiff <= 30;
            break;
          case "90days":
            matchesDateRange = daysDiff <= 90;
            break;
        }
      }

      return (
        matchesSearch && matchesOutcome && matchesMethod && matchesDateRange
      );
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "amount" || sortField === "satisfactionScore") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === "resolvedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredResolutions(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    outcomeFilter,
    methodFilter,
    dateRangeFilter,
    sortField,
    sortDirection,
    resolutions,
  ]);

  const getOutcomeBadge = (outcome: string) => {
    const outcomeConfig = {
      refund_buyer: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: RefreshCw,
      },
      release_seller: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      partial_refund: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Scale,
      },
      no_action: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: XCircle,
      },
    };

    const config = outcomeConfig[outcome as keyof typeof outcomeConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {outcome.replace(/_/g, " ").charAt(0).toUpperCase() +
          outcome.replace(/_/g, " ").slice(1)}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const methodConfig = {
      admin_decision:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      mediation:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      mutual_agreement:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      evidence_review:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      automatic_resolution:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          methodConfig[method as keyof typeof methodConfig]
        }`}
      >
        {method.replace(/_/g, " ").charAt(0).toUpperCase() +
          method.replace(/_/g, " ").slice(1)}
      </span>
    );
  };

  const getSatisfactionIcon = (satisfaction: string) => {
    switch (satisfaction) {
      case "satisfied":
        return (
          <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case "neutral":
        return (
          <Scale className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "dissatisfied":
        return (
          <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
        );
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSlaStatusBadge = (slaStatus: string) => {
    const slaConfig = {
      within_sla: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      auto_resolved: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: RefreshCw,
      },
      sla_breach: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
    };

    const config = slaConfig[slaStatus as keyof typeof slaConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {slaStatus.replace(/_/g, " ")}
      </span>
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectResolution = (id: string) => {
    setSelectedResolutions((prev) =>
      prev.includes(id) ? prev.filter((resId) => resId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedResolutions.map((r) => r.id);
    if (selectedResolutions.length === currentPageIds.length) {
      setSelectedResolutions([]);
    } else {
      setSelectedResolutions(currentPageIds);
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

  // Pagination
  const totalPages = Math.ceil(filteredResolutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResolutions = filteredResolutions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary stats
  const totalResolutions = filteredResolutions.length;
  const avgSatisfaction =
    filteredResolutions.reduce((sum, r) => sum + r.satisfactionScore, 0) /
      totalResolutions || 0;
  const withinSlaCount = filteredResolutions.filter(
    (r) => r.slaCompliance === "within_sla"
  ).length;
  const slaPercentage =
    totalResolutions > 0 ? (withinSlaCount / totalResolutions) * 100 : 0;

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
            Resolution History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track completed dispute resolutions and performance metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-blue-600 text-white dark:bg-blue-700 rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: "#2563eb" }}
            whileTap={{ y: 0 }}
          >
            <BarChart3 size={16} className="mr-2" strokeWidth={1.8} />
            Analytics Report
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
                Total Resolved
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {totalResolutions}
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                Avg Satisfaction
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {avgSatisfaction.toFixed(1)}/5.0
              </p>
            </div>
            <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400" />
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
                SLA Compliance
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {slaPercentage.toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
                Appeals Filed
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {filteredResolutions.filter((r) => r.appealSubmitted).length}
              </p>
            </div>
            <Scale className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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
              placeholder="Search by Resolution ID, Dispute ID, Transaction ID, or parties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
            >
              <option value="all">All Outcomes</option>
              <option value="refund_buyer">Refund Buyer</option>
              <option value="release_seller">Release Seller</option>
              <option value="partial_refund">Partial Refund</option>
              <option value="no_action">No Action</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="admin_decision">Admin Decision</option>
              <option value="mediation">Mediation</option>
              <option value="mutual_agreement">Mutual Agreement</option>
              <option value="evidence_review">Evidence Review</option>
              <option value="automatic_resolution">Auto Resolution</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {selectedResolutions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedResolutions.length} resolution(s) selected
              </span>
              <div className="flex gap-2">
                <button className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-700">
                  Generate Report
                </button>
                <button className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700">
                  Analyze Patterns
                </button>
                <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Resolution History Table */}
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
              Loading resolution history...
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
                          selectedResolutions.length ===
                            paginatedResolutions.length &&
                          paginatedResolutions.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Resolution Details
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Parties & Satisfaction
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Outcome & Method
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("resolvedAt")}
                    >
                      <div className="flex items-center">
                        Resolution Timeline
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedResolutions.map((resolution) => (
                    <tr
                      key={resolution.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedResolutions.includes(resolution.id)}
                          onChange={() => handleSelectResolution(resolution.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {resolution.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {resolution.disputeId}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {resolution.disputeType.replace(/_/g, " ")}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resolution.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                          {resolution.tags.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{resolution.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Buyer:
                              </span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">
                                {resolution.buyer.name}
                              </span>
                              {resolution.buyer.verified && (
                                <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center">
                              {getSatisfactionIcon(
                                resolution.buyer.satisfaction
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Seller:
                              </span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">
                                {resolution.seller.name}
                              </span>
                              {resolution.seller.verified && (
                                <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center">
                              {getSatisfactionIcon(
                                resolution.seller.satisfaction
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                            <span>
                              Satisfaction Score: {resolution.satisfactionScore}
                              /5.0
                            </span>
                            {resolution.appealSubmitted && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                <Flag className="w-3 h-3 mr-1" />
                                Appeal Filed
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(
                            resolution.amount,
                            resolution.currency
                          )}
                        </div>
                        {resolution.refundAmount > 0 && (
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            Refunded:{" "}
                            {formatCurrency(
                              resolution.refundAmount,
                              resolution.currency
                            )}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {resolution.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getOutcomeBadge(resolution.outcome)}
                          {getMethodBadge(resolution.resolutionMethod)}
                          {getSlaStatusBadge(resolution.slaCompliance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {resolution.resolvedBy}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(resolution.resolvedAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Resolution time: {resolution.resolutionTime}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          Evidence: {resolution.evidenceReviewed} | Messages:{" "}
                          {resolution.messagesExchanged}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Resolution Notes"
                          >
                            <FileText className="w-4 h-4" />
                          </motion.button>
                          {resolution.appealSubmitted && (
                            <motion.button
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Appeal"
                            >
                              <Flag className="w-4 h-4" />
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
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredResolutions.length
                  )}{" "}
                  of {filteredResolutions.length} results
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

      {/* Performance Insights */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Resolution Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                  Best Performing Method
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Mutual Agreement - 4.5 avg satisfaction, 100% SLA compliance
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Most Common Outcome
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Refund Buyer - 40% of all resolutions, avg resolution time:
                  1.8 days
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Appeal Rate
                </h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  {(
                    (filteredResolutions.filter((r) => r.appealSubmitted)
                      .length /
                      totalResolutions) *
                    100
                  ).toFixed(1)}
                  % of resolutions appealed
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResolutionHistoryPage;