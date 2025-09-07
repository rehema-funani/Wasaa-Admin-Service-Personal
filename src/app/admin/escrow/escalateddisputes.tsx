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
  ArrowUp,
  RefreshCw,
  Hash,
  Building,
  Target
} from "lucide-react";
import { escrowService } from "../../../api/services/escrow";

const EscalatedCasesPage: React.FC = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [filteredCases, setFilteredCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  const fetchEscalatedDisputes = async () => {
    try {
      setIsLoading(true);
      const res = await escrowService.getEscalatedDisputes();
      setDisputes(res || []);
    } catch (error) {
      console.error("Error fetching escalated disputes:", error);
      setDisputes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalatedDisputes();
  }, []);

  useEffect(() => {
    let filtered = disputes.filter((dispute) => {
      const matchesSearch =
        dispute.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.escrowId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.raisedByName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.escrow?.initiator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.escrow?.counterparty?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === "all" || dispute.priority?.toLowerCase() === priorityFilter.toLowerCase();
      
      const matchesStatus =
        statusFilter === "all" || dispute.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesPriority && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "amountMinor") {
        aValue = Number(a.escrow?.amountMinor || 0);
        bValue = Number(b.escrow?.amountMinor || 0);
      } else if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue || '');
        bValue = new Date(bValue || '');
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

    setFilteredCases(filtered);
    setCurrentPage(1);
  }, [searchTerm, priorityFilter, statusFilter, sortField, sortDirection, disputes]);

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      HIGH: {
        color: "bg-red-100/80 text-red-700 border-red-200",
        icon: AlertTriangle,
        dot: "bg-red-400"
      },
      MEDIUM: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200",
        icon: Flag,
        dot: "bg-amber-400"
      },
      LOW: {
        color: "bg-blue-100/80 text-blue-700 border-blue-200",
        icon: Flag,
        dot: "bg-blue-400"
      }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}>
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{priority}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ESCALATED: {
        color: "bg-red-100/80 text-red-700 border-red-200",
        icon: Zap,
        dot: "bg-red-400"
      },
      UNDER_REVIEW: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200",
        icon: Eye,
        dot: "bg-amber-400"
      },
      PENDING_RESPONSE: {
        color: "bg-orange-100/80 text-orange-700 border-orange-200",
        icon: Clock,
        dot: "bg-orange-400"
      },
      RESOLVED: {
        color: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
        dot: "bg-emerald-400"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ESCALATED;
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}>
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
      </div>
    );
  };

  const formatCurrency = (amountMinor: string | number, currency: string) => {
    const amount = parseInt(amountMinor.toString()) / 100;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeElapsed = (createdAt: string) => {
    if (!createdAt) return 'N/A';
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
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

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);

  // Calculate summary stats
  const highPriorityCount = filteredCases.filter((c) => c.priority === "HIGH").length;
  const overdueCount = filteredCases.filter((c) => {
    const hoursElapsed = Math.floor((new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60));
    return hoursElapsed > 48; // Consider overdue after 48 hours
  }).length;
  const escalatedCount = filteredCases.filter((c) => c.status === "ESCALATED").length;
  const totalValue = filteredCases.reduce((sum, c) => sum + parseInt(c.escrow?.amountMinor || '0'), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Escalated Cases
              </h1>
              <p className="text-gray-500 mt-1">
                High-priority disputes requiring senior review and resolution
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 rounded-xl transition-colors"
                onClick={fetchEscalatedDisputes}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button
                className="flex items-center px-3 py-2 bg-white/50 hover:bg-white/70 border border-white/30 rounded-xl text-gray-600 text-sm shadow-sm"
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ y: 0 }}
              >
                <Download size={16} className="mr-2" strokeWidth={1.8} />
                Export
              </motion.button>
              <motion.button
                className="flex items-center px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl text-sm shadow-lg"
                whileHover={{ y: -2, backgroundColor: "#dc2626" }}
                whileTap={{ y: 0 }}
              >
                <ArrowUp size={16} className="mr-2" strokeWidth={1.8} />
                Escalate New Case
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Escalated</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{filteredCases.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-sm text-red-600 font-medium">Active cases</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{highPriorityCount}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-sm text-orange-600 font-medium">Urgent attention</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overdueCount}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-sm text-red-600 font-medium">Past deadline</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-2xl">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalValue, "KES")}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-green-600 font-medium">At risk</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-2xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Case ID, Escrow ID, reason, or parties..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="escalated">Escalated</option>
                <option value="under_review">Under Review</option>
                <option value="pending_response">Pending Response</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            <div className="mt-4 p-3 bg-red-50/50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-800">
                  {selectedCases.length} case(s) selected
                </span>
                <div className="flex gap-2">
                  <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200">
                    Bulk Assign
                  </button>
                  <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200">
                    Regulatory Review
                  </button>
                  <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200">
                    Export Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Escalated Cases Table */}
        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-400 rounded-full animate-spin animation-delay-75 mx-auto" />
              </div>
              <p className="text-gray-500 mt-4">Loading escalated cases...</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Escalated Dispute Cases</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {filteredCases.length} of {disputes.length} escalated cases
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedCases.length === paginatedCases.length && paginatedCases.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("priority")}
                      >
                        <div className="flex items-center">
                          Priority
                          <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center">
                          Case Details
                          <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parties
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("amountMinor")}
                      >
                        <div className="flex items-center">
                          Amount
                          <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/40 divide-y divide-gray-200">
                    {paginatedCases.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No escalated cases found
                          </h3>
                          <p className="text-gray-500">
                            {searchTerm || priorityFilter !== "all" || statusFilter !== "all" 
                              ? "Try adjusting your search criteria or filters"
                              : "No cases have been escalated yet"
                            }
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedCases.map((dispute: any, index: number) => (
                        <motion.tr
                          key={dispute.id}
                          className="hover:bg-white/60 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedCases.includes(dispute.id)}
                              onChange={() => handleSelectCase(dispute.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPriorityBadge(dispute.priority)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {dispute.id?.slice(0, 8)}...
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Escrow: {dispute.escrowId?.slice(0, 8)}...
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {dispute.reason?.slice(0, 50)}...
                              </div>
                              {dispute.milestoneId && (
                                <div className="text-xs text-gray-400 flex items-center mt-1">
                                  <Target className="w-3 h-3 mr-1" />
                                  Milestone: {dispute.milestoneId.slice(0, 8)}...
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <User className="w-3 h-3 mr-1 text-gray-400" />
                                <span className="font-medium text-gray-900">Initiator:</span>
                                <span className="ml-1 text-gray-600">
                                  {dispute.escrow?.initiator || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <User className="w-3 h-3 mr-1 text-gray-400" />
                                <span className="font-medium text-gray-900">Counterparty:</span>
                                <span className="ml-1 text-gray-600">
                                  {dispute.escrow?.counterparty || 'N/A'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Flag className="w-3 h-3 mr-1" />
                                Raised by: {dispute.raisedByName || 'Unknown'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(dispute.escrow?.amountMinor || '0', dispute.escrow?.currency || 'KES')}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Building className="w-3 h-3 mr-1" />
                                {dispute.escrow?.purpose || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getStatusBadge(dispute.status)}
                              {dispute.outcome && (
                                <div className="text-xs text-gray-500">
                                  Outcome: {dispute.outcome}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">
                                Escalated: {formatDate(dispute.createdAt)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Updated: {formatDate(dispute.updatedAt)}
                              </div>
                              <div className="text-xs text-gray-