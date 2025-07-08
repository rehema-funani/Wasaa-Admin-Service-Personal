import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
  Tag,
  MessageSquare,
  Copy,
  Check,
  User,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Video,
  HelpCircle,
  Wallet,
  Folder,
  AlertCircle,
  Download,
  Code
} from 'lucide-react';
import supportService from '../../../api/services/support';
import userService from '../../../api/services/users';
import { useParams } from 'react-router-dom';

const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'wallet':
      return <Wallet className="h-5 w-5" />;
    case 'user':
      return <User className="h-5 w-5" />;
    case 'help-circle':
      return <HelpCircle className="h-5 w-5" />;
    default:
      return <Folder className="h-5 w-5" />;
  }
};

// Get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'LOW':
      return 'bg-green-100 text-green-800';
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CannedResponseDetailPage() {
  // State
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creator, setCreator] = useState(null);
  const [updater, setUpdater] = useState(null);
  const [copiedContent, setCopiedContent] = useState(false);
  const [previewValues, setPreviewValues] = useState({
    resolution: '1080p',
    bitrate: '6000 kbps',
    customerName: 'Alex Johnson',
    userEmail: 'alex@example.com',
    ticketNumber: 'TKT-12345',
    reason: 'Technical complexity',
    priority: 'High',
    timeframe: '24 hours',
    transactionId: 'TRX-67890',
    amount: 'Ksh 49.99'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { id } = useParams();

  // Fetch canned response and related data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseId = id;
        const result = await supportService.getCannedResponseById(responseId);
        setResponse(result.data.response);

        // Fetch creator info
        if (result.data.response.createdBy) {
          const creatorInfo = await userService.getUserById(result.data.response.createdBy);
          setCreator(creatorInfo.data);
        }

        // Fetch updater info if different from creator
        if (result.data.response.updatedBy && result.data.response.updatedBy !== result.data.response.createdBy) {
          const updaterInfo = await userService.getUserById(result.data.response.updatedBy);
          setUpdater(updaterInfo.data);
        }
      } catch (err) {
        setError('Failed to fetch canned response');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete
  const handleDelete = async () => {
    try {
      await supportService.deleteCannedResponse(response.id);
      console.log('Canned response deleted, redirecting to list...');
      // In a real app, we'd navigate back to the list page
    } catch (err) {
      console.error('Failed to delete canned response', err);
    }
  };

  // Handle copy to clipboard
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format short date
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Extract placeholders from content
  const extractPlaceholders = (content) => {
    if (!content) return [];

    const placeholders = [];
    const regex = /\{\{([^}]+)\}\}/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }

    return placeholders;
  };

  // Replace placeholders with preview values
  const replacePlaceholders = (content) => {
    if (!content) return '';

    // Replace all {{placeholders}} with their preview values
    return content.replace(/\{\{([^}]+)\}\}/g, (match, placeholder) => {
      return previewValues[placeholder] || match;
    });
  };

  // Handle placeholder value change
  const handlePlaceholderChange = (placeholder, value) => {
    setPreviewValues(prev => ({
      ...prev,
      [placeholder]: value
    }));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md max-w-xl w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => console.log('Go back to list')}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Return to canned responses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const placeholders = extractPlaceholders(response.content);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Actions */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => console.log('Go back to list')}
              className="mr-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">Canned Response Details</h1>
          </div>

          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => console.log('Edit response')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 shadow-sm"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </button>
              <button
                onClick={() => handleCopy(response.content)}
                className="inline-flex items-center px-3 py-1.5 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-sm"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                {copiedContent ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => console.log('Download response')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download
              </button>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Status:</span>
              {response.isActive ? (
                <span className="inline-flex items-center text-sm text-green-700">
                  <ToggleRight className="h-5 w-5 mr-1 text-green-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center text-sm text-gray-700">
                  <ToggleLeft className="h-5 w-5 mr-1 text-gray-400" />
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">{response.title}</h2>
                </div>

                {response.category && (
                  <div
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4"
                    style={{
                      backgroundColor: `${response.category.color}20`,
                      color: response.category.color
                    }}
                  >
                    <span className="mr-1">{getCategoryIcon(response.category.icon)}</span>
                    {response.category.name}
                  </div>
                )}

                <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap mb-4">
                  {highlightPlaceholders(response.content)}
                </div>

                {response.tags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
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
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Created by</h3>
                    <div className="flex items-center">
                      {creator ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-800 mr-2">
                            {getInitials(creator.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{creator.name}</p>
                            <p className="text-xs text-gray-500">{creator.role}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Unknown</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {formatDate(response.createdAt)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Last updated by</h3>
                    <div className="flex items-center">
                      {updater ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-800 mr-2">
                            {getInitials(updater.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{updater.name}</p>
                            <p className="text-xs text-gray-500">{updater.role}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">{creator ? creator.name : 'Unknown'}</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {formatDate(response.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Details Card */}
            {response.category && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {getCategoryIcon(response.category.icon)}
                    <h2 className="text-lg font-medium text-gray-900 ml-2">Category Details</h2>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-sm text-gray-700">{response.category.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Response SLA</p>
                      <div className="font-medium flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {response.category.firstResponseSla} min
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Resolution SLA</p>
                      <div className="font-medium flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {response.category.resolutionSla} min
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Default Priority</p>
                      <div className="font-medium mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(response.category.defaultPriority)}`}>
                          {response.category.defaultPriority}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Auto-assign Role</p>
                      <div className="font-medium flex items-center mt-1">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        {response.category.autoAssignToRole || 'None'}
                      </div>
                    </div>
                  </div>

                  {response.category.requiredSkills && response.category.requiredSkills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {response.category.requiredSkills.map(skill => (
                          <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage History Card */}
            {response.usageHistory && response.usageHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Usage History</h2>
                    <span className="text-sm text-gray-500">
                      Total: <span className="font-medium text-indigo-600">{response.usageCount}</span> uses
                    </span>
                  </div>

                  <div className="relative h-40">
                    <div className="absolute inset-0 flex items-end space-x-1">
                      {response.usageHistory.map((day) => {
                        const maxCount = Math.max(...response.usageHistory.map(d => d.count));
                        const height = day.count > 0 ? (day.count / maxCount) * 100 : 0;

                        return (
                          <div key={day.date} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-indigo-100 rounded-t"
                              style={{ height: `${height}%` }}
                            >
                              <div
                                className="w-full bg-indigo-500 rounded-t"
                                style={{ height: `${Math.min(100, height * 0.7)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{formatShortDate(day.date)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Last 7 days</span>
                    <button className="text-indigo-600 hover:text-indigo-800">
                      View detailed stats
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Preview Panel */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Code className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Preview</h2>
                </div>

                {placeholders.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Placeholders</h3>
                    <div className="space-y-2">
                      {placeholders.map(placeholder => (
                        <div key={placeholder}>
                          <label className="block text-xs text-gray-500 mb-1">
                            {placeholder}
                          </label>
                          <input
                            type="text"
                            value={previewValues[placeholder] || ''}
                            onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={`Value for ${placeholder}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Preview Result</h3>
                    <button
                      onClick={() => handleCopy(replacePlaceholders(response.content))}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      {copiedContent ? (
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
                  </div>
                  <div className="bg-indigo-50 rounded-md p-4 text-sm text-gray-800 border border-indigo-100 whitespace-pre-wrap">
                    {replacePlaceholders(response.content)}
                  </div>
                </div>
              </div>
            </div>

            {/* Response Metrics */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Response Metrics</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-md p-3 text-center">
                    <p className="text-sm text-gray-500">Character Count</p>
                    <p className="text-xl font-medium text-indigo-600 mt-1">{response.content.length}</p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 text-center">
                    <p className="text-sm text-gray-500">Word Count</p>
                    <p className="text-xl font-medium text-indigo-600 mt-1">
                      {response.content.split(/\s+/).filter(word => word.trim().length > 0).length}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 text-center">
                    <p className="text-sm text-gray-500">Placeholders</p>
                    <p className="text-xl font-medium text-indigo-600 mt-1">{placeholders.length}</p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 text-center">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-lg font-medium text-indigo-600 mt-1">
                      {new Date(response.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">System Information</h3>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Response ID</dt>
                    <dd className="text-gray-900 font-mono">{response.id.substring(0, 8)}...</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Category ID</dt>
                    <dd className="text-gray-900 font-mono">{response.categoryId ? response.categoryId.substring(0, 8) + '...' : 'None'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Created At</dt>
                    <dd className="text-gray-900">{formatDate(response.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Updated At</dt>
                    <dd className="text-gray-900">{formatDate(response.updatedAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status</dt>
                    <dd className={response.isActive ? 'text-green-600' : 'text-gray-500'}>
                      {response.isActive ? 'Active' : 'Inactive'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Delete Canned Response</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this canned response? This action cannot be undone and may affect support agents who use this response.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
