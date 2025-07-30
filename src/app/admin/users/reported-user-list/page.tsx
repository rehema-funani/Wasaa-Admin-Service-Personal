import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  User,
  Flag,
  Clock,
  FileText,
  UserX,
  AlertCircle,
  UserCheck,
  Bell,
  X,
  Loader,
} from "lucide-react";
import StatusBadge from "../../../../components/common/StatusBadge";
import SearchBox from "../../../../components/common/SearchBox";
import Pagination from "../../../../components/common/Pagination";
import userService from "../../../../api/services/users";
import { contactService } from "../../../../api/services/contact";

interface ReportedUser {
  id: string;
  reportedUser: {
    id: string;
    name: string;
    username: string;
    email: string;
    joinDate: string;
    profileImage?: string;
    previousViolations: number;
  };
  reportedBy: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  reportType: string;
  reportReason: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "under_review" | "resolved" | "dismissed";
  resolution?: string;
  dateReported: string;
  lastUpdated: string;
  notes?: string;
  evidence?: any[];
  additionalReports: number;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const ReportedUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reportedUsers, setReportedUsers] = useState<ReportedUser[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "harassment",
    "pending",
    "high priority",
  ]);

  const [selectedReport, setSelectedReport] = useState<ReportedUser | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportedUsers = async () => {
      try {
        setIsLoading(true);
        const response = await contactService.getReportedUsers();

        const reportedUsersData = response?.data?.reportedUsers || [];

        setReportedUsers(reportedUsersData);
        setFilteredReports(reportedUsersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching reported users:", err);
        setError("Failed to load reported users. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedUsers();
  }, []);

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "harassment":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "impersonation":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
      case "inappropriate_content":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "spam":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300";
      case "harmful_misinformation":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      case "hate_speech":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "scam":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
      case "copyright_violation":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const formatReportType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "low":
        return "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getResolutionIcon = (resolution: string | undefined) => {
    if (!resolution) return null;

    switch (resolution) {
      case "warning_issued":
        return (
          <AlertTriangle
            size={14}
            className="text-yellow-500 dark:text-yellow-400 mr-1"
            strokeWidth={1.8}
          />
        );
      case "content_removed":
        return (
          <XCircle
            size={14}
            className="text-orange-500 dark:text-orange-400 mr-1"
            strokeWidth={1.8}
          />
        );
      case "account_suspended":
        return (
          <Ban
            size={14}
            className="text-red-500 dark:text-red-400 mr-1"
            strokeWidth={1.8}
          />
        );
      case "account_banned":
        return (
          <UserX
            size={14}
            className="text-red-700 dark:text-red-400 mr-1"
            strokeWidth={1.8}
          />
        );
      case "account_verified":
        return (
          <UserCheck
            size={14}
            className="text-green-500 dark:text-green-400 mr-1"
            strokeWidth={1.8}
          />
        );
      case "no_action":
        return (
          <CheckCircle
            size={14}
            className="text-gray-500 dark:text-gray-400 mr-1"
            strokeWidth={1.8}
          />
        );
      default:
        return null;
    }
  };

  const reportStats = React.useMemo(() => {
    const pendingReports = reportedUsers.filter(
      (report) => report.status === "pending"
    ).length;
    const highPriorityReports = reportedUsers.filter(
      (report) => report.priority === "high"
    ).length;
    const underReviewReports = reportedUsers.filter(
      (report) => report.status === "under_review"
    ).length;
    const resolvedReports = reportedUsers.filter(
      (report) => report.status === "resolved"
    ).length;

    return [
      {
        title: "Pending Review",
        value: pendingReports.toString(),
        change: `${pendingReports > 0 ? "Needs attention" : "All clear"}`,
        icon: (
          <Clock
            size={20}
            className="text-yellow-500 dark:text-yellow-400"
            strokeWidth={1.8}
          />
        ),
        color: "yellow",
      },
      {
        title: "High Priority",
        value: highPriorityReports.toString(),
        change: `${
          highPriorityReports > 0 ? "Urgent action needed" : "No urgent reports"
        }`,
        icon: (
          <AlertTriangle
            size={20}
            className="text-red-500 dark:text-red-400"
            strokeWidth={1.8}
          />
        ),
        color: "red",
      },
      {
        title: "Under Review",
        value: underReviewReports.toString(),
        change: "In progress",
        icon: (
          <Shield
            size={20}
            className="text-primary-500 dark:text-primary-400"
            strokeWidth={1.8}
          />
        ),
        color: "primary",
      },
      {
        title: "Resolved",
        value: resolvedReports.toString(),
        change: `${Math.round(
          (resolvedReports / (reportedUsers.length || 1)) * 100
        )}% completion rate`,
        icon: (
          <CheckCircle
            size={20}
            className="text-green-500 dark:text-green-400"
            strokeWidth={1.8}
          />
        ),
        color: "green",
      },
    ];
  }, [reportedUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredReports(reportedUsers);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = reportedUsers.filter(
      (report) =>
        report.id.toLowerCase().includes(lowercasedQuery) ||
        report.reportedUser.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportedUser.username.toLowerCase().includes(lowercasedQuery) ||
        report.reportedBy.name.toLowerCase().includes(lowercasedQuery) ||
        report.reportedBy.username.toLowerCase().includes(lowercasedQuery) ||
        report.reportType.toLowerCase().includes(lowercasedQuery) ||
        report.reportReason.toLowerCase().includes(lowercasedQuery) ||
        (report.notes && report.notes.toLowerCase().includes(lowercasedQuery))
    );

    setFilteredReports(filtered);

    if (query.trim() !== "" && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (filteredReports.length === 0) {
      alert("No reports to export");
      return;
    }
    alert("Export functionality would go here");
  };

  const handleViewReport = (report: ReportedUser) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageData = getCurrentPageData();
    const allSelected = currentPageData.every((report) =>
      selectedRows.includes(report.id)
    );

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !currentPageData.some((report) => report.id === id))
      );
    } else {
      const newSelections = currentPageData.map((report) => report.id);
      setSelectedRows((prev) => [...new Set([...prev, ...newSelections])]);
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  };

  const handleReviewReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await userService.updateReportStatus(id, "under_review");

      const updatedReports = reportedUsers.map((report) =>
        report.id === id
          ? { ...report, status: "under_review" as const }
          : report
      );

      setReportedUsers(updatedReports);
      setFilteredReports((prevFiltered) =>
        prevFiltered.map((report) =>
          report.id === id ? { ...report, status: "under_review" } : report
        )
      );

      alert("Report status updated to Under Review");
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Failed to update report status. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleActionReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await userService.resolveReport(id);

      const updatedReports = reportedUsers.map((report) =>
        report.id === id
          ? {
              ...report,
              status: "resolved" as const,
              resolution: "warning_issued",
            }
          : report
      );

      setReportedUsers(updatedReports);
      setFilteredReports((prevFiltered) =>
        prevFiltered.map((report) =>
          report.id === id
            ? { ...report, status: "resolved", resolution: "warning_issued" }
            : report
        )
      );

      alert("Report resolved with warning issued");
    } catch (error) {
      console.error("Error resolving report:", error);
      alert("Failed to resolve report. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDismissReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await userService.dismissReport(id);

      const updatedReports = reportedUsers.map((report) =>
        report.id === id ? { ...report, status: "dismissed" as const } : report
      );

      setReportedUsers(updatedReports);
      setFilteredReports((prevFiltered) =>
        prevFiltered.map((report) =>
          report.id === id ? { ...report, status: "dismissed" } : report
        )
      );

      alert("Report dismissed");
    } catch (error) {
      console.error("Error dismissing report:", error);
      alert("Failed to dismiss report. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReopenReport = async (id: string) => {
    try {
      setActionInProgress(id);
      await userService.reopenReport(id);

      const updatedReports = reportedUsers.map((report) =>
        report.id === id
          ? {
              ...report,
              status: "under_review" as const,
              resolution: undefined,
            }
          : report
      );

      setReportedUsers(updatedReports);
      setFilteredReports((prevFiltered) =>
        prevFiltered.map((report) =>
          report.id === id
            ? { ...report, status: "under_review", resolution: undefined }
            : report
        )
      );

      alert("Report reopened for review");
    } catch (error) {
      console.error("Error reopening report:", error);
      alert("Failed to reopen report. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const formatDate = (dateString: string) => {
    let formattedDate = dateString;
    let formattedTime = "";

    try {
      if (dateString.includes("T")) {
        const date = new Date(dateString);
        formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (dateString.includes(" ")) {
        const parts = dateString.split(" ");
        formattedDate = parts.slice(0, 3).join(" ");
        formattedTime = parts[3];
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }

    return { formattedDate, formattedTime };
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Reported Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and manage user reports
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Bell size={16} className="mr-2" strokeWidth={1.8} />
            Notification Settings
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {reportStats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center"
            whileHover={{
              y: -4,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              className={`mr-4 p-2 bg-${stat.color}-50 dark:bg-${stat.color}-900/30 rounded-lg`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {stat.title}
              </p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {stat.change}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SearchBox
          placeholder="Search by user, report ID, reason or content..."
          onSearch={handleSearch}
          suggestions={["harassment", "high priority", "impersonation", "spam"]}
          recentSearches={recentSearches}
          showRecentByDefault={true}
        />
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-700">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 text-teal-500 dark:text-teal-400 animate-spin" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Loading reports...
                </span>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No reports found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  No reports found. Try adjusting your search terms.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary-600 focus:ring-primary-500"
                          checked={
                            getCurrentPageData().length > 0 &&
                            getCurrentPageData().every((report) =>
                              selectedRows.includes(report.id)
                            )
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Report ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Reported User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Report Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Reported By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Date Reported
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Assigned To
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {getCurrentPageData().map((report) => {
                      const { formattedDate, formattedTime } = formatDate(
                        report.dateReported
                      );
                      const { formattedDate: lastUpdatedDate } = formatDate(
                        report.lastUpdated
                      );

                      return (
                        <tr
                          key={report.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary-600 focus:ring-primary-500"
                              checked={selectedRows.includes(report.id)}
                              onChange={() => handleSelectRow(report.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {report.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                                {report.reportedUser.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {report.reportedUser.name}
                                </p>
                                <div className="flex items-center">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {report.reportedUser.username}
                                  </p>
                                  {report.reportedUser.previousViolations >
                                    0 && (
                                    <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-1.5 py-0.5 rounded-md">
                                      {report.reportedUser.previousViolations}{" "}
                                      prev. violations
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span
                                  className={`text-xs px-2 py-1 rounded-md ${getReportTypeColor(
                                    report.reportType
                                  )}`}
                                >
                                  {formatReportType(report.reportType)}
                                </span>
                                <span
                                  className={`ml-2 text-xs px-2 py-1 rounded-md ${getPriorityColor(
                                    report.priority
                                  )}`}
                                >
                                  {report.priority.charAt(0).toUpperCase() +
                                    report.priority.slice(1)}{" "}
                                  Priority
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {report.reportReason}
                              </p>
                              {report.additionalReports > 0 && (
                                <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                                  <Flag
                                    size={12}
                                    className="mr-1"
                                    strokeWidth={1.8}
                                  />
                                  {report.additionalReports} additional reports
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-white flex items-center justify-center font-medium text-xs mr-2">
                                {report.reportedBy.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {report.reportedBy.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {report.reportedBy.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <StatusBadge
                                status={report.status as any}
                                size="sm"
                                withIcon
                                withDot={report.status === "under_review"}
                              />
                              {report.resolution && (
                                <div className="flex items-center mt-2 text-xs text-gray-700 dark:text-gray-300">
                                  {getResolutionIcon(report.resolution)}
                                  <span>
                                    {report.resolution
                                      .split("_")
                                      .map(
                                        (word: string) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col text-sm">
                              <div className="flex items-center">
                                <Calendar
                                  size={14}
                                  className="text-gray-400 dark:text-gray-500 mr-1.5"
                                  strokeWidth={1.8}
                                />
                                <span className="text-gray-800 dark:text-gray-200">
                                  {formattedDate}
                                </span>
                              </div>
                              {formattedTime && (
                                <div className="flex items-center mt-1">
                                  <Clock
                                    size={14}
                                    className="text-gray-400 dark:text-gray-500 mr-1.5"
                                    strokeWidth={1.8}
                                  />
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {formattedTime}
                                  </span>
                                </div>
                              )}
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Last updated: {lastUpdatedDate}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {report.assignedTo ? (
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center font-medium text-xs mr-2">
                                  {report.assignedTo.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </div>
                                <span className="text-sm text-gray-800 dark:text-gray-200">
                                  {report.assignedTo.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center">
                                <User
                                  size={14}
                                  className="mr-1.5"
                                  strokeWidth={1.8}
                                />
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <motion.button
                                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="View report details"
                                onClick={() => handleViewReport(report)}
                                disabled={actionInProgress === report.id}
                              >
                                <Eye size={16} strokeWidth={1.8} />
                              </motion.button>

                              {report.status === "pending" && (
                                <motion.button
                                  className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  aria-label="Review this report"
                                  onClick={() => handleReviewReport(report.id)}
                                  disabled={actionInProgress === report.id}
                                >
                                  <Shield size={16} strokeWidth={1.8} />
                                </motion.button>
                              )}

                              {(report.status === "pending" ||
                                report.status === "under_review") && (
                                <>
                                  <motion.button
                                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Take action"
                                    onClick={() =>
                                      handleActionReport(report.id)
                                    }
                                    disabled={actionInProgress === report.id}
                                  >
                                    <Ban size={16} strokeWidth={1.8} />
                                  </motion.button>
                                  <motion.button
                                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Dismiss report"
                                    onClick={() =>
                                      handleDismissReport(report.id)
                                    }
                                    disabled={actionInProgress === report.id}
                                  >
                                    <CheckCircle size={16} strokeWidth={1.8} />
                                  </motion.button>
                                </>
                              )}

                              {report.status === "resolved" && (
                                <motion.button
                                  className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  aria-label="Reopen report"
                                  onClick={() => handleReopenReport(report.id)}
                                  disabled={actionInProgress === report.id}
                                >
                                  <AlertCircle size={16} strokeWidth={1.8} />
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
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredReports.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          showSummary={true}
        />
      </motion.div>

      <AnimatePresence>
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Report Details
                </h3>
                <button
                  className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleCloseModal}
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Report Information
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Report ID:
                          </span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {selectedReport.id}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Type:
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-md ${getReportTypeColor(
                              selectedReport.reportType
                            )}`}
                          >
                            {formatReportType(selectedReport.reportType)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Priority:
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-md ${getPriorityColor(
                              selectedReport.priority
                            )}`}
                          >
                            {selectedReport.priority.charAt(0).toUpperCase() +
                              selectedReport.priority.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Status:
                          </span>
                          <StatusBadge
                            status={selectedReport.status as any}
                            size="sm"
                            withIcon
                            withDot={selectedReport.status === "under_review"}
                          />
                        </div>
                        {selectedReport.resolution && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              Resolution:
                            </span>
                            <div className="flex items-center text-sm">
                              {getResolutionIcon(selectedReport.resolution)}
                              <span className="text-gray-800 dark:text-gray-200">
                                {selectedReport.resolution
                                  .split("_")
                                  .map(
                                    (word: string) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Date Reported:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200 text-sm">
                            {selectedReport.dateReported}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Last Updated:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200 text-sm">
                            {selectedReport.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Reported User
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                            {selectedReport.reportedUser.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {selectedReport.reportedUser.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedReport.reportedUser.username}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Email:
                            </span>
                            <span className="text-gray-800 dark:text-gray-200">
                              {selectedReport.reportedUser.email}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Joined:
                            </span>
                            <span className="text-gray-800 dark:text-gray-200">
                              {selectedReport.reportedUser.joinDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Previous Violations:
                            </span>
                            <span
                              className={`font-medium ${
                                selectedReport.reportedUser.previousViolations >
                                0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {selectedReport.reportedUser.previousViolations}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Reported By
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                            {selectedReport.reportedBy.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {selectedReport.reportedBy.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedReport.reportedBy.username}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Email:
                            </span>
                            <span className="text-gray-800 dark:text-gray-200">
                              {selectedReport.reportedBy.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Report Reason
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                          {selectedReport.reportReason}
                        </p>
                      </div>
                    </div>

                    {selectedReport.notes && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Notes
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                            {selectedReport.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedReport.evidence &&
                      selectedReport.evidence.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Evidence
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <ul className="space-y-2">
                              {selectedReport.evidence.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <div className="p-1 bg-gray-200 dark:bg-gray-600 rounded mr-2 mt-0.5">
                                    <FileText
                                      size={14}
                                      className="text-gray-600 dark:text-gray-400"
                                      strokeWidth={1.8}
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                      {item.type} {item.id ? `#${item.id}` : ""}
                                    </p>
                                    {item.timestamp && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.timestamp}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                    {selectedReport.additionalReports > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Additional Reports
                        </h4>
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-700">
                          <div className="flex items-center">
                            <Flag
                              size={16}
                              className="text-amber-500 dark:text-amber-400 mr-2"
                              strokeWidth={1.8}
                            />
                            <span className="text-amber-700 dark:text-amber-300">
                              This user has been reported{" "}
                              {selectedReport.additionalReports} additional time
                              {selectedReport.additionalReports !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Actions
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-wrap gap-2">
                        {selectedReport.status === "pending" && (
                          <button
                            className="flex items-center px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
                            onClick={() => {
                              handleReviewReport(selectedReport.id);
                              handleCloseModal();
                            }}
                          >
                            <Shield
                              size={16}
                              className="mr-2"
                              strokeWidth={1.8}
                            />
                            Start Review
                          </button>
                        )}

                        {(selectedReport.status === "pending" ||
                          selectedReport.status === "under_review") && (
                          <>
                            <button
                              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                              onClick={() => {
                                handleActionReport(selectedReport.id);
                                handleCloseModal();
                              }}
                            >
                              <Ban
                                size={16}
                                className="mr-2"
                                strokeWidth={1.8}
                              />
                              Take Action
                            </button>
                            <button
                              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                              onClick={() => {
                                handleDismissReport(selectedReport.id);
                                handleCloseModal();
                              }}
                            >
                              <CheckCircle
                                size={16}
                                className="mr-2"
                                strokeWidth={1.8}
                              />
                              Dismiss Report
                            </button>
                          </>
                        )}

                        {selectedReport.status === "resolved" && (
                          <button
                            className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                            onClick={() => {
                              handleReopenReport(selectedReport.id);
                              handleCloseModal();
                            }}
                          >
                            <AlertCircle
                              size={16}
                              className="mr-2"
                              strokeWidth={1.8}
                            />
                            Reopen Report
                          </button>
                        )}

                        <button
                          className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm ml-auto"
                          onClick={handleCloseModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportedUsersPage;
