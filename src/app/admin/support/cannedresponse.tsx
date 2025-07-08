import { useState, useEffect, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import supportService from '../../../api/services/support';

export default function CannedResponsesListPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [copiedId, setCopiedId] = useState(null);

  // Fetch canned responses
  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const response = await supportService.getCannedResponses();
        setResponses(response.data.responses || []);
      } catch (err) {
        setError('Failed to fetch canned responses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const filteredResponses = useMemo(() => {
    let filtered = responses.filter(response => {
      const matchesSearch =
        response.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesActiveFilter = showInactive ? true : response.isActive;

      return matchesSearch && matchesActiveFilter;
    });

    // Sort filtered responses
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Highlight placeholders in content
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
          <button
            onClick={() => console.log('Navigate to create page')}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Response
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
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

          <div className="flex space-x-2 ml-auto">
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
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </button>
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
          <div className="space-y-3">
            {/* Table Header - Desktop */}
            <div className="hidden md:flex bg-white rounded-t-lg shadow-sm px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-1/4">
                <button
                  className="flex items-center text-left focus:outline-none"
                  onClick={() => handleSort('title')}
                >
                  Title
                  {sortField === 'title' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </button>
              </div>
              <div className="w-1/4">Category</div>
              <div className="w-1/5">
                <button
                  className="flex items-center text-left focus:outline-none"
                  onClick={() => handleSort('updatedAt')}
                >
                  Last Updated
                  {sortField === 'updatedAt' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </button>
              </div>
              <div className="w-1/6">
                <button
                  className="flex items-center text-left focus:outline-none"
                  onClick={() => handleSort('usageCount')}
                >
                  Usage
                  {sortField === 'usageCount' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </button>
              </div>
              <div className="w-12"></div>
            </div>

            {/* Responses */}
            <div className="space-y-3">
              {filteredResponses.map(response => (
                <div
                  key={response.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-indigo-500"
                >
                  <div className="px-6 py-4">
                    {/* Mobile View */}
                    <div className="md:hidden">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {response.title}
                          {!response.isActive && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Inactive
                            </span>
                          )}
                        </h3>
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === response.id ? null : response.id)}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          {renderActionMenu(response)}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{response.categoryName}</p>
                      <div className="mt-2 text-sm text-gray-700 line-clamp-2">
                        {highlightPlaceholders(response.content)}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(response.updatedAt)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">Used {response.usageCount} times</span>
                        </div>
                      </div>
                      {response.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {response.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:flex items-center">
                      <div className="w-1/4">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center">
                          {response.title}
                          {!response.isActive && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Inactive
                            </span>
                          )}
                        </h3>
                        {response.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {response.tags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-1/4">
                        <p className="text-sm text-gray-700">{response.categoryName}</p>
                      </div>
                      <div className="w-1/5">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(response.updatedAt)}
                        </div>
                      </div>
                      <div className="w-1/6">
                        <p className="text-sm text-gray-700">{response.usageCount} uses</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === response.id ? null : response.id)}
                          className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {renderActionMenu(response)}
                      </div>
                    </div>

                    {/* Preview - Expanded for both mobile and desktop */}
                    <div className="mt-3 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                      <p>{highlightPlaceholders(response.content)}</p>
                      <button
                        onClick={() => handleCopy(response.content)}
                        className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        {copiedId === response.content ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to render action menu
  function renderActionMenu(response) {
    if (activeMenu !== response.id) return null;

    return (
      <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
        <div className="py-1" role="menu">
          <button
            onClick={() => console.log('View details', response.id)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye className="mr-3 h-4 w-4 text-gray-500" />
            View Details
          </button>
          <button
            onClick={() => console.log('Edit', response.id)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit className="mr-3 h-4 w-4 text-gray-500" />
            Edit
          </button>
          <button
            onClick={() => handleCopy(response.content)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy className="mr-3 h-4 w-4 text-gray-500" />
            Copy Content
          </button>
          <button
            onClick={() => handleDelete(response.id)}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            <Trash2 className="mr-3 h-4 w-4 text-red-500" />
            Delete
          </button>
        </div>
      </div>
    );
  }
}
