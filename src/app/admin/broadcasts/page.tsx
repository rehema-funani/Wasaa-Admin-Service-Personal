import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Clock,
  Calendar,
  Trash2,
  Edit,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { notificationService } from '../../../api/services/notification';

const BroadcastsPage = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getBroadcasts();
      setBroadcasts(data);
    } catch (error) {
      console.error('Failed to fetch broadcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBroadcast = async (id) => {
    if (window.confirm('Are you sure you want to delete this broadcast?')) {
      try {
        await notificationService.deleteBroadcast(id);
        fetchBroadcasts();
      } catch (error) {
        console.error('Failed to delete broadcast:', error);
      }
    }
  };

  const handleExecuteBroadcast = async (id) => {
    try {
      await notificationService.executeBroadcast(id);
      fetchBroadcasts();
    } catch (error) {
      console.error('Failed to execute broadcast:', error);
    }
  };

  const handlePauseBroadcast = async (id) => {
    try {
      await notificationService.pauseBroadcast(id);
      fetchBroadcasts();
    } catch (error) {
      console.error('Failed to pause broadcast:', error);
    }
  };

  const handleResumeBroadcast = async (id) => {
    try {
      await notificationService.resumeBroadcast(id);
      fetchBroadcasts();
    } catch (error) {
      console.error('Failed to resume broadcast:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        color: 'bg-gray-100 text-gray-700',
        icon: <Clock size={12} className="mr-1" />
      },
      scheduled: {
        color: 'bg-blue-50 text-blue-700',
        icon: <Calendar size={12} className="mr-1" />
      },
      sending: {
        color: 'bg-yellow-50 text-yellow-700',
        icon: <Play size={12} className="mr-1" />
      },
      paused: {
        color: 'bg-orange-50 text-orange-700',
        icon: <Pause size={12} className="mr-1" />
      },
      completed: {
        color: 'bg-emerald-50 text-emerald-700',
        icon: <CheckCircle2 size={12} className="mr-1" />
      },
      failed: {
        color: 'bg-red-50 text-red-700',
        icon: <AlertCircle size={12} className="mr-1" />
      }
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredBroadcasts = broadcasts.filter(broadcast => {
    const matchesSearch = broadcast.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || broadcast.status === filter;
    return matchesSearch && matchesFilter;
  });

  const displayBroadcasts = broadcasts.length > 0 ? filteredBroadcasts : [];

  return (
    <div className="space-y-8 bg-white p-6 text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Broadcasts</h1>
        <button
          onClick={() => { }}
          className="bg-primary-500 hover:bg-primary-600 text-white text-[14px] py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Create Broadcast
        </button>
      </div>

      <div className="flex space-x-4 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search broadcasts..."
            className="w-full bg-gray-50 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-400 text-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <select
            className="appearance-none bg-gray-50 rounded-lg py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-400 text-slate-800"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sending">Sending</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {displayBroadcasts.length > 0 ? (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 py-3 px-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4 text-xs font-semibold text-slate-500 uppercase">Name</div>
                  <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase">Status</div>
                  <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase">Recipients</div>
                  <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase">Created</div>
                  <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase text-right">Actions</div>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {displayBroadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="py-4 px-6 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <div className="flex items-center">
                          <Bell size={18} className="text-primary-500 mr-3 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-slate-900">{broadcast.name}</div>
                            <div className="text-sm text-slate-500 truncate max-w-xs">{broadcast.subject}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        {getStatusBadge(broadcast.status)}
                      </div>

                      <div className="col-span-3">
                        <div className="text-sm text-slate-700">{broadcast.recipientCount} recipients</div>
                        {broadcast.status !== 'draft' && (
                          <div className="text-xs text-slate-500">
                            {broadcast.sentCount} sent
                            {broadcast.status === 'completed' && ` • ${broadcast.openRate}% open rate`}
                          </div>
                        )}
                      </div>

                      <div className="col-span-2 text-sm text-slate-700">
                        {new Date(broadcast.createdAt).toLocaleDateString()}
                      </div>

                      <div className="col-span-1 flex items-center justify-end space-x-2">
                        {broadcast.status === 'draft' && (
                          <button
                            onClick={() => handleExecuteBroadcast(broadcast.id)}
                            className="p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-sm"
                            title="Send now"
                          >
                            <Play size={14} />
                          </button>
                        )}

                        {broadcast.status === 'sending' && (
                          <button
                            onClick={() => handlePauseBroadcast(broadcast.id)}
                            className="p-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-sm"
                            title="Pause"
                          >
                            <Pause size={14} />
                          </button>
                        )}

                        {broadcast.status === 'paused' && (
                          <button
                            onClick={() => handleResumeBroadcast(broadcast.id)}
                            className="p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-sm"
                            title="Resume"
                          >
                            <Play size={14} />
                          </button>
                        )}

                        {broadcast.status === 'draft' && (
                          <button
                            onClick={() => { }}
                            className="p-1.5 bg-gray-100 text-slate-700 rounded-full hover:bg-gray-200 transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => { }}
                          className="p-1.5 bg-gray-100 text-slate-700 rounded-full hover:bg-gray-200 transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>

                        <button
                          onClick={() => handleDeleteBroadcast(broadcast.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl py-16 px-8 text-center shadow-sm">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2 text-slate-900">No broadcasts found</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {searchTerm || filter !== 'all'
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first broadcast to start sending notifications"}
              </p>
              {!searchTerm && filter === 'all' && (
                <button
                  onClick={() => { }}
                  className="bg-primary-500 hover:bg-primary-600 text-white py-2.5 px-5 rounded-lg inline-flex items-center transition-colors shadow-sm"
                >
                  <Plus size={18} className="mr-2" />
                  Create Broadcast
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BroadcastsPage;
