import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Filter, Bell, ArrowUp, ArrowDown,
    ChevronDown, CheckCircle, Clock, XCircle,
    AlertTriangle, Play, Calendar, Settings, MoreVertical,
    Eye
} from 'lucide-react';

const UserAlertsManagement = () => {
    const [selectedTab, setSelectedTab] = useState('all');
    const [open, setOpen] = useState(false);

    const alerts = [
        {
            id: 'A-20495',
            userId: 'U-58392',
            userName: 'John Doe',
            pair: 'USD/KES',
            direction: 'Above',
            threshold: 132.50,
            status: 'Active',
            createdAt: '2025-05-25T14:30:00',
            lastEvaluated: '2025-05-30T10:15:00'
        },
        {
            id: 'A-20496',
            userId: 'U-58392',
            userName: 'John Doe',
            pair: 'EUR/KES',
            direction: 'Below',
            threshold: 145.00,
            status: 'Triggered',
            createdAt: '2025-05-26T09:15:00',
            lastEvaluated: '2025-05-30T08:45:00'
        },
        {
            id: 'A-20497',
            userId: 'U-67234',
            userName: 'Jane Smith',
            pair: 'GBP/KES',
            direction: 'Above',
            threshold: 171.00,
            status: 'Active',
            createdAt: '2025-05-27T16:20:00',
            lastEvaluated: '2025-05-30T10:15:00'
        },
        {
            id: 'A-20498',
            userId: 'U-45678',
            userName: 'Robert Johnson',
            pair: 'USD/KES',
            direction: 'Below',
            threshold: 131.00,
            status: 'Expired',
            createdAt: '2025-05-15T11:10:00',
            lastEvaluated: '2025-05-28T23:59:59'
        },
        {
            id: 'A-20499',
            userId: 'U-67234',
            userName: 'Jane Smith',
            pair: 'USD/EUR',
            direction: 'Below',
            threshold: 0.900,
            status: 'Active',
            createdAt: '2025-05-28T08:30:00',
            lastEvaluated: '2025-05-30T10:15:00'
        },
        {
            id: 'A-20500',
            userId: 'U-12345',
            userName: 'Michael Brown',
            pair: 'USD/KES',
            direction: 'Above',
            threshold: 133.00,
            status: 'Disabled',
            createdAt: '2025-05-29T14:45:00',
            lastEvaluated: '2025-05-29T15:00:00'
        }
    ];

    // Filter alerts based on selected tab
    const filteredAlerts = alerts.filter(alert => {
        if (selectedTab === 'all') return true;
        return alert.status.toLowerCase() === selectedTab.toLowerCase();
    });

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        let bgColor, textColor, icon;

        switch (status) {
            case 'Active':
                bgColor = 'bg-emerald-100 dark:bg-emerald-900/30';
                textColor = 'text-emerald-800 dark:text-emerald-400';
                icon = <CheckCircle size={12} className="mr-1" />;
                break;
            case 'Triggered':
                bgColor = 'bg-blue-100 dark:bg-blue-900/30';
                textColor = 'text-blue-800 dark:text-blue-400';
                icon = <Bell size={12} className="mr-1" />;
                break;
            case 'Expired':
                bgColor = 'bg-charcoal-100 dark:bg-charcoal-700';
                textColor = 'text-charcoal-800 dark:text-charcoal-400';
                icon = <Clock size={12} className="mr-1" />;
                break;
            case 'Disabled':
                bgColor = 'bg-red-100 dark:bg-red-900/30';
                textColor = 'text-red-800 dark:text-red-400';
                icon = <XCircle size={12} className="mr-1" />;
                break;
            default:
                bgColor = 'bg-charcoal-100 dark:bg-charcoal-700';
                textColor = 'text-charcoal-800 dark:text-charcoal-400';
                icon = null;
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {icon}
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-charcoal-900 dark:text-white">
                        User Alerts Management
                    </h1>
                    <p className="text-charcoal-500 dark:text-charcoal-400">
                        Monitor and manage user-defined exchange rate alerts
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center text-sm px-4 py-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 rounded-lg font-medium transition-colors shadow-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-700"
                    >
                        <Settings size={16} className="mr-2 text-charcoal-500 dark:text-charcoal-400" />
                        Alert Settings
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center text-sm px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Play size={16} className="mr-2" />
                        Run Evaluation
                    </motion.button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Active Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-charcoal-800 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Active Alerts</h3>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">24</p>
                    <div className="flex items-center mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <ArrowUp size={12} className="mr-1" />
                        <span>12% from last week</span>
                    </div>
                </motion.div>

                {/* Triggered Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white dark:bg-charcoal-800 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Triggered Today</h3>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Bell size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">6</p>
                    <div className="flex items-center mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                        <ArrowDown size={12} className="mr-1" />
                        <span>3 fewer than yesterday</span>
                    </div>
                </motion.div>

                {/* Expired Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white dark:bg-charcoal-800 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Expiring Soon</h3>
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">12</p>
                    <div className="flex items-center mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                        <Calendar size={12} className="mr-1" />
                        <span>Expires in next 7 days</span>
                    </div>
                </motion.div>

                {/* Disabled Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white dark:bg-charcoal-800 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Disabled Alerts</h3>
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <XCircle size={16} className="text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">5</p>
                    <div className="flex items-center mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <ArrowUp size={12} className="mr-1" />
                        <span>2 more than last week</span>
                    </div>
                </motion.div>
            </div>

            {/* Alerts Table */}
            <div>
                {/* Tabs and Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-1 bg-charcoal-100 dark:bg-charcoal-700/30 p-1 rounded-lg">
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTab === 'all'
                                ? 'bg-white dark:bg-charcoal-800 shadow-sm text-charcoal-900 dark:text-white'
                                : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-300'
                                }`}
                            onClick={() => setSelectedTab('all')}
                        >
                            All Alerts
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTab === 'active'
                                ? 'bg-white dark:bg-charcoal-800 shadow-sm text-charcoal-900 dark:text-white'
                                : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-300'
                                }`}
                            onClick={() => setSelectedTab('active')}
                        >
                            Active
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTab === 'triggered'
                                ? 'bg-white dark:bg-charcoal-800 shadow-sm text-charcoal-900 dark:text-white'
                                : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-300'
                                }`}
                            onClick={() => setSelectedTab('triggered')}
                        >
                            Triggered
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTab === 'expired'
                                ? 'bg-white dark:bg-charcoal-800 shadow-sm text-charcoal-900 dark:text-white'
                                : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-300'
                                }`}
                            onClick={() => setSelectedTab('expired')}
                        >
                            Expired
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -trancharcoal-y-1/2 text-charcoal-400" />
                            <input
                                type="text"
                                placeholder="Search alerts..."
                                className="pl-9 pr-4 py-2 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <button className="p-2 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors">
                            <Filter size={16} className="text-charcoal-500 dark:text-charcoal-400" />
                        </button>
                    </div>
                </div>

                {/* Alerts Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 overflow-hidden shadow-sm"
                >
                    <div className="overflow-x-auto ">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-charcoal-50 dark:bg-charcoal-700/30 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            Alert ID
                                            <ChevronDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            Currency Pair
                                            <ChevronDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Direction</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Threshold</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            Created
                                            <ChevronDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal-200 dark:divide-charcoal-700">
                                {filteredAlerts.map((alert, index) => (
                                    <motion.tr
                                        key={alert.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                        className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/20 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-medium text-charcoal-900 dark:text-white">
                                                {alert.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-charcoal-200 dark:bg-charcoal-700 flex items-center justify-center text-charcoal-600 dark:text-charcoal-300 font-medium text-sm">
                                                    {alert.userName.split(' ').map(name => name[0]).join('')}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-charcoal-900 dark:text-white">{alert.userName}</div>
                                                    <div className="text-xs text-charcoal-500 dark:text-charcoal-400">{alert.userId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-xs">
                                                    {alert.pair.split('/')[0]}
                                                </div>
                                                <span className="ml-3 text-sm text-charcoal-900 dark:text-white">
                                                    {alert.pair}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {alert.direction === 'Above' ? (
                                                    <ArrowUp size={14} className="mr-1.5 text-emerald-500 dark:text-emerald-400" />
                                                ) : (
                                                    <ArrowDown size={14} className="mr-1.5 text-red-500 dark:text-red-400" />
                                                )}
                                                <span className="text-sm text-charcoal-900 dark:text-white">{alert.direction}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className="text-sm font-mono font-medium text-charcoal-900 dark:text-white">
                                                {alert.threshold.toFixed(alert.pair.includes('JPY') ? 3 : 2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(alert.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-charcoal-900 dark:text-white">{formatDate(alert.createdAt)}</div>
                                            <div className="text-xs text-charcoal-500 dark:text-charcoal-400">{formatTime(alert.createdAt)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    className="p-1.5 text-charcoal-400 hover:text-blue-600 dark:text-charcoal-500 dark:hover:text-blue-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors"
                                                    title="View Alert Details"
                                                    onClick={() => setOpen(true)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="p-1.5 text-charcoal-400 hover:text-amber-600 dark:text-charcoal-500 dark:hover:text-amber-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors"
                                                    title="Force Trigger Alert"
                                                >
                                                    <Play size={16} />
                                                </button>
                                                <button
                                                    className="p-1.5 text-charcoal-400 hover:text-charcoal-600 dark:text-charcoal-500 dark:hover:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors"
                                                    title="More Options"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-white dark:bg-charcoal-800 border-t border-charcoal-200 dark:border-charcoal-700 flex items-center justify-between">
                        <div className="text-sm text-charcoal-500 dark:text-charcoal-400">
                            Showing <span className="font-medium text-charcoal-700 dark:text-charcoal-300">1</span> to <span className="font-medium text-charcoal-700 dark:text-charcoal-300">6</span> of <span className="font-medium text-charcoal-700 dark:text-charcoal-300">24</span> alerts
                        </div>

                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded text-blue-600 dark:text-blue-400 text-sm font-medium">
                                1
                            </button>
                            <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                                2
                            </button>
                            <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {open && (
                <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">
                                    Alert Details
                                </h3>
                                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                                    A-20495 • Created on May 25, 2025
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="flex items-center px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
                                    <Play size={14} className="mr-1.5" />
                                    Force Trigger
                                </button>
                                <button className="flex items-center px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium">
                                    <XCircle size={14} className="mr-1.5" />
                                    Disable
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">Alert Information</h4>
                                    <div className="bg-charcoal-50 dark:bg-charcoal-700/30 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Status</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                                                <CheckCircle size={12} className="mr-1" />
                                                Active
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Currency Pair</span>
                                            <span className="text-sm font-medium text-charcoal-900 dark:text-white">USD/KES</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Direction</span>
                                            <div className="flex items-center">
                                                <ArrowUp size={14} className="mr-1.5 text-emerald-500 dark:text-emerald-400" />
                                                <span className="text-sm font-medium text-charcoal-900 dark:text-white">Above</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Threshold</span>
                                            <span className="text-sm font-mono font-medium text-charcoal-900 dark:text-white">132.50</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">User Information</h4>
                                    <div className="bg-charcoal-50 dark:bg-charcoal-700/30 rounded-lg p-4">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 rounded-full bg-charcoal-200 dark:bg-charcoal-700 flex items-center justify-center text-charcoal-600 dark:text-charcoal-300 font-medium">
                                                JD
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-charcoal-900 dark:text-white">John Doe</div>
                                                <div className="text-xs text-charcoal-500 dark:text-charcoal-400">U-58392</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Email</span>
                                            <span className="text-sm font-medium text-charcoal-900 dark:text-white">john.doe@example.com</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Active Alerts</span>
                                            <span className="text-sm font-medium text-charcoal-900 dark:text-white">3 alerts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">Evaluation History</h4>
                                <div className="bg-charcoal-50 dark:bg-charcoal-700/30 rounded-lg p-4">
                                    <div className="space-y-3">
                                        {[
                                            { date: 'May 30, 2025', time: '10:15 AM', result: 'Pending', rate: 132.45 },
                                            { date: 'May 29, 2025', time: '10:15 PM', result: 'Pending', rate: 132.30 },
                                            { date: 'May 29, 2025', time: '10:15 AM', result: 'Pending', rate: 132.25 },
                                            { date: 'May 28, 2025', time: '10:15 PM', result: 'Pending', rate: 132.40 },
                                        ].map((evaluation, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full ${evaluation.result === 'Triggered' ? 'bg-blue-500' : 'bg-charcoal-400'} mr-2`}></div>
                                                    <span className="text-sm text-charcoal-900 dark:text-white">{evaluation.date} at {evaluation.time}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm text-charcoal-500 dark:text-charcoal-400 mr-2">Rate:</span>
                                                    <span className="text-sm font-mono font-medium text-charcoal-900 dark:text-white">{evaluation.rate.toFixed(2)}</span>
                                                    <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-charcoal-200 dark:bg-charcoal-600 text-charcoal-700 dark:text-charcoal-300">
                                                        {evaluation.result}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">Admin Notes</h4>
                                <textarea
                                    placeholder="Add internal notes about this alert..."
                                    className="w-full px-4 py-3 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm h-24"
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-6 border-t border-charcoal-200 dark:border-charcoal-700 flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors"
                            >
                                Close
                            </button>
                            <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm">
                                Save Notes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Information Banner */}
            <div className="mt-6 flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm text-blue-800 dark:text-blue-300">
                <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">About Alert Evaluation</p>
                    <p>Alerts are evaluated every 15 minutes. Triggered alerts are processed immediately. Users receive notifications via their preferred channel (SMS, Email, or Push Notification).</p>
                </div>
            </div>
        </div>
    );
}

export default UserAlertsManagement;