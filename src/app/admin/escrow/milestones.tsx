import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ArrowUpDown,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Target,
  Activity,
  RefreshCw,
  MoreVertical,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { escrowService } from "../../../api/services/escrow";

const MilestonesPage: React.FC = () => {
  const [milestones, setMilestones] = useState([]);
  const [filteredMilestones, setFilteredMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchMilestones();
  }, []);

  useEffect(() => {
    let filtered = milestones;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (milestone) => milestone.status.toLowerCase() === statusFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (milestone) =>
          milestone.escrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          milestone.idx.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (milestone.name &&
            milestone.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredMilestones(filtered);
  }, [milestones, statusFilter, searchTerm, sortOrder]);

  const fetchMilestones = async () => {
    setIsLoading(true);
    try {
      const data = await escrowService.getMilestones();
      setMilestones(data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: milestones.length,
    completed: milestones.filter((m) => m.status === "COMPLETED").length,
    pending: milestones.filter((m) => m.status === "PENDING").length,
    inProgress: milestones.filter((m) => m.status === "IN_PROGRESS").length,
    totalValue: milestones.reduce((sum, m) => sum + parseInt(m.amountMinor), 0),
    completedValue: milestones
      .filter((m) => m.status === "COMPLETED")
      .reduce((sum, m) => sum + parseInt(m.amountMinor), 0),
  };

  const formatCurrency = (amountMinor: string, abbreviated = false) => {
    const amount = parseInt(amountMinor) / 100;
    if (abbreviated && amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    } else if (abbreviated && amount >= 1000) {
      return `KES ${(amount / 1000).toFixed(0)}K`;
    }
    return `KES ${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      COMPLETED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      PENDING: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      IN_PROGRESS: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: PlayCircle,
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: XCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Escrow Milestones Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Track and manage escrow milestone progress across all transactions
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
            onClick={fetchMilestones}
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
            Export Report
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
              <p className="text-blue-100 text-sm font-medium">
                Total Milestones
              </p>
              <p className="text-4xl font-bold mt-1">{stats.total}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Active tracking</span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Completed
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {stats.completed}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  % rate
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Pending
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {stats.pending}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  Awaiting action
                </span>
              </div>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                In Progress
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {stats.inProgress}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Active work
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4"
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
                {formatCurrency(stats.totalValue.toString(), true)}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Under management
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Escrow ID, Milestone ID, or Name..."
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              className="flex items-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort {sortOrder === "desc" ? "Newest" : "Oldest"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Milestone Records
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Showing {filteredMilestones.length} of {milestones.length}{" "}
                milestones
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                className="flex items-center px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </motion.button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Milestone Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Escrow ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMilestones.map((milestone: any, index: number) => {
                const releasePercentage =
                  (parseInt(milestone.releasedMinor) /
                    parseInt(milestone.amountMinor)) *
                  100;

                return (
                  <motion.tr
                    key={milestone.idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {milestone.name ||
                            `Milestone ${milestone.idx.slice(-8)}`}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {milestone.idx.slice(0, 8)}...
                        </div>
                        {milestone.description && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {milestone.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                        {milestone.escrowId.slice(-12)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(milestone.amountMinor)}
                        </div>
                        {parseInt(milestone.releasedMinor) > 0 && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Released: {formatCurrency(milestone.releasedMinor)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(milestone.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            milestone.status === "COMPLETED"
                              ? "bg-green-500"
                              : milestone.status === "IN_PROGRESS"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                          style={{
                            width:
                              milestone.status === "COMPLETED"
                                ? "100%"
                                : milestone.status === "IN_PROGRESS"
                                ? `${Math.max(releasePercentage, 25)}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {milestone.status === "COMPLETED"
                          ? "100%"
                          : milestone.status === "IN_PROGRESS"
                          ? `${Math.round(releasePercentage)}%`
                          : "0%"}{" "}
                        complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(milestone.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="View Details"
                          onClick={() => setSelectedMilestone(milestone)}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        {milestone.status === "PENDING" && (
                          <motion.button
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Start Progress"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </motion.button>
                        )}
                        {milestone.status === "IN_PROGRESS" && (
                          <>
                            <motion.button
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Complete Milestone"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Pause Progress"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
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
              })}
            </tbody>
          </table>
        </div>

        {filteredMilestones.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No milestones found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters"
                : "Get started by creating your first milestone"}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <motion.div
              className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              Loading milestones...
            </p>
          </div>
        )}
      </motion.div>

      {selectedMilestone && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedMilestone(null)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Milestone Details
              </h3>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setSelectedMilestone(null)}
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Milestone ID
                    </label>
                    <p className="font-mono text-sm text-gray-800 dark:text-gray-100">
                      {selectedMilestone.idx}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Escrow ID
                    </label>
                    <p className="font-mono text-sm text-gray-800 dark:text-gray-100">
                      {selectedMilestone.escrowId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Name
                    </label>
                    <p className="text-sm text-gray-800 dark:text-gray-100">
                      {selectedMilestone.name || "No name provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedMilestone.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Financial Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Total Amount
                    </label>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {formatCurrency(selectedMilestone.amountMinor)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Released Amount
                    </label>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedMilestone.releasedMinor)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>
                      {Math.round(
                        (parseInt(selectedMilestone.releasedMinor) /
                          parseInt(selectedMilestone.amountMinor)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        selectedMilestone.status === "COMPLETED"
                          ? "bg-green-500"
                          : selectedMilestone.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                      style={{
                        width:
                          selectedMilestone.status === "COMPLETED"
                            ? "100%"
                            : `${Math.max(
                                (parseInt(selectedMilestone.releasedMinor) /
                                  parseInt(selectedMilestone.amountMinor)) *
                                  100,
                                0
                              )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedMilestone.description && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedMilestone.description}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Created
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-100">
                      {formatDate(selectedMilestone.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Tenant ID
                    </span>
                    <span className="text-sm font-mono text-gray-800 dark:text-gray-100">
                      {selectedMilestone.tenantId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <motion.button
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setSelectedMilestone(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                {selectedMilestone.status === "PENDING" && (
                  <motion.button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Progress
                  </motion.button>
                )}
                {selectedMilestone.status === "IN_PROGRESS" && (
                  <motion.button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Complete Milestone
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MilestonesPage;
