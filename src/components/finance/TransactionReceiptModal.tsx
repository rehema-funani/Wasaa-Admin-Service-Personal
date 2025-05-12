import React from 'react'
import { ArrowDown, ArrowUp, ArrowDownUp, Calendar, CheckCircle, Clock, Copy, DollarSign, Download, FileText, Hash, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction } from '../../types/transaction';
import toast from 'react-hot-toast';

const TransactionReceiptModal: React.FC = ({ transaction, onClose }: { transaction: Transaction | null, onClose: () => void }) => {
    if (!transaction) return null;

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

    const { date, time } = formatDateTime(transaction.createdAt);
    const transactionType = getTransactionType(transaction);
    const amount = getTransactionAmount(transaction);
    const isDebit = transaction.debit > 0;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('copied to clipboard!');
    };

    const getColorScheme = () => {
        switch (transactionType) {
            case 'Deposit':
                return {
                    accent: 'text-emerald-600',
                    icon: 'text-emerald-500',
                    lightBg: 'bg-emerald-50',
                    bubble: 'bg-emerald-500/10 text-emerald-700',
                    border: 'border-emerald-100',
                    buttonBg: 'bg-emerald-50 hover:bg-emerald-100/80',
                    buttonText: 'text-emerald-700',
                    headerBg: 'bg-gradient-to-r from-slate-50 to-emerald-50',
                    decoration: 'from-emerald-200/20 to-teal-100/30'
                };
            case 'Withdrawal':
                return {
                    accent: 'text-rose-600',
                    icon: 'text-rose-500',
                    lightBg: 'bg-rose-50',
                    bubble: 'bg-rose-500/10 text-rose-700',
                    border: 'border-rose-100',
                    buttonBg: 'bg-rose-50 hover:bg-rose-100/80',
                    buttonText: 'text-rose-700',
                    headerBg: 'bg-gradient-to-r from-slate-50 to-rose-50',
                    decoration: 'from-rose-200/20 to-pink-100/30'
                };
            default:
                return {
                    accent: 'text-indigo-600',
                    icon: 'text-indigo-500',
                    lightBg: 'bg-indigo-50',
                    bubble: 'bg-indigo-500/10 text-indigo-700',
                    border: 'border-indigo-100',
                    buttonBg: 'bg-indigo-50 hover:bg-indigo-100/80',
                    buttonText: 'text-indigo-700',
                    headerBg: 'bg-gradient-to-r from-slate-50 to-indigo-50',
                    decoration: 'from-indigo-200/20 to-blue-100/30'
                };
        }
    };

    const colors = getColorScheme();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <motion.div
                className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
            >
                <div className="relative p-0.5">
                    <div
                        className={`absolute inset-0 bg-gradient-to-r ${colors.decoration} rounded-3xl blur-sm opacity-70 animate-pulse-slow`}
                    />
                    <div className="relative z-10 bg-white rounded-[22px] overflow-hidden">
                        <div className={`relative ${colors.headerBg} px-6 py-8`}>
                            <motion.button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100/80 transition-all"
                                aria-label="Close"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={20} strokeWidth={1.5} />
                            </motion.button>

                            <div className="absolute top-6 right-14 w-20 h-20 rounded-full bg-gradient-to-br from-slate-100/80 to-white/20 blur-xl opacity-70" />
                            <div className="absolute -bottom-4 left-10 w-16 h-16 rounded-full bg-gradient-to-tr from-slate-100/80 to-white/30 blur-xl opacity-60" />

                            <div className="flex flex-col space-y-6">
                                <div className="flex items-center">
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${colors.bubble} text-xs font-medium`}>
                                        {transactionType === 'Deposit' ? (
                                            <ArrowDown size={14} className="mr-1.5" strokeWidth={2} />
                                        ) : transactionType === 'Withdrawal' ? (
                                            <ArrowUp size={14} className="mr-1.5" strokeWidth={2} />
                                        ) : (
                                            <ArrowDownUp size={14} className="mr-1.5" strokeWidth={2} />
                                        )}
                                        {transactionType}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center">
                                        <span className={`text-4xl font-bold tracking-tight ${colors.accent}`}>
                                            {isDebit ? '+' : '-'}KES. {amount.toFixed(2)}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-500 mt-1">
                                        Transaction Receipt
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50">
                            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center">
                                    <Calendar size={18} className="text-slate-400 mr-3" strokeWidth={1.5} />
                                    <div>
                                        <div className="text-xs text-slate-500">Date & Time</div>
                                        <div className="font-medium text-slate-800">
                                            {date} <span className="text-slate-500 text-sm">at</span> {time}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${transaction.status === 'Complete'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                    }`}>
                                    {transaction.status === 'Complete'
                                        ? <CheckCircle size={14} className="mr-1.5" strokeWidth={1.5} />
                                        : <Clock size={14} className="mr-1.5" strokeWidth={1.5} />
                                    }
                                    {transaction.status}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex items-center">
                                        <div className="mr-3 p-2 rounded-full bg-slate-50">
                                            <Hash size={16} className="text-slate-500" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Transaction ID</div>
                                            <div className="font-medium text-slate-800 text-sm">{transaction.id.substring(0, 15)}...</div>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => copyToClipboard(transaction.id)}
                                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
                                        aria-label="Copy ID"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Copy size={16} strokeWidth={1.5} />
                                    </motion.button>
                                </div>

                                {/* Description */}
                                <div className="flex items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="mr-3 p-2 rounded-full bg-slate-50 mt-1">
                                        <FileText size={16} className="text-slate-500" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500">Description</div>
                                        <div className="font-medium text-slate-800 mt-1">
                                            {transaction.description}
                                        </div>

                                        {/* External Reference with improved formatting */}
                                        {transaction.external_id && (
                                            <div className="mt-2 text-sm">
                                                <span className="text-slate-500">Reference: </span>
                                                <span className="font-medium text-slate-700">{transaction.external_id}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Balance */}
                                <div className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="mr-3 p-2 rounded-full bg-slate-50">
                                        <DollarSign size={16} className="text-slate-500" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500">Final Balance</div>
                                        <div className="font-medium text-slate-800">KES. {transaction.balance.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex justify-end gap-3">
                                <motion.button
                                    onClick={onClose}
                                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm"
                                    whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                                    whileTap={{ y: 0 }}
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div
                tabIndex={0}
                className="outline-none"
                onKeyDown={(e) => e.key === 'Escape' && onClose()}
                autoFocus
            />

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default TransactionReceiptModal
