import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Plus,
  Clock,
  Shield,
  Search,
  Settings,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  CalendarClock,
  LayoutGrid,
  List,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { roleService } from "../../../api/services/roles";

interface Role {
  id: string;
  title: string;
  description: string;
  code: string | null;
  default: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  userCount?: number;
  status?: string;
}

const RoleCategoryBadge = ({ role }) => {
  if (role.default) {
    return (
      <div className="px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800">
        System Default
      </div>
    );
  }

  if (role.title.toLowerCase().includes("admin")) {
    return (
      <div className="px-2 py-0.5 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full border border-purple-100 dark:border-purple-800">
        Admin
      </div>
    );
  }

  if (role.title.toLowerCase().includes("support")) {
    return (
      <div className="px-2 py-0.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800">
        Support
      </div>
    );
  }

  return (
    <div className="px-2 py-0.5 text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full border border-gray-100 dark:border-gray-600">
      Custom
    </div>
  );
};

const StatusBadge = ({ active }) => {
  return active ? (
    <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
      Active
    </div>
  ) : (
    <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-1.5"></span>
      Inactive
    </div>
  );
};

const RolesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRoleType, setSelectedRoleType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await roleService.getRoles();

      const processedRoles = response.map((role: Role) => ({
        ...role,
        status: role.deletedAt ? "inactive" : "active",
        userCount: Math.floor(Math.random() * 50),
      }));

      setRoles(processedRoles);
      setFilteredRoles(processedRoles);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setError("Failed to load roles. Please try again later.");
      toast.error("Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    let result = [...roles];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (role) =>
          role.title.toLowerCase().includes(lowercasedQuery) ||
          role.description.toLowerCase().includes(lowercasedQuery) ||
          (role.code && role.code.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (selectedRoleType !== "all") {
      if (selectedRoleType === "default") {
        result = result.filter((role) => role.default);
      } else if (selectedRoleType === "admin") {
        result = result.filter((role) =>
          role.title.toLowerCase().includes("admin")
        );
      } else if (selectedRoleType === "support") {
        result = result.filter((role) =>
          role.title.toLowerCase().includes("support")
        );
      } else if (selectedRoleType === "custom") {
        result = result.filter(
          (role) =>
            !role.default &&
            !role.title.toLowerCase().includes("admin") &&
            !role.title.toLowerCase().includes("support")
        );
      }
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
      } else if (sortBy === "default") {
        comparison = a.default === b.default ? 0 : a.default ? -1 : 1;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredRoles(result);
  }, [roles, searchQuery, selectedRoleType, sortBy, sortDirection]);

  const handleViewRole = (role: Role) => {
    navigate(`/admin/system/roles/${role.id}`);
  };

  const handleAddRole = () => {
    navigate("/admin/system/roles/create");
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

  // Function to get the role icon based on role properties
  const getRoleIcon = (role: Role) => {
    if (role.default) {
      return (
        <ShieldCheck className="text-blue-500 dark:text-blue-400" size={18} />
      );
    }

    if (role.title.toLowerCase().includes("admin")) {
      return (
        <ShieldAlert
          className="text-purple-500 dark:text-purple-400"
          size={18}
        />
      );
    }

    if (role.title.toLowerCase().includes("support")) {
      return (
        <Users className="text-emerald-500 dark:text-emerald-400" size={18} />
      );
    }

    return <Shield className="text-gray-500 dark:text-gray-400" size={18} />;
  };

  // Get gradient colors based on role
  const getRoleGradient = (role: Role) => {
    if (role.default) {
      return "from-blue-500 to-indigo-600";
    }

    if (role.title.toLowerCase().includes("admin")) {
      return "from-purple-500 to-indigo-600";
    }

    if (role.title.toLowerCase().includes("support")) {
      return "from-emerald-500 to-teal-600";
    }

    return "from-gray-700 to-gray-900";
  };

  // Loading skeleton for grid view
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

  // Loading skeleton for list view
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
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">
            Role Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Configure and manage user roles and permissions
          </p>
        </div>

        <motion.button
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm shadow-sm"
          whileHover={{
            y: -2,
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
          }}
          whileTap={{ y: 0 }}
          onClick={handleAddRole}
        >
          <Plus size={16} className="mr-2" />
          Create Role
        </motion.button>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search roles..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Role Type Filter */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              Type:
            </span>
            <select
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedRoleType}
              onChange={(e) => setSelectedRoleType(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="default">System Default</option>
              <option value="admin">Admin Roles</option>
              <option value="support">Support Roles</option>
              <option value="custom">Custom Roles</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              Sort:
            </span>
            <select
              className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="title">Role Name</option>
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Last Updated</option>
              <option value="default">Default Status</option>
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

          {/* View Mode Toggle */}
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
        <Users size={14} className="mr-2" />
        Showing{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
          {filteredRoles.length}
        </span>
        of{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
          {roles.length}
        </span>{" "}
        roles
      </motion.div>

      {/* Roles Display */}
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
        ) : filteredRoles.length === 0 ? (
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
              No roles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
              onClick={() => {
                setSearchQuery("");
                setSelectedRoleType("all");
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
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md dark:hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                {/* Colored header */}
                <div
                  className={`h-2 bg-gradient-to-r ${getRoleGradient(role)}`}
                ></div>

                <div className="p-5">
                  {/* Role header */}
                  <div className="flex items-start mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleGradient(
                        role
                      )} flex items-center justify-center text-white mr-3 shadow-sm`}
                    >
                      {getRoleIcon(role)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">
                        {role.title}
                      </h3>
                      <RoleCategoryBadge role={role} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {role.description || "No description provided"}
                  </p>

                  {/* Role details */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Users size={12} className="mr-1" />
                      <span>{role.userCount || 0} users</span>
                    </div>

                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>
                        {formatDistanceToNow(new Date(role.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-600">
                    <StatusBadge active={!role.deletedAt} />

                    <button
                      onClick={() => handleViewRole(role)}
                      className="flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      <span className="mr-1">View Details</span>
                      <ChevronRight size={14} />
                    </button>
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
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <div className="flex items-center px-6 py-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleGradient(
                      role
                    )} flex items-center justify-center text-white mr-4 shadow-sm`}
                  >
                    {getRoleIcon(role)}
                  </div>

                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mr-2">
                        {role.title}
                      </h3>
                      <RoleCategoryBadge role={role} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                      {role.description || "No description provided"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                      <div className="flex items-center">
                        <CalendarClock size={14} className="mr-1.5" />
                        <span>
                          {format(new Date(role.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block">
                      <div className="flex items-center">
                        <Users size={14} className="mr-1.5" />
                        <span>{role.userCount || 0} users</span>
                      </div>
                    </div>

                    <StatusBadge active={!role.deletedAt} />

                    <button
                      onClick={() => handleViewRole(role)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {!isLoading && filteredRoles.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                System Default Roles
              </h3>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <ShieldCheck
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {roles.filter((r) => r.default).length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pre-configured roles with standard permissions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Roles
              </h3>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Settings
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
            </div>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {roles.filter((r) => !r.default).length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              User-defined roles with custom permissions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Updated
              </h3>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <Clock
                  size={18}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
            </div>
            <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
              {roles.length > 0
                ? format(
                    new Date(
                      roles.reduce(
                        (latest, role) =>
                          new Date(role.updatedAt) > new Date(latest)
                            ? role.updatedAt
                            : latest,
                        roles[0].updatedAt
                      )
                    ),
                    "MMMM d, yyyy"
                  )
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Most recent role configuration change
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RolesPage;
