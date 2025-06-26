import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  FileText,
  Hash,
  Share,
  Printer,
  CreditCard,
  Shield,
  CheckSquare,
  XCircle,
  AlertTriangle,
  Activity,
  Landmark,
  CircleDollarSign,
  ArrowDownToLine,
  ArrowUpFromLine,
  RepeatIcon,
  Tag,
  Wallet,
  Send,
  RadioReceiver
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

interface TransactionWallet {
  id: string;
  user_uuid: string;
  group_uuid: string | null;
  systemWalletType: string | null;
  type: string;
  status: string;
  availableBalance: string;
  lockedBalance: string;
  debit: string;
  credit: string;
  currencyId: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  user_uuid: string;
  amount: string;
  description: string;
  source: string | null;
  type: string;
  debit: string;
  credit: string;
  status: string;
  counterpartyId: string;
  reference: string;
  createdAt: string;
  wallet: TransactionWallet;
}

interface TransactionResponse {
  status: boolean;
  transaction: Transaction;
}

const TransactionReceiptPage: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams();
  const navigateBack = () => {
    window.history.back();
  };

  const navigateTo = (url: string) => {
    window.location.href = url;
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) {
        setError('No transaction ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await financeService.getTransaction(id);
        if (response.status && response.transaction) {
          setTransaction(response.transaction);
        } else {
          setError('Failed to load transaction details');
        }
      } catch (err) {
        setError('An error occurred while fetching transaction data');
        console.error('Error fetching transaction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, []);

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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'RECEIVE':
        return <ArrowDownToLine size={22} className="text-emerald-600" />;
      case 'SEND':
        return <ArrowUpFromLine size={22} className="text-violet-600" />;
      case 'TRANSFER':
        return <RepeatIcon size={22} className="text-blue-600" />;
      case 'DEPOSIT':
        return <ArrowDownToLine size={22} className="text-green-600" />;
      case 'WITHDRAW':
        return <CircleDollarSign size={22} className="text-amber-600" />;
      default:
        return <Activity size={22} className="text-gray-600" />;
    }
  };

  const getTransactionTypeLabel = (type: string): string => {
    switch (type) {
      case 'RECEIVE':
        return 'Money Received';
      case 'SEND':
        return 'Money Sent';
      case 'TRANSFER':
        return 'Transfer';
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAW':
        return 'Withdrawal';
      default:
        return type;
    }
  };

  const getColorScheme = (type: string) => {
    switch (type) {
      case 'RECEIVE':
        return {
          primary: 'text-emerald-600',
          bg: 'from-emerald-50 to-emerald-50/30',
          accent: 'bg-emerald-100/70',
          indicator: 'text-emerald-600 bg-emerald-50 border-emerald-200'
        };
      case 'SEND':
        return {
          primary: 'text-violet-600',
          bg: 'from-violet-50 to-violet-50/30',
          accent: 'bg-violet-100/70',
          indicator: 'text-violet-600 bg-violet-50 border-violet-200'
        };
      case 'TRANSFER':
        return {
          primary: 'text-blue-600',
          bg: 'from-blue-50 to-blue-50/30',
          accent: 'bg-blue-100/70',
          indicator: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'DEPOSIT':
        return {
          primary: 'text-green-600',
          bg: 'from-green-50 to-green-50/30',
          accent: 'bg-green-100/70',
          indicator: 'text-green-600 bg-green-50 border-green-200'
        };
      case 'WITHDRAW':
        return {
          primary: 'text-amber-600',
          bg: 'from-amber-50 to-amber-50/30',
          accent: 'bg-amber-100/70',
          indicator: 'text-amber-600 bg-amber-50 border-amber-200'
        };
      default:
        return {
          primary: 'text-gray-600',
          bg: 'from-gray-50 to-gray-50/30',
          accent: 'bg-gray-100/70',
          indicator: 'text-gray-600 bg-gray-50 border-gray-200'
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckSquare size={16} className="mr-2 text-emerald-600" />;
      case 'PENDING':
        return <Clock size={16} className="mr-2 text-amber-600" />;
      case 'FAILED':
        return <XCircle size={16} className="mr-2 text-red-600" />;
      default:
        return <AlertTriangle size={16} className="mr-2 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'PENDING':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'FAILED':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(numAmount);
  };

  const isCredit = (transaction: Transaction): boolean => {
    return transaction.type === 'RECEIVE' || transaction.type === 'DEPOSIT';
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-xl border border-blue-100 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Transaction Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't locate the requested transaction record."}</p>
          <button
            onClick={() => navigateTo('/admin/finance/transactions')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Return to Transaction Registry
          </button>
        </div>
      </div>
    );
  }

  const { fullDate, time } = formatDateTime(transaction.createdAt);
  const colors = getColorScheme(transaction.type);
  const transactionTypeLabel = getTransactionTypeLabel(transaction.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-blue-100 w-full shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={navigateBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="font-medium">Back to Transaction Registry</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Share size={16} className="mr-2" />
                Share
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Printer size={16} className="mr-2" />
                Print
              </button>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-3">
          <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-xs font-medium">
            Official Transaction Record
          </div>
        </div>

        {/* Main receipt card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-xl overflow-hidden">
          <div className={`relative bg-gradient-to-br ${colors.bg} px-8 py-10`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(7, 81, 138, 0.1) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="absolute top-3 right-3 opacity-10">
              <Landmark size={120} className="text-blue-900" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 ${colors.accent} rounded-lg flex items-center justify-center shadow-sm`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Transaction Receipt</p>
                      <p className={`text-lg font-bold ${colors.primary}`}>{transactionTypeLabel}</p>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center px-4 py-2 ${getStatusColor(transaction.status)} rounded-lg border`}>
                  {getStatusIcon(transaction.status)}
                  <span className="text-sm font-semibold">
                    {transaction.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className={`text-4xl font-bold ${colors.primary} mb-2 font-mono`}>
                  {isCredit(transaction) ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span className="font-medium">{fullDate}</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <span className="font-medium">{time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FileText size={18} className="mr-2 text-blue-600" />
                Transaction Details
              </h3>

              {/* Transaction ID */}
              <div
                className="bg-white border border-blue-100 p-5 rounded-lg hover:bg-blue-50/40 transition-all group cursor-pointer shadow-sm"
                onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Hash size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                      <p className="font-mono text-sm text-gray-900 mt-1">{transaction.id}</p>
                    </div>
                  </div>
                  <Copy size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>

              {/* Reference */}
              <div
                className="bg-white border border-blue-100 p-5 rounded-lg hover:bg-blue-50/40 transition-all group cursor-pointer shadow-sm"
                onClick={() => copyToClipboard(transaction.reference, 'Reference')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Tag size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reference</p>
                      <p className="font-medium text-gray-900 mt-1">{transaction.reference}</p>
                    </div>
                  </div>
                  <Copy size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>

              {/* Transaction Type */}
              <div className="bg-white border border-blue-100 p-5 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${colors.accent} rounded-lg flex items-center justify-center mr-4`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Type</p>
                    <p className={`text-lg font-bold ${colors.primary} mt-1`}>
                      {transactionTypeLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-blue-100 p-5 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <FileText size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {transaction.description || 'No description provided for this transaction'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-white border border-blue-100 p-5 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-xl font-bold text-gray-900 mt-1 font-mono">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Fee</p>
                    <p className="text-xl font-bold text-gray-900 mt-1 font-mono">
                      {formatCurrency("0")} {/* Placeholder - adjust if you have fee data */}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Wallet size={18} className="mr-2 text-blue-600" />
                Wallet Information
              </h3>

              {/* Wallet Details */}
              <div className="bg-white border border-blue-100 p-5 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-3">Wallet Details</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Wallet ID</p>
                        <p className="font-mono text-sm text-gray-800">{transaction.wallet.id}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {transaction.wallet.type}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${transaction.wallet.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          {transaction.wallet.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="bg-white border border-blue-100 p-5 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <CircleDollarSign size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-3">Wallet Balance</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Available Balance</p>
                        <p className="text-2xl font-bold text-emerald-600 font-mono">
                          {/* Format the balance to a readable number */}
                          {formatCurrency(transaction.wallet.availableBalance.slice(0, 10))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Locked Balance</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(transaction.wallet.lockedBalance)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-blue-100 p-5 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="flex items-center">
                      <Send size={16} className="mr-2 text-violet-600" />
                      <p className="text-sm font-medium text-gray-500">Total Debit</p>
                    </div>
                    <p className="text-xl font-bold text-violet-600 mt-1 font-mono">
                      {formatCurrency(transaction.debit)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <RadioReceiver size={16} className="mr-2 text-emerald-600" />
                      <p className="text-sm font-medium text-gray-500">Total Credit</p>
                    </div>
                    <p className="text-xl font-bold text-emerald-600 mt-1 font-mono">
                      {formatCurrency(transaction.credit)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Counterparty Information */}
              {transaction.counterpartyId && (
                <div className="bg-white border border-blue-100 p-5 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                      <RepeatIcon size={18} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-3">Counterparty</p>
                      <div>
                        <p className="text-xs text-gray-500">Counterparty ID</p>
                        <p className="font-mono text-sm text-gray-800">{transaction.counterpartyId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="mt-4">
          <div className="bg-white border border-blue-100 rounded-lg overflow-hidden shadow-sm">
            <div className="py-4 px-6 bg-blue-50 border-b border-blue-100 flex items-center space-x-2">
              <CheckCircle size={16} className="text-blue-600" />
              <h4 className="font-medium text-blue-700">Verification</h4>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-500">
                  This is an official receipt issued by the system. Transaction details have been verified and recorded in the financial ledger.
                </p>
                <div className="flex items-center">
                  <Shield size={16} className="text-blue-600 mr-2" />
                  <span className="text-blue-700 font-medium">Secure Record</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 print:hidden mt-6 rounded-b-lg">
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
              onClick={() => navigateTo('/admin/finance/transactions')}
              className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
