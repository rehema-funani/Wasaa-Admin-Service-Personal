import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare, Users, AlertTriangle, TrendingUp,
    Clock, CheckCircle, Activity, PieChart,
    BarChart3, ArrowUpRight, ArrowDownRight,
    Calendar, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { DashboardStats } from '../../../types/support';
import support from '../../../api/services/support';
import LoadingSpinner from '../../../components/support/LoadingSpinner';
import AgentAvatar from '../../../components/support/AgentAvatar';

const page: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('last7days');

    useEffect(() => {
        fetchDashboardStats();
    }, [dateRange]);

    const fetchDashboardStats = async () => {
        try {
            setIsLoading(true);
            const data = await support.getDashboardStats();
            setStats(data);
        } catch (error) {
            toast.error('Failed to load dashboard stats');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const KPICard = ({
        title,
        value,
        icon: Icon,
        trend,
        color,
        onClick
    }: {
        title: string;
        value: number | string;
        icon: React.ElementType;
        trend?: { value: number; isPositive: boolean };
        color: string;
        onClick?: () => void;
    }) => (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
        bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
        ${onClick ? 'cursor-pointer' : ''}
        transition-all hover:shadow-md
      `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            {trend.isPositive ? (
                                <ArrowUpRight size={16} className="text-green-600" />
                            ) : (
                                <ArrowDownRight size={16} className="text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {Math.abs(trend.value)}%
                            </span>
                        </div>
                    )}
                </div>
                <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${color}
        `}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </motion.div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FCFCFD] p-6 flex items-center justify-center">
                <LoadingSpinner size="large" message="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Support Dashboard</h1>
                    <p className="text-gray-600 mt-1">Monitor your support operations in real-time</p>
                </div>

                {/* Date Range Selector */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                        <button
                            onClick={() => setDateRange('today')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'today'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setDateRange('last7days')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'last7days'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setDateRange('last30days')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'last30days'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Last 30 Days
                        </button>
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                        <Calendar size={16} />
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <KPICard
                        title="Open Tickets"
                        value={stats?.openTickets || 0}
                        icon={MessageSquare}
                        trend={{ value: 12, isPositive: false }}
                        color="bg-blue-600"
                        onClick={() => navigate('/admin/support/tickets?status=open')}
                    />
                    <KPICard
                        title="SLA Breaches"
                        value={stats?.slaBreaches || 0}
                        icon={AlertTriangle}
                        trend={{ value: 25, isPositive: false }}
                        color="bg-red-600"
                        onClick={() => navigate('/admin/support/tickets?sla=breached')}
                    />
                    <KPICard
                        title="Agents Online"
                        value={stats?.agentsOnline || 0}
                        icon={Users}
                        color="bg-green-600"
                        onClick={() => navigate('/admin/support/agents')}
                    />
                    <KPICard
                        title="Escalated"
                        value={stats?.escalatedTickets || 0}
                        icon={TrendingUp}
                        trend={{ value: 8, isPositive: false }}
                        color="bg-orange-600"
                        onClick={() => navigate('/admin/support/tickets?status=escalated')}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Ticket Trends Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Ticket Trends</h3>
                            <BarChart3 size={20} className="text-gray-400" />
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {stats?.ticketTrends.dates.map((date, index) => (
                                <div key={date} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col gap-1">
                                        <div
                                            className="w-full bg-green-500 rounded-t"
                                            style={{
                                                height: `${(stats.ticketTrends.resolved[index] / 70) * 200}px`
                                            }}
                                        />
                                        <div
                                            className="w-full bg-blue-500 rounded-t"
                                            style={{
                                                height: `${(stats.ticketTrends.created[index] / 70) * 200}px`
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-600">{date}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span className="text-sm text-gray-600">Created</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-sm text-gray-600">Resolved</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
                            <PieChart size={20} className="text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {stats?.categoryDistribution.map((category) => (
                                <div key={category.category} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: category.color }}
                                    />
                                    <span className="text-sm text-gray-700 flex-1">{category.category}</span>
                                    <span className="text-sm font-medium text-gray-900">{category.count}</span>
                                    <span className="text-sm text-gray-500">({category.percentage}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Agent Leaderboard */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top Performing Agents</h3>
                        <button
                            onClick={() => navigate('/admin/support/agents')}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Agent</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Tickets Handled</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Avg Resolution Time</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">SLA Compliance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.agentLeaderboard.map((agent, index) => (
                                    <tr key={agent.agentId} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                                                <AgentAvatar name={agent.name} status="online" size="small" />
                                                <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            <span className="text-sm text-gray-700">{agent.ticketsHandled}</span>
                                        </td>§
                                        <td className="text-center py-3 px-4">
                                            <span className="text-sm text-gray-700">{agent.avgResolutionTime} min</span>
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            <div className="flex items-center justify-center">
                                                <span className={`text-sm font-medium ${agent.slaCompliance >= 95 ? 'text-green-600' :
                                                        agent.slaCompliance >= 90 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {agent.slaCompliance}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;