import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ArrowUpDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  FileText,
  User,
  CreditCard,
  RotateCcw,
  AlertCircle,
  Globe,
  ExternalLink,
  Info
} from "lucide-react";

const RefundsReversalsPage: React.FC = () => {
  const [refundData, setRefundData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [sortField, setSortField] = useState("requestedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const mockRefundData = [
    {
      id: "REF-2025-001120",
      originalTxnId: "TXN-2025-001245",
      type: "refund",
      requestedBy: "buyer",
      requester: { name: "David Chen", email: "david.c@example.com" },
      recipient: { name: "Sarah Ahmed", email: "sarah.a@example.com" },
      amount: 1200000,
      currency: "KES",
      reason: "non_delivery",
      status: "pending",
      priority: "high",
      requestedAt: "2025-01-08T14:30:00Z",
      processedAt: null,
      estimatedCompletion: "2025-01-09T14:30:00Z",
      paymentMethod: "Wallet",
      category: "Goods",
      location: "Cape Town, South Africa",
      description: "Seller failed to deliver goods within agreed timeframe",
      evidence: ["shipping_receipt.pdf", "communication_log.txt"],
      approvalRequired: true,
      processingFee: 12000,
      netAmount: 1188000,
    },
    {
      id: "REV-2025-001119",
      originalTxnId: "TXN-2025-001243",
      type: "reversal",
      requestedBy: "admin",
      requester: { name: "System Admin", email: "admin@wasaachat.com" },
      recipient: { name: "James Wilson", email: "james.w@example.com" },
      amount: 180000,
      currency: "KES",
      reason: "duplicate_transaction",
      status: "processing",
      priority: "normal",
      requestedAt: "2025-01-08T11:15:00Z",
      processedAt: "2025-01-08T11:45:00Z",
      estimatedCompletion: "2025-01-08T16:00:00Z",
      paymentMethod: "Bank Transfer",
      category: "Digital Goods",
      location: "Kigali, Rwanda",
      description: "Duplicate transaction created in error",
      evidence: ["duplicate_analysis.pdf"],
      approvalRequired: false,
      processingFee: 1800,
      netAmount: 178200,
    },
    {
      id: "REF-2025-001118",
      originalTxnId: "TXN-2025-001241",
      type: "refund",
      requestedBy: "seller",
      requester: { name: "Mary Johnson", email: "mary.j@example.com" },
      recipient: { name: "John Doe", email: "john.doe@example.com" },
      amount: 450000,
      currency: "KES",
      reason: "fraud_suspected",
      status: "completed",
      priority: "urgent",
      requestedAt: "2025-01-07T16:20:00Z",
      processedAt: "2025-01-07T18:45:00Z",
      estimatedCompletion: "2025-01-08T16:20:00Z",
      paymentMethod: "Mobile Money",
      category: "Services",
      location: "Nairobi, Kenya",
      description: "Suspicious buyer activity detected",
      evidence: ["fraud_report.pdf", "transaction_analysis.pdf"],
      approvalRequired: true,
      processingFee: 4500,
      netAmount: 445500,
    },
    {
      id: "REV-2025-001117",
      originalTxnId: "TXN-2025-001240",
      type: "reversal",
      requestedBy: "compliance",
      requester: {
        name: "Compliance Officer",
        email: "compliance@wasaachat.com",
      },
      recipient: { name: "Alice Smith", email: "alice.smith@example.com" },
      amount: 75000,
      currency: "KES",
      reason: "aml_violation",
      status: "rejected",
      priority: "high",
      requestedAt: "2025-01-07T09:30:00Z",
      processedAt: "2025-01-07T14:15:00Z",
      estimatedCompletion: null,
      paymentMethod: "Bank Transfer",
      category: "Goods",
      location: "Lagos, Nigeria",
      description: "Transaction flagged for AML compliance violation",
      evidence: ["aml_report.pdf", "compliance_review.pdf"],
      approvalRequired: true,
      processingFee: 0,
      netAmount: 75000,
      rejectionReason: "Insufficient evidence for AML violation",
    },
    {
      id: "REF-2025-001116",
      originalTxnId: "TXN-2025-001239",
      type: "refund",
      requestedBy: "buyer",
      requester: { name: "Emma Thompson", email: "emma.t@example.com" },
      recipient: { name: "Michael Brown", email: "michael.b@example.com" },
      amount: 320000,
      currency: "KES",
      reason: "quality_issues",
      status: "completed",
      priority: "normal",
      requestedAt: "2025-01-06T12:45:00Z",
      processedAt: "2025-01-06T16:30:00Z",
      estimatedCompletion: "2025-01-07T12:45:00Z",
      paymentMethod: "Wallet",
      category: "Goods",
      location: "Accra, Ghana",
      description: "Product quality did not meet specifications",
      evidence: ["quality_report.pdf", "product_photos.zip"],
      approvalRequired: false,
      processingFee: 3200,
      netAmount: 316800,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRefundData(mockRefundData);
      setFilteredData(mockRefundData);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = refundData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.originalTxnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requester.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recipient.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesReason =
        reasonFilter === "all" || item.reason === reasonFilter;

      return matchesSearch && matchesStatus && matchesType && matchesReason;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === "requestedAt" || sortField === "processedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    typeFilter,
    reasonFilter,
    sortField,
    sortDirection,
    refundData,
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      processing: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: RefreshCw,
      },
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      rejected: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      refund: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: ArrowLeft,
      },
      reversal: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: RotateCcw,
      },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
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

  const getReasonLabel = (reason: string) => {
    const reasonLabels = {
      non_delivery: "Non-delivery",
      quality_issues: "Quality Issues",
      fraud_suspected: "Fraud Suspected",
      duplicate_transaction: "Duplicate Transaction",
      aml_violation: "AML Violation",
      technical_error: "Technical Error",
      buyer_request: "Buyer Request",
      seller_request: "Seller Request",
    };
    return reasonLabels[reason as keyof typeof reasonLabels] || reason;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((item) => item.id);
    if (selectedItems.length === currentPageIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentPageIds);
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary stats
  const totalRefunds = filteredData.filter(
    (item) => item.type === "refund"
  ).length;
  const totalReversals = filteredData.filter(
    (item) => item.type === "reversal"
  ).length;
  const pendingCount = filteredData.filter(
    (item) => item.status === "pending"
  ).length;
  const totalValue = filteredData.reduce((sum, item) => sum + item.amount, 0);

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
            Refunds & Reversals
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage fund returns and transaction reversals
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
            className="flex items-center px-3 py-2 bg-purple-600 text-white dark:bg-purple-700 rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: "#7c3aed" }}
            whileTap={{ y: 0 }}
          >
            <ArrowLeft size={16} className="mr-2" strokeWidth={1.8} />
            Initiate Refund
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
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
                Total Refunds
              </p>
              <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                {totalRefunds}
              </p>
            </div>
            <ArrowLeft className="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
                Total Reversals
              </p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                {totalReversals}
              </p>
            </div>
            <RotateCcw className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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
                Pending
              </p>
              <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                {pendingCount}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
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
              placeholder="Search by ID, transaction, user name, or email..."
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="refund">Refunds</option>
              <option value="reversal">Reversals</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
            >
              <option value="all">All Reasons</option>
              <option value="non_delivery">Non-delivery</option>
              <option value="quality_issues">Quality Issues</option>
              <option value="fraud_suspected">Fraud Suspected</option>
              <option value="duplicate_transaction">
                Duplicate Transaction
              </option>
              <option value="aml_violation">AML Violation</option>
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

        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex gap-2">
                <button className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-700">
                  Bulk Approve
                </button>
                <button className="text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700">
                  Bulk Reject
                </button>
                <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Refunds & Reversals Table */}
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
              Loading refunds and reversals...
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
                          selectedItems.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Request ID
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type & Reason
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
                      Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("requestedAt")}
                    >
                      <div className="flex items-center">
                        Requested
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {item.originalTxnId}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
                          <Globe className="w-3 h-3 mr-1" />
                          {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getTypeBadge(item.type)}
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {getReasonLabel(item.reason)}
                          </div>
                          {getPriorityBadge(item.priority)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              From:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {item.requester.name}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              To:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {item.recipient.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Requested by: {item.requestedBy}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(item.amount, item.currency)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {item.paymentMethod}
                        </div>
                        {item.processingFee > 0 && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            Fee:{" "}
                            {formatCurrency(item.processingFee, item.currency)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(item.status)}
                          {item.approvalRequired &&
                            item.status === "pending" && (
                              <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Approval Required
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(item.requestedAt)}
                        </div>
                        {item.processedAt && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Processed: {formatDate(item.processedAt)}
                          </div>
                        )}
                        {item.estimatedCompletion &&
                          item.status === "processing" && (
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              ETA: {formatDate(item.estimatedCompletion)}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {item.status === "pending" && (
                            <>
                              <motion.button
                                className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          {item.evidence.length > 0 && (
                            <motion.button
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Evidence"
                            >
                              <FileText className="w-4 h-4" />
                            </motion.button>
                          )}
                          {item.status === "rejected" && (
                            <motion.button
                              className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 p-1 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Rejection Reason"
                            >
                              <Info className="w-4 h-4" />
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
                  {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} results
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

      {/* Processing Guidelines */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Processing Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Refunds
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Return funds to buyer when seller fails to deliver or quality
                  issues arise. Processing fee may apply.
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Reversals
                </h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  Cancel transactions due to system errors, duplicates, or
                  compliance violations.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                  SLA Target
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Process refunds within 24-72 hours. Urgent cases within 4
                  hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RefundsReversalsPage;