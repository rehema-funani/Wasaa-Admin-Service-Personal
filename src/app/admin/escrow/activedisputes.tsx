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
  Timer,
  Zap,
  Scale,
  Flag,
  Users,
  DollarSign
} from "lucide-react";

const ActiveDisputesPage: React.FC = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("raisedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedDisputes, setSelectedDisputes] = useState<string[]>([]);

  // Mock disputes data
  const mockDisputes = [
    {
      id: "D-2025-001120",
      transactionId: "TXN-2025-001245",
      disputeType: "non_delivery",
      status: "open",
      priority: "high",
      raisedBy: "buyer",
      buyer: {
        name: "David Chen",
        email: "david.c@example.com",
        verified: true,
      },
      seller: {
        name: "Sarah Ahmed",
        email: "sarah.a@example.com",
        verified: true,
      },
      amount: 1200000,
      currency: "KES",
      raisedAt: "2025-01-08T14:30:00Z",
      lastActivity: "2025-01-08T16:45:00Z",
      responseDeadline: "2025-01-10T14:30:00Z",
      category: "Goods",
      paymentMethod: "Wallet",
      location: "Cape Town, South Africa",
      description:
        "Seller has not delivered goods after 7 days. No tracking information provided.",
      evidence: ["order_receipt.pdf", "communication_screenshots.png"],
      messages: 5,
      escalationLevel: "tier_1",
      assignedTo: "Sarah M. (Support)",
      slaStatus: "within_sla",
      timeElapsed: "1d 2h 15m",
    },
    {
      id: "D-2025-001119",
      transactionId: "TXN-2025-001241",
      disputeType: "quality_issues",
      status: "under_review",
      priority: "medium",
      raisedBy: "buyer",
      buyer: {
        name: "Emma Thompson",
        email: "emma.t@example.com",
        verified: true,
      },
      seller: {
        name: "Michael Brown",
        email: "michael.b@example.com",
        verified: true,
      },
      amount: 450000,
      currency: "KES",
      raisedAt: "2025-01-07T16:20:00Z",
      lastActivity: "2025-01-08T09:30:00Z",
      responseDeadline: "2025-01-09T16:20:00Z",
      category: "Services",
      paymentMethod: "Mobile Money",
      location: "Nairobi, Kenya",
      description:
        "Service quality does not match agreed specifications. Requesting partial refund.",
      evidence: ["quality_report.pdf", "comparison_photos.zip"],
      messages: 12,
      escalationLevel: "tier_2",
      assignedTo: "Paul K. (Compliance)",
      slaStatus: "within_sla",
      timeElapsed: "16h 10m",
    },
    {
      id: "D-2025-001118",
      transactionId: "TXN-2025-001238",
      disputeType: "fraud_suspected",
      status: "escalated",
      priority: "urgent",
      raisedBy: "seller",
      buyer: {
        name: "John Wilson",
        email: "john.w@example.com",
        verified: false,
      },
      seller: {
        name: "Lisa Davis",
        email: "lisa.d@example.com",
        verified: true,
      },
      amount: 750000,
      currency: "KES",
      raisedAt: "2025-01-06T11:30:00Z",
      lastActivity: "2025-01-07T14:20:00Z",
      responseDeadline: "2025-01-08T11:30:00Z",
      category: "Electronics",
      paymentMethod: "Bank Transfer",
      location: "Lagos, Nigeria",
      description:
        "Suspicious buyer behavior. Multiple failed verification attempts.",
      evidence: ["verification_attempts.pdf", "ip_analysis.pdf"],
      messages: 8,
      escalationLevel: "tier_3",
      assignedTo: "Jane W. (Admin)",
      slaStatus: "overdue",
      timeElapsed: "2d 3h 0m",
    },
    {
      id: "D-2025-001117",
      transactionId: "TXN-2025-001235",
      disputeType: "payment_issues",
      status: "pending_response",
      priority: "normal",
      raisedBy: "seller",
      buyer: {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        verified: true,
      },
      seller: {
        name: "Robert Kim",
        email: "robert.k@example.com",
        verified: true,
      },
      amount: 180000,
      currency: "KES",
      raisedAt: "2025-01-05T09:15:00Z",
      lastActivity: "2025-01-06T11:20:00Z",
      responseDeadline: "2025-01-08T09:15:00Z",
      category: "Digital Goods",
      paymentMethod: "Card",
      location: "Kampala, Uganda",
      description:
        "Payment authorization failed multiple times. Buyer not responding.",
      evidence: ["payment_logs.pdf"],
      messages: 3,
      escalationLevel: "tier_1",
      assignedTo: "Mark T. (Support)",
      slaStatus: "approaching_deadline",
      timeElapsed: "3d 5h 15m",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDisputes(mockDisputes);
      setFilteredDisputes(mockDisputes);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = disputes.filter((dispute) => {
      const matchesSearch =
        dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        dispute.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.seller.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || dispute.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || dispute.priority === priorityFilter;
      const matchesType =
        typeFilter === "all" || dispute.disputeType === typeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === "raisedAt" || sortField === "lastActivity") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "priority") {
        const priorityOrder = { urgent: 3, high: 2, medium: 1, normal: 0 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder];
        bValue = priorityOrder[bValue as keyof typeof priorityOrder];
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDisputes(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    typeFilter,
    sortField,
    sortDirection,
    disputes,
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: AlertTriangle,
      },
      under_review: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Eye,
      },
      pending_response: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: Clock,
      },
      escalated: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: Zap,
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
        {status.replace("_", " ").charAt(0).toUpperCase() +
          status.replace("_", " ").slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      normal: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          priorityConfig[priority as keyof typeof priorityConfig]
        }`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getSlaStatusBadge = (slaStatus: string) => {
    const slaConfig = {
      within_sla: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      approaching_deadline: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      overdue: {
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
        {slaStatus.replace("_", " ")}
      </span>
    );
  };

  const getDisputeTypeLabel = (type: string) => {
    const typeLabels = {
      non_delivery: "Non-delivery",
      quality_issues: "Quality Issues",
      fraud_suspected: "Fraud Suspected",
      payment_issues: "Payment Issues",
      wrong_item: "Wrong Item",
      damaged_goods: "Damaged Goods",
      service_dispute: "Service Dispute",
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectDispute = (id: string) => {
    setSelectedDisputes((prev) =>
      prev.includes(id)
        ? prev.filter((disputeId) => disputeId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedDisputes.map((d) => d.id);
    if (selectedDisputes.length === currentPageIds.length) {
      setSelectedDisputes([]);
    } else {
      setSelectedDisputes(currentPageIds);
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
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDisputes = filteredDisputes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary stats
  const urgentCount = filteredDisputes.filter(
    (d) => d.priority === "urgent"
  ).length;
  const overdueCount = filteredDisputes.filter(
    (d) => d.slaStatus === "overdue"
  ).length;
  const escalatedCount = filteredDisputes.filter(
    (d) => d.status === "escalated"
  ).length;
  const totalValue = filteredDisputes.reduce((sum, d) => sum + d.amount, 0);

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
            Active Disputes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and resolve transaction disputes
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
            <Scale size={16} className="mr-2" strokeWidth={1.8} />
            Bulk Resolve
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
                Total Active
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {filteredDisputes.length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Urgent</p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {urgentCount}
              </p>
            </div>
            <Zap className="w-8 h-8 text-red-600 dark:text-red-400" />
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
                Overdue
              </p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                {overdueCount}
              </p>
            </div>
            <Timer className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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
              placeholder="Search by Dispute ID, Transaction ID, buyer, seller, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="pending_response">Pending Response</option>
              <option value="escalated">Escalated</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="normal">Normal</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="non_delivery">Non-delivery</option>
              <option value="quality_issues">Quality Issues</option>
              <option value="fraud_suspected">Fraud Suspected</option>
              <option value="payment_issues">Payment Issues</option>
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

        {selectedDisputes.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedDisputes.length} dispute(s) selected
              </span>
              <div className="flex gap-2">
                <button className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-700">
                  Bulk Resolve
                </button>
                <button className="text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700">
                  Escalate Selected
                </button>
                <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Disputes Table */}
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
              Loading disputes...
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
                          selectedDisputes.length ===
                            paginatedDisputes.length &&
                          paginatedDisputes.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("priority")}
                    >
                      <div className="flex items-center">
                        Priority
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Dispute Details
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Parties
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
                      Status & SLA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedDisputes.map((dispute) => (
                    <tr
                      key={dispute.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedDisputes.includes(dispute.id)}
                          onChange={() => handleSelectDispute(dispute.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(dispute.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {dispute.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {dispute.transactionId}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {getDisputeTypeLabel(dispute.disputeType)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
                          <Globe className="w-3 h-3 mr-1" />
                          {dispute.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Buyer:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {dispute.buyer.name}
                            </span>
                            {dispute.buyer.verified && (
                              <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Seller:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {dispute.seller.name}
                            </span>
                            {dispute.seller.verified && (
                              <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Flag className="w-3 h-3 mr-1" />
                            Raised by: {dispute.raisedBy}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(dispute.amount, dispute.currency)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {dispute.paymentMethod}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {dispute.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getStatusBadge(dispute.status)}
                          {getSlaStatusBadge(dispute.slaStatus)}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Elapsed: {dispute.timeElapsed}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {dispute.assignedTo}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {dispute.escalationLevel
                            .replace("_", " ")
                            .toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {dispute.messages} messages
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
                            title="Chat/Messages"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </motion.button>
                          {dispute.evidence.length > 0 && (
                            <motion.button
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Evidence"
                            >
                              <FileText className="w-4 h-4" />
                            </motion.button>
                          )}
                          {dispute.status !== "resolved" && (
                            <motion.button
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Escalate"
                            >
                              <Zap className="w-4 h-4" />
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
                  {Math.min(startIndex + itemsPerPage, filteredDisputes.length)}{" "}
                  of {filteredDisputes.length} results
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

      {/* SLA & Resolution Guidelines */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Dispute Resolution Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Tier 1 (Support)
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Initial response within 4 hours. Handle standard disputes and
                  collect evidence.
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Tier 2 (Compliance)
                </h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  Complex disputes and fraud cases. Review within 24 hours.
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                  Tier 3 (Admin)
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Escalated cases requiring final authority. Resolve within 48
                  hours.
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
              Streamline dispute management with batch operations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-200 text-sm shadow-sm hover:bg-green-200 dark:hover:bg-green-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <CheckCircle size={16} className="mr-2" strokeWidth={1.8} />
              Resolve Overdue
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-200 text-sm shadow-sm hover:bg-blue-200 dark:hover:bg-blue-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <MessageSquare size={16} className="mr-2" strokeWidth={1.8} />
              Bulk Message
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-200 text-sm shadow-sm hover:bg-amber-200 dark:hover:bg-amber-900/40"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
              }}
              whileTap={{ y: 0 }}
            >
              <Zap size={16} className="mr-2" strokeWidth={1.8} />
              Escalate Urgent
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ActiveDisputesPage;