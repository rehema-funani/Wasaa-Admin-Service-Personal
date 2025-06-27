import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  RefreshCw,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  X,
  ChevronDown,
  Tag,
  Settings,
  Info,
  Edit,
  Clock,
  MoreHorizontal,
  Users,
  Globe,
  Languages,
  Sliders,
  Zap,
  Eye,
  User
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';
import { useNavigate } from 'react-router-dom';

interface Audience {
  segment: string;
  country: string;
  language: string;
  customFilters?: Record<string, any>;
}

interface Metadata {
  priority?: string;
  tags?: string[];
}

const toast = {
  success: (message: string, options?: any) => console.log('Success:', message),
  error: (message: string, options?: any) => console.error('Error:', message)
};

const BroadcastsPage = () => {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('scheduledAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBroadcastDetail, setShowBroadcastDetail] = useState<string | null>(null);

  const navigate = useNavigate();

  const motion = {
    div: (props: any) => <div {...props} />,
    button: (props: any) => <button {...props} />
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
      setError('Failed to fetch broadcasts. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete broadcast
  const handleDeleteClick = (broadcast: any) => {
    setBroadcastToDelete(broadcast);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!broadcastToDelete) return;

    setIsDeleting(true);
    try {
      await notificationService.deleteBroadcast(broadcastToDelete._id);
      setBroadcasts(broadcasts.filter(b => b._id !== broadcastToDelete._id));
      setShowDeleteModal(false);
      setBroadcastToDelete(null);
      toast.success('Broadcast deleted successfully', {
        style: {
          background: '#111827',
          color: 'white',
          borderRadius: '12px'
        },
        icon: '🗑️'
      });
    } catch (err) {
      toast.error('Failed to delete broadcast');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBroadcastToDelete(null);
  };

  // Broadcast actions
  const handleActionClick = async (action: string, id: string) => {
    try {
      let actionText = '';
      let response;

      switch (action) {
        case 'execute':
          response = await notificationService.executeBroadcast(id);
          actionText = 'executed';
          break;
        case 'pause':
          response = await notificationService.pauseBroadcast(id);
          actionText = 'paused';
          break;
        case 'resume':
          response = await notificationService.resumeBroadcast(id);
          actionText = 'resumed';
          break;
        default:
          return;
      }

      // Refresh broadcasts after action
      fetchBroadcasts();

      toast.success(`Broadcast ${actionText} successfully`, {
        style: {
          background: '#111827',
          color: 'white',
          borderRadius: '12px'
        }
      });
    } catch (err) {
      toast.error('Action failed');
      console.error(err);
    }
  };

  // UI Helper functions
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={18} className="text-blue-500" />;
      case 'sms':
        return <MessageSquare size={18} className="text-emerald-500" />;
      case 'push':
        return <Bell size={18} className="text-amber-500" />;
      default:
        return <Mail size={18} className="text-gray-500" />;
    }
  };

  const getChannelBackground = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'sms':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'push':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const getChannelTextColor = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'text-blue-500';
      case 'sms':
        return 'text-emerald-500';
      case 'push':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            Draft
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-200">
            <Calendar size={12} className="mr-1" />
            Scheduled
          </span>
        );
      case 'sending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-200">
            <RefreshCw size={12} className="mr-1 animate-spin" />
            Sending
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 border border-purple-200">
            <PauseCircle size={12} className="mr-1" />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 border border-red-200">
            <AlertTriangle size={12} className="mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 border border-red-200">
            <Zap size={12} className="mr-1" />
            High
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-200">
            Normal
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressBar = (broadcast: any) => {
    if (!broadcast.sentCount || !broadcast.totalCount) return null;

    const progress = (broadcast.sentCount / broadcast.totalCount) * 100;

    let progressColor;
    if (broadcast.status === 'failed') {
      progressColor = 'bg-red-500';
    } else if (broadcast.status === 'completed') {
      progressColor = 'bg-emerald-500';
    } else if (broadcast.status === 'paused') {
      progressColor = 'bg-purple-500';
    } else {
      progressColor = 'bg-blue-500';
    }

    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
        <div
          className={`h-1.5 rounded-full ${progressColor}`}
          style={{ width: `${progress}%` }}
        ></div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {broadcast.sentCount.toLocaleString()} / {broadcast.totalCount.toLocaleString()} recipients ({Math.round(progress)}%)
        </div>
      </div>
    );
  };

  const getActionButtons = (broadcast: any) => {
    switch (broadcast.status) {
      case 'draft':
      case 'scheduled':
        return (
          <motion.button
            onClick={() => handleActionClick('execute', broadcast._id)}
            className="p-2 hover:bg-emerald-100 text-gray-500 hover:text-emerald-600 rounded-full transition-all"
            title="Send Now"
          >
            <PlayCircle size={18} />
          </motion.button>
        );
      case 'sending':
        return (
          <motion.button
            onClick={() => handleActionClick('pause', broadcast._id)}
            className="p-2 hover:bg-purple-100 text-gray-500 hover:text-purple-600 rounded-full transition-all"
            title="Pause"
          >
            <PauseCircle size={18} />
          </motion.button>
        );
      case 'paused':
        return (
          <motion.button
            onClick={() => handleActionClick('resume', broadcast._id)}
            className="p-2 hover:bg-emerald-100 text-gray-500 hover:text-emerald-600 rounded-full transition-all"
            title="Resume"
          >
            <PlayCircle size={18} />
          </motion.button>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl  border border-gray-200 dark:border-gray-700 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={28} className="text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchBroadcasts}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors  shadow-blue-600/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Broadcast Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage communication broadcasts</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-600 dark:text-gray-300"
              >
                {viewMode === 'grid' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                )}
              </motion.button>

              <motion.button
                onClick={() => navigate('/admin/communication/broadcasts/add')}
                className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all  shadow-blue-600/20"
                disabled={isLoading}
              >
                <Plus size={18} className="mr-2" />
                New Broadcast
              </motion.button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search broadcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:bg-white dark:focus:bg-gray-600 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex h-10 items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'all'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white '
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'draft'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white '
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => setStatusFilter('scheduled')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'scheduled'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white '
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => setStatusFilter('sending')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === 'sending'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white '
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  Active
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors flex items-center"
                >
                  <Filter size={16} className="text-gray-600 dark:text-gray-300 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Filters</span>
                  <ChevronDown size={16} className={`ml-2 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-xl  border border-gray-200 dark:border-gray-700 p-4 w-64 z-20">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Channel</h3>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setChannelFilter('all')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${channelFilter === 'all'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        All Channels
                      </button>
                      <button
                        onClick={() => setChannelFilter('email')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'email'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <Mail size={16} className="mr-2" />
                        Email
                      </button>
                      <button
                        onClick={() => setChannelFilter('sms')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'sms'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        SMS
                      </button>
                      <button
                        onClick={() => setChannelFilter('push')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'push'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <Bell size={16} className="mr-2" />
                        Push
                      </button>
                    </div>

                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-4 mb-3">Sort By</h3>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          if (sortBy === 'scheduledAt') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('scheduledAt');
                            setSortOrder('desc');
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${sortBy === 'scheduledAt'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2" />
                          Schedule Date
                        </div>
                        {sortBy === 'scheduledAt' && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (sortBy === 'priority') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('priority');
                            setSortOrder('desc');
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${sortBy === 'priority'
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <div className="flex items-center">
                          <Zap size={16} className="mr-2" />
                          Priority
                        </div>
                        {sortBy === 'priority' && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading broadcasts...</p>
          </div>
        ) : broadcasts?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl  border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                {channelFilter === 'email' ? (
                  <Mail size={32} className="text-blue-600 dark:text-blue-400" />
                ) : channelFilter === 'sms' ? (
                  <MessageSquare size={32} className="text-emerald-600 dark:text-emerald-400" />
                ) : channelFilter === 'push' ? (
                  <Bell size={32} className="text-amber-600 dark:text-amber-400" />
                ) : (
                  <Settings size={32} className="text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No broadcasts found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                {searchQuery ?
                  `No results found for "${searchQuery}". Try adjusting your search or filters.` :
                  "Get started by creating your first broadcast to communicate with your users."
                }
              </p>
              <button
                onClick={() => navigate('/admin/communication/broadcasts/add')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors  shadow-blue-600/20"
              >
                <Plus size={18} className="inline mr-2" />
                Create Broadcast
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {broadcasts?.map((broadcast, index) => (
              <div
                key={broadcast._id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl  hover: border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
              >
                <div className={`h-1.5 w-full ${broadcast.channel === 'email' ? 'bg-blue-500' :
                  broadcast.channel === 'sms' ? 'bg-emerald-500' :
                    'bg-amber-500'
                  }`}></div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getChannelBackground(broadcast.channel)} border`}>
                      {getChannelIcon(broadcast.channel)}
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusBadge(broadcast.status)}

                      <div className="relative">
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBroadcastDetail(showBroadcastDetail === broadcast._id ? null : broadcast._id);
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {showBroadcastDetail === broadcast._id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl  border border-gray-200 dark:border-gray-700 py-2 z-10">
                            <button
                              onClick={() => navigate(`/admin/communication/broadcasts/edit/${broadcast._id}`, {
                                state: { broadcast }
                              })}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                              disabled={broadcast.status === 'sending' || broadcast.status === 'completed'}
                            >
                              <Edit size={16} className="mr-2" />
                              Edit Broadcast
                            </button>
                            <button
                              onClick={() => handleDeleteClick(broadcast)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                              disabled={broadcast.status === 'sending'}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete Broadcast
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {broadcast.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {broadcast.description}
                    </p>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-3"></div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Template</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {broadcast.template_code}
                      </span>
                    </div>
                    {broadcast.status === 'sent' ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recipients</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <User size={14} className="mr-1 text-gray-400" />
                          {broadcast.recipient_count}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Scheduled For</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <Clock size={14} className="mr-1 text-gray-400" />
                          {formatDate(broadcast.scheduled_at)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 mb-4">
                    <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center">
                      <Users size={14} className="mr-1" />
                      Audience
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </div>
                        <span className="ml-2 text-gray-700 truncate capitalize">{broadcast.audience.gender || ''}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                          <Globe size={14} />
                        </div>
                        <span className="ml-2 text-gray-700 dark:text-gray-300 truncate">{broadcast.audience.country}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                          <Languages size={14} />
                        </div>
                        <span className="ml-2 text-gray-700 dark:text-gray-300 truncate">{broadcast.audience.kyc_level}</span>
                      </div>
                      {broadcast.audience.customFilters && Object.keys(broadcast.audience.customFilters).length > 0 && (
                        <div className="flex items-center">
                          <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                            <Sliders size={14} />
                          </div>
                          <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs font-medium">
                            + Custom filters applied
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(broadcast.sentCount && broadcast.totalCount) && (
                    <div className="mb-4">
                      {getProgressBar(broadcast)}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {broadcast.priority && (
                      <div>
                        {getPriorityBadge(broadcast.priority)}
                      </div>
                    )}

                    <div className="flex items-center ml-auto space-x-1">
                      {getActionButtons(broadcast)}

                      <motion.button
                        onClick={() => navigate(`/admin/communication/broadcasts/edit/${broadcast._id}`, {
                          state: { broadcast }
                        })}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-all"
                        title="Edit"
                        disabled={broadcast.status === 'sending' || broadcast.status === 'completed'}
                      >
                        <Edit size={18} />
                      </motion.button>

                      <motion.button
                        onClick={() => handleDeleteClick(broadcast)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-all"
                        title="Delete"
                        disabled={isLoading || broadcast.status === 'sending'}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30"
        >
          <div className="flex items-start sm:items-center flex-col sm:flex-row sm:space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 sm:mb-0">
              <Info size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">About Broadcasts</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Broadcasts allow you to send targeted communications to specific segments of your audience.
                You can schedule broadcasts in advance, select the appropriate channel (email, SMS, or push notifications),
                and track delivery progress. Use the audience targeting options to refine who receives your messages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && broadcastToDelete && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-red-600 dark:text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Delete Broadcast
            </h3>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 ${getChannelBackground(broadcastToDelete.channel)} rounded-xl flex items-center justify-center`}>
                  {getChannelIcon(broadcastToDelete.channel)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{broadcastToDelete.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{broadcastToDelete.channel} broadcast</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {broadcastToDelete.description}
              </p>
              <div className="mt-3 flex items-center">
                <Calendar size={14} className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Scheduled for {formatDate(broadcastToDelete.scheduledAt)}</span>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 mb-5 border border-red-200 dark:border-red-800/30">
              <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Warning
              </h4>
              <div className="space-y-1.5 text-sm text-red-700 dark:text-red-300">
                <p>• This action cannot be undone</p>
                <p>• All scheduled delivery data will be lost</p>
                <p>• Analytics for this broadcast will be deleted</p>
                {broadcastToDelete.status === 'scheduled' && (
                  <p className="font-medium">• This broadcast is currently scheduled and will not be sent</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center  shadow-red-600/20"
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
