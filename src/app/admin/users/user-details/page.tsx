import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Clock,
  CalendarDays,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Shield,
  CheckCircle,
  X,
  Phone,
  Mail,
} from "lucide-react";
import StatusBadge from "../../../../components/common/StatusBadge";
import { userService } from "../../../../api/services/users";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [paginationData, setPaginationData] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const navigate = useNavigate();

  const fetchUsers = async (
    currentPage = page,
    currentPageSize = pageSize,
    search = searchQuery
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getUsers(
        currentPage,
        currentPageSize,
        search
      );

      const formattedUsers = response.users.map((user: any) => ({
        id: user.id,
        name:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.username ||
          "Unnamed User",
        email: user.email || null,
        role: "User", // Since role info isn't in the response
        status: user.account_status || "active",
        location: user.country || "Not specified",
        lastActive: user.last_login
          ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
          : "Never",
        joinDate: user.createdAt
          ? format(new Date(user.createdAt), "MMM d, yyyy")
          : "Unknown",
        transactions: 0, // Not in API response
        role_id: user.role_id,
        phone_number: user.phone_number,
        username: user.username,
        verification_status: user.verification_status,
        kyc_level: user.kyc_level,
        phone_verified: user.phone_verified,
        email_verified: user.email_verified,
        id_number_verified: user.id_number_verified,
        is_verified: user.is_verified,
        profile_picture: user.profile_picture,
      }));

      setUsers(formattedUsers);

      // Update pagination metadata from server response using 'meta' object
      setPaginationData({
        total: response.meta?.totalItems || response.stats?.totalUsers || 0,
        totalPages: response.meta?.totalPages || 1,
        currentPage: response.meta?.currentPage || currentPage,
        pageSize: currentPageSize,
      });
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again later.");
      toast.error("Failed to load users");
      // Reset pagination data on error
      setPaginationData({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: currentPageSize,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (page === 1) {
        fetchUsers(1, pageSize, searchQuery);
      } else {
        setPage(1); // This will trigger the first useEffect
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The useEffect will handle the debounced API call
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // Note: Implement server-side sorting by passing sort params to fetchUsers if needed
    // fetchUsers(page, pageSize, searchQuery, field, sortDirection);
  };

  // For server-side pagination, we use the current page data directly
  const currentPageData = users;

  // Pagination calculations from server response
  const totalItems = paginationData.total;
  const totalPages = paginationData.totalPages;
  const startIndex = (paginationData.currentPage - 1) * paginationData.pageSize;
  const endIndex = Math.min(startIndex + paginationData.pageSize, totalItems);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1); // Reset to first page when changing page size
    }
  };

  const handleExport = () => {
    alert("Export functionality would go here");
  };

  const getVisiblePageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    const currentPage = paginationData.currentPage;
    const maxPages = paginationData.totalPages;

    if (maxPages <= 1) return [1];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(maxPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < maxPages - 1) {
      rangeWithDots.push("...", maxPages);
    } else if (maxPages > 1) {
      rangeWithDots.push(maxPages);
    }

    return rangeWithDots;
  };

  const renderVerificationBadges = (user: any) => {
    const badges = [];

    if (user.kyc_level) {
      const kycColors = {
        basic:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        intermediate:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        advanced:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      };

      badges.push(
        <span
          key="kyc"
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            kycColors[user.kyc_level as keyof typeof kycColors] ||
            kycColors.basic
          }`}
        >
          <Shield size={10} className="mr-1" />
          {user.kyc_level.charAt(0).toUpperCase() + user.kyc_level.slice(1)}
        </span>
      );
    }

    const verifications = [
      {
        key: "phone",
        verified: user.phone_verified,
        icon: Phone,
        label: "Phone",
      },
      {
        key: "email",
        verified: user.email_verified,
        icon: Mail,
        label: "Email",
      },
      {
        key: "id",
        verified: user.id_number_verified,
        icon: Shield,
        label: "ID",
      },
    ];

    verifications.forEach(({ key, verified, icon: Icon, label }) => {
      if (verified) {
        badges.push(
          <span
            key={key}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          >
            <CheckCircle size={10} className="mr-1" />
            {label}
          </span>
        );
      }
    });

    return badges.length > 0 ? (
      <div className="flex flex-wrap gap-1">{badges}</div>
    ) : (
      <span className="text-xs text-gray-400 dark:text-gray-500">
        No verification
      </span>
    );
  };

  return (
    <div className="max-w-8xl mx-auto">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Users
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Manage user accounts
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white dark:text-gray-200 rounded-xl text-sm shadow-sm"
            whileHover={{
              y: -2,
              backgroundColor: "#4f46e5",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
            }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      <input
        type="text"
        placeholder="Search users by name, email, phone, or username..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4 w-full bg-inherit md:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
      />

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={18} className="mr-2" />
          {error}
        </motion.div>
      )}

      <motion.div
        className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Users ({totalItems})
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Show:
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    User Info
                    {sortField === "name" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "status" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Verification
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort("joinDate")}
                >
                  <div className="flex items-center">
                    Join Date
                    {sortField === "joinDate" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
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
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        Loading...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : currentPageData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <UserPlus
                        size={48}
                        className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                      />
                      <p className="text-lg font-medium mb-2">No users found</p>
                      <p>Try adjusting your search terms or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPageData.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-medium text-sm mr-3 flex-shrink-0">
                          {user.profile_picture ? (
                            <img
                              src={user.profile_picture}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : user.name && user.name !== "Unnamed User" ? (
                            user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          ) : user.phone_number ? (
                            user.phone_number.slice(-2)
                          ) : (
                            "??"
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-300 truncate">
                            {user.name}
                          </p>
                          <div className="flex flex-col gap-1">
                            {user.email && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Mail size={10} className="mr-1" />
                                {user.email}
                              </p>
                            )}
                            {user.phone_number && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Phone size={10} className="mr-1" />
                                {user.phone_number}
                              </p>
                            )}
                            {user.username && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                @{user.username}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={user.account_status as any}
                        size="sm"
                        withIcon
                        withDot={user.account_status === "active"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {renderVerificationBadges(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-900 dark:text-gray-300">
                        <CalendarDays
                          size={14}
                          className="text-gray-400 mr-1.5"
                          strokeWidth={1.8}
                        />
                        <span>{user.joinDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <motion.button
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-600 dark:hover:text-primary-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="View user"
                          onClick={() =>
                            navigate(`/admin/users/user-details/${user.id}`)
                          }
                        >
                          <Eye size={16} strokeWidth={1.8} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {startIndex + 1} to {endIndex} of {totalItems} results
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Go to page:
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={paginationData.currentPage}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      if (newPage >= 1 && newPage <= totalPages) {
                        handlePageChange(newPage);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* First Page */}
                <motion.button
                  onClick={() => handlePageChange(1)}
                  disabled={paginationData.currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronsLeft size={16} />
                </motion.button>

                {/* Previous Page */}
                <motion.button
                  onClick={() =>
                    handlePageChange(paginationData.currentPage - 1)
                  }
                  disabled={paginationData.currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={16} />
                </motion.button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getVisiblePageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === "..." ? (
                        <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      ) : (
                        <motion.button
                          onClick={() => handlePageChange(pageNum as number)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pageNum === paginationData.currentPage
                              ? "bg-primary-600 text-white shadow-md"
                              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {pageNum}
                        </motion.button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Page */}
                <motion.button
                  onClick={() =>
                    handlePageChange(paginationData.currentPage + 1)
                  }
                  disabled={paginationData.currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={16} />
                </motion.button>

                {/* Last Page */}
                <motion.button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={paginationData.currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronsRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bottom Pagination - Enhanced version for better UX */}
      {totalPages > 1 && (
        <motion.div
          className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Results Summary and Quick Navigation */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Page {paginationData.currentPage} of {totalPages} •{" "}
                  {totalItems} total results
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Jump to:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={paginationData.currentPage}
                      onChange={(e) => {
                        const newPage = parseInt(e.target.value);
                        if (newPage >= 1 && newPage <= totalPages) {
                          handlePageChange(newPage);
                        }
                      }}
                      className="w-20 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Show:
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) =>
                        handlePageSizeChange(Number(e.target.value))
                      }
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <motion.button
                  onClick={() => handlePageChange(1)}
                  disabled={paginationData.currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronsLeft size={16} />
                  <span className="hidden sm:inline">First</span>
                </motion.button>

                {/* Previous Page */}
                <motion.button
                  onClick={() =>
                    handlePageChange(paginationData.currentPage - 1)
                  }
                  disabled={paginationData.currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </motion.button>

                {/* Page Numbers - Compact version for bottom */}
                <div className="hidden md:flex items-center gap-1">
                  {getVisiblePageNumbers()
                    .slice(0, 7)
                    .map((pageNum, index) => (
                      <React.Fragment key={index}>
                        {pageNum === "..." ? (
                          <span className="px-2 py-1 text-gray-400 dark:text-gray-500">
                            ...
                          </span>
                        ) : (
                          <motion.button
                            onClick={() => handlePageChange(pageNum as number)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              pageNum === paginationData.currentPage
                                ? "bg-primary-600 text-white shadow-md"
                                : "text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {pageNum}
                          </motion.button>
                        )}
                      </React.Fragment>
                    ))}
                </div>

                {/* Current Page Indicator for Mobile */}
                <div className="md:hidden px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {paginationData.currentPage} / {totalPages}
                  </span>
                </div>

                <motion.button
                  onClick={() =>
                    handlePageChange(paginationData.currentPage + 1)
                  }
                  disabled={paginationData.currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </motion.button>

                <motion.button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={paginationData.currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="hidden sm:inline">Last</span>
                  <ChevronsRight size={16} />
                </motion.button>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (paginationData.currentPage / totalPages) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Start
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {Math.round((paginationData.currentPage / totalPages) * 100)}%
                  complete
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  End
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default page;
