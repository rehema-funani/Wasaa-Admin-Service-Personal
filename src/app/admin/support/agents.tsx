import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  MoreHorizontal,
  UserPlus,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import supportService from '../../../api/services/support';
import { PATHS } from '../../../constants/paths';

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  skills: string[];
  avatar?: string;
  joinedAt: string;
  ticketsAssigned: number;
  ticketsResolved: number;
}

export default function AgentsListPage() {
  const navigate = useNavigate();

  // State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await supportService.getAgents();
        setAgents(response);
      } catch (err) {
        setError('Failed to fetch agents');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Filter will be applied locally for this demo
    // In a real app, you might want to pass this to the API
  };

  // Toggle agent status
  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await supportService.updateAgentStatus(agentId, newStatus);

      // Update the local state
      setAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId ? { ...agent, status: newStatus } : agent
        )
      );
    } catch (err) {
      console.error('Failed to update agent status:', err);
    }
  };

  // Delete agent
  const deleteAgent = async (agentId: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      await supportService.deleteAgent(agentId);

      // Remove from local state
      setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
    } catch (err) {
      console.error('Failed to delete agent:', err);
    }
  };

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' ||
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === '' || agent.department === filterDepartment;
    const matchesStatus = filterStatus === '' || agent.status === filterStatus;
    const matchesRole = filterRole === '' || agent.role === filterRole;

    return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
  });

  // Get unique departments, statuses, and roles for filters
  const departments = [...new Set(agents.map(agent => agent.department))];
  const statuses = [...new Set(agents.map(agent => agent.status))];
  const roles = [...new Set(agents.map(agent => agent.role))];

  // Get status badge style
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Support Agents</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate(`/${PATHS.ADMIN.SUPPORT.AGENT_CREATE}`)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Agent
        </button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search agents..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            {/* Department Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          {error}
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <p className="text-gray-500 mb-4">No agents found</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/agents/new')}
          >
            Add New Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                {/* Action Menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === agent.id ? null : agent.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>

                  {showActionMenu === agent.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => navigate(`/agents/${agent.id}`)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/agents/${agent.id}/edit`)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Agent
                        </button>
                        <button
                          onClick={() => toggleAgentStatus(agent.id, agent.status)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {agent.status === 'active' ? 'Deactivate' : 'Activate'} Agent
                        </button>
                        <button
                          onClick={() => deleteAgent(agent.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete Agent
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Agent Card Header */}
                <div className="p-6 flex items-center border-b">
                  <div className="mr-4">
                    {agent.avatar ? (
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-2xl font-medium">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{agent.name}</h2>
                    <p className="text-sm text-gray-500">{agent.email}</p>
                    <div className="mt-1">{getStatusBadge(agent.status)}</div>
                  </div>
                </div>

                {/* Agent Card Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">{agent.role}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{agent.department}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">Assigned</p>
                      <p className="font-bold text-lg">{agent.ticketsAssigned}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">Resolved</p>
                      <p className="font-bold text-lg">{agent.ticketsResolved}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => navigate(`/agents/${agent.id}/statistics`)}
                      className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      View Performance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
