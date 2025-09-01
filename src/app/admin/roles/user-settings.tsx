import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Clock,
  AlertCircle,
  Shield,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Users,
  CheckCircle,
  Calendar,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  Loader,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import moment from "moment";
import { toast } from "react-hot-toast";
import userService from "../../../api/services/users";
import { roleService } from "../../../api/services/roles";
import {
  CreateUserModal,
  EditUserModal,
  DeleteUserModal,
  UserRoleModal,
} from "../../../components/users";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  role_id: string | null;
  status: string;
  location: string;
  last_login: string | null;
  createdAt: string;
  transactions_count: number;
  phone_number: string | null;
  first_name: string;
  last_name: string;
  lastActive?: string;
}

interface Role {
  id: string;
  title: string;
  description: string;
  permissions: string[];
}

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "admin",
    "inactive",
    "new york",
  ]);
  const [showFilters, setShowFilters] = useState(false);

  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getAdminUsers(currentPage, itemsPerPage);
      const formattedUsers = response.users.map((user: any) => ({
        id: user.id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        role: user.role?.title || "User",
        status: user.status || "active",
        location: user.location || "Not specified",
        lastActive: user.last_login
          ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
          : "Never",
        joinDate: user.createdAt
          ? format(new Date(user.createdAt), "MMM d, yyyy")
          : "Unknown",
        transactions: user.transactions_count || 0,
        role_id: user.role_id,
        phone_number: user.phone_number,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        createdAt: user.createdAt,
        last_login: user.last_login,
        transactions_count: user.transactions_count || 0,
      }));

      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again later.");
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleService.getRoles();
      setRoles(response || []);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
    setSelectAll(false);
  }, [filteredUsers]);

  useEffect(() => {
    if (selectAll) {
      setSelectedRows(paginatedUsers.map((user) => user.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll]);

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await userService.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getUserColor = (id: string) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-purple-500 to-indigo-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-sky-500 to-blue-600",
    ];

    const index = parseInt(id.slice(-1), 16) % colors.length;
    return colors[index];
  };

  const getRoleBadgeStyle = (role: string) => {
    const roleLower = role.toLowerCase();

    if (roleLower.includes("admin")) {
      return "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800";
    }
    if (roleLower.includes("manager")) {
      return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800";
    }
    if (roleLower.includes("support")) {
      return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800";
    }

    return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800";
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case "name":
        valueA = a.name || "";
        valueB = b.name || "";
        break;
      case "role":
        valueA = a.role || "";
        valueB = b.role || "";
        break;
      case "status":
        valueA = a.status || "";
        valueB = b.status || "";
        break;
      case "lastActive":
        valueA = a.last_login ? new Date(a.last_login).getTime() : 0;
        valueB = b.last_login ? new Date(b.last_login).getTime() : 0;
        break;
      case "transactions":
        valueA = a.transactions_count || 0;
        valueB = b.transactions_count || 0;
        break;
      default:
        valueA = a.name || "";
        valueB = b.name || "";
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === "asc"
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    }
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnId);
      setSortDirection("asc");
    }
  };

  const handleRowSelect = (userId: string) => {
    setSelectedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleViewUser = (user: User) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

  const handleConfirmDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setCreateModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = users.filter(
      (user) =>
        (user.name?.toLowerCase() || "").includes(lowercasedQuery) ||
        (user.email?.toLowerCase() || "").includes(lowercasedQuery) ||
        (user.role?.toLowerCase() || "").includes(lowercasedQuery) ||
        (user.location?.toLowerCase() || "").includes(lowercasedQuery)
    );

    setFilteredUsers(filtered);

    if (query.trim() !== "" && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...users];

    if (filters.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((user) =>
        filters.status.includes(user.status)
      );
    }

    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          (user.name?.toLowerCase() || "").includes(lowercasedQuery) ||
          (user.email?.toLowerCase() || "").includes(lowercasedQuery) ||
          (user.role?.toLowerCase() || "").includes(lowercasedQuery) ||
          (user.location?.toLowerCase() || "").includes(lowercasedQuery)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredUsers(users);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    toast.success("Users exported successfully");
  };

  const handleModalSuccess = () => {
    fetchUsers();
  };

  const getStatistics = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === "active").length;
    const adminUsers = users.filter((user) =>
      user.role.toLowerCase().includes("admin")
    ).length;
    const recentUsers = users.filter((user) => {
      if (!user.createdAt) return false;
      const createdDate = new Date(user.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length;

    return { totalUsers, activeUsers, adminUsers, recentUsers };
  };

  const CustomPagination = () => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredUsers.length);

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-6 bg-white dark:bg-gray-800 border-t border-slate-100 dark:border-gray-700">
        <div className="text-sm text-slate-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium text-slate-700 dark:text-gray-300">
            {startIndex}
          </span>{" "}
          to{" "}
          <span className="font-medium text-slate-700 dark:text-gray-300">
            {endIndex}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700 dark:text-gray-300">
            {filteredUsers.length}
          </span>{" "}
          users
        </div>

        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          <div className="flex">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 border border-slate-200 dark:border-gray-600 rounded-l-lg ${
                currentPage === 1
                  ? "text-slate-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700"
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else {
                if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-9 h-9 border-t border-b border-slate-200 dark:border-gray-600 ${
                    pageNumber === currentPage
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium"
                      : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 border border-slate-200 dark:border-gray-600 rounded-r-lg ${
                currentPage === totalPages
                  ? "text-slate-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700"
              }`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="py-12 px-4 text-center">
      <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-gray-700 rounded-full mb-4">
        <Users size={24} className="text-slate-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-2">
        No users found
      </h3>
      <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        Try adjusting your search or filters to find what you're looking for.
      </p>
      <button
        onClick={handleResetFilters}
        className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
      >
        Clear filters
      </button>
    </div>
  );

  const LoadingState = () => (
    <div className="py-12 px-4 text-center">
      <div className="inline-flex items-center justify-center">
        <Loader size={24} className="text-primary-500 animate-spin" />
        <span className="ml-3 text-slate-500 dark:text-gray-400">
          Loading users...
        </span>
      </div>
    </div>
  );

  const { totalUsers, activeUsers, adminUsers, recentUsers } = getStatistics();

  return (
    <div className="p-6 w-full mx-auto max-w-[1600px]">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-light text-slate-900 dark:text-gray-100">
            User Management
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Manage user accounts, roles and permissions
          </p>
        </div>
        <motion.button
          className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm shadow-sm"
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
          whileTap={{ y: 0 }}
          onClick={handleAddUser}
        >
          <UserPlus size={16} className="mr-2" />
          <span>Add User</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Users
            </p>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {totalUsers}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            All registered user accounts
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Active Users
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {activeUsers}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            {((activeUsers / totalUsers) * 100).toFixed(0)}% of total users
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Admin Users
            </p>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Shield size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {adminUsers}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Users with administrative access
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              New Users (30d)
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {recentUsers}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Added in the last 30 days
          </p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Box */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg flex items-center text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg flex items-center text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Download size={16} className="mr-2" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={appliedFilters.role || ""}
                      onChange={(e) =>
                        handleApplyFilters({
                          ...appliedFilters,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="">All Roles</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.title}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <div className="flex space-x-2">
                      <label className="flex items-center text-sm text-slate-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 mr-1.5"
                          checked={
                            !appliedFilters.status ||
                            appliedFilters.status.includes("active")
                          }
                          onChange={(e) => {
                            const status = appliedFilters.status || [];
                            const newStatus = e.target.checked
                              ? [...status, "active"]
                              : status.filter((s) => s !== "active");
                            handleApplyFilters({
                              ...appliedFilters,
                              status: newStatus,
                            });
                          }}
                        />
                        Active
                      </label>
                      <label className="flex items-center text-sm text-slate-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 mr-1.5"
                          checked={
                            !appliedFilters.status ||
                            appliedFilters.status.includes("inactive")
                          }
                          onChange={(e) => {
                            const status = appliedFilters.status || [];
                            const newStatus = e.target.checked
                              ? [...status, "inactive"]
                              : status.filter((s) => s !== "inactive");
                            handleApplyFilters({
                              ...appliedFilters,
                              status: newStatus,
                            });
                          }}
                        />
                        Inactive
                      </label>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-slate-600 dark:text-gray-400 text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Results Summary */}
      <motion.div
        className="flex items-center mb-2 text-sm text-slate-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Users size={14} className="mr-2" />
        Showing{" "}
        <span className="font-medium text-slate-700 dark:text-gray-300 mx-1">
          {filteredUsers.length}
        </span>
        {filteredUsers.length !== users.length && (
          <>
            of{" "}
            <span className="font-medium text-slate-700 dark:text-gray-300 mx-1">
              {users.length}
            </span>
          </>
        )}
        users
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-700 border-b border-slate-100 dark:border-gray-600">
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <button
                      onClick={handleSelectAll}
                      className="mr-3 text-slate-400 dark:text-gray-500 hover:text-primary-500 focus:outline-none"
                    >
                      {selectAll ? (
                        <CheckSquare size={16} className="text-primary-500" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none"
                    >
                      <span>User</span>
                      {sortBy === "name" && (
                        <span className="ml-1 text-primary-500">
                          {sortDirection === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none"
                  >
                    <span>Status</span>
                    {sortBy === "status" && (
                      <span className="ml-1 text-primary-500">
                        {sortDirection === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("lastActive")}
                    className="flex items-center text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none"
                  >
                    <span>Last Login</span>
                    {sortBy === "lastActive" && (
                      <span className="ml-1 text-primary-500">
                        {sortDirection === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>
                    <LoadingState />
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`
                      border-b border-slate-100 dark:border-gray-600
                      ${
                        selectedRows.includes(user.id)
                          ? "bg-primary-50 dark:bg-primary-900/30"
                          : index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-slate-50/30 dark:bg-gray-700/30"
                      }
                      hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors
                    `}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleRowSelect(user.id)}
                          className="mr-3 text-slate-400 dark:text-gray-500 hover:text-primary-500 focus:outline-none"
                        >
                          {selectedRows.includes(user.id) ? (
                            <CheckSquare
                              size={16}
                              className="text-primary-500"
                            />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getUserColor(
                            user.id
                          )} text-white flex items-center justify-center font-medium text-sm mr-3 shadow-sm`}
                        >
                          {getUserInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-gray-200">
                            {user.name || "Unnamed User"}
                          </p>
                          <div className="flex items-center text-xs text-slate-500 dark:text-gray-400">
                            <Mail size={12} className="mr-1" />
                            <span className="truncate max-w-[180px]">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            user.status === "active"
                              ? "bg-emerald-500"
                              : "bg-slate-300 dark:bg-gray-600"
                          }`}
                        ></div>
                        <span
                          className={`text-sm ${
                            user.status === "active"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-slate-500 dark:text-gray-400"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-slate-600 dark:text-gray-400">
                        <Clock
                          size={14}
                          className="text-slate-400 dark:text-gray-500 mr-1.5"
                          strokeWidth={1.8}
                        />
                        <span className="text-sm">
                          {user.last_login ? moment(user.last_login).fromNow() : "Never"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end space-x-1">
                        <motion.button
                          className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="View user"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye size={16} strokeWidth={1.8} />
                        </motion.button>
                        <motion.button
                          className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Edit user"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit size={16} strokeWidth={1.8} />
                        </motion.button>
                        <motion.button
                          className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Delete user"
                          onClick={() => handleConfirmDelete(user)}
                        >
                          <Trash2 size={16} strokeWidth={1.8} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredUsers.length > 0 && <CustomPagination />}
      </motion.div>

      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center"
          >
            <span className="mr-4 text-sm">
              <span className="font-medium">{selectedRows.length}</span> users
              selected
            </span>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-slate-700 dark:bg-gray-700 hover:bg-slate-600 dark:hover:bg-gray-600 rounded-md text-sm flex items-center"
                onClick={() => {
                  toast.success(`${selectedRows.length} users exported`);
                  setSelectedRows([]);
                  setSelectAll(false);
                }}
              >
                <Download size={14} className="mr-1.5" />
                Export
              </button>
              <button
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm flex items-center"
                onClick={() => {
                  toast.success(`${selectedRows.length} users deleted`);
                  setSelectedRows([]);
                  setSelectAll(false);
                }}
              >
                <Trash2 size={14} className="mr-1.5" />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createModalOpen && (
          <CreateUserModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSuccess={handleModalSuccess}
            roles={roles}
          />
        )}

        {editModalOpen && selectedUser && (
          <EditUserModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSuccess={handleModalSuccess}
            user={selectedUser}
            roles={roles}
          />
        )}

        {deleteModalOpen && selectedUser && (
          <DeleteUserModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={() => handleDeleteUser(selectedUser.id)}
            user={selectedUser}
          />
        )}

        {roleModalOpen && selectedUser && (
          <UserRoleModal
            isOpen={roleModalOpen}
            onClose={() => setRoleModalOpen(false)}
            onSuccess={handleModalSuccess}
            userId={selectedUser.id}
            roles={roles}
            currentRoleId={selectedUser.role_id || ""}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementPage;
