import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpDown,
  Eye,
  MessageSquare,
  AlertTriangle,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
  Globe,
  CreditCard,
  Zap,
  Scale,
  Flag,
  Users,
  DollarSign,
  Shield,
  UserCheck,
  AlertCircle,
  TrendingUp,
  ArrowUp
} from "lucide-react";

const EscalatedCasesPage: React.FC = () => {
  const [escalatedCases, setEscalatedCases] = useState<any[]>([]);
  const [filteredCases, setFilteredCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("escalatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  // Mock escalated cases data
  const mockEscalatedCases = [
    {
      id: "ESC-2025-001120",
      originalDisputeId: "D-2025-001118",
      transactionId: "TXN-2025-001238",
      escalationType: "fraud_investigation",
      severity: "critical",
      tier: "tier_3",
      status: "under_investigation",
      buyer: {
        name: "John Wilson",
        email: "john.w@example.com",
        verified: false,
        riskScore: 45,
      },
      seller: {
        name: "Lisa Davis",
        email: "lisa.d@example.com",
        verified: true,
        riskScore: 88,
      },
      amount: 750000,
      currency: "KES",
      escalatedAt: "2025-01-07T14:20:00Z",
      escalatedBy: "Paul K. (Compliance)",
      assignedTo: "Jane W. (Admin)",
      category: "Electronics",
      paymentMethod: "Bank Transfer",
      location: "Lagos, Nigeria",
      description:
        "Suspected coordinated fraud scheme. Multiple red flags identified.",
      escalationReason:
        "Pattern of suspicious activities across multiple transactions",
      evidence: [
        "fraud_analysis.pdf",
        "transaction_patterns.xlsx",
        "ip_geolocation.pdf",
      ],
      relatedCases: ["ESC-2025-001115", "ESC-2025-001112"],
      complianceFlags: ["HIGH_RISK_USER", "SUSPICIOUS_PATTERN", "CROSS_BORDER"],
      lastUpdate: "2025-01-08T11:30:00Z",
      timeToResolve: "4h 30m remaining",
      regulatoryInvolvement: true,
      sarFiled: true,
    },
    {
      id: "ESC-2025-001119",
      originalDisputeId: "D-2025-001116",
      transactionId: "TXN-2025-001235",
      escalationType: "aml_violation",
      severity: "high",
      tier: "tier_3",
      status: "pending_regulatory",
      buyer: {
        name: "Ahmed Hassan",
        email: "ahmed.h@example.com",
        verified: true,
        riskScore: 72,
      },
      seller: {
        name: "Maria Santos",
        email: "maria.s@example.com",
        verified: true,
        riskScore: 85,
      },
      amount: 2500000,
      currency: "KES",
      escalatedAt: "2025-01-06T09:15:00Z",
      escalatedBy: "System Auto-Escalation",
      assignedTo: "Compliance Team",
      category: "Real Estate",
      paymentMethod: "Bank Transfer",
      location: "Nairobi, Kenya",
      description:
        "Transaction exceeds AML reporting threshold with additional risk factors.",
      escalationReason:
        "Automatic escalation: Amount > KES 2M + cross-border + new seller",
      evidence: [
        "aml_assessment.pdf",
        "source_of_funds.pdf",
        "enhanced_due_diligence.pdf",
      ],
      relatedCases: [],
      complianceFlags: [
        "AML_THRESHOLD",
        "ENHANCED_DUE_DILIGENCE",
        "HIGH_VALUE",
      ],
      lastUpdate: "2025-01-07T16:45:00Z",
      timeToResolve: "Overdue by 8h 15m",
      regulatoryInvolvement: true,
      sarFiled: true,
    },
    {
      id: "ESC-2025-001118",
      originalDisputeId: "D-2025-001114",
      transactionId: "TXN-2025-001232",
      escalationType: "complex_dispute",
      severity: "high",
      tier: "tier_2",
      status: "mediation_required",
      buyer: {
        name: "Tech Solutions Ltd",
        email: "procurement@techsol.com",
        verified: true,
        riskScore: 91,
      },
      seller: {
        name: "Global Suppliers Inc",
        email: "sales@globalsup.com",
        verified: true,
        riskScore: 89,
      },
      amount: 3200000,
      currency: "KES",
      escalatedAt: "2025-01-05T11:30:00Z",
      escalatedBy: "Sarah M. (Support)",
      assignedTo: "Legal Team",
      category: "B2B Services",
      paymentMethod: "Wire Transfer",
      location: "Nairobi, Kenya",
      description:
        "Contract dispute involving service delivery specifications and penalties.",
      escalationReason:
        "Commercial dispute requiring legal interpretation of contract terms",
      evidence: [
        "contract_agreement.pdf",
        "delivery_reports.zip",
        "penalty_calculations.xlsx",
      ],
      relatedCases: [],
      complianceFlags: ["COMMERCIAL_DISPUTE", "LEGAL_REVIEW"],
      lastUpdate: "2025-01-06T14:20:00Z",
      timeToResolve: "Within SLA (12h remaining)",
      regulatoryInvolvement: false,
      sarFiled: false,
    },
    {
      id: "ESC-2025-001117",
      originalDisputeId: "D-2025-001111",
      transactionId: "TXN-2025-001228",
      escalationType: "policy_violation",
      severity: "medium",
      tier: "tier_2",
      status: "under_review",
      buyer: {
        name: "Peter Okonkwo",
        email: "peter.o@example.com",
        verified: true,
        riskScore: 78,
      },
      seller: {
        name: "Digital Arts Studio",
        email: "hello@digitalarts.com",
        verified: false,
        riskScore: 65,
      },
      amount: 450000,
      currency: "KES",
      escalatedAt: "2025-01-04T16:45:00Z",
      escalatedBy: "Mark T. (Support)",
      assignedTo: "Paul K. (Compliance)",
      category: "Digital Services",
      paymentMethod: "Mobile Money",
      location: "Kampala, Uganda",
      description:
        "Seller operating without proper business registration and tax compliance.",
      escalationReason:
        "KYC verification revealed unregistered business entity",
      evidence: ["business_verification.pdf", "tax_compliance_check.pdf"],
      relatedCases: [],
      complianceFlags: ["KYC_ISSUE", "BUSINESS_VERIFICATION"],
      lastUpdate: "2025-01-05T09:30:00Z",
      timeToResolve: "Within SLA (18h remaining)",
      regulatoryInvolvement: false,
      sarFiled: false,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setEscalatedCases(mockEscalatedCases);
      setFilteredCases(mockEscalatedCases);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = escalatedCases.filter((escalatedCase) => {
      const matchesSearch =
        escalatedCase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escalatedCase.originalDisputeId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        escalatedCase.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        escalatedCase.buyer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        escalatedCase.seller.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        escalatedCase.buyer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        escalatedCase.seller.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === "all" || escalatedCase.severity === severityFilter;
      const matchesTier =
        tierFilter === "all" || escalatedCase.tier === tierFilter;
      const matchesCategory =
        categoryFilter === "all" ||
        escalatedCase.escalationType === categoryFilter;

      return matchesSearch && matchesSeverity && matchesTier && matchesCategory;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === "escalatedAt" || sortField === "lastUpdate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "severity") {
        const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        aValue = severityOrder[aValue as keyof typeof severityOrder];
        bValue = severityOrder[bValue as keyof typeof severityOrder];
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCases(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    severityFilter,
    tierFilter,
    categoryFilter,
    sortField,
    sortDirection,
    escalatedCases,
  ]);

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      critical: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
      high: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: AlertCircle,
      },
      medium: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Flag,
      },
      low: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Flag,
      },
    };

    const config = severityConfig[severity as keyof typeof severityConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      under_investigation: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Eye,
      },
      pending_regulatory: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: Shield,
      },
      mediation_required: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Scale,
      },
      under_review: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: Clock,
      },
      resolved: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace(/_/g, " ").charAt(0).toUpperCase() +
          status.replace(/_/g, " ").slice(1)}
      </span>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      tier_1:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      tier_2:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      tier_3: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          tierConfig[tier as keyof typeof tierConfig]
        }`}
      >
        {tier.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getEscalationTypeLabel = (type: string) => {
    const typeLabels = {
      fraud_investigation: "Fraud Investigation",
      aml_violation: "AML Violation",
      complex_dispute: "Complex Dispute",
      policy_violation: "Policy Violation",
      regulatory_review: "Regulatory Review",
      legal_escalation: "Legal Escalation",
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getTimeColor = (timeText: string) => {
    if (timeText.includes("Overdue")) return "text-red-600 dark:text-red-400";
    if (timeText.includes("remaining")) {
      const hours = parseInt(timeText.split("h")[0]);
      if (hours <= 4) return "text-orange-600 dark:text-orange-400";
      return "text-green-600 dark:text-green-400";
    }
    return "text-gray-600 dark:text-gray-300";
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectCase = (id: string) => {
    setSelectedCases((prev) =>
      prev.includes(id) ? prev.filter((caseId) => caseId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedCases.map((c) => c.id);
    if (selectedCases.length === currentPageIds.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(currentPageIds);
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
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary stats
  const criticalCount = filteredCases.filter(
    (c) => c.severity === "critical"
  ).length;
  const overdueCount = filteredCases.filter((c) =>
    c.timeToResolve.includes("Overdue")
  ).length;
  const tier3Count = filteredCases.filter((c) => c.tier === "tier_3").length;
  const totalValue = filteredCases.reduce((sum, c) => sum + c.amount, 0);

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
            Escalated Cases
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            High-priority disputes requiring senior review and resolution
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
            className="flex items-center px-3 py-2 bg-red-600 text-white dark:bg-red-700 rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: "#dc2626" }}
            whileTap={{ y: 0 }}
          >
            <ArrowUp size={16} className="mr-2" strokeWidth={1.8} />
            Escalate New Case
          </motion.button>
        </div>
      </motion.div>

      {/* Alert Summary Cards */}
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
                Total Escalated
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {filteredCases.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                Critical
              </p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {criticalCount}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
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
                Tier 3 Cases
              </p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                {tier3Count}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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
                Total Value
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalValue, "KES")}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
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
              placeholder="Search by Case ID, Dispute ID, Transaction ID, or parties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option value="all">All Tiers</option>
              <option value="tier_1">Tier 1</option>
              <option value="tier_2">Tier 2</option>
              <option value="tier_3">Tier 3</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="fraud_investigation">Fraud Investigation</option>
              <option value="aml_violation">AML Violation</option>
              <option value="complex_dispute">Complex Dispute</option>
              <option value="policy_violation">Policy Violation</option>
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

        {selectedCases.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedCases.length} case(s) selected
              </span>
              <div className="flex gap-2">
                <button className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-700">
                  Bulk Assign
                </button>
                <button className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-700">
                  Regulatory Review
                </button>
                <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Escalated Cases Table */}
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
              Loading escalated cases...
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
                          selectedCases.length === paginatedCases.length &&
                          paginatedCases.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("severity")}
                    >
                      <div className="flex items-center">
                        Severity
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Case Details
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Parties & Risk
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status & Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assignment & Timeline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedCases.map((escalatedCase) => (
                    <tr
                      key={escalatedCase.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedCases.includes(escalatedCase.id)}
                          onChange={() => handleSelectCase(escalatedCase.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSeverityBadge(escalatedCase.severity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {escalatedCase.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {escalatedCase.originalDisputeId}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {getEscalationTypeLabel(escalatedCase.escalationType)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
                          <Globe className="w-3 h-3 mr-1" />
                          {escalatedCase.location}
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
                                {escalatedCase.buyer.name}
                              </span>
                              {escalatedCase.buyer.verified && (
                                <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                              )}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                escalatedCase.buyer.riskScore >= 80
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : escalatedCase.buyer.riskScore >= 60
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {escalatedCase.buyer.riskScore}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Seller:
                              </span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">
                                {escalatedCase.seller.name}
                              </span>
                              {escalatedCase.seller.verified && (
                                <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                              )}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                escalatedCase.seller.riskScore >= 80
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : escalatedCase.seller.riskScore >= 60
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {escalatedCase.seller.riskScore}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(
                            escalatedCase.amount,
                            escalatedCase.currency
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {escalatedCase.paymentMethod}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {escalatedCase.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getStatusBadge(escalatedCase.status)}
                          {getTierBadge(escalatedCase.tier)}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {escalatedCase.regulatoryInvolvement && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                <Shield className="w-3 h-3 mr-1" />
                                Regulatory
                              </span>
                            )}
                            {escalatedCase.sarFiled && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                SAR Filed
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {escalatedCase.assignedTo}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Escalated by: {escalatedCase.escalatedBy}
                        </div>
                        <div
                          className={`text-xs font-medium ${getTimeColor(
                            escalatedCase.timeToResolve
                          )}`}
                        >
                          {escalatedCase.timeToResolve}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last update: {formatDate(escalatedCase.lastUpdate)}
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
                            title="Case Notes"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </motion.button>
                          {escalatedCase.evidence.length > 0 && (
                            <motion.button
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Evidence Files"
                            >
                              <FileText className="w-4 h-4" />
                            </motion.button>
                          )}
                          {escalatedCase.relatedCases.length > 0 && (
                            <motion.button
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Related Cases"
                            >
                              <Users className="w-4 h-4" />
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
                  {Math.min(startIndex + itemsPerPage, filteredCases.length)} of{" "}
                  {filteredCases.length} results
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

      {/* Escalation Matrix & Guidelines */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Escalation Framework
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                  Critical Severity
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Immediate escalation required. Involves fraud, regulatory
                  violations, or high financial risk.
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  High Severity
                </h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  Senior review within 24 hours. Complex disputes or policy
                  violations.
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Medium Severity
                </h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  Review within 48 hours. Requires specialized knowledge or
                  legal consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quick Actions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Streamline escalated case management
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-200 text-sm shadow-sm hover:bg-red-200 dark:hover:bg-red-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <AlertTriangle size={16} className="mr-2" strokeWidth={1.8} />
              Review Critical Cases
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-700 dark:text-purple-200 text-sm shadow-sm hover:bg-purple-200 dark:hover:bg-purple-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(147, 51, 234, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <Shield size={16} className="mr-2" strokeWidth={1.8} />
              Regulatory Summary
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-200 text-sm shadow-sm hover:bg-blue-200 dark:hover:bg-blue-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <Users size={16} className="mr-2" strokeWidth={1.8} />
              Bulk Assignment
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EscalatedCasesPage;