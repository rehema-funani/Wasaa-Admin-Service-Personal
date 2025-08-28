import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Clock,
  X,
  Gift,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Zap,
  Loader,
  Star,
  DollarSign,
  Menu,
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

const calculateProgress = (raised: string, goal: string) => {
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
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  const handleFilterChange = (newFilters: any) => {
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

  const toggleCampaignSelection = (campaignId) => {
    setSelectedCampaigns((prev) => {
      if (prev.includes(campaignId)) {
        return prev.filter((id) => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(filteredCampaigns.map((c) => c.id));
    }
  };

  const handleDeleteCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const confirmDeleteCampaign = async () => {
    setIsFetching(true);
    try {
      // await fundraiserService.deleteCampaign(selectedCampaign.id);

      setCampaigns((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
      setFilteredCampaigns((prev) =>
        prev.filter((c) => c.id !== selectedCampaign.id)
      );
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));

      toast.success("Campaign deleted successfully");
    } catch (error) {
      toast.error("Failed to delete campaign");
      console.error("Error deleting campaign:", error);
    } finally {
      setIsFetching(false);
      setShowDeleteModal(false);
    }
  };

  const handleAction = (campaign: any, type: any) => {
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
        case "feature":
          // await fundraiserService.featureCampaign(selectedCampaign.id);
          successMessage = "Campaign featured successfully";
          break;
        default:
          successMessage = "Action completed successfully";
      }

      // Update UI optimistically
      const updatedCampaigns = campaigns.map((c) =>
        c.id === selectedCampaign.id
          ? {
              ...c,
              status:
                actionType === "approve"
                  ? "approved"
                  : actionType === "reject"
                  ? "rejected"
                  : c.status,
              featured: actionType === "feature" ? true : c.featured,
            }
          : c
      );

      setCampaigns(updatedCampaigns);
      setFilteredCampaigns(
        updatedCampaigns.filter((c) =>
          filteredCampaigns.some((fc) => fc.id === c.id)
        )
      );

      toast.success(successMessage);
    } catch (error) {
      toast.error(`Failed to ${actionType} campaign`);
      console.error(`Error during ${actionType}:`, error);
    } finally {
      setIsFetching(false);
      setShowActionModal(false);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedCampaigns.length === 0) {
      toast.error("No campaigns selected");
      return;
    }

    setIsFetching(true);

    setTimeout(() => {
      switch (action) {
        case "approve":
          toast.success(`${selectedCampaigns.length} campaigns approved`);
          setCampaigns((prev) =>
            prev.map((c) =>
              selectedCampaigns.includes(c.id)
                ? { ...c, status: "approved" }
                : c
            )
          );
          break;
        case "feature":
          toast.success(`${selectedCampaigns.length} campaigns featured`);
          setCampaigns((prev) =>
            prev.map((c) =>
              selectedCampaigns.includes(c.id) ? { ...c, featured: true } : c
            )
          );
          break;
        case "reject":
          toast.success(`${selectedCampaigns.length} campaigns rejected`);
          setCampaigns((prev) =>
            prev.map((c) =>
              selectedCampaigns.includes(c.id)
                ? { ...c, status: "rejected" }
                : c
            )
          );
          break;
        case "delete":
          toast.success(`${selectedCampaigns.length} campaigns deleted`);
          setCampaigns((prev) =>
            prev.filter((c) => !selectedCampaigns.includes(c.id))
          );
          setFilteredCampaigns((prev) =>
            prev.filter((c) => !selectedCampaigns.includes(c.id))
          );
          setPagination((prev) => ({
            ...prev,
            total: prev.total - selectedCampaigns.length,
          }));
          break;
        case "export":
          toast.success(`${selectedCampaigns.length} campaigns exported`);
          break;
        default:
          break;
      }

      setSelectedCampaigns([]);
      setShowBulkActionMenu(false);
      setIsFetching(false);
    }, 800);
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

  const handleViewCampaign = (campaignId: string) => {
    navigate(`/admin/fundraising/campaigns/${campaignId}`);
  };

  const handleEditCampaign = (campaignId: string) => {
    navigate(`/admin/fundraising/campaigns/${campaignId}/edit`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        delay: i * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 w-full mx-auto max-w-[1600px]"
    >
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Gift className="mr-3 text-[#FF6B81]" />
            Campaigns
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage and monitor all fundraising campaigns
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <motion.button
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
          whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Pending Approval
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.pending}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Awaiting review
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
          whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Active Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.active}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Currently active fundraisers
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
          whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Completed
            </p>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.completed}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Successful campaigns
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
          whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Raised
            </p>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B81]/20 to-[#B75BFF]/20 flex items-center justify-center text-[#FF6B81]">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading
              ? "..."
              : `$${statsData.totalRaised.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Funds collected across all campaigns
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns by title, description, category..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B81] focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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

            {selectedCampaigns.length > 0 && (
              <div className="relative">
                <button
                  id="bulk-action-button"
                  onClick={() => setShowBulkActionMenu(!showBulkActionMenu)}
                  className="px-4 py-2.5 bg-[#FF6B81]/10 text-[#FF6B81] border border-[#FF6B81]/20 rounded-xl flex items-center text-sm hover:bg-[#FF6B81]/20 transition-colors"
                >
                  <Menu size={16} className="mr-2" />
                  <span>Bulk Actions ({selectedCampaigns.length})</span>
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform ${
                      showBulkActionMenu ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {showBulkActionMenu && (
                  <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl py-1 border border-gray-100 dark:border-gray-700">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#FF6B81]/10 hover:text-[#FF6B81] flex items-center"
                      onClick={() => handleBulkAction("approve")}
                    >
                      <CheckCircle size={14} className="inline mr-2" />
                      Approve Selected
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#FF6B81]/10 hover:text-[#FF6B81] flex items-center"
                      onClick={() => handleBulkAction("feature")}
                    >
                      <Star size={14} className="inline mr-2" />
                      Feature Selected
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#FF6B81]/10 hover:text-[#FF6B81] flex items-center"
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download size={14} className="inline mr-2" />
                      Export Selected
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <Trash2 size={14} className="inline mr-2" />
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
            )}
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
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81] transition-all"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81] transition-all"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Goal Amount
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81] transition-all"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81] transition-all"
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

                  <div className="lg:col-span-4 flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-[#FF6B81] transition-colors"
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

      <motion.div
        className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400"
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

        {filteredCampaigns.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="text-[#FF6B81] hover:underline text-xs font-medium"
          >
            {selectedCampaigns.length === filteredCampaigns.length
              ? "Deselect All"
              : "Select All"}
          </button>
        )}
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={30} className="text-[#FF6B81] animate-spin mr-3" />
          <span className="text-gray-500 dark:text-gray-400">
            Loading campaigns...
          </span>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm py-12 px-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <Gift size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#FF6B81]/10 text-[#FF6B81] rounded-lg text-sm hover:bg-[#FF6B81]/20 transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    selectedCampaigns.includes(campaign.id)
                      ? "bg-[#FF6B81]/5"
                      : ""
                  }`}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  custom={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="mr-3">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] w-5 h-5 focus:ring-[#FF6B81]"
                            checked={selectedCampaigns.includes(campaign.id)}
                            onChange={() =>
                              toggleCampaignSelection(campaign.id)
                            }
                          />
                        </label>
                      </div>

                      <div
                        className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg bg-center bg-cover mr-3 relative overflow-hidden"
                        style={{
                          backgroundImage: `url(${
                            campaign.images && campaign.images.length > 0
                              ? campaign.images[0]
                              : getPlaceholderImage(campaign.title, campaign.id)
                          })`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center mb-1">
                          <StatusBadge status={campaign.status} />
                        </div>

                        <h3 className="font-medium text-gray-900 dark:text-white text-md mb-1 line-clamp-1">
                          {campaign.title}
                        </h3>

                        <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {campaign.endDate
                              ? format(
                                  new Date(campaign.endDate),
                                  "MMM d, yyyy"
                                )
                              : "No end date"}
                          </span>

                          {campaign.category && (
                            <span className="capitalize px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                              {campaign.category}
                            </span>
                          )}

                          <span className="flex items-center">
                            <ThumbsUp size={12} className="mr-1" />
                            {campaign.likesCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center ml-0 md:ml-auto md:space-x-4">
                      <div className="mb-3 md:mb-0 md:w-36">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>
                            $
                            {parseFloat(campaign.raisedAmount).toLocaleString(
                              undefined,
                              { maximumFractionDigits: 2 }
                            )}
                          </span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF]"
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                          of $
                          {parseFloat(campaign.goalAmount).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        {campaign.status === "pending_approval" && (
                          <button
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#FF6B81] rounded-lg transition-colors"
                            onClick={() => handleAction(campaign, "approve")}
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#FF6B81] rounded-lg transition-colors"
                          onClick={() => handleViewCampaign(campaign.id)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#FF6B81] rounded-lg transition-colors"
                          onClick={() => handleEditCampaign(campaign.id)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                          onClick={() => handleDeleteCampaign(campaign)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {pagination.total > pagination.limit && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                className={`p-2 rounded-lg border ${
                  pagination.page === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ArrowLeft size={16} />
              </button>

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
                    <button
                      key={pageNum}
                      className={`w-9 h-9 rounded-lg ${
                        pagination.page === pageNum
                          ? "bg-[#FF6B81] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => changePage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}

              <button
                className={`p-2 rounded-lg border ${
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.limit)
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => changePage(pagination.page + 1)}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.limit)
                }
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showDeleteModal && selectedCampaign && (
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Delete Campaign
                </h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#FF6B81] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-4">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Confirm Deletion
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Are you sure you want to delete this campaign? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedCampaign.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>
                      Status: {selectedCampaign.status.replace(/_/g, " ")}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Goal: $
                      {parseFloat(selectedCampaign.goalAmount).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isFetching}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center"
                    onClick={confirmDeleteCampaign}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <>
                        <Loader size={14} className="animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} className="mr-2" />
                        Delete Campaign
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showActionModal && selectedCampaign && actionType && (
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowActionModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {actionType === "approve"
                    ? "Approve Campaign"
                    : actionType === "reject"
                    ? "Reject Campaign"
                    : actionType === "feature"
                    ? "Feature Campaign"
                    : "Confirm Action"}
                </h2>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#FF6B81] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      actionType === "approve"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : actionType === "reject"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    } flex items-center justify-center mr-4`}
                  >
                    {actionType === "approve" ? (
                      <CheckCircle size={20} />
                    ) : actionType === "reject" ? (
                      <XCircle size={20} />
                    ) : (
                      <Star size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {actionType === "approve"
                        ? "Approve this campaign?"
                        : actionType === "reject"
                        ? "Reject this campaign?"
                        : actionType === "feature"
                        ? "Feature this campaign?"
                        : "Confirm action"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {actionType === "approve"
                        ? "This will make the campaign visible to all users."
                        : actionType === "reject"
                        ? "This will notify the creator that their campaign was rejected."
                        : actionType === "feature"
                        ? "This will highlight the campaign on the homepage."
                        : "Are you sure you want to continue?"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedCampaign.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>
                      Status: {selectedCampaign.status.replace(/_/g, " ")}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Goal: $
                      {parseFloat(selectedCampaign.goalAmount).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowActionModal(false)}
                    disabled={isFetching}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      actionType === "reject"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-[#FF6B81] hover:bg-[#ff5673]"
                    } text-white rounded-lg text-sm transition-colors flex items-center`}
                    onClick={confirmAction}
                    disabled={isFetching}
                  >
                    {isFetching ? (
                      <>
                        <Loader size={14} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {actionType === "approve" ? (
                          <CheckCircle size={14} className="mr-2" />
                        ) : actionType === "reject" ? (
                          <XCircle size={14} className="mr-2" />
                        ) : (
                          <Star size={14} className="mr-2" />
                        )}
                        {actionType === "approve"
                          ? "Approve"
                          : actionType === "reject"
                          ? "Reject"
                          : actionType === "feature"
                          ? "Feature"
                          : "Confirm"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignsPage;
