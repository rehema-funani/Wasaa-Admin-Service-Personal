import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  BarChart2,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Users,
  Tag,
  MessageSquare,
  UserCheck,
  Award,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import supportService from '../../../api/services/support';

// Define agent type
interface Agent {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
  };
  role: string;
  status: string;
  department: string;
  specializations: string[];
  maxConcurrentChats: number;
  currentChats: number;
  ticketsAssigned: number;
  ticketsResolved: number;
  createdAt: string;
  updatedAt: string;
}

// Define agent statistics type
interface AgentStatistics {
  lastActive?: string;
  resolvedToday: number;
  resolvedThisWeek: number;
  resolvedThisMonth: number;
  ticketsInProgress: number;
  averageHandlingTime: number; // in minutes
  satisfactionScore: number; // percentage
  responseTimePerformance: number; // percentage within SLA
  ticketsByStatus: {
    status: string;
    count: number;
  }[];
  ticketsByPriority: {
    priority: string;
    count: number;
  }[];
  recentActivity: {
    action: string;
    ticketId: string;
    ticketNumber: string;
    timestamp: string;
  }[];
}

export default function AgentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [statistics, setStatistics] = useState<AgentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const agentData = await supportService.getAgentById(id);
        setAgent(agentData);

        const statsData = await supportService.getAgentStatistics(id);
        setStatistics(statsData);
      } catch (err) {
        setError('Failed to fetch agent details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>;
      case 'away':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Away
        </span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  const toggleAgentStatus = async () => {
    if (!agent || !id) return;

    try {
      const newStatus = agent.status === 'active' ? 'inactive' : 'active';
      await supportService.updateAgentStatus(id, newStatus);

      setAgent(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Failed to update agent status:', err);
    }
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
          onClick={() => navigate('/agents')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Agents
        </button>
      </div>

      {/* Agent Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 md:flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-4">
              {agent.user.avatar ? (
                <img
                  src={agent.user.avatar}
                  alt={agent.user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-2xl font-medium">
                    {agent.user.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{agent.user.name}</h1>
              <div className="flex items-center text-gray-600 mb-1">
                <Mail className="w-4 h-4 mr-1" />
                <span>{agent.user.email}</span>
              </div>
              <div className="flex items-center mt-2">
                {getStatusBadge(agent.status)}
                <span className="ml-3 text-sm text-gray-500">
                  {agent.currentChats}/{agent.maxConcurrentChats} active chats
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => navigate(`/agents/${id}/edit`)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Agent
            </button>
            <button
              onClick={() => navigate(`/agents/${id}/statistics`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              View Performance
            </button>
          </div>
        </div>
      </div>

      {/* Agent Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Agent info */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Agent Information</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center text-gray-500 mb-1">
                  <Tag className="w-4 h-4 mr-2" />
                  Role
                </div>
                <p className="font-medium">{agent.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-gray-500 mb-1">
                  <Users className="w-4 h-4 mr-2" />
                  Department
                </div>
                <p className="font-medium">{agent.department}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-gray-500 mb-1">
                  <Award className="w-4 h-4 mr-2" />
                  Specializations
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agent.specializations.map(specialization => (
                    <span key={specialization} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {specialization}
                    </span>
                  ))}
                  {agent.specializations.length === 0 && (
                    <span className="text-gray-500 text-sm italic">
                      No specializations
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-gray-500 mb-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Max Concurrent Chats
                </div>
                <p className="font-medium">{agent.maxConcurrentChats}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-gray-500 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined
                </div>
                <p className="font-medium">{formatDate(agent.createdAt)}</p>
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={toggleAgentStatus}
                  className={`w-full px-4 py-2 rounded-md transition-colors ${agent.status === 'active'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                >
                  {agent.status === 'active' ? 'Deactivate Agent' : 'Activate Agent'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right columns - Statistics & Activity */}
        <div className="col-span-1 lg:col-span-2">
          {/* Statistics Summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Performance Overview</h2>
            </div>
            <div className="p-6">
              {statistics ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">Assigned</p>
                      <p className="font-bold text-2xl">{agent.ticketsAssigned}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">Resolved</p>
                      <p className="font-bold text-2xl">{agent.ticketsResolved}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">In Progress</p>
                      <p className="font-bold text-2xl">{statistics.ticketsInProgress}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">Satisfaction</p>
                      <p className="font-bold text-2xl">{statistics.satisfactionScore}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-2">Resolved Tickets</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-500">Today</p>
                          <p className="font-bold">{statistics.resolvedToday}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-500">This Week</p>
                          <p className="font-bold">{statistics.resolvedThisWeek}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-500">This Month</p>
                          <p className="font-bold">{statistics.resolvedThisMonth}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-2">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-500">Avg. Handle Time</p>
                          <p className="font-bold">{statistics.averageHandlingTime} min</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-500">SLA Compliance</p>
                          <p className="font-bold">{statistics.responseTimePerformance}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No statistics available</p>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate(`/agents/${id}/statistics`)}
                  className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  View Detailed Performance
                  <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {statistics && statistics.recentActivity && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
              </div>
              <div className="divide-y">
                {statistics.recentActivity.length > 0 ? (
                  statistics.recentActivity.map((activity, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-blue-600 cursor-pointer"
                            onClick={() => navigate(`/tickets/${activity.ticketId}`)}>
                            Ticket #{activity.ticketNumber}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
