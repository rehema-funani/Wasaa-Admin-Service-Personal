import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Download,
    Upload,
    Eye,
    ArrowDownUp,
    ArrowUp,
    ArrowDown,
    Hash,
    FileText,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Filter,
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import { Transaction } from '../../../../types/transaction';

interface PaginationData {
    total: number;
    page: number;
    pages: number;
}

const page = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [paginationData, setPaginationData] = useState<PaginationData>({
        total: 0,
        page: 1,
        pages: 1
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

    useEffect(() => {
        fetchTransactions(currentPage, itemsPerPage, searchQuery);
    }, [currentPage, itemsPerPage, searchQuery]);

    const fetchTransactions = async (page: number, limit: number, query: string = '') => {
        try {
            setIsLoading(true);
            const filters = {
                page: page,
                limit: limit,
                search: query || undefined
            };

            const response = await financeService.getAllTransactions(filters);

            if (response?.data?.transactions) {
                setTransactions(response.data.transactions);
                setPaginationData({
                    total: response.data.total || 0,
                    page: response.data.page || 1,
                    pages: response.data.pages || 1
                });
            } else {
                throw new Error('Invalid response format');
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Failed to load transactions. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateTime = (dateString: string): { date: string; time: string } => {
        try {
            const date = new Date(dateString);
            return {
                date: date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }),
                time: date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };
        } catch (error) {
            return { date: 'Invalid', time: '--' };
        }
    };

    const getTransactionType = (transaction: Transaction): string => {
        if (transaction.debit > 0 && transaction.credit === 0) {
            return 'Deposit';
        } else if (transaction.debit === 0 && transaction.credit > 0) {
            return 'Withdrawal';
        } else if (transaction.debit > 0 && transaction.credit > 0) {
            return 'Transfer';
        } else {
            return 'Other';
        }
    };

    const getTransactionAmount = (transaction: Transaction): number => {
        return transaction.debit > 0 ? transaction.debit : transaction.credit;
    };

    const handleViewTransaction = (transaction: Transaction) => {
        navigate(`/admin/finance/transactions/receipt/${transaction.id}`, {
            state: { transaction }
        });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= paginationData.pages) {
            setCurrentPage(page);
        }
    };

    const toggleTransactionSelection = (transactionId: string) => {
        setSelectedTransactions(prev =>
            prev.includes(transactionId)
                ? prev.filter(id => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    const renderTransactionIcon = (transaction: Transaction) => {
        const type = getTransactionType(transaction);
        const isDebit = transaction.debit > 0;

        let icon;
        let bgColor;
        let iconColor;

        switch (type) {
            case 'Deposit':
                icon = <TrendingUp size={16} strokeWidth={2.5} />;
                bgColor = 'bg-emerald-500/10';
                iconColor = 'text-emerald-600';
                break;
            case 'Withdrawal':
                icon = <TrendingDown size={16} strokeWidth={2.5} />;
                bgColor = 'bg-red-500/10';
                iconColor = 'text-red-600';
                break;
            case 'Transfer':
                icon = <ArrowDownUp size={16} strokeWidth={2.5} />;
                bgColor = 'bg-primary-500/10';
                iconColor = 'text-primary-600';
                break;
            default:
                icon = <Minus size={16} strokeWidth={2.5} />;
                bgColor = 'bg-gray-500/10';
                iconColor = 'text-gray-600';
        }

        return (
            <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center ${iconColor}`}>
                {icon}
            </div>
        );
    };

    const renderAmount = (transaction: Transaction) => {
        const amount = getTransactionAmount(transaction);
        const isDebit = transaction.debit > 0;
        const type = getTransactionType(transaction);

        let textColor = 'text-gray-900';
        let prefix = '';

        if (type === 'Deposit') {
            textColor = 'text-emerald-600';
            prefix = '+';
        } else if (type === 'Withdrawal') {
            textColor = 'text-red-600';
            prefix = '-';
        }

        return (
            <div className={`font-semibold text-right ${textColor}`}>
                <div className="text-base">
                    {prefix}KES {amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 font-normal">
                    Bal: {transaction.balance.toLocaleString()}
                </div>
            </div>
        );
    };

    const renderPagination = () => {
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, paginationData.total);

        return (
            <div className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-t border-gray-100">
                <div className="text-sm text-gray-600">
                    {startItem}–{endItem} of {paginationData.total.toLocaleString()}
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="px-3 py-1.5 text-sm border-0 bg-gray-100 rounded-full focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all"
                    >
                        <option value={10}>10 rows</option>
                        <option value={25}>25 rows</option>
                        <option value={50}>50 rows</option>
                        <option value={100}>100 rows</option>
                    </select>

                    <div className="flex items-center space-x-1 ml-4">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="px-4 py-2 text-sm font-medium text-gray-900">
                            {currentPage} of {paginationData.pages}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === paginationData.pages}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => handlePageChange(paginationData.pages)}
                            disabled={currentPage === paginationData.pages}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => fetchTransactions(currentPage, itemsPerPage, searchQuery)}
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                            <p className="text-gray-600 mt-1">Monitor all financial activities</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.button
                                className="flex items-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download size={18} className="mr-2" />
                                Export
                            </motion.button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 relative">
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                                <Filter size={18} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                <motion.div
                    className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                <FileText size={24} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-900">No transactions found</p>
                            <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {transactions.map((transaction, index) => {
                                        const { date, time } = formatDateTime(transaction.createdAt);
                                        const type = getTransactionType(transaction);

                                        return (
                                            <motion.div
                                                key={transaction.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.02 }}
                                                className="group hover:bg-gray-50/50 transition-all duration-200 cursor-pointer"
                                                onClick={() => handleViewTransaction(transaction)}
                                            >
                                                <div className="flex items-center justify-between p-6">
                                                    <div className="flex items-center space-x-4">
                                                        {renderTransactionIcon(transaction)}

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-3">
                                                                <p className="font-semibold text-gray-900 text-base">{type}</p>
                                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                                    {transaction.status}
                                                                </span>
                                                            </div>

                                                            <div className="mt-1 flex items-center space-x-4">
                                                                {transaction.user ? (
                                                                    <p className="text-sm text-gray-600">
                                                                        {transaction.user.first_name} {transaction.user.last_name}
                                                                    </p>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500">System Transaction</p>
                                                                )}

                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    <Hash size={12} className="mr-1" />
                                                                    {transaction.id.substring(0, 8)}
                                                                </div>
                                                            </div>

                                                            {transaction.description && (
                                                                <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                                                                    {transaction.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-6">
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-500">{date}</div>
                                                            <div className="text-xs text-gray-400">{time}</div>
                                                        </div>

                                                        {renderAmount(transaction)}

                                                        <motion.button
                                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full transition-all"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewTransaction(transaction);
                                                            }}
                                                        >
                                                            <Eye size={16} className="text-gray-400" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                            {renderPagination()}
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default page;