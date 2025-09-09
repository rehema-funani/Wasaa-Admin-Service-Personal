import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  DollarSign,
  Database,
  Target,
  ChevronDown,
  ChevronUp,
  Shield,
  Tag,
  Briefcase,
  CreditCard,
  Download,
  ExternalLink
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const SystemEscrowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [escrow, setEscrow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMilestones, setShowMilestones] = useState(true);
  const [showLedgerAccounts, setShowLedgerAccounts] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEscrowDetails();
    }
  }, [id]);

  const fetchEscrowDetails = async () => {
    try {
      setIsLoading(true);
      const response = await escrowService.getSystemEscrowById(id);
      setEscrow(response);
    } catch (error) {
      console.error('Error fetching system escrow details:', error);
      setError('Failed to load escrow details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: string | number, currency = 'KES') => {
    if (!amount) return formatCurrency(0, currency);
    const numericAmount = typeof amount === 'string' ? parseInt(amount) : amount;
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
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

  const getTimeRemaining = (deadline: string) => {
    if (!deadline) return 'No deadline';
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    
    if (diffTime <= 0) {
      return 'Expired';
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days left`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING_FUNDING': {
        color: 'bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
        dot: 'bg-blue-400 dark:bg-blue-600',
      },
      'FUNDED': {
        color: 'bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
        dot: 'bg-green-400 dark:bg-green-600',
      },
      'PARTIALLY_RELEASED': {
        color: 'bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-400 dark:bg-amber-600',
      },
      'RELEASED': {
        color: 'bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-400 dark:bg-emerald-600',
      },
      'DISPUTED': {
        color: 'bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
        dot: 'bg-red-400 dark:bg-red-600',
      },
      'CANCELLED': {
        color: 'bg-gray-100/80 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600',
        dot: 'bg-gray-400 dark:bg-gray-600',
      },
    };

    const config = statusConfig[status] || {
      color: 'bg-gray-100/80 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600',
      dot: 'bg-gray-400 dark:bg-gray-600',
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{status.replace(/_/g, ' ')}</span>
      </div>
    );
  };

  const getMilestoneStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': {
        color: 'bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
        dot: 'bg-blue-400 dark:bg-blue-600',
      },
      'COMPLETED': {
        color: 'bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
        dot: 'bg-green-400 dark:bg-green-600',
      },
      'RELEASED': {
        color: 'bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-400 dark:bg-emerald-600',
      },
      'CANCELLED': {
        color: 'bg-gray-100/80 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600',
        dot: 'bg-gray-400 dark:bg-gray-600',
      },
    };

    const config = statusConfig[status] || {
      color: 'bg-gray-100/80 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600',
      dot: 'bg-gray-400 dark:bg-gray-600',
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border ${config.color}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="text-xs font-medium">{status}</span>
      </div>
    );
  };

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

  if (error || !escrow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 dark:from-slate-900 dark:via-red-900/20 dark:to-orange-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || "Escrow Not Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't load the escrow information. Please try again or check if the escrow exists.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-500 dark:to-primary-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/admin/escrow/system-escrows")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to System Escrows
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
                onClick={() => navigate("/admin/escrow/system-escrows")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                  System Escrow Details
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    #{escrow.id.slice(0, 8)}...
                  </span>
                  {getStatusBadge(escrow.status)}
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {escrow.agreementType}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={fetchEscrowDetails}
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
                Export Data
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 w-fit">
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview' 
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => setActiveTab('overview')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Overview
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'milestones' 
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => setActiveTab('milestones')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Milestones
          </motion.button>
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'ledger' 
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => setActiveTab('ledger')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ledger Accounts
          </motion.button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Escrow Overview Card */}
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {escrow.purpose}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Escrow ID
                      </label>
                      <p className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-700 p-2 rounded border border-gray-200 dark:border-gray-600 mt-1">
                        {escrow.id}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Initiator
                        </label>
                        <p className="text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {escrow.initiator}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Counterparty
                        </label>
                        <p className="text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {escrow.counterparty}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Created
                        </label>
                        <p className="text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {formatDate(escrow.createdAt)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Deadline
                        </label>
                        <p className="text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {formatDate(escrow.deadline)} ({getTimeRemaining(escrow.deadline)})
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Buyer ID
                        </label>
                        <p className="font-mono text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                          {escrow.buyerId}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Seller ID
                        </label>
                        <p className="font-mono text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                          {escrow.sellerId}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Payment Method
                      </label>
                      <p className="text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        ID: {escrow.paymentMethodId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Financial Summary
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Total Amount
                        </label>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(escrow.amountMinor, escrow.currency)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Currency
                        </label>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {escrow.currency}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Funded</span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(escrow.fundedMinor, escrow.currency)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 dark:bg-green-600 rounded-full"
                            style={{ width: `${(parseInt(escrow.fundedMinor) / parseInt(escrow.amountMinor)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Released</span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(escrow.releasedMinor, escrow.currency)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 dark:bg-blue-600 rounded-full"
                            style={{ width: `${(parseInt(escrow.releasedMinor) / parseInt(escrow.amountMinor)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Refunded</span>
                          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                            {formatCurrency(escrow.refundedMinor || 0, escrow.currency)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 dark:bg-amber-600 rounded-full"
                            style={{ width: `${(parseInt(escrow.refundedMinor || 0) / parseInt(escrow.amountMinor)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">Milestones</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {escrow.milestones ? escrow.milestones.length : 0} total
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-center">
                        <motion.button
                          className="px-4 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('milestones')}
                        >
                          View Milestones
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">Ledger Accounts</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {escrow.ledgerAccounts ? escrow.ledgerAccounts.length : 0} accounts
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-center">
                        <motion.button
                          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('ledger')}
                        >
                          View Accounts
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  System Properties
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">System Escrow</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      escrow.system === "yes" 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}>
                      {escrow.system === "yes" ? "Yes" : "No"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Has Milestones</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      escrow.has_milestone 
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}>
                      {escrow.has_milestone ? "Yes" : "No"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Tenant ID</span>
                    <span className="font-mono text-xs text-gray-800 dark:text-gray-200">
                      {escrow.tenantId}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Agreement Type</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {escrow.agreementType}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {formatDate(escrow.updatedAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary-500" />
                  Fee Structure
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Pending Funding Fee", value: escrow.pendingFundingFeeMinor || "0" },
                    { label: "Funded Fee", value: escrow.fundedFeeMinor || "0" },
                    { label: "Partially Released Fee", value: escrow.partiallyReleasedFeeMinor || "0" },
                    { label: "Released Fee", value: escrow.releasedFeeMinor || "0" },
                    { label: "Disputed Fee", value: escrow.disputedFeeMinor || "0" },
                    { label: "Cancelled Fee", value: escrow.cancelledFeeMinor || "0" },
                  ].map((fee, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">{fee.label}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {formatCurrency(fee.value, escrow.currency)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Total Fees</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(
                          (parseInt(escrow.pendingFundingFeeMinor || "0") +
                           parseInt(escrow.fundedFeeMinor || "0") +
                           parseInt(escrow.partiallyReleasedFeeMinor || "0") +
                           parseInt(escrow.releasedFeeMinor || "0") +
                           parseInt(escrow.disputedFeeMinor || "0") +
                           parseInt(escrow.cancelledFeeMinor || "0")),
                          escrow.currency
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" />
                Milestones ({escrow.milestones ? escrow.milestones.length : 0})
              </h3>
              <motion.button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
                onClick={() => setShowMilestones(!showMilestones)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showMilestones ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Expand
                  </>
                )}
              </motion.button>
            </div>
            
            {showMilestones && (
              <div className="space-y-4">
                {!escrow.milestones || escrow.milestones.length === 0 ? (
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                    <Target className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      No Milestones Found
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      This escrow agreement does not have any milestones.
                    </p>
                  </div>
                ) : (
                  escrow.milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.idx}
                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="p-5">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getMilestoneStatusBadge(milestone.status)}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Order: {milestone.order + 1}
                              </span>
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {milestone.name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {formatCurrency(milestone.amountMinor, escrow.currency)}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {parseInt(milestone.releasedMinor) > 0 
                                ? `${formatCurrency(milestone.releasedMinor, escrow.currency)} released`
                                : 'Not released'
                              }
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {milestone.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">
                              Created
                            </label>
                            <p className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              {formatDate(milestone.createdAt)}
                            </p>
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">
                              Deadline
                            </label>
                            <p className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              {formatDate(milestone.deadline)}
                            </p>
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">
                              Completed Date
                            </label>
                            <p className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              {milestone.status === 'COMPLETED' || milestone.status === 'RELEASED' 
                                ? formatDate(milestone.completedDate)
                                : 'Not completed'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-5 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: <span className="font-mono text-xs">{milestone.idx.slice(0, 8)}...</span>
                        </div>
                        <div>
                          <div className="h-1.5 w-32 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                milestone.status === 'RELEASED' 
                                  ? 'bg-green-500 dark:bg-green-600' 
                                  : milestone.status === 'COMPLETED' 
                                  ? 'bg-blue-500 dark:bg-blue-600'
                                  : 'bg-gray-400 dark:bg-gray-500'
                              }`}
                              style={{ 
                                width: `${
                                  milestone.status === 'RELEASED' 
                                    ? '100%' 
                                    : milestone.status === 'COMPLETED' 
                                    ? '66%'
                                    : '33%'
                                }` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </motion.div>