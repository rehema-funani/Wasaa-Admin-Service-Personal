import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ArrowUpDown,
  Eye,
  TrendingUp,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Target,
  ArrowRight,
  RefreshCw,
  MoreVertical,
  Wallet,
  Shield,
  Lock,
  Edit,
  RotateCcw,
  User
} from "lucide-react";
import { escrowService } from '../../../api/services/escrow';
import { useNavigate } from "react-router-dom";

const EscrowListPage: React.FC = () => {
  const [escrows, setEscrows] = useState<any[]>([]);
  const [filteredEscrows, setFilteredEscrows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedEscrows, setSelectedEscrows] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEscrowList();
  }, []);

  useEffect(() => {
    let filtered = escrows.filter((escrow) => {
      const matchesSearch =
        escrow.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.initiator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.purpose.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        escrow.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesPurpose =
        purposeFilter === "all" ||
        escrow.purpose.toLowerCase() === purposeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPurpose;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (
        sortField === "amountMinor" ||
        sortField === "fundedMinor" ||
        sortField === "releasedMinor"
      ) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (
        sortField === "createdAt" ||
        sortField === "updatedAt" ||
        sortField === "deadline"
      ) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEscrows(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    purposeFilter,
    sortField,
    sortDirection,
    escrows,
  ]);

  const fetchEscrowList = async () => {
    try {
      setIsLoading(true);
      const res = await escrowService.getEscrowAgreements();
      setEscrows(res || []);
    } catch (error) {
      console.error("Error fetching escrow list:", error);
      setEscrows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: FileText,
      },
      PENDING_FUNDING: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      FUNDED: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: CheckCircle,
      },
      PARTIALLY_RELEASED: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: ArrowRight,
      },
      RELEASED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      DISPUTED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
      CANCELLED: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: XCircle,
      },
      REFUNDED: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: RotateCcw,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
      </span>
    );
  };

  const formatCurrency = (amountMinor: string, currency: string) => {
    const amount = parseInt(amountMinor) / 100;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
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

  const calculateProgress = (escrow: any) => {
    const total = parseInt(escrow.amountMinor);
    const released = parseInt(escrow.releasedMinor);
    const refunded = parseInt(escrow.refundedMinor);
    return total > 0 ? ((released + refunded) / total) * 100 : 0;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectEscrow = (id: string) => {
    setSelectedEscrows((prev) =>
      prev.includes(id)
        ? prev.filter((escrowId) => escrowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedEscrows.map((e) => e.id);
    if (selectedEscrows.length === currentPageIds.length) {
      setSelectedEscrows([]);
    } else {
      setSelectedEscrows(currentPageIds);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredEscrows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEscrows = filteredEscrows.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate stats
  const stats = {
    total: escrows.length,
    funded: escrows.filter((e) => e.status === "FUNDED").length,
    released: escrows.filter((e) => e.status === "RELEASED").length,
    disputed: escrows.filter((e) => e.status === "DISPUTED").length,
    totalValue: escrows.reduce((sum, e) => sum + parseInt(e.amountMinor), 0),
    fundedValue: escrows
      .filter((e) => e.status === "FUNDED")
      .reduce((sum, e) => sum + parseInt(e.amountMinor), 0),
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Escrow Agreements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Manage and monitor all escrow transactions across the platform
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Status: Active</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            onClick={fetchEscrowList}
            disabled={isLoading}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              strokeWidth={2}
            />
            {isLoading ? "Loading..." : "Refresh"}
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm shadow-lg"
            whileHover={{
              y: -2,
              boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
            }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={2} />
            Export
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        <motion.div
          className="col-span-1 lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Escrows</p>
              <p className="text-4xl font-bold mt-1">{stats.total}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">All time</span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Funded
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {stats.funded}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.funded / stats.total) * 100)
                    : 0}
                  % of total
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Released
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {stats.released}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Completed
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Disputed
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {stats.disputed}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Need attention
                </span>
              </div>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Total Value
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(stats.totalValue.toString(), "KES")}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  All escrows
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Funded Value
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(stats.fundedValue.toString(), "KES")}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Secured funds
                </span>
              </div>
            </div>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Escrow ID, Initiator, Counterparty, or Purpose..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_funding">Pending Funding</option>
              <option value="funded">Funded</option>
              <option value="partially_released">Partially Released</option>
              <option value="released">Released</option>
              <option value="disputed">Disputed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
            >
              <option value="all">All Purposes</option>
              <option value="business">Business</option>
              <option value="personal">Personal</option>
              <option value="freelance">Freelance</option>
              <option value="marketplace">Marketplace</option>
            </select>
            <button
              className="flex items-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              onClick={() =>
                setSortDirection(sortDirection === "desc" ? "asc" : "desc")
              }
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort {sortDirection === "desc" ? "Newest" : "Oldest"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Escrow Records
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing {filteredEscrows.length} of {escrows.length} escrows
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600"
                    checked={
                      selectedEscrows.length === paginatedEscrows.length &&
                      paginatedEscrows.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    Escrow Details
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Parties
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("amountMinor")}
                >
                  <div className="flex items-center">
                    Amount & Progress
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("deadline")}
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <motion.div
                      className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <p className="text-gray-500 dark:text-gray-400 mt-4">
                      Loading escrows...
                    </p>
                  </td>
                </tr>
              ) : paginatedEscrows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No escrows found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      purposeFilter !== "all"
                        ? "Try adjusting your search criteria or filters"
                        : "No escrow agreements have been created yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedEscrows.map((escrow: any, index: number) => {
                  const progress = calculateProgress(escrow);

                  return (
                    <motion.tr
                      key={escrow.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600"
                          checked={selectedEscrows.includes(escrow.id)}
                          onChange={() => handleSelectEscrow(escrow.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {escrow.purpose}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                            {escrow.has_milestone && (
                              <>
                                <Target className="w-3 h-3 mr-1" />
                                Has Milestones
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Initiator:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {escrow.initiator}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Counterparty:
                            </span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">
                              {escrow.counterparty}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(
                              escrow.amountMinor,
                              escrow.currency
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Funded:{" "}
                            {formatCurrency(
                              escrow.fundedMinor,
                              escrow.currency
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Released:{" "}
                            {formatCurrency(
                              escrow.releasedMinor,
                              escrow.currency
                            )}
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                escrow.status === "RELEASED"
                                  ? "bg-green-500"
                                  : escrow.status === "FUNDED"
                                  ? "bg-blue-500"
                                  : escrow.status === "PARTIALLY_RELEASED"
                                  ? "bg-purple-500"
                                  : "bg-gray-400"
                              }`}
                              style={{ width: `${Math.max(progress, 5)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.round(progress)}% complete
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(escrow.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          Created: {formatDate(escrow.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Deadline: {formatDate(escrow.deadline)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Updated: {formatDate(escrow.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View Details"
                            onClick={() => navigate(`/admin/escrows/${escrow.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View Documents"
                          >
                            <FileText className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEscrows.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredEscrows.length)} of{" "}
                {filteredEscrows.length} results
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
        )}
      </motion.div>
    </div>
  );
};

export default EscrowListPage;