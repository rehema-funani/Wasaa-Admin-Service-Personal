import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  ChevronDown,
  Clock,
  MessageCircle,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import supportService from "../../../api/services/support";
import { useNavigate } from "react-router-dom";
import getPriorityBadge from "../../../components/support/getPriorityBadge";
import getStatusBadge from "../../../components/support/getStatusBadge";
import getSlaStatusColor from "../../../components/support/getSlaStatusColor";

interface User {
  id: string;
  externalUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: string;
  department: string | null;
  language: string;
  timezone: string;
  isActive: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  color: string;
  icon: string;
  isActive: boolean;
  firstResponseSla: number;
  resolutionSla: number;
  defaultPriority: string;
  autoAssignToRole: string | null;
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
}

interface AgentUser {
  id: string;
  externalUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: string;
  department: string | null;
  language: string;
  timezone: string;
  isActive: boolean;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Agent {
  id: string;
  userId: string;
  role: string;
  department: string;
  specializations: string[];
  isOnline: boolean;
  isAvailable: boolean;
  maxConcurrentChats: number;
  currentChats: number;
  performanceScore: number | null;
  totalTicketsHandled: number;
  avgResolutionTime: number | null;
  slaComplianceRate: number | null;
  createdAt: string;
  updatedAt: string;
  user: AgentUser;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  categoryId: string;
  status: string;
  priority: string;
  channel: string;
  agentId: string | null;
  slaStatus: string;
  firstResponseAt: string | null;
  firstResponseDue: string;
  resolutionDue: string;
  resolvedAt: string | null;
  closedAt: string | null;
  escalationLevel: number;
  escalatedAt: string | null;
  escalationReason: string | null;
  tags: string[];
  internalNotes: string | null;
  customerSatisfactionScore: number | null;
  customerFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  category: Category;
  agent: Agent | null;
  _count: {
    messages: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FilterParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  search?: string;
}

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    limit: 10,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  const statusOptions = ["All", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  const priorityOptions = ["All", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const [categories, setCategories] = useState<Category[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await supportService.getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await supportService.getTickets(filterParams);

        if (response.success) {
          setTickets(response.data.tickets);
          setPagination(response.data.pagination);

          if (categories.length === 0) {
            const uniqueCategories = Array.from(
              new Set(response.data.tickets.map((ticket) => ticket.category))
            );
            setCategories(uniqueCategories as unknown as Category[]);
          }

          const uniqueAgents = Array.from(
            new Set(
              response.data.tickets
                .filter((ticket) => ticket.agent)
                .map((ticket) => ticket.agent)
            )
          );
          setAgents(uniqueAgents as unknown as Agent[]);
        } else {
          setError("Failed to fetch tickets");
        }
      } catch (err) {
        setError("Failed to fetch tickets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [filterParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value;
    setFilterParams((prev) => ({ ...prev, search: searchValue, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value === "All" ? undefined : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  const resetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 10,
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getFullName = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return "Unknown";
    return `${firstName} ${lastName}`;
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();

    if (diffMs < 0) return "Overdue";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days}d left`;
    } else if (diffHours > 0) {
      return `${diffHours}h left`;
    } else {
      return `${diffMins}m left`;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Support Tickets
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and respond to customer support requests
            </p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            onClick={() => navigate("/admin/support/tickets/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder="Search by ticket number, subject or customer name..."
                  className="block w-full pl-10 sm:text-sm border-gray-200 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </form>

            <div className="flex space-x-2">
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {filterOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none z-10 border border-gray-200 dark:border-gray-700">
                    <div className="py-3 px-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Filters
                        </h3>
                        <button
                          onClick={resetFilters}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                        >
                          Reset all
                        </button>
                      </div>

                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                          </label>
                          <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={filterParams.status || "All"}
                            onChange={(e) =>
                              handleFilterChange("status", e.target.value)
                            }
                          >
                            {statusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Priority
                          </label>
                          <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={filterParams.priority || "All"}
                            onChange={(e) =>
                              handleFilterChange("priority", e.target.value)
                            }
                          >
                            {priorityOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setFilterParams((prev) => ({ ...prev }))}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 dark:bg-indigo-600 rounded-md p-3">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Open Tickets
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {tickets.filter((t) => t.status === "OPEN").length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 dark:bg-yellow-600 rounded-md p-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      In Progress
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {
                          tickets.filter((t) => t.status === "IN_PROGRESS")
                            .length
                        }
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 dark:bg-green-600 rounded-md p-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Resolved
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {tickets.filter((t) => t.status === "RESOLVED").length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-500 dark:bg-gray-600 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {pagination.total}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-4 border border-red-100 dark:border-red-900/50">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tickets found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new support ticket.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                onClick={() => navigate("/admin/support/tickets/new")}
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <a
                    href={`/admin/support/tickets/${ticket.id}`}
                    className="block"
                  >
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 font-medium">
                              {ticket.user.firstName.charAt(0)}
                              {ticket.user.lastName.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                {ticket.subject}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                {getPriorityBadge(ticket.priority)}
                              </div>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <span className="truncate">
                                #{ticket.ticketNumber}
                              </span>
                              <span className="mx-1">•</span>
                              <span>{ticket.category.name}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                              {ticket.description}
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0 flex flex-col items-end">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeDate(ticket.createdAt)}
                          </div>
                          <div className="mt-1">
                            {getStatusBadge(ticket.status)}
                          </div>
                          <div className="mt-2 flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSlaStatusColor(
                                ticket.resolutionDue,
                                ticket.status
                              )}`}
                            >
                              {ticket.status === "RESOLVED" ||
                              ticket.status === "CLOSED"
                                ? "Completed"
                                : getTimeRemaining(ticket.resolutionDue)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              {ticket._count.messages}{" "}
                              {ticket._count.messages === 1
                                ? "reply"
                                : "replies"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            From:{" "}
                            {getFullName(
                              ticket.user.firstName,
                              ticket.user.lastName
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {ticket.agent ? (
                            <span>
                              Assigned:{" "}
                              {getFullName(
                                ticket.agent.user.firstName,
                                ticket.agent.user.lastName
                              )}
                            </span>
                          ) : (
                            <span className="text-yellow-600 dark:text-yellow-400">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, pagination.page - 1))
                      }
                      disabled={pagination.page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        pagination.page === 1
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      } transition-colors`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page numbers - simplified for brevity */}
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Page {pagination.page} of {pagination.pages}
                    </span>

                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.min(pagination.pages, pagination.page + 1)
                        )
                      }
                      disabled={pagination.page === pagination.pages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        pagination.page === pagination.pages
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      } transition-colors`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
