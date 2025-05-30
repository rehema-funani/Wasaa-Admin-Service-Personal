import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Filter, Download, RefreshCw, Calendar,
    ChevronDown, ArrowUp, ArrowDown, AlertTriangle
} from 'lucide-react';

const ExchangeRateViewer = () => {
    const [selectedPair, setSelectedPair] = useState('USD/KES');
    const [timeRange, setTimeRange] = useState('1D');

    // Sample exchange rate data
    const exchangeRates = [
        {
            pair: 'USD/KES',
            source: 'Fixer.io',
            rate: 132.45,
            type: 'Live',
            timestamp: '2025-05-30T10:15:00',
            status: 'Success'
        },
        {
            pair: 'USD/KES',
            source: 'OpenExchangeRates',
            rate: 132.46,
            type: 'Live',
            timestamp: '2025-05-30T10:10:00',
            status: 'Success'
        },
        {
            pair: 'EUR/KES',
            source: 'Fixer.io',
            rate: 145.67,
            type: 'Live',
            timestamp: '2025-05-30T10:15:00',
            status: 'Success'
        },
        {
            pair: 'GBP/KES',
            source: 'Fixer.io',
            rate: 170.23,
            type: 'Live',
            timestamp: '2025-05-30T10:15:00',
            status: 'Success'
        },
        {
            pair: 'USD/KES',
            source: 'Manual Override',
            rate: 132.40,
            type: 'Manual',
            timestamp: '2025-05-30T09:45:00',
            status: 'Success'
        },
        {
            pair: 'JPY/KES',
            source: 'Fixer.io',
            rate: 0.965,
            type: 'Live',
            timestamp: '2025-05-30T10:15:00',
            status: 'Delayed'
        },
        {
            pair: 'USD/EUR',
            source: 'OpenExchangeRates',
            rate: 0.911,
            type: 'Live',
            timestamp: '2025-05-30T10:10:00',
            status: 'Success'
        },
    ];

    // Sample rate history data for chart
    const rateHistory = [
        { time: '00:00', rate: 132.30 },
        { time: '02:00', rate: 132.25 },
        { time: '04:00', rate: 132.35 },
        { time: '06:00', rate: 132.42 },
        { time: '08:00', rate: 132.38 },
        { time: '10:00', rate: 132.45 },
        { time: '12:00', rate: 132.48 },
        { time: '14:00', rate: 132.51 },
        { time: '16:00', rate: 132.47 },
        { time: '18:00', rate: 132.42 },
        { time: '20:00', rate: 132.44 },
        { time: '22:00', rate: 132.40 },
    ];

    // Format timestamp to readable format
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) + ', ' + date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Status badge based on status value
    const getStatusBadge = (status) => {
        let bgColor, textColor;

        switch (status) {
            case 'Success':
                bgColor = 'bg-emerald-100 dark:bg-emerald-900/30';
                textColor = 'text-emerald-800 dark:text-emerald-400';
                break;
            case 'Delayed':
                bgColor = 'bg-amber-100 dark:bg-amber-900/30';
                textColor = 'text-amber-800 dark:text-amber-400';
                break;
            case 'Fallback':
                bgColor = 'bg-blue-100 dark:bg-blue-900/30';
                textColor = 'text-blue-800 dark:text-blue-400';
                break;
            case 'Error':
                bgColor = 'bg-red-100 dark:bg-red-900/30';
                textColor = 'text-red-800 dark:text-red-400';
                break;
            default:
                bgColor = 'bg-charcoal-100 dark:bg-charcoal-700';
                textColor = 'text-charcoal-800 dark:text-charcoal-400';
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
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
                        Exchange Rate Viewer
                    </h1>
                    <p className="text-charcoal-500 dark:text-charcoal-400">
                        Monitor real-time and historical exchange rates
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center text-sm px-4 py-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 rounded-lg font-medium transition-colors shadow-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-700"
                    >
                        <Calendar size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                        Custom Range
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center text-sm px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Refresh Rates
                    </motion.button>
                </div>
            </div>

            {/* Exchange Rate Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 overflow-hidden shadow-sm mb-6"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">
                                    {selectedPair} Exchange Rate
                                </h3>
                                <div className="ml-3 flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                    <span className="font-medium">132.45</span>
                                    <ArrowUp size={14} className="ml-1.5 text-emerald-500 dark:text-emerald-400" />
                                </div>
                            </div>
                            <div className="ml-4 flex items-center text-sm text-charcoal-500 dark:text-charcoal-400">
                                <span>Last updated:</span>
                                <span className="ml-1 font-medium text-charcoal-700 dark:text-charcoal-300">2 minutes ago</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-medium ${timeRange === '1D' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-charcoal-500 dark:text-charcoal-400'}`}
                                onClick={() => setTimeRange('1D')}
                            >
                                1D
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-medium ${timeRange === '7D' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-charcoal-500 dark:text-charcoal-400'}`}
                                onClick={() => setTimeRange('7D')}
                            >
                                7D
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-medium ${timeRange === '1M' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-charcoal-500 dark:text-charcoal-400'}`}
                                onClick={() => setTimeRange('1M')}
                            >
                                1M
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-xs font-medium ${timeRange === '3M' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-charcoal-500 dark:text-charcoal-400'}`}
                                onClick={() => setTimeRange('3M')}
                            >
                                3M
                            </button>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="h-64 mt-6">
                        <div className="h-full flex items-end space-x-1">
                            {rateHistory.map((point, index) => {
                                const height = `${((point.rate - 132.25) / (132.51 - 132.25)) * 100}%`;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center h-full">
                                        <div
                                            className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors relative group"
                                            style={{ height }}
                                        >
                                            <div className="absolute bottom-full left-1/2 transform -trancharcoal-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-800 dark:bg-charcoal-700 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap">
                                                {point.time}: {point.rate}
                                            </div>
                                        </div>
                                        <div className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-2">{point.time}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between mt-6 text-xs text-charcoal-500 dark:text-charcoal-400">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 mr-2"></div>
                            <span>Fixer.io</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 dark:bg-purple-400 mr-2"></div>
                            <span>OpenExchangeRates</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400 mr-2"></div>
                            <span>Manual Override</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Rate Explorer Table */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
                        Rate Explorer
                    </h3>
                    <div className="flex items-center space-x-3">
                        <div className="relative max-w-xs">
                            <Search size={16} className="absolute left-3 top-1/2 -trancharcoal-y-1/2 text-charcoal-400" />
                            <input
                                type="text"
                                placeholder="Search by pair or source..."
                                className="pl-9 pr-4 py-2 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <select
                            className="pl-3 pr-8 py-2 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm appearance-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                        >
                            <option value="all">All Rate Types</option>
                            <option value="live">Live</option>
                            <option value="historical">Historical</option>
                            <option value="manual">Manual</option>
                        </select>

                        <button className="p-2 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors">
                            <Filter size={16} className="text-charcoal-500 dark:text-charcoal-400" />
                        </button>

                        <button className="flex items-center p-2 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors text-charcoal-500 dark:text-charcoal-400">
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 overflow-hidden shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-charcoal-50 dark:bg-charcoal-700/30 border-b border-charcoal-200 dark:border-charcoal-700">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            Currency Pair
                                            <ChevronDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                        <div className="flex items-center justify-end">
                                            Rate Value
                                            <ChevronDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            Timestamp
                                            <ChevronDown size={14} className="ml-1" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal-200 dark:divide-charcoal-700">
                                {exchangeRates.map((rate, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                        className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/20 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-xs">
                                                    {rate.pair.split('/')[0]}
                                                </div>
                                                <span className="ml-3 font-medium text-charcoal-900 dark:text-white">
                                                    {rate.pair}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full ${rate.source === 'Fixer.io' ? 'bg-blue-500 dark:bg-blue-400' :
                                                        rate.source === 'OpenExchangeRates' ? 'bg-purple-500 dark:bg-purple-400' :
                                                            'bg-amber-500 dark:bg-amber-400'
                                                    } mr-2`}></div>
                                                <span className="text-sm text-charcoal-900 dark:text-charcoal-200">
                                                    {rate.source}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className="text-sm font-mono font-medium text-charcoal-900 dark:text-white">
                                                {rate.rate.toFixed(rate.pair.includes('JPY') ? 3 : 2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rate.type === 'Live' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
                                                    rate.type === 'Manual' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' :
                                                        'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-charcoal-400'
                                                }`}>
                                                {rate.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-500 dark:text-charcoal-400">
                                            {formatTimestamp(rate.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(rate.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                                View Details
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-white dark:bg-charcoal-800 border-t border-charcoal-200 dark:border-charcoal-700 flex items-center justify-between">
                        <div className="text-sm text-charcoal-500 dark:text-charcoal-400">
                            Showing <span className="font-medium text-charcoal-700 dark:text-charcoal-300">1</span> to <span className="font-medium text-charcoal-700 dark:text-charcoal-300">7</span> of <span className="font-medium text-charcoal-700 dark:text-charcoal-300">32</span> rates
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

            {/* Information Footer */}
            <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm text-blue-800 dark:text-blue-300">
                <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">Rate Source Information</p>
                    <p>Exchange rates are collected from multiple sources to ensure reliability. Priority is given to Fixer.io with fallback to OpenExchangeRates. Manual overrides take precedence when explicitly set by admins.</p>
                </div>
            </div>
        </div>
    );
}

export default ExchangeRateViewer;