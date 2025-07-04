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
  Settings
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';
import { useNavigate } from 'react-router-dom';

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
      await notificationService.deleteBroadcast(broadcastToDelete.id);
      setBroadcasts(broadcasts.filter(b => b.id !== broadcastToDelete.id));
      setShowDeleteModal(false);
      setBroadcastToDelete(null);
      toast.success('Broadcast deleted successfully');
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
      toast.success(`Broadcast ${actionText} successfully`);
    } catch (err) {
      toast.error('Action failed');
      console.error(err);
    }
  };

  // UI Helper functions
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={16} className="text-blue-400" />;
      case 'sms':
        return <MessageSquare size={16} className="text-indigo-400" />;
      case 'push':
        return <Bell size={16} className="text-violet-400" />;
      default:
        return <Mail size={16} className="text-neutral-400" />;
    }
  };

  const getChannelBackground = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'sms':
        return 'bg-indigo-50 dark:bg-indigo-900/20';
      case 'push':
        return 'bg-violet-50 dark:bg-violet-900/20';
      default:
        return 'bg-neutral-50 dark:bg-neutral-800/50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full">
            Draft
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-full">
            <Calendar size={10} className="mr-1" />
            Scheduled
          </span>
        );
      case 'sending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300 rounded-full">
            <RefreshCw size={10} className="mr-1 animate-spin" />
            Sending
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full">
            <PauseCircle size={10} className="mr-1" />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 rounded-full">
            <CheckCircle size={10} className="mr-1" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-full">
            <AlertTriangle size={10} className="mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-300 rounded-full">
            <Zap size={10} className="mr-1" />
            High
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-300 rounded-full">
            Normal
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 rounded-full">
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
      progressColor = 'bg-red-400';
    } else if (broadcast.status === 'completed') {
      progressColor = 'bg-emerald-400';
    } else if (broadcast.status === 'paused') {
      progressColor = 'bg-purple-400';
    } else {
      progressColor = 'bg-blue-400';
    }

    return (
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1 mt-2">
        <div
          className={`h-1 rounded-full ${progressColor}`}
          style={{ width: `${progress}%` }}
        ></div>
        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
          {broadcast.sentCount.toLocaleString()} / {broadcast.totalCount.toLocaleString()} ({Math.round(progress)}%)
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
            onClick={() => handleActionClick('execute', broadcast.id)}
            className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-300 rounded-full transition-all"
            title="Send Now"
          >
            <PlayCircle size={16} />
          </motion.button>
        );
      case 'sending':
        return (
          <motion.button
            onClick={() => handleActionClick('pause', broadcast.id)}
            className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-neutral-400 hover:text-purple-600 dark:hover:text-purple-300 rounded-full transition-all"
            title="Pause"
          >
            <PauseCircle size={16} />
          </motion.button>
        );
      case 'paused':
        return (
          <motion.button
            onClick={() => handleActionClick('resume', broadcast.id)}
            className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-300 rounded-full transition-all"
            title="Resume"
          >
            <PlayCircle size={16} />
          </motion.button>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-sm max-w-md w-full">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2 text-center">Something went wrong</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-5 text-center">{error}</p>
          <button
            onClick={fetchBroadcasts}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-medium text-neutral-900 dark:text-white">Broadcast Management</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-0.5">Create and manage communication campaigns</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate('/admin/communication/broadcasts/add')}
                className="flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                disabled={isLoading}
              >
                <Plus size={16} className="mr-1.5" />
                New Broadcast
              </motion.button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search broadcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-700 border-0 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-neutral-600 transition-all text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex h-9 items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === 'all'
                    ? 'bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === 'draft'
                    ? 'bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => setStatusFilter('scheduled')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === 'scheduled'
                    ? 'bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => setStatusFilter('sending')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === 'sending'
                    ? 'bg-white dark:bg-neutral-600 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                >
                  Active
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-9 px-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors flex items-center"
                >
                  <Filter size={14} className="text-neutral-600 dark:text-neutral-300 mr-1.5" />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200">Filters</span>
                  <ChevronDown size={14} className={`ml-1.5 text-neutral-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute top-full mt-1 right-0 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-3 w-56 z-20">
                    <h3 className="text-xs font-medium text-neutral-700 dark:text-neutral-200 mb-2">Channel</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setChannelFilter('all')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs ${channelFilter === 'all'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-medium'
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }`}
                      >
                        All Channels
                      </button>
                      <button
                        onClick={() => setChannelFilter('email')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center ${channelFilter === 'email'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-medium'
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }`}
                      >
                        <Mail size={14} className="mr-1.5" />
                        Email
                      </button>
                      <button
                        onClick={() => setChannelFilter('sms')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center ${channelFilter === 'sms'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-medium'
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }`}
                      >
                        <MessageSquare size={14} className="mr-1.5" />
                        SMS
                      </button>
                      <button
                        onClick={() => setChannelFilter('push')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center ${channelFilter === 'push'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-medium'
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }`}
                      >
                        <Bell size={14} className="mr-1.5" />
                        Push
                      </button>
                    </div>

                    <h3 className="text-xs font-medium text-neutral-700 dark:text-neutral-200 mt-3 mb-2">Sort By</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          if (sortBy === 'scheduledAt') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('scheduledAt');
                            setSortOrder('desc');
                          }
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${sortBy === 'scheduledAt'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-medium'
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }`}
                      >
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1.5" />
                          Schedule Date
                        </div>
                        {sortBy === 'scheduledAt' && (
                          <ChevronDown
                            size={14}
                            className={`${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                          />
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
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${sortBy === 'priority'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-medium'
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }`}
                      >
                        <div className="flex items-center">
                          <Zap size={14} className="mr-1.5" />
                          Priority
                        </div>
                        {sortBy === 'priority' && (
                          <ChevronDown
                            size={14}
                            className={`${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                          />
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Loading broadcasts...</p>
          </div>
        ) : broadcasts?.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                {channelFilter === 'email' ? (
                  <Mail size={24} className="text-blue-500" />
                ) : channelFilter === 'sms' ? (
                  <MessageSquare size={24} className="text-indigo-500" />
                ) : channelFilter === 'push' ? (
                  <Bell size={24} className="text-violet-500" />
                ) : (
                  <Settings size={24} className="text-neutral-500" />
                )}
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No broadcasts found</h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-5 text-sm">
                {searchQuery ?
                  `No results found for "${searchQuery}". Try adjusting your search or filters.` :
                  "Get started by creating your first broadcast to communicate with your users."
                }
              </p>
              <button
                onClick={() => navigate('/admin/communication/broadcasts/add')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} className="inline mr-1.5" />
                Create Broadcast
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {broadcasts?.map((broadcast, index) => (
              <div
                key={broadcast.id}
                className="group relative bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-md ${getChannelBackground(broadcast.channel)}`}>
                        {getChannelIcon(broadcast.channel)}
                      </div>
                      <div className="ml-2">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{broadcast.channel}</div>
                        <div className="flex items-center space-x-1.5">
                          {getStatusBadge(broadcast.status)}
                          {broadcast.priority && getPriorityBadge(broadcast.priority)}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        className="p-1 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBroadcastDetail(showBroadcastDetail === broadcast.id ? null : broadcast.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {showBroadcastDetail === broadcast.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10">
                          <button
                            onClick={() => navigate(`/admin/communication/broadcasts/edit/${broadcast.id}`, {
                              state: { broadcast }
                            })}
                            className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                            disabled={broadcast.status === 'sending' || broadcast.status === 'completed'}
                          >
                            <Edit size={14} className="mr-1.5" />
                            Edit Broadcast
                          </button>
                          <button
                            onClick={() => handleDeleteClick(broadcast)}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                            disabled={broadcast.status === 'sending'}
                          >
                            <Trash2 size={14} className="mr-1.5" />
                            Delete Broadcast
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div onClick={() => navigate(`/admin/communication/broadcasts/edit/${broadcast.id}`, { state: { broadcast } })} className="cursor-pointer">
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1 line-clamp-1">
                        {broadcast.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {broadcast.description}
                      </p>
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-700 my-2.5"></div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Template</span>
                        <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                          {broadcast.template_code}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Scheduled For</span>
                        <span className="text-xs font-medium text-neutral-900 dark:text-white flex items-center">
                          <Clock size={12} className="mr-1 text-neutral-400" />
                          <span className="font-mono">{formatDate(broadcast.scheduled_at)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-md p-2.5 mb-3">
                      <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center">
                        <Users size={12} className="mr-1" />
                        Audience
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="flex items-center">
                          <User size={12} className="text-neutral-400 mr-1" />
                          <span className="text-neutral-700 dark:text-neutral-300 truncate capitalize">{broadcast.audience.gender || 'All'}</span>
                        </div>
                        <div className="flex items-center">
                          <Globe size={12} className="text-neutral-400 mr-1" />
                          <span className="text-neutral-700 dark:text-neutral-300 truncate">{broadcast.audience.country || 'Global'}</span>
                        </div>
                        {broadcast.audience.kyc_level && (
                          <div className="flex items-center">
                            <Languages size={12} className="text-neutral-400 mr-1" />
                            <span className="text-neutral-700 dark:text-neutral-300 truncate">{broadcast.audience.kyc_level}</span>
                          </div>
                        )}
                        {broadcast.audience.customFilters && Object.keys(broadcast.audience.customFilters).length > 0 && (
                          <div className="flex items-center">
                            <Sliders size={12} className="text-blue-400 mr-1" />
                            <span className="text-blue-500 dark:text-blue-400 text-xs">Custom filters</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {(broadcast.sentCount && broadcast.totalCount) && (
                      <div className="mb-3">
                        {getProgressBar(broadcast)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-1">
                    {getActionButtons(broadcast)}

                    <motion.button
                      onClick={() => navigate(`/admin/communication/broadcasts/edit/${broadcast.id}`, {
                        state: { broadcast }
                      })}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-all"
                      title="Edit"
                      disabled={broadcast.status === 'sending' || broadcast.status === 'completed'}
                    >
                      <Edit size={16} />
                    </motion.button>

                    <motion.button
                      onClick={() => handleDeleteClick(broadcast)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-all"
                      title="Delete"
                      disabled={isLoading || broadcast.status === 'sending'}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 border-l-4 border-blue-500 dark:border-blue-400">
          <div className="flex items-start sm:items-center">
            <Info size={16} className="text-blue-500 dark:text-blue-400 mt-0.5 sm:mt-0 mr-3 flex-shrink-0" />
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Broadcasts allow you to send targeted communications to specific segments of your audience.
              Schedule broadcasts in advance, select the appropriate channel, and track delivery progress.
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && broadcastToDelete && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white dark:bg-neutral-800 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-5 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                Delete Broadcast
              </h3>
              <button
                onClick={handleCancelDelete}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-md p-3 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 ${getChannelBackground(broadcastToDelete.channel)} rounded-md flex items-center justify-center`}>
                  {getChannelIcon(broadcastToDelete.channel)}
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white text-sm">{broadcastToDelete.title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{broadcastToDelete.channel} broadcast</p>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {broadcastToDelete.description}
              </p>
              <div className="mt-2 flex items-center">
                <Calendar size={12} className="text-neutral-500 dark:text-neutral-400 mr-1.5" />
                <span className="text-xs text-neutral-600 dark:text-neutral-300">Scheduled for {formatDate(broadcastToDelete.scheduledAt)}</span>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 rounded-md p-3 mb-4">
              <h4 className="font-medium text-red-600 dark:text-red-400 text-xs mb-1.5 flex items-center">
                <AlertTriangle size={14} className="mr-1.5" />
                Warning
              </h4>
              <div className="space-y-1 text-xs text-red-600 dark:text-red-300">
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
                className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-md text-sm font-medium transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} className="mr-1.5" />
                    Delete
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
