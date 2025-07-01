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
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PieChart,
  Lock,
  Settings,
  FileText,
  Filter,
  Search,
  X
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';
import WalletDetail from '../../../../components/finance/userwallets/WalletDetail';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (error) {
    return dateString;
  }
};

const timeAgo = (dateString) => {
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

const formatCurrency = (amount: any) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return "KES 0.00";

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

const animationKeyframes = `
    @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes floatUp {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
    }

    .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
        background-size: 1000px 100%;
        animation: shimmer 2s infinite linear;
    }

    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
    }

    .animate-slideIn {
        animation: slideIn 0.3s ease-out forwards;
    }

    .animate-float {
        animation: floatUp 3s ease-in-out infinite;
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
`;

const WalletDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hideBalance, setHideBalance] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [loadingMore, setLoadingMore] = useState(false);
  const [stats, setStats] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('ksh');

  const tabs = ["Overview", "Transactions", "Analytics", "Settings"];

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Wallet ID is missing");
        }

        // Fetch wallet details from the API
        const response = await financeService.getWalletById(id);

        if (response && response.status) {
          setWalletData(response);
          setWallet(response.wallet);

          // Process transactions
          if (response.transactions) {
            const formattedTransactions = response.transactions.map(tx => ({
              id: tx.id,
              amount: tx.amount,
              description: tx.description,
              type: tx.type === 'WITHDRAW' ? 'outgoing' : 'incoming',
              from: tx.type === 'WITHDRAW' ? 'Wallet' : tx.source || 'External Account',
              to: tx.type === 'TOPUP' ? 'Wallet' : tx.counterpartyId || 'External Account',
              timestamp: tx.createdAt,
              status: tx.status
            }));
            setTransactions(formattedTransactions);
          }

          // Set stats if available
          if (response.stats) {
            setStats(response.stats);
          }

          setLoading(false);
        } else {
          throw new Error("Failed to retrieve wallet data");
        }
      } catch (error) {
        console.error("Failed to fetch wallet details:", error);
        toast.error("Failed to load wallet details. Please try again.");
        setError("Failed to load wallet details. Please try again.");
        setLoading(false);
      }
    };

    if (id) {
      fetchWalletData();
    }
  }, [id]);

  // Refresh wallet data
  const handleRefreshWallet = async () => {
    try {
      setIsRefreshing(true);
      // Fetch updated wallet details
      const response = await financeService.getWalletById(id);

      if (response && response.status) {
        setWalletData(response);
        setWallet(response.wallet);

        // Process transactions
        if (response.transactions) {
          const formattedTransactions = response.transactions.map(tx => ({
            id: tx.id,
            amount: tx.amount,
            description: tx.description,
            type: tx.type === 'WITHDRAW' ? 'outgoing' : 'incoming',
            from: tx.type === 'WITHDRAW' ? 'Wallet' : tx.source || 'External Account',
            to: tx.type === 'TOPUP' ? 'Wallet' : tx.counterpartyId || 'External Account',
            timestamp: tx.createdAt,
            status: tx.status
          }));
          setTransactions(formattedTransactions);
        }
      }

      toast.success("Wallet balance updated");
      setIsRefreshing(false);
    } catch (error) {
      console.error("Failed to refresh wallet:", error);
      toast.error("Failed to refresh wallet. Please try again.");
      setIsRefreshing(false);
    }
  };

  const handleLoadMoreTransactions = async () => {
    try {
      setLoadingMore(true);
      const lastTransaction = transactions[transactions.length - 1];
      const lastTimestamp = lastTransaction ? lastTransaction.timestamp : null;

      const moreTransactionsResponse = await financeService.getWalletTransactions(id, {
        before: lastTimestamp,
        limit: 10
      });

      if (moreTransactionsResponse && moreTransactionsResponse.data) {
        const formattedTransactions = moreTransactionsResponse.data.map(tx => ({
          id: tx.id,
          amount: tx.amount,
          description: tx.description,
          type: tx.type === 'WITHDRAW' ? 'outgoing' : 'incoming',
          from: tx.type === 'WITHDRAW' ? 'Wallet' : tx.source || 'External Account',
          to: tx.type === 'TOPUP' ? 'Wallet' : tx.counterpartyId || 'External Account',
          timestamp: tx.createdAt,
          status: tx.status
        }));

        setTransactions([...transactions, ...formattedTransactions]);
      }

      setLoadingMore(false);
    } catch (error) {
      console.error("Failed to load more transactions:", error);
      toast.error("Failed to load more transactions");
      setLoadingMore(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchMatch = searchTerm === '' ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.from && transaction.from.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.to && transaction.to.toLowerCase().includes(searchTerm.toLowerCase()));

    const typeMatch = filterType === 'all' || transaction.type === filterType;

    let dateMatch = true;
    if (dateRange !== 'all') {
      const txDate = new Date(transaction.timestamp);
      const now = new Date();

      if (dateRange === 'today') {
        dateMatch = txDate.toDateString() === now.toDateString();
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        dateMatch = txDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        dateMatch = txDate >= monthAgo;
      }
    }

    return searchMatch && typeMatch && dateMatch;
  });

  const generateAnalyticsData = () => {
    if (!transactions.length) return null;

    const incoming = transactions.filter(tx => tx.type === 'incoming')
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    const outgoing = transactions.filter(tx => tx.type === 'outgoing')
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    // Categories for spending (in a real app this would be actual data)
    const categories = [
      { name: "Transfers", amount: outgoing * 0.4, color: "bg-indigo-500" },
      { name: "Payments", amount: outgoing * 0.3, color: "bg-blue-500" },
      { name: "Fees", amount: outgoing * 0.15, color: "bg-emerald-500" },
      { name: "Other", amount: outgoing * 0.15, color: "bg-amber-500" },
    ];

    return { incoming, outgoing, categories };
  };

  const analyticsData = generateAnalyticsData();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="w-48 h-8 skeleton rounded-lg mb-4"></div>
            <div className="w-64 h-6 skeleton rounded-lg"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-pulse">
                <div className="w-1/3 h-6 skeleton rounded-lg mb-4"></div>
                <div className="w-full h-24 skeleton rounded-lg"></div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
                <div className="w-1/3 h-6 skeleton rounded-lg mb-4"></div>
                <div className="space-y-4">
                  <div className="w-full h-16 skeleton rounded-lg"></div>
                  <div className="w-full h-16 skeleton rounded-lg"></div>
                  <div className="w-full h-16 skeleton rounded-lg"></div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
                <div className="w-1/2 h-6 skeleton rounded-lg mb-4"></div>
                <div className="space-y-4">
                  <div className="w-full h-12 skeleton rounded-lg"></div>
                  <div className="w-full h-12 skeleton rounded-lg"></div>
                  <div className="w-full h-12 skeleton rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{animationKeyframes}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
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
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300"
              onClick={() => navigate(-1)}
            >
              Back to Wallets
            </button>
          </div>
        </div>

        <style>{animationKeyframes}</style>
      </div>
    );
  }

  if (!wallet) return null;

  const ownerType = wallet.type;

  const walletBalance = isNaN(parseFloat(wallet.availableBalance)) ? 0 : parseFloat(wallet.availableBalance);
  const walletCredit = isNaN(parseFloat(wallet.credit)) ? 0 : parseFloat(wallet.credit);
  const walletDebit = isNaN(parseFloat(wallet.debit)) ? 0 : parseFloat(wallet.debit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 pb-12">
      <div className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-opacity-90 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-xl hover:bg-indigo-50 transition-colors duration-300 text-indigo-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wallet Details</h1>
              <p className="text-gray-500 mt-1">
                {ownerType === 'user' ? 'Personal' : ownerType === 'group' ? 'Group' : 'System'} wallet ID: {wallet.id.substring(0, 8)}...
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${ownerType === 'user'
                ? 'bg-indigo-100 text-indigo-700'
                : ownerType === 'group'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
                }`}>
                {ownerType === 'user'
                  ? <User size={14} className="mr-1" />
                  : ownerType === 'group'
                    ? <Users size={14} className="mr-1" />
                    : <Shield size={14} className="mr-1" />
                }
                {ownerType === 'user' ? 'Personal Wallet' : ownerType === 'group' ? 'Group Wallet' : 'System Wallet'}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${wallet.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
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
                  ? 'border-indigo-500 text-indigo-600'
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
          <WalletDetail
            wallet={wallet}
            walletBalance={walletBalance}
            walletCredit={walletCredit}
            walletDebit={walletDebit}
            transactions={transactions}
            currencySymbol={currencySymbol}
            hideBalance={hideBalance}
            setHideBalance={setHideBalance}
            isRefreshing={isRefreshing}
            handleRefreshWallet={handleRefreshWallet}
            copyToClipboard={copyToClipboard}
            formatCurrency={formatCurrency}
            timeAgo={timeAgo}
            formatDate={formatDate}
            setTabIndex={setTabIndex}
          />
        )}

        {tabIndex === 1 && (
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 animate-fadeIn">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>

                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex items-center">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-300 flex items-center">
                    <Download size={16} className="mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={16} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'all'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setFilterType('all')}
                  >
                    All Types
                  </button>
                  <button
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'incoming'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setFilterType('incoming')}
                  >
                    <Download size={14} className="inline mr-1" /> Incoming
                  </button>
                  <button
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'outgoing'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setFilterType('outgoing')}
                  >
                    <Send size={14} className="inline mr-1" /> Outgoing
                  </button>
                </div>

                <div>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredTransactions.length > 0 ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80 text-left">
                        <th className="px-6 py-4 text-xs font-medium text-gray-600">Transaction</th>
                        <th className="px-6 py-4 text-xs font-medium text-gray-600">Description</th>
                        <th className="px-6 py-4 text-xs font-medium text-gray-600">Date</th>
                        <th className="px-6 py-4 text-xs font-medium text-gray-600 text-right">Amount</th>
                        <th className="px-6 py-4 text-xs font-medium text-gray-600 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTransactions.map((transaction, index) => (
                        <tr
                          key={transaction.id}
                          className="hover:bg-indigo-50/20 transition-colors duration-300 animate-fadeIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`h-10 w-10 rounded-xl ${transaction.type === 'incoming' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mr-3 shadow-sm`}>
                                {transaction.type === 'incoming' ? <Download size={18} /> : <Send size={18} />}
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
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-700">{formatDate(transaction.timestamp)}</p>
                              <p className="text-xs text-gray-500">{timeAgo(transaction.timestamp)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-medium ${transaction.type === 'incoming' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {transaction.type === 'incoming' ? '+' : '-'} {currencySymbol} {transaction.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              <CheckCircle size={12} className="mr-1" /> Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-center">
                  <button
                    className="px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors duration-300 flex items-center"
                    onClick={handleLoadMoreTransactions}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Load More Transactions
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 animate-fadeIn">
                <Activity size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">No transactions found</p>
                <p className="text-sm text-gray-500 mb-6">No transactions match your current filters</p>
                {(searchTerm || filterType !== 'all' || dateRange !== 'all') && (
                  <button
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center mx-auto"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setDateRange('all');
                    }}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {tabIndex === 2 && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    <Wallet size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Total Balance</h3>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {formatCurrency(walletBalance)}
                </div>
                <div className="text-xs text-gray-500">
                  Updated {timeAgo(wallet.updatedAt)}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                    <ArrowUpRight size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Income</h3>
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {formatCurrency(walletCredit)}
                </div>
                <div className="text-xs text-gray-500">
                  From {transactions.filter(tx => tx.type === 'incoming').length} incoming transactions
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mr-3">
                    <ArrowDownRight size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Expenses</h3>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {formatCurrency(walletDebit)}
                </div>
                <div className="text-xs text-gray-500">
                  From {transactions.filter(tx => tx.type === 'outgoing').length} outgoing transactions
                </div>
              </div>
            </div>

            {stats && (
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100 mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Current Month Volume</p>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {formatCurrency(stats.currentMonth.volume)}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <ArrowUpRight size={14} className="mr-1 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">{stats.volumeChangePercent}%</span> from last month
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Previous Month Volume</p>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {formatCurrency(stats.previousMonth.volume)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction Distribution</h3>
                {analyticsData ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Income</span>
                      </div>
                      <span className="text-sm font-medium">{analyticsData.incoming.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-gray-600">Expenses</span>
                      </div>
                      <span className="text-sm font-medium">{analyticsData.outgoing.toFixed(2)}</span>
                    </div>

                    <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${(analyticsData.incoming / (analyticsData.incoming + analyticsData.outgoing || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <PieChart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">Not enough transaction data</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Spending by Category</h3>
                {analyticsData && analyticsData.categories ? (
                  <div className="space-y-4">
                    {analyticsData.categories.map((category, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">{category.name}</span>
                          <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${category.color}`}
                            style={{
                              width: `${(category.amount / (analyticsData.outgoing || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <PieChart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">Not enough transaction data</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-300 flex items-center"
                  onClick={() => setTabIndex(1)}
                >
                  View All
                </button>
              </div>

              {transactions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transactions.slice(0, 4).map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-colors duration-300"
                    >
                      <div className="flex items-start">
                        <div className={`h-10 w-10 rounded-xl ${transaction.type === 'incoming' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mr-3`}>
                          {transaction.type === 'incoming' ? <Download size={18} /> : <Send size={18} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-800">
                              {transaction.description}
                            </p>
                            <p className={`font-medium ${transaction.type === 'incoming' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {transaction.type === 'incoming' ? '+' : '-'} {currencySymbol} {transaction.amount}
                            </p>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">
                              {transaction.type === 'incoming' ? `From ${transaction.from}` : `To ${transaction.to}`}
                            </p>
                            <p className="text-xs text-gray-500">{timeAgo(transaction.timestamp)}</p>
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
                  <p className="text-sm text-gray-500">Analytics will be available once you have transactions</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tabIndex === 3 && (
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-8 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Wallet Settings</h2>

            <div className="space-y-6">
              <div className="p-5 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors duration-300 hover:bg-indigo-50/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Default Currency</p>
                      <p className="text-sm text-gray-500">USD ($)</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    Change
                  </button>
                </div>
              </div>

              <div className="p-5 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors duration-300 hover:bg-indigo-50/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                      <Eye size={20} />
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
                    <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="p-5 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors duration-300 hover:bg-indigo-50/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Transaction Limit</p>
                      <p className="text-sm text-gray-500">Set maximum transaction amount</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    Configure
                  </button>
                </div>
              </div>

              <div className="p-5 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors duration-300 hover:bg-indigo-50/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Transaction Notifications</p>
                      <p className="text-sm text-gray-500">Get notified about wallet activity</p>
                    </div>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="p-5 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors duration-300 hover:bg-indigo-50/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Statement Settings</p>
                      <p className="text-sm text-gray-500">Configure statement delivery</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    Configure
                  </button>
                </div>
              </div>

              <div className="p-5 border border-red-100 rounded-xl hover:border-red-200 transition-colors duration-300 hover:bg-red-50/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mr-4">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Deactivate Wallet</p>
                      <p className="text-sm text-gray-500">Temporarily suspend this wallet</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300">
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{animationKeyframes}</style>
    </div>
  );
};

export default WalletDetailPage;
