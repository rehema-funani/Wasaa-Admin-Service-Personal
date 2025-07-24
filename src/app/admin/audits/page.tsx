import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  ChevronRight,
  RefreshCw,
  Download,
  ClipboardList,
  Shield,
  Info,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  Search,
  Filter,
  EyeOff,
  ArrowUpDown,
  Lock,
  LogIn,
  Edit,
  Trash2,
  FileText,
  Database,
  Terminal,
  X,
  ShieldCheck,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/common/Button";
import { Card } from "../../../components/common/Card";
import { logsService } from "../../../api/services/logs";

interface AuditLog {
  _id: string;
  user_id: string;
  username: string;
  ip_address: string;
  service_name: string;
  status_code: number;
  session_id?: string;
  user_email?: string;
  event_type: string;
  event_description: string;
  entity_affected: string;
  entity_id: string;
  http_method: string;
  request_url: string;
  query_params: string;
  request_body: any;
  response_body: any;
  execution_time: number;
  location: string;
  user_agent: string;
  device_type: string;
  device_model: string;
  os: string;
  browser: string;
  auth_method: string;
  roles: string;
  permissions: string;
  is_successful: boolean;
  __v: number;
  createdAt: string;
  timestamp?: string;
}

interface SecurityMetrics {
  failedLogins: number;
  suspiciousActivities: number;
  dataModifications: number;
  systemAccesses: number;
}

const AuditLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions] = useState([
    { id: "login", label: "Login Events" },
    { id: "create", label: "Create Events" },
    { id: "update", label: "Update Events" },
    { id: "delete", label: "Delete Events" },
    { id: "fetch", label: "Fetch Events" },
  ]);
  const [activeSort, setActiveSort] = useState("newest");
  const [hoveredLog, setHoveredLog] = useState<string | null>(null);

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    failedLogins: 5,
    suspiciousActivities: 2,
    dataModifications: 23,
    systemAccesses: 178,
  });

  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) : 1;
  });

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const limitParam = searchParams.get("pageSize");
    return limitParam ? parseInt(limitParam) : 10;
  });

  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchAuditLogs();
  }, [page, itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (itemsPerPage !== 10) params.set("pageSize", itemsPerPage.toString());

    setSearchParams(params);
  }, [page, itemsPerPage, setSearchParams]);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    setError(null);
    setRefreshing(true);

    try {
      const params: Record<string, any> = {
        page: page,
        pageSize: itemsPerPage,
      };

      const response = await logsService.getAuditLogs(params);

      setAuditLogs(response.results || []);
      setTotalLogs(response.stats.totalAudits || 0);
      setTotalPages(response.stats.totalPages || 0);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch audit logs. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setPage(1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    fetchAuditLogs();
  };

  const handleExport = () => {
    alert("Export functionality would be implemented here");
  };

  const handleViewDetails = (logId: string) => {
    navigate(`/admin/audit-logs/${logId}`);
  };

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter((id) => id !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const handleSortChange = (sortOption: string) => {
    setActiveSort(sortOption);
  };

  const getUsernameDisplay = (log: AuditLog) => {
    if (log.username && log.username !== "undefined undefined") {
      return log.username;
    }

    if (
      log.response_body &&
      typeof log.response_body === "object" &&
      log.response_body.users
    ) {
      for (const user of log.response_body.users) {
        if (user.id === log.user_id) {
          return `${user.first_name} ${user.last_name}`;
        }
      }
    }

    return "Unknown user";
  };

  const getUserEmailDisplay = (log: AuditLog) => {
    if (log.user_email) {
      return log.user_email;
    }

    if (
      log.response_body &&
      typeof log.response_body === "object" &&
      log.response_body.users
    ) {
      for (const user of log.response_body.users) {
        if (user.id === log.user_id) {
          return user.email;
        }
      }
    }

    return "";
  };

  const getEventTypeBadge = (eventType: string) => {
    if (eventType.includes("create")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium shadow-sm">
          <FileText size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("update")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium shadow-sm">
          <Edit size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("delete")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-medium shadow-sm">
          <Trash2 size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("login")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-xs font-medium shadow-sm">
          <LogIn size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else if (eventType.includes("fetch")) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 text-xs font-medium shadow-sm">
          <Database size={12} />
          <span>{eventType}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-100 text-xs font-medium shadow-sm">
          <Terminal size={12} />
          <span>{eventType}</span>
        </div>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} sec ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);
    return `${months} mo ago`;
  };

  // Filter and sort the logs based on search term, active filters, and sort option
  const filteredLogs = useMemo(() => {
    let filtered = [...auditLogs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.event_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getUsernameDisplay(log)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          log.entity_affected
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          log.service_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply event type filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((log) =>
        activeFilters.some((filter) =>
          log.event_type.toLowerCase().includes(filter)
        )
      );
    }

    // Apply sorting
    switch (activeSort) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "user-az":
        filtered.sort((a, b) =>
          getUsernameDisplay(a).localeCompare(getUsernameDisplay(b))
        );
        break;
      case "user-za":
        filtered.sort((a, b) =>
          getUsernameDisplay(b).localeCompare(getUsernameDisplay(a))
        );
        break;
    }

    return filtered;
  }, [auditLogs, searchTerm, activeFilters, activeSort]);

  return (
    <div className="h-auto bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full mx-auto px-6 py-8">
        {/* Header with Security Summary */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-block px-3 py-1 bg-indigo-50/80 border border-indigo-100/80 rounded-lg text-indigo-600 text-xs font-medium mb-2 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} className="text-indigo-500" />
                  <span>System Security</span>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
                <ShieldCheck size={24} className="text-indigo-600 mr-2" />
                Audit Log Registry
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                Track and monitor all system activities and security events for
                compliance and security assurance
              </p>
            </div>

            <div className="flex space-x-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="outline"
                  leftIcon={
                    refreshing ? (
                      <RefreshCw
                        size={16}
                        className="animate-spin text-indigo-600"
                      />
                    ) : (
                      <RefreshCw size={16} />
                    )
                  }
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
                >
                  {refreshing ? "Refreshing..." : "Refresh Data"}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  leftIcon={<Download size={16} />}
                  onClick={handleExport}
                  disabled={isLoading || auditLogs.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50"
                >
                  Export Report
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Security Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-rose-100/50"></div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center mr-3">
                  <LogIn size={16} className="text-rose-500" />
                </div>
                <h3 className="text-sm font-medium text-slate-800">
                  Failed Logins
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-slate-900">
                  {securityMetrics.failedLogins}
                </div>
                <div className="text-xs text-rose-600 flex items-center">
                  <Shield size={10} className="mr-1" />
                  High Priority
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-amber-100/50"></div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                  <AlertCircle size={16} className="text-amber-500" />
                </div>
                <h3 className="text-sm font-medium text-slate-800">
                  Suspicious Activity
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-slate-900">
                  {securityMetrics.suspiciousActivities}
                </div>
                <div className="text-xs text-amber-600 flex items-center">
                  <Shield size={10} className="mr-1" />
                  Medium Priority
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-indigo-100/50"></div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                  <Edit size={16} className="text-indigo-500" />
                </div>
                <h3 className="text-sm font-medium text-slate-800">
                  Data Modifications
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-slate-900">
                  {securityMetrics.dataModifications}
                </div>
                <div className="text-xs text-indigo-600 flex items-center">
                  <Clock size={10} className="mr-1" />
                  Last 24 hours
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-emerald-100/50"></div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                  <Database size={16} className="text-emerald-500" />
                </div>
                <h3 className="text-sm font-medium text-slate-800">
                  System Accesses
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-slate-900">
                  {securityMetrics.systemAccesses}
                </div>
                <div className="text-xs text-emerald-600 flex items-center">
                  <Clock size={10} className="mr-1" />
                  Last 24 hours
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <Card className="overflow-hidden bg-white border border-slate-200 shadow-xl rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <ClipboardList size={18} />
              </div>
              <h2 className="text-base font-medium text-slate-800">
                Audit Event Registry
              </h2>
              <div className="flex items-center ml-3">
                <div className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1">
                  <Lock size={10} />
                  <span>PCI DSS Compliant</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <div className="relative">
                <Button
                  variant="outline"
                  leftIcon={<Filter size={16} />}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`border-slate-200 ${
                    activeFilters.length > 0
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white"
                  }`}
                >
                  {activeFilters.length > 0
                    ? `Filters (${activeFilters.length})`
                    : "Filters"}
                </Button>

                {/* Filter Dropdown */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 w-64 z-10 p-2"
                    >
                      <div className="p-2 border-b border-slate-100 mb-2">
                        <h3 className="text-sm font-medium text-slate-700">
                          Filter by Event Type
                        </h3>
                        <p className="text-xs text-slate-500">
                          Select events to display
                        </p>
                      </div>
                      <div className="space-y-1">
                        {filterOptions.map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              activeFilters.includes(option.id)
                                ? "bg-indigo-50 text-indigo-700"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                            onClick={() => toggleFilter(option.id)}
                          >
                            <div
                              className={`w-4 h-4 rounded-sm mr-3 flex items-center justify-center ${
                                activeFilters.includes(option.id)
                                  ? "bg-indigo-500 text-white"
                                  : "border border-slate-300"
                              }`}
                            >
                              {activeFilters.includes(option.id) && (
                                <Check size={12} />
                              )}
                            </div>
                            <span className="text-sm">{option.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between">
                        <button
                          className="text-xs text-slate-500 hover:text-slate-700"
                          onClick={() => setActiveFilters([])}
                        >
                          Clear filters
                        </button>
                        <button
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                          onClick={() => setShowFilters(false)}
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  leftIcon={<ArrowUpDown size={16} />}
                  className="border-slate-200 bg-white"
                >
                  Sort
                </Button>
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 w-48 z-10 p-2 hidden group-focus:block">
                  <div className="space-y-1">
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-lg text-sm ${
                        activeSort === "newest"
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => handleSortChange("newest")}
                    >
                      Newest first
                    </button>
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-lg text-sm ${
                        activeSort === "oldest"
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => handleSortChange("oldest")}
                    >
                      Oldest first
                    </button>
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-lg text-sm ${
                        activeSort === "user-az"
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => handleSortChange("user-az")}
                    >
                      User (A-Z)
                    </button>
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-lg text-sm ${
                        activeSort === "user-za"
                          ? "bg-indigo-50 text-indigo-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                      onClick={() => handleSortChange("user-za")}
                    >
                      User (Z-A)
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-slate-600 mr-2">Rows:</span>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-sm"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs text-slate-500">
                <Clock size={14} className="mr-1 text-indigo-500" />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin opacity-80"
                  style={{ animationDuration: "1.5s" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                Loading audit data
              </h3>
              <p className="text-slate-500 text-center max-w-sm">
                Securely retrieving and decrypting audit log information...
              </p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="bg-slate-100 p-6 rounded-full mb-6">
                <EyeOff size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                No audit records found
              </h3>
              <p className="text-slate-500 text-center max-w-sm mb-6">
                {searchTerm || activeFilters.length > 0
                  ? "No records match your current filters. Try adjusting your search criteria."
                  : "There are no audit events recorded in the system yet."}
              </p>
              {(searchTerm || activeFilters.length > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilters([]);
                  }}
                  className="border-slate-200"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Event Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredLogs.map((log) => (
                      <motion.tr
                        key={log._id}
                        className="group hover:bg-indigo-50/30 transition-colors cursor-pointer relative"
                        onClick={() => handleViewDetails(log._id)}
                        onMouseEnter={() => setHoveredLog(log._id)}
                        onMouseLeave={() => setHoveredLog(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{
                          backgroundColor: "rgba(238, 242, 255, 0.5)",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getEventTypeBadge(log.event_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mr-3 text-white shadow-sm">
                              <User size={14} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {getUsernameDisplay(log)}
                              </div>
                              <div className="text-xs text-slate-500">
                                {getUserEmailDisplay(log)}
                              </div>
                            </div>
                          </div>
                        {/* </td> */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1.5">
                            <Globe size={12} />
                            <span>{log.service_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-slate-500 flex flex-col">
                            <span className="text-slate-700 font-medium">
                              {formatTimeAgo(log.createdAt)}
                            </span>
                            <span>{formatDate(log.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(log._id);
                            }}
                          >
                            <ExternalLink size={12} className="mr-1.5" />
                            View Details
                          </button>
                        </td>

                        {/* Hover effect */}
                        {hoveredLog === log._id && (
                          <td className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <div>
                    <p className="text-sm text-slate-600">
                      Showing{" "}
                      <span className="font-medium">
                        {(page - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(page * itemsPerPage, totalLogs)}
                      </span>{" "}
                      of <span className="font-medium">{totalLogs}</span>{" "}
                      records
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1}
                      className={`p-2 rounded-lg border ${
                        page === 1
                          ? "border-slate-200 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      <ChevronLeft size={16} />
                      <span className="sr-only">First</span>
                    </button>

                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`p-2 rounded-lg border ${
                        page === 1
                          ? "border-slate-200 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      <ChevronLeft size={16} />
                      <span className="sr-only">Previous</span>
                    </button>

                    <div className="flex items-center">
                      {(() => {
                        const pageButtons = [];
                        let startPage = Math.max(1, page - 2);
                        const endPage = Math.min(totalPages, startPage + 4);

                        if (endPage - startPage < 4) {
                          startPage = Math.max(1, endPage - 4);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageButtons.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                ${
                                  i === page
                                    ? "bg-indigo-600 text-white border border-indigo-600 shadow-md shadow-indigo-200"
                                    : "bg-white text-slate-700 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pageButtons;
                      })()}
                    </div>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`p-2 rounded-lg border ${
                        page === totalPages
                          ? "border-slate-200 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      <ChevronRight size={16} />
                      <span className="sr-only">Next</span>
                    </button>

                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page === totalPages}
                      className={`p-2 rounded-lg border ${
                        page === totalPages
                          ? "border-slate-200 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      <ChevronRight size={16} />
                      <span className="sr-only">Last</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        <div className="mt-4 px-2 flex items-center justify-between">
          <div className="flex items-center text-xs text-slate-500">
            <div className="flex items-center mr-6">
              <Info size={14} className="mr-1 text-indigo-400" />
              <span>
                This log contains confidential system information intended for
                administrative use only
              </span>
            </div>
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <Shield size={14} className="mr-1.5 text-indigo-500" />
              <span>Security and Compliance Registry</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center text-xs text-indigo-600 mr-4">
              <ShieldCheck size={14} className="mr-1.5" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center text-xs text-indigo-600">
              <Lock size={14} className="mr-1.5" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Check = ({ size = 24, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

export default AuditLogsPage;
