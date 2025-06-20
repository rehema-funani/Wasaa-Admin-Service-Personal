import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BarChart2,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Info,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Search,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';

const BroadcastDetailPage = ({ broadcastId }) => {
  const [broadcast, setBroadcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (broadcastId) {
      fetchBroadcast();
    }
  }, [broadcastId]);

  const fetchBroadcast = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getBroadcast(broadcastId);
      setBroadcast(data);
    } catch (error) {
      console.error('Failed to fetch broadcast:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteBroadcast = async () => {
    try {
      await notificationService.executeBroadcast(broadcastId);
      fetchBroadcast();
    } catch (error) {
      console.error('Failed to execute broadcast:', error);
    }
  };

  const handlePauseBroadcast = async () => {
    try {
      await notificationService.pauseBroadcast(broadcastId);
      fetchBroadcast();
    } catch (error) {
      console.error('Failed to pause broadcast:', error);
    }
  };

  const handleResumeBroadcast = async () => {
    try {
      await notificationService.resumeBroadcast(broadcastId);
      fetchBroadcast();
    } catch (error) {
      console.error('Failed to resume broadcast:', error);
    }
  };

  const handleDeleteBroadcast = async () => {
    try {
      await notificationService.deleteBroadcast(broadcastId);
      // Navigate back to broadcasts list
      // history.push('/broadcasts');
    } catch (error) {
      console.error('Failed to delete broadcast:', error);
      setConfirmDelete(false);
    }
  };

  const handleDuplicateBroadcast = async () => {
    // Implement when endpoint is available
    alert('Duplicate functionality not implemented yet');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        color: 'bg-gray-200',
        textColor: 'text-gray-700',
        icon: <Clock size={16} className="mr-1.5" />
      },
      scheduled: {
        color: 'bg-blue-100',
        textColor: 'text-blue-700',
        icon: <Calendar size={16} className="mr-1.5" />
      },
      sending: {
        color: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        icon: <Play size={16} className="mr-1.5" />
      },
      paused: {
        color: 'bg-orange-100',
        textColor: 'text-orange-700',
        icon: <Pause size={16} className="mr-1.5" />
      },
      completed: {
        color: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        icon: <CheckCircle2 size={16} className="mr-1.5" />
      },
      failed: {
        color: 'bg-red-100',
        textColor: 'text-red-700',
        icon: <X size={16} className="mr-1.5" />
      }
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${config.color} ${config.textColor}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Mock data for preview - would be replaced with actual data from API
  const mockBroadcast = {
    id: broadcastId || 'mock-id',
    name: 'June Product Update',
    status: 'completed',
    template: {
      id: 'template-1',
      name: 'Product Update Template'
    },
    subject: 'New Features Now Available!',
    content: 'Hello {{firstName}},\n\nWe\'re excited to announce new features in our platform!\n\nCheck out our updated dashboard with enhanced analytics and reporting capabilities.\n\nLet us know what you think!\n\nBest,\nThe Team',
    createdAt: '2025-06-15T10:30:00Z',
    updatedAt: '2025-06-15T15:45:00Z',
    sentAt: '2025-06-16T08:00:00Z',
    stats: {
      total: 2547,
      sent: 2547,
      delivered: 2520,
      opened: 1823,
      clicked: 943,
      bounced: 27,
      complaints: 3,
      openRate: 72.3,
      clickRate: 37.4,
      clickToOpenRate: 51.7,
      bounceRate: 1.1
    },
    schedule: {
      sendAt: '2025-06-16T08:00:00Z',
      timezone: 'America/New_York'
    }
  };

  // Use mock data for now - would be replaced with real data
  const broadcastData = broadcast || mockBroadcast;

  return (
    <div className="space-y-6 bg-white text-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => { }}
            className="mr-4 p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{broadcastData.name}</h1>
            <div className="flex items-center mt-1 space-x-4">
              {getStatusBadge(broadcastData.status)}
              <span className="text-sm text-slate-500">
                Created {new Date(broadcastData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          {broadcastData.status === 'draft' && (
            <button
              onClick={handleExecuteBroadcast}
              className="py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center shadow-sm"
            >
              <Play size={18} className="mr-2" />
              Send Now
            </button>
          )}

          {broadcastData.status === 'sending' && (
            <button
              onClick={handlePauseBroadcast}
              className="py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center shadow-sm"
            >
              <Pause size={18} className="mr-2" />
              Pause
            </button>
          )}

          {broadcastData.status === 'paused' && (
            <button
              onClick={handleResumeBroadcast}
              className="py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center shadow-sm"
            >
              <Play size={18} className="mr-2" />
              Resume
            </button>
          )}

          {broadcastData.status === 'draft' && (
            <button
              onClick={() => { }}
              className="p-2 bg-gray-100 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
            >
              <Edit size={18} />
            </button>
          )}

          <button
            onClick={handleDuplicateBroadcast}
            className="p-2 bg-gray-100 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
          >
            <Copy size={18} />
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Delete Broadcast?</h3>
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete this broadcast? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="py-2 px-4 bg-gray-100 text-slate-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBroadcast}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'overview'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'analytics'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'content'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'logs'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              onClick={() => setActiveTab('logs')}
            >
              Logs
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Recipients</p>
                      <h3 className="text-2xl font-semibold text-slate-900">{broadcastData.stats.total.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Users size={20} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Open Rate</p>
                      <h3 className="text-2xl font-semibold text-slate-900">{broadcastData.stats.openRate}%</h3>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Eye size={20} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Click Rate</p>
                      <h3 className="text-2xl font-semibold text-slate-900">{broadcastData.stats.clickRate}%</h3>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <ExternalLink size={20} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Bounce Rate</p>
                      <h3 className="text-2xl font-semibold text-slate-900">{broadcastData.stats.bounceRate}%</h3>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <X size={20} className="text-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-medium mb-4 flex items-center text-slate-900">
                    <BarChart2 size={18} className="mr-2 text-emerald-500" />
                    Engagement Metrics
                  </h3>

                  <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-slate-500">Chart would be displayed here</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-medium mb-4 text-slate-900">Broadcast Details</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Template</p>
                      <p className="text-sm text-slate-800">{broadcastData.template.name}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Subject Line</p>
                      <p className="text-sm text-slate-800">{broadcastData.subject}</p>
                    </div>

                    {broadcastData.status !== 'draft' && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Sent On</p>
                        <p className="text-sm text-slate-800">
                          {new Date(broadcastData.sentAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    )}

                    {broadcastData.status === 'scheduled' && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Scheduled For</p>
                        <p className="text-sm text-slate-800">
                          {new Date(broadcastData.schedule.sendAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            timeZone: broadcastData.schedule.timezone
                          })}
                          {' '}
                          ({broadcastData.schedule.timezone})
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Created By</p>
                      <p className="text-sm text-slate-800">John Doe</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                      <p className="text-sm text-slate-800">
                        {new Date(broadcastData.updatedAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <p className="text-slate-500 text-xs uppercase mb-3">Delivery</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Sent</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.sent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Delivered</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.delivered.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Bounced</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.bounced.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Complaints</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.complaints.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <p className="text-slate-500 text-xs uppercase mb-3">Engagement</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Opens</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.opened.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Clicks</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.clicked.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Open Rate</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.openRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Click-to-Open Rate</span>
                      <span className="font-medium text-slate-900">{broadcastData.stats.clickToOpenRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-slate-900">Engagement Over Time</h3>
                    <div className="flex space-x-2">
                      <button className="py-1 px-2 text-xs bg-gray-100 text-slate-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors">
                        Hourly
                      </button>
                      <button className="py-1 px-2 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors">
                        Daily
                      </button>
                    </div>
                  </div>

                  <div className="h-48 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-slate-500">Time-series chart would be displayed here</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-200">
                  <h3 className="font-medium text-slate-900">Recipient Activity</h3>
                </div>

                <div className="p-5 flex justify-center border-b border-gray-200 bg-gray-50">
                  <p className="text-slate-500">Detailed recipient table would be displayed here</p>
                </div>

                <div className="flex justify-between items-center px-5 py-3">
                  <button className="py-1.5 px-3 text-sm bg-gray-100 text-slate-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors flex items-center shadow-sm">
                    <Download size={16} className="mr-2" />
                    Export Data
                  </button>

                  <div className="flex items-center space-x-2">
                    <button className="py-1.5 px-3 text-sm bg-gray-100 text-slate-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors shadow-sm">
                      Previous
                    </button>
                    <span className="text-sm text-slate-700">Page 1 of 5</span>
                    <button className="py-1.5 px-3 text-sm bg-gray-100 text-slate-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors shadow-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-medium mb-3 text-slate-900">Email Details</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Subject Line</p>
                      <p className="text-sm font-medium text-slate-900">{broadcastData.subject}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">From Name</p>
                      <p className="text-sm text-slate-800">Company Name</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Reply-To</p>
                      <p className="text-sm text-slate-800">support@company.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-slate-900">Email Content</h3>
                    <button className="text-xs text-emerald-500 hover:text-emerald-600 flex items-center">
                      <ExternalLink size={14} className="mr-1" />
                      View in Browser
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <div className="text-xs text-slate-500 truncate flex-1">
                        {broadcastData.subject}
                      </div>
                    </div>

                    <div className="bg-white p-4 h-96 overflow-auto border-t border-gray-200">
                      <div className="text-slate-900 text-sm whitespace-pre-wrap">
                        {broadcastData.content
                          .replace(/{{firstName}}/g, 'John')
                          .replace(/{{lastName}}/g, 'Doe')
                          .replace(/{{email}}/g, 'john.doe@example.com')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-medium mb-3 text-slate-900">Content Performance</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Open Rate</span>
                        <span>{broadcastData.stats.openRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${broadcastData.stats.openRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Click Rate</span>
                        <span>{broadcastData.stats.clickRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${broadcastData.stats.clickRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Click-to-Open Rate</span>
                        <span>{broadcastData.stats.clickToOpenRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${broadcastData.stats.clickToOpenRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-medium mb-3 text-slate-900">Links Performance</h3>

                  <div className="space-y-3">
                    <div className="rounded border border-gray-200 p-3 bg-gray-50">
                      <p className="text-xs text-slate-500 mb-1">Link</p>
                      <p className="text-sm truncate mb-2 text-slate-900">https://example.com/dashboard</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">394 clicks</span>
                        <span className="text-xs font-medium text-slate-900">41.8%</span>
                      </div>
                    </div>

                    <div className="rounded border border-gray-200 p-3 bg-gray-50">
                      <p className="text-xs text-slate-500 mb-1">Link</p>
                      <p className="text-sm truncate mb-2 text-slate-900">https://example.com/features</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">287 clicks</span>
                        <span className="text-xs font-medium text-slate-900">30.4%</span>
                      </div>
                    </div>

                    <div className="rounded border border-gray-200 p-3 bg-gray-50">
                      <p className="text-xs text-slate-500 mb-1">Link</p>
                      <p className="text-sm truncate mb-2 text-slate-900">https://example.com/support</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">168 clicks</span>
                        <span className="text-xs font-medium text-slate-900">17.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-slate-900">Activity Logs</h3>
                <button className="py-1.5 px-3 text-sm bg-gray-100 text-slate-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors flex items-center shadow-sm">
                  <Download size={16} className="mr-2" />
                  Export Logs
                </button>
              </div>

              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-800"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>

                    <div className="flex space-x-2">
                      <button className="py-1 px-2 text-xs bg-gray-100 text-slate-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors">
                        All Activities
                      </button>
                      <button className="py-1 px-2 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors">
                        Last 24 Hours
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-slate-900">Broadcast Completed</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              Broadcast was successfully delivered to all recipients.
                            </p>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(broadcastData.sentAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <Mail size={16} className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-slate-900">Broadcast Started</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              Broadcast sending process was initiated.
                            </p>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(broadcastData.sentAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="p-2 bg-purple-50 rounded-lg mr-3">
                        <FileText size={16} className="text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-slate-900">Broadcast Created</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              New broadcast was created by John Doe.
                            </p>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(broadcastData.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <span className="text-sm text-slate-500">Showing 3 of 3 logs</span>

                  <div className="flex items-center space-x-2">
                    <button
                      className="py-1 px-2 text-xs bg-gray-100 text-slate-400 border border-gray-300 rounded cursor-not-allowed"
                      disabled
                    >
                      Previous
                    </button>
                    <button
                      className="py-1 px-2 text-xs bg-gray-100 text-slate-400 border border-gray-300 rounded cursor-not-allowed"
                      disabled
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcastDetailPage;
