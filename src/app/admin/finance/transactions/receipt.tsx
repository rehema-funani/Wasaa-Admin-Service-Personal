import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
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
  CheckSquare,
  XCircle,
  AlertCircle,
  Activity,
  Landmark,
  FileCheck,
  CircleDollarSign,
  BanknoteIcon
} from 'lucide-react';
import { Transaction } from '../../../../types/transaction';
import toast from 'react-hot-toast';
import financeService from '../../../../api/services/finance';

const TransactionReceiptPage: React.FC = () => {
  const { id } = useParams<any>();
  const location = useLocation();
  const navigate = useNavigate();

  const transaction: Transaction | null = location.state?.transaction || null;

  useEffect(() => {
    if (id) {
      financeService.getTransaction(id);
    }
  }, [transaction, id]);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-dark-surface dark:to-charcoal-900 flex items-center justify-center p-6">
        <motion.div
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-xl p-8 rounded-xl border border-primary-100 dark:border-dark-border shadow-card dark:shadow-dark-lg text-center max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-primary-400 dark:text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Transaction Not Found</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">We couldn't locate the requested transaction record.</p>
          <button
            onClick={() => navigate('/admin/finance/transactions')}
            className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-button dark:shadow-dark-glow"
          >
            Return to Transaction Registry
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
    toast.success(`${label} copied to clipboard`, {
      style: {
        background: '#0D99F2',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500'
      }
    });
  };

  const getTransactionIcon = () => {
    switch (transactionType) {
      case 'Deposit':
        return <BanknoteIcon size={22} strokeWidth={2} className="text-success-600 dark:text-success-400" />;
      case 'Withdrawal':
        return <CircleDollarSign size={22} strokeWidth={2} className="text-danger-600 dark:text-danger-400" />;
      case 'Transfer':
        return <ArrowDownUp size={22} strokeWidth={2} className="text-primary-600 dark:text-primary-400" />;
      default:
        return <Activity size={22} strokeWidth={2} className="text-neutral-600 dark:text-neutral-400" />;
    }
  };

  const getColorScheme = () => {
    switch (transactionType) {
      case 'Deposit':
        return {
          primary: 'text-success-600 dark:text-success-400',
          bg: 'from-success-50 to-success-50/30 dark:from-success-900/20 dark:to-success-900/10',
          accent: 'bg-success-100/70 dark:bg-success-900/30',
          ring: 'ring-success-500/20 dark:ring-success-700/20',
          statusBg: 'bg-success-50 dark:bg-success-900/20',
          statusBorder: 'border-success-200 dark:border-success-800/30'
        };
      case 'Withdrawal':
        return {
          primary: 'text-danger-600 dark:text-danger-400',
          bg: 'from-danger-50 to-danger-50/30 dark:from-danger-900/20 dark:to-danger-900/10',
          accent: 'bg-danger-100/70 dark:bg-danger-900/30',
          ring: 'ring-danger-500/20 dark:ring-danger-700/20',
          statusBg: 'bg-danger-50 dark:bg-danger-900/20',
          statusBorder: 'border-danger-200 dark:border-danger-800/30'
        };
      case 'Transfer':
        return {
          primary: 'text-primary-600 dark:text-primary-400',
          bg: 'from-primary-50 to-primary-50/30 dark:from-primary-900/20 dark:to-primary-900/10',
          accent: 'bg-primary-100/70 dark:bg-primary-900/30',
          ring: 'ring-primary-500/20 dark:ring-primary-700/20',
          statusBg: 'bg-primary-50 dark:bg-primary-900/20',
          statusBorder: 'border-primary-200 dark:border-primary-800/30'
        };
      default:
        return {
          primary: 'text-neutral-600 dark:text-neutral-400',
          bg: 'from-neutral-50 to-neutral-50/30 dark:from-dark-hover dark:to-dark-hover/60',
          accent: 'bg-neutral-100/70 dark:bg-dark-active/70',
          ring: 'ring-neutral-500/20 dark:ring-neutral-700/20',
          statusBg: 'bg-neutral-50 dark:bg-dark-active',
          statusBorder: 'border-neutral-200 dark:border-dark-border'
        };
    }
  };

  const colors = getColorScheme();

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'Complete':
        return <CheckSquare size={16} className="mr-2 text-success-600 dark:text-success-400" />;
      case 'Pending':
        return <Clock size={16} className="mr-2 text-warning-600 dark:text-warning-400" />;
      case 'Failed':
        return <XCircle size={16} className="mr-2 text-danger-600 dark:text-danger-400" />;
      default:
        return <AlertCircle size={16} className="mr-2 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'Complete':
        return 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800/30 text-success-700 dark:text-success-400';
      case 'Pending':
        return 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800/30 text-warning-700 dark:text-warning-400';
      case 'Failed':
        return 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800/30 text-danger-700 dark:text-danger-400';
      default:
        return 'bg-neutral-50 dark:bg-dark-active border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-neutral-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-finance-navy/5 via-white to-primary-50/30 dark:from-dark-surface dark:via-charcoal-900 dark:to-dark-surface">
      <motion.div
        className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-xl border-b border-primary-100 dark:border-dark-border print:hidden w-full shadow-nav dark:shadow-dark-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/finance/transactions')}
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="font-medium">Back to Transaction Registry</span>
            </button>

            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
                className="flex items-center px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-primary-50 dark:hover:bg-dark-hover rounded-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share size={16} className="mr-2" />
                Share
              </motion.button>
              <motion.button
                onClick={() => window.print()}
                className="flex items-center px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-primary-50 dark:hover:bg-dark-hover rounded-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Printer size={16} className="mr-2" />
                Print
              </motion.button>
              <motion.button
                className="flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white text-sm rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-all shadow-button dark:shadow-dark-glow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-3">
          <div className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-lg text-primary-600 dark:text-primary-400 text-xs font-medium">
            Official Transaction Record
          </div>
        </div>

        <motion.div
          className="bg-white/90 dark:bg-dark-elevated/90 backdrop-blur-xl rounded-xl border border-primary-100/80 dark:border-dark-border shadow-card dark:shadow-dark-lg overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div className={`relative bg-gradient-to-br ${colors.bg} px-8 py-10`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(7, 81, 138, 0.1) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="absolute top-3 right-3 opacity-10">
              <Landmark size={120} className="text-finance-navy dark:text-finance-highlight" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 ${colors.accent} rounded-lg flex items-center justify-center shadow-sm dark:shadow-dark-sm`}>
                      {getTransactionIcon()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Transaction Receipt</p>
                      <p className={`text-lg font-bold ${colors.primary}`}>{transactionType}</p>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center px-4 py-2 ${getStatusColor()} rounded-lg border`}>
                  {getStatusIcon()}
                  <span className="text-sm font-semibold">
                    {transaction.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className={`text-4xl font-bold ${colors.primary} mb-2 font-finance`}>
                  {isDebit ? '+' : '-'}{formatCurrency(amount)}
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400 space-x-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span className="font-medium">{fullDate}</span>
                  </div>
                  <div className="text-neutral-400 dark:text-neutral-600">•</div>
                  <span className="font-medium">{time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center">
                <FileCheck size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
                Transaction Details
              </h3>

              <motion.div
                className="bg-white dark:bg-dark-elevated border border-primary-100 dark:border-dark-border p-5 rounded-lg hover:bg-primary-50/40 dark:hover:bg-primary-900/20 transition-all group cursor-pointer shadow-sm dark:shadow-dark-sm"
                whileHover={{ scale: 1.01 }}
                onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Hash size={18} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Transaction ID</p>
                      <p className="font-mono text-sm text-neutral-900 dark:text-neutral-200 mt-1">{transaction.id}</p>
                    </div>
                  </div>
                  <Copy size={16} className="text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                </div>
              </motion.div>

              {transaction.external_id && (
                <motion.div
                  className="bg-white dark:bg-dark-elevated border border-primary-100 dark:border-dark-border p-5 rounded-lg hover:bg-primary-50/40 dark:hover:bg-primary-900/20 transition-all group cursor-pointer shadow-sm dark:shadow-dark-sm"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => copyToClipboard(transaction.external_id!, 'Reference')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                        <FileText size={18} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">External Reference</p>
                        <p className="font-medium text-neutral-900 dark:text-neutral-200 mt-1">{transaction.external_id}</p>
                      </div>
                    </div>
                    <Copy size={16} className="text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                </motion.div>
              )}

              <div className="bg-white dark:bg-dark-elevated border border-primary-100 dark:border-dark-border p-5 rounded-lg shadow-sm dark:shadow-dark-sm">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <FileText size={18} className="text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Description</p>
                    <p className="text-neutral-900 dark:text-neutral-300 text-[12px] leading-relaxed">
                      {transaction.description || 'No description provided for this transaction'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-elevated border border-primary-100 dark:border-dark-border p-5 rounded-lg shadow-sm dark:shadow-dark-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center mr-4">
                    <DollarSign size={18} className="text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Final Balance</p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1 font-finance">
                      {formatCurrency(transaction.balance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center">
                {transaction.user ? (
                  <>
                    <User size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
                    Account Information
                  </>
                ) : (
                  <>
                    <Shield size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
                    System Transaction
                  </>
                )}
              </h3>

              {transaction.user ? (
                <>
                  <div className="bg-white dark:bg-dark-elevated border border-primary-100 dark:border-dark-border p-5 rounded-lg shadow-sm dark:shadow-dark-sm">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                        <User size={18} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">Account Holder</p>
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                              {transaction.user.first_name} {transaction.user.last_name}
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-400">@{transaction.user.username}</p>
                          </div>

                          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                            <Smartphone size={16} className="mr-2" />
                            <span>{transaction.user.phone_number}</span>
                          </div>

                          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                            <Mail size={16} className="mr-2" />
                            <span>{transaction.user.email}</span>
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${transaction.user.phone_verified
                              ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800/30'
                              : 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800/30'
                              }`}>
                              {transaction.user.phone_verified ? '✓ Phone Verified' : '✗ Phone Unverified'}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${transaction.user.email_verified
                              ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800/30'
                              : 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800/30'
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
                <div className="bg-white dark:bg-dark-elevated border border-primary-100 dark:border-dark-border p-6 rounded-lg shadow-sm dark:shadow-dark-sm text-center">
                  <div className="w-16 h-16 bg-finance-navy/10 dark:bg-finance-navy/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield size={24} className="text-finance-navy dark:text-finance-accent" />
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg mb-2">System Transaction</p>
                  <p className="text-neutral-600 dark:text-neutral-400">This transaction was automatically processed by the system</p>
                </div>
              )}

              {transaction.UserWallet && (
                <div className="bg-white dark:bg-dark-elevated border border-primary-100 dark:border-dark-border p-5 rounded-lg shadow-sm dark:shadow-dark-sm">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                      <CreditCard size={18} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">Wallet Details</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">Wallet ID</p>
                          <p className="font-mono text-sm text-neutral-800 dark:text-neutral-300">{transaction.UserWallet.id}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">Type</p>
                            <p className="font-medium text-neutral-900 dark:text-neutral-200 capitalize">
                              {transaction.UserWallet.type}
                              {transaction.UserWallet.purpose && ` (${transaction.UserWallet.purpose.replace('_', ' ')})`}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${transaction.UserWallet.status === 'Active'
                            ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800/30'
                            : 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800/30'
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

        <div className="mt-4">
          <div className="bg-white/90 dark:bg-dark-elevated/90 border border-primary-100 dark:border-dark-border rounded-lg overflow-hidden shadow-sm dark:shadow-dark-sm">
            <div className="py-4 px-6 bg-primary-50/50 dark:bg-primary-900/20 border-b border-primary-100 dark:border-dark-border flex items-center space-x-2">
              <CheckCircle size={16} className="text-primary-600 dark:text-primary-400" />
              <h4 className="font-medium text-primary-700 dark:text-primary-400">Verification</h4>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between text-sm">
                <p className="text-neutral-500 dark:text-neutral-400">
                  This is an official receipt issued by the system. Transaction details have been verified and recorded in the financial ledger.
                </p>
                <div className="flex items-center">
                  <Shield size={16} className="text-primary-600 dark:text-primary-400 mr-2" />
                  <span className="text-primary-700 dark:text-primary-400 font-medium">Secure Record</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-neutral-50/50 dark:bg-dark-active/30 border-t border-neutral-100 dark:border-dark-border print:hidden mt-6 rounded-b-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Receipt generated on {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <button
              onClick={() => navigate('/admin/finance/transactions')}
              className="px-6 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            >
              Return to Transaction Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionReceiptPage;
