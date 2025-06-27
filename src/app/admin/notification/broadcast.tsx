import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Tag,
  Settings,
  Info,
  RefreshCw,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationService } from '../../../api/services/notification';

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

interface Broadcast {
  id: string;
  title: string;
  description: string;
  templateCode: string;
  channel: 'email' | 'sms' | 'push';
  audience: Audience;
  scheduledAt: string;
  status: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  metadata?: Metadata;
  priority?: 'low' | 'normal' | 'high';
  adminOverride?: boolean;
  sentCount?: number;
  totalCount?: number;
}

const BroadcastsPage: React.FC = () => {
  const navigate = useNavigate();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Delete broadcast modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState<Broadcast | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  
  const handleDeleteClick = (broadcast: Broadcast) => {
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
      toast.success('Broadcast deleted successfully', {
        style: {
          background: '#10B981',
          color: 'white',
          borderRadius: '12px'
        }
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
          background: '#10B981',
          color: 'white',
          borderRadius: '12px'
        }
      });
    } catch (err) {
      toast.error('Action failed');
      console.error(err);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={18} className="text-blue-600" />;
      case 'sms':
        return <MessageSquare size={18} className="text-green-600" />;
      case 'push':
        return <Bell size={18} className="text-amber-600" />;
      default:
        return <Mail size={18} className="text-gray-600" />;
    }
  };

  const getChannelBackground = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-100';
      case 'sms':
        return 'bg-green-100';
      case 'push':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Draft
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center">
            <Calendar size={12} className="mr-1" />
            Scheduled
          </span>
        );
      case 'sending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center">
            <RefreshCw size={12} className="mr-1 animate-spin" />
            Sending
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center">
            <PauseCircle size={12} className="mr-1" />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            High
          </span>
        );
      case 'normal':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Normal
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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

  const getProgressBar = (broadcast: Broadcast) => {
    if (!broadcast.sentCount || !broadcast.totalCount) return null;

    const progress = (broadcast.sentCount / broadcast.totalCount) * 100;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className={`h-2 rounded-full ${broadcast.status === 'failed' ? 'bg-red-500' : 'bg-primary-500'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const getActionButtons = (broadcast: Broadcast) => {
    switch (broadcast.status) {
      case 'draft':
      case 'scheduled':
        return (
          <>
            <motion.button
              onClick={() => handleActionClick('execute', broadcast.id)}
              className="p-2 hover:bg-green-100 text-gray-400 hover:text-green-600 rounded-full transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Send Now"
            >
              <PlayCircle size={16} />
            </motion.button>
          </>
        );
      case 'sending':
        return (
          <motion.button
            onClick={() => handleActionClick('pause', broadcast.id)}
            className="p-2 hover:bg-purple-100 text-gray-400 hover:text-purple-600 rounded-full transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Pause"
          >
            <PauseCircle size={16} />
          </motion.button>
        );
      case 'paused':
        return (
          <motion.button
            onClick={() => handleActionClick('resume', broadcast.id)}
            className="p-2 hover:bg-green-100 text-gray-400 hover:text-green-600 rounded-full transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchBroadcasts}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Broadcast Management</h1>
              <p className="text-gray-600 mt-1">Create and manage communication broadcasts</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => navigate('/admin/communication/broadcasts/add')}
                className="flex items-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <Plus size={18} className="mr-2" />
                New Broadcast
              </motion.button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search broadcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'scheduled'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setStatusFilter('sending')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'sending'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'completed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Completed
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors flex items-center"
              >
                <Filter size={18} className="text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
                <ChevronDown size={16} className={`ml-2 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-64 z-20">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Channel</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setChannelFilter('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${channelFilter === 'all'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      All Channels
                    </button>
                    <button
                      onClick={() => setChannelFilter('email')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'email'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Mail size={16} className="mr-2" />
                      Email
                    </button>
                    <button
                      onClick={() => setChannelFilter('sms')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'sms'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      SMS
                    </button>
                    <button
                      onClick={() => setChannelFilter('push')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${channelFilter === 'push'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
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

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading broadcasts...</p>
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Settings size={24} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900">No broadcasts found</p>
              <p className="text-sm text-gray-500 mb-4">Get started by creating your first broadcast</p>
              <button
                onClick={() => navigate('/admin/communication/broadcasts/add')}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Create Broadcast
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Broadcast
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel & Template
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule & Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audience
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {broadcasts.map((broadcast, index) => (
                      <motion.tr
                        key={broadcast.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="group hover:bg-gray-50/50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">{broadcast.title}</div>
                              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{broadcast.description}</div>
                              {broadcast.metadata?.tags && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {broadcast.metadata.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      <Tag size={10} className="mr-1" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {broadcast.priority && (
                                <div className="mt-2">
                                  {getPriorityBadge(broadcast.priority)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 ${getChannelBackground(broadcast.channel)} rounded-xl flex items-center justify-center`}>
                              {getChannelIcon(broadcast.channel)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 capitalize">{broadcast.channel}</div>
                              <div className="text-xs text-gray-500">Template: {broadcast.templateCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm text-gray-900 flex items-center">
                              <Calendar size={14} className="mr-1 text-gray-500" />
                              {formatDate(broadcast.scheduledAt)}
                            </div>
                            <div className="mt-2">
                              {getStatusBadge(broadcast.status)}
                            </div>
                            {broadcast.sentCount && broadcast.totalCount && (
                              <div className="text-xs text-gray-500 mt-2">
                                {broadcast.sentCount} / {broadcast.totalCount} recipients
                                {getProgressBar(broadcast)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">
                              Segment: <span className="font-medium">{broadcast?.audience?.segment}</span>
                            </span>
                            <span className="text-sm text-gray-900 mt-1">
                              Country: <span className="font-medium">{broadcast?.audience?.country}</span>
                            </span>
                            <span className="text-sm text-gray-900 mt-1">
                              Language: <span className="font-medium">{broadcast?.audience?.language}</span>
                            </span>
                            {broadcast?.audience?.customFilters && Object.keys(broadcast?.audience?.customFilters).length > 0 && (
                              <span className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline">
                                + Custom filters applied
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {getActionButtons(broadcast)}

                            <motion.button
                              onClick={() => navigate(`/admin/communication/broadcasts/edit/${broadcast.id}`, {
                                state: { broadcast }
                              })}
                              className="p-2 hover:bg-primary-100 text-gray-400 hover:text-primary-600 rounded-full transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit"
                              disabled={broadcast.status === 'sending' || broadcast.status === 'completed'}
                            >
                              <Edit size={16} />
                            </motion.button>

                            <motion.button
                              onClick={() => handleDeleteClick(broadcast)}
                              className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-full transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete"
                              disabled={isLoading || broadcast.status === 'sending'}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-6 bg-primary-50/70 backdrop-blur-sm rounded-2xl p-6 border border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Info size={18} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900 mb-2">About Broadcasts</h3>
              <p className="text-primary-700 text-sm leading-relaxed">
                Broadcasts allow you to send targeted communications to specific segments of your audience.
                You can schedule broadcasts in advance, select the appropriate channel (email, SMS, or push notifications),
                and track delivery progress. Use the audience targeting options to refine who receives your messages.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDeleteModal && broadcastToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200/50 p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={28} className="text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                Delete Broadcast
              </h3>

              {/* Broadcast Info */}
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 ${getChannelBackground(broadcastToDelete.channel)} rounded-xl flex items-center justify-center`}>
                    {getChannelIcon(broadcastToDelete.channel)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{broadcastToDelete.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">{broadcastToDelete.channel} broadcast</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mt-2">
                  {broadcastToDelete.description}
                </p>
                <div className="mt-3 flex items-center">
                  <Calendar size={14} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">Scheduled for {formatDate(broadcastToDelete.scheduledAt)}</span>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-red-100">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  Warning
                </h4>
                <div className="space-y-2 text-sm text-red-800">
                  <p>• This action cannot be undone</p>
                  <p>• All scheduled delivery data will be lost</p>
                  <p>• Analytics for this broadcast will be deleted</p>
                  {broadcastToDelete.status === 'scheduled' && (
                    <p className="font-medium">• This broadcast is currently scheduled and will not be sent</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={handleCancelDelete}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isDeleting}
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                  whileTap={{ scale: isDeleting ? 1 : 0.98 }}
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
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BroadcastsPage;
