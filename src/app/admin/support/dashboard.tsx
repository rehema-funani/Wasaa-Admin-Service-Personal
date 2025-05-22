import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Clock, AlertTriangle, TrendingUp, MessageCircle,
    Shield, Settings, BarChart3, PieChart, User, Download,
    Calendar, CheckCircle, XCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import {
    mockTickets,
    mockUsers,
    getOpenTicketsCount,
    getSLABreachedTickets,
    getEscalatedTickets,
    getAgentsOnline,
    categorizeTickets,
    currentUser
} from '../../../data/support';

const dashboard: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState('7d');

    // Calculate KPIs
    const openTickets = getOpenTicketsCount();
    const slaBreaches = getSLABreachedTickets().length;
    const agentsOnline = getAgentsOnline();
    const escalatedTickets = getEscalatedTickets().length;
    const categoryData = categorizeTickets();

    // Mock trend data for charts
    const ticketTrends = [
        { date: 'Jan 14', created: 12, resolved: 8 },
        { date: 'Jan 15', created: 15, resolved: 11 },
        { date: 'Jan 16', created: 8, resolved: 13 },
        { date: 'Jan 17', created: 18, resolved: 16 },
        { date: 'Jan 18', created: 10, resolved: 12 },
        { date: 'Jan 19', created: 14, resolved: 9 },
        { date: 'Jan 20', created: 16, resolved: 15 }
    ];

    const agentPerformance = mockUsers
        .filter(user => user.role === 'agent')
        .map(agent => ({
            name: agent.name.split(' ')[0],
            handled: agent.ticketsHandled || 0,
            avgResponse: agent.avgResponseTime || '0m',
            compliance: agent.slaCompliance || 0
        }))
        .sort((a, b) => b.compliance - a.compliance);

    const KPICard = ({ title, value, icon: Icon, trend, trendValue, color = 'indigo', onClick }: any) => (
        <motion.div
            className={`bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 cursor-pointer transition-all hover:shadow-lg hover:border-${color}-300/50`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
                    {trend && (
                        <div className={`flex items-center mt-2 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon size={24} className={`text-${color}-600`} />
                </div>
            </div>
        </motion.div>
    );

    const CategoryCard = ({ category, count, percentage }: any) => (
        <div className="bg-white/60 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                <span className="text-xs text-gray-500">{percentage}%</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Support Dashboard</h1>
                            <p className="text-gray-600 mt-1">Welcome back, {currentUser.name}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="24h">Last 24 hours</option>
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                            </select>
                            <motion.button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors flex items-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download size={16} />
                                <span>Export Report</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Open Tickets"
                        value={openTickets}
                        icon={MessageCircle}
                        trend="up"
                        trendValue="+12% vs last week"
                        color="blue"
                        onClick={() => console.log('Navigate to tickets')}
                    />
                    <KPICard
                        title="SLA Breaches"
                        value={slaBreaches}
                        icon={AlertTriangle}
                        trend="down"
                        trendValue="-8% vs last week"
                        color="red"
                        onClick={() => console.log('Navigate to SLA breaches')}
                    />
                    <KPICard
                        title="Agents Online"
                        value={agentsOnline}
                        icon={Users}
                        color="green"
                        onClick={() => console.log('Navigate to agents')}
                    />
                    <KPICard
                        title="Escalated Tickets"
                        value={escalatedTickets}
                        icon={TrendingUp}
                        trend="up"
                        trendValue="+3 since yesterday"
                        color="amber"
                        onClick={() => console.log('Navigate to escalations')}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Ticket Trends Chart */}
                    <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Ticket Trends</h3>
                                <p className="text-sm text-gray-600">Created vs Resolved (Last 7 days)</p>
                            </div>
                            <BarChart3 size={20} className="text-gray-400" />
                        </div>

                        <div className="space-y-4">
                            {ticketTrends.map((day, index) => (
                                <div key={day.date} className="flex items-center space-x-4">
                                    <div className="w-16 text-xs text-gray-500 font-medium">{day.date}</div>
                                    <div className="flex-1 flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                                            <motion.div
                                                className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(day.created / 20) * 100}%` }}
                                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                            />
                                            <motion.div
                                                className="absolute left-0 top-0 h-full bg-green-500 rounded-full opacity-60"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(day.resolved / 20) * 100}%` }}
                                                transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-600 w-20">
                                            <span className="text-indigo-600">{day.created}</span> / <span className="text-green-600">{day.resolved}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">Created</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">Resolved</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
                                <p className="text-sm text-gray-600">Ticket distribution</p>
                            </div>
                            <PieChart size={20} className="text-gray-400" />
                        </div>

                        <div className="space-y-4">
                            {categoryData.map((category, index) => (
                                <motion.div
                                    key={category.category}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CategoryCard {...category} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Agent Leaderboard */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Agent Performance</h3>
                            <p className="text-sm text-gray-600">SLA compliance and ticket handling</p>
                        </div>
                        <motion.button
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                            whileHover={{ scale: 1.02 }}
                        >
                            View All Agents →
                        </motion.button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Agent</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Tickets Handled</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Avg Response</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">SLA Compliance</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agentPerformance.map((agent, index) => {
                                    const user = mockUsers.find(u => u.name.startsWith(agent.name));
                                    return (
                                        <motion.tr
                                            key={agent.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <User size={16} className="text-indigo-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{agent.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-gray-900 font-medium">{agent.handled}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-gray-600">{agent.avgResponse}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${agent.compliance}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{agent.compliance}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${user?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                    <span className="text-xs text-gray-600">{user?.isOnline ? 'Online' : 'Offline'}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold mb-2">Manage Agents</h3>
                                <p className="text-indigo-100 text-sm">Add, edit, or deactivate support agents</p>
                            </div>
                            <Users size={32} className="text-indigo-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white cursor-pointer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold mb-2">SLA Configuration</h3>
                                <p className="text-emerald-100 text-sm">Set response and resolution targets</p>
                            </div>
                            <Clock size={32} className="text-emerald-200" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white cursor-pointer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold mb-2">System Settings</h3>
                                <p className="text-amber-100 text-sm">Configure categories and preferences</p>
                            </div>
                            <Settings size={32} className="text-amber-200" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default dashboard;