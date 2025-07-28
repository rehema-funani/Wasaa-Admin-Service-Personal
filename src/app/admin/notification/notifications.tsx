import React, { useState, useEffect } from "react";
import {
  Bell,
  Filter,
  Search,
  Plus,
  Trash,
  Edit,
  Send,
  Clock,
  X,
  Sparkles,
  Zap,
  MessageSquare,
  FileText,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Command,
  Languages,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Mail,
  BellRing,
  CheckCircle,
  Eye,
  AlertCircle,
  Loader,
  Shield,
  ChevronDown,
} from "lucide-react";
import { notificationService } from "../../../api/services/notification";

interface Template {
  id: string;
  template_code: string;
  channel: string;
  language: string;
  content: string;
  placeholders: Record<string, string>;
  version: number;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NewTemplateData {
  template_code: string;
  channel: string;
  language: string;
  content: string;
  placeholders: Record<string, string>;
  description?: string;
}

interface Notification {
  id: string;
  user_id: string;
  channel: string;
  user_email: string | null;
  user_phone: string | null;
  origin_service: string;
  template_code_id: string;
  entity_id: string;
  entity_type: string;
  payload: Record<string, any>;
  status: string;
  attempts: number;
  read_receipt: boolean;
  priority: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  delivered_at?: string;
}

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<NewTemplateData>({
    template_code: "",
    channel: "sms",
    language: "en",
    content: "",
    placeholders: {},
  });
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("template_code");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsSortMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getTemplates();
      setTemplates(response);
      setFilteredTemplates(response);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotifications = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await notificationService.getNotifications({
        limit: 10,
        page,
        ...(search ? { search } : {}),
      });
      setNotifications(response.notifications);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async () => {
    try {
      const templatePayload = {
        template_code: newTemplate.template_code,
        channel: newTemplate.channel,
        language: newTemplate.language,
        content: newTemplate.content,
        placeholders: newTemplate.placeholders,
      };

      await notificationService.createTemplate(templatePayload);
      setNewTemplate({
        template_code: "",
        channel: "sms",
        language: "en",
        content: "",
        placeholders: {},
      });
      setShowCreateModal(false);
      getTemplates();
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  const addPlaceholder = () => {
    if (currentPlaceholder && !newTemplate.placeholders[currentPlaceholder]) {
      setNewTemplate({
        ...newTemplate,
        placeholders: {
          ...newTemplate.placeholders,
          [currentPlaceholder]: currentDescription || "Placeholder description",
        },
      });
      setCurrentPlaceholder("");
      setCurrentDescription("");
    }
  };

  const removePlaceholder = (placeholder: string) => {
    const updatedPlaceholders = { ...newTemplate.placeholders };
    delete updatedPlaceholders[placeholder];

    setNewTemplate({
      ...newTemplate,
      placeholders: updatedPlaceholders,
    });
  };

  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortDirection("asc");
    }
    setIsSortMenuOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "sms":
        return <Smartphone className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      case "push":
        return <BellRing className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Loader className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30";
      case "medium":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
      case "low":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30";
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700";
    }
  };

  const viewTemplate = (templateId: string) => {
    window.location.href = `/admin/media/shorts/notifications/templates/${templateId}`;
  };

  const handlePageChange = (page: number) => {
    getNotifications(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearch("");

    if (tab === "templates") {
      getTemplates();
    } else {
      getNotifications(1);
    }
  };

  useEffect(() => {
    if (activeTab === "templates") {
      getTemplates();
    } else {
      getNotifications(1);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "templates") {
      let filtered = [...templates];

      if (search) {
        filtered = filtered.filter(
          (template) =>
            template.template_code
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            template.channel.toLowerCase().includes(search.toLowerCase()) ||
            template.language.toLowerCase().includes(search.toLowerCase())
        );
      }

      filtered.sort((a, b) => {
        let comparison = 0;

        if (sortBy === "template_code") {
          comparison = a.template_code.localeCompare(b.template_code);
        } else if (sortBy === "channel") {
          comparison = a.channel.localeCompare(b.channel);
        } else if (sortBy === "language") {
          comparison = a.language.localeCompare(b.language);
        } else if (sortBy === "createdAt") {
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });

      setFilteredTemplates(filtered);
    }
  }, [search, templates, sortBy, sortDirection, activeTab]);

  useEffect(() => {
    if (activeTab === "history" && search) {
      const timer = setTimeout(() => {
        getNotifications(1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [search, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              Notification Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Create and manage notification templates for users
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors"
          >
            <Plus size={16} className="mr-1.5" />
            New Template
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => handleTabChange("templates")}
                className={`px-5 py-3 text-sm font-medium flex items-center transition-colors ${
                  activeTab === "templates"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <FileText size={16} className="mr-1.5" />
                Templates
              </button>

              <button
                onClick={() => handleTabChange("history")}
                className={`px-5 py-3 text-sm font-medium flex items-center transition-colors ${
                  activeTab === "history"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Clock size={16} className="mr-1.5" />
                Notification History
              </button>
            </nav>
          </div>

          {/* Search and Filter Bar */}
          <div className="p-3 flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  size={14}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
              <input
                type="text"
                placeholder={
                  activeTab === "templates"
                    ? "Search templates..."
                    : "Search notification history..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Sort/Filter Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSortMenuOpen(!isSortMenuOpen);
                }}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              >
                <Filter size={16} />
              </button>

              {isSortMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SORT BY
                    </p>
                  </div>
                  <div className="py-1">
                    {activeTab === "templates" ? (
                      <>
                        <button
                          onClick={() => handleSort("template_code")}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                            sortBy === "template_code"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>Template Code</span>
                          {sortBy === "template_code" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            ))}
                        </button>
                        <button
                          onClick={() => handleSort("channel")}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                            sortBy === "channel"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>Channel</span>
                          {sortBy === "channel" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            ))}
                        </button>
                        <button
                          onClick={() => handleSort("language")}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                            sortBy === "language"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>Language</span>
                          {sortBy === "language" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            ))}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSort("createdAt")}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                            sortBy === "createdAt"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>Date Sent</span>
                          {sortBy === "createdAt" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            ))}
                        </button>
                        <button
                          onClick={() => handleSort("channel")}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                            sortBy === "channel"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>Channel</span>
                          {sortBy === "channel" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            ))}
                        </button>
                        <button
                          onClick={() => handleSort("status")}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                            sortBy === "status"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>Status</span>
                          {sortBy === "status" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            ))}
                        </button>
                        <button
                          onClick={() => handleSort("priority")}
                          className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                            sortBy === "priority"
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>Priority</span>
                          {sortBy === "priority" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            ))}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleSort("createdAt")}
                      className={`flex items-center justify-between w-full px-3 py-1.5 text-xs ${
                        sortBy === "createdAt"
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>Date Created</span>
                      {sortBy === "createdAt" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        ))}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500"></div>
            </div>
          )}

          {/* Templates Tab Content */}
          {!isLoading && activeTab === "templates" && (
            <div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                            {template.channel === "sms" ? (
                              <Smartphone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            ) : template.channel === "email" ? (
                              <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            ) : (
                              <BellRing className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {template.template_code}
                            </h3>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                {template.channel}
                              </span>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Languages className="w-3 h-3 mr-0.5" />
                                {template?.language?.toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                v{template.version}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => viewTemplate(template.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors">
                            <Send size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                      <Bell
                        size={24}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No templates found matching your criteria.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-3 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      Create your first template
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notification History Tab Content */}
          {!isLoading && activeTab === "history" && (
            <div>
              {notifications.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-3">
                            <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
                              {getChannelIcon(notification.channel)}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {notification.template_code_id}
                                </h3>

                                <div className="flex items-center text-xs">
                                  {getStatusIcon(notification.status)}
                                  <span className="ml-0.5 text-gray-700 dark:text-gray-300">
                                    {notification.status}
                                  </span>
                                </div>

                                <span
                                  className={`text-xs py-0.5 px-1.5 rounded border ${getPriorityColor(
                                    notification.priority
                                  )}`}
                                >
                                  {notification.priority}
                                </span>
                              </div>

                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                {notification.channel === "sms" ? (
                                  <span>
                                    Sent to: {notification.user_phone}
                                  </span>
                                ) : (
                                  <span>
                                    Sent to:{" "}
                                    {notification.user_email ||
                                      notification.user_phone}
                                  </span>
                                )}
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 mb-2">
                                <div className="text-xs text-gray-700 dark:text-gray-300">
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(notification.payload).map(
                                      ([key, value]) => (
                                        <div
                                          key={key}
                                          className="flex items-start"
                                        >
                                          <span className="text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1 py-0.5 rounded mr-1.5">
                                            {key}
                                          </span>
                                          <span className="text-gray-700 dark:text-gray-300 font-mono">
                                            {String(value)}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 mt-1 space-x-3 font-mono">
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-0.5" />
                                  {formatDate(notification.createdAt)}
                                </div>

                                {notification.delivered_at && (
                                  <div className="flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-0.5" />
                                    {formatDate(notification.delivered_at)}
                                  </div>
                                )}

                                <div className="flex items-center">
                                  <Shield className="w-3 h-3 mr-0.5" />
                                  {notification.origin_service}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-1">
                            <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Showing{" "}
                        <span className="font-medium">
                          {(pagination.currentPage - 1) * 10 + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            pagination.currentPage * 10,
                            pagination.totalCount
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {pagination.totalCount}
                        </span>{" "}
                        notifications
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            handlePageChange(
                              Math.max(1, pagination.currentPage - 1)
                            )
                          }
                          disabled={pagination.currentPage === 1}
                          className={`p-1.5 rounded border ${
                            pagination.currentPage === 1
                              ? "text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed"
                              : "text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <ChevronLeft size={14} />
                        </button>

                        {[...Array(pagination.totalPages)].map((_, i) => {
                          const page = i + 1;
                          const isCurrentPage = page === pagination.currentPage;
                          const isFirstPage = page === 1;
                          const isLastPage = page === pagination.totalPages;
                          const isWithinRange =
                            Math.abs(page - pagination.currentPage) <= 1;

                          if (isFirstPage || isLastPage || isWithinRange) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-7 h-7 rounded text-xs flex items-center justify-center ${
                                  isCurrentPage
                                    ? "bg-blue-500 dark:bg-blue-600 text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            (page === 2 && pagination.currentPage > 3) ||
                            (page === pagination.totalPages - 1 &&
                              pagination.currentPage <
                                pagination.totalPages - 2)
                          ) {
                            return (
                              <span
                                key={page}
                                className="text-gray-400 dark:text-gray-500"
                              >
                                ...
                              </span>
                            );
                          }

                          return null;
                        })}

                        <button
                          onClick={() =>
                            handlePageChange(
                              Math.min(
                                pagination.totalPages,
                                pagination.currentPage + 1
                              )
                            )
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                          className={`p-1.5 rounded border ${
                            pagination.currentPage === pagination.totalPages
                              ? "text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed"
                              : "text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                    <Clock
                      size={24}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No notification history found.
                  </p>
                  <button className="mt-3 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    Send your first notification
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-xl border border-gray-200 dark:border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
                <Sparkles
                  size={16}
                  className="mr-1.5 text-blue-500 dark:text-blue-400"
                />
                Create New Template
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., OTP_VERIFICATION"
                  value={newTemplate.template_code}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      template_code: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Channel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                      {getChannelIcon(newTemplate.channel)}
                    </div>
                    <select
                      value={newTemplate.channel}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          channel: e.target.value,
                        })
                      }
                      className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push Notification</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 dark:text-gray-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                      <Languages size={14} />
                    </div>
                    <select
                      value={newTemplate.language}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          language: e.target.value,
                        })
                      }
                      className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 dark:text-gray-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="e.g., Your verification code is {{otp}}. Valid for {{expires_at}} minutes. Do not share this code with anyone."
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
                />
                <div className="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Command className="w-3 h-3 mr-1" />
                  Use {"{{ placeholder_name }}"} for variables
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Placeholders
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Placeholder name (e.g., otp)"
                    value={currentPlaceholder}
                    onChange={(e) => setCurrentPlaceholder(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g., OTP code)"
                    value={currentDescription}
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <button
                  onClick={addPlaceholder}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-sm transition-colors w-full"
                >
                  Add Placeholder
                </button>

                <div className="mt-3">
                  {Object.keys(newTemplate.placeholders).length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Added Placeholders:
                      </h4>
                      <div className="space-y-1.5">
                        {Object.entries(newTemplate.placeholders).map(
                          ([key, description]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-600"
                            >
                              <div>
                                <span className="text-blue-600 dark:text-blue-400 font-medium text-xs font-mono">{`{{ ${key} }}`}</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1.5">
                                  {description}
                                </span>
                              </div>
                              <button
                                onClick={() => removePlaceholder(key)}
                                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={createTemplate}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center"
              >
                <Zap size={14} className="mr-1.5" />
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
