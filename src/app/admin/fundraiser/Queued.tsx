import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  X,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Loader,
  SlidersHorizontal,
  AlertCircle,
  User,
  AlignLeft,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";
import { useNavigate } from "react-router-dom";
import ApproveCampaignModal from "../../../components/fundraiser/ApproveCampaignModal";
import RejectCampaignModal from "../../../components/fundraiser/RejectCampaignModal";

const getPlaceholderImage = (title: string, id: string) => {
  const colorOptions = [
    "4f46e5",
    "0ea5e9",
    "10b981",
    "f59e0b",
    "ef4444",
    "8b5cf6",
    "ec4899",
    "FF6B81",
    "B75BFF",
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

  const handleFilterChange = (newFilters) => {
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

      toast.success("Queue refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAction = (campaign, type) => {
    setSelectedCampaign(campaign);
    setActionType(type);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setIsFetching(true);
    try {
      let successMessage = "";

      switch (actionType) {
        case "approve":
          // await fundraiserService.approveCampaign(selectedCampaign.id);
          successMessage = "Campaign approved successfully";
          break;
        case "reject":
          // await fundraiserService.rejectCampaign(selectedCampaign.id);
          successMessage = "Campaign rejected successfully";
          break;
        default:
          successMessage = "Action completed successfully";
      }

      // Update UI optimistically - remove the campaign from the list
      setCampaigns((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
      setFilteredCampaigns((prev) =>
        prev.filter((c) => c.id !== selectedCampaign.id)
      );

      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));

      toast.success(successMessage);
    } catch (error) {
      toast.error(`Failed to ${actionType} campaign`);
      console.error(`Error during ${actionType}:`, error);
    } finally {
      setIsFetching(false);
      setShowActionModal(false);
    }
  };

  const handleViewCampaign = (campaignId) => {
    navigate(`/admin/fundraising/campaigns/${campaignId}`);
  };

  const toggleExpandCampaign = (campaignId) => {
    setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId);
  };

  const changePage = (newPage) => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.04,
        ease: [0.22, 0.61, 0.36, 1],
      },
    }),
    hover: {
      y: -6,
      boxShadow:
        "0 18px 35px rgba(0, 0, 0, 0.08), 0 8px 15px rgba(0, 0, 0, 0.06)",
      transition: { duration: 0.25, ease: [0.22, 0.61, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.25,
        ease: [0.22, 0.61, 0.36, 1],
      },
    },
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="p-6 sm:p-8 w-full mx-auto max-w-[1600px] bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-4 bg-gradient-to-br from-amber-400 to-amber-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <Clock className="text-white" size={20} />
            </span>
            Approval Queue
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-14">
            Review and approve fundraising campaigns
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={refreshData}
            disabled={isFetching}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh Queue</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Queue Status Card */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isLoading ? "..." : pagination.total} Campaigns Awaiting Review
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isLoading ? "..." : filteredCampaigns.length} campaigns
                displayed with current filters
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Average wait time
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                2.4 days
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search queued campaigns by title, description, creator..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              whileHover={{
                y: -2,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
                backgroundColor: "#f9fafb",
              }}
              whileTap={{ y: 0 }}
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-sm"
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Submission Date
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-sm"
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Amount
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-sm"
                      value={filters.amountRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          amountRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; Kes 10,000)</option>
                      <option value="medium">
                        Medium (Kes 10,000 - Kes 50,000)
                      </option>
                      <option value="large">Large (&gt; Kes 50,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-sm"
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          sortBy: e.target.value,
                        })
                      }
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="goal_high">Highest Goal</option>
                      <option value="goal_low">Lowest Goal</option>
                    </select>
                  </div>

                  <div className="lg:col-span-4 flex justify-end">
                    <motion.button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl text-sm transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={36} className="text-amber-500 animate-spin mr-4" />
          <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Loading approval queue...
          </span>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm py-16 px-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-700 rounded-full mb-5">
            <CheckCircle
              size={28}
              className="text-green-500 dark:text-green-400"
            />
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
            No campaigns in the queue
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            All campaigns have been reviewed. Check back later for new
            submissions.
          </p>
          <motion.button
            onClick={refreshData}
            className="px-6 py-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-sm hover:bg-amber-500/20 transition-colors shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RefreshCw size={16} className="inline mr-2" />
            Refresh Queue
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row">
                  <div className="flex items-start mb-4 md:mb-0 md:w-3/5">
                    <div
                      className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl bg-center bg-cover mr-4 relative overflow-hidden shadow-md flex-shrink-0"
                      style={{
                        backgroundImage: `url(${
                          campaign.images && campaign.images.length > 0
                            ? campaign.images[0]
                            : getPlaceholderImage(campaign.title, campaign.id)
                        })`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center mb-1">
                        <span className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-full mr-2">
                          Pending Approval
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted{" "}
                          {formatDistanceToNow(new Date(campaign.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {campaign.title}
                      </h3>

                      <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-3 mb-2">
                        <span className="flex items-center">
                          <User size={12} className="mr-1.5" />
                          {campaign.creatorName || "Anonymous Creator"}
                        </span>

                        {campaign.category && (
                          <span className="capitalize px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-medium">
                            {campaign.category}
                          </span>
                        )}

                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1.5" />
                          {campaign.endDate
                            ? format(new Date(campaign.endDate), "MMM d, yyyy")
                            : "No end date"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {campaign.description ||
                          campaign.subtitle ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center ml-0 md:ml-auto md:w-2/5 justify-end">
                    <div className="flex flex-col mb-4 md:mb-0 md:mr-6">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Goal Amount
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Kes{" "}
                        {parseFloat(campaign.goalAmount || 0).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                        onClick={() => handleAction(campaign, "approve")}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ y: 0, scale: 0.98 }}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </motion.button>

                      <motion.button
                        className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        onClick={() => handleAction(campaign, "reject")}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ y: 0, scale: 0.98 }}
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </motion.button>

                      <motion.button
                        className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        onClick={() => handleViewCampaign(campaign.id)}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ y: 0, scale: 0.98 }}
                      >
                        <Eye size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <motion.button
                    className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                    onClick={() => toggleExpandCampaign(campaign.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SlidersHorizontal size={14} className="mr-1.5" />
                    {expandedCampaign === campaign.id
                      ? "Hide details"
                      : "Show details"}
                    <ChevronDown
                      size={14}
                      className={`ml-1.5 transition-transform ${
                        expandedCampaign === campaign.id
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </motion.button>
                </div>

                <AnimatePresence initial={false}>
                  {expandedCampaign === campaign.id && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={expandVariants}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <User size={14} className="mr-1.5" />
                            Creator Information
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-sm">
                            <p className="flex justify-between mb-1">
                              <span className="text-gray-500 dark:text-gray-400">
                                Name:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {campaign.creatorName || "Not provided"}
                              </span>
                            </p>
                            <p className="flex justify-between mb-1">
                              <span className="text-gray-500 dark:text-gray-400">
                                Email:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {campaign.creatorEmail || "Not provided"}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">
                                Verified:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {campaign.creatorVerified ? "Yes" : "No"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <Calendar size={14} className="mr-1.5" />
                            Campaign Timeline
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-sm">
                            <p className="flex justify-between mb-1">
                              <span className="text-gray-500 dark:text-gray-400">
                                Created:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {format(
                                  new Date(campaign.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </p>
                            <p className="flex justify-between mb-1">
                              <span className="text-gray-500 dark:text-gray-400">
                                Start Date:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {campaign.startDate
                                  ? format(
                                      new Date(campaign.startDate),
                                      "MMM d, yyyy"
                                    )
                                  : "Upon approval"}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">
                                End Date:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {campaign.endDate
                                  ? format(
                                      new Date(campaign.endDate),
                                      "MMM d, yyyy"
                                    )
                                  : "No end date"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <AlertCircle size={14} className="mr-1.5" />
                            Review Information
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-sm">
                            <p className="flex justify-between mb-1">
                              <span className="text-gray-500 dark:text-gray-400">
                                Flags:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {campaign.flags ? campaign.flags.length : 0}
                              </span>
                            </p>
                            <p className="flex justify-between mb-1">
                              <span className="text-gray-500 dark:text-gray-400">
                                Content Check:
                              </span>
                              <span
                                className={`font-medium ${
                                  campaign.contentVerified
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {campaign.contentVerified
                                  ? "Passed"
                                  : "Needs Review"}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">
                                Time in Queue:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatDistanceToNow(
                                  new Date(campaign.createdAt)
                                )}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="md:col-span-3">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <AlignLeft size={14} className="mr-1.5" />
                            Full Description
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-sm text-gray-600 dark:text-gray-300">
                            {campaign.description ||
                              "No detailed description provided."}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
