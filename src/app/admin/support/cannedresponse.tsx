import React, { useState, useEffect, useMemo } from 'react';
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
  FileText
} from 'lucide-react';
import supportService from '../../../api/services/support';
import userService from '../../../api/services/users';

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'video':
      return <Video />;
    case 'wallet':
      return <Wallet />;
    case 'user':
      return <User />;
    case 'help-circle':
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedResponseId, setExpandedResponseId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [creators, setCreators] = useState({});
  const [loadingCreators, setLoadingCreators] = useState(false);
  const [viewMode, setViewMode] = useState('card');

  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  const [renderedTemplate, setRenderedTemplate] = useState('');
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
        setError('Failed to fetch canned responses');
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
      const creatorIds = [...new Set(responses.map(response => response.createdBy))];
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
        console.error('Failed to fetch creator information', err);
      } finally {
        setLoadingCreators(false);
      }
    };

    fetchCreators();
  }, [responses]);

  // Filter and sort responses
  const filteredResponses = useMemo(() => {
    let filtered = responses.filter(response => {
      const matchesSearch =
        response.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (response.category && response.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesActiveFilter = showInactive ? true : response.isActive;

      return matchesSearch && matchesActiveFilter;
    });

    // Sort filtered responses
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Special handling for categoryName
      if (sortField === 'categoryName') {
        aValue = a.category?.name || '';
        bValue = b.category?.name || '';
      }

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [responses, searchTerm, showInactive, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this canned response? This action cannot be undone.')) {
      return;
    }

    try {
      await supportService.deleteCannedResponse(id);
      setResponses(prevResponses => prevResponses.filter(response => response.id !== id));
      setActiveMenu(null);
    } catch (err) {
      console.error('Failed to delete canned response', err);
    }
  };

  // Handle copy to clipboard
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      // Visual feedback on copy
      setCopiedId(content);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Extract and count placeholders
  const extractPlaceholders = (content) => {
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    return [...new Set(matches)].map((ph) => (ph as string).replace(/[{}]/g, ''));
  };

  const highlightPlaceholders = (content) => {
    // Split by placeholder pattern {{...}} and join with highlighted spans
    const parts = content.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, index) => {
      if (part.match(/^\{\{[^}]+\}\}$/)) {
        return (
          <span key={index} className="px-1 bg-blue-100 text-blue-800 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle export all responses
  const handleExport = async () => {
    try {
      // await supportService.exportCannedResponses();
      alert('Canned responses exported successfully!');
    } catch (err) {
      console.error('Failed to export canned responses', err);
    }
  };

  // Handle template rendering
  const handleRenderTemplate = (response) => {
    // Extract placeholders from the template
    const placeholders = extractPlaceholders(response.content);

    // Initialize template variables with empty values
    const initialVariables = {};
    placeholders.forEach(placeholder => {
      initialVariables[placeholder] = '';
    });

    // Set states to open the modal
    setSelectedTemplate(response);
    setTemplateVariables(initialVariables);
    setRenderedTemplate('');
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
          content: result.renderedContent
        }
      };

      setApiResponse(apiResponseObj);
      setRenderedTemplate(result.renderedContent);
    } catch (err) {
      setRenderError('Failed to render template. Please check your variables and try again.');
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
          color: category.color
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
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
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
      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-800">
        {getInitials(creator.name)}
      </div>
    );
  };

  // Render card view
  const renderCardView = () => {
    return (
      <div className="space-y-4">
        {filteredResponses.map(response => (
          <div
            key={response.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900 mr-2 truncate">
                      {response.title}
                    </h3>
                    {!response.isActive && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Category & Metadata */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {renderCategoryBadge(response.category)}

                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span className="flex items-center">
                        {renderCreatorAvatar(response.createdBy)}
                        <span className="ml-1">{creators[response.createdBy]?.name || 'Unknown'}</span>
                      </span>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {formatDate(response.updatedAt)}
                    </div>
                  </div>

                  {/* Tags */}
                  {response.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {response.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-start space-x-2 ml-4">
                  <div className="text-center px-2 py-1 bg-gray-50 rounded-md">
                    <div className="text-sm font-medium text-gray-900">{response.usageCount}</div>
                    <div className="text-xs text-gray-500">uses</div>
                  </div>

                  <div className="flex items-center text-right space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(response.content);
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-indigo-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {extractPlaceholders(response.content).length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenderTemplate(response);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-indigo-600"
                        title="Render Template"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === response.id ? null : response.id);
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {renderActionMenu(response)}
                  </div>
                </div>
              </div>

              {/* Content Preview Toggle */}
              <div
                className={`mt-3 bg-gray-50 rounded-md p-3 text-sm text-gray-700 ${expandedResponseId === response.id ? '' : 'cursor-pointer hover:bg-gray-100'
                  }`}
                onClick={() => expandedResponseId !== response.id && setExpandedResponseId(response.id)}
              >
                {expandedResponseId === response.id ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">Content</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(response.content);
                          }}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          {copiedId === response.content ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedResponseId(null);
                          }}
                          className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {highlightPlaceholders(response.content)}
                    </div>

                    {/* Detailed Info */}
                    <div className="mt-4 border-t border-gray-200 pt-3 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-gray-500 font-medium">Created</p>
                        <p className="flex items-center mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {formatDateTime(response.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Updated</p>
                        <p className="flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {formatDateTime(response.updatedAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 font-medium">Placeholders</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {extractPlaceholders(response.content).map(placeholder => (
                            <span key={placeholder} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                              {placeholder}
                            </span>
                          ))}
                          {extractPlaceholders(response.content).length === 0 && (
                            <span className="text-gray-400 italic">None</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 font-medium">Category Details</p>
                        {response.category ? (
                          <div className="mt-1">
                            <p className="text-xs text-gray-700">{response.category.description}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
                                SLA: {response.category.firstResponseSla}m
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
                                {response.category.defaultPriority}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic mt-1 inline-block">No category assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="line-clamp-1">
                      {highlightPlaceholders(response.content.split('\n')[0])}
                      {response.content.includes('\n') && '...'}
                    </p>
                    <button
                      className="ml-2 flex-shrink-0 text-xs text-indigo-600 hover:text-indigo-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedResponseId(response.id);
                      }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCompactView = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {sortField === 'title' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('categoryName')}
              >
                <div className="flex items-center">
                  Category
                  {sortField === 'categoryName' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center">
                  Last Updated
                  {sortField === 'updatedAt' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('usageCount')}
              >
                <div className="flex items-center">
                  Usage
                  {sortField === 'usageCount' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResponses.map(response => (
              <tr key={response.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {response.title}
                        {!response.isActive && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {response.content.replace(/\n/g, ' ')}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {response.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {response.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{response.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {response.category ? renderCategoryBadge(response.category) : (
                    <span className="text-xs text-gray-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(response.updatedAt)}</div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <User className="h-3 w-3 mr-1" />
                    {creators[response.createdBy]?.name || 'Unknown'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="text-sm font-medium text-gray-900">{response.usageCount}</div>
                  <div className="text-xs text-gray-500">uses</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={() => handleCopy(response.content)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {extractPlaceholders(response.content).length > 0 && (
                      <button
                        onClick={() => handleRenderTemplate(response)}
                        className="text-gray-400 hover:text-indigo-600"
                        title="Render Template"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => console.log('View details', response.id)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => console.log('Edit', response.id)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(response.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${pagination.page === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${pagination.page === pagination.pages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${pagination.page === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and pages within 1 of current
                  return (
                    page === 1 ||
                    page === pagination.pages ||
                    Math.abs(page - pagination.page) <= 1
                  );
                })
                .map((page, index, array) => {
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${page === pagination.page
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                      {showEllipsisAfter && (
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${pagination.page === pagination.pages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const handleVariableChange = (placeholder: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [placeholder]: value
    }));
  };

  const renderTemplateModal = () => {
    if (!isRenderModalOpen || !selectedTemplate) return null;

    const placeholders = extractPlaceholders(selectedTemplate.content);

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col transform transition-all duration-300">
          <div className="relative">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="flex justify-between items-center px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                <span>{selectedTemplate.title}</span>
              </h3>
              <button
                onClick={() => setIsRenderModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            {renderError && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border-l-4 border-red-500">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{renderError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex items-center">
                <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-xs font-medium text-gray-700">Template Preview</span>
              </div>
              <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {highlightPlaceholders(selectedTemplate.content)}
              </div>
            </div>

            {placeholders.length > 0 ? (
              <div className="space-y-5">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-500" />
                  Template Variables
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {placeholders.map(placeholder => (
                    <div key={placeholder} className="relative">
                      <input
                        type="text"
                        id={placeholder}
                        value={templateVariables[placeholder] || ''}
                        onChange={(e) => handleVariableChange(placeholder, e.target.value)}
                        placeholder=" "
                        className="block w-full px-4 py-3 text-gray-700 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                      />
                      <label
                        htmlFor={placeholder}
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                      >
                        {placeholder}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  This template does not contain any variables.
                </p>
              </div>
            )}

            {renderedTemplate && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium text-gray-700">
                      {showRawResponse ? "API Response" : "Rendered Result"}
                    </span>
                    <div className="flex items-center">
                      <button
                        onClick={() => setShowRawResponse(false)}
                        className={`px-2 py-1 text-xs rounded-l-md border ${!showRawResponse
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                      >
                        Content
                      </button>
                      <button
                        onClick={() => setShowRawResponse(true)}
                        className={`px-2 py-1 text-xs rounded-r-md border -ml-px ${showRawResponse
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                      >
                        JSON
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(showRawResponse ? JSON.stringify(apiResponse, null, 2) : renderedTemplate)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    {copiedId === (showRawResponse ? JSON.stringify(apiResponse) : renderedTemplate) ? (
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
                  <div className="p-4 text-sm font-mono text-gray-700 whitespace-pre bg-gray-50 overflow-auto">
                    {JSON.stringify(apiResponse, null, 2)}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap">
                    {renderedTemplate}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setIsRenderModalOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
      <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
        <div className="py-1" role="menu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('View details', response.id);
              setActiveMenu(null);
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye className="mr-3 h-4 w-4 text-gray-500" />
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit', response.id);
              setActiveMenu(null);
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit className="mr-3 h-4 w-4 text-gray-500" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(response.content);
              setActiveMenu(null);
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy className="mr-3 h-4 w-4 text-gray-500" />
            Copy Content
          </button>
          {extractPlaceholders(response.content).length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRenderTemplate(response);
                setActiveMenu(null);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FileText className="mr-3 h-4 w-4 text-gray-500" />
              Render Template
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(response.id);
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            <Trash2 className="mr-3 h-4 w-4 text-red-500" />
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Canned Responses</h1>
            <p className="text-sm text-gray-500">
              Manage pre-written responses for common support queries
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button
              onClick={() => console.log('Navigate to create page')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Response
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="md:ml-auto flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <div className="h-5 w-5 flex flex-col items-center justify-center">
                    <div className="h-0.5 w-full bg-current rounded-full mb-0.5"></div>
                    <div className="h-0.5 w-full bg-current rounded-full mb-0.5"></div>
                    <div className="h-0.5 w-full bg-current rounded-full"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded ${viewMode === 'compact' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <div className="h-5 w-5 flex flex-col items-center justify-center">
                    <div className="h-0.5 w-full bg-current rounded-full mb-1"></div>
                    <div className="h-0.5 w-full bg-current rounded-full"></div>
                  </div>
                </button>
              </div>

              <div className="h-6 border-l border-gray-200"></div>

              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${showInactive
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700'
                  }`}
              >
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                {showInactive ? 'Showing Inactive' : 'Show Inactive'}
              </button>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowInactive(false);
                  setSortField('title');
                  setSortDirection('asc');
                  setExpandedResponseId(null);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No canned responses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create pre-written responses to save time when answering common queries.
            </p>
            <div className="mt-6">
              <button
                onClick={() => console.log('Navigate to create page')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                New Response
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            {viewMode === 'card' ? renderCardView() : renderCompactView()}
            {renderPagination()}
          </div>
        )}

        {/* Render Template Modal */}
        {renderTemplateModal()}
      </div>
    </div>
  );
}
