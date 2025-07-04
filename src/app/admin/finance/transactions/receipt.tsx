import React, { useState, useEffect } from 'react';
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
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Tag,
  Info,
  Wallet,
  CircleDollarSign
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import { useNavigate, useParams } from 'react-router-dom';

const TransactionReceiptPage = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) {
        setError('No transaction ID provided');
        setLoading(false);
        return;
      }

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
  }, [id]);

  const navigateBack = () => {
    navigate(-1)
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: any) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return '--:--';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'RECEIVE':
        return <ArrowDownToLine className="text-emerald-500" />;
      case 'SEND':
        return <ArrowUpFromLine className="text-indigo-500" />;
      case 'TRANSFER':
        return <ArrowLeftRight className="text-blue-500" />;
      default:
        return <CircleDollarSign className="text-blue-500" />;
    }
  };

  const getTransactionTypeLabel = (type) => {
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

  const getTransactionColor = (type) => {
    switch (type) {
      case 'RECEIVE':
        return 'emerald';
      case 'SEND':
        return 'indigo';
      case 'TRANSFER':
        return 'blue';
      case 'DEPOSIT':
        return 'green';
      case 'WITHDRAW':
        return 'amber';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700';
      case 'FAILED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="w-16 h-16 rounded-full border-[3px] border-blue-100 border-t-blue-500 animate-spin absolute"></div>
            <div className="w-16 h-16 rounded-full border-[3px] border-transparent border-b-blue-300 animate-spin absolute" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading transaction...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Transaction Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "We couldn't locate the requested transaction record."}</p>
          <button
            onClick={() => navigate('/admin/finance/transactions')}
            className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
          >
            Return to Transactions
          </button>
        </div>
      </div>
    );
  }

  const isCredit = transaction.type === 'RECEIVE' || transaction.type === 'DEPOSIT';
  const transactionDate = formatDate(transaction.createdAt);
  const transactionTime = formatTime(transaction.createdAt);

  const formattedBalance = formatCurrency(
    transaction.wallet.availableBalance.length > 10
      ? transaction.wallet.availableBalance.slice(0, 10)
      : transaction.wallet.availableBalance
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={navigateBack}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => copyToClipboard(transaction.id)}
                className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              >
                <Share size={16} className="mr-2" />
                Share
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              >
                <Printer size={16} className="mr-2" />
                Print
              </button>
              <button
                className="flex items-center px-5 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md shadow-blue-100"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-20 pt-8">
        <div className="mb-10 text-center">
          <h1 className="text-blue-500 text-xl font-medium mb-1">
            Transaction Receipt
          </h1>
          <h2 className="text-3xl font-bold text-slate-800 mb-1">
            {getTransactionTypeLabel(transaction.type)}
          </h2>
          <div className={`inline-flex items-center px-3 py-1 ${getStatusColor(transaction.status)} text-xs font-medium rounded-full`}>
            {transaction.status}
          </div>
        </div>

        {/* Main Receipt Card */}
        <div className="mx-auto px-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Amount Section */}
            <div className="px-8 py-10 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-blue-500">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <span className="text-xl font-semibold">{getTransactionTypeLabel(transaction.type)}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500 text-sm">
                  <Calendar size={16} />
                  <span>{transactionDate}</span>
                  <span className="mx-1">•</span>
                  <Clock size={16} />
                  <span>{transactionTime}</span>
                </div>
              </div>

              <div className="text-center">
                <div className={`text-5xl font-bold mb-3 ${isCredit ? 'text-emerald-500' : 'text-indigo-500'}`}>
                  {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="px-8 py-8">
              {/* Transaction Identifiers */}
              <div className="mb-10">
                <h3 className="text-slate-400 uppercase text-xs font-semibold tracking-wider mb-4">
                  Transaction Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transaction ID */}
                  <div
                    className="group flex items-start space-x-4 cursor-pointer"
                    onClick={() => copyToClipboard(transaction.id)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Hash size={18} className="text-blue-500" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-slate-500 text-sm mb-1">Transaction ID</p>
                      <div className="flex items-center">
                        <p className="text-slate-800 font-mono text-sm truncate">{transaction.id}</p>
                        <Copy size={14} className="ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  </div>

                  {/* Reference Number */}
                  <div
                    className="group flex items-start space-x-4 cursor-pointer"
                    onClick={() => copyToClipboard(transaction.reference)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Tag size={18} className="text-blue-500" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-slate-500 text-sm mb-1">Reference</p>
                      <div className="flex items-center">
                        <p className="text-slate-800 font-medium">{transaction.reference}</p>
                        <Copy size={14} className="ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount & Wallet Details */}
              <div className="mb-10">
                <h3 className="text-slate-400 uppercase text-xs font-semibold tracking-wider mb-4">
                  Amount & Wallet Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount Details */}
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="mb-6">
                      <p className="text-slate-500 text-sm mb-1">Transaction Amount</p>
                      <p className={`text-2xl font-bold ${isCredit ? 'text-emerald-500' : 'text-indigo-500'}`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500 text-sm mb-1">Debit</p>
                        <p className="text-slate-800 font-mono">{formatCurrency(transaction.debit)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm mb-1">Credit</p>
                        <p className="text-slate-800 font-mono">{formatCurrency(transaction.credit)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Information */}
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Wallet size={16} className="text-slate-500 mr-2" />
                      <p className="text-slate-800 font-semibold">Wallet Information</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-500 text-sm mb-1">Available Balance</p>
                      <p className="text-emerald-500 text-2xl font-bold">
                        {formattedBalance}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-xs">Wallet Type</p>
                        <p className="text-slate-800 capitalize">{transaction.wallet.type}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.wallet.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {transaction.wallet.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Additional Details */}
              <div>
                <h3 className="text-slate-400 uppercase text-xs font-semibold tracking-wider mb-4">
                  Additional Information
                </h3>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="mb-6">
                    <div className="flex items-start">
                      <Info size={16} className="text-slate-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-slate-700 font-medium mb-1">Description</p>
                        <p className="text-slate-600">
                          {transaction.description || 'No description provided for this transaction'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {transaction.counterpartyId && (
                    <div>
                      <div className="flex items-start">
                        <ArrowLeftRight size={16} className="text-slate-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-slate-700 font-medium mb-1">Counterparty</p>
                          <p className="text-slate-600 font-mono text-sm">{transaction.counterpartyId}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield size={16} className="text-blue-500 mr-2" />
                  <p className="text-sm text-slate-600">
                    This is an official transaction record
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  {transactionDate} • {transactionTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center print:hidden">
          <button
            onClick={() => navigate('/admin/finance/transactions')}
            className="px-6 py-2.5 text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Return to Transaction Registry
          </button>
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <CheckCircle size={16} className="mr-2 text-emerald-400" />
          <span>Copied to clipboard</span>
        </div>
      )}
    </div>
  );
};

export default TransactionReceiptPage;
