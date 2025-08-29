import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Loader,
  User,
  DollarSign,
  ChevronRight,
  Tag,
  AlertCircle,
  MoreVertical,
  ArrowUpDown,
  ChevronLeft,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";
import { useNavigate } from "react-router-dom";
import ApproveCampaignModal from "../../../components/fundraiser/ApproveCampaignModal";
import RejectCampaignModal from "../../../components/fundraiser/RejectCampaignModal";

const getPlaceholderImage = (title: string, id: string) => {
  const colorOptions = [
    "3b82f6",
    "06b6d4",
    "10b981",
    "f59e0b",
    "ef4444",
    "8b5cf6",
    "ec4899",
  ];
  const index = id.charCodeAt(0) % colorOptions.length;
  const color = colorOptions[index];
  const text = encodeURIComponent(title.slice(0, 20));
  return `https://placehold.co/800x400/${color}/ffffff/png?text=${text}`;
};

const QueuedCampaignsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    dateRange: "all",
    amountRange: "all",
    sortBy: "newest",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await fundraiserService.getPendingCampaigns(
          pagination.page,
          pagination.limit
        );

        setCampaigns(response.data);
        setFilteredCampaigns(response.data);
        setPagination(response.pagination);

        const uniqueCategories = [
          ...new Set(response.data.map((c) => c.category)),
        ].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast.error("Failed to load queued campaigns");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pagination.page, pagination.limit]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters(filters, campaigns);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = campaigns.filter(
      (campaign) =>
        campaign.title?.toLowerCase().includes(lowercaseQuery) ||
        campaign.description?.toLowerCase().includes(lowercaseQuery) ||
        campaign.category?.toLowerCase().includes(lowercaseQuery) ||
        campaign.subtitle?.toLowerCase().includes(lowercaseQuery) ||
        campaign.creatorName?.toLowerCase().includes(lowercaseQuery)
    );

    applyFilters(filters, filtered);
  };

  const applyFilters = (newFilters, items = campaigns) => {
    setFilters(newFilters);

    let filtered = [...items];

    if (newFilters.category) {
      filtered = filtered.filter((c) => c.category === newFilters.category);
    }

    if (newFilters.dateRange !== "all") {
      const daysMap = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysMap[newFilters.dateRange]);
      filtered = filtered.filter((c) => new Date(c.createdAt) >= cutoffDate);
    }

    if (newFilters.amountRange !== "all") {
      const rangeMaps = {
        small: { min: 0, max: 10000 },
        medium: { min: 10000, max: 50000 },
        large: { min: 50000, max: Infinity },
      };

      const range = rangeMaps[newFilters.amountRange];
      filtered = filtered.filter(
        (c) =>
          parseFloat(c.goalAmount) >= range.min &&
          parseFloat(c.goalAmount) < range.max
      );
    }

    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
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
        case "goal_high":
          filtered.sort(
            (a, b) => parseFloat(b.goalAmount) - parseFloat(a.goalAmount)
          );
          break;
        case "goal_low":
          filtered.sort(
            (a, b) => parseFloat(a.goalAmount) - parseFloat(b.goalAmount)
          );
          break;
        default:
          break;
      }
    }

    setFilteredCampaigns(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: "",
      dateRange: "all",
      amountRange: "all",
      sortBy: "newest",
    };

    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredCampaigns(campaigns);
  };

  const refreshData = async () => {
    setIsFetching(true);
    try {
      const response = await fundraiserService.getPendingCampaigns(
        pagination.page,
        pagination.limit
      );

      setCampaigns(response.data);
      setFilteredCampaigns(response.data);
      setPagination(response.pagination);

      toast.success("Queue refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAction = (campaign: any, type: string) => {
    setSelectedCampaign(campaign);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleViewCampaign = (id: string) => {
    navigate(`/admin/fundraising/campaigns/${id}`);
  };

  const toggleExpandCampaign = (id: string) => {
    setExpandedCampaign(expandedCampaign === id ? null : id);
  };

  const changePage = (newPage: number) => {
    if (
      newPage > 0 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      setPagination({
        ...pagination,
        page: newPage,
      });

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, pagination.page - delta);
      i <= Math.min(totalPages - 1, pagination.page + delta);
      i++
    ) {
      range.push(i);
    }

    if (pagination.page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50 dark:bg-gray-950"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Campaign Approval Queue
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLoading
                    ? "Loading..."
                    : `${pagination.total} campaigns awaiting review`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium">
                {isLoading ? "..." : filteredCampaigns.length} shown
              </div>
              <button
                onClick={refreshData}
                disabled={isFetching}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                <RefreshCw
                  size={18}
                  className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns, creators, or descriptions..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  showFilters
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700"
                }`}
              >
                <Filter size={18} className="mr-2" />
                Filters
                <ChevronDown
                  size={18}
                  className={`ml-2 transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Category",
                          value: filters.category,
                          onChange: (value) =>
                            handleFilterChange({ ...filters, category: value }),
                          options: [
                            { value: "", label: "All Categories" },
                            ...categories.map((cat) => ({
                              value: cat,
                              label: cat,
                            })),
                          ],
                        },
                        {
                          label: "Date Range",
                          value: filters.dateRange,
                          onChange: (value) =>
                            handleFilterChange({
                              ...filters,
                              dateRange: value,
                            }),
                          options: [
                            { value: "all", label: "All Time" },
                            { value: "7days", label: "Last 7 Days" },
                            { value: "30days", label: "Last 30 Days" },
                            { value: "90days", label: "Last 90 Days" },
                          ],
                        },
                        {
                          label: "Goal Amount",
                          value: filters.amountRange,
                          onChange: (value) =>
                            handleFilterChange({
                              ...filters,
                              amountRange: value,
                            }),
                          options: [
                            { value: "all", label: "All Amounts" },
                            { value: "small", label: "< Kes 10K" },
                            { value: "medium", label: "Kes 10K - 50K" },
                            { value: "large", label: "> Kes 50K" },
                          ],
                        },
                        {
                          label: "Sort By",
                          value: filters.sortBy,
                          onChange: (value) =>
                            handleFilterChange({ ...filters, sortBy: value }),
                          options: [
                            { value: "newest", label: "Newest First" },
                            { value: "oldest", label: "Oldest First" },
                            { value: "goal_high", label: "Highest Goal" },
                            { value: "goal_low", label: "Lowest Goal" },
                          ],
                        },
                      ].map((filter, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {filter.label}
                          </label>
                          <select
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                          >
                            {filter.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleResetFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-slate-50 dark:bg-gray-800/50 px-6 py-4 border-b border-slate-200 dark:border-gray-800">
            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              <div className="col-span-4">
                <button className="flex items-center hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  Campaign
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button className="flex items-center hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  Creator
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button className="flex items-center hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  Goal Amount
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button className="flex items-center hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  Submitted
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-gray-800">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center">
                  <Loader className="w-6 h-6 text-blue-500 animate-spin mr-3" />
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Loading campaigns...
                  </span>
                </div>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  No campaigns are waiting for review.
                </p>
                <button
                  onClick={refreshData}
                  className="inline-flex items-center px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                >
                  <RefreshCw size={18} className="mr-2" />
                  Check for new campaigns
                </button>
              </div>
            ) : (
              filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200"
                >
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Campaign Column */}
                      <div className="col-span-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-800 bg-cover bg-center flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm"
                            style={{
                              backgroundImage: `url(${
                                campaign.images && campaign.images.length > 0
                                  ? campaign.images[0]
                                  : getPlaceholderImage(
                                      campaign.title,
                                      campaign.id
                                    )
                              })`,
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
                                {campaign.title}
                              </h3>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                              {campaign.category && (
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded capitalize">
                                  {campaign.category}
                                </span>
                              )}
                              <span className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {formatDistanceToNow(
                                  new Date(campaign.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Creator Column */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <User
                            size={16}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {campaign.creatorName || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {campaign.creatorVerified ? (
                                <span className="text-green-600 dark:text-green-400">
                                  ✓ Verified
                                </span>
                              ) : (
                                "Unverified"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign
                            size={16}
                            className="text-blue-500 flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              Kes{" "}
                              {parseFloat(
                                campaign.goalAmount || 0
                              ).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Goal amount
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Submitted Column */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Calendar
                            size={16}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {format(
                                new Date(campaign.createdAt),
                                "MMM d, yyyy"
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(
                                new Date(campaign.createdAt)
                              )}{" "}
                              ago
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => toggleExpandCampaign(campaign.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                          >
                            <ChevronRight
                              size={16}
                              className={`transition-transform duration-200 ${
                                expandedCampaign === campaign.id
                                  ? "rotate-90"
                                  : ""
                              }`}
                            />
                          </button>

                          <button
                            onClick={() => handleViewCampaign(campaign.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => handleAction(campaign, "reject")}
                            className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-xs font-medium transition-all duration-200"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => handleAction(campaign, "approve")}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedCampaign === campaign.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-slate-50 dark:bg-gray-800/50"
                      >
                        <div className="px-6 py-6 border-t border-slate-200 dark:border-gray-700">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                              <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <User
                                  size={16}
                                  className="mr-2 text-blue-500"
                                />
                                Creator Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Name:
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {campaign.creatorName || "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Email:
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                                    {campaign.creatorEmail || "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Status:
                                  </span>
                                  <span
                                    className={`font-medium ${
                                      campaign.creatorVerified
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                    }`}
                                  >
                                    {campaign.creatorVerified
                                      ? "Verified"
                                      : "Unverified"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <Calendar
                                  size={16}
                                  className="mr-2 text-blue-500"
                                />
                                Campaign Timeline
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Submitted:
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {format(
                                      new Date(campaign.createdAt),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Start Date:
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {campaign.startDate
                                      ? format(
                                          new Date(campaign.startDate),
                                          "MMM d, yyyy"
                                        )
                                      : "On approval"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    End Date:
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {campaign.endDate
                                      ? format(
                                          new Date(campaign.endDate),
                                          "MMM d, yyyy"
                                        )
                                      : "No limit"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <AlertCircle
                                  size={16}
                                  className="mr-2 text-blue-500"
                                />
                                Review Status
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Flags:
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {campaign.flags ? campaign.flags.length : 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Content:
                                  </span>
                                  <span
                                    className={`font-medium ${
                                      campaign.contentVerified
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-amber-600 dark:text-amber-400"
                                    }`}
                                  >
                                    {campaign.contentVerified
                                      ? "Verified"
                                      : "Pending"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Queue time:
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {formatDistanceToNow(
                                      new Date(campaign.createdAt)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {campaign.description && (
                            <div className="mt-6">
                              <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                <Tag size={16} className="mr-2 text-blue-500" />
                                Campaign Description
                              </h4>
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {campaign.description}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!isLoading && filteredCampaigns.length > 0 && totalPages > 1 && (
            <div className="bg-slate-50 dark:bg-gray-800/50 px-6 py-4 border-t border-slate-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {startItem}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pagination.total}
                    </span>{" "}
                    campaigns
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === 1
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof pageNumber === "number" &&
                          changePage(pageNumber)
                        }
                        disabled={pageNumber === "..."}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pageNumber === pagination.page
                            ? "bg-blue-500 text-white shadow-sm"
                            : pageNumber === "..."
                            ? "text-gray-400 dark:text-gray-500 cursor-default"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === totalPages
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      <AnimatePresence>
        {showActionModal &&
          selectedCampaign &&
          (actionType === "approve" ? (
            <ApproveCampaignModal
              onClose={() => setShowActionModal(false)}
              id={selectedCampaign.id}
              onApproved={() => {
                setCampaigns((prev) =>
                  prev.filter((c) => c.id !== selectedCampaign.id)
                );
                setFilteredCampaigns((prev) =>
                  prev.filter((c) => c.id !== selectedCampaign.id)
                );
                setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
                setShowActionModal(false);
                toast.success("Campaign approved successfully");
              }}
              campaignTitle={selectedCampaign.title}
            />
          ) : (
            <RejectCampaignModal
              onClose={() => setShowActionModal(false)}
              onRejected={() => {
                setCampaigns((prev) =>
                  prev.filter((c) => c.id !== selectedCampaign.id)
                );
                setFilteredCampaigns((prev) =>
                  prev.filter((c) => c.id !== selectedCampaign.id)
                );
                setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
                setShowActionModal(false);
                toast.success("Campaign rejected successfully");
              }}
              campaignTitle={selectedCampaign.title}
            />
          ))}
      </AnimatePresence>
    </div>
  );
};

export default QueuedCampaignsPage;
