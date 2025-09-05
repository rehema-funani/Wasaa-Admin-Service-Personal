import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  Download,
  ChevronDown,
  ArrowUpRight,
  Eye,
  Flag,
  Clock,
  Gift,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  Shield,
  CheckCircle,
  ThumbsDown,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CampaignsList = ({ campaigns, isLoading, setShowReportModal }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    category: "",
    dateRange: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [view, setView] = useState("active");

  const navigate = useNavigate();

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

  const handleFilterChange = (newFilters) => {
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

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
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
          <div className="animate-spin mr-3 w-6 h-6 border-2 border-gray-500 border-t-primary-500 rounded-full"></div>
          <span className="text-slate-500 dark:text-gray-400">
            Loading dashboard data...
          </span>
        </div>
      ) : (
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

              <div className="flex space-x-2">
                {/* Add report generation button */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                >
                  <FileText size={14} className="mr-1.5" />
                  Export Report
                </button>

                <div className="flex space-x-1">
                  <button
                    onClick={() => setView("all")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      view === "all"
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setView("active")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      view === "active"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setView("pending")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      view === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setView("completed")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      view === "completed"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
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
                  const getStatusBadge = (status) => {
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

                  // Random risk score for demo
                  const riskScore = Math.floor(Math.random() * 100);
                  const getRiskColor = (score) => {
                    if (score < 30)
                      return "text-emerald-600 dark:text-emerald-400";
                    if (score < 70) return "text-amber-600 dark:text-amber-400";
                    return "text-red-600 dark:text-red-400";
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
                              {campaign.category.substring(0, 2).toUpperCase()}
                            </div>

                            <div className="flex-grow">
                              <h3 className="font-medium text-slate-900 dark:text-white text-md mb-1 pr-8 md:pr-0 flex items-center">
                                {campaign.title}
                                {riskScore > 70 && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md flex items-center">
                                    <AlertTriangle size={10} className="mr-1" />
                                    High Risk
                                  </span>
                                )}
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

                                <span className="flex items-center">
                                  <Shield size={12} className="mr-1" />
                                  <span className={getRiskColor(riskScore)}>
                                    Risk: {riskScore}%
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center ml-0 md:ml-auto space-x-3">
                            <div className="min-w-[100px] md:text-center">
                              <p className="text-xs text-slate-600 dark:text-gray-400">
                                {Number(campaign.raisedAmount).toLocaleString(
                                  "KES"
                                )}{" "}
                                of Kes{" "}
                                {Number(campaign.goalAmount).toLocaleString(
                                  "KES"
                                )}
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
                                  <ShieldCheck size={12} className="mr-1" />
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

                      <div className="flex space-x-1 ml-0 md:ml-4">
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

                        {campaign.status === "pending_review" && (
                          <>
                            <button
                              className="p-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              onClick={() =>
                                toast.success(
                                  `Campaign ${campaign.id} approved`
                                )
                              }
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              onClick={() =>
                                toast.error(`Campaign ${campaign.id} rejected`)
                              }
                            >
                              <ThumbsDown size={18} />
                            </button>
                          </>
                        )}

                        {riskScore > 50 && (
                          <button
                            className="p-2 text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                            onClick={() =>
                              toast.success(
                                `Campaign ${campaign.id} escalated to compliance`
                              )
                            }
                          >
                            <Flag size={18} />
                          </button>
                        )}
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
      )}
    </>
  );
};

export default CampaignsList;
