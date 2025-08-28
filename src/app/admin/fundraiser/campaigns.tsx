import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Clock,
  Gift,
  CheckCircle,
  Zap,
  Loader,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ThumbsUp,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/fundraiser/StatusBadge";

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

const calculateProgress = (raised, goal) => {
  const raisedNum = parseFloat(raised);
  const goalNum = parseFloat(goal);
  if (goalNum <= 0) return 0;
  return Math.min(Math.round((raisedNum / goalNum) * 100), 100);
};

const CampaignsPage = () => {
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
    status: [],
    category: "",
    dateRange: "all",
    amountRange: "all",
    sortBy: "newest",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statsData, setStatsData] = useState({
    pending: 0,
    active: 0,
    completed: 0,
    totalRaised: 0,
  });
  const [isFetching, setIsFetching] = useState(false);

  const containerRef = useRef(null);
  const actionMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await fundraiserService.getCampaigns(
          pagination.page,
          pagination.limit
        );

        const campaignsWithProgress = response.data.map((campaign) => ({
          ...campaign,
          progress: calculateProgress(
            campaign.raisedAmount,
            campaign.goalAmount
          ),
        }));

        setCampaigns(campaignsWithProgress);
        setFilteredCampaigns(campaignsWithProgress);
        setPagination(response.pagination);

        const uniqueCategories = [
          ...new Set(campaignsWithProgress.map((c) => c.category)),
        ].filter(Boolean);
        setCategories(uniqueCategories);

        const stats = {
          pending: campaignsWithProgress.filter(
            (c) => c.status === "pending_approval"
          ).length,
          active: campaignsWithProgress.filter(
            (c) => c.status === "active" || c.status === "approved"
          ).length,
          completed: campaignsWithProgress.filter(
            (c) => c.status === "completed"
          ).length,
          totalRaised: campaignsWithProgress.reduce(
            (total, campaign) => total + parseFloat(campaign.raisedAmount || 0),
            0
          ),
        };
        setStatsData(stats);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    const handleClickOutside = (event: any) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setSelectedCampaign(null);
      }
      if (showBulkActionMenu && event.target.id !== "bulk-action-button") {
        setShowBulkActionMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pagination.page, pagination.limit]);

  const changePage = (newPage: any) => {
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
        campaign.subtitle?.toLowerCase().includes(lowercaseQuery)
    );

    applyFilters(filters, filtered);
  };

  const applyFilters = (newFilters, items = campaigns) => {
    setFilters(newFilters);

    let filtered = [...items];

    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter((c) => newFilters.status.includes(c.status));
    }

    if (newFilters.category) {
      filtered = filtered.filter((c) => c.category === newFilters.category);
    }

    if (newFilters.dateRange !== "all") {
      const daysMap = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };

      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
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
        case "amount_high":
          filtered.sort(
            (a, b) => parseFloat(b.raisedAmount) - parseFloat(a.raisedAmount)
          );
          break;
        case "amount_low":
          filtered.sort(
            (a, b) => parseFloat(a.raisedAmount) - parseFloat(b.raisedAmount)
          );
          break;
        case "goal_high":
          filtered.sort(
            (a, b) => parseFloat(b.goalAmount) - parseFloat(a.goalAmount)
          );
          break;
        case "progress_high":
          filtered.sort((a, b) => b.progress - a.progress);
          break;
        case "end_date":
          filtered.sort(
            (a, b) =>
              new Date(a.endDate || "2099-12-31").getTime() -
              new Date(b.endDate || "2099-12-31").getTime()
          );
          break;
        default:
          break;
      }
    }

    setFilteredCampaigns(filtered);
    setSelectedCampaigns([]);
  };

  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: [],
      category: "",
      dateRange: "all",
      amountRange: "all",
      sortBy: "newest",
    };

    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredCampaigns(campaigns);
  };

  const handleExport = () => {
    toast.success("Campaign data exported successfully");
  };

  const toggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaigns((prev) => {
      if (prev.includes(campaignId)) {
        return prev.filter((id) => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  const refreshData = async () => {
    setIsFetching(true);
    try {
      const response = await fundraiserService.getCampaigns(
        pagination.page,
        pagination.limit
      );

      const campaignsWithProgress = response.data.map((campaign) => ({
        ...campaign,
        progress: calculateProgress(campaign.raisedAmount, campaign.goalAmount),
      }));

      setCampaigns(campaignsWithProgress);
      setFilteredCampaigns(campaignsWithProgress);
      setPagination(response.pagination);

      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleViewCampaign = (id: string) => {
    navigate(`/admin/fundraising/campaigns/${id}`);
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
            <span className="mr-4 bg-gradient-to-br from-[#FF6B81] to-[#B75BFF] w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <Gift className="text-white" size={20} />
            </span>
            Campaigns
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-14">
            Manage and monitor all fundraising campaigns
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
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </motion.button>
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
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Pending Approval
            </p>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.pending}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Awaiting review
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Active Campaigns
            </p>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.active}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Currently active fundraisers
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Completed
            </p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.completed}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Successful campaigns
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Raised
            </p>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B81]/20 to-[#B75BFF]/20 flex items-center justify-center text-[#FF6B81]">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]">
            {isLoading
              ? "..."
              : `Kes ${statsData.totalRaised.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Funds collected across all campaigns
          </p>
        </motion.div>
      </motion.div>

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
              placeholder="Search campaigns by title, description, category..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-transparent transition-all shadow-sm"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "pending_approval",
                        "active",
                        "approved",
                        "completed",
                        "rejected",
                      ].map((status) => (
                        <label
                          key={status}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              const newStatus = e.target.checked
                                ? [...filters.status, status]
                                : filters.status.filter((s) => s !== status);
                              handleFilterChange({
                                ...filters,
                                status: newStatus,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {status.replace(/_/g, " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
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
                      Date Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
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
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.amountRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          amountRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; $10,000)</option>
                      <option value="medium">Medium ($10,000 - $50,000)</option>
                      <option value="large">Large (&gt; $50,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
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
                      <option value="amount_high">Highest Amount Raised</option>
                      <option value="amount_low">Lowest Amount Raised</option>
                      <option value="goal_high">Highest Goal</option>
                      <option value="progress_high">
                        Progress (High to Low)
                      </option>
                      <option value="end_date">End Date (Soonest)</option>
                    </select>
                  </div>

                  <div className="lg:col-span-5 flex justify-end">
                    <motion.button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 text-[#FF6B81] dark:text-[#FF6B81] bg-[#FF6B81]/5 hover:bg-[#FF6B81]/10 rounded-xl text-sm transition-colors"
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

      <motion.div
        className="flex items-center justify-between mb-5 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <Gift size={14} className="mr-2 text-[#FF6B81]" />
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
            {filteredCampaigns.length}
          </span>
          {filteredCampaigns.length !== pagination.total && (
            <>
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
                {pagination.total}
              </span>
            </>
          )}
          campaigns
          {selectedCampaigns.length > 0 && (
            <span className="ml-2">({selectedCampaigns.length} selected)</span>
          )}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={36} className="text-[#FF6B81] animate-spin mr-4" />
          <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Loading campaigns...
          </span>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm py-16 px-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-700 rounded-full mb-5">
            <Gift size={28} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
            No campaigns found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <motion.button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-[#FF6B81]/10 text-[#FF6B81] rounded-xl text-sm hover:bg-[#FF6B81]/20 transition-colors shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Clear filters
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.3,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  className={`p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all ${
                    selectedCampaigns.includes(campaign.id)
                      ? "bg-[#FF6B81]/5"
                      : ""
                  }`}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleViewCampaign(campaign.id)}
                  custom={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="mr-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] w-5 h-5 focus:ring-[#FF6B81]/50"
                            checked={selectedCampaigns.includes(campaign.id)}
                            onChange={() =>
                              toggleCampaignSelection(campaign.id)
                            }
                          />
                        </label>
                      </div>

                      <div
                        className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl bg-center bg-cover mr-4 relative overflow-hidden shadow-md"
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
                        <div className="flex items-center mb-2">
                          <StatusBadge status={campaign.status} />
                        </div>

                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1.5 line-clamp-1">
                          {campaign.title}
                        </h3>

                        <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1.5" />
                            {campaign.endDate
                              ? format(
                                  new Date(campaign.endDate),
                                  "MMM d, yyyy"
                                )
                              : "No end date"}
                          </span>

                          {campaign.category && (
                            <span className="capitalize px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-medium">
                              {campaign.category}
                            </span>
                          )}

                          <span className="flex items-center">
                            <ThumbsUp size={12} className="mr-1.5" />
                            {campaign.likesCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center ml-0 md:ml-auto md:space-x-5">
                      <div className="mb-3 md:mb-0 md:w-40">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                          <span className="font-medium">
                            Kes{" "}
                            {parseFloat(campaign.raisedAmount).toLocaleString(
                              undefined,
                              { maximumFractionDigits: 2 }
                            )}
                          </span>
                          <span className="font-medium">
                            {campaign.progress}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                          of Kes{" "}
                          {parseFloat(campaign.goalAmount).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {pagination.total > pagination.limit && (
            <div className="flex justify-center items-center mt-10 space-x-3">
              <motion.button
                className={`p-2.5 rounded-xl border ${
                  pagination.page === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#FF6B81]/30"
                } shadow-sm transition-all`}
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                whileHover={pagination.page !== 1 ? { scale: 1.05, y: -2 } : {}}
                whileTap={pagination.page !== 1 ? { scale: 0.95 } : {}}
              >
                <ArrowLeft size={18} />
              </motion.button>

              {[
                ...Array(
                  Math.min(5, Math.ceil(pagination.total / pagination.limit))
                ),
              ].map((_, i) => {
                let pageNum;
                const totalPages = Math.ceil(
                  pagination.total / pagination.limit
                );

                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <motion.button
                      key={pageNum}
                      className={`w-10 h-10 rounded-xl ${
                        pagination.page === pageNum
                          ? "bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      } transition-all`}
                      onClick={() => changePage(pageNum)}
                      whileHover={
                        pagination.page !== pageNum
                          ? { scale: 1.05, y: -2 }
                          : {}
                      }
                      whileTap={{ scale: 0.95 }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                }
                return null;
              })}

              <motion.button
                className={`p-2.5 rounded-xl border ${
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.limit)
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#FF6B81]/30"
                } shadow-sm transition-all`}
                onClick={() => changePage(pagination.page + 1)}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.limit)
                }
                whileHover={
                  pagination.page <
                  Math.ceil(pagination.total / pagination.limit)
                    ? { scale: 1.05, y: -2 }
                    : {}
                }
                whileTap={
                  pagination.page <
                  Math.ceil(pagination.total / pagination.limit)
                    ? { scale: 0.95 }
                    : {}
                }
              >
                <ArrowRight size={18} />
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
