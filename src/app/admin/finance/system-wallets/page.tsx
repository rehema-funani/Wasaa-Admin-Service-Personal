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
  BarChart3,
  Clock,
  Eye,
  Settings,
  CheckCircle2,
  Sparkles,
  LineChart,
  BadgeDollarSign,
  BanknoteIcon,
  ArrowDownUp,
  LayoutDashboard,
  Shield,
  CircleDollarSign,
  Building2,
  Lock,
  ShieldAlert,
  Receipt,
  PiggyBank,
  Users,
  PencilRuler,
  Plus,
  X,
  ChevronDown
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
import { SystemWallet, WalletTransaction } from '../../../../types/finance';
import { mockTransactions } from '../../../../data/finance';
import TopUpWallet from '../../../../components/finance/TopUpWallet';
import TransferWallet from '../../../../components/finance/TransferWallet';
import WalletHistory from '../../../../components/finance/WalletHistory';
import WalletSettings from '../../../../components/finance/WalletSettings';
import financeService from '../../../../api/services/finance';

// Helper to get a readable name from the wallet type
const getWalletName = (type) => {
  if (!type) return 'System Wallet';

  // Replace underscores with spaces and capitalize each word
  return type.split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper to get a meaningful description for each wallet type
const getWalletDescription = (type) => {
  const descriptions = {
    'FLOAT': 'Main liquidity pool for platform operations',
    'COMMISSIONS': 'Collects platform fees from transactions',
    'OPERATIONS': 'Funds for day-to-day platform operations',
    'ESCROW': 'Holds funds during transaction processing',
    'RESERVE': 'Emergency funds and financial reserves',
    'TAX': 'Collects and manages tax obligations',
    'PROMOTIONAL': 'Funds for marketing and user rewards',
    'SETTLEMENT': 'For merchant and partner settlements',
    'LIQUIDITY': 'Additional liquidity for high-volume periods',
    'USER_HOLDING': 'Temporary storage for user deposits',
    'CUSTOM': 'Configurable wallet for special initiatives'
  };

  return descriptions[type] || 'System wallet for financial operations';
};

const SystemWalletsPage = () => {
  const [systemWallets, setSystemWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const fetchSystemWallets = async () => {
      setIsLoading(true);
      try {
        const response = await financeService.getSystemWallets();

        const processedWallets = response.wallets.map(wallet => ({
          ...wallet,
          balance: parseFloat(wallet.availableBalance) || 0,
          type: wallet.systemWalletType || wallet.type,
          name: getWalletName(wallet.systemWalletType),
          description: getWalletDescription(wallet.systemWalletType),
          accountNumber: `WASAA-${wallet.systemWalletType || 'SYS'}-${wallet.id.substring(0, 8)}`,
          lastUpdated: wallet.updatedAt,
          monthlyVolume: wallet.monthlyVolume || 0,
          status: wallet.status === 'Active' ? 'active' : 'inactive'
        }));

        setSystemWallets(processedWallets);

        const balance = processedWallets.reduce((total, wallet) => total + wallet.balance, 0);
        const volume = processedWallets.reduce((total, wallet) => total + wallet.monthlyVolume, 0);

        setTotalBalance(balance);
        setTotalVolume(volume);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch system wallets', error);
        showSuccess('Failed to load system wallets');
        setIsLoading(false);
      }
    };

    fetchSystemWallets();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const filteredWallets = systemWallets.filter(wallet => {
    const matchesSearch =
      (wallet.name && wallet.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wallet.systemWalletType && wallet.systemWalletType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wallet.description && wallet.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wallet.id && wallet.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || wallet.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const fetchWalletTransactions = (walletId) => {
    // In a real implementation, this would be:
    // const transactions = await walletService.getWalletTransactions(walletId);

    // For now, filtering mock data
    return mockTransactions.filter(tx => tx.walletId === walletId);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const openTopUpModal = (wallet) => {
    setSelectedWallet(wallet);
    setModalType('topup');
    setIsModalOpen(true);
  };

  const openTransferModal = (wallet) => {
    setSelectedWallet(wallet);
    setModalType('transfer');
    setIsModalOpen(true);
  };

  const openHistoryModal = (wallet) => {
    setSelectedWallet(wallet);
    setTransactions(fetchWalletTransactions(wallet.id));
    setModalType('history');
    setIsModalOpen(true);
  };

  const openSettingsModal = (wallet) => {
    setSelectedWallet(wallet);
    setModalType('settings');
    setIsModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30';
      case 'inactive':
        return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30';
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30';
      case 'completed':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30';
      case 'failed':
        return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30';
      default:
        return 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-700';
    }
  };

  const getTransactionIcon = (type) => {
    if (type === 'credit') {
      return <ArrowDownLeft className="w-4 h-4 text-emerald-500" />;
    } else {
      return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
    }
  };

  const getWalletIcon = (type) => {
    switch (type) {
      case 'FLOAT':
        return <BanknoteIcon className="w-4 h-4 text-blue-500" />;
      case 'COMMISSIONS':
        return <BadgeDollarSign className="w-4 h-4 text-indigo-500" />;
      case 'OPERATIONS':
        return <Building2 className="w-4 h-4 text-neutral-500" />;
      case 'ESCROW':
        return <Lock className="w-4 h-4 text-violet-500" />;
      case 'RESERVE':
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      case 'TAX':
        return <Receipt className="w-4 h-4 text-red-500" />;
      case 'PROMOTIONAL':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'SETTLEMENT':
        return <CircleDollarSign className="w-4 h-4 text-emerald-500" />;
      case 'LIQUIDITY':
        return <PiggyBank className="w-4 h-4 text-cyan-500" />;
      case 'USER_HOLDING':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'CUSTOM':
        return <PencilRuler className="w-4 h-4 text-slate-500" />;
      default:
        return <Wallet className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getWalletAccentColor = (type) => {
    switch (type) {
      case 'FLOAT':
        return 'border-l-blue-500';
      case 'COMMISSIONS':
        return 'border-l-indigo-500';
      case 'OPERATIONS':
        return 'border-l-neutral-500';
      case 'ESCROW':
        return 'border-l-violet-500';
      case 'RESERVE':
        return 'border-l-purple-500';
      case 'TAX':
        return 'border-l-red-500';
      case 'PROMOTIONAL':
        return 'border-l-amber-500';
      case 'SETTLEMENT':
        return 'border-l-emerald-500';
      case 'LIQUIDITY':
        return 'border-l-cyan-500';
      case 'USER_HOLDING':
        return 'border-l-blue-500';
      case 'CUSTOM':
        return 'border-l-slate-500';
      default:
        return 'border-l-neutral-500';
    }
  };

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

  const handleWalletAction = (e, wallet, action) => {
    e.stopPropagation();
    setShowDropdown(null);

    switch (action) {
      case 'topup':
        openTopUpModal(wallet);
        break;
      case 'transfer':
        openTransferModal(wallet);
        break;
      case 'history':
        openHistoryModal(wallet);
        break;
      case 'settings':
        openSettingsModal(wallet);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl font-medium text-neutral-900 dark:text-white tracking-tight flex items-center">
              <BanknoteIcon size={20} className="mr-2 text-blue-500" />
              System Wallets
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Manage liquidity pools, commissions, and operational funds
            </p>
          </div>

          {/* <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-all"
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? "Syncing..." : "Sync Balances"}</span>
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs shadow-sm transition-all"
            >
              <Plus size={14} />
              <span>New Wallet</span>
            </button>
          </div> */}
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search wallets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 items-center bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-1 shadow-sm">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-md text-xs transition-all ${statusFilter === 'all'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 rounded-md text-xs transition-all ${statusFilter === 'active'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-3 py-1 rounded-md text-xs transition-all ${statusFilter === 'inactive'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
              >
                Inactive
              </button>
            </div>

            <button className="p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-750 shadow-sm">
              <Filter size={14} />
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-sm">
            <CheckCircle2 size={14} className="flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* System Wallets Overview */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <Wallet size={16} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Total Balance</h3>
              </div>
              <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100 font-mono">
                {formatCurrency(totalBalance)}
              </p>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <ArrowUpRight size={10} className="mr-0.5" />
                <span>+5.3% from previous period</span>
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                  <LineChart size={16} className="text-indigo-500" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Transaction Volume</h3>
              </div>
              <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100 font-mono">
                {formatCurrency(totalVolume)}
              </p>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <ArrowUpRight size={10} className="mr-0.5" />
                <span>+12.8% from previous period</span>
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                  <Clock size={16} className="text-amber-500" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Processing Time</h3>
              </div>
              <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100 font-mono">1.2s</p>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <ArrowUpRight size={10} className="mr-0.5" />
                <span>-0.3s from previous period</span>
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-md">
                  <ShieldCheck size={16} className="text-violet-500" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">System Health</h3>
              </div>
              <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100 font-mono">99.98%</p>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <ArrowUpRight size={10} className="mr-0.5" />
                <span>+0.06% from previous period</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 border-l-[3px] border-l-blue-200 dark:border-l-blue-700 shadow-sm animate-pulse">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
                        <div>
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
                    </div>
                    <div className="h-7 bg-neutral-200 dark:bg-neutral-700 rounded w-36 mt-4 mb-3"></div>
                    <div className="border-t border-neutral-100 dark:border-neutral-700 pt-3 mt-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-14 mb-1"></div>
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                        </div>
                        <div>
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-14 mb-1"></div>
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredWallets.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 p-6 text-center">
                <div className="flex justify-center mb-3">
                  <Wallet size={32} className="text-neutral-400" />
                </div>
                <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200 mb-1">No wallets found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`group bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 border-l-[3px] ${getWalletAccentColor(wallet.type)} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 bg-neutral-50 dark:bg-neutral-750 rounded-md`}>
                          {getWalletIcon(wallet.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{wallet.name}</h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStatusColor(wallet.status)}`}>
                              {wallet.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 font-mono">{wallet.accountNumber}</p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-750 rounded-md transition-colors text-neutral-400 dark:text-neutral-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(showDropdown === wallet.id ? null : wallet.id);
                          }}
                        >
                          <MoreHorizontal size={14} />
                        </button>

                        {showDropdown === wallet.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10">
                            <button
                              disabled={wallet.status === "inactive"}
                              className={`w-full text-left px-3 py-1.5 text-xs ${wallet.status === "inactive"
                                ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-750"} flex items-center`}
                              onClick={(e) => handleWalletAction(e, wallet, 'topup')}
                            >
                              <Plus size={12} className="mr-1.5" />
                              Top Up
                            </button>
                            <button
                              disabled={wallet.status === "inactive"}
                              className={`w-full text-left px-3 py-1.5 text-xs ${wallet.status === "inactive"
                                ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-750"} flex items-center`}
                              onClick={(e) => handleWalletAction(e, wallet, 'transfer')}
                            >
                              <ArrowUpRight size={12} className="mr-1.5" />
                              Transfer
                            </button>
                            <button
                              className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-750 flex items-center"
                              onClick={(e) => handleWalletAction(e, wallet, 'history')}
                            >
                              <Clock size={12} className="mr-1.5" />
                              History
                            </button>
                            <button
                              className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-750 flex items-center"
                              onClick={(e) => handleWalletAction(e, wallet, 'settings')}
                            >
                              <Settings size={12} className="mr-1.5" />
                              Settings
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 mb-3">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Current Balance</p>
                      <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 font-mono">
                        {formatCurrency(wallet.balance)}
                      </h2>
                    </div>

                    <div className="flex items-start justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
                      <div>
                        <p className="text-[10px] text-neutral-500 mb-0.5">Last Updated</p>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 font-mono">{formatDate(wallet.lastUpdated)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 mb-0.5">Monthly Volume</p>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium font-mono text-right">{formatCurrency(wallet.monthlyVolume)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 shadow-sm mb-6">
          <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
            <h2 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 flex items-center">
              <ArrowDownUp size={16} className="mr-1.5 text-blue-500" />
              Recent Transactions
            </h2>
            <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-100 dark:divide-neutral-700">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-750">
                  <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Wallet</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {/* If no transaction data is available, display a placeholder message */}
                {mockTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-3 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                      No recent transactions found
                    </td>
                  </tr>
                ) : (
                  mockTransactions.slice(0, 5).map((transaction) => {
                    const wallet = systemWallets.find(w => w.id === transaction.walletId);
                    return (
                      <tr key={transaction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-750">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-7 w-7 rounded-md bg-neutral-100 dark:bg-neutral-750 flex items-center justify-center mr-2">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
                                {transaction.type === 'credit' ? 'Incoming' : 'Outgoing'}
                              </div>
                              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">{transaction.reference}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-xs text-neutral-800 dark:text-neutral-300">{wallet?.name || 'Unknown Wallet'}</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className={`text-xs font-medium font-mono ${transaction.type === 'credit'
                            ? 'text-emerald-500 dark:text-emerald-400'
                            : 'text-blue-500 dark:text-blue-400'
                            }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                          {formatDate(transaction.timestamp)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right">
                          <button className="text-neutral-400 hover:text-blue-500 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-750 rounded transition-colors">
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 p-3 shadow-sm">
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                <span className="font-medium">About System Wallets:</span> Dedicated internal accounts for specific financial functions including Float (liquidity reserves), Commissions (platform fees), Operations (day-to-day platform costs), Escrow (holds funds during processing), Reserve (emergency funds), Tax (tax obligations), and Promotional (marketing initiatives).
              </p>
            </div>
          </div>
        </div>
      </div>

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
          <TopUpWallet
            selectedWallet={selectedWallet}
            setIsModalOpen={setIsModalOpen}
            formatCurrency={formatCurrency}
          />
        )}

        {modalType === 'transfer' && selectedWallet && (
          <TransferWallet
            selectedWallet={selectedWallet}
            setIsModalOpen={setIsModalOpen}
            systemWallets={systemWallets}
            formatCurrency={formatCurrency}
          />
        )}

        {modalType === 'history' && selectedWallet && (
          <WalletHistory
            selectedWallet={selectedWallet}
            transactions={transactions}
            setIsModalOpen={setIsModalOpen}
            formatCurrency={formatCurrency}
            getWalletIcon={getWalletIcon}
            getTransactionIcon={getTransactionIcon}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        )}

        {modalType === 'settings' && selectedWallet && (
          <WalletSettings
            selectedWallet={selectedWallet}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </Modal>
    </div>
  );
};

export default SystemWalletsPage;
