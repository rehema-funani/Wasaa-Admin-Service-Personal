import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Download,
  ChevronDown,
  ArrowUpRight,
  Clock,
  Gift,
  Zap,
  AlertTriangle,
  Settings,
  BarChart2,
  Eye,
  Flag,
  UserCheck,
  CreditCard,
  RefreshCw,
  Loader,
  CheckCircle,
  PiggyBank,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";
import { useNavigate } from "react-router-dom";

const FundraisingDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    category: "",
    dateRange: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [view, setView] = useState("active");
  const [stats, setStats] = useState({
    campaigns: {
      total: 0,
      pending: 0,
      active: 0,
      completed: 0,
    },
    payouts: {
      total: 0,
      pending: 0,
      approved: 0,
    },
    donations: {
      total: 0,
    },
    revenue: {
      totalRaised: 0,
      platformFees: 0,
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await fundraiserService.getDashboardStats();
        const res = await fundraiserService.getCampaigns(1, 4);
        setStats(response.data);
        setCampaigns(res.data);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(campaigns);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(lowercaseQuery) ||
        campaign.creator.name.toLowerCase().includes(lowercaseQuery) ||
        campaign.location.toLowerCase().includes(lowercaseQuery) ||
        campaign.category.toLowerCase().includes(lowercaseQuery)
    );

    setSearchResults(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    let filtered = [...campaigns];

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
      filtered = filtered.filter((c) => new Date(c.startDate) >= cutoffDate);
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(lowercaseQuery) ||
          campaign.creator.name.toLowerCase().includes(lowercaseQuery) ||
          campaign.location.toLowerCase().includes(lowercaseQuery) ||
          campaign.category.toLowerCase().includes(lowercaseQuery)
      );
    }

    setSearchResults(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      category: "",
      dateRange: "all",
    });
    setSearchResults(campaigns);
  };

  const handleExport = () => {
    toast.success("Dashboard data exported successfully");
  };

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const getViewCampaigns = () => {
    switch (view) {
      case "active":
        return searchResults.filter((c) => c.status === "active").slice(0, 8);
      case "pending":
        return searchResults
          .filter((c) => c.status === "pending_review")
          .slice(0, 8);
      case "completed":
        return searchResults
          .filter((c) => c.status === "completed")
          .slice(0, 8);
      case "all":
      default:
        return searchResults.slice(0, 8);
    }
  };

  const viewCampaigns = getViewCampaigns();

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
            Fundraising Dashboard
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Overview of all fundraising campaigns and activities
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Gift size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.total.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            All campaigns
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.pending.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Awaiting review
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Active Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.active.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Currently active
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Completed Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.completed.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Successfully completed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Donations
            </p>
            <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.donations.total.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Total donations received
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Raised
            </p>
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            Kes {isLoading ? "..." : stats.revenue.totalRaised.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Across all campaigns
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Platform Fees
            </p>
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <PiggyBank size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            Kes{" "}
            {isLoading ? "..." : stats.revenue.platformFees.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Platform commission
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Payouts
            </p>
            <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <CreditCard size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.payouts.total.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            All payout requests
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending Payouts
            </p>
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.payouts.pending.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Awaiting approval
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Approved Payouts
            </p>
            <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.payouts.approved.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Successfully processed
          </p>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns by title, creator, location..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

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
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["active", "completed", "draft", "pending_review"].map(
                        (status) => (
                          <label
                            key={status}
                            className="inline-flex items-center"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 mr-1.5"
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
                            <span className="text-sm text-slate-600 dark:text-gray-400 capitalize mr-2">
                              {status.replace("_", " ")}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">All Categories</option>
                      {[
                        "Medical",
                        "Education",
                        "Disaster Relief",
                        "Community",
                        "Arts",
                        "Sports",
                      ].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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

                  <div className="md:col-span-3 flex justify-end">
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

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader size={30} className="text-primary-500 animate-spin mr-3" />
          <span className="text-slate-500 dark:text-gray-400">
            Loading dashboard data...
          </span>
        </div>
      ) : (
        <>
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Campaigns
                </h2>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-gray-700">
                {campaigns.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-gray-700 rounded-full mb-4">
                      <Gift
                        size={24}
                        className="text-slate-400 dark:text-gray-500"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-2">
                      No campaigns found
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  campaigns.map((campaign) => {
                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case "active":
                          return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800";
                        case "completed":
                          return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800";
                        case "draft":
                          return "bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 border border-slate-100 dark:border-slate-800";
                        case "pending_review":
                          return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800";
                        default:
                          return "bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 border border-slate-100 dark:border-slate-800";
                      }
                    };

                    return (
                      <motion.div
                        key={campaign.id}
                        className="flex flex-col md:flex-row md:items-center p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex-grow mb-4 md:mb-0">
                          <div className="flex flex-col md:flex-row md:items-center">
                            <div className="flex items-start md:items-center mb-4 md:mb-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-medium text-sm mr-3">
                                {campaign.category
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>

                              <div className="flex-grow">
                                <h3 className="font-medium text-slate-900 dark:text-white text-md mb-1 pr-8 md:pr-0">
                                  {campaign.title}
                                </h3>
                                <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-gray-400 gap-2">
                                  <span className="flex items-center">
                                    <Users size={12} className="mr-1" />
                                    {campaign.donorsCount} donors
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    {format(
                                      new Date(campaign.endDate),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                  <span className="flex items-center">
                                    <TrendingUp size={12} className="mr-1" />
                                    Kes {campaign.raisedAmount.toLocaleString()}{" "}
                                    raised
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center ml-0 md:ml-auto space-x-3">
                              <div className="min-w-[100px] md:text-center">
                                <p className="text-xs text-slate-600 dark:text-gray-400">
                                  {campaign.raisedAmount}% of Kes{" "}
                                  {campaign.goalAmount.toLocaleString()}
                                </p>
                              </div>

                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                                  campaign.status
                                )}`}
                              >
                                {campaign.status.replace("_", " ")}
                              </span>

                              <div className="flex items-center">
                                {campaign.status === "active" ? (
                                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                                    <UserCheck size={12} className="mr-1" />
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-0 md:ml-4">
                          <button
                            className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                            onClick={() =>
                              navigate(
                                `/admin/fundraising/campaigns/${campaign.id}`
                              )
                            }
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-gray-700 flex justify-center">
                <button
                  className="text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center"
                  onClick={() => navigate("/admin/fundraising/campaigns")}
                >
                  View All Campaigns
                  <ArrowUpRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Recent Transactions
                </h2>
                <button
                  className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                  onClick={() =>
                    toast.success("Navigating to transactions page")
                  }
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-gray-700">
                {recentTransactions.map((transaction) => {
                  const getTransactionIcon = (type) => {
                    switch (type) {
                      case "donation":
                        return <Gift className="text-emerald-500" size={18} />;
                      case "withdrawal":
                        return (
                          <CreditCard className="text-blue-500" size={18} />
                        );
                      case "refund":
                        return (
                          <RefreshCw className="text-amber-500" size={18} />
                        );
                      default:
                        return (
                          <DollarSign className="text-slate-500" size={18} />
                        );
                    }
                  };

                  const getTransactionColor = (type) => {
                    switch (type) {
                      case "donation":
                        return "text-emerald-600 dark:text-emerald-400";
                      case "withdrawal":
                        return "text-blue-600 dark:text-blue-400";
                      case "refund":
                        return "text-amber-600 dark:text-amber-400";
                      default:
                        return "text-slate-600 dark:text-gray-400";
                    }
                  };

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        {getTransactionIcon(transaction.type)}
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {transaction.type === "donation"
                              ? "Donation to"
                              : transaction.type === "withdrawal"
                              ? "Withdrawal from"
                              : "Refund for"}
                          </p>
                          <p
                            className={`font-medium ${getTransactionColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type === "donation" ? "+" : "-"}$
                            {transaction.amount.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex justify-between text-xs mt-1">
                          <div className="text-slate-500 dark:text-gray-400">
                            <span className="truncate max-w-[180px]">
                              {transaction.campaignTitle}
                            </span>
                            <span className="mx-1">•</span>
                            <span>
                              {format(
                                new Date(transaction.createdAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>

                          <span
                            className={`${
                              transaction.status === "completed"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {transaction.status === "completed"
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Campaign Performance
                </h2>
                <button
                  className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                  onClick={() => toast.success("Navigating to analytics page")}
                >
                  Full Analytics
                </button>
              </div>

              <div className="p-4 flex flex-col items-center justify-center h-[350px]">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <BarChart2 size={24} className="text-primary-500" />
                </div>
                <p className="text-slate-900 dark:text-white text-lg font-medium mb-2">
                  Analytics Module
                </p>
                <p className="text-slate-500 dark:text-gray-400 text-center max-w-md mb-6">
                  This module would display campaign performance metrics,
                  conversion rates, and donation trends.
                </p>
                <button
                  className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  onClick={() => toast.success("Configuring analytics module")}
                >
                  Configure Analytics
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default FundraisingDashboard;
