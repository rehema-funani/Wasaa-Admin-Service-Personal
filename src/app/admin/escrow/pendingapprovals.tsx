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
  AlertTriangle,
  Shield,
  User,
  FileText,
  DollarSign,
  Zap,
  AlertCircle,
  Globe,
  CreditCard,
  Timer
} from "lucide-react";

const PendingApprovalsPage: React.FC = () => {
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [approvalMode, setApprovalMode] = useState<'single' | 'bulk'>('single');

  // Mock pending transactions data
  const mockPendingTransactions = [
    {
      id: "TXN-2025-001250",
      buyer: { 
        name: "Ahmed Hassan", 
        email: "ahmed.h@example.com", 
        verified: true,
        kycStatus: "verified",
        riskScore: 85
      },
      seller: { 
        name: "Grace Wanjiku", 
        email: "grace.w@example.com", 
        verified: false,
        kycStatus: "pending",
        riskScore: 72
      },
      amount: 2500000,
      currency: "KES",
      riskLevel: "high",
      priority: "urgent",
      createdAt: "2025-01-08T08:30:00Z",
      waitingTime: "4h 15m",
      paymentMethod: "Bank Transfer",
      category: "Real Estate",
      location: "Nairobi, Kenya",
      reason: "High value transaction requires compliance review",
      documents: ["purchase_agreement.pdf", "id_verification.jpg"],
      complianceFlags: ["AML_THRESHOLD", "HIGH_VALUE"]
    },
    {
      id: "TXN-2025-001249",
      buyer: { 
        name: "Michael Johnson", 
        email: "m.johnson@example.com", 
        verified: true,
        kycStatus: "verified",
        riskScore: 92
      },
      seller: { 
        name: "Sarah Ochieng", 
        email: "sarah.o@example.com", 
        verified: true,
        kycStatus: "verified",
        riskScore: 88
      },
      amount: 150000,
      currency: "KES",
      riskLevel: "medium",
      priority: "high",
      createdAt: "2025-01-08T06:45:00Z",
      waitingTime: "6h 0m",
      paymentMethod: "Mobile Money",
      category: "Electronics",
      location: "Lagos, Nigeria",
      reason: "Cross-border transaction flagged for review",
      documents: ["invoice.pdf", "shipping_details.pdf"],
      complianceFlags: ["CROSS_BORDER"]
    },
    {
      id: "TXN-2025-001248",
      buyer: { 
        name: "Linda Mwangi", 
        email: "linda.m@example.com", 
        verified: true,
        kycStatus: "verified",
        riskScore: 78
      },
      seller: { 
        name: "Robert Kimani", 
        email: "robert.k@example.com", 
        verified: false,
        kycStatus: "expired",
        riskScore: 65
      },
      amount: 75000,
      currency: "KES",
      riskLevel: "medium",
      priority: "normal",
      createdAt: "2025-01-07T14:20:00Z",
      waitingTime: "22h 25m",
      paymentMethod: "Wallet",
      category: "Services",
      location: "Kampala, Uganda",
      reason: "Seller KYC documentation expired",
      documents: ["service_contract.pdf"],
      complianceFlags: ["KYC_EXPIRED"]
    },
    {
      id: "TXN-2025-001247",
      buyer: { 
        name: "David Osei", 
        email: "david.o@example.com", 
        verified: true,
        kycStatus: "verified",
        riskScore: 89
      },
      seller: { 
        name: "Mary Wanjala", 
        email: "mary.w@example.com", 
        verified: true,
        kycStatus: "verified",
        riskScore: 91
      },
      amount: 320000,
      currency: "KES",
      riskLevel: "low",
      priority: "normal",
      createdAt: "2025-01-07T11:15:00Z",
      waitingTime: "1d 1h 30m",
      paymentMethod: "Bank Transfer",
      category: "Goods",
      location: "Accra, Ghana",
      reason: "Routine manual verification required",
      documents: ["goods_receipt.pdf", "quality_certificate.pdf"],
      complianceFlags: ["MANUAL_REVIEW"]
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPendingTransactions(mockPendingTransactions);
      setFilteredTransactions(mockPendingTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = pendingTransactions.filter(transaction => {
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.seller.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === "all" || transaction.priority === priorityFilter;
      const matchesRisk = riskFilter === "all" || transaction.riskLevel === riskFilter;
      
      return matchesSearch && matchesPriority && matchesRisk;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "priority") {
        const priorityOrder = { urgent: 3, high: 2, normal: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder];
        bValue = priorityOrder[bValue as keyof typeof priorityOrder];
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, priorityFilter, riskFilter, sortField, sortDirection, pendingTransactions]);

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: Zap },
      high: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", icon: AlertTriangle },
      normal: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: Clock }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${riskConfig[risk as keyof typeof riskConfig]}`}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </span>
    );
  };

  const getKycStatusBadge = (status: string) => {
    const statusConfig = {
      verified: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
      expired: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
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

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactions(prev => 
      prev.includes(id) 
        ? prev.filter(txId => txId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedTransactions.map(t => t.id);
    if (selectedTransactions.length === currentPageIds.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(currentPageIds);
    }
  };

  const handleApprove = (transactionId: string) => {
    console.log(`Approving transaction: ${transactionId}`);
    // Add approval logic here
  };

  const handleReject = (transactionId: string) => {
    console.log(`Rejecting transaction: ${transactionId}`);
    // Add rejection logic here
  };

  const handleBulkApprove = () => {
    console.log(`Bulk approving transactions: ${selectedTransactions}`);
    // Add bulk approval logic here
  };

  const handleBulkReject = () => {
    console.log(`Bulk rejecting transactions: ${selectedTransactions}`);
    // Add bulk rejection logic here
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
      minute: "2-digit"
    });
  };

  const getWaitingTimeColor = (waitingTime: string) => {
    const hours = parseInt(waitingTime.split('h')[0]);
    if (hours >= 48) return "text-red-600 dark:text-red-400";
    if (hours >= 24) return "text-orange-600 dark:text-orange-400";
    if (hours >= 12) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Calculate summary stats
  const urgentCount = filteredTransactions.filter(t => t.priority === 'urgent').length;
  const overdueCount = filteredTransactions.filter(t => parseInt(t.waitingTime.split('h')[0]) >= 24).length;
  const totalValue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

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
            Pending Approvals
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and approve escrow transactions awaiting authorization
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
            className="flex items-center px-3 py-2 bg-green-600 text-white dark:bg-green-700 rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: "#16a34a" }}
            whileTap={{ y: 0 }}
            onClick={handleBulkApprove}
            disabled={selectedTransactions.length === 0}
          >
            <CheckCircle size={16} className="mr-2" strokeWidth={1.8} />
            Bulk Approve ({selectedTransactions.length})
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Pending</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {filteredTransactions.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Urgent Priority</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue (&gt;24h)</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
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
              placeholder="Search by Transaction ID, buyer, seller, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
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

        {selectedTransactions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedTransactions.length} transaction(s) selected
              </span>
              <div className="flex gap-2">
                <button 
                  className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-700"
                  onClick={handleBulkApprove}
                >
                  Bulk Approve
                </button>
                <button 
                  className="text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700"
                  onClick={handleBulkReject}
                >
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

      {/* Pending Transactions Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading pending approvals...</p>
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
                        checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort('priority')}
                    >
                      <div className="flex items-center">
                        Priority
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        Transaction
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Parties & KYC
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Risk & Flags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Waiting Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedTransactions.includes(transaction.id)}
                          onChange={() => handleSelectTransaction(transaction.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(transaction.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {transaction.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
                          <Globe className="w-3 h-3 mr-1" />
                          {transaction.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">Buyer:</span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">{transaction.buyer.name}</span>
                              {transaction.buyer.verified && (
                                <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                              )}
                            </div>
                            {getKycStatusBadge(transaction.buyer.kycStatus)}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">Seller:<span className="ml-1 text-gray-600 dark:text-gray-300">{transaction.seller.name}</span> </span>
                              {transaction.seller.verified && (
                                <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                              )}
                            </div>
                            {getKycStatusBadge(transaction.seller.kycStatus)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {transaction.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getRiskBadge(transaction.riskLevel)}
                          <div className="flex flex-wrap gap-1">
                            {transaction.complianceFlags.map((flag, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              >
                                {flag.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getWaitingTimeColor(transaction.waitingTime)}`}>
                          {transaction.waitingTime}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleApprove(transaction.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReject(transaction.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FileText className="w-4 h-4" />
                          </motion.button>
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quick Actions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Streamline approval workflows with batch operations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-200 text-sm shadow-sm hover:bg-green-200 dark:hover:bg-green-900/40"
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)" }}
              whileTap={{ y: 0 }}
            >
              <CheckCircle size={16} className="mr-2" strokeWidth={1.8} />
              Approve All Low Risk
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-200 text-sm shadow-sm hover:bg-blue-200 dark:hover:bg-blue-900/40"
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)" }}
              whileTap={{ y: 0 }}
            >
              <Eye size={16} className="mr-2" strokeWidth={1.8} />
              Review High Risk
            </motion.button>
            <motion.button
              className="flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-200 text-sm shadow-sm hover:bg-amber-200 dark:hover:bg-amber-900/40"
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)" }}
              whileTap={{ y: 0 }}
            >
              <AlertTriangle size={16} className="mr-2" strokeWidth={1.8} />
              Flag Overdue Items
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApprovalsPage;