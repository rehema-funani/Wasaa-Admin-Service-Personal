import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  Users,
  AlertCircle,
  CheckCircle,
  Shield,
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';
import WalletDetail from '../../../../components/finance/userwallets/WalletDetail';
import TransactionHistory from '../../../../components/finance/userwallets/TransactionHistory';
import Analytics from '../../../../components/finance/userwallets/Analytics';

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
          <TransactionHistory
            transactions={filteredTransactions}
            loadingMore={loadingMore}
            handleLoadMoreTransactions={handleLoadMoreTransactions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            currencySymbol={currencySymbol}
            formatDate={formatDate}
            timeAgo={timeAgo}
          />
        )}

        {tabIndex === 2 && (
          <Analytics
            wallet={wallet}
            transactions={transactions}
            stats={stats}
            analyticsData={analyticsData}
            walletBalance={walletBalance}
            walletCredit={walletCredit}
            walletDebit={walletDebit}
            currencySymbol={currencySymbol}
            formatCurrency={formatCurrency}
            timeAgo={timeAgo}
            setTabIndex={setTabIndex}
          />
        )}
      </div>

      <style>{animationKeyframes}</style>
    </div>
  );
};

export default WalletDetailPage;
