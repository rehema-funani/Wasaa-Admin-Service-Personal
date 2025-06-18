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
  TimerReset,
  CircleEllipsis,
  Users,
  PencilRuler
} from 'lucide-react';
import { Modal } from '../../../../components/common/Modal';
import { SystemWallet, WalletTransaction } from '../../../../types/finance';
import { mockSystemWallets, mockTransactions } from '../../../../data/finance';
import TopUpWallet from '../../../../components/finance/TopUpWallet';
import TransferWallet from '../../../../components/finance/TransferWallet';
import WalletHistory from '../../../../components/finance/WalletHistory';
import WalletSettings from '../../../../components/finance/WalletSettings';
import financeService from '../../../../api/services/finance';

// Extended mock data for the new wallet types
const extendedMockSystemWallets = [
  {
    id: "wallet-1",
    name: "Platform Float Wallet",
    description: "Main liquidity pool for the platform operations",
    type: "FLOAT",
    accountNumber: "WASAA-FLOAT-001",
    balance: 1250000,
    monthlyVolume: 4500000,
    lastUpdated: "2025-06-17T10:30:45Z",
    status: "active"
  },
  {
    id: "wallet-2",
    name: "Commissions Wallet",
    description: "Collects platform fees and commissions from transactions",
    type: "COMMISSIONS",
    accountNumber: "WASAA-COMM-002",
    balance: 387500,
    monthlyVolume: 950000,
    lastUpdated: "2025-06-17T11:15:22Z",
    status: "active"
  },
  {
    id: "wallet-3",
    name: "Operations Wallet",
    description: "Funds for day-to-day platform operations and maintenance",
    type: "OPERATIONS",
    accountNumber: "WASAA-OPS-003",
    balance: 175000,
    monthlyVolume: 320000,
    lastUpdated: "2025-06-17T09:45:30Z",
    status: "active"
  },
  {
    id: "wallet-4",
    name: "Escrow Wallet",
    description: "Holds funds in escrow during transaction processing",
    type: "ESCROW",
    accountNumber: "WASAA-ESCROW-004",
    balance: 680000,
    monthlyVolume: 1750000,
    lastUpdated: "2025-06-17T14:20:15Z",
    status: "active"
  },
  {
    id: "wallet-5",
    name: "Reserve Wallet",
    description: "Emergency funds and financial reserves",
    type: "RESERVE",
    accountNumber: "WASAA-RESRV-005",
    balance: 500000,
    monthlyVolume: 100000,
    lastUpdated: "2025-06-16T16:55:10Z",
    status: "active"
  },
  {
    id: "wallet-6",
    name: "Tax Wallet",
    description: "Collects and manages tax obligations",
    type: "TAX",
    accountNumber: "WASAA-TAX-006",
    balance: 145000,
    monthlyVolume: 280000,
    lastUpdated: "2025-06-17T08:30:45Z",
    status: "active"
  },
  {
    id: "wallet-7",
    name: "Promotional Wallet",
    description: "Funds for marketing, cashbacks, and user rewards",
    type: "PROMOTIONAL",
    accountNumber: "WASAA-PROMO-007",
    balance: 85000,
    monthlyVolume: 250000,
    lastUpdated: "2025-06-17T13:10:25Z",
    status: "active"
  },
  {
    id: "wallet-8",
    name: "Settlement Wallet",
    description: "For merchant and partner settlements",
    type: "SETTLEMENT",
    accountNumber: "WASAA-SETL-008",
    balance: 325000,
    monthlyVolume: 875000,
    lastUpdated: "2025-06-17T11:40:35Z",
    status: "inactive"
  },
  {
    id: "wallet-9",
    name: "Liquidity Pool",
    description: "Additional liquidity for high-volume periods",
    type: "LIQUIDITY",
    accountNumber: "WASAA-LIQ-009",
    balance: 750000,
    monthlyVolume: 1200000,
    lastUpdated: "2025-06-16T15:25:50Z",
    status: "inactive"
  },
  {
    id: "wallet-10",
    name: "User Holding Wallet",
    description: "Temporary storage for user deposits awaiting processing",
    type: "USER_HOLDING",
    accountNumber: "WASAA-HOLD-010",
    balance: 230000,
    monthlyVolume: 950000,
    lastUpdated: "2025-06-17T12:05:15Z",
    status: "inactive"
  },
  {
    id: "wallet-11",
    name: "Special Projects Fund",
    description: "Custom wallet for special initiatives and projects",
    type: "CUSTOM",
    accountNumber: "WASAA-CUST-011",
    balance: 120000,
    monthlyVolume: 180000,
    lastUpdated: "2025-06-17T10:15:40Z",
    status: "inactive"
  }
];

const SystemWalletsPage: React.FC = () => {
  const [systemWallets, setSystemWallets] = useState<SystemWallet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<SystemWallet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'topup' | 'transfer' | 'history' | 'settings' | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    // Simulating API call
    const fetchSystemWallets = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be:
        const wallets = await financeService.getSystemWallets();

        // For now, using mock data with a timeout for loading simulation
        setTimeout(() => {
          setSystemWallets(extendedMockSystemWallets);
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
      wallet.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.type.toLowerCase().includes(searchQuery.toLowerCase());
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
        return 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800/30';
      case 'inactive':
        return 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border border-danger-200 dark:border-danger-800/30';
      case 'pending':
        return 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-800/30';
      case 'completed':
        return 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800/30';
      case 'failed':
        return 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border border-danger-200 dark:border-danger-800/30';
      default:
        return 'bg-neutral-50 dark:bg-dark-active text-neutral-700 dark:text-neutral-400 border border-neutral-200 dark:border-dark-border';
    }
  };

  const getTransactionIcon = (type: 'credit' | 'debit') => {
    if (type === 'credit') {
      return <ArrowDownLeft className="w-4 h-4 text-success-600 dark:text-success-400" />;
    } else {
      return <ArrowUpRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />;
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'FLOAT':
        return <BanknoteIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />;
      case 'COMMISSIONS':
        return <BadgeDollarSign className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />;
      case 'OPERATIONS':
        return <Building2 className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />;
      case 'ESCROW':
        return <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'RESERVE':
        return <ShieldAlert className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      case 'TAX':
        return <Receipt className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'PROMOTIONAL':
        return <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'SETTLEMENT':
        return <CircleDollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'LIQUIDITY':
        return <PiggyBank className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'USER_HOLDING':
        return <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'CUSTOM':
        return <PencilRuler className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
      default:
        return <Wallet className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  const getWalletAccentColor = (type: string) => {
    switch (type) {
      case 'FLOAT':
        return 'border-l-primary-500 dark:border-l-primary-600';
      case 'COMMISSIONS':
        return 'border-l-secondary-500 dark:border-l-secondary-600';
      case 'OPERATIONS':
        return 'border-l-neutral-500 dark:border-l-neutral-600';
      case 'ESCROW':
        return 'border-l-indigo-500 dark:border-l-indigo-600';
      case 'RESERVE':
        return 'border-l-violet-500 dark:border-l-violet-600';
      case 'TAX':
        return 'border-l-rose-500 dark:border-l-rose-600';
      case 'PROMOTIONAL':
        return 'border-l-amber-500 dark:border-l-amber-600';
      case 'SETTLEMENT':
        return 'border-l-emerald-500 dark:border-l-emerald-600';
      case 'LIQUIDITY':
        return 'border-l-cyan-500 dark:border-l-cyan-600';
      case 'USER_HOLDING':
        return 'border-l-blue-500 dark:border-l-blue-600';
      case 'CUSTOM':
        return 'border-l-slate-500 dark:border-l-slate-600';
      default:
        return 'border-l-neutral-500 dark:border-l-neutral-600';
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

  return (
    <div className="min-h-screen bg-transparent font-finance">
      <div className="w-full mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
            <div>
              <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-100 tracking-tight flex items-center">
                <BanknoteIcon size={24} className="mr-2 text-primary-600 dark:text-primary-400" />
                System Wallets
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Manage system wallets for commissions, escrow, settlements, and transaction processing</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-dark-elevated border border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-neutral-300 rounded-lg shadow-sm dark:shadow-dark-sm hover:bg-neutral-50 dark:hover:bg-dark-hover transition-all text-sm"
                disabled={isLoading}
              >
                <RefreshCw size={16} />
                <span>Sync Balances</span>
              </button>

              <button
                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg shadow-button dark:shadow-dark-glow hover:bg-primary-700 dark:hover:bg-primary-600 transition-all text-sm"
              >
                <LayoutDashboard size={16} />
                <span>Banking Dashboard</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-5">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <input
                type="text"
                placeholder="Search wallets by name, description, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 w-full bg-white dark:bg-dark-input border border-neutral-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700/30 focus:border-primary-500 dark:focus:border-primary-700 text-neutral-700 dark:text-neutral-200 text-sm shadow-sm dark:shadow-dark-sm placeholder-neutral-400 dark:placeholder-neutral-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white dark:bg-dark-elevated border border-neutral-200 dark:border-dark-border rounded-lg p-0.5 shadow-sm dark:shadow-dark-sm">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${statusFilter === 'all'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                    : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${statusFilter === 'active'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                    : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${statusFilter === 'inactive'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                    : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                >
                  Inactive
                </button>
              </div>

              <button className="p-2 bg-white dark:bg-dark-elevated border border-neutral-200 dark:border-dark-border rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-dark-hover shadow-sm dark:shadow-dark-sm">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mb-5 flex items-center gap-2 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800/30 text-success-700 dark:text-success-400">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {/* System Wallets Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {isLoading ? (
            // Loading skeleton
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white dark:bg-dark-elevated rounded-lg shadow-card dark:shadow-dark-md border border-neutral-200 dark:border-dark-border border-l-[5px] border-l-primary-300 dark:border-l-primary-700/70 animate-pulse">
                <div className="p-4">
                  <div className="h-6 bg-neutral-200 dark:bg-dark-active rounded w-1/3 mb-3"></div>
                  <div className="h-8 bg-neutral-200 dark:bg-dark-active rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-5 bg-neutral-200 dark:bg-dark-active rounded w-1/4"></div>
                    <div className="h-5 bg-neutral-200 dark:bg-dark-active rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredWallets.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-dark-elevated rounded-lg shadow-card dark:shadow-dark-md border border-neutral-200 dark:border-dark-border p-8 text-center">
              <div className="flex justify-center mb-3">
                <Wallet size={48} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-1">No wallets found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
                extendedMockSystemWallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`bg-white dark:bg-dark-elevated rounded-lg shadow-card dark:shadow-dark-md border border-neutral-200 dark:border-dark-border border-l-[5px] ${getWalletAccentColor(wallet.type)} hover:shadow-md dark:hover:shadow-dark-lg transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-neutral-100 dark:bg-dark-active rounded-lg">
                        {getWalletIcon(wallet.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{wallet.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-md ${getStatusColor(wallet.status)} font-medium`}>
                            {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 font-mono">{wallet.accountNumber}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-dark-hover rounded-lg transition-colors text-neutral-500 dark:text-neutral-400">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Current Balance</p>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 font-finance">{formatCurrency(wallet.balance)}</h2>
                  </div>

                  <div className="flex items-start justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-dark-border">
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Last Updated</p>
                      <p className="text-sm dark:text-neutral-300">{formatDate(wallet.lastUpdated)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Monthly Volume</p>
                      <p className="text-sm font-medium dark:text-neutral-300">{formatCurrency(wallet.monthlyVolume)}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-dark-border flex gap-2">
                    <button
                      onClick={() => openTopUpModal(wallet)}
                      disabled={wallet.status === "inactive"}
                      className={`flex-1 text-xs py-2 px-3 rounded-lg ${wallet.status === "inactive"
                          ? "bg-neutral-100 dark:bg-dark-active text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                          : "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 font-medium transition-colors"
                        }`}
                    >
                      Top Up
                    </button>
                    <button
                      onClick={() => openTransferModal(wallet)}
                      disabled={wallet.status === "inactive"}
                      className={`flex-1 text-xs py-2 px-3 rounded-lg ${wallet.status === "inactive"
                          ? "bg-neutral-100 dark:bg-dark-active text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                          : "bg-neutral-100 dark:bg-dark-active text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-dark-hover font-medium transition-colors"
                        }`}
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => openHistoryModal(wallet)}
                      className="flex-1 text-xs py-2 px-3 rounded-lg bg-neutral-100 dark:bg-dark-active text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-dark-hover font-medium transition-colors"
                    >
                      History
                    </button>
                    <button
                      onClick={() => openSettingsModal(wallet)}
                      className="text-xs p-2 rounded-lg bg-neutral-100 dark:bg-dark-active text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-dark-hover transition-colors"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white dark:bg-dark-elevated rounded-lg shadow-card dark:shadow-dark-md border border-neutral-200 dark:border-dark-border p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 flex items-center">
              <BarChart3 size={20} className="mr-2 text-primary-600 dark:text-primary-400" />
              System Wallets Summary
            </h2>

            <div className="flex items-center bg-neutral-100 dark:bg-dark-active rounded-lg p-0.5 mt-3 md:mt-0">
              <button
                onClick={() => setSelectedTimeframe('24h')}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '24h'
                  ? 'bg-white dark:bg-dark-elevated shadow-sm dark:shadow-dark-sm text-neutral-800 dark:text-neutral-200 font-medium'
                  : 'text-neutral-500 dark:text-neutral-400'
                  }`}
              >
                24h
              </button>
              <button
                onClick={() => setSelectedTimeframe('7d')}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '7d'
                  ? 'bg-white dark:bg-dark-elevated shadow-sm dark:shadow-dark-sm text-neutral-800 dark:text-neutral-200 font-medium'
                  : 'text-neutral-500 dark:text-neutral-400'
                  }`}
              >
                7d
              </button>
              <button
                onClick={() => setSelectedTimeframe('30d')}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '30d'
                  ? 'bg-white dark:bg-dark-elevated shadow-sm dark:shadow-dark-sm text-neutral-800 dark:text-neutral-200 font-medium'
                  : 'text-neutral-500 dark:text-neutral-400'
                  }`}
              >
                30d
              </button>
              <button
                onClick={() => setSelectedTimeframe('90d')}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${selectedTimeframe === '90d'
                  ? 'bg-white dark:bg-dark-elevated shadow-sm dark:shadow-dark-sm text-neutral-800 dark:text-neutral-200 font-medium'
                  : 'text-neutral-500 dark:text-neutral-400'
                  }`}
              >
                90d
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-primary-50/50 dark:bg-primary-900/10 rounded-lg p-4 border border-primary-100 dark:border-primary-800/30 shadow-sm dark:shadow-dark-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Wallet size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Total Balance</h3>
              </div>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 font-finance">
                {formatCurrency(systemWallets.reduce((total, wallet) => total + wallet.balance, 0))}
              </p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                <span>+5.3% from previous period</span>
              </p>
            </div>

            <div className="bg-success-50/50 dark:bg-success-900/10 rounded-lg p-4 border border-success-100 dark:border-success-800/30 shadow-sm dark:shadow-dark-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <LineChart size={20} className="text-success-600 dark:text-success-400" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Transaction Volume</h3>
              </div>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 font-finance">
                {formatCurrency(systemWallets.reduce((total, wallet) => total + wallet.monthlyVolume, 0))}
              </p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                <span>+12.8% from previous period</span>
              </p>
            </div>

            <div className="bg-warning-50/50 dark:bg-warning-900/10 rounded-lg p-4 border border-warning-100 dark:border-warning-800/30 shadow-sm dark:shadow-dark-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                  <Clock size={20} className="text-warning-600 dark:text-warning-400" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Processing Time</h3>
              </div>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 font-finance">1.2s</p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                <span>-0.3s from previous period</span>
              </p>
            </div>

            <div className="bg-secondary-50/50 dark:bg-secondary-900/10 rounded-lg p-4 border border-secondary-100 dark:border-secondary-800/30 shadow-sm dark:shadow-dark-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                  <ShieldCheck size={20} className="text-secondary-600 dark:text-secondary-400" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">System Health</h3>
              </div>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 font-finance">99.98%</p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1 flex items-center">
                <ArrowUpRight size={12} className="mr-1" />
                <span>+0.06% from previous period</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-elevated rounded-lg shadow-card dark:shadow-dark-md border border-neutral-200 dark:border-dark-border p-6 mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 flex items-center">
              <ArrowDownUp size={20} className="mr-2 text-primary-600 dark:text-primary-400" />
              Recent Transactions
            </h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-dark-border">
              <thead className="bg-neutral-50 dark:bg-dark-active">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Transaction</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Wallet</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Amount</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-dark-border bg-white dark:bg-dark-elevated">
                {mockTransactions.slice(0, 5).map((transaction) => {
                  const wallet = systemWallets.find(w => w.id === transaction.walletId);
                  return (
                    <tr key={transaction.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-neutral-100 dark:bg-dark-active flex items-center justify-center mr-3">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200 mb-0.5">
                              {transaction.type === 'credit' ? 'Incoming' : 'Outgoing'}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-500 font-mono">{transaction.reference}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-neutral-300">{wallet?.name || 'Unknown Wallet'}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${transaction.type === 'credit'
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-primary-600 dark:text-primary-400'
                          }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-500">
                        {formatDate(transaction.timestamp)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
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

        <div className="mt-6 bg-primary-50/70 dark:bg-primary-900/10 rounded-lg p-4 border border-primary-100 dark:border-primary-800/30 shadow-sm dark:shadow-dark-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
              <Shield size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary-700 dark:text-primary-400">About System Wallets</h3>
              <p className="text-primary-600 dark:text-primary-400/90 text-xs mt-1 leading-relaxed">
                System wallets are dedicated internal accounts that serve specific financial functions:
                <br />• <strong>Float Wallet:</strong> Maintains liquidity reserves for user and merchant payouts
                <br />• <strong>Commissions Wallet:</strong> Collects and manages platform fees from all transactions
                <br />• <strong>Operations Wallet:</strong> Funds day-to-day platform operations and maintenance
                <br />• <strong>Escrow Wallet:</strong> Holds funds in escrow during transaction processing
                <br />• <strong>Reserve Wallet:</strong> Emergency funds and financial reserves
                <br />• <strong>Tax Wallet:</strong> Collects and manages tax obligations
                <br />• <strong>Promotional Wallet:</strong> Funds marketing initiatives, cashbacks, and user rewards
                <br />• <strong>Settlement Wallet:</strong> For merchant and partner settlements
                <br />• <strong>Liquidity Pool:</strong> Additional liquidity for high-volume periods
                <br />• <strong>User Holding Wallet:</strong> Temporary storage for user deposits awaiting processing
                <br />• <strong>Custom Wallet:</strong> Configurable wallet for special initiatives and projects
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
