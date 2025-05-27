import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Eye,
    ArrowDownUp,
    ArrowUp,
    ArrowDown,
    FileText,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Filter,
    Minus,
    Calendar,
    FileSpreadsheet,
    ArrowUpDown,
    CircleDollarSign,
    BanknoteIcon,
    BarChart2,
    FileCheck,
    ClipboardList,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import { Transaction } from '../../../../types/transaction';

interface PaginationData {
    total: number;
    page: number;
    pages: number;
}

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

const TransactionsPage: React.FC = () => {
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
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchTransactions(currentPage, itemsPerPage, searchQuery);
    }, [currentPage, itemsPerPage, searchQuery, filterStatus]);

    const fetchTransactions = async (page: number, limit: number, query: string = '') => {
        try {
            setIsLoading(true);
            const filters = {
                page: page,
                limit: limit,
                search: query || undefined,
                status: filterStatus !== 'all' ? filterStatus : undefined
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
                    year: 'numeric',
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

    const toggleTransactionSelection = (e: React.ChangeEvent<HTMLInputElement>, transactionId: string) => {
        e.stopPropagation();
        setSelectedTransactions(prev =>
            prev.includes(transactionId)
                ? prev.filter(id => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    const toggleAllTransactions = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTransactions(transactions.map(t => t.id));
        } else {
            setSelectedTransactions([]);
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        }

        setSortConfig({ key, direction });

        const sortedTransactions = [...transactions].sort((a, b) => {
            if (key === 'amount') {
                const aAmount = getTransactionAmount(a);
                const bAmount = getTransactionAmount(b);
                return direction === 'asc' ? aAmount - bAmount : bAmount - aAmount;
            } else if (key === 'createdAt') {
                return direction === 'asc'
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (key === 'balance') {
                return direction === 'asc' ? a.balance - b.balance : b.balance - a.balance;
            } else if (key === 'type') {
                const aType = getTransactionType(a);
                const bType = getTransactionType(b);
                return direction === 'asc'
                    ? aType.localeCompare(bType)
                    : bType.localeCompare(aType);
            }
            return 0;
        });

        setTransactions(sortedTransactions);
    };

    const renderTransactionIcon = (transaction: Transaction) => {
        const type = getTransactionType(transaction);

        let icon;
        let bgColor;
        let iconColor;

        switch (type) {
            case 'Deposit':
                icon = <BanknoteIcon size={16} strokeWidth={2} />;
                bgColor = 'bg-success-100';
                iconColor = 'text-success-600';
                break;
            case 'Withdrawal':
                icon = <CircleDollarSign size={16} strokeWidth={2} />;
                bgColor = 'bg-danger-100';
                iconColor = 'text-danger-600';
                break;
            case 'Transfer':
                icon = <ArrowDownUp size={16} strokeWidth={2} />;
                bgColor = 'bg-primary-100';
                iconColor = 'text-primary-600';
                break;
            default:
                icon = <Minus size={16} strokeWidth={2} />;
                bgColor = 'bg-neutral-100';
                iconColor = 'text-neutral-600';
        }

        return (
            <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center ${iconColor}`}>
                {icon}
            </div>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const renderAmount = (transaction: Transaction) => {
        const amount = getTransactionAmount(transaction);
        const isDebit = transaction.debit > 0;
        const type = getTransactionType(transaction);

        let textColor = 'text-neutral-900';
        let prefix = '';

        if (type === 'Deposit') {
            textColor = 'text-success-600';
            prefix = '+';
        } else if (type === 'Withdrawal') {
            textColor = 'text-danger-600';
            prefix = '-';
        }

        return (
            <div className={`font-semibold text-right ${textColor}`}>
                <div className="text-sm whitespace-nowrap">
                    {prefix}{formatCurrency(amount)}
                </div>
            </div>
        );
    };

    const renderStatusBadge = (status: string) => {
        let bgColor = 'bg-neutral-100';
        let textColor = 'text-neutral-700';
        let borderColor = 'border-neutral-200';
        let icon = null;

        switch (status) {
            case 'Complete':
                bgColor = 'bg-success-50';
                textColor = 'text-success-700';
                borderColor = 'border-success-200';
                icon = <CheckCircle size={12} className="mr-1 text-success-500" />;
                break;
            case 'Pending':
                bgColor = 'bg-warning-50';
                textColor = 'text-warning-700';
                borderColor = 'border-warning-200';
                icon = <Clock size={12} className="mr-1 text-warning-500" />;
                break;
            case 'Failed':
                bgColor = 'bg-danger-50';
                textColor = 'text-danger-700';
                borderColor = 'border-danger-200';
                icon = <XCircle size={12} className="mr-1 text-danger-500" />;
                break;
        }

        return (
            <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${bgColor} ${textColor} ${borderColor}`}>
                {icon}
                {status}
            </div>
        );
    };

    const renderSortIcon = (key: string) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown size={14} className="ml-1 text-neutral-400" />;
        }

        return sortConfig.direction === 'asc'
            ? <ArrowUp size={14} className="ml-1 text-primary-500" />
            : <ArrowDown size={14} className="ml-1 text-primary-500" />;
    };

    const renderPagination = () => {
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, paginationData.total);

        return (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200">
                <div className="text-sm text-neutral-600">
                    Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{paginationData.total.toLocaleString()}</span> transactions
                </div>

                <div className="flex items-center space-x-2">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="px-3 py-1.5 text-sm border border-neutral-200 bg-white rounded-lg focus:ring-2 focus:ring-primary-500/30 transition-all"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>

                    <div className="flex items-center space-x-1 ml-4">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="px-4 py-2 text-sm font-medium text-neutral-900 border border-neutral-200 rounded-lg">
                            Page {currentPage} of {paginationData.pages}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === paginationData.pages}
                            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => handlePageChange(paginationData.pages)}
                            disabled={currentPage === paginationData.pages}
                            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-6">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-xl border border-primary-100 shadow-card text-center max-w-md">
                    <div className="w-16 h-16 bg-danger-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} className="text-danger-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Transaction Data Unavailable</h3>
                    <p className="text-neutral-600 mb-6">{error}</p>
                    <button
                        onClick={() => fetchTransactions(currentPage, itemsPerPage, searchQuery)}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-button"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-finance-navy/5 via-white to-primary-50/30">
            <div className="bg-white backdrop-blur-xl border-b border-primary-100">
                <div className="w-full mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 flex items-center">
                                <ClipboardList size={24} className="mr-2 text-primary-600" />
                                Transaction Registry
                            </h1>
                            <p className="text-neutral-600 mt-1">Monitor and analyze all financial activities</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <motion.button
                                className="flex items-center px-3 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <BarChart2 size={16} className="mr-2 text-primary-600" />
                                Analytics
                            </motion.button>
                            <motion.button
                                className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all shadow-button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FileSpreadsheet size={16} className="mr-2" />
                                Export Report
                            </motion.button>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="relative flex-1 max-w-2xl">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by ID, amount, or description..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-primary-500/30 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex items-center space-x-3 ml-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:ring-2 focus:ring-primary-500/30 transition-all shadow-sm"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Complete">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </select>

                            <button className="p-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                                <Filter size={18} className="text-neutral-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mt-4 mx-auto">
                <motion.div
                    className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-neutral-500">Loading transaction data...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
                                <FileText size={24} className="text-neutral-400" />
                            </div>
                            <p className="text-lg font-medium text-neutral-900">No transactions found</p>
                            <p className="text-sm text-neutral-500">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-neutral-50 border-b border-neutral-200">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                                        checked={selectedTransactions.length === transactions.length}
                                                        onChange={toggleAllTransactions}
                                                    />
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                <button
                                                    className="flex items-center focus:outline-none"
                                                    onClick={() => handleSort('type')}
                                                >
                                                    Transaction Type
                                                    {renderSortIcon('type')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                <button
                                                    className="flex items-center focus:outline-none"
                                                    onClick={() => handleSort('createdAt')}
                                                >
                                                    Date & Time
                                                    {renderSortIcon('createdAt')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                <button
                                                    className="flex items-center ml-auto focus:outline-none"
                                                    onClick={() => handleSort('amount')}
                                                >
                                                    Amount
                                                    {renderSortIcon('amount')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                <button
                                                    className="flex items-center ml-auto focus:outline-none"
                                                    onClick={() => handleSort('balance')}
                                                >
                                                    Balance
                                                    {renderSortIcon('balance')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 bg-white">
                                        <AnimatePresence>
                                            {transactions.map((transaction, index) => {
                                                const { date, time } = formatDateTime(transaction.createdAt);
                                                const type = getTransactionType(transaction);
                                                const isSelected = selectedTransactions.includes(transaction.id);

                                                return (
                                                    <motion.tr
                                                        key={transaction.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2, delay: index * 0.01 }}
                                                        className={`hover:bg-primary-50/30 transition-colors cursor-pointer ${isSelected ? 'bg-primary-50/50' : ''}`}
                                                        onClick={() => handleViewTransaction(transaction)}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                                                checked={isSelected}
                                                                onChange={(e) => toggleTransactionSelection(e, transaction.id)}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {renderTransactionIcon(transaction)}
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-neutral-900">{type}</p>
                                                                    <p className="text-xs text-neutral-500">
                                                                        {transaction.user ? (
                                                                            <>
                                                                                {transaction.user.first_name} {transaction.user.last_name}
                                                                            </>
                                                                        ) : (
                                                                            "System"
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <p className="text-sm text-neutral-900">{date}</p>
                                                            <p className="text-xs text-neutral-500">{time}</p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {renderStatusBadge(transaction.status)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            {renderAmount(transaction)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <span className="text-sm font-medium text-neutral-900">
                                                                {formatCurrency(transaction.balance)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <button
                                                                className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewTransaction(transaction);
                                                                }}
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                            {renderPagination()}
                        </>
                    )}
                </motion.div>

                <div className="mt-4 px-4 pb-4 text-xs text-neutral-500 flex items-center justify-between">
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>Data refreshed at {new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center">
                        <FileCheck size={14} className="mr-1 text-primary-600" />
                        <span>This report is generated for financial audit purposes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;