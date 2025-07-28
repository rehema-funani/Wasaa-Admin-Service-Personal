import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  AlertTriangle,
  ChevronDown,
  Info,
  Edit,
  Clock,
  MoreVertical,
  Users,
  Globe,
  Languages,
  Sliders,
  Zap,
  User,
  X,
  Settings,
} from "lucide-react";
import { notificationService } from "../../../api/services/notification";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../../elements/StatusBadge";
import toast from "react-hot-toast";
import getActionButtons from "../../../elements/getActionButtons";

const BroadcastsPage = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("scheduledAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBroadcastDetail, setShowBroadcastDetail] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const navigate = useNavigate();

  const motion = {
    div: (props) => <div {...props} />,
    button: (props) => <button {...props} />,
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationService.getBroadcasts();
      setBroadcasts(response.broadcasts);
    } catch (err) {
      setError("Failed to fetch broadcasts. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (broadcast) => {
    setBroadcastToDelete(broadcast);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!broadcastToDelete) return;

    setIsDeleting(true);
    try {
      await notificationService.deleteBroadcast(broadcastToDelete.id);
      setBroadcasts(broadcasts.filter((b) => b.id !== broadcastToDelete.id));
      setShowDeleteModal(false);
      setBroadcastToDelete(null);
      toast.success("Broadcast deleted successfully");
    } catch (err) {
      toast.error("Failed to delete broadcast");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBroadcastToDelete(null);
  };

  const handleActionClick = async (action, id) => {
    try {
      let actionText = "";
      let response;

      switch (action) {
        case "execute":
          response = await notificationService.executeBroadcast(id);
          actionText = "executed";
          break;
        case "pause":
          response = await notificationService.pauseBroadcast(id);
          actionText = "paused";
          break;
        case "resume":
          response = await notificationService.resumeBroadcast(id);
          actionText = "resumed";
          break;
        default:
          return;
      }

      fetchBroadcasts();
      toast.success(`Broadcast ${actionText} successfully`);
    } catch (err) {
      toast.error("Action failed");
      console.error(err);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "email":
        return <Mail size={16} className="text-indigo-500" />;
      case "sms":
        return <MessageSquare size={16} className="text-emerald-500" />;
      case "push":
        return <Bell size={16} className="text-amber-500" />;
      default:
        return <Mail size={16} className="text-neutral-400" />;
    }
  };

  const getChannelBackground = (channel) => {
    switch (channel) {
      case "email":
        return "bg-indigo-50 dark:bg-indigo-900/30";
      case "sms":
        return "bg-emerald-50 dark:bg-emerald-900/30";
      case "push":
        return "bg-amber-50 dark:bg-amber-900/30";
      default:
        return "bg-neutral-50 dark:bg-neutral-800/50";
    }
  };

  const getChannelAccent = (channel) => {
    switch (channel) {
      case "email":
        return "border-indigo-500 dark:border-indigo-400";
      case "sms":
        return "border-emerald-500 dark:border-emerald-400";
      case "push":
        return "border-amber-500 dark:border-amber-400";
      default:
        return "border-neutral-300 dark:border-neutral-700";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20 rounded-md">
            <Zap size={10} className="mr-1" />
            High
          </span>
        );
      case "normal":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
            Normal
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressBar = (broadcast) => {
    if (!broadcast.sentCount || !broadcast.totalCount) return null;

    const progress = (broadcast.sentCount / broadcast.totalCount) * 100;

    let progressColor;
    if (broadcast.status === "failed") {
      progressColor = "bg-rose-500";
    } else if (broadcast.status === "completed") {
      progressColor = "bg-emerald-500";
    } else if (broadcast.status === "paused") {
      progressColor = "bg-purple-500";
    } else {
      progressColor = "bg-indigo-500";
    }

    return (
      <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 mt-2">
        <div
          className={`h-1.5 rounded-full ${progressColor}`}
          style={{ width: `${progress}%` }}
        ></div>
        <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
          {broadcast.sentCount.toLocaleString()} /{" "}
          {broadcast.totalCount.toLocaleString()} ({Math.round(progress)}%)
        </div>
      </div>
    );
  };

  // Updated Status Badge with more fintech style
  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Draft
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30">
            <Calendar size={10} className="mr-1" />
            Scheduled
          </span>
        );
      case "sending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/30">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5 animate-pulse"></div>
            Sending
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/30">
            Paused
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/30">
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700/30">
            <AlertTriangle size={10} className="mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-200 dark:border-slate-700">
          <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={28} className="text-rose-500" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-3 text-center">
            Something went wrong
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-5 text-center">
            {error}
          </p>
          <button
            onClick={fetchBroadcasts}
            className="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              Broadcast Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage targeted communication campaigns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/admin/communication/broadcasts/add")}
              className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
              disabled={isLoading}
            >
              <Plus size={16} className="mr-1.5" />
              New Broadcast
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 -mt-6">
        {/* Search and Filters Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 min-w-0">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search broadcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 items-center bg-slate-100 dark:bg-slate-700/70 rounded-lg p-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === "all"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("draft")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === "draft"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => setStatusFilter("scheduled")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === "scheduled"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => setStatusFilter("sending")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === "sending"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Active
                </button>
              </div>

              <div className="inline-flex h-10 items-center bg-slate-100 dark:bg-slate-700/70 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  List
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10 px-3.5 bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center"
                >
                  <Filter
                    size={16}
                    className="text-slate-600 dark:text-slate-300 mr-2"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    Advanced Filters
                  </span>
                  <ChevronDown
                    size={14}
                    className={`ml-1.5 text-slate-500 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showFilters && (
                  <div className="absolute top-full mt-1 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 w-60 z-20">
                    <h3 className="text-xs font-medium text-slate-900 dark:text-white mb-2">
                      Channel
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setChannelFilter("all")}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs ${
                          channelFilter === "all"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        All Channels
                      </button>
                      <button
                        onClick={() => setChannelFilter("email")}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center ${
                          channelFilter === "email"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <Mail size={14} className="mr-2" />
                        Email
                      </button>
                      <button
                        onClick={() => setChannelFilter("sms")}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center ${
                          channelFilter === "sms"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <MessageSquare size={14} className="mr-2" />
                        SMS
                      </button>
                      <button
                        onClick={() => setChannelFilter("push")}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center ${
                          channelFilter === "push"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <Bell size={14} className="mr-2" />
                        Push
                      </button>
                    </div>

                    <h3 className="text-xs font-medium text-slate-900 dark:text-white mt-4 mb-2">
                      Sort By
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          if (sortBy === "scheduledAt") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setSortBy("scheduledAt");
                            setSortOrder("desc");
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between ${
                          sortBy === "scheduledAt"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1.5" />
                          Schedule Date
                        </div>
                        {sortBy === "scheduledAt" && (
                          <ChevronDown
                            size={14}
                            className={`${
                              sortOrder === "asc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (sortBy === "priority") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setSortBy("priority");
                            setSortOrder("desc");
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between ${
                          sortBy === "priority"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <Zap size={14} className="mr-1.5" />
                          Priority
                        </div>
                        {sortBy === "priority" && (
                          <ChevronDown
                            size={14}
                            className={`${
                              sortOrder === "asc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-xs font-medium transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Loading broadcasts...
            </p>
          </div>
        ) : broadcasts?.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-5">
                {channelFilter === "email" ? (
                  <Mail size={32} className="text-indigo-500" />
                ) : channelFilter === "sms" ? (
                  <MessageSquare size={32} className="text-emerald-500" />
                ) : channelFilter === "push" ? (
                  <Bell size={32} className="text-amber-500" />
                ) : (
                  <Settings size={32} className="text-slate-500" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No broadcasts found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                {searchQuery
                  ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                  : "Get started by creating your first broadcast to communicate with your users."}
              </p>
              <button
                onClick={() => navigate("/admin/communication/broadcasts/add")}
                className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Create New Broadcast
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {broadcasts?.map((broadcast) => (
              <div
                key={broadcast.id}
                className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 border-t border-r border-b border-slate-200 dark:border-slate-700 hover:border-l-4 hover:border-t hover:border-r hover:border-b hover:scale-[1.01] transform-gpu"
                style={{
                  borderLeftColor:
                    broadcast.channel === "email"
                      ? "#6366f1"
                      : broadcast.channel === "sms"
                      ? "#10b981"
                      : "#f59e0b",
                }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg ${getChannelBackground(
                          broadcast.channel
                        )}`}
                      >
                        {getChannelIcon(broadcast.channel)}
                      </div>
                      <div className="ml-3">
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {broadcast.channel}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          {getStatusBadge(broadcast.status)}
                          {broadcast.priority &&
                            getPriorityBadge(broadcast.priority)}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBroadcastDetail(
                            showBroadcastDetail === broadcast.id
                              ? null
                              : broadcast.id
                          );
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {showBroadcastDetail === broadcast.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-10">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/communication/broadcasts/edit/${broadcast.id}`,
                                {
                                  state: { broadcast },
                                }
                              )
                            }
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
                            disabled={
                              broadcast.status === "sending" ||
                              broadcast.status === "completed"
                            }
                          >
                            <Edit size={14} className="mr-2" />
                            Edit Broadcast
                          </button>
                          <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                          <button
                            onClick={() => handleDeleteClick(broadcast)}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center"
                            disabled={broadcast.status === "sending"}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete Broadcast
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() =>
                      navigate(
                        `/admin/communication/broadcasts/edit/${broadcast.id}`,
                        { state: { broadcast } }
                      )
                    }
                    className="cursor-pointer"
                  >
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5 line-clamp-1">
                        {broadcast.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {broadcast.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 my-3"></div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Template
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {broadcast.template_code}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Scheduled For
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center">
                          <Clock size={12} className="mr-1.5 text-slate-400" />
                          <span className="font-mono">
                            {formatDate(broadcast.scheduled_at)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3.5 mb-4">
                      <h4 className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center">
                        <Users size={14} className="mr-1.5" />
                        Audience Targeting
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <User size={14} className="text-slate-400 mr-1.5" />
                          <span className="text-slate-700 dark:text-slate-300 truncate capitalize">
                            {broadcast.audience?.gender || "All"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Globe size={14} className="text-slate-400 mr-1.5" />
                          <span className="text-slate-700 dark:text-slate-300 truncate">
                            {broadcast.audience?.country || "Global"}
                          </span>
                        </div>
                        {broadcast.audience?.kyc_level && (
                          <div className="flex items-center">
                            <Languages
                              size={14}
                              className="text-slate-400 mr-1.5"
                            />
                            <span className="text-slate-700 dark:text-slate-300 truncate">
                              {broadcast.audience.kyc_level}
                            </span>
                          </div>
                        )}
                        {broadcast.audience?.customFilters &&
                          Object.keys(broadcast.audience.customFilters).length >
                            0 && (
                            <div className="flex items-center">
                              <Sliders
                                size={14}
                                className="text-indigo-400 mr-1.5"
                              />
                              <span className="text-indigo-500 dark:text-indigo-400 text-xs">
                                Custom filters
                              </span>
                            </div>
                          )}
                      </div>
                    </div>

                    {broadcast.sentCount && broadcast.totalCount && (
                      <div className="mb-4">{getProgressBar(broadcast)}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-1.5">
                    {getActionButtons(broadcast, handleActionClick)}

                    <motion.button
                      onClick={() =>
                        navigate(
                          `/admin/communication/broadcasts/edit/${broadcast.id}`,
                          {
                            state: { broadcast },
                          }
                        )
                      }
                      className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-md transition-all"
                      title="Edit"
                      disabled={
                        broadcast.status === "sending" ||
                        broadcast.status === "completed"
                      }
                    >
                      <Edit size={16} />
                    </motion.button>

                    <motion.button
                      onClick={() => handleDeleteClick(broadcast)}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-md transition-all"
                      title="Delete"
                      disabled={isLoading || broadcast.status === "sending"}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Broadcast
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {broadcasts?.map((broadcast) => (
                    <tr
                      key={broadcast.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      onClick={() =>
                        navigate(
                          `/admin/communication/broadcasts/edit/${broadcast.id}`,
                          { state: { broadcast } }
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="ml-3">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {broadcast.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {broadcast.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-md flex items-center justify-center ${getChannelBackground(
                              broadcast.channel
                            )}`}
                          >
                            {getChannelIcon(broadcast.channel)}
                          </div>
                          <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 capitalize">
                            {broadcast.channel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(broadcast.status)}
                        <div className="mt-1">
                          {broadcast.priority &&
                            getPriorityBadge(broadcast.priority)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                          {formatDate(broadcast.scheduled_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 w-48">
                        {broadcast.sentCount !== undefined &&
                        broadcast.totalCount ? (
                          <div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  broadcast.status === "failed"
                                    ? "bg-rose-500"
                                    : broadcast.status === "completed"
                                    ? "bg-emerald-500"
                                    : broadcast.status === "paused"
                                    ? "bg-purple-500"
                                    : "bg-indigo-500"
                                }`}
                                style={{
                                  width: `${
                                    (broadcast.sentCount /
                                      broadcast.totalCount) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {Math.round(
                                (broadcast.sentCount / broadcast.totalCount) *
                                  100
                              )}
                              % • {broadcast.sentCount.toLocaleString()} of{" "}
                              {broadcast.totalCount.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Not started
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium w-32">
                        <div
                          className="flex items-center space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getActionButtons(broadcast, handleActionClick)}

                          <button
                            onClick={() => handleDeleteClick(broadcast)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded"
                            disabled={broadcast.status === "sending"}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <Info size={20} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                About Broadcast Management
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Broadcasts allow you to send targeted communications to specific
                segments of your audience. Schedule broadcasts in advance,
                select the appropriate channel, and track delivery progress. Use
                audience targeting to ensure your message reaches the right
                users at the right time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && broadcastToDelete && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white dark:bg-slate-800 max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle size={20} className="text-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white ml-3">
                  Delete Broadcast
                </h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`w-10 h-10 ${getChannelBackground(
                    broadcastToDelete.channel
                  )} rounded-lg flex items-center justify-center`}
                >
                  {getChannelIcon(broadcastToDelete.channel)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                    {broadcastToDelete.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {broadcastToDelete.channel} broadcast
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {broadcastToDelete.description}
              </p>
              <div className="mt-3 flex items-center">
                <Calendar
                  size={14}
                  className="text-slate-500 dark:text-slate-400 mr-1.5"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Scheduled for {formatDate(broadcastToDelete.scheduled_at)}
                </span>
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/10 rounded-lg p-4 mb-5">
              <h4 className="font-medium text-rose-600 dark:text-rose-400 text-sm mb-2 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Warning
              </h4>
              <div className="space-y-1.5 text-sm text-rose-600 dark:text-rose-300">
                <p className="flex items-start">
                  <span className="block w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500 mr-2 mt-1 flex-shrink-0"></span>
                  This action cannot be undone
                </p>
                <p className="flex items-start">
                  <span className="block w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500 mr-2 mt-1 flex-shrink-0"></span>
                  All scheduled delivery data will be lost
                </p>
                <p className="flex items-start">
                  <span className="block w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500 mr-2 mt-1 flex-shrink-0"></span>
                  Analytics for this broadcast will be deleted
                </p>
                {broadcastToDelete.status === "scheduled" && (
                  <p className="flex items-start font-medium">
                    <span className="block w-3 h-3 rounded-full bg-rose-500 mr-2 mt-1 flex-shrink-0"></span>
                    This broadcast is currently scheduled and will not be sent
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete Broadcast
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastsPage;
