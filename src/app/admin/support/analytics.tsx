// pages/support/SupportAnalytics.tsx

import React, { useState, useEffect } from 'react';
import {
    BarChart3, TrendingUp, Users, Clock,
    Download, Calendar, Filter, PieChart,
    Activity, CheckCircle, AlertTriangle, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../../components/support/LoadingSpinner';

interface AnalyticsData {
    summary: {
        totalTickets: number;
        resolvedTickets: number;
        avgResponseTime: number;
        avgResolutionTime: number;
        slaCompliance: number;
        customerSatisfaction: number;
    };
    ticketsByCategory: Array<{
        category: string;
        count: number;
        percentage: number;
    }>;
    ticketsByPriority: Array<{
        priority: string;
        count: number;
        percentage: number;
    }>;
    agentPerformance: Array<{
        agent: string;
        ticketsHandled: number;
        avgResponseTime: number;
        slaCompliance: number;
    }>;
    ticketTrends: Array<{
        date: string;
        created: number;
        resolved: number;
    }>;
    slaBreakdown: {
        compliant: number;
        atRisk: number;
        breached: number;
    };
}

const SupportAnalytics: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('last30days');
    const [selectedMetric, setSelectedMetric] = useState<'tickets' | 'response' | 'sla' | 'satisfaction'>('tickets');

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            // Mock analytics data
            const mockData: AnalyticsData = {
                summary: {
                    totalTickets: 1234,
                    resolvedTickets: 987,
                    avgResponseTime: 15,
                    avgResolutionTime: 120,
                    slaCompliance: 94.5,
                    customerSatisfaction: 4.2
                },
                ticketsByCategory: [
                    { category: 'Wallet', count: 345, percentage: 28 },
                    { category: 'Payments', count: 298, percentage: 24 },
                    { category: 'Account', count: 234, percentage: 19 },
                    { category: 'Login', count: 187, percentage: 15 },
                    { category: 'General', count: 170, percentage: 14 }
                ],
                ticketsByPriority: [
                    { priority: 'Critical', count: 89, percentage: 7 },
                    { priority: 'High', count: 234, percentage: 19 },
                    { priority: 'Medium', count: 567, percentage: 46 },
                    { priority: 'Low', count: 344, percentage: 28 }
                ],
                agentPerformance: [
                    { agent: 'Alice Njeri', ticketsHandled: 127, avgResponseTime: 12, slaCompliance: 96 },
                    { agent: 'Brian Kiprop', ticketsHandled: 89, avgResponseTime: 15, slaCompliance: 94 },
                    { agent: 'Caroline Muthoni', ticketsHandled: 203, avgResponseTime: 18, slaCompliance: 92 },
                    { agent: 'David Otieno', ticketsHandled: 45, avgResponseTime: 10, slaCompliance: 98 }
                ],
                ticketTrends: [
                    { date: '2024-01-01', created: 45, resolved: 42 },
                    { date: '2024-01-02', created: 52, resolved: 48 },
                    { date: '2024-01-03', created: 48, resolved: 51 },
                    { date: '2024-01-04', created: 61, resolved: 56 },
                    { date: '2024-01-05', created: 55, resolved: 52 },
                    { date: '2024-01-06', created: 49, resolved: 45 },
                    { date: '2024-01-07', created: 47, resolved: 44 }
                ],
                slaBreakdown: {
                    compliant: 1167,
                    atRisk: 45,
                    breached: 22
                }
            };
            setAnalyticsData(mockData);
        } catch (error) {
            toast.error('Failed to load analytics data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const exportReport = () => {
        toast.success('Report exported successfully');
    };

    const MetricCard = ({
        title,
        value,
        change,
        icon: Icon,
        color,
        isActive
    }: {
        title: string;
        value: string | number;
        change?: { value: number; isPositive: boolean };
        icon: React.ElementType;
        color: string;
        isActive?: boolean;
    }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
        bg-white rounded-xl p-4 border cursor-pointer transition-all
        ${isActive ? 'border-primary-300 shadow-md' : 'border-gray-100 shadow-sm hover:shadow-md'}
      `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-gray-600 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp
                                size={14}
                                className={change.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'}
                            />
                            <span className={`text-xs font-medium ${change.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {Math.abs(change.value)}%
                            </span>
                        </div>
                    )}
                </div>
                <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${color}
        `}>
                    <Icon size={20} className="text-white" />
                </div>
            </div>
        </motion.div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FCFCFD] p-6 flex items-center justify-center">
                <LoadingSpinner size="large" message="Loading analytics..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCFCFD] p-4 md:p-6 font-['Inter',sans-serif]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-800 tracking-tight">Support Analytics</h1>
                            <p className="text-gray-500 text-sm mt-1">Track performance metrics and generate reports</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                                <button
                                    onClick={() => setDateRange('last7days')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'last7days'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    7 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('last30days')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'last30days'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    30 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('last90days')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === 'last90days'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    90 Days
                                </button>
                            </div>
                            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                                <Calendar size={16} />
                            </button>
                            <motion.button
                                onClick={exportReport}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm transition-all text-sm font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download size={16} />
                                <span>Export Report</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div onClick={() => setSelectedMetric('tickets')}>
                        <MetricCard
                            title="Total Tickets"
                            value={analyticsData?.summary.totalTickets || 0}
                            change={{ value: 12, isPositive: true }}
                            icon={BarChart3}
                            color="bg-primary-600"
                            isActive={selectedMetric === 'tickets'}
                        />
                    </div>
                    <div onClick={() => setSelectedMetric('response')}>
                        <MetricCard
                            title="Avg Response Time"
                            value={`${analyticsData?.summary.avgResponseTime || 0}m`}
                            change={{ value: 8, isPositive: false }}
                            icon={Clock}
                            color="bg-green-600"
                            isActive={selectedMetric === 'response'}
                        />
                    </div>
                    <div onClick={() => setSelectedMetric('sla')}>
                        <MetricCard
                            title="SLA Compliance"
                            value={`${analyticsData?.summary.slaCompliance || 0}%`}
                            change={{ value: 2, isPositive: true }}
                            icon={Target}
                            color="bg-orange-600"
                            isActive={selectedMetric === 'sla'}
                        />
                    </div>
                    <div onClick={() => setSelectedMetric('satisfaction')}>
                        <MetricCard
                            title="Satisfaction Score"
                            value={`${analyticsData?.summary.customerSatisfaction || 0}/5`}
                            change={{ value: 5, isPositive: true }}
                            icon={Activity}
                            color="bg-purple-600"
                            isActive={selectedMetric === 'satisfaction'}
                        />
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Ticket Volume Trend */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Ticket Volume Trend</h3>
                            <BarChart3 size={20} className="text-gray-400" />
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {analyticsData?.ticketTrends.map((day, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col gap-1">
                                        <div
                                            className="w-full bg-green-500 rounded-t"
                                            style={{
                                                height: `${(day.resolved / 70) * 200}px`
                                            }}
                                        />
                                        <div
                                            className="w-full bg-primary-500 rounded-t"
                                            style={{
                                                height: `${(day.created / 70) * 200}px`
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary-500 rounded"></div>
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
                            <h3 className="text-lg font-semibold text-gray-900">Tickets by Category</h3>
                            <PieChart size={20} className="text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {analyticsData?.ticketsByCategory.map((category, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-700">{category.category}</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {category.count} ({category.percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full transition-all"
                                            style={{ width: `${category.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SLA Breakdown and Priority Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* SLA Breakdown */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">SLA Status Breakdown</h3>
                            <AlertTriangle size={20} className="text-gray-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            stroke="#E5E7EB"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            stroke="#10B981"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(analyticsData?.slaBreakdown.compliant! / analyticsData?.summary.totalTickets! * 226.2)} 226.2`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            {Math.round(analyticsData?.slaBreakdown.compliant! / analyticsData?.summary.totalTickets! * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-2">Compliant</p>
                                <p className="text-xs text-gray-500">{analyticsData?.slaBreakdown.compliant} tickets</p>
                            </div>

                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            stroke="#E5E7EB"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            stroke="#F59E0B"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(analyticsData?.slaBreakdown.atRisk! / analyticsData?.summary.totalTickets! * 226.2)} 226.2`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            {Math.round(analyticsData?.slaBreakdown.atRisk! / analyticsData?.summary.totalTickets! * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-2">At Risk</p>
                                <p className="text-xs text-gray-500">{analyticsData?.slaBreakdown.atRisk} tickets</p>
                            </div>

                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            stroke="#E5E7EB"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            stroke="#EF4444"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(analyticsData?.slaBreakdown.breached! / analyticsData?.summary.totalTickets! * 226.2)} 226.2`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            {Math.round(analyticsData?.slaBreakdown.breached! / analyticsData?.summary.totalTickets! * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-2">Breached</p>
                                <p className="text-xs text-gray-500">{analyticsData?.slaBreakdown.breached} tickets</p>
                            </div>
                        </div>
                    </div>

                    {/* Priority Distribution */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Tickets by Priority</h3>
                            <TrendingUp size={20} className="text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {analyticsData?.ticketsByPriority.map((priority, index) => {
                                const colors = ['bg-red-600', 'bg-orange-600', 'bg-primary-600', 'bg-gray-600'];
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index] }}></div>
                                        <span className="text-sm text-gray-700 flex-1">{priority.priority}</span>
                                        <span className="text-sm font-medium text-gray-900">{priority.count}</span>
                                        <span className="text-sm text-gray-500">({priority.percentage}%)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Agent Performance Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Agent Performance</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Agent</th>
                                    <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Tickets Handled</th>
                                    <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Avg Response Time</th>
                                    <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">SLA Compliance</th>
                                    <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData?.agentPerformance.map((agent, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900">{agent.agent}</span>
                                        </td>
                                        <td className="text-center px-6 py-4">
                                            <span className="text-sm text-gray-700">{agent.ticketsHandled}</span>
                                        </td>
                                        <td className="text-center px-6 py-4">
                                            <span className="text-sm text-gray-700">{agent.avgResponseTime}m</span>
                                        </td>
                                        <td className="text-center px-6 py-4">
                                            <span className={`text-sm font-medium ${agent.slaCompliance >= 95 ? 'text-green-600' :
                                                agent.slaCompliance >= 90 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {agent.slaCompliance}%
                                            </span>
                                        </td>
                                        <td className="text-center px-6 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-8 rounded ${i < Math.round(agent.slaCompliance / 20)
                                                            ? 'bg-green-500'
                                                            : 'bg-gray-200'
                                                            }`}
                                                    />
                                                ))}
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

export default SupportAnalytics;