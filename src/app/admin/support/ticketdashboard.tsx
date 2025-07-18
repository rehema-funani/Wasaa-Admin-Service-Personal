import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import {
  Clock,
  Filter,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  PieChart as PieChartIcon,
  ChartBar,
  Calendar,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  BarChart2,
  Users
} from 'lucide-react';
import supportService from '../../../api/services/support';

// Interfaces based on the actual API response
interface StatusCount {
  _count: number;
  status: string;
}

interface PriorityCount {
  _count: number;
  priority: string;
}

interface CategoryCount {
  _count: number;
  _avg: {
    customerSatisfactionScore: number | null;
  };
  categoryId: string;
}

interface AvgResolutionTime {
  _avg: {
    escalationLevel: number;
    customerSatisfactionScore: number | null;
  };
}

interface Statistics {
  total: number;
  byStatus: StatusCount[];
  byPriority: PriorityCount[];
  byCategory: CategoryCount[];
  avgResolutionTime: AvgResolutionTime;
}

interface StatusData {
  status: string;
  count: number;
  color: string;
}

interface PriorityData {
  priority: string;
  count: number;
  color: string;
}

interface CategoryData {
  categoryId: string;
  categoryName: string;
  count: number;
  color: string;
}

const categoryMap: Record<string, { name: string, color: string }> = {
  "ea930140-6d54-430d-9563-3bfb2447e8c8": { name: "Wallet & Payments", color: "#4ECDC4" },
  "b3d14152-a343-4ef9-9c01-4fbf4a31dc37": { name: "Livestream Issues", color: "#45B7D1" },
  "06361ce4-4e0a-4371-a740-838bfaebbe60": { name: "Account Issues", color: "#FF6B6B" }
};

// Status colors
const statusColors: Record<string, string> = {
  "OPEN": "#3b82f6",
  "IN_PROGRESS": "#f59e0b",
  "RESOLVED": "#10b981",
  "CLOSED": "#6b7280"
};

const priorityColors: Record<string, string> = {
  "LOW": "#10b981",
  "MEDIUM": "#f59e0b",
  "HIGH": "#f97316",
  "CRITICAL": "#ef4444"
};

const generateMockTrendData = () => {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    data.push({
      date: dateStr,
      created: Math.floor(Math.random() * 10) + 1,
      resolved: Math.floor(Math.random() * 8) + 1
    });
  }

  return data;
};

export default function TicketDashboardPage() {
  // State
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    dateFrom: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0]
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch ticket stats
  useEffect(() => {
    const fetchTicketStats = async () => {
      setLoading(true);
      try {
        const response = await supportService.getTicketStats({
          dateFrom: dateRange.dateFrom,
          dateTo: dateRange.dateTo
        });

        if (response.success) {
          setStats(response.data.statistics);
        } else {
          setError('Failed to fetch ticket statistics');
        }
      } catch (err) {
        setError('Failed to fetch ticket statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketStats();
  }, [dateRange, refreshKey]);

  // Transform data for charts
  const transformedData = useMemo(() => {
    if (!stats) return null;

    // Transform status data
    const statusData: StatusData[] = stats.byStatus.map(item => ({
      status: item.status,
      count: item._count,
      color: statusColors[item.status] || '#6b7280'
    }));

    // Get counts by status
    const getStatusCount = (status: string): number => {
      const item = stats.byStatus.find(s => s.status === status);
      return item ? item._count : 0;
    };

    // Transform priority data
    const priorityData: PriorityData[] = stats.byPriority.map(item => ({
      priority: item.priority,
      count: item._count,
      color: priorityColors[item.priority] || '#6b7280'
    }));

    // Transform category data
    const categoryData: CategoryData[] = stats.byCategory.map(item => {
      const category = categoryMap[item.categoryId] || { name: `Category ${item.categoryId.slice(0, 6)}`, color: "#6b7280" };
      return {
        categoryId: item.categoryId,
        categoryName: category.name,
        count: item._count,
        color: category.color
      };
    });

    // Mock trend data (since it's not in the API response)
    const trendData = generateMockTrendData();

    return {
      totalTickets: stats.total,
      openTickets: getStatusCount('OPEN'),
      inProgressTickets: getStatusCount('IN_PROGRESS'),
      resolvedTickets: getStatusCount('RESOLVED'),
      closedTickets: getStatusCount('CLOSED'),
      averageResolutionTime: 120, // Mock value since it's not in the response
      statusData,
      priorityData,
      categoryData,
      trendData
    };
  }, [stats]);

  // Refresh data
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Format time
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    } else {
      return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !stats || !transformedData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">{error || 'Failed to load statistics'}</h2>
          </div>
          <p className="text-gray-600 mb-4">We couldn't load the dashboard statistics. Please try again later or contact support.</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of support ticket metrics and performance
            </p>
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Date Range
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by date range</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <input
                          type="date"
                          value={dateRange.dateFrom}
                          onChange={(e) => setDateRange({ ...dateRange, dateFrom: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                          type="date"
                          value={dateRange.dateTo}
                          onChange={(e) => setDateRange({ ...dateRange, dateTo: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => setFilterOpen(false)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Apply Filter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tickets */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-indigo-50">
                  <MessageCircle className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{transformedData.totalTickets}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-2 bg-gray-50">
              <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>Overall volume</span>
                <span className="flex items-center text-indigo-600">
                  View all tickets
                  <ChevronDown className="h-3 w-3 ml-1 transform rotate-270" />
                </span>
              </div>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50">
                  <AlertTriangle className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Open Tickets</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{transformedData.openTickets}</p>
                    <p className="ml-2 text-sm text-gray-500">
                      ({Math.round((transformedData.openTickets / transformedData.totalTickets) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-2 bg-gray-50">
              <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>Needs attention</span>
                <span className="flex items-center text-indigo-600">
                  View open tickets
                  <ChevronDown className="h-3 w-3 ml-1 transform rotate-270" />
                </span>
              </div>
            </div>
          </div>

          {/* In Progress Tickets */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-amber-50">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{transformedData.inProgressTickets}</p>
                    <p className="ml-2 text-sm text-gray-500">
                      ({Math.round((transformedData.inProgressTickets / transformedData.totalTickets) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-2 bg-gray-50">
              <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>Being worked on</span>
                <span className="flex items-center text-indigo-600">
                  View active tickets
                  <ChevronDown className="h-3 w-3 ml-1 transform rotate-270" />
                </span>
              </div>
            </div>
          </div>

          {/* Resolved Tickets */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{transformedData.resolvedTickets}</p>
                    <p className="ml-2 text-sm text-gray-500">
                      ({Math.round((transformedData.resolvedTickets / transformedData.totalTickets) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-2 bg-gray-50">
              <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>Successfully handled</span>
                <span className="flex items-center text-indigo-600">
                  View resolved tickets
                  <ChevronDown className="h-3 w-3 ml-1 transform rotate-270" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tickets by Status */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Tickets by Status</h2>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">Last 30 days</span>
                  <PieChartIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transformedData.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {transformedData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tickets by Priority */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Tickets by Priority</h2>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">Last 30 days</span>
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transformedData.priorityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Tickets">
                      {transformedData.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tickets by Category */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Tickets by Category</h2>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">Last 30 days</span>
                  <ChartBar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transformedData.categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="categoryName" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Tickets">
                      {transformedData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Ticket Trend */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Ticket Trend</h2>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">Last 7 days</span>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transformedData.trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="created"
                      stroke="#3b82f6"
                      name="Created"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="#10b981"
                      name="Resolved"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Performance Metrics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Resolution Time */}
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-500">Avg. Resolution Time</div>
                  <div className="p-2 rounded-md bg-amber-50">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{formatTime(transformedData.averageResolutionTime)}</div>
                <div className="mt-1 text-xs text-gray-500">Average time to resolve a ticket</div>
              </div>

              {/* First Response Time */}
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-500">Avg. First Response</div>
                  <div className="p-2 rounded-md bg-indigo-50">
                    <MessageCircle className="h-4 w-4 text-indigo-500" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{formatTime(45)}</div>
                <div className="mt-1 text-xs text-gray-500">Average time for first agent response</div>
              </div>

              {/* Customer Satisfaction */}
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-500">Customer Satisfaction</div>
                  <div className="p-2 rounded-md bg-green-50">
                    <Users className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">92%</div>
                <div className="mt-1 text-xs text-gray-500">Based on customer feedback</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 text-center">
          Showing data from {new Date(dateRange.dateFrom).toLocaleDateString()} to {new Date(dateRange.dateTo).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
