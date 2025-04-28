import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Check,
  X,
  Eye,
  Clock,
  Search,
  Filter,
  User,
  MessageSquare,
  Flag,
  Trash2,
  Ban,
  ThumbsDown,
  UserX,
  ShieldAlert,
  ShieldCheck,
  MessageSquareWarning,
  FileWarning,
  Gavel,
  ChevronDown,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  PauseCircle,
  Users
} from 'lucide-react';

const page = () => {
  const [activeTab, setActiveTab] = useState('reported');
  const [reportedStreams, setReportedStreams] = useState<typeof sampleReportedStreams>([]);
  const [reportedMessages, setReportedMessages] = useState<typeof sampleReportedMessages>([]);
  const [bannedUsers, setBannedUsers] = useState<typeof sampleBannedUsers>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [moderationStatus, setModerationStatus] = useState('all');
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    // Simulate API call to fetch moderation data
    setIsLoading(true);
    setTimeout(() => {
      setReportedStreams(sampleReportedStreams);
      setReportedMessages(sampleReportedMessages);
      setBannedUsers(sampleBannedUsers);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleModerationStatusChange = (status: any) => {
    setModerationStatus(status);
  };

  const handleReportTypeChange = (type: any) => {
    setReportType(type);
  };

  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
  };

  // Filter content based on active filters and search query
  const getFilteredContent = () => {
    if (activeTab === 'reported') {
      return reportedStreams.filter(stream => {
        // Filter by search query
        const matchesSearch =
          stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stream.streamer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stream.reportReason.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by moderation status
        const matchesStatus =
          moderationStatus === 'all' ||
          stream.status === moderationStatus;

        // Filter by report type
        const matchesType =
          reportType === 'all' ||
          stream.reportReason.toLowerCase().includes(reportType.toLowerCase());

        return matchesSearch && matchesStatus && matchesType;
      });
    } else if (activeTab === 'messages') {
      return reportedMessages.filter(message => {
        // Filter by search query
        const matchesSearch =
          message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.reportReason.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by moderation status
        const matchesStatus =
          moderationStatus === 'all' ||
          message.status === moderationStatus;

        // Filter by report type
        const matchesType =
          reportType === 'all' ||
          message.reportReason.toLowerCase().includes(reportType.toLowerCase());

        return matchesSearch && matchesStatus && matchesType;
      });
    } else {
      return bannedUsers.filter(user => {
        // Filter by search query
        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.reason.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      });
    }
  };

  const filteredContent = getFilteredContent();

  // Approve reported content
  const handleApprove = (id: any) => {
    if (activeTab === 'reported') {
      setReportedStreams(reportedStreams.map(stream =>
        stream.id === id ? { ...stream, status: 'approved' } : stream
      ));
    } else if (activeTab === 'messages') {
      setReportedMessages(reportedMessages.map(message =>
        message.id === id ? { ...message, status: 'approved' } : message
      ));
    }
  };

  // Reject/remove reported content
  const handleReject = (id: any) => {
    if (activeTab === 'reported') {
      setReportedStreams(reportedStreams.map(stream =>
        stream.id === id ? { ...stream, status: 'rejected' } : stream
      ));
    } else if (activeTab === 'messages') {
      setReportedMessages(reportedMessages.map(message =>
        message.id === id ? { ...message, status: 'rejected' } : message
      ));
    }
  };

  // Unban a user
  const handleUnban = (id: any) => {
    setBannedUsers(bannedUsers.filter(user => user.id !== id));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Content Moderation</h1>
          <p className="text-gray-500 mt-1">Review and moderate reported content to maintain platform standards</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm hover:bg-indigo-700 flex items-center">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm shadow-sm hover:bg-gray-50 flex items-center">
            <Shield size={16} className="mr-2" />
            Moderation Settings
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Pending Reports</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {reportedStreams.filter(s => s.status === 'pending').length +
                reportedMessages.filter(m => m.status === 'pending').length}
            </h3>
            <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AlertTriangle size={20} className="text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Banned Users</p>
            <h3 className="text-lg font-semibold text-gray-800">{bannedUsers.length}</h3>
            <p className="text-xs text-red-600 mt-1">Permanently restricted</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <UserX size={20} className="text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Average Response Time</p>
            <h3 className="text-lg font-semibold text-gray-800">23 min</h3>
            <p className="text-xs text-green-600 mt-1">-7 min from last week</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Clock size={20} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Active Moderators</p>
            <h3 className="text-lg font-semibold text-gray-800">14</h3>
            <p className="text-xs text-green-600 mt-1">3 online now</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <ShieldCheck size={20} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${activeTab === 'reported'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              onClick={() => setActiveTab('reported')}
            >
              <AlertTriangle size={16} className="mr-2" />
              Reported Streams
              <span className="ml-2 bg-red-100 text-red-600 text-xs rounded-full px-2 py-0.5">
                {reportedStreams.filter(s => s.status === 'pending').length}
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${activeTab === 'messages'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquareWarning size={16} className="mr-2" />
              Reported Messages
              <span className="ml-2 bg-red-100 text-red-600 text-xs rounded-full px-2 py-0.5">
                {reportedMessages.filter(m => m.status === 'pending').length}
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${activeTab === 'banned'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              onClick={() => setActiveTab('banned')}
            >
              <Ban size={16} className="mr-2" />
              Banned Users
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                {bannedUsers.length}
              </span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={activeTab === 'banned' ? "Search banned users..." : "Search reported content..."}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {activeTab !== 'banned' && (
            <>
              <div className="relative">
                <button className="px-3 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm flex items-center w-full md:w-auto justify-between">
                  <div className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    Status:
                    <span className="ml-1 font-medium">
                      {moderationStatus === 'all' ? 'All' :
                        moderationStatus === 'pending' ? 'Pending' :
                          moderationStatus === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 hidden">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleModerationStatusChange('all')}>All</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleModerationStatusChange('pending')}>Pending</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleModerationStatusChange('approved')}>Approved</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleModerationStatusChange('rejected')}>Rejected</button>
                </div>
              </div>

              <div className="relative">
                <button className="px-3 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm flex items-center w-full md:w-auto justify-between">
                  <div className="flex items-center">
                    <Flag size={16} className="mr-2" />
                    Report Type:
                    <span className="ml-1 font-medium">
                      {reportType === 'all' ? 'All' :
                        reportType === 'inappropriate' ? 'Inappropriate' :
                          reportType === 'harassment' ? 'Harassment' :
                            reportType === 'violence' ? 'Violence' : 'Other'}
                    </span>
                  </div>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 hidden">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleReportTypeChange('all')}>All Types</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleReportTypeChange('inappropriate')}>Inappropriate</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleReportTypeChange('harassment')}>Harassment</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleReportTypeChange('violence')}>Violence</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleReportTypeChange('other')}>Other</button>
                </div>
              </div>
            </>
          )}

          <div className="relative">
            <button className="px-3 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm flex items-center w-full md:w-auto justify-between">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                Date:
                <span className="ml-1 font-medium">
                  {dateRange === 'all' ? 'All Time' :
                    dateRange === 'today' ? 'Today' :
                      dateRange === 'week' ? 'This Week' : 'This Month'}
                </span>
              </div>
              <ChevronDown size={16} className="ml-2" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 hidden">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleDateRangeChange('all')}>All Time</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleDateRangeChange('today')}>Today</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleDateRangeChange('week')}>This Week</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => handleDateRangeChange('month')}>This Month</button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading moderation data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.length > 0 ? (
                activeTab === 'reported' ? (
                  filteredContent
                    .filter((item): item is Stream => 'title' in item && 'streamer' in item && 'reportDetails' in item)
                    .map(stream => (
                      <ReportedStreamCard
                        key={stream.id}
                        stream={stream}
                        onApprove={() => handleApprove(stream.id)}
                        onReject={() => handleReject(stream.id)}
                      />
                    ))
                ) : activeTab === 'messages' ? (
                  filteredContent
                    .filter((item): item is typeof sampleReportedMessages[0] => 'content' in item && 'user' in item)
                    .map(message => (
                      <ReportedMessageCard
                        key={message.id}
                        message={message}
                        onApprove={() => handleApprove(message.id)}
                        onReject={() => handleReject(message.id)}
                      />
                    ))
                ) : (
                  filteredContent
                    .filter((item): item is typeof sampleBannedUsers[0] => 'email' in item && 'reason' in item)
                    .map(user => (
                      <BannedUserCard
                        key={user.id}
                        user={user}
                        onUnban={() => handleUnban(user.id)}
                      />
                    ))
                )
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'reported' ? (
                      <ShieldCheck size={24} className="text-green-500" />
                    ) : activeTab === 'messages' ? (
                      <MessageSquare size={24} className="text-green-500" />
                    ) : (
                      <Users size={24} className="text-green-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No content found</h3>
                  <p className="text-gray-500">
                    {activeTab === 'reported' ? 'No reported streams match your filters' :
                      activeTab === 'messages' ? 'No reported messages match your filters' :
                        'No banned users match your search'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Moderation Guidelines */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">Moderation Guidelines</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center mb-3">
              <Shield size={18} className="text-indigo-600 mr-2" />
              <h4 className="font-medium text-indigo-800">Content Policy</h4>
            </div>
            <p className="text-sm text-indigo-700">Content should adhere to community guidelines. Remove any hate speech, explicit material, or copyrighted content.</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <div className="flex items-center mb-3">
              <AlertTriangle size={18} className="text-yellow-600 mr-2" />
              <h4 className="font-medium text-yellow-800">Report Handling</h4>
            </div>
            <p className="text-sm text-yellow-700">Review all reports within 24 hours. Prioritize content with multiple reports or concerning violence/harassment.</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center mb-3">
              <ShieldCheck size={18} className="text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">User Sanctions</h4>
            </div>
            <p className="text-sm text-green-700">Use warnings for first offenses, temporary bans for repeat violations, and permanent bans for severe infractions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

type Stream = {
  id: string;
  title: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
  };
  reportReason: string;
  reportCount: number;
  reportDate: string;
  reportDetails: string;
  status: string;
};

const ReportedStreamCard = ({ stream, onApprove, onReject }: { stream: Stream; onApprove: () => void; onReject: () => void }) => {
  const getStatusBadge = (status: any) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock size={12} className="mr-1" />
            Pending Review
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle size={12} className="mr-1" />
            Removed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">{stream.title}</h3>
            <div className="flex items-center mt-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white flex items-center justify-center font-medium text-xs mr-2">
                {stream.streamer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-gray-600 text-sm">{stream.streamer.name}</span>
            </div>
          </div>
          {getStatusBadge(stream.status)}
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <Flag size={16} className="mr-1.5 text-red-500" />
            <span className="font-medium">Reported for:</span>
            <span className="ml-1">{stream.reportReason}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <User size={16} className="mr-1.5" />
            <span>{stream.reportCount} reports</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-1.5" />
            <span>{stream.reportDate}</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Report details:</span> {stream.reportDetails}
          </p>
        </div>

        {stream.status === 'pending' && (
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center"
              onClick={() => window.open(`/streams/${stream.id}`, '_blank')}
            >
              <Eye size={16} className="mr-1.5" />
              View Stream
            </button>
            <button
              className="px-3 py-1.5 border border-red-200 bg-white rounded-lg text-sm text-red-600 hover:bg-red-50 flex items-center"
              onClick={onReject}
            >
              <X size={16} className="mr-1.5" />
              Remove
            </button>
            <button
              className="px-3 py-1.5 border border-green-200 bg-white rounded-lg text-sm text-green-600 hover:bg-green-50 flex items-center"
              onClick={onApprove}
            >
              <Check size={16} className="mr-1.5" />
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReportedMessageCard = ({ message, onApprove, onReject }: { message: typeof sampleReportedMessages[0]; onApprove: () => void; onReject: () => void }) => {
  const getStatusBadge = (status: any) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock size={12} className="mr-1" />
            Pending Review
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle size={12} className="mr-1" />
            Removed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-medium text-xs mr-2">
              {message.user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{message.user.name}</h3>
              <p className="text-xs text-gray-500">In stream: {message.streamTitle}</p>
            </div>
          </div>
          {getStatusBadge(message.status)}
        </div>

        <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
          <p className="text-sm text-gray-700">{message.content}</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <Flag size={16} className="mr-1.5 text-red-500" />
            <span className="font-medium">Reported for:</span>
            <span className="ml-1">{message.reportReason}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <User size={16} className="mr-1.5" />
            <span>{message.reportCount} reports</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-1.5" />
            <span>{message.reportDate}</span>
          </div>
        </div>

        {message.status === 'pending' && (
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center"
              onClick={() => window.open(`/streams/${message.streamId}?highlight=${message.id}`, '_blank')}
            >
              <Eye size={16} className="mr-1.5" />
              View in Context
            </button>
            <button
              className="px-3 py-1.5 border border-red-200 bg-white rounded-lg text-sm text-red-600 hover:bg-red-50 flex items-center"
              onClick={onReject}
            >
              <X size={16} className="mr-1.5" />
              Remove
            </button>
            <button
              className="px-3 py-1.5 border border-green-200 bg-white rounded-lg text-sm text-green-600 hover:bg-green-50 flex items-center"
              onClick={onApprove}
            >
              <Check size={16} className="mr-1.5" />
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BannedUserCard = ({ user, onUnban }: { user: typeof sampleBannedUsers[0]; onUnban: () => void }) => {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white flex items-center justify-center font-medium text-sm mr-3">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-gray-600 text-xs mr-3">
                  <User size={12} className="mr-1" />
                  User ID: {user.id}
                </div>
                <div className="flex items-center text-gray-600 text-xs">
                  <Calendar size={12} className="mr-1" />
                  Banned on: {user.bannedDate}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <Ban size={12} className="mr-1" />
            Banned
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Ban reason:</span> {user.reason}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <Gavel size={16} className="mr-1.5" />
            <span className="font-medium">Banned by:</span>
            <span className="ml-1">{user.bannedBy}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <ShieldAlert size={16} className="mr-1.5" />
            <span>Previous violations: {user.previousViolations}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-1.5" />
            <span>Ban duration: {user.banDuration}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center"
            onClick={() => window.open(`/users/${user.id}`, '_blank')}
          >
            <Eye size={16} className="mr-1.5" />
            View Profile
          </button>
          <button
            className="px-3 py-1.5 border border-indigo-200 bg-white rounded-lg text-sm text-indigo-600 hover:bg-indigo-50 flex items-center"
            onClick={onUnban}
          >
            <ShieldCheck size={16} className="mr-1.5" />
            Unban User
          </button>
        </div>
      </div>
    </div>
  );
};

const sampleReportedStreams = [
  {
    id: 'rs-001',
    title: 'Late Night Gaming Session',
    streamer: {
      id: '101',
      name: 'Thomas Wilson',
      avatar: 'https://example.com/avatars/thomas.jpg',
    },
    reportReason: 'Inappropriate content',
    reportCount: 5,
    reportDate: 'Apr 27, 2025',
    reportDetails: 'Stream contains excessive profanity and inappropriate references.',
    status: 'pending'
  },
  {
    id: 'rs-002',
    title: 'Political Discussion Stream',
    streamer: {
      id: '102',
      name: 'Sarah Johnson',
      avatar: 'https://example.com/avatars/sarah.jpg',
    },
    reportReason: 'Harassment',
    reportCount: 3,
    reportDate: 'Apr 27, 2025',
    reportDetails: 'Streamer is making personal attacks against public figures.',
    status: 'pending'
  },
  {
    id: 'rs-003',
    title: 'Music Copyright Test Stream',
    streamer: {
      id: '103',
      name: 'David Lee',
      avatar: 'https://example.com/avatars/david.jpg',
    },
    reportReason: 'Copyright violation',
    reportCount: 2,
    reportDate: 'Apr 26, 2025',
    reportDetails: 'Stream is playing copyrighted music without permission.',
    status: 'rejected'
  },
  {
    id: 'rs-004',
    title: 'Gaming Tournament Semifinals',
    streamer: {
      id: '104',
      name: 'Michelle Rodriguez',
      avatar: 'https://example.com/avatars/michelle.jpg',
    },
    reportReason: 'Other',
    reportCount: 1,
    reportDate: 'Apr 26, 2025',
    reportDetails: 'User reported for unclear reasons, appears to be a false report.',
    status: 'approved'
  }
];

const sampleReportedMessages = [
  {
    id: 'rm-001',
    user: {
      id: '201',
      name: 'Jason Smith',
      avatar: 'https://example.com/avatars/jason.jpg',
    },
    streamId: 'stream-501',
    streamTitle: 'League of Legends Championship',
    content: 'You guys are all terrible at this game, uninstall and never play again.',
    reportReason: 'Harassment',
    reportCount: 4,
    reportDate: 'Apr 27, 2025',
    status: 'pending'
  },
  {
    id: 'rm-002',
    user: {
      id: '202',
      name: 'Rebecca Taylor',
      avatar: 'https://example.com/avatars/rebecca.jpg',
    },
    streamId: 'stream-502',
    streamTitle: 'Cooking Italian Cuisine',
    content: '[Inappropriate content redacted]',
    reportReason: 'Inappropriate content',
    reportCount: 7,
    reportDate: 'Apr 27, 2025',
    status: 'pending'
  },
  {
    id: 'rm-003',
    user: {
      id: '203',
      name: 'Kevin Brown',
      avatar: 'https://example.com/avatars/kevin.jpg',
    },
    streamId: 'stream-503',
    streamTitle: 'Digital Art Creation',
    content: 'This stream is sponsored by [unauthorized promotion]',
    reportReason: 'Spam',
    reportCount: 2,
    reportDate: 'Apr 26, 2025',
    status: 'rejected'
  },
  {
    id: 'rm-004',
    user: {
      id: '204',
      name: 'Amanda Wilson',
      avatar: 'https://example.com/avatars/amanda.jpg',
    },
    streamId: 'stream-504',
    streamTitle: 'Just Chatting with Fans',
    content: 'I disagree with what you\'re saying about this topic.',
    reportReason: 'Other',
    reportCount: 1,
    reportDate: 'Apr 26, 2025',
    status: 'approved'
  }
];

const sampleBannedUsers = [
  {
    id: 'user-301',
    name: 'Eric Matthews',
    email: 'eric.matthews@example.com',
    avatar: 'https://example.com/avatars/eric.jpg',
    reason: 'Repeated harassment of multiple streamers',
    bannedDate: 'Apr 25, 2025',
    bannedBy: 'Admin',
    previousViolations: 4,
    banDuration: 'Permanent'
  },
  {
    id: 'user-302',
    name: 'Jessica Lin',
    email: 'jessica.lin@example.com',
    avatar: 'https://example.com/avatars/jessica.jpg',
    reason: 'Sharing inappropriate content in multiple streams',
    bannedDate: 'Apr 24, 2025',
    bannedBy: 'Moderator',
    previousViolations: 3,
    banDuration: '30 days'
  },
  {
    id: 'user-303',
    name: 'Ryan Cooper',
    email: 'ryan.cooper@example.com',
    avatar: 'https://example.com/avatars/ryan.jpg',
    reason: 'Bot account spamming promotional links',
    bannedDate: 'Apr 23, 2025',
    bannedBy: 'System',
    previousViolations: 1,
    banDuration: 'Permanent'
  }
];

export default page;