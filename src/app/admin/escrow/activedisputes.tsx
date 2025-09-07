import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ArrowUpDown,
  Eye,
  MessageSquare,
  AlertTriangle,
  Clock,
  User,
  FileText,
  CheckCircle,
  CreditCard,
  Timer,
  Zap,
  Scale,
  Flag,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { escrowService } from "../../../api/services/escrow";
import { useNavigate } from "react-router-dom";

const ActiveDisputesPage: React.FC = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedDisputes, setSelectedDisputes] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchDisputes = async () => {
    try {
      setIsLoading(true);
      const res = await escrowService.getAllDisputes();
      setDisputes(res || []);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      setDisputes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  useEffect(() => {
    let filtered = disputes.filter((dispute) => {
      const matchesSearch =
        dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.escrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.raisedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.escrow?.initiator
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        dispute.escrow?.counterparty
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        dispute.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesPriority =
        priorityFilter === "all" ||
        dispute.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "amountMinor") {
        aValue = Number(a.escrow?.amountMinor || 0);
        bValue = Number(b.escrow?.amountMinor || 0);
      } else if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === "priority") {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
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
    sortField,
    sortDirection,
    disputes,
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: AlertTriangle,
      },
      UNDER_REVIEW: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Eye,
      },
      PENDING_RESPONSE: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: Clock,
      },
      ESCALATED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: Zap,
      },
      RESOLVED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN;
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      HIGH: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      MEDIUM:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      LOW: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          priorityConfig[priority as keyof typeof priorityConfig] ||
          priorityConfig.LOW
        }`}
      >
        {priority}
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

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    }
  };

  const getSlaStatus = (createdAt: string, priority: string) => {
    const hours = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
    );
    const thresholds = { HIGH: 4, MEDIUM: 24, LOW: 48 };
    const threshold = thresholds[priority as keyof typeof thresholds] || 48;

    if (hours > threshold) return "overdue";
    if (hours > threshold * 0.8) return "approaching_deadline";
    return "within_sla";
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

  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDisputes = filteredDisputes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const highPriorityCount = filteredDisputes.filter(
    (d) => d.priority === "HIGH"
  ).length;
  const overdueCount = filteredDisputes.filter(
    (d) => getSlaStatus(d.createdAt, d.priority) === "overdue"
  ).length;
  const escalatedCount = filteredDisputes.filter(
    (d) => d.status === "ESCALATED"
  ).length;
  const totalValue = filteredDisputes.reduce(
    (sum, d) => sum + parseInt(d.escrow?.amountMinor || "0"),
    0
  );

  return (
    <div className="max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
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
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            onClick={fetchDisputes}
            disabled={isLoading}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              strokeWidth={1.8}
            />
            {isLoading ? "Loading..." : "Refresh"}
          </motion.button>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                High Priority
              </p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {highPriorityCount}
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
                {formatCurrency(totalValue.toString(), "KES")}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>
      </div>

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
              placeholder="Search by Dispute ID, Escrow ID, reason, or raised by..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="pending_response">Pending Response</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <motion.div
        className="bg-white w-fit dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Parties
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("amountMinor")}
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
                      Timeline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedDisputes.map((dispute) => {
                    const slaStatus = getSlaStatus(
                      dispute.createdAt,
                      dispute.priority
                    );
                    const timeElapsed = getTimeElapsed(dispute.createdAt);

                    return (
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
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Initiator:
                              </span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">
                                {dispute.escrow?.initiator || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Counterparty:
                              </span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">
                                {dispute.escrow?.counterparty || "N/A"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Flag className="w-3 h-3 mr-1" />
                              Raised by: {dispute.raisedByName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(
                              dispute.escrow?.amountMinor || "0",
                              dispute.escrow?.currency || "KES"
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {dispute.escrow?.purpose || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {getStatusBadge(dispute.status)}
                            {getSlaStatusBadge(slaStatus)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            Created: {formatDate(dispute.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Updated: {formatDate(dispute.updatedAt)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Elapsed: {timeElapsed}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                navigate(`/admin/escrow/disputes/${dispute.id}`)
                              }
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
                            <motion.button
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Evidence"
                            >
                              <FileText className="w-4 h-4" />
                            </motion.button>
                            {dispute.status !== "RESOLVED" && (
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredDisputes.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No disputes found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  priorityFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "No active disputes at the moment"}
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredDisputes.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredDisputes.length
                    )}{" "}
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
            )}
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
                  High Priority
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Response within 4 hours. Immediate attention required for
                  urgent cases.
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Medium Priority
                </h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  Response within 24 hours. Standard dispute resolution
                  timeline.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/20 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Low Priority
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Response within 48 hours. Lower urgency cases and follow-ups.
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
              Escalate High Priority
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ActiveDisputesPage;
