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
  Clock,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  Info,
  ArrowRightCircle,
  MoreVertical,
  Edit,
  Zap,
  Users
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';
import { useNavigate } from 'react-router-dom';

// Updated interfaces to match the actual API response structure
interface Audience {
  [key: string]: string; // Dynamic key-value pairs
}

interface Broadcast {
  _id: string;
  title: string;
  triggered_by: string;
  template_code: string;
  channel: 'email' | 'sms' | 'push';
  scheduled_at: string;
  status: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'failed';
  audience: Audience;
  notification_id: string;
  recipient_count: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const BroadcastsPage = () => {
  // State management
  const [broadcasts, setBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1
  });

  const navigate = useNavigate();

  const fetchBroadcasts = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationService.getBroadcasts({ page, limit: 10 });
      setBroadcasts(response.broadcasts);
      setPagination({
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        currentPage: response.currentPage
      });
    } catch (err) {
      setError('Failed to fetch broadcasts. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const handlePageChange = (page: any) => {
    fetchBroadcasts(page);
  };

  const handleDeleteClick = (broadcast) => {
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
      // Success toast would go here
    } catch (err) {
      // Error toast would go here
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle broadcast actions (pause, resume, etc)
  const handleActionClick = async (action, id) => {
    try {
      switch (action) {
        case 'execute':
          await notificationService.executeBroadcast(id);
          break;
        case 'pause':
          await notificationService.pauseBroadcast(id);
          break;
        case 'resume':
          await notificationService.resumeBroadcast(id);
          break;
      }
      fetchBroadcasts(pagination.currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email':
        return <Mail className="text-blue-500" />;
      case 'sms':
        return <MessageSquare className="text-emerald-500" />;
      case 'push':
        return <Bell className="text-amber-500" />;
      default:
        return <Mail className="text-slate-500" />;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-50 text-blue-500';
      case 'sms':
        return 'bg-emerald-50 text-emerald-500';
      case 'push':
        return 'bg-amber-50 text-amber-500';
      default:
        return 'bg-slate-50 text-slate-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 flex items-center">
            Draft
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 flex items-center">
            <Calendar size={12} className="mr-1" />
            Scheduled
          </span>
        );
      case 'sending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-1 animate-pulse"></span>
            Sending
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 flex items-center">
            <PauseCircle size={12} className="mr-1" />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionButtons = (broadcast) => {
    switch (broadcast.status) {
      case 'draft':
      case 'scheduled':
        return (
          <button
            onClick={() => handleActionClick('execute', broadcast._id)}
            className="p-2 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
            title="Send Now"
          >
            <PlayCircle size={18} />
          </button>
        );
      case 'sending':
        return (
          <button
            onClick={() => handleActionClick('pause', broadcast._id)}
            className="p-2 rounded-full text-slate-400 hover:text-purple-500 hover:bg-purple-50 transition-all"
            title="Pause"
          >
            <PauseCircle size={18} />
          </button>
        );
      case 'paused':
        return (
          <button
            onClick={() => handleActionClick('resume', broadcast._id)}
            className="p-2 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
            title="Resume"
          >
            <PlayCircle size={18} />
          </button>
        );
      default:
        return null;
    }
  };

  // Filtered broadcasts based on search and filters
  const filteredBroadcasts = broadcasts.filter(broadcast => {
    const matchesSearch = searchQuery === '' ||
      broadcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broadcast.template_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || broadcast.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || broadcast.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  // Empty state for when there are no broadcasts
  const EmptyState = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bell size={24} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-medium text-slate-800 mb-2">No broadcasts found</h3>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Create your first broadcast to start sending messages to your users.
      </p>
      <button
        onClick={() => navigate('/admin/communication/broadcasts/add')}
        className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-all shadow-sm"
      >
        <Plus size={18} className="inline-block mr-2" />
        Create New Broadcast
      </button>
    </div>
  );

  // Loading state
  const LoadingState = () => (
    <div className="flex justify-center items-center h-64">
      <div className="relative h-16 w-16">
        <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-slate-100"></div>
        <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h3 className="text-xl font-medium text-slate-800 mb-2">Something went wrong</h3>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        {error || "We couldn't load your broadcasts. Please try again."}
      </p>
      <button
        onClick={() => fetchBroadcasts()}
        className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-all shadow-sm"
      >
        <ArrowRightCircle size={18} className="inline-block mr-2" />
        Try Again
      </button>
    </div>
  );

  // Delete confirmation modal
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 text-center mb-2">Delete Broadcast</h3>
        <p className="text-slate-600 text-center mb-6">
          Are you sure you want to delete this broadcast? This action cannot be undone.
        </p>

        {broadcastToDelete && (
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <h4 className="font-medium text-slate-800">{broadcastToDelete.title}</h4>
            <div className="flex items-center mt-2 text-sm text-slate-500">
              <span className={`inline-flex items-center px-2 py-1 rounded-full ${getChannelColor(broadcastToDelete.channel)}`}>
                {getChannelIcon(broadcastToDelete.channel)}
                <span className="ml-1 capitalize">{broadcastToDelete.channel}</span>
              </span>
              <span className="mx-2">•</span>
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(broadcastToDelete.scheduled_at)}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Deleting...
              </>
            ) : 'Delete Broadcast'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white sticky top-0 border-b border-slate-100 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Broadcasts</h1>
              <p className="text-slate-500 text-sm">Send targeted communications to your users</p>
            </div>

            <button
              onClick={() => navigate('/admin/communication/broadcasts/add')}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-all shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              New Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search broadcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'scheduled'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setStatusFilter('sending')}
                className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'sending'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                Active
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50"
              >
                <Filter size={16} className="mr-2" />
                Filters
                <ChevronDown size={16} className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
                  <div className="p-3 border-b border-slate-100">
                    <h3 className="text-sm font-medium text-slate-700">Channel</h3>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => setChannelFilter('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${channelFilter === 'all'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      All Channels
                    </button>
                    <button
                      onClick={() => setChannelFilter('email')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'email'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <Mail size={16} className="mr-2" />
                      Email
                    </button>
                    <button
                      onClick={() => setChannelFilter('sms')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'sms'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      SMS
                    </button>
                    <button
                      onClick={() => setChannelFilter('push')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'push'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <Bell size={16} className="mr-2" />
                      Push
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Error state */}
        {error && <ErrorState />}

        {/* Loading state */}
        {!error && isLoading && <LoadingState />}

        {/* Empty state */}
        {!error && !isLoading && broadcasts.length === 0 && <EmptyState />}

        {/* Broadcast cards */}
        {!error && !isLoading && broadcasts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBroadcasts.map(broadcast => (
              <div
                key={broadcast._id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card header with channel indicator */}
                <div className={`h-2 ${broadcast.channel === 'email' ? 'bg-blue-500' :
                    broadcast.channel === 'sms' ? 'bg-emerald-500' :
                      'bg-amber-500'
                  }`}></div>

                <div className="p-6">
                  {/* Status badge and actions */}
                  <div className="flex justify-between items-start mb-4">
                    {getStatusBadge(broadcast.status)}

                    <div className="relative">
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                        <MoreVertical size={18} />
                      </button>
                      {/* Dropdown would go here */}
                    </div>
                  </div>

                  {/* Title and details */}
                  <h3 className="text-lg font-medium text-slate-800 mb-1">{broadcast.title}</h3>

                  <div className="flex items-center space-x-3 text-sm text-slate-500 mb-4">
                    <div className={`flex items-center px-2 py-1 rounded-full ${getChannelColor(broadcast.channel)}`}>
                      {getChannelIcon(broadcast.channel)}
                      <span className="ml-1 capitalize">{broadcast.channel}</span>
                    </div>

                    <div>Template: {broadcast.template_code}</div>
                  </div>

                  {/* Schedule and audience info */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="text-slate-400 mr-2" />
                      <span className="text-slate-600">{formatDate(broadcast.scheduled_at)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Users size={16} className="text-slate-400 mr-2" />
                      <div className="text-slate-600">
                        {Object.entries(broadcast.audience).map(([key, value], i, arr) => (
                          <span key={key}>
                            {key}: <span className="font-medium">{String(value)}</span>
                            {i < arr.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>

                    {broadcast.recipient_count > 0 && (
                      <div className="flex items-center text-sm">
                        <Zap size={16} className="text-slate-400 mr-2" />
                        <span className="text-slate-600">{broadcast.recipient_count} recipients</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/admin/communication/broadcasts/edit/${broadcast._id}`)}
                      className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                    >
                      <Edit size={14} className="inline-block mr-1" />
                      Edit
                    </button>

                    <div className="flex space-x-1">
                      {getActionButtons(broadcast)}

                      <button
                        onClick={() => handleDeleteClick(broadcast)}
                        className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!error && !isLoading && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
                className={`p-2 rounded-lg border ${pagination.currentPage === 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                const isCurrentPage = page === pagination.currentPage;
                const isWithinRange =
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.currentPage) <= 1;

                if (isWithinRange) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${isCurrentPage
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === 2 && pagination.currentPage > 3) ||
                  (page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2)
                ) {
                  return <span key={page} className="text-slate-400">...</span>;
                }

                return null;
              })}

              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`p-2 rounded-lg border ${pagination.currentPage === pagination.totalPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Information panel */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start">
            <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
              <Info className="text-blue-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">About Broadcasts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Broadcasts allow you to send targeted communications to your users across multiple channels.
                You can schedule broadcasts in advance, choose specific audience segments, and track delivery status.
                Use broadcasts for announcements, notifications, and keeping your users informed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default BroadcastsPage;
