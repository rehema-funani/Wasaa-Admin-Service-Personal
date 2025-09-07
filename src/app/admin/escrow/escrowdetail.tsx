import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Edit,
  Share2,
  MoreVertical,
  Shield,
  Clock,
  Users,
  DollarSign,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Activity,
  Eye,
  MessageSquare,
  Bell,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Lock,
  Unlock,
  Flag,
  Scale,
  Zap,
  Settings,
  Archive,
  Trash2,
  Copy,
  ExternalLink,
  BookOpen,
  BarChart3,
  PieChart,
  LineChart,
  Database,
  Filter,
  Search,
  Plus,
  Minus,
  AlertCircle,
  Info,
  Star,
  Tag,
  Globe,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Hash,
  Layers,
  Timer,
  Award,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { escrowService } from '../../../api/services/escrow';

const EscrowDetailPage: React.FC = () => {
  const [escrow, setEscrow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEscrowDetails();
      fetchLedgerData();
    }
  }, [id]);

  const fetchEscrowDetails = async () => {
    try {
      setIsLoading(true);
      const res = await escrowService.getEscrowAgreementById(id);
      setEscrow(res);
    } catch (error) {
      console.error("Error fetching escrow details:", error);
      setEscrow(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLedgerData = async () => {
    try {
      // Mock ledger data - replace with actual API call
      const mockLedger = [
        {
          id: '1',
          type: 'FUNDING',
          amount: '300',
          currency: 'KES',
          description: 'Initial funding',
          timestamp: '2025-09-07T13:13:42.015Z',
          status: 'COMPLETED',
          reference: 'PAY-001',
          party: 'Alvin Otieno'
        },
        {
          id: '2',
          type: 'MILESTONE_CREATED',
          amount: '300000',
          currency: 'KES',
          description: 'Milestone created',
          timestamp: '2025-09-07T13:13:42.045Z',
          status: 'PENDING',
          reference: 'MS-001',
          party: 'System'
        }
      ];
      setLedgerData(mockLedger);
    } catch (error) {
      console.error("Error fetching ledger data:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", icon: FileText },
      PENDING_FUNDING: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
      FUNDED: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: CheckCircle },
      PARTIALLY_RELEASED: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: ArrowUpRight },
      RELEASED: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle },
      DISPUTED: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: AlertTriangle },
      CANCELLED: { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", icon: XCircle },
      REFUNDED: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", icon: ArrowDownRight }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-2" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getMilestoneStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
      IN_PROGRESS: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: PlayCircle },
      COMPLETED: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle },
      DISPUTED: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatCurrency = (amountMinor: string, currency: string) => {
    const amount = parseInt(amountMinor) / 100;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateProgress = () => {
    if (!escrow) return 0;
    const total = parseInt(escrow.amountMinor);
    const released = parseInt(escrow.releasedMinor);
    const refunded = parseInt(escrow.refundedMinor);
    return total > 0 ? ((released + refunded) / total) * 100 : 0;
  };

  const getProgressColor = () => {
    if (!escrow) return 'bg-gray-400';
    switch (escrow.status) {
      case 'RELEASED': return 'bg-green-500';
      case 'FUNDED': return 'bg-blue-500';
      case 'PARTIALLY_RELEASED': return 'bg-purple-500';
      case 'DISPUTED': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'ledger', label: 'Ledger', icon: BookOpen },
    { id: 'parties', label: 'Parties', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const actionButtons = [
    { id: 'fund', label: 'Fund Escrow', icon: Wallet, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'release', label: 'Release Funds', icon: Unlock, color: 'bg-green-600 hover:bg-green-700' },
    { id: 'dispute', label: 'Raise Dispute', icon: AlertTriangle, color: 'bg-red-600 hover:bg-red-700' },
    { id: 'refund', label: 'Process Refund', icon: ArrowDownRight, color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'extend', label: 'Extend Deadline', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'cancel', label: 'Cancel Escrow', icon: XCircle, color: 'bg-gray-600 hover:bg-gray-700' }
  ];

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1800px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-500 dark:text-gray-400 ml-4">Loading escrow details...</p>
        </div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="p-6 max-w-[1800px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Escrow Not Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The escrow agreement you're looking for doesn't exist or has been removed.
          </p>
          <motion.button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => navigate('/escrows')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Escrows
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1800px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-4">
          <motion.button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => navigate('/escrows')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Escrow Agreement
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <Hash className="w-4 h-4 mr-1" />
              {escrow.id}
            </p>
            <div className="flex items-center space-x-4 mt-3">
              {getStatusBadge(escrow.status)}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Created {formatDate(escrow.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <motion.button
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            onClick={fetchEscrowDetails}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw size={16} className="mr-2" strokeWidth={2} />
            Refresh
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={2} />
            Export
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-lg"
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ y: 0 }}
          >
            <Edit size={16} className="mr-2" strokeWidth={2} />
            Edit
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm shadow-lg"
            onClick={() => setShowActionModal(true)}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)" }}
            whileTap={{ y: 0 }}
          >
            <Zap size={16} className="mr-2" strokeWidth={2} />
            Actions
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Amount</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(escrow.amountMinor, escrow.currency)}</p>
              <div className="flex items-center mt-2">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-sm">{escrow.currency}</span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Funded Amount</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(escrow.fundedMinor, escrow.currency)}
              </p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Secured</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Released Amount</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(escrow.releasedMinor, escrow.currency)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1 text-purple-500" />
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  {Math.round(calculateProgress())}% complete
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Unlock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Days Remaining</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {Math.ceil((new Date(escrow.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                <span className="text-sm text-orange-600 dark:text-orange-400">Until deadline</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
              <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Escrow Progress</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(calculateProgress())}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
          <motion.div 
            className={`h-4 rounded-full ${getProgressColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(calculateProgress(), 5)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>Funded: {formatCurrency(escrow.fundedMinor, escrow.currency)}</span>
          <span>Released: {formatCurrency(escrow.releasedMinor, escrow.currency)}</span>
          <span>Remaining: {formatCurrency((parseInt(escrow.amountMinor) - parseInt(escrow.releasedMinor) - parseInt(escrow.refundedMinor)).toString(), escrow.currency)}</span>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Basic Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Escrow ID</label>
                        <p className="font-mono text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-600 p-2 rounded border">
                          {escrow.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                        <div className="mt-1">
                          {getStatusBadge(escrow.status)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Purpose</label>
                        <p className="text-sm text-gray-800 dark:text-gray-100">{escrow.purpose}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Payment Method</label>
                        <p className="text-sm text-gray-800 dark:text-gray-100">Method ID: {escrow.paymentMethodId}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Tenant ID</label>
                      <p className="font-mono text-xs text-gray-600 dark:text-gray-300">{escrow.tenantId}</p>
                    </div>
                  </div>
                </div>

                {/* Parties Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Parties
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-600 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800 dark:text-gray-100">Initiator (Buyer)</h5>
                        <User className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{escrow.initiator}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {escrow.buyerId}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-600 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800 dark:text-gray-100">Counterparty (Seller)</h5>
                        <User className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{escrow.counterparty}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {escrow.sellerId}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {formatCurrency(escrow.amountMinor, escrow.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Funded</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {formatCurrency(escrow.funde