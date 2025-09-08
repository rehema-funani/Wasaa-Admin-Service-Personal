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
  UserCheck,
  Calendar,
  ChevronDown,
  CheckCircle,
  AlertOctagon,
  ChevronRight,
  Users,
  BarChart3,
} from "lucide-react";
import supportService from "../../../api/services/support";

const AvailableTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedQueue, setSelectedQueue] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [queueConfigs, setQueueConfigs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    highPriorityTickets: 0,
    avgWaitTime: 0,
    pendingAssignment: 0,
  });

  useEffect(() => {
    fetchAvailableTickets();
    fetchQueueConfigs();
  }, []);

  const fetchAvailableTickets = async () => {
    try {
      setIsLoading(true);
      const res = await supportService.getAvailableTickets();
      setTickets(res);

      // Calculate stats
      setStats({
        totalTickets: res.length,
        highPriorityTickets: res.filter(
          (ticket: any) =>
            ticket.priority === "HIGH" || ticket.priority === "CRITICAL"
        ).length,
        avgWaitTime: calculateAverageWaitTime(res),
        pendingAssignment: res.filter((ticket: any) => !ticket.assignedAgent)
          .length,
      });
    } catch (error) {
      console.error("Error fetching available tickets:", error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQueueConfigs = async () => {
    try {
      const res = await supportService.getQueueConfigs();
      setQueueConfigs(res.filter((config: any) => config.isActive));
    } catch (error) {
      console.error("Error fetching queue configurations:", error);
      setQueueConfigs([]);
    }
  };

  const calculateAverageWaitTime = (tickets: any[]) => {
    if (!tickets.length) return 0;

    const totalMinutes = tickets.reduce((sum, ticket) => {
      const createdDate = new Date(ticket.createdAt);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60)
      );
      return sum + diffInMinutes;
    }, 0);

    return Math.round(totalMinutes / tickets.length);
  };

  const handleAssignToMe = async (ticketId: string) => {
    try {
      await supportService.assignTicket(ticketId, "self");
      fetchAvailableTickets();
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60)
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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchQuery === "" ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      selectedPriority === "all" || ticket.priority === selectedPriority;

    const matchesQueue =
      selectedQueue === "all" || ticket.queueId === selectedQueue;

    return matchesSearch && matchesPriority && matchesQueue;
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
                  Available Tickets
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {filteredTickets.length} tickets waiting for assignment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchAvailableTickets}
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
                  {stats.totalTickets}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Tickets
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
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.highPriorityTickets}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  High Priority
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
                  {stats.avgWaitTime}m
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Avg Wait Time
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
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingAssignment}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Pending Assignment
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Queue
                </label>
                <select
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedQueue}
                  onChange={(e) => setSelectedQueue(e.target.value)}
                >
                  <option value="all">All Queues</option>
                  {queueConfigs.map((queue) => (
                    <option key={queue.id} value={queue.id}>
                      {queue.name}
                    </option>
                  ))}
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
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityBadge(ticket.priority)}
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          #{ticket.id.slice(0, 8)}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                          {ticket.queueName || "General Queue"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {ticket.subject}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
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
                            {getTimeElapsed(ticket.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">
                            {ticket.messageCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAssignToMe(ticket.id)}
                      >
                        Assign to Me
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

        {/* Performance Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            Queue Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-slate-700/30">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Ticket Resolution Time (Last 7 Days)
              </h4>
              <div className="h-40 w-full bg-gray-50 dark:bg-slate-700/30 rounded-lg flex items-end justify-between px-4 pb-4 pt-2">
                {/* Simulating a bar chart */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-green-400 dark:bg-green-500 rounded-t-md"
                    style={{ height: "30%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Mon
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-green-400 dark:bg-green-500 rounded-t-md"
                    style={{ height: "50%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Tue
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-green-400 dark:bg-green-500 rounded-t-md"
                    style={{ height: "70%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Wed
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-green-400 dark:bg-green-500 rounded-t-md"
                    style={{ height: "45%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Thu
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-green-400 dark:bg-green-500 rounded-t-md"
                    style={{ height: "65%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Fri
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-green-400 dark:bg-green-500 rounded-t-md"
                    style={{ height: "35%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sat
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 bg-green-400 dark:bg-green-500 rounded-t-md"
                    style={{ height: "20%" }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sun
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-slate-700/30">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Agent Availability
              </h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    12/15
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Agents Online
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      General Support
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      5/6
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "83%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Technical Support
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      4/5
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Billing Support
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      3/4
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableTicketsPage;
