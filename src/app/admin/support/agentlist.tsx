// pages/support/AgentList.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, SlidersHorizontal, PlusCircle, MoreVertical,
    User, Shield, ShieldCheck, Activity, Clock,
    TrendingUp, CheckCircle, AlertCircle, Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Agent } from '../../../types/support';
import support from '../../../api/services/support';
import SearchBar from '../../../components/support/Searchbar';
import FilterDropdown from '../../../components/support/FilterDropdown';
import LoadingSpinner from '../../../components/support/LoadingSpinner';
import EmptyState from '../../../components/support/EmptyState';
import AgentAvatar from '../../../components/support/AgentAvatar';
import ConfirmationModal from '../../../components/support/ConfirmationModal';

const AgentList: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [showAgentMenu, setShowAgentMenu] = useState<string | null>(null);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [agentToSuspend, setAgentToSuspend] = useState<Agent | null>(null);

    useEffect(() => {
        fetchAgents();
    }, [roleFilter, statusFilter, searchQuery]);

    const fetchAgents = async () => {
        try {
            setIsLoading(true);
            const filters: any = {
                search: searchQuery
            };

            if (roleFilter !== 'all') filters.role = roleFilter;
            if (statusFilter !== 'all') filters.status = statusFilter;

            const data = await support.getAgents(filters);
            setAgents(data);
        } catch (error) {
            toast.error('Failed to load agents');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuspendAgent = async () => {
        if (!agentToSuspend) return;

        try {
            await support.updateAgent(agentToSuspend.id, { status: 'suspended' });
            toast.success(`${agentToSuspend.name} has been suspended`);
            setShowSuspendModal(false);
            setAgentToSuspend(null);
            fetchAgents();
        } catch (error) {
            toast.error('Failed to suspend agent');
        }
    };

    const handleActivateAgent = async (agent: Agent) => {
        try {
            await support.updateAgent(agent.id, { status: 'online' });
            toast.success(`${agent.name} has been activated`);
            fetchAgents();
        } catch (error) {
            toast.error('Failed to activate agent');
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return ShieldCheck;
            case 'supervisor':
                return Shield;
            default:
                return User;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'text-purple-600 bg-purple-100';
            case 'supervisor':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'text-green-600';
            case 'offline':
                return 'text-gray-600';
            case 'suspended':
                return 'text-orange-600';
            case 'inactive':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getSLAColor = (compliance: number) => {
        if (compliance >= 95) return 'text-green-600';
        if (compliance >= 90) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Filter options
    const roleOptions = [
        { value: 'all', label: 'All Roles' },
        { value: 'agent', label: 'Agent' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'admin', label: 'Admin' }
    ];

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'online', label: 'Online' },
        { value: 'offline', label: 'Offline' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'inactive', label: 'Inactive' }
    ];

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Agent Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage support team members and their performance</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={() => navigate('/admin/support/agents/new')}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all text-sm font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <PlusCircle size={16} />
                                <span>Add Agent</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        <div className="flex-grow">
                            <SearchBar
                                placeholder="Search agents by name or email..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <FilterDropdown
                                label="Role"
                                options={roleOptions}
                                value={roleFilter}
                                onChange={(value) => setRoleFilter(value as string)}
                            />
                            <FilterDropdown
                                label="Status"
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(value) => setStatusFilter(value as string)}
                            />
                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <SlidersHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Agents Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="large" message="Loading agents..." />
                    </div>
                ) : agents.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
                        <EmptyState
                            icon={User}
                            title="No agents found"
                            description="Try adjusting your filters or search query"
                            action={{
                                label: 'Clear Filters',
                                onClick: () => {
                                    setSearchQuery('');
                                    setRoleFilter('all');
                                    setStatusFilter('all');
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((agent) => (
                            <motion.div
                                key={agent.id}
                                whileHover={{ y: -2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
                                onClick={() => navigate(`/admin/support/agents/${agent.id}`)}
                            >
                                {/* Agent Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AgentAvatar
                                            name={agent.name}
                                            status={agent.status}
                                            size="large"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-900">{agent.name}</h3>
                                            <p className="text-sm text-gray-500">{agent.email}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowAgentMenu(showAgentMenu === agent.id ? null : agent.id);
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <MoreVertical size={16} className="text-gray-400" />
                                        </button>

                                        {showAgentMenu === agent.id && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/support/agents/${agent.id}/edit`);
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                                >
                                                    Edit Profile
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/support/agents/${agent.id}/performance`);
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                                >
                                                    View Performance
                                                </button>
                                                {agent.status === 'suspended' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleActivateAgent(agent);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-green-600"
                                                    >
                                                        Activate Agent
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAgentToSuspend(agent);
                                                            setShowSuspendModal(true);
                                                            setShowAgentMenu(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                                                    >
                                                        Suspend Agent
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Role and Status */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${getRoleColor(agent.role)}`}>
                                        {React.createElement(getRoleIcon(agent.role), { size: 12 })}
                                        {agent.role.charAt(0).toUpperCase() + agent.role.slice(1)}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${getStatusColor(agent.status)}`}>
                                        <span className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500' :
                                            agent.status === 'offline' ? 'bg-gray-400' :
                                                agent.status === 'suspended' ? 'bg-orange-500' :
                                                    'bg-red-500'
                                            }`} />
                                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                    </span>
                                </div>

                                {/* Assigned Categories */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2">Assigned Categories</p>
                                    <div className="flex flex-wrap gap-1">
                                        {agent.assignedCategories.map((category, index) => (
                                            <span
                                                key={index}
                                                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                                            >
                                                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Performance Stats */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                    <div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                            <Activity size={12} />
                                            <span>Tickets Handled</span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{agent.ticketsHandled || 0}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                            <Clock size={12} />
                                            <span>Avg Response</span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{agent.avgResponseTime || 0}m</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                            <TrendingUp size={12} />
                                            <span>SLA Compliance</span>
                                        </div>
                                        <p className={`text-lg font-semibold ${getSLAColor(agent.slaCompliance || 0)}`}>
                                            {agent.slaCompliance || 0}%
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                            <CheckCircle size={12} />
                                            <span>Status</span>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {agent.status === 'online' ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </div>

                                {/* Last Active */}
                                {agent.lastActive && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                            Last active: {new Date(agent.lastActive).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Suspend Agent Modal */}
                <ConfirmationModal
                    isOpen={showSuspendModal}
                    onClose={() => {
                        setShowSuspendModal(false);
                        setAgentToSuspend(null);
                    }}
                    onConfirm={handleSuspendAgent}
                    title={`Suspend ${agentToSuspend?.name}`}
                    message={`Are you sure you want to suspend ${agentToSuspend?.name}? They will no longer be able to access the system or handle tickets.`}
                    confirmText="Suspend Agent"
                    type="danger"
                />
            </div>
        </div>
    );
};

export default AgentList;