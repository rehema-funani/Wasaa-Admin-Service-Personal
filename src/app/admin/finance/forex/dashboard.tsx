import { motion } from 'framer-motion';
import {
    RefreshCw, ArrowUp, ArrowDown, BellRing,
    Activity, DollarSign, BarChart2, AlertTriangle
} from 'lucide-react';

const ForexDashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-900">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-charcoal-900 dark:text-white">
                        Forex Dashboard
                    </h1>
                    <p className="text-charcoal-500 dark:text-charcoal-400">
                        Overview of currency exchange performance and metrics
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center text-sm px-4 py-2 bg-white dark:bg-charcoal-900 rounded-full shadow-sm border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300"
                    >
                        <RefreshCw size={14} className="mr-2" />
                        Refresh Data
                    </motion.button>
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                        JS
                    </div>
                </div>
            </div>

            {/* Summary Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Conversions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-charcoal-900 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Total Conversions</h3>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Activity size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">1,284</p>
                            <div className="flex items-center mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <ArrowUp size={12} className="mr-1" />
                                <span>12% from yesterday</span>
                            </div>
                        </div>
                        <div className="h-10 flex items-end space-x-1">
                            {[40, 65, 30, 75, 90, 50, 80].map((h, i) => (
                                <div
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className="w-1 bg-blue-500 dark:bg-blue-400 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Active Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white dark:bg-charcoal-900 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Active Alerts</h3>
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <BellRing size={16} className="text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">24</p>
                            <div className="flex items-center mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                                <ArrowDown size={12} className="mr-1" />
                                <span>3 triggered today</span>
                            </div>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium border border-white dark:border-charcoal-900">
                                    {i === 3 ? '+20' : ['JP', 'KE', 'US'][i]}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Current Spread */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-white dark:bg-charcoal-900 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">Current Spread</h3>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <DollarSign size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">1.4%</p>
                            <div className="flex items-center mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <ArrowUp size={12} className="mr-1" />
                                <span>0.2% from last week</span>
                            </div>
                        </div>
                        <div className="w-16 h-16">
                            <div className="w-full h-full rounded-full border-4 border-emerald-200 dark:border-emerald-900/30 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center text-white text-xs font-medium">
                                    1.4%
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="bg-white dark:bg-charcoal-900 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400">System Health</h3>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <BarChart2 size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-semibold text-charcoal-900 dark:text-white">97%</p>
                            <div className="flex items-center mt-1 text-xs font-medium text-charcoal-500 dark:text-charcoal-400">
                                <span>Last sync: 2 minutes ago</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                                <span className="text-charcoal-500 dark:text-charcoal-400">API</span>
                            </div>
                            <div className="flex items-center text-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                                <span className="text-charcoal-500 dark:text-charcoal-400">WebSocket</span>
                            </div>
                            <div className="flex items-center text-xs">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                                <span className="text-charcoal-500 dark:text-charcoal-400">Jobs</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Live Exchange Rate Ticker */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-white dark:bg-charcoal-900 rounded-xl p-4 shadow-sm border border-charcoal-100 dark:border-charcoal-700 mb-8 overflow-hidden"
            >
                <div className="flex items-center mb-2">
                    <h3 className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300">Live Exchange Rates</h3>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">Live</span>
                </div>

                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { pair: 'USD/KES', rate: '132.45', change: '+0.12%', direction: 'up' },
                        { pair: 'EUR/KES', rate: '145.67', change: '-0.08%', direction: 'down' },
                        { pair: 'GBP/KES', rate: '170.23', change: '+0.22%', direction: 'up' },
                        { pair: 'JPY/KES', rate: '0.965', change: '+0.05%', direction: 'up' },
                        { pair: 'USD/EUR', rate: '0.911', change: '-0.14%', direction: 'down' },
                        { pair: 'USD/GBP', rate: '0.784', change: '+0.11%', direction: 'up' },
                    ].map((item, i) => (
                        <div key={i} className="flex-shrink-0 w-36 p-3 bg-charcoal-50 dark:bg-charcoal-700/30 rounded-lg border border-charcoal-100 dark:border-charcoal-700">
                            <div className="text-sm font-medium text-charcoal-900 dark:text-white mb-2">{item.pair}</div>
                            <div className="text-lg font-semibold text-charcoal-900 dark:text-white">{item.rate}</div>
                            <div className={`flex items-center mt-1 text-xs font-medium ${item.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                {item.direction === 'up' ?
                                    <ArrowUp size={12} className="mr-1" /> :
                                    <ArrowDown size={12} className="mr-1" />
                                }
                                <span>{item.change}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alert Status Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="bg-white dark:bg-charcoal-900 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700 lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-medium text-charcoal-700 dark:text-charcoal-300">Alert Status (Last 24h)</h3>
                        <div className="flex space-x-2">
                            <button className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">24h</button>
                            <button className="text-xs px-3 py-1 rounded-full text-charcoal-500 dark:text-charcoal-400 font-medium">7d</button>
                            <button className="text-xs px-3 py-1 rounded-full text-charcoal-500 dark:text-charcoal-400 font-medium">30d</button>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-60 flex items-end space-x-2">
                        {Array.from({ length: 24 }).map((_, i) => {
                            const triggered = Math.floor(Math.random() * 10);
                            const pending = Math.floor(Math.random() * 20);
                            const total = triggered + pending;

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                                    <div className="w-full bg-amber-200 dark:bg-amber-900/40 rounded-t" style={{ height: `${pending / total * 100}%` }}></div>
                                    <div className="w-full bg-blue-500 dark:bg-blue-400 rounded-t" style={{ height: `${triggered / total * 100}%` }}></div>
                                    <div className="text-xs text-charcoal-400 mt-2">{i}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center mt-4 space-x-6">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 mr-2"></div>
                            <span className="text-xs text-charcoal-500 dark:text-charcoal-400">Triggered</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-200 dark:bg-amber-900/40 mr-2"></div>
                            <span className="text-xs text-charcoal-500 dark:text-charcoal-400">Pending</span>
                        </div>
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="bg-white dark:bg-charcoal-900 rounded-xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700"
                >
                    <h3 className="font-medium text-charcoal-700 dark:text-charcoal-300 mb-4">Recent Activity</h3>

                    <div className="space-y-4">
                        {[
                            { icon: <RefreshCw size={14} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', message: 'Exchange rates updated', time: '2 min ago' },
                            { icon: <AlertTriangle size={14} />, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', message: 'Alert #201 triggered', time: '15 min ago' },
                            { icon: <DollarSign size={14} />, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', message: 'Spread updated to 1.4%', time: '45 min ago' },
                            { icon: <Activity size={14} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', message: 'Rate sync job completed', time: '1 hour ago' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start">
                                <div className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    {item.icon}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-charcoal-900 dark:text-white">{item.message}</p>
                                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400">{item.time}</p>
                                </div>
                            </div>
                        ))}

                        <button className="w-full mt-4 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            View All Activity
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ForexDashboard;