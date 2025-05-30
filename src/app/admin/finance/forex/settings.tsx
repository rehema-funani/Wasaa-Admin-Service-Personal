import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save, RefreshCw, Clock, Bell, AlertTriangle,
    Lock, Users, ShieldCheck, Database, MailCheck,
    Smartphone, Slack, BarChart2, Settings, Percent,
    Edit, Server, CheckCircle, Info,
    Plus,
    Play
} from 'lucide-react';

export default function SystemSettingsPanel() {
    const [activeTab, setActiveTab] = useState('general');

    // Sample settings data
    const [settings, setSettings] = useState({
        defaultSpread: 1.2,
        maxSpread: 5.0,
        minSpread: 0.1,
        dynamicSpreadEnabled: false,
        maxAlertsPerUser: 10,
        rateSources: [
            { id: 1, name: 'Fixer.io', priority: 1, status: 'Active', uptime: 99.8 },
            { id: 2, name: 'OpenExchangeRates', priority: 2, status: 'Active', uptime: 98.5 },
            { id: 3, name: 'CurrencyLayer', priority: 3, status: 'Inactive', uptime: 95.2 }
        ],
        cronJobs: [
            { id: 1, name: 'Rate Sync Job', frequency: '*/15 * * * *', lastRun: '2025-05-30T10:15:00', status: 'Success', duration: 1.2 },
            { id: 2, name: 'Alert Evaluation Job', frequency: '*/15 * * * *', lastRun: '2025-05-30T10:15:00', status: 'Success', duration: 2.3 },
            { id: 3, name: 'Audit Cleanup Job', frequency: '0 0 * * *', lastRun: '2025-05-30T00:00:00', status: 'Success', duration: 5.7 }
        ],
        notifications: [
            { id: 1, event: 'Rate sync failure', email: true, slack: true, inApp: true },
            { id: 2, event: 'Alert job timeout', email: true, slack: true, inApp: true },
            { id: 3, event: 'Suspicious transaction flagged', email: true, slack: false, inApp: true },
            { id: 4, event: 'Manual rate override', email: false, slack: false, inApp: true }
        ]
    });

    // Format timestamp
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Handle form changes
    const handleSpreadChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    // Toggle dynamic spread
    const handleDynamicSpreadToggle = () => {
        setSettings(prev => ({
            ...prev,
            dynamicSpreadEnabled: !prev.dynamicSpreadEnabled
        }));
    };

    // Handle max alerts change
    const handleMaxAlertsChange = (e) => {
        setSettings(prev => ({
            ...prev,
            maxAlertsPerUser: parseInt(e.target.value)
        }));
    };

    // Handle notification toggle
    const handleNotificationToggle = (id, channel) => {
        setSettings(prev => ({
            ...prev,
            notifications: prev.notifications.map(notification =>
                notification.id === id
                    ? { ...notification, [channel]: !notification[channel] }
                    : notification
            )
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-charcoal-900 dark:text-white">
                        System Settings
                    </h1>
                    <p className="text-charcoal-500 dark:text-charcoal-400">
                        Configure global parameters and operational settings
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center text-sm px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Save size={16} className="mr-2" />
                    Save Changes
                </motion.button>
            </div>

            {/* Settings Container */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-charcoal-200 dark:border-charcoal-700">
                            <h3 className="text-sm font-medium text-charcoal-900 dark:text-white">Settings Categories</h3>
                        </div>
                        <nav className="p-2">
                            <button
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeTab === 'general'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50'
                                    }`}
                                onClick={() => setActiveTab('general')}
                            >
                                <Settings size={16} className="mr-3" />
                                Global Spread Config
                            </button>
                            <button
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeTab === 'alerts'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50'
                                    }`}
                                onClick={() => setActiveTab('alerts')}
                            >
                                <Bell size={16} className="mr-3" />
                                Alert Settings
                            </button>
                            <button
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeTab === 'sources'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50'
                                    }`}
                                onClick={() => setActiveTab('sources')}
                            >
                                <Database size={16} className="mr-3" />
                                Rate Sources
                            </button>
                            <button
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeTab === 'cron'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50'
                                    }`}
                                onClick={() => setActiveTab('cron')}
                            >
                                <Clock size={16} className="mr-3" />
                                Cron Job Scheduler
                            </button>
                            <button
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeTab === 'notifications'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50'
                                    }`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                <MailCheck size={16} className="mr-3" />
                                Admin Notifications
                            </button>
                            <button
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeTab === 'security'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                                        : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50'
                                    }`}
                                onClick={() => setActiveTab('security')}
                            >
                                <ShieldCheck size={16} className="mr-3" />
                                Security Settings
                            </button>
                        </nav>

                        <div className="p-4 border-t border-charcoal-200 dark:border-charcoal-700">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                                <span className="text-xs text-charcoal-500 dark:text-charcoal-400">Last saved: 2 hours ago</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Changes */}
                    <div className="mt-6 bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-charcoal-200 dark:border-charcoal-700">
                            <h3 className="text-sm font-medium text-charcoal-900 dark:text-white">Recent Changes</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {[
                                { user: 'Sarah K.', setting: 'Default Spread', value: '1.2%', time: '2 hours ago' },
                                { user: 'James M.', setting: 'Max Alerts', value: '10', time: '1 day ago' },
                                { user: 'Admin', setting: 'Rate Source', value: 'Added CurrencyLayer', time: '3 days ago' }
                            ].map((change, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-charcoal-100 dark:bg-charcoal-700 flex items-center justify-center text-xs text-charcoal-700 dark:text-charcoal-300 flex-shrink-0 mt-0.5">
                                        {change.user.charAt(0)}
                                    </div>
                                    <div className="ml-2">
                                        <p className="text-sm text-charcoal-900 dark:text-white">
                                            <span className="font-medium">{change.user}</span> updated <span className="text-blue-600 dark:text-blue-400">{change.setting}</span> to <span className="font-mono">{change.value}</span>
                                        </p>
                                        <p className="text-xs text-charcoal-500 dark:text-charcoal-400">{change.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 overflow-hidden shadow-sm"
                    >
                        {/* Global Spread Configuration */}
                        {activeTab === 'general' && (
                            <div>
                                <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <div className="flex items-center">
                                        <Percent size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-lg font-medium text-charcoal-900 dark:text-white">Global Spread Configuration</h2>
                                    </div>
                                    <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
                                        Define the default spread parameters for all currency pairs
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Default Spread (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="defaultSpread"
                                                    min="0.1"
                                                    max="10"
                                                    step="0.1"
                                                    value={settings.defaultSpread}
                                                    onChange={handleSpreadChange}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <Percent size={16} className="text-charcoal-400 dark:text-charcoal-500" />
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Applied when no custom spread is defined for a currency pair
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Maximum Spread Limit (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="maxSpread"
                                                    min="0.1"
                                                    max="20"
                                                    step="0.1"
                                                    value={settings.maxSpread}
                                                    onChange={handleSpreadChange}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <Percent size={16} className="text-charcoal-400 dark:text-charcoal-500" />
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Enforced upper bound for any admin-defined custom spread
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Minimum Spread Limit (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="minSpread"
                                                    min="0"
                                                    max="5"
                                                    step="0.1"
                                                    value={settings.minSpread}
                                                    onChange={handleSpreadChange}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <Percent size={16} className="text-charcoal-400 dark:text-charcoal-500" />
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Lower bound to prevent zero or negative spreads
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Dynamic Spread Mode
                                            </label>
                                            <div className="mt-1 flex items-center">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.dynamicSpreadEnabled}
                                                        onChange={handleDynamicSpreadToggle}
                                                        className="w-4 h-4 text-blue-600 dark:text-blue-500 border-charcoal-300 dark:border-charcoal-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                                    />
                                                    <span className="ml-2 text-sm text-charcoal-700 dark:text-charcoal-300">
                                                        Enable dynamic spread scaling
                                                    </span>
                                                </label>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Automatically adjusts spread based on market volatility
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start">
                                        <Info size={16} className="mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                                Changes to spread settings will affect all future conversions. Custom spreads defined at the currency pair level will override these global settings.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Alert Settings */}
                        {activeTab === 'alerts' && (
                            <div>
                                <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <div className="flex items-center">
                                        <Bell size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-lg font-medium text-charcoal-900 dark:text-white">Alert Settings</h2>
                                    </div>
                                    <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
                                        Configure user alert limits and behavior
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                            Maximum Alerts Per User
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            step="1"
                                            value={settings.maxAlertsPerUser}
                                            onChange={handleMaxAlertsChange}
                                            className="w-full max-w-xs px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                        />
                                        <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                            Limit the number of active alerts a user can create to prevent system overload
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Alert Expiry
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="30">30 days</option>
                                                <option value="60">60 days</option>
                                                <option value="90" selected>90 days</option>
                                                <option value="180">180 days</option>
                                                <option value="0">Never expire</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Auto-expiry period for user alerts
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Alert Reminder
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="7" selected>7 days before expiry</option>
                                                <option value="14">14 days before expiry</option>
                                                <option value="30">30 days before expiry</option>
                                                <option value="0">No reminder</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Send notification to user before alert expires
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Alert Evaluation Frequency
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="5">Every 5 minutes</option>
                                                <option value="15" selected>Every 15 minutes</option>
                                                <option value="30">Every 30 minutes</option>
                                                <option value="60">Every hour</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                How often to check if alert conditions are met
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Default Alert Notification Channel
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="all" selected>All channels</option>
                                                <option value="email">Email only</option>
                                                <option value="sms">SMS only</option>
                                                <option value="push">Push notification only</option>
                                                <option value="inapp">In-app only</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Default method for notifying users about triggered alerts
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 flex items-start">
                                        <AlertTriangle size={16} className="mr-3 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                                Alert evaluation can impact system performance. Higher frequencies provide more responsive alerts but increase server load.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rate Sources */}
                        {activeTab === 'sources' && (
                            <div>
                                <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <div className="flex items-center">
                                        <Database size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-lg font-medium text-charcoal-900 dark:text-white">Rate Sources</h2>
                                    </div>
                                    <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
                                        Manage exchange rate data providers and fallback policy
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                            Source Priority Order
                                        </label>
                                        <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-3">
                                            Drag to reorder sources by priority (top = highest)
                                        </p>

                                        <div className="space-y-2 max-w-md">
                                            {settings.rateSources.map((source, index) => (
                                                <div
                                                    key={source.id}
                                                    className="flex items-center justify-between p-3 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg"
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${source.status === 'Active'
                                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-400 dark:text-charcoal-500'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center">
                                                                <span className="text-sm font-medium text-charcoal-900 dark:text-white">{source.name}</span>
                                                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${source.status === 'Active'
                                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                                                        : 'bg-charcoal-100 dark:bg-charcoal-600 text-charcoal-600 dark:text-charcoal-400'
                                                                    }`}>
                                                                    {source.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                                                                <span className="flex items-center">
                                                                    <Server size={10} className="mr-1" />
                                                                    Uptime: {source.uptime}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button className="p-1 text-charcoal-400 hover:text-blue-600 dark:text-charcoal-500 dark:hover:text-blue-400">
                                                            <Edit size={14} />
                                                        </button>
                                                        <div className="mx-1 w-px h-4 bg-charcoal-200 dark:bg-charcoal-600"></div>
                                                        <button className="p-1 text-charcoal-400 hover:text-charcoal-600 dark:text-charcoal-500 dark:hover:text-charcoal-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                                <path d="M3.27 6.96L12 12.01l8.73-5.05"></path>
                                                                <path d="M12 22.08V12"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <button className="w-full flex items-center justify-center p-3 mt-3 border border-dashed border-charcoal-300 dark:border-charcoal-600 rounded-lg text-charcoal-500 dark:text-charcoal-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                <Plus size={16} className="mr-2" />
                                                <span className="text-sm">Add New Rate Source</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Fallback Policy
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="auto" selected>Auto-failover to next source</option>
                                                <option value="cache">Use cached rate (max 1 hour old)</option>
                                                <option value="manual">Manual override only</option>
                                                <option value="block">Block transactions</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                What to do when primary source is unavailable
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Minimum Uptime Threshold
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    min="50"
                                                    max="100"
                                                    step="1"
                                                    defaultValue="95"
                                                    className="w-full max-w-xs px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <span className="ml-2 text-charcoal-500 dark:text-charcoal-400">%</span>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Auto-disable sources that fall below this uptime percentage
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                            Source Health Check
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <button className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                                <RefreshCw size={14} className="mr-2" />
                                                Test All Sources
                                            </button>
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Last check: 15 minutes ago</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start">
                                        <Info size={16} className="mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                                Rate sources are checked in priority order. If a source fails, the system will fall back to the next available source based on your fallback policy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cron Job Scheduler */}
                        {activeTab === 'cron' && (
                            <div>
                                <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <div className="flex items-center">
                                        <Clock size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-lg font-medium text-charcoal-900 dark:text-white">Cron Job Scheduler</h2>
                                    </div>
                                    <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
                                        Configure background jobs and scheduled tasks
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-full">
                                            <thead>
                                                <tr className="bg-charcoal-50 dark:bg-charcoal-700/30 border-b border-charcoal-200 dark:border-charcoal-700">
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Job Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Frequency</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Last Run</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Duration</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-charcoal-200 dark:divide-charcoal-700">
                                                {settings.cronJobs.map((job, index) => (
                                                    <tr key={job.id} className={index % 2 === 0 ? 'bg-white dark:bg-charcoal-800' : 'bg-charcoal-50/50 dark:bg-charcoal-700/10'}>
                                                        <td className="px-4 py-4 text-sm font-medium text-charcoal-900 dark:text-white">
                                                            <div className="flex items-center">
                                                                {job.name === 'Rate Sync Job' ? (
                                                                    <RefreshCw size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                                ) : job.name === 'Alert Evaluation Job' ? (
                                                                    <Bell size={16} className="mr-2 text-amber-600 dark:text-amber-400" />
                                                                ) : (
                                                                    <Clock size={16} className="mr-2 text-emerald-600 dark:text-emerald-400" />
                                                                )}
                                                                {job.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="font-mono text-xs text-charcoal-600 dark:text-charcoal-300 bg-charcoal-100 dark:bg-charcoal-700 px-2 py-1 rounded">
                                                                    {job.frequency}
                                                                </span>
                                                                <button className="ml-2 text-charcoal-400 hover:text-blue-600 dark:text-charcoal-500 dark:hover:text-blue-400">
                                                                    <Edit size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-charcoal-500 dark:text-charcoal-400">
                                                            {formatDateTime(job.lastRun)}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'Success'
                                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                                                                    : job.status === 'Running'
                                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                                                }`}>
                                                                {job.status === 'Success' ? (
                                                                    <CheckCircle size={12} className="mr-1" />
                                                                ) : job.status === 'Running' ? (
                                                                    <RefreshCw size={12} className="mr-1 animate-spin" />
                                                                ) : (
                                                                    <AlertTriangle size={12} className="mr-1" />
                                                                )}
                                                                {job.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-sm text-charcoal-500 dark:text-charcoal-400">
                                                            {job.duration.toFixed(1)}s
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <button className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                                                <Play size={12} className="mr-1.5" />
                                                                Run Now
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button className="flex items-center px-3 py-2 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-700 dark:text-charcoal-300 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                                            <Plus size={14} className="mr-2" />
                                            Add New Job
                                        </button>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 flex items-start">
                                        <AlertTriangle size={16} className="mr-3 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                                Running jobs manually may impact system performance. Ensure the system is not under heavy load before triggering manual job execution.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin Notifications */}
                        {activeTab === 'notifications' && (
                            <div>
                                <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <div className="flex items-center">
                                        <MailCheck size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-lg font-medium text-charcoal-900 dark:text-white">Admin Notifications</h2>
                                    </div>
                                    <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
                                        Configure when and how administrators are alerted
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-full">
                                            <thead>
                                                <tr className="bg-charcoal-50 dark:bg-charcoal-700/30 border-b border-charcoal-200 dark:border-charcoal-700">
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Event</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Email</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Slack</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">In-App</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-charcoal-200 dark:divide-charcoal-700">
                                                {settings.notifications.map((notification, index) => (
                                                    <tr key={notification.id} className={index % 2 === 0 ? 'bg-white dark:bg-charcoal-800' : 'bg-charcoal-50/50 dark:bg-charcoal-700/10'}>
                                                        <td className="px-4 py-4 text-sm font-medium text-charcoal-900 dark:text-white">
                                                            {notification.event}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex justify-center">
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={notification.email}
                                                                        onChange={() => handleNotificationToggle(notification.id, 'email')}
                                                                    />
                                                                    <div className="w-9 h-5 bg-charcoal-200 dark:bg-charcoal-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 dark:peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:trancharcoal-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex justify-center">
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={notification.slack}
                                                                        onChange={() => handleNotificationToggle(notification.id, 'slack')}
                                                                    />
                                                                    <div className="w-9 h-5 bg-charcoal-200 dark:bg-charcoal-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 dark:peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:trancharcoal-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex justify-center">
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={notification.inApp}
                                                                        onChange={() => handleNotificationToggle(notification.id, 'inApp')}
                                                                    />
                                                                    <div className="w-9 h-5 bg-charcoal-200 dark:bg-charcoal-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 dark:peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:trancharcoal-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                                                                </label>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Email Notification Group
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="e.g., forex-admins@wasaachat.com"
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <MailCheck size={16} className="text-charcoal-400 dark:text-charcoal-500" />
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Email address for receiving admin notifications
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Slack Webhook URL
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="https://hooks.slack.com/services/..."
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <Slack size={16} className="text-charcoal-400 dark:text-charcoal-500" />
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Slack integration for real-time alerts
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                SMS Notifications (Premium)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="e.g., +254712345678"
                                                    disabled
                                                    className="w-full px-4 py-2.5 bg-charcoal-100 dark:bg-charcoal-700/50 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-400 dark:text-charcoal-500 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <Smartphone size={16} className="text-charcoal-400 dark:text-charcoal-500" />
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                <span className="text-amber-600 dark:text-amber-400">Upgrade required</span> - Contact sales to enable SMS notifications
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Notification Frequency
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="realtime" selected>Real-time (immediate)</option>
                                                <option value="batch-15">Batch (every 15 minutes)</option>
                                                <option value="batch-60">Batch (hourly)</option>
                                                <option value="digest">Daily digest</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                How often to send grouped notifications
                                            </p>
                                        </div>
                                    </div>

                                    <button className="mt-2 flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                        <Bell size={14} className="mr-2" />
                                        Send Test Notification
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div>
                                <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <div className="flex items-center">
                                        <ShieldCheck size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-lg font-medium text-charcoal-900 dark:text-white">Security Settings</h2>
                                    </div>
                                    <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
                                        Configure security and access control parameters
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Two-Factor Authentication
                                            </label>
                                            <div className="flex items-center">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked
                                                        className="w-4 h-4 text-blue-600 dark:text-blue-500 border-charcoal-300 dark:border-charcoal-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                                    />
                                                    <span className="ml-2 text-sm text-charcoal-700 dark:text-charcoal-300">
                                                        Require 2FA for all admin users
                                                    </span>
                                                </label>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Enforces two-factor authentication for additional security
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Session Timeout
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30" selected>30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                                <option value="240">4 hours</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Automatically log out inactive admin sessions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Geo-fencing
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                            >
                                                <option value="disabled">Disabled</option>
                                                <option value="alert" selected>Alert on suspicious locations</option>
                                                <option value="block">Block login from unauthorized regions</option>
                                            </select>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Restrict admin access based on geographical location
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                                Login Attempt Throttling
                                            </label>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="number"
                                                    min="3"
                                                    max="10"
                                                    step="1"
                                                    defaultValue="5"
                                                    className="w-20 px-3 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <span className="text-sm text-charcoal-500 dark:text-charcoal-400">attempts within</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="60"
                                                    step="1"
                                                    defaultValue="10"
                                                    className="w-20 px-3 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                                />
                                                <span className="text-sm text-charcoal-500 dark:text-charcoal-400">minutes</span>
                                            </div>
                                            <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                                Prevent brute force attacks by limiting login attempts
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-2">
                                            Audit Log Retention
                                        </label>
                                        <select
                                            className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                        >
                                            <option value="30">30 days</option>
                                            <option value="60">60 days</option>
                                            <option value="90" selected>90 days</option>
                                            <option value="180">180 days</option>
                                            <option value="365">1 year</option>
                                        </select>
                                        <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                            How long to keep detailed audit logs before archiving
                                        </p>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 flex items-start">
                                        <Lock size={16} className="mr-3 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1">Security Notice</p>
                                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                                Changes to security settings are logged and require Super Admin approval. All security-related changes will trigger immediate notifications to the admin team.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-charcoal-200 dark:border-charcoal-700">
                                        <button className="flex items-center px-3 py-2 bg-charcoal-100 dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-700 dark:text-charcoal-300 text-sm hover:bg-charcoal-200 dark:hover:bg-charcoal-600 transition-colors">
                                            <Users size={14} className="mr-2" />
                                            Manage Admin Users
                                        </button>
                                        <button className="flex items-center px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-700 dark:text-red-400 text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                            <BarChart2 size={14} className="mr-2" />
                                            View Security Audit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}