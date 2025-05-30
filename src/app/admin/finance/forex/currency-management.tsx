import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Search, Filter, MoreHorizontal,
    Edit, Trash2, Eye, ChevronDown, Download
} from 'lucide-react';

const CurrencyManagement = () => {
    const [currencies, setCurrencies] = useState([
        { code: 'USD', name: 'United States Dollar', symbol: '$', precision: 2, status: 'Active' },
        { code: 'EUR', name: 'Euro', symbol: '€', precision: 2, status: 'Active' },
        { code: 'GBP', name: 'British Pound', symbol: '£', precision: 2, status: 'Active' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', precision: 0, status: 'Active' },
        { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', precision: 2, status: 'Active' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', precision: 2, status: 'Inactive' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', precision: 2, status: 'Active' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', precision: 2, status: 'Active' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', precision: 2, status: 'Inactive' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', precision: 2, status: 'Active' },
    ]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredCurrencies = currencies.filter(currency => {
        const matchesSearch =
            currency.code.toLowerCase().includes(search.toLowerCase()) ||
            currency.name.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            currency.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-charcoal-900 dark:text-white">
                        Currency Management
                    </h1>
                    <p className="text-charcoal-500 dark:text-charcoal-400">
                        Manage supported currencies and their attributes
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center text-sm px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={16} className="mr-2" />
                    Add Currency
                </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3.5 top-1/2 -trancharcoal-y-1/2 text-charcoal-400" />
                    <input
                        type="text"
                        placeholder="Search currencies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex items-center space-x-3">
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

            {/* Currency Table */}
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
                                        ISO Code
                                        <ChevronDown size={14} className="ml-1" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Precision</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-200 dark:divide-charcoal-700">
                            {filteredCurrencies.map((currency, index) => (
                                <motion.tr
                                    key={currency.code}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    className="hover:bg-charcoal-50 dark:hover:bg-charcoal-700/20 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                                                {currency.code.substring(0, 2)}
                                            </div>
                                            <span className="ml-3 font-medium text-charcoal-900 dark:text-white">
                                                {currency.code}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-900 dark:text-charcoal-200">
                                        {currency.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-900 dark:text-charcoal-200">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-charcoal-100 dark:bg-charcoal-700 rounded text-charcoal-800 dark:text-charcoal-200">
                                            {currency.symbol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-900 dark:text-charcoal-200">
                                        {currency.precision}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currency.status === 'Active'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                                                : 'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-charcoal-400'
                                            }`}>
                                            {currency.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-1.5 text-charcoal-400 hover:text-blue-600 dark:text-charcoal-500 dark:hover:text-blue-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-1.5 text-charcoal-400 hover:text-amber-600 dark:text-charcoal-500 dark:hover:text-amber-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1.5 text-charcoal-400 hover:text-red-600 dark:text-charcoal-500 dark:hover:text-red-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700/30 rounded transition-colors">
                                                <Trash2 size={16} />
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
                        Showing <span className="font-medium text-charcoal-700 dark:text-charcoal-300">1</span> to <span className="font-medium text-charcoal-700 dark:text-charcoal-300">10</span> of <span className="font-medium text-charcoal-700 dark:text-charcoal-300">20</span> currencies
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

            {/* Add Currency Modal - Shown when showAddModal is true */}
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
                                Add New Currency
                            </h3>
                            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                                Enter the details of the currency to be added
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                    ISO Code (3 letters)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., USD"
                                    maxLength={3}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., United States Dollar"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                    Symbol
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., $"
                                    maxLength={5}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 placeholder-charcoal-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 dark:text-charcoal-300 mb-1">
                                    Decimal Precision
                                </label>
                                <select
                                    className="w-full px-4 py-2.5 bg-white dark:bg-charcoal-700 border border-charcoal-200 dark:border-charcoal-600 rounded-lg text-charcoal-900 dark:text-charcoal-200 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
                                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="0">0 - No decimal places</option>
                                    <option value="1">1 decimal place</option>
                                    <option value="2" selected>2 decimal places</option>
                                    <option value="3">3 decimal places</option>
                                    <option value="4">4 decimal places</option>
                                </select>
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
                                Add Currency
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default CurrencyManagement;