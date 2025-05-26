import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CreditCard,
    DollarSign,
    Calendar,
    Clock,
    Send,
    Download,
    Activity,
    Plus,
    ChevronRight,
    MoreHorizontal,
    RefreshCw,
    User,
    Users,
    AlertCircle,
    CheckCircle,
    Shield,
    ExternalLink,
    Copy,
    Eye,
    EyeOff,
    Bell
} from 'lucide-react';

// TypeScript interfaces, but with relaxed typing
interface Currency {
    id: string;
    name: string;
    symbol: string;
    createdAt?: string;
    updatedAt?: string;
}

interface UserPreferences {
    id?: string;
    user_id?: string;
    default_language?: string;
    default_currency?: string;
    default_timezone?: string;
    more_info?: any;
    notification_preferences?: any;
    privacy_preferences?: any;
    security_preferences?: any;
    theme_preferences?: any;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

interface User {
    id?: string;
    username?: string | null;
    phone_number?: string | null;
    email?: string | null;
    profile_picture?: string | null;
    preferences?: UserPreferences;
}

interface Group {
    id?: string;
    title?: string;
    description?: string;
    icon?: string | null;
    status?: string;
    created_by?: string | null;
    creator?: any | null;
}

interface Wallet {
    id: string;
    user_uuid: string | null;
    group_uuid: string | null;
    type: string;
    currencyId: string;
    debit: string;
    credit: string;
    balance: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    Currency: Currency;
    user: User | null;
    group: Group | null;
}

interface Transaction {
    id: string;
    type: 'incoming' | 'outgoing';
    amount: string;
    from?: string;
    to?: string;
    description: string;
    timestamp: string;
}

// This would be your actual wallet service
const walletService = {
    getWalletById: async (id: string): Promise<Wallet> => {
        // In a real app, this would be an API call
        // For this example, I'll simulate a fetch with the sample data
        return new Promise((resolve) => {
            setTimeout(() => {
                // This simulates finding the wallet with the given ID
                const wallet = {
                    "id": "f3bdd2c2-5404-4f6e-9dd4-8f6eb318ee71",
                    "user_uuid": null,
                    "group_uuid": "a9fb57c0-24bf-45dc-ba2c-cc651fcf88a7",
                    "type": "group",
                    "currencyId": "b46a3d9d-e465-42d8-928b-862c85fa67a3",
                    "debit": "0.00",
                    "credit": "0.00",
                    "balance": "0.00",
                    "status": "Active",
                    "createdAt": "2025-05-02T08:14:40.341Z",
                    "updatedAt": "2025-05-02T08:14:40.341Z",
                    "Currency": {
                        "id": "b46a3d9d-e465-42d8-928b-862c85fa67a3",
                        "name": "Kenya Shillings",
                        "symbol": "KES",
                        "createdAt": "2025-04-28T14:33:38.550Z",
                        "updatedAt": "2025-04-28T14:33:38.550Z"
                    },
                    "user": null,
                    "group": {
                        "id": "a9fb57c0-24bf-45dc-ba2c-cc651fcf88a7",
                        "title": "Alvin Group",
                        "description": "Alvin Group",
                        "icon": null,
                        "status": "active",
                        "created_by": null,
                        "creator": null
                    }
                };
                resolve(wallet as Wallet);
            }, 800);
        });
    },

    // Mock function for recent transactions
    getRecentTransactions: async (walletId: string): Promise<Transaction[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: "t1",
                        type: "incoming",
                        amount: "1,500.00",
                        from: "Jane Smith",
                        description: "Monthly contribution",
                        timestamp: "2025-05-01T14:30:22.341Z"
                    },
                    {
                        id: "t2",
                        type: "outgoing",
                        amount: "800.00",
                        to: "John Doe",
                        description: "Group expense",
                        timestamp: "2025-04-28T09:15:40.341Z"
                    },
                    {
                        id: "t3",
                        type: "incoming",
                        amount: "2,000.00",
                        from: "Mark Johnson",
                        description: "Project fund",
                        timestamp: "2025-04-25T16:45:10.341Z"
                    }
                ] as Transaction[]);
            }, 1000);
        });
    }
};

// Helper functions
const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    } catch (error) {
        return dateString;
    }
};

const timeAgo = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
};

const formatCurrency = (amount: string, symbol: string): string => {
    // Format the currency with the symbol
    return `${symbol} ${parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

// Custom components
interface SectionHeaderProps {
    title: string;
    children?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, children = null }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {children}
    </div>
);

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: "primary" | "green" | "red" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color = "primary" }) => {
    const colorClasses = {
        primary: "from-primary-50 to-primary-50 text-primary-600",
        green: "from-green-50 to-emerald-50 text-green-600",
        red: "from-red-50 to-rose-50 text-red-600",
        purple: "from-purple-50 to-violet-50 text-purple-600"
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
                <div className={`mr-3 p-3 rounded-xl bg-gradient-to-tr ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    );
};

interface InfoItemProps {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
        <div className="text-gray-400 mr-3">{icon}</div>
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-medium text-gray-800">{value}</p>
        </div>
    </div>
);

const walletdetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hideBalance, setHideBalance] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const tabs = ["Overview", "Transactions", "Settings"];

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                setLoading(true);
                if (!id) {
                    throw new Error("Wallet ID is missing");
                }

                const walletData = await walletService.getWalletById(id);
                setWallet(walletData);

                // Also fetch transactions
                const transactionsData = await walletService.getRecentTransactions(id);
                setTransactions(transactionsData);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch wallet details:", error);
                setError("Failed to load wallet details. Please try again.");
                setLoading(false);
            }
        };

        if (id) {
            fetchWalletData();
        }
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="w-64 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-pulse">
                                <div className="w-1/3 h-6 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="w-full h-24 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
                                <div className="w-1/2 h-6 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="space-y-4">
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-md p-8 max-w-md backdrop-blur-sm bg-opacity-95">
                    <div className="text-red-500 text-center mb-6">
                        <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold">Error</h2>
                    </div>
                    <p className="text-gray-600 mb-8 text-center">{error}</p>
                    <div className="flex justify-center">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300"
                            onClick={() => navigate(-1)}
                        >
                            Back to Wallets
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!wallet) return null;

    const ownerType = wallet.type;
    const ownerName = ownerType === 'user'
        ? (wallet.user?.username || wallet.user?.phone_number || 'User')
        : (wallet.group?.title || 'Group');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                        >
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Wallet Details</h1>
                            <p className="text-gray-500 mt-1">
                                {ownerType === 'user' ? 'Personal' : 'Group'} wallet for {ownerName}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                                {wallet.type === 'user' ? <User size={14} className="mr-1" /> : <Users size={14} className="mr-1" />}
                                {wallet.type === 'user' ? 'Personal Wallet' : 'Group Wallet'}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${wallet.status === 'Active' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'}`}>
                                {wallet.status === 'Active' ? <CheckCircle size={14} className="mr-1" /> : <AlertCircle size={14} className="mr-1" />}
                                {wallet.status}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Created {formatDate(wallet.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-100 bg-white bg-opacity-90 backdrop-blur-sm sticky top-24 z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                className={`py-5 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${tabIndex === index
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => setTabIndex(index)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {tabIndex === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-50 to-transparent opacity-50 rounded-bl-full"></div>

                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Wallet Balance</h2>
                                    <button
                                        onClick={() => setHideBalance(!hideBalance)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                                    >
                                        {hideBalance ? <Eye size={18} className="text-gray-500" /> : <EyeOff size={18} className="text-gray-500" />}
                                    </button>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col mb-6">
                                        <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                                        <h1 className="text-4xl font-bold text-gray-900">
                                            {hideBalance
                                                ? '••••••••'
                                                : formatCurrency(wallet.balance, wallet.Currency.symbol)}
                                        </h1>
                                        <div className="mt-2 flex items-center">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                Updated {timeAgo(wallet.updatedAt)}
                                            </span>
                                            <button className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-300">
                                                <RefreshCw size={12} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-tr from-primary-50 to-primary-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-600 mb-1">Total Credit</p>
                                            <p className="text-xl font-bold text-gray-800">
                                                {hideBalance
                                                    ? '••••••••'
                                                    : formatCurrency(wallet.credit, wallet.Currency.symbol)}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-tr from-primary-50 to-primary-50 rounded-xl p-4">
                                            <p className="text-sm text-gray-600 mb-1">Total Debit</p>
                                            <p className="text-xl font-bold text-gray-800">
                                                {hideBalance
                                                    ? '••••••••'
                                                    : formatCurrency(wallet.debit, wallet.Currency.symbol)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Recent Transactions">
                                    <button
                                        className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                                        onClick={() => setTabIndex(1)}
                                    >
                                        View all <ChevronRight size={16} />
                                    </button>
                                </SectionHeader>

                                {transactions.length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions.map((transaction) => (
                                            <div key={transaction.id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:border-primary-100 transition-colors duration-300">
                                                <div className={`h-10 w-10 rounded-full ${transaction.type === 'incoming' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mr-4`}>
                                                    {transaction.type === 'incoming' ? <Download size={18} /> : <Send size={18} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {transaction.type === 'incoming' ? `From ${transaction.from}` : `To ${transaction.to}`}
                                                            </p>
                                                            <p className="text-sm text-gray-500">{transaction.description}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`font-bold ${transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {transaction.type === 'incoming' ? '+' : '-'} {wallet.Currency.symbol} {transaction.amount}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-8 bg-gray-50 rounded-xl">
                                        <Activity size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-600 mb-2">No transaction history yet</p>
                                        <p className="text-sm text-gray-500">Transactions will appear here once you start using your wallet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            {/* Wallet Info */}
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title="Wallet Information" />
                                <div>
                                    <InfoItem
                                        label="Wallet ID"
                                        value={
                                            <div className="flex items-center">
                                                <span className="truncate mr-2">{wallet.id}</span>
                                                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-300">
                                                    <Copy size={14} className="text-gray-500" />
                                                </button>
                                            </div>
                                        }
                                        icon={<CreditCard size={18} />}
                                    />
                                    <InfoItem
                                        label="Currency"
                                        value={`${wallet.Currency.name} (${wallet.Currency.symbol})`}
                                        icon={<DollarSign size={18} />}
                                    />
                                    <InfoItem
                                        label="Wallet Type"
                                        value={wallet.type === 'user' ? 'Personal Wallet' : 'Group Wallet'}
                                        icon={wallet.type === 'user' ? <User size={18} /> : <Users size={18} />}
                                    />
                                    <InfoItem
                                        label="Status"
                                        value={
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${wallet.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {wallet.status}
                                            </span>
                                        }
                                        icon={<Shield size={18} />}
                                    />
                                    <InfoItem
                                        label="Created On"
                                        value={formatDate(wallet.createdAt)}
                                        icon={<Calendar size={18} />}
                                    />
                                    <InfoItem
                                        label="Last Updated"
                                        value={timeAgo(wallet.updatedAt)}
                                        icon={<Clock size={18} />}
                                    />
                                </div>
                            </div>

                            {/* Owner Info */}
                            <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                                <SectionHeader title={wallet.type === 'user' ? 'User Information' : 'Group Information'} />

                                {wallet.type === 'user' && wallet.user ? (
                                    <div>
                                        <div className="flex items-center mb-6">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-100 flex items-center justify-center text-primary-600 mr-4">
                                                {wallet.user.profile_picture ? (
                                                    <img
                                                        src={wallet.user.profile_picture}
                                                        alt="Profile"
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {wallet.user.username || wallet.user.phone_number || "User"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {wallet.user.email || wallet.user.phone_number}
                                                </p>
                                            </div>
                                        </div>

                                        {wallet.user.preferences && (
                                            <div className="bg-gradient-to-r from-gray-50 to-primary-50 rounded-xl p-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Preferences</p>
                                                <div className="grid grid-cols-2 gap-3 text-xs">
                                                    <div>
                                                        <p className="text-gray-500">Language</p>
                                                        <p className="font-medium">{wallet.user.preferences.default_language || "English"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Currency</p>
                                                        <p className="font-medium">{wallet.user.preferences.default_currency || "USD"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Timezone</p>
                                                        <p className="font-medium">{wallet.user.preferences.default_timezone || "UTC"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : wallet.type === 'group' && wallet.group ? (
                                    <div>
                                        <div className="flex items-center mb-6">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-100 flex items-center justify-center text-primary-600 mr-4">
                                                {wallet.group.icon ? (
                                                    <img
                                                        src={wallet.group.icon}
                                                        alt="Group"
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <Users size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{wallet.group.title}</p>
                                                <p className="text-sm text-gray-500">{wallet.group.description}</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-primary-50 rounded-xl p-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Group Details</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <p className="text-gray-500">Status</p>
                                                    <p className="font-medium">{wallet.group.status}</p>
                                                </div>
                                                <button className="w-full mt-2 px-4 py-2 text-sm text-primary-600 bg-white rounded-lg border border-primary-100 hover:bg-primary-50 transition-colors duration-300 flex items-center justify-center">
                                                    <ExternalLink size={14} className="mr-2" />
                                                    View Group Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                                        <p className="text-gray-600 mb-2">No owner information available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {tabIndex === 1 && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                    Filter
                                </button>
                                <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                    Export
                                </button>
                            </div>
                        </div>

                        {transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/80 text-left">
                                            <th className="px-6 py-4 text-xs font-medium text-gray-600">Transaction</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-600">Description</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-600">Date</th>
                                            <th className="px-6 py-4 text-xs font-medium text-gray-600 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors duration-300">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className={`h-8 w-8 rounded-full ${transaction.type === 'incoming' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mr-3`}>
                                                            {transaction.type === 'incoming' ? <Download size={16} /> : <Send size={16} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {transaction.type === 'incoming' ? `From ${transaction.from}` : `To ${transaction.to}`}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{transaction.type === 'incoming' ? 'Received' : 'Sent'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(transaction.timestamp)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`font-medium ${transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {transaction.type === 'incoming' ? '+' : '-'} {wallet.Currency.symbol} {transaction.amount}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-gray-50 rounded-xl">
                                <Activity size={64} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-600 mb-2">No transactions found</p>
                                <p className="text-sm text-gray-500 mb-6">Your transaction history will appear here</p>
                                <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center mx-auto">
                                    <Plus size={18} className="mr-2" />
                                    Make First Transaction
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {tabIndex === 2 && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                        <SectionHeader title="Wallet Settings" />

                        <div className="space-y-6">
                            <div className="p-4 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                                            <DollarSign size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Default Currency</p>
                                            <p className="text-sm text-gray-500">{wallet.Currency.name} ({wallet.Currency.symbol})</p>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                        Change
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                                            <Eye size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Balance Visibility</p>
                                            <p className="text-sm text-gray-500">{hideBalance ? 'Hidden' : 'Visible'} by default</p>
                                        </div>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={!hideBalance}
                                            onChange={() => setHideBalance(!hideBalance)}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                                            <Bell size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Transaction Notifications</p>
                                            <p className="text-sm text-gray-500">Get notified about wallet activity</p>
                                        </div>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="p-4 border border-red-100 rounded-xl hover:border-red-200 transition-colors duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                                            <AlertCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Deactivate Wallet</p>
                                            <p className="text-sm text-gray-500">Temporarily suspend this wallet</p>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1.5 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300">
                                        Deactivate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default walletdetail;