import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ArrowUpDown,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  MoreHorizontal,
  RefreshCw,
  FileText,
  DollarSign,
  Users,
  Globe,
} from "lucide-react";

const AllTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );

  const mockTransactions = [
    {
      id: "TXN-2025-001247",
      buyer: {
        name: "John Doe",
        email: "john.doe@example.com",
        verified: true,
      },
      seller: {
        name: "Mary Johnson",
        email: "mary.j@example.com",
        verified: true,
      },
      amount: 250000,
      currency: "KES",
      status: "active",
      riskLevel: "low",
      createdAt: "2025-01-08T10:30:00Z",
      expiryDate: "2025-01-15T10:30:00Z",
      paymentMethod: "Mobile Money",
      category: "Goods",
      location: "Nairobi, Kenya",
    },
    {
      id: "TXN-2025-001246",
      buyer: {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        verified: true,
      },
      seller: {
        name: "Bob Wilson",
        email: "bob.w@example.com",
        verified: false,
      },
      amount: 75000,
      currency: "KES",
      status: "pending",
      riskLevel: "medium",
      createdAt: "2025-01-08T09:15:00Z",
      expiryDate: "2025-01-12T09:15:00Z",
      paymentMethod: "Bank Transfer",
      category: "Services",
      location: "Lagos, Nigeria",
    },
    {
      id: "TXN-2025-001245",
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
      status: "disputed",
      riskLevel: "high",
      createdAt: "2025-01-07T16:20:00Z",
      expiryDate: "2025-01-14T16:20:00Z",
      paymentMethod: "Wallet",
      category: "Goods",
      location: "Cape Town, South Africa",
    },
    {
      id: "TXN-2025-001244",
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
      status: "released",
      riskLevel: "low",
      createdAt: "2025-01-07T14:45:00Z",
      expiryDate: "2025-01-14T14:45:00Z",
      paymentMethod: "Mobile Money",
      category: "Services",
      location: "Accra, Ghana",
    },
    {
      id: "TXN-2025-001243",
      buyer: {
        name: "James Wilson",
        email: "james.w@example.com",
        verified: false,
      },
      seller: {
        name: "Lisa Davis",
        email: "lisa.d@example.com",
        verified: true,
      },
      amount: 180000,
      currency: "KES",
      status: "refunded",
      riskLevel: "medium",
      createdAt: "2025-01-06T11:30:00Z",
      expiryDate: "2025-01-13T11:30:00Z",
      paymentMethod: "Bank Transfer",
      category: "Digital Goods",
      location: "Kigali, Rwanda",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.buyer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.seller.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.buyer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.seller.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;
      const matchesRisk =
        riskFilter === "all" || transaction.riskLevel === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
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
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    riskFilter,
    sortField,
    sortDirection,
    transactions,
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      active: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Shield,
      },
      released: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      disputed: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
      refunded: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: RefreshCw,
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

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          riskConfig[risk as keyof typeof riskConfig]
        }`}
      >
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
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
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((txId) => txId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedTransactions.map((t) => t.id);
    if (selectedTransactions.length === currentPageIds.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(currentPageIds);
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
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
            All Escrow Transactions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor all escrow transactions
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
            className="flex items-center px-3 py-2 bg-primary-600 text-white dark:bg-primary-700 rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: "#4f46e5" }}
            whileTap={{ y: 0 }}
          >
            <FileText size={16} className="mr-2" strokeWidth={1.8} />
            Create Escrow
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
                Total Transactions
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {filteredTransactions.length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                Total Value
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {formatCurrency(
                  filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
                  "KES"
                )}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
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
                Active Escrows
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {
                  filteredTransactions.filter((t) => t.status === "active")
                    .length
                }
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
                Disputes
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {
                  filteredTransactions.filter((t) => t.status === "disputed")
                    .length
                }
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="released">Released</option>
              <option value="disputed">Disputed</option>
              <option value="refunded">Refunded</option>
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
              <option value={100}>100 per page</option>
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
                <button className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700">
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

      {/* Transactions Table */}
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
              Loading transactions...
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
                          selectedTransactions.length ===
                            paginatedTransactions.length &&
                          paginatedTransactions.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Transaction ID
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Risk
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Created
                        <ArrowUpDown className="ml-1 w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedTransactions.includes(
                            transaction.id
                          )}
                          onChange={() =>
                            handleSelectTransaction(transaction.id)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {transaction.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Buyer:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {transaction.buyer.name}
                            </span>
                            {transaction.buyer.verified && (
                              <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Seller:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {transaction.seller.name}
                            </span>
                            {transaction.seller.verified && (
                              <CheckCircle className="ml-1 w-3 h-3 text-green-500" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRiskBadge(transaction.riskLevel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(transaction.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {transaction.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
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
                    filteredTransactions.length
                  )}{" "}
                  of {filteredTransactions.length} results
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
    </div>
  );
};

export default AllTransactionsPage;
