import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Upload,
    Eye,
    Edit,
    Trash2,
    Plus,
    Clock,
    ArrowDownUp,
    ArrowUp,
    ArrowDown,
    DollarSign,
    Hash,
    FileText,
    Calendar,
    XCircle,
    CheckCircle,
    X,
    ExternalLink,
    Copy
} from 'lucide-react';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import financeService from '../../../../api/services/finance';
import TransactionReceiptModal from '../../../../components/finance/TransactionReceiptModal';
import { Transaction } from '../../../../types/transaction';

interface PaginationData {
    total: number;
    page: number;
    pages: number;
}

const TransactionsPage = () => {
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
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'deposit', 'withdrawal', 'mpesa'
    ]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    useEffect(() => {
        fetchTransactions(currentPage, itemsPerPage, searchQuery);
    }, [currentPage, itemsPerPage, searchQuery]);

    const fetchTransactions = async (page: number, limit: number, query: string = '') => {
        try {
            setIsLoading(true);
            const filters = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined
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
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        } catch (error) {
            return { date: 'Invalid Date', time: '--:--' };
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
        setSelectedTransaction(transaction);
        setShowReceiptModal(true);
    };

    const closeReceiptModal = () => {
        setShowReceiptModal(false);
        setTimeout(() => setSelectedTransaction(null), 300);
    };

    const columns = [
        {
            id: 'id',
            header: 'Transaction ID',
            accessor: (row: Transaction) => row.id,
            sortable: true,
            width: '150px',
            cell: (value: string) => (
                <div className="flex items-center">
                    <Hash size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                    <span className="font-medium text-gray-800 text-sm">{value.substring(0, 8)}...</span>
                </div>
            )
        },
        {
            id: 'type',
            header: 'Type',
            accessor: (row: Transaction) => getTransactionType(row),
            sortable: true,
            width: '120px',
            cell: (value: string, row: Transaction) => {
                let icon;
                let color;

                switch (value) {
                    case 'Deposit':
                        icon = <ArrowDown size={16} className="mr-1.5" strokeWidth={2} />;
                        color = 'text-green-600 bg-green-50';
                        break;
                    case 'Withdrawal':
                        icon = <ArrowUp size={16} className="mr-1.5" strokeWidth={2} />;
                        color = 'text-red-600 bg-red-50';
                        break;
                    case 'Transfer':
                        icon = <ArrowDownUp size={16} className="mr-1.5" strokeWidth={2} />;
                        color = 'text-blue-600 bg-blue-50';
                        break;
                    default:
                        icon = <ArrowDownUp size={16} className="mr-1.5" strokeWidth={2} />;
                        color = 'text-gray-600 bg-gray-50';
                }

                return (
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${color}`}>
                        {icon}
                        {value}
                    </div>
                );
            }
        },
        {
            id: 'amount',
            header: 'Amount',
            accessor: (row: Transaction) => getTransactionAmount(row),
            sortable: true,
            width: '120px',
            cell: (value: number, row: Transaction) => {
                const isDebit = row.debit > 0;
                const color = isDebit ? 'text-green-600' : 'text-red-600';
                const sign = isDebit ? '+' : '-';

                return (
                    <div className={`font-medium ${color} flex items-center`}>
                        <span>Kes. {value.toFixed(2)}</span>
                    </div>
                );
            }
        },
        {
            id: 'balance',
            header: 'Balance',
            accessor: (row: Transaction) => row.balance,
            sortable: true,
            width: '120px',
            cell: (value: number) => (
                <div className="font-medium text-gray-800">
                    Kes. {value.toFixed(2)}
                </div>
            )
        },
        {
            id: 'description',
            header: 'Description',
            accessor: (row: Transaction) => row.description,
            sortable: true,
            cell: (value: string, row: Transaction) => (
                <div className="flex items-start">
                    <FileText size={14} className="text-gray-400 mr-1.5 mt-0.5" strokeWidth={1.8} />
                    <div className="flex flex-col">
                        <p className="text-gray-800">{value}</p>
                        {row.external_id && (
                            <p className="text-xs text-gray-500">Ref: {row.external_id}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 'date',
            header: 'Date & Time',
            accessor: (row: Transaction) => row.createdAt,
            sortable: true,
            width: '150px',
            cell: (value: string) => {
                const { date, time } = formatDateTime(value);

                return (
                    <div className="flex flex-col">
                        <div className="text-gray-800">{date}</div>
                        <div className="text-gray-500 text-sm">{time}</div>
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (row: Transaction) => row.id,
            sortable: false,
            width: '100px',
            cell: (value: string, row: Transaction) => (
                <div className="flex items-center space-x-1">
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="View transaction receipt"
                        onClick={() => handleViewTransaction(row)}
                    >
                        <Eye size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Edit transaction"
                    >
                        <Edit size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Delete transaction"
                    >
                        <Trash2 size={16} strokeWidth={1.8} />
                    </motion.button>
                </div>
            )
        }
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on new search

        if (query.trim() !== '' && !recentSearches.includes(query)) {
            setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };

    const handleExport = () => {
        if (transactions.length === 0) {
            alert('No transactions to export');
            return;
        }
        alert('Export functionality would go here');
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
                    <p className="text-gray-500 mt-1">Track and manage your financial transactions</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <motion.button
                        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0 }}
                    >
                        <Upload size={16} className="mr-2" strokeWidth={1.8} />
                        Import
                    </motion.button>
                    <motion.button
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
                        whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                        whileTap={{ y: 0 }}
                        onClick={handleExport}
                    >
                        <Download size={16} className="mr-2" strokeWidth={1.8} />
                        Export
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="md:col-span-2">
                    <SearchBox
                        placeholder="Search by ID, description, reference..."
                        onSearch={handleSearch}
                        suggestions={[
                            'Deposit',
                            'Withdrawal',
                            'Mpesa',
                            'Transfer'
                        ]}
                        recentSearches={recentSearches}
                        showRecentByDefault={true}
                    />
                </div>
            </motion.div>

            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                {error ? (
                    <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                        <p>{error}</p>
                        <button
                            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
                            onClick={() => fetchTransactions(currentPage, itemsPerPage, searchQuery)}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={transactions}
                        selectable={true}
                        isLoading={isLoading}
                        emptyMessage="No transactions found. Try adjusting your filters or search terms."
                        defaultRowsPerPage={itemsPerPage}
                    />
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <Pagination
                    totalItems={paginationData.total}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                    showSummary={true}
                    totalPages={paginationData.pages}
                />
            </motion.div>

            {showReceiptModal && (
                <TransactionReceiptModal
                    transaction={selectedTransaction}
                    onClose={closeReceiptModal}
                />
            )}
        </div>
    );
};

export default TransactionsPage;