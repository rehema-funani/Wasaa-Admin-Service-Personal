import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    FileText
} from 'lucide-react';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import financeService from '../../../../api/services/finance';

interface Transaction {
    id: string;
    userWalletId: string;
    debit: number;
    credit: number;
    balance: number;
    status: string;
    description: string;
    external_id: string;
    createdAt: string;
    updatedAt: string;
    UserWallet: {
        id: string;
        user_uuid: string;
        currencyId: string;
        debit: string;
        credit: string;
        balance: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
}

const TransactionsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'deposit', 'withdrawal', 'mpesa'
    ]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                const response = await financeService.getAllTransactions();

                if (response?.data?.transactions) {
                    setTransactions(response.data.transactions);
                    setFilteredTransactions(response.data.transactions);
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

        fetchTransactions();
    }, []);

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
                        <DollarSign size={14} strokeWidth={1.8} className="mr-0.5" />
                        <span>{sign}{value.toFixed(2)}</span>
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
                    ${value.toFixed(2)}
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
            cell: (value: string) => (
                <div className="flex items-center space-x-1">
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="View transaction"
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

        if (query.trim() === '') {
            setFilteredTransactions(transactions);
            return;
        }

        const lowercasedQuery = query.toLowerCase();

        const filtered = transactions.filter(transaction => {
            return (
                transaction.id.toLowerCase().includes(lowercasedQuery) ||
                transaction.description.toLowerCase().includes(lowercasedQuery) ||
                (transaction.external_id && transaction.external_id.toLowerCase().includes(lowercasedQuery)) ||
                getTransactionType(transaction).toLowerCase().includes(lowercasedQuery)
            );
        });

        setFilteredTransactions(filtered);

        if (query.trim() !== '' && !recentSearches.includes(query)) {
            setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
        }

        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };

    const handleExport = () => {
        if (filteredTransactions.length === 0) {
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
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredTransactions}
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
                    totalItems={filteredTransactions.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                    showSummary={true}
                />
            </motion.div>
        </div>
    );
};

export default TransactionsPage;