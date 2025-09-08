import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Database,
  RefreshCw,
  Download,
  Activity,
  Wallet,
  Shield,
  CreditCard,
  Calendar,
  Users,
  DollarSign,
  Briefcase,
  Clock,
  Zap,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const LedgerAccountDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entriesFilter, setEntriesFilter] = useState('all'); // 'all', 'debit', 'credit'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  useEffect(() => {
    if (id) {
      fetchAccountDetails();
    }
  }, [id]);

  const fetchAccountDetails = async () => {
    try {
      setIsLoading(true);
      const response = await escrowService.getLedgerAccountById(id);
      setAccount(response);
    } catch (error) {
      console.error('Error fetching ledger account details:', error);
      setError('Failed to load account details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: any) => {
    if (dateString && typeof dateString === 'object' && Object.keys(dateString).length === 0) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A'; 
      
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Filter and sort entries
  const filteredEntries = account?.entries 
    ? account.entries
        .filter(entry => {
          if (entriesFilter === 'all') return true;
          return entry.direction === entriesFilter.toUpperCase();
        })
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        })
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 dark:border-r-purple-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || "Account Not Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't load the account information. Please try again or check if the account exists.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/admin/escrow/ledger-accounts")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Accounts
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/escrow/ledger-accounts")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                  Ledger Account Details
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {account.id.slice(0, 12)}...
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      account.status === 'ACTIVE'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${account.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} mr-1`}></div>
                    {account.status}
                  </span>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {account.kind}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchAccountDetails}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 inline-block mr-2" />
                Export Transactions
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Account Overview Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Account Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {account.kind} account in {account.currency}
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Current Balance</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                  {formatCurrency(account.balance || 0, account.currency)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-50 dark:border-blue-900/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Owner</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{account.ownerType}</p>
                </div>
              </div>
              <p className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-700 p-2 rounded border border-gray-200 dark:border-gray-600 truncate">
                {account.ownerId}
              </p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-50 dark:border-blue-900/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Financial Position</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Debit</p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(account.debit || 0, account.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Credit</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(account.credit || 0, account.currency)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-50 dark:border-blue-900/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</h3>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {formatDate(account.createdAt)}
              </p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-50 dark:border-blue-900/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Escrow Agreement</h3>
              </div>
              <p className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-700 p-2 rounded border border-gray-200 dark:border-gray-600 truncate">
                {account.escrowAgreementId}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              Transaction History
              {account.entries && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({account.entries.length} entries)
                </span>
              )}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span>
                <select
                  className="bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 px-3 py-1.5 text-sm"
                  value={entriesFilter}
                  onChange={(e) => setEntriesFilter(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="debit">Debit Only</option>
                  <option value="credit">Credit Only</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sort:</span>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  Date
                  {sortOrder === 'asc' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {!account.entries || account.entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Transactions
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                This account has no transaction entries yet.
              </p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <div className="space-y-0.5 p-0.5">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    className={`p-4 ${
                      index % 2 === 0 
                        ? 'bg-white/50 dark:bg-slate-800/50' 
                        : 'bg-gray-50/50 dark:bg-slate-700/50'
                    } hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          entry.direction === 'DEBIT' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        }`}>
                          {entry.direction === 'DEBIT' ? '-' : '+'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {entry.direction === 'DEBIT' ? 'Debit' : 'Credit'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        {entry.transaction && (
                          <>
                            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              {entry.transaction.txnType || 'TRANSFER'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Ref: {entry.transaction.reference || 'N/A'}
                            </p>
                            {entry.transaction.memo && (
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {entry.transaction.memo}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-medium ${
                          entry.direction === 'DEBIT' 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {entry.direction === 'DEBIT' ? '-' : '+'}
                          {formatCurrency(entry.amountMinor || 0, account.currency)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(entry.balance || 0, account.currency)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <button className="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Transaction Summary */}
          <div className="p-4 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between py-2 px-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Entries:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {account.entries ? account.entries.length : 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 px-4 bg-red-50/70 dark:bg-red-900/20 rounded-lg border border-red-