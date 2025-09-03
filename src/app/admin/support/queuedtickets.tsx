import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  BellRing,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  HelpCircle,
  LayoutGrid,
  List,
  MessageCircle,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  User,
  ArrowUpRight,
  Zap,
  Flag
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SlaStatusBadge from "../../../components/support/SlaStatusBadge";
import PriorityBadge from "../../../components/tickets/PriorityBadge";
import StatusBadge from "../../../components/support/StatusBadge";
import CategoryBadge from "../../../components/support/CategoryBadge";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'assigned' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  userId: string;
  assignedTo?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  assignee?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  tags: string[];
  messageCount: number;
  isEscalated: boolean;
  slaStatus: 'on_track' | 'at_risk' | 'breached' | 'paused';
}

const TicketQueuePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // const response = await ticketService.getTickets();

        const dummyTickets: Ticket[] = Array.from({ length: 15 }, (_, i) => {
          const statuses = [
            "new",
            "assigned",
            "in_progress",
            "on_hold",
            "resolved",
            "closed",
          ];
          const priorities = ["low", "medium", "high", "urgent"];
          const categories = [
            "technical",
            "billing",
            "account",
            "feature",
            "general",
          ];
          const slaStatuses = ["on_track", "at_risk", "breached", "paused"];

          const randomDaysAgo = Math.floor(Math.random() * 30);
          const createdDate = new Date();
          createdDate.setDate(createdDate.getDate() - randomDaysAgo);

          const updatedDate = new Date(createdDate);
          updatedDate.setHours(
            updatedDate.getHours() +
              Math.floor(Math.random() * 24 * randomDaysAgo)
          );

          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7));

          const status =
            Math.random() < 0.7
              ? "new"
              : statuses[Math.floor(Math.random() * statuses.length)];

          return {
            id: `TKT-${1000 + i}`,
            title: [
              "Cannot access dashboard after password reset",
              "Integration with third-party service failing",
              "Error when uploading profile picture",
              "Need help configuring notification settings",
              "Account billing discrepancy",
              "Feature request: Dark mode support",
              "Mobile app crashes on startup",
              "Missing transaction records",
              "Cannot update contact information",
              "API documentation error",
            ][Math.floor(Math.random() * 10)],
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            status: status as any,
            priority: priorities[
              Math.floor(Math.random() * priorities.length)
            ] as any,
            category: categories[Math.floor(Math.random() * categories.length)],
            createdAt: createdDate.toISOString(),
            updatedAt: updatedDate.toISOString(),
            dueDate: dueDate.toISOString(),
            userId: `user-${1000 + Math.floor(Math.random() * 100)}`,
            assignedTo:
              status === "new"
                ? undefined
                : `agent-${100 + Math.floor(Math.random() * 10)}`,
            user: {
              firstName: ["John", "Jane", "Michael", "Sarah", "David"][
                Math.floor(Math.random() * 5)
              ],
              lastName: ["Doe", "Smith", "Johnson", "Williams", "Brown"][
                Math.floor(Math.random() * 5)
              ],
              email: `user${
                1000 + Math.floor(Math.random() * 100)
              }@example.com`,
            },
            assignee:
              status === "new"
                ? undefined
                : {
                    firstName: ["Alex", "Morgan", "Taylor", "Casey", "Jordan"][
                      Math.floor(Math.random() * 5)
                    ],
                    lastName: [
                      "Garcia",
                      "Lee",
                      "Martinez",
                      "Wilson",
                      "Anderson",
                    ][Math.floor(Math.random() * 5)],
                    email: `agent${
                      100 + Math.floor(Math.random() * 10)
                    }@company.com`,
                  },
            tags: Array.from(
              { length: Math.floor(Math.random() * 4) },
              () =>
                [
                  "bug",
                  "feature",
                  "documentation",
                  "account",
                  "billing",
                  "mobile",
                  "web",
                  "api",
                ][Math.floor(Math.random() * 8)]
            ),
            messageCount: Math.floor(Math.random() * 10),
            isEscalated: Math.random() < 0.2,
            slaStatus: slaStatuses[
              Math.floor(Math.random() * slaStatuses.length)
            ] as any,
          };
        });

        dummyTickets.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTickets(dummyTickets);
        setFilteredTickets(dummyTickets);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Failed to load tickets. Please try again later.");
        toast.error("Failed to load tickets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    let result = [...tickets];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(lowercasedQuery) ||
          ticket.description.toLowerCase().includes(lowercasedQuery) ||
          ticket.id.toLowerCase().includes(lowercasedQuery) ||
          ticket.user?.firstName.toLowerCase().includes(lowercasedQuery) ||
          ticket.user?.lastName.toLowerCase().includes(lowercasedQuery) ||
          ticket.user?.email.toLowerCase().includes(lowercasedQuery)
      );
    }

    if (selectedPriority !== "all") {
      result = result.filter((ticket) => ticket.priority === selectedPriority);
    }

    if (selectedStatus !== "all") {
      result = result.filter((ticket) => ticket.status === selectedStatus);
    }

    if (selectedCategory !== "all") {
      result = result.filter((ticket) => ticket.category === selectedCategory);
    }

    if (assigneeFilter === "unassigned") {
      result = result.filter((ticket) => !ticket.assignedTo);
    } else if (assigneeFilter === "assigned") {
      result = result.filter((ticket) => !!ticket.assignedTo);
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "updatedAt") {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "status") {
        const statusOrder = {
          new: 0,
          assigned: 1,
          in_progress: 2,
          on_hold: 3,
          resolved: 4,
          closed: 5,
        };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        comparison =
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredTickets(result);
  }, [
    tickets,
    searchQuery,
    selectedPriority,
    selectedStatus,
    selectedCategory,
    assigneeFilter,
    sortBy,
    sortDirection,
  ]);

  const handleViewTicket = (ticket: Ticket) => {
    navigate(`/support/tickets/${ticket.id}`);
  };

  const handleCreateTicket = () => {
    navigate("/support/tickets/create");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortDirection("asc");
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      bug: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
      feature:
        "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
      documentation:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
      account:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
      billing:
        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
      mobile:
        "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800",
      web: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
      api: "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600",
    };

    return colors[tag] || colors.api;
  };

  // Skeleton loading components
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 animate-pulse"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded mb-4"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-600">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="p-4 animate-pulse">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
            <div className="w-20 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 w-full mx-auto max-w-7xl">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">
            Support Ticket Queue
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage and process customer support requests
          </p>
        </div>

        <motion.button
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm shadow-sm"
          whileHover={{
            y: -2,
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
          }}
          whileTap={{ y: 0 }}
          onClick={handleCreateTicket}
        >
          <Plus size={16} className="mr-2" />
          Create Ticket
        </motion.button>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search tickets by ID, title, or customer..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">
              <Filter size={14} className="inline mr-1" />
              Priority:
            </span>
            <select
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">
              Status:
            </span>
            <select
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">
              Category:
            </span>
            <select
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="feature">Feature</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">
              Assigned:
            </span>
            <select
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            >
              <option value="all">All Tickets</option>
              <option value="unassigned">Unassigned</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center ml-auto">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              <SlidersHorizontal size={14} className="inline mr-1" />
              Sort:
            </span>
            <select
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="createdAt">Creation Date</option>
              <option value="updatedAt">Last Updated</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
            </select>
            <button
              className="ml-2 p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              {sortDirection === "asc" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight className="rotate-180" size={16} />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={18} className="mr-2" />
          {error}
        </motion.div>
      )}

      {/* Results Summary */}
      <motion.div
        className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <BellRing size={14} className="mr-2" />
        Showing{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
          {filteredTickets.length}
        </span>
        of{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
          {tickets.length}
        </span>{" "}
        tickets
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />}
          </motion.div>
        ) : filteredTickets.length === 0 ? (
          <motion.div
            key="empty"
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-12 text-center shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <Search size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No tickets found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
              onClick={() => {
                setSearchQuery("");
                setSelectedPriority("all");
                setSelectedStatus("all");
                setSelectedCategory("all");
                setAssigneeFilter("all");
              }}
            >
              Clear filters
            </button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md dark:hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div
                  className={`h-2 ${
                    ticket.priority === "urgent"
                      ? "bg-gradient-to-r from-red-500 to-pink-500"
                      : ticket.priority === "high"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500"
                      : ticket.priority === "medium"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-sky-500"
                  }`}
                ></div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {ticket.id}
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>

                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-tight">
                    {ticket.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <PriorityBadge priority={ticket.priority} />
                    <CategoryBadge category={ticket.category} />
                    {ticket.isEscalated && (
                      <div className="px-2 py-0.5 text-xs font-medium rounded-full border flex items-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800">
                        Escalated
                      </div>
                    )}
                  </div>

                  <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {ticket.description}
                  </div>

                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {ticket.tags.map((tag, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTagColor(
                            tag
                          )}`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>
                        {formatDistanceToNow(new Date(ticket.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {ticket.messageCount > 0 && (
                      <div className="flex items-center">
                        <MessageCircle size={12} className="mr-1" />
                        <span>{ticket.messageCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                    <div className="flex items-center text-sm">
                      <div className="flex items-center mr-4">
                        <User
                          size={14}
                          className="mr-2 text-gray-500 dark:text-gray-400"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {ticket.user.firstName} {ticket.user.lastName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <SlaStatusBadge status={ticket.slaStatus} />

                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <span className="mr-1">View</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-600 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  ticket.isEscalated
                    ? "bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                    : ""
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() => handleViewTicket(ticket)}
                whileHover={{
                  backgroundColor: "rgba(243, 244, 246, 0.6)",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center p-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-sm ${
                      ticket.priority === "urgent"
                        ? "bg-gradient-to-br from-red-500 to-pink-500"
                        : ticket.priority === "high"
                        ? "bg-gradient-to-br from-orange-500 to-amber-500"
                        : ticket.priority === "medium"
                        ? "bg-gradient-to-br from-amber-500 to-yellow-500"
                        : "bg-gradient-to-br from-blue-500 to-sky-500"
                    } text-white`}
                  >
                    {ticket.priority === "urgent" ? (
                      <Zap size={18} />
                    ) : ticket.priority === "high" ? (
                      <ArrowUpRight size={18} />
                    ) : ticket.priority === "medium" ? (
                      <Flag size={18} />
                    ) : (
                      <HelpCircle size={18} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {ticket.title}
                      </h3>

                      <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {ticket.id}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <StatusBadge status={ticket.status} />
                      <CategoryBadge category={ticket.category} />
                      <SlaStatusBadge status={ticket.slaStatus} />

                      {ticket.messageCount > 0 && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <MessageCircle size={12} className="mr-1" />
                          <span>{ticket.messageCount}</span>
                        </div>
                      )}

                      {ticket.tags && ticket.tags.length > 0 && (
                        <div className="flex gap-1.5">
                          {ticket.tags.slice(0, 2).map((tag, idx) => (
                            <div
                              key={idx}
                              className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTagColor(
                                tag
                              )}`}
                            >
                              {tag}
                            </div>
                          ))}
                          {ticket.tags.length > 2 && (
                            <div className="px-2 py-0.5 text-xs font-medium rounded-full border bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600">
                              +{ticket.tags.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} className="inline mr-1" />
                      {formatDistanceToNow(new Date(ticket.createdAt), {
                        addSuffix: true,
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      {ticket.assignee ? (
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <User size={12} className="mr-1" />
                          <span>
                            {ticket.assignee.firstName}{" "}
                            {ticket.assignee.lastName}
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Unassigned
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center ml-4">
                    {ticket.dueDate && (
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          new Date(ticket.dueDate) < new Date()
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <Calendar size={12} className="inline mr-1" />
                        {format(new Date(ticket.dueDate), "MMM d")}
                      </div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Dashboard */}
      {!isLoading && filteredTickets.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Tickets
              </h3>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <BellRing
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </div>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {tickets.filter((t) => t.status === "new").length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting agent assignment
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SLA Breached
              </h3>
              <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <AlertCircle
                  size={18}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
            </div>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {tickets.filter((t) => t.slaStatus === "breached").length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Exceeded response time target
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                High Priority
              </h3>
              <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <ArrowUpRight
                  size={18}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
            </div>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {
                tickets.filter(
                  (t) => t.priority === "high" || t.priority === "urgent"
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Urgent and high priority tickets
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolved Today
              </h3>
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <CheckCircle
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {
                tickets.filter(
                  (t) =>
                    t.status === "resolved" &&
                    new Date(t.updatedAt).toDateString() ===
                      new Date().toDateString()
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Successfully completed tickets
            </p>
          </div>
        </motion.div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center mt-8">
        <motion.button
          className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors flex items-center"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={14} className="mr-2" />
          Refresh Queue
        </motion.button>
      </div>
    </div>
  );
};

export default TicketQueuePage;