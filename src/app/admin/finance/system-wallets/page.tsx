import React, { useState, useEffect } from 'react';
import {
    Wallet,
    RefreshCw,
    ArrowUpRight,
    ArrowDownLeft,
    MoreHorizontal,
    Search,
    Filter,
    ShieldCheck,
    AlertTriangle,
    BarChart3,
    Clock,
    Eye,
    Download,
    Settings,
    CheckCircle2,
    Sparkles,
    LineChart,
    BadgeDollarSign,
    BanknoteIcon,
    ArrowDownUp,
    LayoutDashboard,
    Shield
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
// import walletService from '../../../../api/services/wallet';

interface SystemWallet {
    id: string;
    name: string;
    type: 'float' | 'fee' | 'refund' | 'promotions';
    balance: number;
    currency: string;
    accountNumber: string;
    status: 'active' | 'inactive' | 'pending';
    lastUpdated: string;
    transactionCount: number;
    monthlyVolume: number;
    description: string;
}

interface Transaction {
    id: string;
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    reference: string;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: string;
    relatedEntity?: string;
}

const SystemWalletsPage: React.FC = () => {
    const [systemWallets, setSystemWallets] = useState<SystemWallet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<SystemWallet | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'topup' | 'transfer' | 'history' | 'settings' | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

    const mockSystemWallets: SystemWallet[] = [
        {
            id: 'wallet-float-001',
            name: 'Platform Float Wallet',
            type: 'float',
            balance: 5783290.75,
            currency: 'KES',
            accountNumber: 'WF-0054321678',
            status: 'active',
            lastUpdated: '2025-05-18T10:45:00Z',
            transactionCount: 892,
            monthlyVolume: 9876543.25,
            description: 'Holds reserve funding for liquidity and payouts'
        },
        {
            id: 'wallet-fee-001',
            name: 'Fee Wallet',
            type: 'fee',
            balance: 2547890.50,
            currency: 'KES',
            accountNumber: 'WC-0012345678',
            status: 'active',
            lastUpdated: '2025-05-18T14:30:00Z',
            transactionCount: 1243,
            monthlyVolume: 4567890.75,
            description: 'Collects platform commissions from each transaction'
        },
        {
            id: 'wallet-refund-001',
            name: 'Refund Wallet',
            type: 'refund',
            balance: 890450.25,
            currency: 'KES',
            accountNumber: 'WR-0087654321',
            status: 'active',
            lastUpdated: '2025-05-18T12:15:00Z',
            transactionCount: 567,
            monthlyVolume: 1234567.50,
            description: 'Issues refunds or reversals in case of errors/disputes'
        },
        {
            id: 'wallet-promotions-001',
            name: 'Promotions Wallet',
            type: 'promotions',
            balance: 456780.30,
            currency: 'KES',
            accountNumber: 'WP-0098765432',
            status: 'active',
            lastUpdated: '2025-05-17T18:20:00Z',
            transactionCount: 123,
            monthlyVolume: 789012.40,
            description: 'Funds user bonuses, cashbacks, or campaign payouts'
        }
    ];

    // Mock transaction data
    const mockTransactions: Transaction[] = [
        {
            id: 'tx-001',
            walletId: 'wallet-fee-001',
            type: 'credit',
            amount: 1250.00,
            reference: 'TRX-23456789',
            description: 'Commission from transaction ID: 45678',
            status: 'completed',
            timestamp: '2025-05-18T14:30:00Z',
            relatedEntity: 'John Doe (User)'
        },
        {
            id: 'tx-002',
            walletId: 'wallet-fee-001',
            type: 'debit',
            amount: 500.00,
            reference: 'TRX-23456790',
            description: 'Monthly settlement to operating account',
            status: 'completed',
            timestamp: '2025-05-17T10:15:00Z',
            relatedEntity: 'System Account'
        },
        {
            id: 'tx-003',
            walletId: 'wallet-refund-001',
            type: 'debit',
            amount: 750.00,
            reference: 'TRX-23456791',
            description: 'Refund for transaction ID: 78901',
            status: 'pending',
            timestamp: '2025-05-18T09:45:00Z',
            relatedEntity: 'Alice Smith (User)'
        },
        {
            id: 'tx-004',
            walletId: 'wallet-refund-001',
            type: 'credit',
            amount: 2000.00,
            reference: 'TRX-23456792',
            description: 'Top up from main account',
            status: 'completed',
            timestamp: '2025-05-16T16:20:00Z',
            relatedEntity: 'System Account'
        },
        {
            id: 'tx-005',
            walletId: 'wallet-float-001',
            type: 'debit',
            amount: 15000.00,
            reference: 'TRX-23456793',
            description: 'Payout to merchant ID: MER-12345',
            status: 'completed',
            timestamp: '2025-05-18T08:30:00Z',
            relatedEntity: 'Acme Store (Merchant)'
        },
        {
            id: 'tx-006',
            walletId: 'wallet-promotions-001',
            type: 'debit',
            amount: 3000.00,
            reference: 'TRX-23456794',
            description: 'Cashback promotion for user ID: USR-78901',
            status: 'completed',
            timestamp: '2025-05-17T13:10:00Z',
            relatedEntity: 'Bob Johnson (User)'
        }
    ];

    useEffect(() => {
        // Simulating API call
        const fetchSystemWallets = async () => {
            setIsLoading(true);
            try {
                // In a real implementation, this would be:
                // const wallets = await walletService.getSystemWallets();

                // For now, using mock data with a timeout for loading simulation
                setTimeout(() => {
                    setSystemWallets(mockSystemWallets);
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch system wallets', error);
                showSuccess('Failed to load system wallets');
                setIsLoading(false);
            }
        };

        fetchSystemWallets();
    }, []);

    const filteredWallets = systemWallets.filter(wallet => {
        const matchesSearch = wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wallet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wallet.accountNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || wallet.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Get transactions for a specific wallet
    const fetchWalletTransactions = (walletId: string) => {
        // In a real implementation, this would be:
        // const transactions = await walletService.getWalletTransactions(walletId);

        // For now, filtering mock data
        return mockTransactions.filter(tx => tx.walletId === walletId);
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const openTopUpModal = (wallet: SystemWallet) => {
        setSelectedWallet(wallet);
        setModalType('topup');
        setIsModalOpen(true);
    };

    const openTransferModal = (wallet: SystemWallet) => {
        setSelectedWallet(wallet);
        setModalType('transfer');
        setIsModalOpen(true);
    };

    const openHistoryModal = (wallet: SystemWallet) => {
        setSelectedWallet(wallet);
        setTransactions(fetchWalletTransactions(wallet.id));
        setModalType('history');
        setIsModalOpen(true);
    };

    const openSettingsModal = (wallet: SystemWallet) => {
        setSelectedWallet(wallet);
        setModalType('settings');
        setIsModalOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-success-50 text-success-700 border border-success-200';
            case 'inactive':
                return 'bg-danger-50 text-danger-700 border border-danger-200';
            case 'pending':
                return 'bg-warning-50 text-warning-700 border border-warning-200';
            case 'completed':
                return 'bg-success-50 text-success-700 border border-success-200';
            case 'failed':
                return 'bg-danger-50 text-danger-700 border border-danger-200';
            default:
                return 'bg-neutral-50 text-neutral-700 border border-neutral-200';
        }
    };

    const getTransactionIcon = (type: 'credit' | 'debit') => {
        if (type === 'credit') {
            return <ArrowDownLeft className="w-4 h-4 text-success-600" />;
        } else {
            return <ArrowUpRight className="w-4 h-4 text-primary-600" />;
        }
    };

    const getWalletIcon = (type: string) => {
        switch (type) {
            case 'fee':
                return <BadgeDollarSign className="w-5 h-5 text-secondary-600" />;
            case 'refund':
                return <RefreshCw className="w-5 h-5 text-warning-600" />;
            case 'float':
                return <BanknoteIcon className="w-5 h-5 text-primary-600" />;
            case 'promotions':
                return <Sparkles className="w-5 h-5 text-success-600" />;
            default:
                return <Wallet className="w-5 h-5 text-neutral-600" />;
        }
    };

    const getWalletAccentColor = (type: string) => {
        switch (type) {
            case 'fee':
                return 'border-l-secondary-500';
            case 'refund':
                return 'border-l-warning-500';
            case 'float':
                return 'border-l-primary-500';
            case 'promotions':
                return 'border-l-success-500';
            default:
                return 'border-l-neutral-500';
        }
    };

    // Get modal title
    const getModalTitle = () => {
        if (!selectedWallet) return '';

        switch (modalType) {
            case 'topup':
                return `Top Up ${selectedWallet.name}`;
            case 'transfer':
                return `Transfer from ${selectedWallet.name}`;
            case 'history':
                return `Transaction History - ${selectedWallet.name}`;
            case 'settings':
                return `${selectedWallet.name} Settings`;
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-finance-navy/5 via-white to-primary-50/30 p-4 md:p-6 font-finance">
            <div className="w-full mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-neutral-800 tracking-tight flex items-center">
                                <BanknoteIcon size={24} className="mr-2 text-primary-600" />
                                System Wallets
                            </h1>
                            <p className="text-neutral-500 text-sm mt-1">Manage system wallets for commissions, reversals, settlements, and transaction processing</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg shadow-sm hover:bg-neutral-50 transition-all text-sm"
                                disabled={isLoading}
                            >
                                <RefreshCw size={16} />
                                <span>Sync Balances</span>
                            </button>

                            <button
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-lg shadow-button hover:bg-primary-700 transition-all text-sm"
                            >
                                <LayoutDashboard size={16} />
                                <span>Banking Dashboard</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-neutral-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search system wallets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 w-full bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700 text-sm shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-0.5 shadow-sm">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-1.5 rounded-md text-xs transition-all ${statusFilter === 'all' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-500'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStatusFilter('active')}
                                    className={`px-3 py-1.5 rounded-md text-xs transition-all ${statusFilter === 'active' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-500'
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setStatusFilter('inactive')}
                                    className={`px-3 py-1.5 rounded-md text-xs transition-all ${statusFilter === 'inactive' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-500'
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>

                            <button className="p-2 bg-white border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50 shadow-sm">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-5 flex items-center gap-2 p-3 bg-success-50 rounded-lg border border-success-200 text-success-700">
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                {/* System Wallets Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {isLoading ? (
                        // Loading skeleton
                        Array(4).fill(0).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-card border border-neutral-200 border-l-[5px] border-l-primary-300 animate-pulse">
                                <div className="p-4">
                                    <div className="h-6 bg-neutral-200 rounded w-1/3 mb-3"></div>
                                    <div className="h-8 bg-neutral-200 rounded w-2/3 mb-4"></div>
                                    <div className="flex justify-between">
                                        <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
                                        <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredWallets.length === 0 ? (
                        <div className="col-span-2 bg-white rounded-lg shadow-card border border-neutral-200 p-8 text-center">
                            <div className="flex justify-center mb-3">
                                <Wallet size={48} className="text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-700 mb-1">No wallets found</h3>
                            <p className="text-neutral-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        // Wallet Cards
                        filteredWallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className={`bg-white rounded-lg shadow-card border border-neutral-200 border-l-[5px] ${getWalletAccentColor(wallet.type)} hover:shadow-md transition-shadow`}
                            >
                                <div className="p-5">
                                    <div className="flex justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-neutral-100 rounded-lg">
                                                {getWalletIcon(wallet.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium text-neutral-900">{wallet.name}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-md ${getStatusColor(wallet.status)} font-medium`}>
                                                        {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-500 font-mono">{wallet.accountNumber}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <button className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
                                                <MoreHorizontal size={16} className="text-neutral-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-neutral-500 mb-1">Current Balance</p>
                                        <h2 className="text-2xl font-semibold text-neutral-900 font-finance">{formatCurrency(wallet.balance)}</h2>
                                    </div>

                                    <div className="flex items-start justify-between mt-4 pt-4 border-t border-neutral-100">
                                        <div>
                                            <p className="text-xs text-neutral-500 mb-1">Last Updated</p>
                                            <p className="text-sm">{formatDate(wallet.lastUpdated)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-500 mb-1">Monthly Volume</p>
                                            <p className="text-sm font-medium">{formatCurrency(wallet.monthlyVolume)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-neutral-100 flex gap-2">
                                        <button
                                            onClick={() => openTopUpModal(wallet)}
                                            className="flex-1 text-xs py-2 px-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium transition-colors"
                                        >
                                            Top Up
                                        </button>
                                        <button
                                            onClick={() => openTransferModal(wallet)}
                                            className="flex-1 text-xs py-2 px-3 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-medium transition-colors"
                                        >
                                            Transfer
                                        </button>
                                        <button
                                            onClick={() => openHistoryModal(wallet)}
                                            className="flex-1 text-xs py-2 px-3 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-medium transition-colors"
                                        >
                                            History
                                        </button>
                                        <button
                                            onClick={() => openSettingsModal(wallet)}
                                            className="text-xs p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                                        >
                                            <Settings size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
                        <h2 className="text-lg font-medium text-neutral-800 flex items-center">
                            <BarChart3 size={20} className="mr-2 text-primary-600" />
                            System Wallets Summary
                        </h2>

                        <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 mt-3 md:mt-0">
                            <button
                                onClick={() => setSelectedTimeframe('24h')}
                                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '24h' ? 'bg-white shadow-sm text-neutral-800 font-medium' : 'text-neutral-500'
                                    }`}
                            >
                                24h
                            </button>
                            <button
                                onClick={() => setSelectedTimeframe('7d')}
                                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '7d' ? 'bg-white shadow-sm text-neutral-800 font-medium' : 'text-neutral-500'
                                    }`}
                            >
                                7d
                            </button>
                            <button
                                onClick={() => setSelectedTimeframe('30d')}
                                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '30d' ? 'bg-white shadow-sm text-neutral-800 font-medium' : 'text-neutral-500'
                                    }`}
                            >
                                30d
                            </button>
                            <button
                                onClick={() => setSelectedTimeframe('90d')}
                                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '90d' ? 'bg-white shadow-sm text-neutral-800 font-medium' : 'text-neutral-500'
                                    }`}
                            >
                                90d
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-primary-50/50 rounded-lg p-4 border border-primary-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <Wallet size={20} className="text-primary-600" />
                                </div>
                                <h3 className="text-sm font-medium text-neutral-800">Total Balance</h3>
                            </div>
                            <p className="text-2xl font-semibold text-neutral-900 font-finance">
                                {formatCurrency(systemWallets.reduce((total, wallet) => total + wallet.balance, 0))}
                            </p>
                            <p className="text-xs text-success-600 mt-1 flex items-center">
                                <ArrowUpRight size={12} className="mr-1" />
                                <span>+5.3% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-success-50/50 rounded-lg p-4 border border-success-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-success-100 rounded-lg">
                                    <LineChart size={20} className="text-success-600" />
                                </div>
                                <h3 className="text-sm font-medium text-neutral-800">Transaction Volume</h3>
                            </div>
                            <p className="text-2xl font-semibold text-neutral-900 font-finance">
                                {formatCurrency(systemWallets.reduce((total, wallet) => total + wallet.monthlyVolume, 0))}
                            </p>
                            <p className="text-xs text-success-600 mt-1 flex items-center">
                                <ArrowUpRight size={12} className="mr-1" />
                                <span>+12.8% from previous period</span>
                            </p>
                        </div>

                        <div className="bg-warning-50/50 rounded-lg p-4 border border-warning-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-warning-100 rounded-lg">
                                    <Clock size={20} className="text-warning-600" />
                                </div>
                                <h3 className="text-sm font-medium text-neutral-800">Processing Time</h3>
                            </div>
                            <p className="text-2xl font-semibold text-neutral-900 font-finance">1.2s</p>
                            <p className="text-xs text-success-600 mt-1 flex items-center">
                                <ArrowUpRight size={12} className="mr-1" />
                                <span>-0.3s from previous period</span>
                            </p>
                        </div>

                        <div className="bg-secondary-50/50 rounded-lg p-4 border border-secondary-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-secondary-100 rounded-lg">
                                    <ShieldCheck size={20} className="text-secondary-600" />
                                </div>
                                <h3 className="text-sm font-medium text-neutral-800">System Health</h3>
                            </div>
                            <p className="text-2xl font-semibold text-neutral-900 font-finance">99.98%</p>
                            <p className="text-xs text-success-600 mt-1 flex items-center">
                                <ArrowUpRight size={12} className="mr-1" />
                                <span>+0.06% from previous period</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6 mb-8">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-medium text-neutral-800 flex items-center">
                            <ArrowDownUp size={20} className="mr-2 text-primary-600" />
                            Recent Transactions
                        </h2>
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Wallet</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                                    <th className="px-3 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {mockTransactions.slice(0, 5).map((transaction) => {
                                    const wallet = systemWallets.find(w => w.id === transaction.walletId);
                                    return (
                                        <tr key={transaction.id} className="hover:bg-primary-50/30">
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center mr-3">
                                                        {getTransactionIcon(transaction.type)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-neutral-900 mb-0.5">
                                                            {transaction.type === 'credit' ? 'Incoming' : 'Outgoing'}
                                                        </div>
                                                        <div className="text-xs text-neutral-500 font-mono">{transaction.reference}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm text-neutral-900">{wallet?.name || 'Unknown Wallet'}</div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-success-600' : 'text-primary-600'
                                                    }`}>
                                                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                {formatDate(transaction.timestamp)}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary-600 hover:text-primary-700 p-1 hover:bg-primary-50 rounded-lg transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-primary-50/70 rounded-lg p-4 border border-primary-100 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                            <Shield size={20} className="text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-primary-700">About System Wallets</h3>
                            <p className="text-primary-600 text-xs mt-1 leading-relaxed">
                                System wallets are dedicated internal accounts that serve specific financial functions:
                                <br />• <strong>Platform Float Wallet:</strong> Maintains liquidity reserves for user and merchant payouts
                                <br />• <strong>Fee Wallet:</strong> Collects and manages platform commissions from all transactions
                                <br />• <strong>Refund Wallet:</strong> Handles customer refunds and transaction reversals
                                <br />• <strong>Promotions Wallet:</strong> Funds marketing initiatives, cashbacks, and user rewards
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalType(null);
                    setSelectedWallet(null);
                }}
                title={getModalTitle()}
                size={modalType === 'history' ? 'lg' : 'md'}
            >
                {modalType === 'topup' && selectedWallet && (
                    <div className="space-y-4 p-1">
                        <div className="bg-primary-50 p-4 rounded-lg mb-4 border border-primary-100">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-neutral-700">Current Balance</h3>
                                <span className="text-lg font-semibold text-neutral-900 font-finance">{formatCurrency(selectedWallet.balance)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Amount to Top Up</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-neutral-500 sm:text-sm">KES</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-12 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Source Account</label>
                                <select className="w-full pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700">
                                    <option value="main">Main Operating Account</option>
                                    <option value="reserve">Reserve Account</option>
                                    <option value="capital">Capital Account</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Reference Note</label>
                                <input
                                    type="text"
                                    placeholder="E.g., Monthly top-up"
                                    className="pl-3 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                />
                            </div>
                        </div>

                        <div className="bg-warning-50 border-l-4 border-warning-400 p-3 rounded-md mt-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-warning-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-warning-700">
                                        Top-ups to system wallets require approval from a financial administrator and are subject to audit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 shadow-button"
                            >
                                Submit Top-up Request
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'transfer' && selectedWallet && (
                    <div className="space-y-4 p-1">
                        <div className="bg-primary-50 p-4 rounded-lg mb-4 border border-primary-100">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-neutral-700">Available Balance</h3>
                                <span className="text-lg font-semibold text-neutral-900 font-finance">{formatCurrency(selectedWallet.balance)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Transfer Amount</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-neutral-500 sm:text-sm">KES</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-12 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Destination Wallet</label>
                                <select className="w-full pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700">
                                    {systemWallets.filter(w => w.id !== selectedWallet.id).map(wallet => (
                                        <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                                    ))}
                                    <option value="main">Main Operating Account</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Transfer Reason</label>
                                <select className="w-full pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700 mb-2">
                                    <option value="settlement">Settlement</option>
                                    <option value="rebalancing">Wallet Rebalancing</option>
                                    <option value="correction">Error Correction</option>
                                    <option value="other">Other (Specify)</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Additional notes"
                                    className="pl-3 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                />
                            </div>
                        </div>

                        <div className="bg-warning-50 border-l-4 border-warning-400 p-3 rounded-md mt-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-warning-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-warning-700">
                                        Transfers between system wallets are recorded in the audit log and may require approval based on the amount.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 shadow-button"
                            >
                                Initiate Transfer
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'history' && selectedWallet && (
                    <div className="p-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-neutral-100 rounded-lg mr-3">
                                    {getWalletIcon(selectedWallet.type)}
                                </div>
                                <div>
                                    <h3 className="font-medium text-neutral-900">{selectedWallet.name}</h3>
                                    <p className="text-xs text-neutral-500 font-mono">{selectedWallet.accountNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <select className="text-xs bg-white border border-neutral-300 rounded-lg py-1.5 px-3">
                                    <option value="all">All Transactions</option>
                                    <option value="credit">Credits Only</option>
                                    <option value="debit">Debits Only</option>
                                </select>
                                <button className="p-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">
                                    <Download size={16} className="text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto max-h-96 border border-neutral-200 rounded-lg">
                            <table className="min-w-full divide-y divide-neutral-200">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Reference</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-neutral-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-primary-50/30">
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center mr-3">
                                                        {getTransactionIcon(transaction.type)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-neutral-900">
                                                            {transaction.type === 'credit' ? 'Received' : 'Sent'}
                                                        </div>
                                                        <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1" title={transaction.description}>
                                                            {transaction.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <div className="text-sm text-neutral-900 font-mono">{transaction.reference}</div>
                                                <div className="text-xs text-neutral-500">{transaction.relatedEntity}</div>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-success-600' : 'text-primary-600'
                                                    }`}>
                                                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-sm text-neutral-500">
                                                {formatDate(transaction.timestamp)}
                                            </td>
                                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary-600 hover:text-primary-700 p-1 hover:bg-primary-50 rounded-lg transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {transactions.length === 0 && (
                            <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
                                <Clock size={36} className="mx-auto text-neutral-400 mb-3" />
                                <h3 className="text-lg font-medium text-neutral-700 mb-1">No transactions found</h3>
                                <p className="text-neutral-500 text-sm">This wallet has no transaction history yet.</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 shadow-button"
                            >
                                Export to CSV
                            </button>
                        </div>
                    </div>
                )}

                {modalType === 'settings' && selectedWallet && (
                    <div className="space-y-5 p-1">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Wallet Name</label>
                                <input
                                    type="text"
                                    defaultValue={selectedWallet.name}
                                    className="pl-3 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Wallet Status</label>
                                <select
                                    className="w-full pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                    defaultValue={selectedWallet.status}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                                <textarea
                                    defaultValue={selectedWallet.description}
                                    rows={3}
                                    className="pl-3 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Low Balance Alert</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-neutral-500 sm:text-sm">KES</span>
                                        </div>
                                        <input
                                            type="number"
                                            defaultValue={100000}
                                            className="pl-12 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">High Balance Alert</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-neutral-500 sm:text-sm">KES</span>
                                        </div>
                                        <input
                                            type="number"
                                            defaultValue={10000000}
                                            className="pl-12 pr-3 py-2 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                            <h3 className="font-medium text-neutral-800 mb-3">Notification Settings</h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-neutral-700">Daily Balance Report</label>
                                    <div className="relative inline-block w-10 align-middle select-none">
                                        <input type="checkbox" name="toggle" id="toggle-daily" defaultChecked className="sr-only toggle-checkbox" />
                                        <label htmlFor="toggle-daily" className="block h-6 rounded-full bg-neutral-300 cursor-pointer toggle-label"></label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-neutral-700">Large Transaction Alerts</label>
                                    <div className="relative inline-block w-10 align-middle select-none">
                                        <input type="checkbox" name="toggle" id="toggle-large" defaultChecked className="sr-only toggle-checkbox" />
                                        <label htmlFor="toggle-large" className="block h-6 rounded-full bg-neutral-300 cursor-pointer toggle-label"></label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-neutral-700">Weekly Summary</label>
                                    <div className="relative inline-block w-10 align-middle select-none">
                                        <input type="checkbox" name="toggle" id="toggle-weekly" className="sr-only toggle-checkbox" />
                                        <label htmlFor="toggle-weekly" className="block h-6 rounded-full bg-neutral-300 cursor-pointer toggle-label"></label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-neutral-700">Error Notifications</label>
                                    <div className="relative inline-block w-10 align-middle select-none">
                                        <input type="checkbox" name="toggle" id="toggle-error" defaultChecked className="sr-only toggle-checkbox" />
                                        <label htmlFor="toggle-error" className="block h-6 rounded-full bg-neutral-300 cursor-pointer toggle-label"></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-danger-50 border-l-4 border-danger-500 p-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-danger-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-danger-800">Danger Zone</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-sm text-danger-700">
                                            System wallets can be deactivated but not deleted.
                                        </p>
                                        <button className="px-3 py-1 text-xs font-medium text-white bg-danger-600 rounded-lg hover:bg-danger-700">
                                            Deactivate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 shadow-button"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <style>{`
        .toggle-checkbox:checked + .toggle-label {
          background-color: #0D99F2;
        }
        .toggle-label {
          transition: background-color 0.3s ease;
        }
        .toggle-label::after {
          content: "";
          position: absolute;
          top: 0.125rem;
          left: 0.125rem;
          width: 1.25rem;
          height: 1.25rem;
          background-color: white;
          border-radius: 9999px;
          transition: transform 0.3s ease;
        }
        .toggle-checkbox:checked + .toggle-label::after {
          transform: translateX(1rem);
        }
      `}</style>
        </div>
    );
};

export default SystemWalletsPage;