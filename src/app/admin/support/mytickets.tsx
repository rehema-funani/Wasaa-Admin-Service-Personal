import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Filter,
  Search,
  Clock,
  AlertTriangle,
  MessageSquare,
  Tag,
  User,
  Calendar,
  ChevronDown,
  CheckCircle,
  AlertOctagon,
  ChevronRight,
  BarChart3,
  XCircle,
  CheckSquare,
  ArrowRightLeft
} from "lucide-react";
import supportService from "../../../api/services/support";

const MyAssignedTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    resolvedToday: 0,
    avgResponseTime: 0,
    pendingUpdates: 0,
  });
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [resolveNote, setResolveNote] = useState("");

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const fetchAssignedTickets = async () => {
    try {
      setIsLoading(true);
      const res = await supportService.getMyAssignedTickets();
      setTickets(res);

      // Calculate stats
      setStats({
        totalAssigned: res.length,
        resolvedToday: res.filter((ticket: any) => {
          const resolvedDate = ticket.resolvedAt && new Date(ticket.resolvedAt);
          const today = new Date();
          return (
            resolvedDate && resolvedDate.toDateString() === today.toDateString()
          );
        }).length,
        avgResponseTime: calculateAverageResponseTime(res),
        pendingUpdates: res.filter(
          (ticket: any) =>
            (ticket.status === "OPEN" &&
              ticket.lastCustomerReplyAt &&
              !ticket.lastAgentReplyAt) ||
            new Date(ticket.lastCustomerReplyAt) >
              new Date(ticket.lastAgentReplyAt)
        ).length,
      });
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageResponseTime = (tickets: any[]) => {
    const ticketsWithResponses = tickets.filter(
      (ticket) => ticket.lastCustomerReplyAt && ticket.lastAgentReplyAt
    );

    if (ticketsWithResponses.length === 0) return 0;

    const totalMinutes = ticketsWithResponses.reduce((sum, ticket) => {
      const customerReply = new Date(ticket.lastCustomerReplyAt);
      const agentReply = new Date(ticket.lastAgentReplyAt);
      if (agentReply > customerReply) {
        const diffInMinutes = Math.floor(
          (agentReply.getTime() - customerReply.getTime()) / (1000 * 60)
        );
        return sum + diffInMinutes;
      }
      return sum;
    }, 0);

    return Math.round(totalMinutes / ticketsWithResponses.length);
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;

    try {
      await supportService.resolveTicket(selectedTicket.id, resolveNote);
      fetchAssignedTickets();
      setShowResolveModal(false);
      setSelectedTicket(null);
      setResolveNote("");
    } catch (error) {
      console.error("Error resolving ticket:", error);
    }
  };

  const handleTransferTicket = async (ticketId: string, targetQueueId: string) => {
    try {
      await supportService.transferTicket(ticketId, targetQueueId);
      fetchAssignedTickets();
    } catch (error) {
      console.error("Error transferring ticket:", error);
    }
  };

  const getTimeElapsed = (dateString: string) => {
    if (!dateString) return "N/A";

    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      if (hours < 24) {
        return `${hours}h ago`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
      }
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: {
        color:
          "bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        icon: "📝",
      },
      MEDIUM: {
        color:
          "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        icon: "⚡",
      },
      HIGH: {
        color:
          "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        icon: "🔥",
      },
      CRITICAL: {
        color:
          "bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
        icon: "🚨",
      },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig.MEDIUM;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="text-sm font-medium">{priority}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: {
        color:
          "bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        dot: "bg-blue-400 dark:bg-blue-600",
      },
      IN_PROGRESS: {
        color:
          "bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        dot: "bg-amber-400 dark:bg-amber-600",
      },
      PENDING: {
        color:
          "bg-orange-100/80 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
        dot: "bg-orange-400 dark:bg-orange-600",
      },
      RESOLVED: {
        color:
          "bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        dot: "bg-emerald-400 dark:bg-emerald-600",
      },
      CLOSED: {
        color:
          "bg-gray-100/80 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700",
        dot: "bg-gray-400 dark:bg-gray-600",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{status.replace("_", " ")}</span>
      </div>
    );
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchQuery === "" ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || ticket.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-400 dark:border-r-orange-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-gray-900/20 dark:to-gray-950">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 bg-clip-text text-transparent">
                  My Assigned Tickets
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {filteredTickets.length} tickets assigned to you
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchAssignedTickets}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.totalAssigned}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Assigned
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.resolvedToday}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Resolved Today
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.avgResponseTime}m
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Avg Response Time
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingUpdates}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Pending Updates
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search by ticket ID, subject, or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {showFilters && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="PENDING">Pending</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/30 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Tickets Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              There are no tickets matching your current filters. Try adjusting
              your search criteria or check back later.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/30 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          #{ticket.id.slice(0, 8)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {ticket.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 rounded-full flex items-center justify-center text-white font-medium">
                            {ticket.customerName.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {ticket.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {ticket.lastUpdateAt
                              ? getTimeElapsed(ticket.lastUpdateAt)
                              : getTimeElapsed(ticket.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">
                            {ticket.messageCount || 0}
                          </span>
                        </div>
                        {ticket.lastCustomerReplyAt &&
                          (!ticket.lastAgentReplyAt ||
                            new Date(ticket.lastCustomerReplyAt) >
                              new Date(ticket.lastAgentReplyAt)) && (
                            <div className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md text-xs font-medium">
                              Customer Reply
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.status !== "RESOLVED" &&
                        ticket.status !== "CLOSED" && (
                          <motion.button
                            className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowResolveModal(true);
                            }}
                          >
                            Resolve
                          </motion.button>
                        )}
                      <motion.button
                        className="px-4 py-2 bg-white/50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-white/70 dark:hover:bg-slate-600/70 transition-colors flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Open a modal or dropdown to select targetQueueId, then call handleTransferTicket
                          // Example: setTransferTicketId(ticket.id); setShowTransferModal(true);
                          // For demo, use a placeholder queue id:
                          const targetQueueId = "default-queue-id";
                          handleTransferTicket(ticket.id, targetQueueId);
                        }}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        Transfer
                      </motion.button>
                      <motion.button
                        className="p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.tags.map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Productivity Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            Your Productivity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-slate-700/30">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tickets Resolved (Last 7 Days)
              </h4>
              <div className="h-40 w-full bg-gray-50 dark:bg-slate-700/30 rounded-lg flex items-end justify-between px-4 pb-4 pt-2">
                {/* Simulating a bar chart */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-primary-500 rounded-t-md"
                    style={{ height: "40%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Mon
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-primary-500 rounded-t-md"
                    style={{ height: "65%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Tue
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-primary-500 rounded-t-md"
                    style={{ height: "55%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Wed
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-primary-500 rounded-t-md"
                    style={{ height: "75%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Thu
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-primary-500 rounded-t-md"
                    style={{ height: "60%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Fri
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-primary-500 rounded-t-md"
                    style={{ height: "25%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sat
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-primary-500 rounded-t-md"
                    style={{ height: "15%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sun
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-slate-700/30">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Response Time Performance
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      First Response
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      15 min avg
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Target: 30 min - You're 15 min ahead of target
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Resolution Time
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      4.2 hours avg
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "70%" }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Target: 6 hours - You're 1.8 hours ahead of target
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Customer Satisfaction
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      4.8/5.0
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: "96%" }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Team Average: 4.5/5.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Ticket Modal */}
      {showResolveModal && selectedTicket && (
        <motion.div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResolveModal(false)}
        >
          <motion.div
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full border border-white/20 dark:border-slate-700/30 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Resolve Ticket
              </h3>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                onClick={() => setShowResolveModal(false)}
              >
                <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ticket: {selectedTicket.subject}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                #{selectedTicket.id.slice(0, 8)} • {selectedTicket.customerName}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resolution Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 h-32 resize-none"
                  placeholder="Describe how this ticket was resolved..."
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                />
              </div>

              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mr-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Resolving this ticket will notify the customer that their
                  issue has been resolved.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
                  onClick={() => setShowResolveModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleResolveTicket}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckSquare className="w-4 h-4" />
                  Resolve Ticket
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MyAssignedTicketsPage;