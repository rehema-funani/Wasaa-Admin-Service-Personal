import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MapPin,
  Calendar,
  Plus,
  FileText,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  X,
  Users,
  Tag,
  MoreHorizontal,
} from "lucide-react";
import businessService from "../../../api/services/businessService";
import { toast } from "react-hot-toast";

const AllBusinessesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("dateJoined");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filters, setFilters] = useState({
    status: "",
    tier: "",
    category: "",
    region: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const categories = [
    "All Categories",
    "Technology",
    "Retail",
    "Health",
    "Environmental",
    "Food & Beverage",
    "Tourism",
    "Finance",
    "Education",
    "Energy",
  ];

  const regions = [
    "All Regions",
    "Kenya",
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
  ];

  const tiers = ["All Tiers", "SME", "Enterprise", "NGO"];

  const statuses = [
    "All Statuses",
    "Active",
    "Pending Verification",
    "Incomplete",
    "Suspended",
    "ONBOARDING",
  ];

  const apiStatusToDisplay: Record<string, string> = {
    ACTIVE: "Active",
    PENDING_VERIFICATION: "Pending Verification",
    INCOMPLETE: "Incomplete",
    SUSPENDED: "Suspended",
    ONBOARDING: "ONBOARDING",
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const apiResponse = await businessService.getAllBusinesses();

        // Now, we map the API data to the format our UI expects.
        const transformedData = apiResponse.map(business => ({
          id: business.id,
          tenant_id: business.tenant_id, // Make sure tenant_id is available for links
          name: business.name,
          category: business.category || 'N/A', // API response may not have category
          tier: business.type, // Map 'type' to 'tier'
          status: apiStatusToDisplay[business.status] || business.status, // Transform status for display
          dateJoined: business.createdAt, // Map 'createdAt' to 'dateJoined'
          region: business.country, // Map 'country' to 'region'
          kycStatus: business.verification_status, // Map 'verification_status' to 'kycStatus'
          owner: business.created_by ? `${business.created_by.first_name} ${business.created_by.last_name}`.trim() : 'Admin/System',
          email: business.email || 'N/A', // API response may not have email
          phone: business.phone || 'N/A', // API response may not have phone
          productsCount: business.productsCount || 0, // Not in API response
          revenue: business.revenue || 0, // Not in API response
        }));

        setBusinesses(transformedData);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
        toast.error("Failed to load businesses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    // This effect handles filtering, searching, and sorting whenever the source data or criteria change.
    let processedData = [...businesses];

    // Apply search
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      processedData = processedData.filter(
        (business) =>
          business.name.toLowerCase().includes(lowercasedTerm) ||
          (business.id && business.id.toLowerCase().includes(lowercasedTerm)) ||
          (business.owner && business.owner.toLowerCase().includes(lowercasedTerm)) ||
          (business.email && business.email.toLowerCase().includes(lowercasedTerm))
      );
    }

    // Apply filters
    if (filters.status && filters.status !== "All Statuses") {
      processedData = processedData.filter((business) => business.status === filters.status);
    }
    if (filters.tier && filters.tier !== "All Tiers") {
      processedData = processedData.filter((business) => business.tier === filters.tier);
    }
    if (filters.category && filters.category !== "All Categories") {
      processedData = processedData.filter((business) => business.category === filters.category);
    }
    if (filters.region && filters.region !== "All Regions") {
      processedData = processedData.filter((business) => business.region === filters.region);
    }

    // Apply sorting
    processedData.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "dateJoined") {
        return sortDirection === "asc"
          ? new Date(a.dateJoined).getTime() - new Date(b.dateJoined).getTime()
          : new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime();
      } else if (sortField === "revenue") {
        return sortDirection === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue;
      } else if (sortField === "productsCount") {
        return sortDirection === "asc" ? a.productsCount - b.productsCount : b.productsCount - a.productsCount;
      }
      return 0;
    });

    setFilteredBusinesses(processedData);
    setCurrentPage(1); // Reset to page 1 whenever filters/search/sort changes
  }, [searchTerm, filters, sortField, sortDirection, businesses]);

  // This separate effect handles pagination recalculation
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
    setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
    // Ensure currentPage is not out of bounds after itemsPerPage changes
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredBusinesses, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(pagedBusinesses.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      setSelectAll(false);
    } else {
      setSelectedRows([...selectedRows, id]);
      if (selectedRows.length + 1 === pagedBusinesses.length) {
        setSelectAll(true);
      }
    }
  };

  const pagedBusinesses = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBusinesses.slice(startIndex, endIndex);
  }, [filteredBusinesses, currentPage, itemsPerPage]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      tier: "",
      category: "",
      region: "",
    });
    setSearchTerm("");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            All Businesses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and view all business accounts on WasaaChat
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.div
            whileHover={{
              y: -2,
              backgroundColor: "#4f46e5",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
            }}
            whileTap={{ y: 0 }}
          >
            <Link
              to="/admin/business/register"
              className="flex items-center px-4 py-2 bg-primary-600 text-white dark:bg-primary-700 dark:text-gray-100 rounded-xl text-sm shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600"
            >
              <Plus size={16} className="mr-2" strokeWidth={1.8} />
              Add Business
            </Link>
          </motion.div>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" strokeWidth={1.8} />
            Filters {showFilters ? "(Active)" : ""}
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-gray-400 dark:text-gray-500"
                strokeWidth={1.8}
              />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
              placeholder="Search businesses by name, ID, owner, or email..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div>
            <select
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business Tier
                </label>
                <select
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
                  value={filters.tier}
                  onChange={(e) => handleFilterChange("tier", e.target.value)}
                >
                  {tiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Region
                </label>
                <select
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
                  value={filters.region}
                  onChange={(e) => handleFilterChange("region", e.target.value)}
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm mr-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white dark:bg-primary-700 dark:text-gray-100 rounded-lg text-sm hover:bg-primary-700 dark:hover:bg-primary-600"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Active Filters */}
      {(filters.status || filters.tier || filters.category || filters.region) && (
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {filters.status && filters.status !== "All Statuses" && (
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="mr-2">Status: {filters.status}</span>
              <button
                onClick={() => handleFilterChange("status", "")}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {filters.tier && filters.tier !== "All Tiers" && (
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="mr-2">Tier: {filters.tier}</span>
              <button
                onClick={() => handleFilterChange("tier", "")}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {filters.category && filters.category !== "All Categories" && (
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="mr-2">Category: {filters.category}</span>
              <button
                onClick={() => handleFilterChange("category", "")}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {filters.region && filters.region !== "All Regions" && (
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="mr-2">Region: {filters.region}</span>
              <button
                onClick={() => handleFilterChange("region", "")}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <button
            onClick={clearFilters}
            className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Businesses Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-pulse flex flex-col space-y-4 w-full">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              No businesses found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              className="px-4 py-2 bg-primary-600 text-white dark:bg-primary-700 dark:text-gray-100 rounded-lg text-sm hover:bg-primary-700 dark:hover:bg-primary-600"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 dark:text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-600"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center"
                      onClick={() => handleSort("name")}
                    >
                      Business
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={14} className="ml-1" />
                        ) : (
                          <ChevronDown size={14} className="ml-1" />
                        ))}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category / Tier
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center"
                      onClick={() => handleSort("dateJoined")}
                    >
                      Date Joined
                      {sortField === "dateJoined" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={14} className="ml-1" />
                        ) : (
                          <ChevronDown size={14} className="ml-1" />
                        ))}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center"
                      onClick={() => handleSort("productsCount")}
                    >
                      Products
                      {sortField === "productsCount" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={14} className="ml-1" />
                        ) : (
                          <ChevronDown size={14} className="ml-1" />
                        ))}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      className="flex items-center"
                      onClick={() => handleSort("revenue")}
                    >
                      Revenue
                      {sortField === "revenue" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={14} className="ml-1" />
                        ) : (
                          <ChevronDown size={14} className="ml-1" />
                        ))}
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pagedBusinesses.map((business) => (
                  <tr
                    key={business.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 dark:text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-600"
                        checked={selectedRows.includes(business.id)}
                        onChange={() => handleSelectRow(business.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {business.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <span className="mr-2">{business.id}</span>
                            <span className="inline-flex items-center">
                              <MapPin size={12} className="mr-1" /> {business.region}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {business.category}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          business.tier === "Enterprise"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : business.tier === "NGO"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {business.tier}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          business.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : business.status === "Pending Verification"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            : business.status === "Suspended"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : business.status === "ONBOARDING"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {business.status}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        KYC: {business.kycStatus}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(business.dateJoined).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {business.owner}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {business.productsCount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(business.revenue)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link
                          to={`/admin/business/view/${business.id}`}
                          state={{ business: business }}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/admin/business/edit/${business.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <div className="relative group">
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" title="More options">
                            <MoreHorizontal size={18} />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <a
                              href={`/admin/business/verify/${business.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Verify Business
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Change Tier
                            </a>
                            <a
                              href="#"
                              className={`block px-4 py-2 text-sm ${
                                business.status === "Suspended"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              } hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                              {business.status === "Suspended" ? "Reinstate" : "Suspend"}
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!isLoading && filteredBusinesses.length > 0 && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredBusinesses.length)}
            </span>{" "}
            of <span className="font-medium">{filteredBusinesses.length}</span>{" "}
            businesses
          </div>
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => {
                // Logic to display pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  // Less than 5 pages, show all
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // Near the start
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // Near the end
                  pageNum = totalPages - 4 + i;
                } else {
                  // In the middle
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum
                        ? "bg-primary-600 text-white dark:bg-primary-700"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        </motion.div>
      )}

      {/* Bulk Actions Bar (only appears when rows are selected) */}
      {selectedRows.length > 0 && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{selectedRows.length}</span> businesses selected
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                Export Selected
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white dark:bg-amber-700 dark:text-gray-100 rounded-lg text-sm hover:bg-amber-700 dark:hover:bg-amber-600">
                Verify Selected
              </button>
              <button className="px-4 py-2 bg-red-600 text-white dark:bg-red-700 dark:text-gray-100 rounded-lg text-sm hover:bg-red-700 dark:hover:bg-red-600">
                Suspend Selected
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AllBusinessesPage;