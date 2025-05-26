import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
  Heart,
  ThumbsUp,
  MessageSquare,
  Share2,
  Eye,
  DollarSign,
  Gift,
  Zap,
  Layers,
  ChevronDown,
  Play
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  interface PlatformData {
    overview: {
      totalViewers: number;
      previousTotalViewers: number;
      activeStreams: number;
      previousActiveStreams: number;
      totalWatchTime: string;
      previousTotalWatchTime: string;
      newStreamers: number;
      previousNewStreamers: number;
    };
    viewerEngagement: { timestamp: string; viewers: number; engagement: number }[];
    topCategories: { name: string; value: number; color: string }[];
    engagementMetrics: { name: string; current: number; previous: number }[];
    performanceByDay: { day: string; viewers: number; duration: number }[];
    streamStatistics: {
      avgDuration: string;
      peakViewers: number;
      avgViewers: number;
      newFollowers: number;
      chatMessagesPerMinute: string;
      viewerRetention: string;
      avgQuality: string;
      mobileViewers: string;
      desktopViewers: string;
    };
    topStreams: {
      title: string;
      streamer: string;
      category: string;
      peakViewers: number;
      avgViewers: number;
      duration: string;
      engagement: number;
    }[];
    revenue: {
      total: string;
      totalChange: number;
      subscriptions: string;
      subscriptionsChange: number;
      donations: string;
      donationsChange: number;
    };
    revenueOverTime: { date: string; subscriptions: number; donations: number; ads: number }[];
  }

  const [platformData, setPlatformData] = useState<PlatformData | null>(null);

  useEffect(() => {
    // Simulate API call to fetch analytics data
    setIsLoading(true);
    setTimeout(() => {
      setPlatformData(analyticsSampleData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const handleTimeRangeChange = (range: any) => {
    setTimeRange(range);
  };

  const formatNumber = (num: any) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  const getPercentChange = (current: any, previous: any) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Stream Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive data and insights on your streaming platform</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm">
              <Calendar size={16} className="mr-2" />
              {timeRange === '24h' ? 'Last 24 Hours' :
                timeRange === '7d' ? 'Last 7 Days' :
                  timeRange === '30d' ? 'Last 30 Days' :
                    'Last 90 Days'}
              <ChevronDown size={16} className="ml-2" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 hidden">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50" onClick={() => handleTimeRangeChange('24h')}>Last 24 Hours</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50" onClick={() => handleTimeRangeChange('7d')}>Last 7 Days</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50" onClick={() => handleTimeRangeChange('30d')}>Last 30 Days</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50" onClick={() => handleTimeRangeChange('90d')}>Last 90 Days</button>
            </div>
          </div>
          <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Viewers"
              value={platformData ? formatNumber(platformData.overview.totalViewers) : 'N/A'}
              change={getPercentChange(platformData?.overview.totalViewers, platformData?.overview.previousTotalViewers)}
              icon={<Eye size={22} className="text-primary-500" />}
              color="primary"
            />
            <MetricCard
              title="Active Streams"
              value={platformData?.overview.activeStreams?.toString() || 'N/A'}
              change={getPercentChange(platformData?.overview.activeStreams, platformData?.overview.previousActiveStreams)}
              icon={<Play size={22} className="text-red-500" />}
              color="red"
            />
            <MetricCard
              title="Total Watch Time"
              value={platformData?.overview.totalWatchTime || 'N/A'}
              change={getPercentChange(
                parseInt((platformData?.overview?.totalWatchTime || '').replace(/[^0-9]/g, '')),
                parseInt((platformData?.overview.previousTotalWatchTime || '').replace(/[^0-9]/g, ''))
              )}
              icon={<Clock size={22} className="text-primary-500" />}
              color="primary"
            />
            <MetricCard
              title="New Streamers"
              value={platformData?.overview.newStreamers?.toString() || 'N/A'}
              change={getPercentChange(platformData?.overview.newStreamers, platformData?.overview.previousNewStreamers)}
              icon={<Users size={22} className="text-green-500" />}
              color="green"
            />
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-800">Viewer Engagement Over Time</h3>
                <div className="flex space-x-2">
                  <button className="px-2 py-1 text-xs font-medium rounded-lg bg-primary-50 text-primary-600">Hourly</button>
                  <button className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-50 text-gray-600">Daily</button>
                  <button className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-50 text-gray-600">Weekly</button>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={platformData?.viewerEngagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="viewers"
                      stroke="#6366f1"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-medium text-gray-800 mb-4">Top Categories</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData?.topCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformData?.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} streams`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Engagement And Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-medium text-gray-800 mb-4">Engagement Metrics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData?.engagementMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" name="Current Period" fill="#6366f1" />
                    <Bar dataKey="previous" name="Previous Period" fill="#a5b4fc" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-medium text-gray-800 mb-4">Stream Performance by Day</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={platformData?.performanceByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="viewers" name="Avg. Viewers" stroke="#6366f1" />
                    <Line type="monotone" dataKey="duration" name="Avg. Duration (min)" stroke="#22c55e" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Stream Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-4">Stream Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Average Stream Duration</div>
                  <div className="font-semibold">{platformData?.streamStatistics.avgDuration}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Peak Concurrent Viewers</div>
                  <div className="font-semibold">{formatNumber(platformData?.streamStatistics.peakViewers)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Average Viewers per Stream</div>
                  <div className="font-semibold">{formatNumber(platformData?.streamStatistics.avgViewers)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">New Followers Gained</div>
                  <div className="font-semibold">{formatNumber(platformData?.streamStatistics.newFollowers)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Chat Messages per Minute</div>
                  <div className="font-semibold">{platformData?.streamStatistics.chatMessagesPerMinute}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Viewer Retention Rate</div>
                  <div className="font-semibold">{platformData?.streamStatistics.viewerRetention}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Average Stream Quality</div>
                  <div className="font-semibold">{platformData?.streamStatistics.avgQuality}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Mobile Viewers</div>
                  <div className="font-semibold">{platformData?.streamStatistics.mobileViewers}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Desktop Viewers</div>
                  <div className="font-semibold">{platformData?.streamStatistics.desktopViewers}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Streams */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium text-gray-800">Top Performing Streams</h3>
              <button className="text-sm text-primary-600 hover:text-primary-800">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streamer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peak Viewers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Viewers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {platformData?.topStreams.map((stream, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{stream.title}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 text-white flex items-center justify-center text-xs mr-2">
                            {stream.streamer.charAt(0)}
                          </div>
                          {stream.streamer}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{stream.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">{formatNumber(stream.peakViewers)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatNumber(stream.avgViewers)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{stream.duration}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${stream.engagement >= 80 ? 'bg-green-500' :
                              stream.engagement >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                          ></div>
                          {stream.engagement}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-base font-medium text-gray-800 mb-4">Revenue Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <RevenueCard
                title="Total Revenue"
                value={platformData?.revenue.total || ''}
                change={platformData?.revenue.totalChange ?? 0}
                icon={<DollarSign size={18} />}
              />
              <RevenueCard
                title="Subscription Revenue"
                value={platformData?.revenue.subscriptions || ''}
                change={platformData?.revenue.subscriptionsChange ?? 0}
                icon={<Users size={18} />}
              />
              <RevenueCard
                title="Donation Revenue"
                value={platformData?.revenue.donations || ''}
                change={platformData?.revenue.donationsChange ?? 0}
                icon={<Gift size={18} />}
              />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platformData?.revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#6366f1" strokeWidth={2} />
                  <Line type="monotone" dataKey="donations" name="Donations" stroke="#ec4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="ads" name="Advertisements" stroke="#14b8a6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: string | number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ title, value, change, icon, color }: MetricCardProps) => {
  const isPositive = parseFloat(change.toString()) >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <h3 className="text-lg font-semibold text-gray-800 mt-1">{value}</h3>
        {change && (
          <p className={`text-xs flex items-center mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
            {isPositive ? '+' : ''}{change}% since last period
          </p>
        )}
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  );
};

// Revenue Card Component
interface RevenueCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const RevenueCard = ({ title, value, change, icon }: RevenueCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-primary-100 rounded-lg text-primary-600 mr-3">
          {icon}
        </div>
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{value}</div>
        <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
    </div>
  );
};

// Sample data for the analytics dashboard
const analyticsSampleData = {
  overview: {
    totalViewers: 437850,
    previousTotalViewers: 392650,
    activeStreams: 147,
    previousActiveStreams: 132,
    totalWatchTime: '3.2M hours',
    previousTotalWatchTime: '2.9M hours',
    newStreamers: 432,
    previousNewStreamers: 389
  },

  viewerEngagement: [
    { timestamp: '00:00', viewers: 12000, engagement: 72 },
    { timestamp: '03:00', viewers: 8500, engagement: 68 },
    { timestamp: '06:00', viewers: 7200, engagement: 65 },
    { timestamp: '09:00', viewers: 15800, engagement: 75 },
    { timestamp: '12:00', viewers: 23500, engagement: 82 },
    { timestamp: '15:00', viewers: 28700, engagement: 85 },
    { timestamp: '18:00', viewers: 32400, engagement: 87 },
    { timestamp: '21:00', viewers: 24600, engagement: 83 }
  ],

  topCategories: [
    { name: 'Gaming', value: 42, color: '#6366f1' },
    { name: 'Just Chatting', value: 28, color: '#8b5cf6' },
    { name: 'Music', value: 15, color: '#ec4899' },
    { name: 'Art', value: 8, color: '#f97316' },
    { name: 'Sports', value: 7, color: '#22c55e' }
  ],

  engagementMetrics: [
    { name: 'Likes', current: 58642, previous: 52814 },
    { name: 'Comments', current: 187354, previous: 162935 },
    { name: 'Shares', current: 14328, previous: 12651 },
    { name: 'Subscriptions', current: 8764, previous: 7842 }
  ],

  performanceByDay: [
    { day: 'Mon', viewers: 18500, duration: 120 },
    { day: 'Tue', viewers: 15200, duration: 105 },
    { day: 'Wed', viewers: 17800, duration: 115 },
    { day: 'Thu', viewers: 19300, duration: 125 },
    { day: 'Fri', viewers: 25600, duration: 142 },
    { day: 'Sat', viewers: 31200, duration: 156 },
    { day: 'Sun', viewers: 28400, duration: 148 }
  ],

  streamStatistics: {
    avgDuration: '2h 15m',
    peakViewers: 32456,
    avgViewers: 875,
    newFollowers: 16452,
    chatMessagesPerMinute: '24.3',
    viewerRetention: '68%',
    avgQuality: '1080p',
    mobileViewers: '42%',
    desktopViewers: '58%'
  },

  topStreams: [
    {
      title: 'VALORANT Tournament Finals',
      streamer: 'Alex Johnson',
      category: 'Gaming',
      peakViewers: 15243,
      avgViewers: 12854,
      duration: '4h 32m',
      engagement: 92
    },
    {
      title: 'Live Piano Concert',
      streamer: 'Emma Watson',
      category: 'Music',
      peakViewers: 9876,
      avgViewers: 7243,
      duration: '2h 15m',
      engagement: 85
    },
    {
      title: 'Cooking Italian Cuisine',
      streamer: 'Marco Rossi',
      category: 'Food',
      peakViewers: 5432,
      avgViewers: 4321,
      duration: '1h 45m',
      engagement: 78
    },
    {
      title: 'Digital Art Creation',
      streamer: 'Sophia Chen',
      category: 'Art',
      peakViewers: 4567,
      avgViewers: 3254,
      duration: '3h 10m',
      engagement: 72
    },
    {
      title: 'Just Chatting with Fans',
      streamer: 'Michael Scott',
      category: 'Just Chatting',
      peakViewers: 7824,
      avgViewers: 5967,
      duration: '2h 40m',
      engagement: 88
    }
  ],

  revenue: {
    total: '$128,457',
    totalChange: 15.4,
    subscriptions: '$87,345',
    subscriptionsChange: 12.7,
    donations: '$32,675',
    donationsChange: 18.2
  },

  revenueOverTime: [
    { date: 'Apr 22', subscriptions: 11200, donations: 3800, ads: 2100 },
    { date: 'Apr 23', subscriptions: 10800, donations: 4100, ads: 2200 },
    { date: 'Apr 24', subscriptions: 12300, donations: 4300, ads: 2300 },
    { date: 'Apr 25', subscriptions: 13200, donations: 5100, ads: 2500 },
    { date: 'Apr 26', subscriptions: 15600, donations: 5800, ads: 3100 },
    { date: 'Apr 27', subscriptions: 16800, donations: 6100, ads: 3400 },
    { date: 'Apr 28', subscriptions: 18200, donations: 6600, ads: 3700 }
  ]
};

export default page;