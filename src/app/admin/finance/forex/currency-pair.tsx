import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Search, Filter, Edit,
    Trash2, Eye, ChevronDown, Download,
    ArrowUp, ArrowDown, BarChart2, RefreshCw,
    AlertTriangle, Link, Unlink, Percent
} from 'lucide-react';

const CurrencyPairManagement = () => {
    // Sample currency pairs data
    const [pairs, setPairs] = useState([
        {
            base: 'USD',
            quote: 'KES',
            pair: 'USD/KES',
            customSpread: 1.4,
            defaultSpread: 1.2,
            status: 'Active',
            lastUpdated: '2025-05-30T10:15:00'
        },
        {
            base: 'EUR',
            quote: 'KES',
            pair: 'EUR/KES',
            customSpread: null,
            defaultSpread: 1.2,
            status: 'Active',
            lastUpdated: '2025-05-30T10:15:00'
        },
        {
            base: 'GBP',
            quote: 'KES',
            pair: 'GBP/KES',
            customSpread: 1.5,
            defaultSpread: 1.2,
            status: 'Active',
            lastUpdated: '2025-05-30T10:15:00'
        },
        {
            base: 'JPY',
            quote: 'KES',
            pair: 'JPY/KES',
            customSpread: null,
            defaultSpread: 1.2,
            status: 'Active',
            lastUpdated: '2025-05-30T10:15:00'
        },
        {
            base: 'USD',
            quote: 'EUR',
            pair: 'USD/EUR',
            customSpread: 1.0,
            defaultSpread: 1.2,
            status: 'Active',
            lastUpdated: '2025-05-30T10:15:00'
        },
        {
            base: 'USD',
            quote: 'GBP',
            pair: 'USD/GBP',
            customSpread: null,
            defaultSpread: 1.2,
            status: 'Active',
            lastUpdated: '2025-05-30T10:15:00'
        },
        {
            base: 'USD',
            quote: 'JPY',
            pair: 'USD/JPY',
            customSpread: null,
            defaultSpread: 1.2,
            status: 'Inactive',
            lastUpdated: '2025-05-29T14:30:00'
        },
    ]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [baseFilter, setBaseFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTrendModal, setShowTrendModal] = useState(false);
    const [selectedPair, setSelectedPair] = useState(null);

    const filteredPairs = pairs.filter(pair => {
        const matchesSearch =
            pair.pair.toLowerCase().includes(search.toLowerCase()) ||
            pair.base.toLowerCase().includes(search.toLowerCase()) ||
            pair.quote.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            pair.status.toLowerCase() === statusFilter.toLowerCase();

        const matchesBase =
            baseFilter === 'all' ||
            pair.base === baseFilter;

        return matchesSearch && matchesStatus && matchesBase;
    });

    // Format date
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleViewTrends = (pair: any) => {
        setSelectedPair(pair);
        setShowTrendModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-charcoal-900 dark:text-white">
                        Currency Pair Management
                    </h1>
                    <p className="text-charcoal-500 dark:text-charcoal-400">
                        Configure and monitor currency pairs for exchange operations
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center text-sm px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={16} className="mr-2" />
                    Add Currency Pair
                </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3.5 top-1/2 -trancharcoal-y-1/2 text-charcoal-400" />
                    <input
                        type="text"
                        placeholder="Search currency pairs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <select
                        value={baseFilter}
                        onChange={e => setBaseFilter(e.target.value)}
                        className="pl-4 pr-10 py-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                    >
                        <option value="all">All Base Currencies</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="pl-4 pr-10 py-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button className="p-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors">
                        <Filter size={18} className="text-charcoal-500 dark:text-charcoal-400" />
                    </button>

                    <button className="flex items-center p-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors text-charcoal-500 dark:text-charcoal-400">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Currency Pairs Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-200 dark:border-charcoal-700 overflow-hidden shadow-sm"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-charcoal-50 dark:bg-charcoal-700/30 border-b border-charcoal-200 dark:border-charcoal-700">
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        Pair
                                        <ChevronDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Base Currency</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Quote Currency</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                    <div className="flex items-center justify-center">
                                        Custom Spread
                                        <ChevronDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Default Spread</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        Last Updated
                                        <ChevronDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-200 dark:divide-charcoal-700">
                            {filteredPairs.map((pair, index) => (
                                <motion.tr
                                    key={pair.pair}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/20 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-xs">
                                                {pair.base}/{pair.quote}
                                            </div>
                                            <span className="ml-3 font-medium text-charcoal-900 dark:text-white">
                                                {pair.pair}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-charcoal-100 dark:bg-charcoal-700 flex items-center justify-center text-charcoal-700 dark:text-charcoal-300 text-xs font-medium mr-2">
                                                {pair.base}
                                            </div>
                                            <span className="text-sm text-charcoal-900 dark:text-charcoal-200">
                                                {pair.base}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-charcoal-100 dark:bg-charcoal-700 flex items-center justify-center text-charcoal-700 dark:text-charcoal-300 text-xs font-medium mr-2">
                                                {pair.quote}
                                            </div>
                                            <span className="text-sm text-charcoal-900 dark:text-charcoal-200">
                                                {pair.quote}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {pair.customSpread !== null ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                                <Percent size={12} className="mr-1" />
                                                {pair.customSpread.toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span className="text-sm text-charcoal-400 dark:text-charcoal-500">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-sm text-charcoal-500 dark:text-charcoal-400">
                                            {pair.defaultSpread.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pair.status === 'Active'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                                                : 'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-charcoal-400'
                                            }`}>
                                            {pair.status === 'Active' ? (
                                                <Link size={12} className="mr-1" />
                                            ) : (
                                                <Unlink size={12} className="mr-1" />
                                            )}
                                            {pair.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-500 dark:text-charcoal-400">
                                        {formatDateTime(pair.lastUpdated)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                className="p-1.5 text-charcoal-400 hover:text-blue-600 dark:text-charcoal-500 dark:hover:text-blue-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors"
                                                onClick={() => handleViewTrends(pair)}
                                                title="View Trends"
                                            >
                                                <BarChart2 size={16} />
                                            </button>
                                            <button
                                                className="p-1.5 text-charcoal-400 hover:text-amber-600 dark:text-charcoal-500 dark:hover:text-amber-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors"
                                                title="Edit Pair"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="p-1.5 text-charcoal-400 hover:text-red-600 dark:text-charcoal-500 dark:hover:text-red-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors"
                                                title="Disable Pair"
                                            >
                                                {pair.status === 'Active' ? <Unlink size={16} /> : <Link size={16} />}
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
                        Showing <span className="font-medium text-charcoal-700 dark:text-charcoal-300">1</span> to <span className="font-medium text-charcoal-700 dark:text-charcoal-300">7</span> of <span className="font-medium text-charcoal-700 dark:text-charcoal-300">12</span> currency pairs
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded text-blue-600 dark:text-blue-400 text-sm font-medium">
                            1
                        </button>
                        <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Add Currency Pair Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-xl max-w-md w-full mx-4"
                    >
                        <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700">
                            <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">
                                Add New Currency Pair
                            </h3>
                            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                                Configure a new trading pair for currency exchange
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                    Base Currency
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="" disabled selected>Select base currency</option>
                                    <option value="USD">USD - United States Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="KES">KES - Kenyan Shilling</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                    Quote Currency
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="" disabled selected>Select quote currency</option>
                                    <option value="USD">USD - United States Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="KES">KES - Kenyan Shilling</option>
                                </select>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="custom-spread"
                                    className="w-4 h-4 text-blue-600 dark:text-blue-500 border-charcoal-300 dark:border-charcoal-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                                />
                                <label htmlFor="custom-spread" className="ml-2 text-sm text-charcoal-700 dark:text-charcoal-300">
                                    Use custom spread (overrides default)
                                </label>
                            </div>

                            <div className="pl-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                        Custom Spread (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            placeholder="e.g., 1.5"
                                            disabled
                                            className="w-full px-4 py-2.5 bg-charcoal-100 dark:bg-charcoal-700/50 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-400 dark:text-charcoal-500 placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <Percent size={16} className="text-charcoal-400 dark:text-charcoal-500" />
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-charcoal-500 dark:text-charcoal-400">
                                        Default spread: 1.2%
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                    Status
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="active"
                                            defaultChecked
                                            className="w-4 h-4 text-blue-600 dark:text-blue-500 border-charcoal-300 dark:border-charcoal-600 focus:ring-blue-500 dark:focus:ring-blue-500/20"
                                        />
                                        <span className="ml-2 text-sm text-charcoal-700 dark:text-charcoal-300">Active</span>
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="inactive"
                                            className="w-4 h-4 text-blue-600 dark:text-blue-500 border-charcoal-300 dark:border-charcoal-600 focus:ring-blue-500 dark:focus:ring-blue-500/20"
                                        />
                                        <span className="ml-2 text-sm text-charcoal-700 dark:text-charcoal-300">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-charcoal-200 dark:border-charcoal-700 flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                            >
                                Add Pair
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* View Exchange Rate Trends Modal */}
            {showTrendModal && selectedPair && (
                <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-xl max-w-3xl w-full mx-4"
                    >
                        <div className="p-6 border-b border-charcoal-200 dark:border-charcoal-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">
                                    {selectedPair.pair} Exchange Rate Trends
                                </h3>
                                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                                    Historical rate performance and analysis
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
                                    <RefreshCw size={14} className="mr-1.5" />
                                    Refresh
                                </button>
                                <button
                                    onClick={() => setShowTrendModal(false)}
                                    className="flex items-center p-1.5 rounded-lg text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded text-blue-600 dark:text-blue-400 text-sm font-medium">
                                        1D
                                    </button>
                                    <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                                        7D
                                    </button>
                                    <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                                        1M
                                    </button>
                                    <button className="px-3 py-1.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded text-charcoal-500 dark:text-charcoal-400 text-sm hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors">
                                        3M
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 mr-2"></div>
                                        <span className="text-xs text-charcoal-500 dark:text-charcoal-400">Rate</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400 mr-2"></div>
                                        <span className="text-xs text-charcoal-500 dark:text-charcoal-400">Spread Boundary</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="h-64 mb-6 bg-charcoal-50 dark:bg-charcoal-700/30 rounded-lg p-4">
                                <div className="h-full flex items-end space-x-1">
                                    {Array.from({ length: 24 }).map((_, i) => {
                                        const height = `${30 + Math.random() * 60}%`;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center h-full">
                                                <div
                                                    className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-sm hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors relative group"
                                                    style={{ height }}
                                                >
                                                    <div className="absolute bottom-full left-1/2 transform -trancharcoal-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-800 dark:bg-charcoal-700 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap">
                                                        {`${i}:00: ${(130 + Math.random() * 5).toFixed(2)}`}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">Current Statistics</h4>
                                    <div className="bg-charcoal-50 dark:bg-charcoal-700/30 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Current Rate</span>
                                            <span className="text-sm font-mono font-medium text-charcoal-900 dark:text-white">132.45</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">24h Change</span>
                                            <div className="flex items-center">
                                                <ArrowUp size={14} className="mr-1.5 text-emerald-500 dark:text-emerald-400" />
                                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+0.85%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">24h High</span>
                                            <span className="text-sm font-mono text-charcoal-900 dark:text-white">133.12</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">24h Low</span>
                                            <span className="text-sm font-mono text-charcoal-900 dark:text-white">131.98</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-charcoal-500 dark:text-charcoal-400 mb-2">Spread Information</h4>
                                    <div className="bg-charcoal-50 dark:bg-charcoal-700/30 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Effective Spread</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                                <Percent size={12} className="mr-1" />
                                                {selectedPair.customSpread !== null ? selectedPair.customSpread.toFixed(1) : selectedPair.defaultSpread.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Buy Rate</span>
                                            <span className="text-sm font-mono text-charcoal-900 dark:text-white">133.30</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Sell Rate</span>
                                            <span className="text-sm font-mono text-charcoal-900 dark:text-white">131.60</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Overridden</span>
                                            <span className="text-sm font-medium text-charcoal-900 dark:text-white">
                                                {selectedPair.customSpread !== null ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-charcoal-200 dark:border-charcoal-700 flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setShowTrendModal(false)}
                                className="px-4 py-2 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-600 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowTrendModal(false);
                                    // Here you would navigate to the full Exchange Rate Viewer
                                }}
                                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                            >
                                View Full Rate History
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Information Banner */}
            <div className="mt-6 flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30 text-sm text-amber-800 dark:text-amber-300">
                <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">About Currency Pairs</p>
                    <p>Each currency pair consists of a base currency and a quote currency. The exchange rate represents how much of the quote currency is needed to purchase one unit of the base currency. Custom spreads override the global default spread setting.</p>
                </div>
            </div>
        </div>
    );
}

export default CurrencyPairManagement