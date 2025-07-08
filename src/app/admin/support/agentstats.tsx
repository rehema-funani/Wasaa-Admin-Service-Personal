import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  BarChart,
  PieChart,
  FileText,
  Users,
  Activity,
  RefreshCw
} from 'lucide-react';
import supportService from '../../../api/services/support';

interface Agent {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  department: string;
  specializations: string[];
  ticketsAssigned: number;
  ticketsResolved: number;
}

// Define agent performance type
interface AgentPerformance {
  // Time-based metrics
  period: string;
  startDate: string;
  endDate: string;

  // Overall metrics
  totalTickets: number;
  resolvedTickets: number;
  openTickets: number;
  escalatedTickets: number;
  satisfactionScore: number; // percentage

  // Response time metrics
  averageFirstResponseTime: number; // in minutes
  averageResolutionTime: number; // in minutes
  responseTimeSLA: number; // percentage within SLA
  resolutionTimeSLA: number; // percentage within SLA

  // Ticket metrics by category
  ticketsByCategory: {
    category: string;
    count: number;
    percentage: number;
  }[];

  // Ticket metrics by priority
  ticketsByPriority: {
    priority: string;
    count: number;
    percentage: number;
  }[];

  // Ticket metrics by status
  ticketsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];

  // Time-based trends
  dailyResolutionTrend: {
    date: string;
    count: number;
  }[];

  dailyResponseTimeTrend: {
    date: string;
    averageTime: number; // in minutes
  }[];

  // Comparison to team average
  teamComparison: {
    metric: string;
    agentValue: number;
    teamAverage: number;
    difference: number;
  }[];
}

export default function AgentStatisticsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [agent, setAgent] = useState<Agent | null>(null);
  const [performance, setPerformance] = useState<AgentPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('month'); // 'week', 'month', 'quarter', 'year'

  // Fetch agent details and performance data
  useEffect(() => {
    const fetchAgentData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch agent details
        const agentData = await supportService.getAgentById(id);
        setAgent(agentData);

        // Fetch agent performance
        const performanceData = await supportService.getAgentPerformance(id, {
          period: period
        });
        setPerformance(performanceData);
      } catch (err) {
        setError('Failed to fetch agent data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [id, period]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format time in minutes to readable format
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Handle period change
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  // Get color based on percentage (red to green)
  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get indicator for comparison
  const getComparisonIndicator = (difference: number) => {
    if (difference > 0) return '↑';
    if (difference < 0) return '↓';
    return '=';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/agents')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Agents
          </button>
        </div>

        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          {error || 'Agent not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/agents/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Agent Details
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 md:flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              {agent.user.avatar ? (
                <img
                  src={agent.user.avatar}
                  alt={agent.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-2xl font-medium">
                    {agent.user.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {agent.user.name} - Performance
              </h1>
              <p className="text-gray-600">
                {agent.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {agent.department}
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            <span className="mr-2 text-gray-600">Time Period:</span>
            <div className="relative inline-flex shadow-sm rounded-md">
              <button
                onClick={() => handlePeriodChange('week')}
                className={`px-4 py-2 text-sm border ${period === 'week'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } rounded-l-md`}
              >
                Week
              </button>
              <button
                onClick={() => handlePeriodChange('month')}
                className={`px-4 py-2 text-sm border-t border-b ${period === 'month'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Month
              </button>
              <button
                onClick={() => handlePeriodChange('quarter')}
                className={`px-4 py-2 text-sm border-t border-b ${period === 'quarter'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Quarter
              </button>
              <button
                onClick={() => handlePeriodChange('year')}
                className={`px-4 py-2 text-sm border ${period === 'year'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } rounded-r-md`}
              >
                Year
              </button>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {!performance ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No performance data available for this period</p>
        </div>
      ) : (
        <>
          {/* Period Information */}
          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                Showing data from {formatDate(performance.startDate)} to {formatDate(performance.endDate)}
              </span>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b bg-blue-50">
                <h3 className="flex items-center text-blue-800 font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  Ticket Overview
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-xl">{performance.totalTickets}</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p className="font-bold text-xl">{performance.resolvedTickets}</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Open</p>
                    <p className="font-bold text-xl">{performance.openTickets}</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-sm text-gray-500">Escalated</p>
                    <p className="font-bold text-xl">{performance.escalatedTickets}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b bg-green-50">
                <h3 className="flex items-center text-green-800 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolution Rate
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <p className="font-bold text-3xl mb-2">
                    {((performance.resolvedTickets / performance.totalTickets) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {performance.resolvedTickets} of {performance.totalTickets} tickets resolved
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b bg-yellow-50">
                <h3 className="flex items-center text-yellow-800 font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  Response Times
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">First Response</p>
                    <p className="font-bold">
                      {formatTime(performance.averageFirstResponseTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resolution Time</p>
                    <p className="font-bold">
                      {formatTime(performance.averageResolutionTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b bg-indigo-50">
                <h3 className="flex items-center text-indigo-800 font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Satisfaction
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center">
                  <p className={`font-bold text-3xl mb-2 ${getColorByPercentage(performance.satisfactionScore)}`}>
                    {performance.satisfactionScore}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${performance.satisfactionScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SLA Performance */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-800">SLA Performance</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Response Time SLA</h3>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className={`text-sm font-semibold inline-block py-1 px-2 uppercase rounded-full ${performance.responseTimeSLA >= 90 ? 'bg-green-200 text-green-800' :
                              performance.responseTimeSLA >= 70 ? 'bg-yellow-200 text-yellow-800' :
                                'bg-red-200 text-red-800'
                            }`}>
                            {performance.responseTimeSLA}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Target: 90%</span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${performance.responseTimeSLA}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Resolution Time SLA</h3>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className={`text-sm font-semibold inline-block py-1 px-2 uppercase rounded-full ${performance.resolutionTimeSLA >= 90 ? 'bg-green-200 text-green-800' :
                              performance.resolutionTimeSLA >= 70 ? 'bg-yellow-200 text-yellow-800' :
                                'bg-red-200 text-red-800'
                            }`}>
                            {performance.resolutionTimeSLA}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Target: 85%</span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${performance.resolutionTimeSLA}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* By Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-800">By Category</h2>
              </div>
              <div className="p-6">
                {performance.ticketsByCategory.map((category, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {category.count} ({category.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Priority */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-800">By Priority</h2>
              </div>
              <div className="p-6">
                {performance.ticketsByPriority.map((priority, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {priority.priority}
                      </span>
                      <span className="text-sm text-gray-500">
                        {priority.count} ({priority.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${priority.priority.toLowerCase() === 'critical' ? 'bg-red-600' :
                            priority.priority.toLowerCase() === 'high' ? 'bg-orange-500' :
                              priority.priority.toLowerCase() === 'medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                          }`}
                        style={{ width: `${priority.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Status */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-800">By Status</h2>
              </div>
              <div className="p-6">
                {performance.ticketsByStatus.map((status, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {status.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {status.count} ({status.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${status.status.toLowerCase() === 'closed' || status.status.toLowerCase() === 'resolved' ? 'bg-green-500' :
                            status.status.toLowerCase() === 'in progress' ? 'bg-blue-500' :
                              status.status.toLowerCase() === 'pending' ? 'bg-yellow-500' :
                                status.status.toLowerCase() === 'escalated' ? 'bg-red-500' :
                                  'bg-gray-500'
                          }`}
                        style={{ width: `${status.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Comparison */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="flex items-center text-lg font-medium text-gray-800">
                  <Activity className="w-5 h-5 mr-2" />
                  Performance Comparison to Team Average
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Metric
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {agent.user.name}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team Average
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Difference
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {performance.teamComparison.map((comparison, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {comparison.metric}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {comparison.agentValue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                            {comparison.teamAverage}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${comparison.difference > 0 ? 'text-green-600' :
                              comparison.difference < 0 ? 'text-red-600' :
                                'text-gray-500'
                            }`}>
                            {getComparisonIndicator(comparison.difference)} {Math.abs(comparison.difference)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Trends over Time */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Resolution Trend */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="flex items-center text-lg font-medium text-gray-800">
                  <BarChart className="w-5 h-5 mr-2" />
                  Daily Resolution Trend
                </h2>
              </div>
              <div className="p-6">
                <div className="h-64">
                  {/* We'll render a chart here - for now showing a placeholder */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-500">Chart visualization would render here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Trend */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="flex items-center text-lg font-medium text-gray-800">
                  <PieChart className="w-5 h-5 mr-2" />
                  Daily Response Time Trend
                </h2>
              </div>
              <div className="p-6">
                <div className="h-64">
                  {/* We'll render a chart here - for now showing a placeholder */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-500">Chart visualization would render here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
