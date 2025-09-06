import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpDown,
  Eye,
  Shield,
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
  Flag,
  Users,
  DollarSign,
  TrendingUp,
  Brain,
  Target,
  Lock,
  Activity,
  AlertCircle,
  Crosshair,
  Database,
  ScanLine
} from "lucide-react";

const AMLFraudDetectionPage: React.FC = () => {
  const [detections, setDetections] = useState<any[]>([]);
  const [filteredDetections, setFilteredDetections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskLevelFilter, setRiskLevelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("detectedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedDetections, setSelectedDetections] = useState<string[]>([]);

  // Mock AML/Fraud detection data
  const mockDetections = [
    {
      id: "AML-2025-001120",
      type: "suspicious_pattern",
      riskLevel: "critical",
      status: "under_investigation",
      confidence: 95,
      detectedAt: "2025-01-08T14:30:00Z",
      lastUpdated: "2025-01-08T16:45:00Z",
      assignedTo: "Jane W. (Compliance)",
      userId: "USER-001245",
      userName: "Ahmed Hassan",
      userEmail: "ahmed.h@example.com",
      userRiskScore: 45,
      transactionId: "TXN-2025-001245",
      amount: 2500000,
      currency: "KES",
      description:
        "Multiple high-value transactions to high-risk jurisdictions within 24 hours",
      flags: [
        "HIGH_VALUE",
        "RAPID_SUCCESSION",
        "HIGH_RISK_JURISDICTION",
        "NEW_BENEFICIARY",
      ],
      ruleTriggered: "AML_RULE_007",
      ruleName: "Rapid High-Value Cross-Border Pattern",
      evidenceItems: 8,
      relatedTransactions: 5,
      sarRequired: true,
      sarStatus: "pending",
      location: "Lagos, Nigeria",
      deviceFingerprint: "DEVICE-FP-98765",
      ipAddress: "192.168.1.100",
      geoLocation: "Lagos, Nigeria",
    },
    {
      id: "FRAUD-2025-001119",
      type: "account_takeover",
      riskLevel: "high",
      status: "confirmed_fraud",
      confidence: 88,
      detectedAt: "2025-01-07T16:20:00Z",
      lastUpdated: "2025-01-08T09:30:00Z",
      assignedTo: "Paul K. (Security)",
      userId: "USER-001238",
      userName: "Maria Santos",
      userEmail: "maria.s@example.com",
      userRiskScore: 92,
      transactionId: "TXN-2025-001241",
      amount: 750000,
      currency: "KES",
      description:
        "Login from new device with immediate high-value transaction attempt",
      flags: [
        "NEW_DEVICE",
        "LOCATION_ANOMALY",
        "VELOCITY_CHECK",
        "PASSWORD_RESET",
      ],
      ruleTriggered: "FRAUD_RULE_003",
      ruleName: "Account Takeover Detection",
      evidenceItems: 12,
      relatedTransactions: 3,
      sarRequired: false,
      sarStatus: "not_required",
      location: "Nairobi, Kenya",
      deviceFingerprint: "DEVICE-FP-12345",
      ipAddress: "10.0.0.5",
      geoLocation: "Cape Town, South Africa",
    },
    {
      id: "AML-2025-001118",
      type: "structuring",
      riskLevel: "high",
      status: "escalated",
      confidence: 92,
      detectedAt: "2025-01-06T11:30:00Z",
      lastUpdated: "2025-01-07T14:20:00Z",
      assignedTo: "Compliance Team",
      userId: "USER-001232",
      userName: "David Chen",
      userEmail: "david.c@example.com",
      userRiskScore: 67,
      transactionId: "TXN-2025-001235",
      amount: 980000,
      currency: "KES",
      description:
        "Multiple transactions just below reporting threshold within short timeframe",
      flags: ["THRESHOLD_AVOIDANCE", "PATTERN_MATCHING", "UNUSUAL_FREQUENCY"],
      ruleTriggered: "AML_RULE_012",
      ruleName: "Transaction Structuring Detection",
      evidenceItems: 6,
      relatedTransactions: 8,
      sarRequired: true,
      sarStatus: "filed",
      location: "Kampala, Uganda",
      deviceFingerprint: "DEVICE-FP-56789",
      ipAddress: "172.16.0.10",
      geoLocation: "Kampala, Uganda",
    },
    {
      id: "FRAUD-2025-001117",
      type: "synthetic_identity",
      riskLevel: "medium",
      status: "false_positive",
      confidence: 75,
      detectedAt: "2025-01-05T09:15:00Z",
      lastUpdated: "2025-01-06T11:20:00Z",
      assignedTo: "Mark T. (KYC)",
      userId: "USER-001229",
      userName: "Emma Thompson",
      userEmail: "emma.t@example.com",
      userRiskScore: 85,
      transactionId: "TXN-2025-001232",
      amount: 150000,
      currency: "KES",
      description:
        "Identity verification inconsistencies detected during enhanced due diligence",
      flags: ["IDENTITY_MISMATCH", "DOCUMENT_ANOMALY", "ADDRESS_VERIFICATION"],
      ruleTriggered: "FRAUD_RULE_008",
      ruleName: "Synthetic Identity Detection",
      evidenceItems: 4,
      relatedTransactions: 1,
      sarRequired: false,
      sarStatus: "not_required",
      location: "Nairobi, Kenya",
      deviceFingerprint: "DEVICE-FP-11111",
      ipAddress: "192.168.0.1",
      geoLocation: "Nairobi, Kenya",
    },
    {
      id: "AML-2025-001116",
      type: "politically_exposed",
      riskLevel: "high",
      status: "monitoring",
      confidence: 89,
      detectedAt: "2025-01-04T16:45:00Z",
      lastUpdated: "2025-01-05T09:30:00Z",
      assignedTo: "Senior Compliance",
      userId: "USER-001225",
      userName: "Robert Wilson",
      userEmail: "robert.w@example.com",
      userRiskScore: 55,
      transactionId: "TXN-2025-001228",
      amount: 1800000,
      currency: "KES",
      description:
        "Transaction involving politically exposed person requires enhanced monitoring",
      flags: [
        "PEP_MATCH",
        "HIGH_VALUE",
        "ENHANCED_MONITORING",
        "SANCTIONS_CHECK",
      ],
      ruleTriggered: "AML_RULE_015",
      ruleName: "PEP Monitoring",
      evidenceItems: 10,
      relatedTransactions: 2,
      sarRequired: true,
      sarStatus: "under_review",
      location: "Dar es Salaam, Tanzania",
      deviceFingerprint: "DEVICE-FP-22222",
      ipAddress: "203.0.113.0",
      geoLocation: "Dar es Salaam, Tanzania",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDetections(mockDetections);
      setFilteredDetections(mockDetections);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = detections.filter((detection) => {
      const matchesSearch =
        detection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detection.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        detection.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detection.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detection.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRiskLevel =
        riskLevelFilter === "all" || detection.riskLevel === riskLevelFilter;
      const matchesType = typeFilter === "all" || detection.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || detection.status === statusFilter;

      return matchesSearch && matchesRiskLevel && matchesType && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (
        sortField === "amount" ||
        sortField === "confidence" ||
        sortField === "userRiskScore"
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === "detectedAt" || sortField === "lastUpdated") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "riskLevel") {
        const riskOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        aValue = riskOrder[aValue as keyof typeof riskOrder];
        bValue = riskOrder[bValue as keyof typeof riskOrder];
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDetections(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    riskLevelFilter,
    typeFilter,
    statusFilter,
    sortField,
    sortDirection,
    detections,
  ]);

  const getRiskLevelBadge = (riskLevel: string) => {
    const riskConfig = {
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

    const config = riskConfig[riskLevel as keyof typeof riskConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      under_investigation: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Eye,
      },
      confirmed_fraud: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: XCircle,
      },
      escalated: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: Zap,
      },
      monitoring: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Activity,
      },
      false_positive: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      dismissed: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: XCircle,
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

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      suspicious_pattern:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      account_takeover:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      structuring:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      synthetic_identity:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      politically_exposed:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          typeConfig[type as keyof typeof typeConfig]
        }`}
      >
        {type.replace(/_/g, " ").charAt(0).toUpperCase() +
          type.replace(/_/g, " ").slice(1)}
      </span>
    );
  };

  const getSarStatusBadge = (sarStatus: string, sarRequired: boolean) => {
    if (!sarRequired) return null;

    const sarConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      filed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      under_review: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Eye,
      },
    };

    const config = sarConfig[sarStatus as keyof typeof sarConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        SAR {sarStatus.replace(/_/g, " ")}
      </span>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-red-600 dark:text-red-400";
    if (confidence >= 75) return "text-orange-600 dark:text-orange-400";
    if (confidence >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectDetection = (id: string) => {
    setSelectedDetections((prev) =>
      prev.includes(id) ? prev.filter((detId) => detId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedDetections.map((d) => d.id);
    if (selectedDetections.length === currentPageIds.length) {
      setSelectedDetections([]);
    } else {
      setSelectedDetections(currentPageIds);
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
  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDetections = filteredDetections.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary stats
  const criticalCount = filteredDetections.filter(
    (d) => d.riskLevel === "critical"
  ).length;
  const confirmedFraudCount = filteredDetections.filter(
    (d) => d.status === "confirmed_fraud"
  ).length;
  const sarPendingCount = filteredDetections.filter(
    (d) => d.sarRequired && d.sarStatus === "pending"
  ).length;
  const totalValue = filteredDetections.reduce((sum, d) => sum + d.amount, 0);

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
            AML/Fraud Detection
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and investigate suspicious activities and compliance
            violations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export SAR
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-purple-600 text-white dark:bg-purple-700 rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: "#7c3aed" }}
            whileTap={{ y: 0 }}
          >
            <Brain size={16} className="mr-2" strokeWidth={1.8} />
            ML Model Status
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
                Active Detections
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {filteredDetections.length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                Critical Risk
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
                SAR Pending
              </p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                {sarPendingCount}
              </p>
            </div>
            <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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
              placeholder="Search by Detection ID, Transaction ID, user name, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={riskLevelFilter}
              onChange={(e) => setRiskLevelFilter(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="suspicious_pattern">Suspicious Pattern</option>
              <option value="account_takeover">Account Takeover</option>
              <option value="structuring">Structuring</option>
              <option value="synthetic_identity">Synthetic Identity</option>
              <option value="politically_exposed">PEP</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="confirmed_fraud">Confirmed Fraud</option>
              <option value="escalated">Escalated</option>
              <option value="monitoring">Monitoring</option>
              <option value="false_positive">False Positive</option>
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

        {selectedDetections.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedDetections.length} detection(s) selected
              </span>
              <div className="flex gap-2">
                <button className="text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700">
                  Bulk Escalate
                </button>
                <button className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-700">
                  Mark False Positive
                </button>
                <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

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
              Loading detections...
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
                          selectedDetections.length ===
                            paginatedDetections.length &&
                          paginatedDetections.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("riskLevel")}
                    >
                      <div className="flex items-center">
                        Risk Level
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Detection Details
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User & Risk Score
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        Transaction
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status & Compliance
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("detectedAt")}
                    >
                      <div className="flex items-center">
                        Timeline
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedDetections.map((detection) => (
                    <tr
                      key={detection.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedDetections.includes(detection.id)}
                          onChange={() => handleSelectDetection(detection.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getRiskLevelBadge(detection.riskLevel)}
                          <div
                            className={`text-sm font-medium ${getConfidenceColor(
                              detection.confidence
                            )}`}
                          >
                            {detection.confidence}% confidence
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {detection.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {detection.transactionId}
                        </div>
                        <div className="mt-1">
                          {getTypeBadge(detection.type)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Rule: {detection.ruleName}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
                          <Globe className="w-3 h-3 mr-1" />
                          {detection.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {detection.userName}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {detection.userEmail}
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                detection.userRiskScore >= 80
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : detection.userRiskScore >= 60
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {detection.userRiskScore}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {detection.userId}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Device: {detection.deviceFingerprint}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            IP: {detection.ipAddress}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(detection.amount, detection.currency)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Related: {detection.relatedTransactions} transactions
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Evidence: {detection.evidenceItems} items
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {detection.flags.slice(0, 2).map((flag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            >
                              {flag}
                            </span>
                          ))}
                          {detection.flags.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{detection.flags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getStatusBadge(detection.status)}
                          {getSarStatusBadge(
                            detection.sarStatus,
                            detection.sarRequired
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Assigned: {detection.assignedTo}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Detected: {formatDate(detection.detectedAt)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Updated: {formatDate(detection.lastUpdated)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Geo: {detection.geoLocation}
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
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Investigation Notes"
                          >
                            <FileText className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Risk Analysis"
                          >
                            <Target className="w-4 h-4" />
                          </motion.button>
                          {detection.sarRequired && (
                            <motion.button
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="SAR Management"
                            >
                              <Shield className="w-4 h-4" />
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
                    filteredDetections.length
                  )}{" "}
                  of {filteredDetections.length} results
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

      {/* ML Model Status & Rules */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Detection System Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-1 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  ML Models
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  5 models active, 98.7% accuracy, last trained 2 days ago
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1 flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Rule Engine
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  47 active rules, 12 triggered today, 2.1% false positive rate
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1 flex items-center">
                  <ScanLine className="w-4 h-4 mr-2" />
                  Real-time Monitoring
                </h4>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  Processing 1,247 transactions/hour, 0.03s avg response time
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
              Streamline AML/fraud investigation workflows
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
              Review Critical
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl text-orange-700 dark:text-orange-200 text-sm shadow-sm hover:bg-orange-200 dark:hover:bg-orange-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <FileText size={16} className="mr-2" strokeWidth={1.8} />
              Generate SAR
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-700 dark:text-purple-200 text-sm shadow-sm hover:bg-purple-200 dark:hover:bg-purple-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(147, 51, 234, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <Brain size={16} className="mr-2" strokeWidth={1.8} />
              Model Tuning
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AMLFraudDetectionPage;