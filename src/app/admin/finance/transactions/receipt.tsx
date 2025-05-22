import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    ArrowDownUp,
    Calendar,
    CheckCircle,
    Clock,
    Copy,
    DollarSign,
    Download,
    FileText,
    Hash,
    Share,
    Printer,
    User,
    Smartphone,
    Mail,
    CreditCard,
    Shield,
    Minus
} from 'lucide-react';
import { Transaction } from '../../../../types/transaction';
import toast from 'react-hot-toast';
import financeService from '../../../../api/services/finance';

const TransactionReceiptPage: React.FC = () => {
    const { transactionId } = useParams<{ transactionId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const transaction: Transaction | null = location.state?.transaction || null;

    useEffect(() => {
        if (!transaction && transactionId) {
            financeService.getTransaction(transactionId);
        }
    }, [transaction, transactionId]);

    if (!transaction) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
                <motion.div
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 text-center max-w-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText size={24} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Transaction Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't locate the requested transaction.</p>
                    <button
                        onClick={() => navigate('/admin/finance/transactions')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Back to Transactions
                    </button>
                </motion.div>
            </div>
        );
    }

    const formatDateTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return {
                fullDate: date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };
        } catch (error) {
            return { fullDate: 'Invalid Date', time: '--:--' };
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

    const { fullDate, time } = formatDateTime(transaction.createdAt);
    const transactionType = getTransactionType(transaction);
    const amount = getTransactionAmount(transaction);
    const isDebit = transaction.debit > 0;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`, {
            style: {
                background: '#10B981',
                color: 'white',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500'
            }
        });
    };

    const getTransactionIcon = () => {
        switch (transactionType) {
            case 'Deposit':
                return <TrendingUp size={24} strokeWidth={2.5} className="text-emerald-600" />;
            case 'Withdrawal':
                return <TrendingDown size={24} strokeWidth={2.5} className="text-red-600" />;
            case 'Transfer':
                return <ArrowDownUp size={24} strokeWidth={2.5} className="text-blue-600" />;
            default:
                return <Minus size={24} strokeWidth={2.5} className="text-gray-600" />;
        }
    };

    const getColorScheme = () => {
        switch (transactionType) {
            case 'Deposit':
                return {
                    primary: 'text-emerald-600',
                    bg: 'from-emerald-50 to-teal-50',
                    accent: 'bg-emerald-100',
                    ring: 'ring-emerald-500/20'
                };
            case 'Withdrawal':
                return {
                    primary: 'text-red-600',
                    bg: 'from-red-50 to-pink-50',
                    accent: 'bg-red-100',
                    ring: 'ring-red-500/20'
                };
            case 'Transfer':
                return {
                    primary: 'text-blue-600',
                    bg: 'from-blue-50 to-indigo-50',
                    accent: 'bg-blue-100',
                    ring: 'ring-blue-500/20'
                };
            default:
                return {
                    primary: 'text-gray-600',
                    bg: 'from-gray-50 to-slate-50',
                    accent: 'bg-gray-100',
                    ring: 'ring-gray-500/20'
                };
        }
    };

    const colors = getColorScheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            <motion.div
                className="bg-white/80 backdrop-blur-xl border-b border-gray-100 print:hidden sticky top-0 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/admin/finance/transactions')}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            <span className="font-medium">Back</span>
                        </button>

                        <div className="flex items-center space-x-2">
                            <motion.button
                                onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
                                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Share size={16} className="mr-2" />
                                Share
                            </motion.button>
                            <motion.button
                                onClick={() => window.print()}
                                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Printer size={16} className="mr-2" />
                                Print
                            </motion.button>
                            <motion.button
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium hover:bg-indigo-700 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download size={16} className="mr-2" />
                                Download
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <div className="max-w-4xl mx-auto p-6">
                <motion.div
                    className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/* Hero Section */}
                    <motion.div className={`relative bg-gradient-to-br ${colors.bg} px-8 py-12`}>
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156,163,175,0.15) 1px, transparent 0)`,
                                backgroundSize: '20px 20px'
                            }}></div>
                        </div>                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className={`w-12 h-12 ${colors.accent} rounded-2xl flex items-center justify-center`}>
                                            {getTransactionIcon()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Transaction Receipt</p>
                                            <p className={`text-lg font-bold ${colors.primary}`}>{transactionType}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex items-center px-4 py-2 ${colors.accent} rounded-full`}>
                                    {transaction.status === 'Complete' ? (
                                        <CheckCircle size={16} className="mr-2 text-emerald-600" />
                                    ) : (
                                        <Clock size={16} className="mr-2 text-amber-600" />
                                    )}
                                    <span className={`text-sm font-semibold ${transaction.status === 'Complete' ? 'text-emerald-700' : 'text-amber-700'
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className={`text-5xl font-bold ${colors.primary} mb-2`}>
                                    {isDebit ? '+' : '-'}KES {amount.toLocaleString()}
                                </div>
                                <div className="flex items-center text-gray-600 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar size={18} className="mr-2" />
                                        <span className="font-medium">{fullDate}</span>
                                    </div>
                                    <div className="text-gray-400">•</div>
                                    <span className="font-medium">{time}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Transaction Details */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Transaction Details</h3>

                            {/* Transaction ID */}
                            <motion.div
                                className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl hover:bg-gray-100/80 transition-all group cursor-pointer"
                                whileHover={{ scale: 1.01 }}
                                onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                                            <Hash size={18} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                                            <p className="font-mono text-sm text-gray-900 mt-1">{transaction.id}</p>
                                        </div>
                                    </div>
                                    <Copy size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                            </motion.div>

                            {/* External Reference */}
                            {transaction.external_id && (
                                <motion.div
                                    className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl hover:bg-gray-100/80 transition-all group cursor-pointer"
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => copyToClipboard(transaction.external_id!, 'Reference')}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                                <FileText size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">External Reference</p>
                                                <p className="font-medium text-gray-900 mt-1">{transaction.external_id}</p>
                                            </div>
                                        </div>
                                        <Copy size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Description */}
                            <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                                        <FileText size={18} className="text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                                        <p className="text-gray-900 leading-relaxed">
                                            {transaction.description || 'No description provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Final Balance */}
                            <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                        <DollarSign size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Final Balance</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            KES {transaction.balance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User & Wallet Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                {transaction.user ? 'User Information' : 'System Transaction'}
                            </h3>

                            {transaction.user ? (
                                <>
                                    {/* User Profile */}
                                    <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                                <User size={18} className="text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-500 mb-3">Account Holder</p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-lg">
                                                            {transaction.user.first_name} {transaction.user.last_name}
                                                        </p>
                                                        <p className="text-gray-600">@{transaction.user.username}</p>
                                                    </div>

                                                    <div className="flex items-center text-gray-600">
                                                        <Smartphone size={16} className="mr-2" />
                                                        <span>{transaction.user.phone_number}</span>
                                                    </div>

                                                    <div className="flex items-center text-gray-600">
                                                        <Mail size={16} className="mr-2" />
                                                        <span>{transaction.user.email}</span>
                                                    </div>

                                                    <div className="flex items-center space-x-3 pt-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.user.phone_verified
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {transaction.user.phone_verified ? '✓ Phone Verified' : '✗ Phone Unverified'}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.user.email_verified
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {transaction.user.email_verified ? '✓ Email Verified' : '✗ Email Unverified'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-gray-50/80 backdrop-blur-sm p-8 rounded-2xl text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Shield size={24} className="text-gray-500" />
                                    </div>
                                    <p className="font-semibold text-gray-900 text-lg mb-2">System Transaction</p>
                                    <p className="text-gray-600">This transaction was automatically processed by the system</p>
                                </div>
                            )}

                            {/* Wallet Information */}
                            {transaction.UserWallet && (
                                <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl">
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                                            <CreditCard size={18} className="text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-3">Wallet Details</p>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Wallet ID</p>
                                                    <p className="font-mono text-sm text-gray-800">{transaction.UserWallet.id}</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Type</p>
                                                        <p className="font-medium text-gray-900 capitalize">
                                                            {transaction.UserWallet.type}
                                                            {transaction.UserWallet.purpose && ` (${transaction.UserWallet.purpose.replace('_', ' ')})`}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.UserWallet.status === 'Active'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {transaction.UserWallet.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 print:hidden">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Receipt generated on {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                        <button
                            onClick={() => navigate('/admin/finance/transactions')}
                            className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Back to Transactions
                        </button>
                    </div>
                </div>
            </div>
            
        </div >
    );
};

export default TransactionReceiptPage;