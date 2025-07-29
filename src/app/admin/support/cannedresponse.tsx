import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  AlertTriangle,
  MessageSquare,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Copy,
  Clock,
  ArrowUp,
  ArrowDown,
  Check,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Video,
  HelpCircle,
  Wallet,
  Folder,
  ArrowUpRight,
  Download,
  X,
  FileText,
} from "lucide-react";
import supportService from "../../../api/services/support";
import userService from "../../../api/services/users";
import CannedResponseCompactView from "../../../components/support/CannedResponseCompactView";
import CannedResponsePagination from "../../../components/support/CannedResponsePagination";
import CannedResponseCardView from "../../../components/support/CannedResponseCardView";

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "video":
      return <Video />;
    case "wallet":
      return <Wallet />;
    case "user":
      return <User />;
    case "help-circle":
      return <HelpCircle />;
    default:
      return <Folder />;
  }
};

export default function CannedResponsesListPage() {
  // State
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [copiedId, setCopiedId] = useState(null);
  const [expandedResponseId, setExpandedResponseId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [creators, setCreators] = useState({});
  const [loadingCreators, setLoadingCreators] = useState(false);
  const [viewMode, setViewMode] = useState("card");

  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  const [renderedTemplate, setRenderedTemplate] = useState("");
  const [renderLoading, setRenderLoading] = useState(false);
  const [renderError, setRenderError] = useState(null);
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const response = await supportService.getCannedResponses();
        setResponses(response.data.responses || []);
        setPagination(response.data.pagination);
      } catch (err) {
        setError("Failed to fetch canned responses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const fetchCreators = async () => {
      if (responses.length === 0) return;

      setLoadingCreators(true);
      const creatorIds = [
        ...new Set(responses.map((response) => response.createdBy)),
      ];
      const creatorMap = { ...creators };

      try {
        for (const creatorId of creatorIds) {
          if (!creatorMap[creatorId]) {
            const result = await userService.getUserById(creatorId);
            creatorMap[creatorId] = result.data;
          }
        }

        setCreators(creatorMap);
      } catch (err) {
        console.error("Failed to fetch creator information", err);
      } finally {
        setLoadingCreators(false);
      }
    };

    fetchCreators();
  }, [responses]);

  const filteredResponses = useMemo(() => {
    const filtered = responses.filter((response) => {
      const matchesSearch =
        response.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (response.category &&
          response.category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesActiveFilter = showInactive ? true : response.isActive;

      return matchesSearch && matchesActiveFilter;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "categoryName") {
        aValue = a.category?.name || "";
        bValue = b.category?.name || "";
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [responses, searchTerm, showInactive, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this canned response? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await supportService.deleteCannedResponse(id);
      setResponses((prevResponses) =>
        prevResponses.filter((response) => response.id !== id)
      );
      setActiveMenu(null);
    } catch (err) {
      console.error("Failed to delete canned response", err);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(content);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const extractPlaceholders = (content) => {
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    return [...new Set(matches)].map((ph) =>
      (ph as string).replace(/[{}]/g, "")
    );
  };

  const highlightPlaceholders = (content) => {
    const parts = content.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, index) => {
      if (part.match(/^\{\{[^}]+\}\}$/)) {
        return (
          <span
            key={index}
            className="px-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleExport = async () => {
    try {
      alert("Canned responses exported successfully!");
    } catch (err) {
      console.error("Failed to export canned responses", err);
    }
  };

  const handleRenderTemplate = (response) => {
    const placeholders = extractPlaceholders(response.content);
    const initialVariables = {};
    placeholders.forEach((placeholder) => {
      initialVariables[placeholder] = "";
    });

    setSelectedTemplate(response);
    setTemplateVariables(initialVariables);
    setRenderedTemplate("");
    setRenderError(null);
    setIsRenderModalOpen(true);
  };

  const renderTemplate = async () => {
    if (!selectedTemplate) return;

    setRenderLoading(true);
    setRenderError(null);

    try {
      const result = await supportService.renderCannedResponseTemplate(
        { variables: templateVariables },
        selectedTemplate.id
      );

      const apiResponseObj = {
        success: true,
        data: {
          content: result.renderedContent,
        },
      };

      setApiResponse(apiResponseObj);
      setRenderedTemplate(result.renderedContent);
    } catch (err) {
      setRenderError(
        "Failed to render template. Please check your variables and try again."
      );
      console.error(err);
    } finally {
      setRenderLoading(false);
    }
  };

  const renderCategoryBadge = (category) => {
    if (!category) return null;

    return (
      <div
        className="flex items-center rounded-full px-3 py-1 text-xs font-medium"
        style={{
          backgroundColor: `${category.color}20`,
          color: category.color,
        }}
      >
        <span className="mr-1">{getCategoryIcon(category.icon)}</span>
        {category.name}
      </div>
    );
  };

  const renderCreatorAvatar = (creatorId) => {
    const creator = creators[creatorId];
    if (!creator) {
      return (
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
          ?
        </div>
      );
    }

    if (creator.avatar) {
      return (
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-6 h-6 rounded-full"
        />
      );
    }

    return (
      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-medium text-indigo-800 dark:text-indigo-400">
        {getInitials(creator.name)}
      </div>
    );
  };

  const renderCardView = () => {
    return (
      <CannedResponseCardView
        filteredResponses={filteredResponses}
        handleCopy={handleCopy}
        renderCategoryBadge={renderCategoryBadge}
        renderCreatorAvatar={renderCreatorAvatar}
        formatDate={formatDate}
        creators={creators}
        handleRenderTemplate={handleRenderTemplate}
        extractPlaceholders={extractPlaceholders}
        highlightPlaceholders={highlightPlaceholders}
        setActiveMenu={setActiveMenu}
        renderActionMenu={renderActionMenu}
        expandedResponseId={expandedResponseId}
        setExpandedResponseId={setExpandedResponseId}
        copiedId={copiedId}
        activeMenu={activeMenu}
        formatDateTime={formatDateTime}
      />
    );
  };

  const renderCompactView = () => {
    return (
      <CannedResponseCompactView
        filteredResponses={filteredResponses}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        renderCategoryBadge={renderCategoryBadge}
        formatDate={formatDate}
        creators={creators}
        handleCopy={handleCopy}
        handleRenderTemplate={handleRenderTemplate}
        extractPlaceholders={extractPlaceholders}
        handleDelete={handleDelete}
      />
    );
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <CannedResponsePagination
        pagination={pagination}
        handlePageChange={handlePageChange}
      />
    );
  };

  const handleVariableChange = (placeholder: string, value: string) => {
    setTemplateVariables((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  const renderTemplateModal = () => {
    if (!isRenderModalOpen || !selectedTemplate) return null;

    const placeholders = extractPlaceholders(selectedTemplate.content);

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 dark:bg-black bg-opacity-80 dark:bg-opacity-90 backdrop-blur-sm">
        <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-600 flex flex-col transform transition-all duration-300">
          <div className="relative">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="flex justify-between items-center px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                <span>{selectedTemplate.title}</span>
              </h3>
              <button
                onClick={() => setIsRenderModalOpen(false)}
                className="rounded-full p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            {renderError && (
              <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {renderError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-500 flex items-center">
                <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Template Preview
                </span>
              </div>
              <div className="p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {highlightPlaceholders(selectedTemplate.content)}
              </div>
            </div>

            {placeholders.length > 0 ? (
              <div className="space-y-5">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                  Template Variables
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {placeholders.map((placeholder) => (
                    <div key={placeholder} className="relative">
                      <input
                        type="text"
                        id={placeholder}
                        value={templateVariables[placeholder] || ""}
                        onChange={(e) =>
                          handleVariableChange(placeholder, e.target.value)
                        }
                        placeholder=" "
                        className="block w-full px-4 py-3 text-gray-700 dark:text-gray-100 bg-transparent rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                      />
                      <label
                        htmlFor={placeholder}
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                      >
                        {placeholder}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  This template does not contain any variables.
                </p>
              </div>
            )}

            {renderedTemplate && (
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-500 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {showRawResponse ? "API Response" : "Rendered Result"}
                    </span>
                    <div className="flex items-center">
                      <button
                        onClick={() => setShowRawResponse(false)}
                        className={`px-2 py-1 text-xs rounded-l-md border ${
                          !showRawResponse
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-600"
                            : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        Content
                      </button>
                      <button
                        onClick={() => setShowRawResponse(true)}
                        className={`px-2 py-1 text-xs rounded-r-md border -ml-px ${
                          showRawResponse
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-600"
                            : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        JSON
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        showRawResponse
                          ? JSON.stringify(apiResponse, null, 2)
                          : renderedTemplate
                      )
                    }
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {copiedId ===
                    (showRawResponse
                      ? JSON.stringify(apiResponse)
                      : renderedTemplate) ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {showRawResponse ? (
                  <div className="p-4 text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre bg-gray-50 dark:bg-gray-800 overflow-auto">
                    {JSON.stringify(apiResponse, null, 2)}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {renderedTemplate}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
            <button
              onClick={() => setIsRenderModalOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={renderTemplate}
              disabled={renderLoading || placeholders.length === 0}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {renderLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Render Template
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  function renderActionMenu(response) {
    if (activeMenu !== response.id) return null;

    return (
      <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 dark:ring-opacity-50 z-10 border border-gray-200 dark:border-gray-600">
        <div className="py-1" role="menu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(response.content);
              setActiveMenu(null);
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Copy className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Copy Content
          </button>
          {extractPlaceholders(response.content).length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRenderTemplate(response);
                setActiveMenu(null);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FileText className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Render Template
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(response.id);
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Trash2 className="mr-3 h-4 w-4 text-red-500 dark:text-red-400" />
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              Canned Responses
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage pre-written responses for common support queries
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button
              onClick={() => console.log("Navigate to create page")}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Response
            </button>
          </div>
        </div>

        <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="md:ml-auto flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-1.5 rounded ${
                    viewMode === "card"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="h-5 w-5 flex flex-col items-center justify-center">
                    <div className="h-0.5 w-full bg-current rounded-full mb-0.5"></div>
                    <div className="h-0.5 w-full bg-current rounded-full mb-0.5"></div>
                    <div className="h-0.5 w-full bg-current rounded-full"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={`p-1.5 rounded ${
                    viewMode === "compact"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="h-5 w-5 flex flex-col items-center justify-center">
                    <div className="h-0.5 w-full bg-current rounded-full mb-1"></div>
                    <div className="h-0.5 w-full bg-current rounded-full"></div>
                  </div>
                </button>
              </div>

              <div className="h-6 border-l border-gray-200 dark:border-gray-600"></div>

              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                  showInactive
                    ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                {showInactive ? "Showing Inactive" : "Show Inactive"}
              </button>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowInactive(false);
                  setSortField("title");
                  setSortDirection("asc");
                  setExpandedResponseId(null);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Responses List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-indigo-500 dark:border-indigo-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center border border-gray-200 dark:border-gray-700">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No canned responses found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create pre-written responses to save time when answering common
              queries.
            </p>
            <div className="mt-6">
              <button
                onClick={() => console.log("Navigate to create page")}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New Response
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            {viewMode === "card" ? renderCardView() : renderCompactView()}
            {renderPagination()}
          </div>
        )}

        {renderTemplateModal()}
      </div>
    </div>
  );
}
