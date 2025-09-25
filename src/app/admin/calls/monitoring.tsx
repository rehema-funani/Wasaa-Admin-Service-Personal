import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Phone, 
  Video,
  Activity,
  Users,
  Clock,
  Signal,
  UserX,
  Eye,
  Download,
  Play,
  MoreHorizontal,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  Globe
} from 'lucide-react';

// Mock data for active calls
const mockActiveCalls = [
  {
    id: 'C101',
    host: { id: 'U999', name: 'Peter Jones', role: 'Business' },
    participants: 3,
    duration: '12:34',
    status: 'live',
    qosScore: 95,
    qosStatus: 'excellent',
    audioEnabled: true,
    videoEnabled: true,
    region: 'Kenya',
    startTime: '14:30',
    revenue: 1500,
    type: 'video'
  },
  {
    id: 'C102',
    host: { id: 'U888', name: 'Mary Williams', role: 'Host' },
    participants: 2,
    duration: '8:15',
    status: 'live',
    qosScore: 85,
    qosStatus: 'good',
    audioEnabled: true,
    videoEnabled: false,
    region: 'Uganda',
    startTime: '14:45',
    revenue: 800,
    type: 'audio'
  },
  {
    id: 'C103',
    host: { id: 'U777', name: 'James Mwangi', role: 'Business' },
    participants: 5,
    duration: '25:12',
    status: 'unstable',
    qosScore: 72,
    qosStatus: 'fair',
    audioEnabled: true,
    videoEnabled: true,
    region: 'Tanzania',
    startTime: '14:20',
    revenue: 2500,
    type: 'group'
  }
];

// Mock data for recordings
const mockRecordings = [
  {
    id: 'R001',
    callId: 'C099',
    host: 'Sarah Johnson',
    participants: 2,
    duration: '15:30',
    size: '245 MB',
    date: '2024-09-14',
    consent: true,
    downloadUrl: '#'
  },
  {
    id: 'R002',
    callId: 'C098',
    host: 'Mike Chen',
    participants: 4,
    duration: '32:45',
    size: '512 MB',
    date: '2024-09-14',
    consent: false,
    downloadUrl: '#'
  }
];

const tabs = [
  { name: 'Active Calls', path: '', icon: Phone, count: 342 },
  { name: 'Recordings', path: 'recordings', icon: Video, count: 1250 },
  { name: 'QoS Metrics', path: 'quality', icon: Activity },
];

// QoS Status Badge Component
const QoSBadge: React.FC<{ score: number; status: string }> = ({ score, status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {score}% {status}
      </span>
    </div>
  );
};

// Active Calls Component
const ActiveCallsGrid: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalls = mockActiveCalls.filter(call => {
    const matchesSearch = call.host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || call.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search calls or hosts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="audio">Audio Only</option>
              <option value="video">Video Calls</option>
              <option value="group">Group Sessions</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Activity size={16} />
          <span>{filteredCalls.length} active calls</span>
        </div>
      </div>

      {/* Active Calls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCalls.map((call) => (
          <div
            key={call.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
          >
            {/* Call Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  call.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  call.type === 'audio' ? 'bg-green-100 dark:bg-green-900/20' :
                  'bg-purple-100 dark:bg-purple-900/20'
                }`}>
                  {call.type === 'video' ? <Video size={20} className="text-blue-600 dark:text-blue-400" /> :
                   call.type === 'audio' ? <Phone size={20} className="text-green-600 dark:text-green-400" /> :
                   <Users size={20} className="text-purple-600 dark:text-purple-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Call {call.id}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      call.host.role === 'Business' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {call.host.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  call.status === 'live' ? 'bg-green-500 animate-pulse' :
                  call.status === 'unstable' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className={`text-xs font-medium ${
                  call.status === 'live' ? 'text-green-600 dark:text-green-400' :
                  call.status === 'unstable' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Host Information */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {call.host.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{call.host.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Host • ID: {call.host.id}</p>
                </div>
              </div>
            </div>

            {/* Call Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{call.participants} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{call.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe size={14} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{call.region}</span>
                </div>
              </div>
              <div className="space-y-2">
                <QoSBadge score={call.qosScore} status={call.qosStatus} />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">KES {call.revenue}</span>
                </div>
              </div>
            </div>

            {/* Media Status */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                call.audioEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {call.audioEnabled ? <Mic size={12} /> : <MicOff size={12} />}
                Audio
              </div>
              <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                call.videoEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {call.videoEnabled ? <VideoIcon size={12} /> : <VideoOff size={12} />}
                Video
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                <Eye size={14} />
                Join as Admin
              </button>
              <button className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="Kick User">
                <UserX size={14} />
              </button>
              <button className="px-2 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="More Actions">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCalls.length === 0 && (
        <div className="text-center py-12">
          <Phone size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active calls found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

// Recordings Component
const RecordingsLibrary: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Call Recordings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage and download call recordings</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Video size={16} />
          <span>{mockRecordings.length} recordings</span>
        </div>
      </div>

      {/* Recordings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Host</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Consent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockRecordings.map((recording) => (
                <tr key={recording.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{recording.callId}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{recording.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{recording.host}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{recording.participants}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{recording.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{recording.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {recording.consent ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        <AlertTriangle size={12} className="mr-1" />
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-primary-600 hover:text-primary-800 p-1 rounded">
                        <Play size={16} />
                      </button>
                      <button className="text-primary-600 hover:text-primary-800 p-1 rounded">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// QoS Metrics Component
const QoSMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quality of Service Metrics</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monitor call quality, latency, and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average QoS */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average QoS</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Signal size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-green-600 dark:text-green-400">+2.3%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">vs last hour</span>
          </div>
        </div>

        {/* Average Latency */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45ms</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Activity size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-green-600 dark:text-green-400">-5ms</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">improvement</span>
          </div>
        </div>

        {/* Packet Loss */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Packet Loss</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0.8%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-yellow-600 dark:text-yellow-400">+0.2%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">needs attention</span>
          </div>
        </div>
      </div>

      {/* QoS Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">QoS Trends (Last 24h)</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Activity size={48} className="mx-auto mb-2 opacity-50" />
            <p>QoS trend chart will be rendered here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CallsMonitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Call Monitoring
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor active calls, review recordings, and analyze quality of service.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.path === ''}
              className={({ isActive }) =>
                [
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                ].join(' ')
              }
            >
              <tab.icon size={16} />
              {tab.name}
              {tab.count && (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium ml-1">
                  {tab.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        <Routes>
          <Route path="/" element={<ActiveCallsGrid />} />
          <Route path="recordings" element={<RecordingsLibrary />} />
          <Route path="quality" element={<QoSMetrics />} />
        </Routes>
      </div>
    </div>
  );
};

export default CallsMonitoring;