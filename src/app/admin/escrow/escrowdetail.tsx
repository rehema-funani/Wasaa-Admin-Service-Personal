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
  const [activeTab, setActiveTab] = useState("overview");
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
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
          id: "1",
          type: "FUNDING",
          amount: "300",
          currency: "KES",
          description: "Initial funding",
          timestamp: "2025-09-07T13:13:42.015Z",
          status: "COMPLETED",
          reference: "PAY-001",
          party: "Alvin Otieno",
        },
        {
          id: "2",
          type: "MILESTONE_CREATED",
          amount: "300000",
          currency: "KES",
          description: "Milestone created",
          timestamp: "2025-09-07T13:13:42.045Z",
          status: "PENDING",
          reference: "MS-001",
          party: "System",
        },
      ];
      setLedgerData(mockLedger);
    } catch (error) {
      console.error("Error fetching ledger data:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: FileText,
      },
      PENDING_FUNDING: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      FUNDED: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: CheckCircle,
      },
      PARTIALLY_RELEASED: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: ArrowUpRight,
      },
      RELEASED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      DISPUTED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
      CANCELLED: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: XCircle,
      },
      REFUNDED: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: ArrowDownRight,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <IconComponent className="w-4 h-4 mr-2" />
        {status.replace("_", " ")}
      </span>
    );
  };

  const getMilestoneStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      IN_PROGRESS: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: PlayCircle,
      },
      COMPLETED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      DISPUTED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
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
    if (!escrow) return "bg-gray-400";
    switch (escrow.status) {
      case "RELEASED":
        return "bg-green-500";
      case "FUNDED":
        return "bg-blue-500";
      case "PARTIALLY_RELEASED":
        return "bg-purple-500";
      case "DISPUTED":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "milestones", label: "Milestones", icon: Target },
    { id: "ledger", label: "Ledger", icon: BookOpen },
    { id: "parties", label: "Parties", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const actionButtons = [
    {
      id: "fund",
      label: "Fund Escrow",
      icon: Wallet,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "release",
      label: "Release Funds",
      icon: Unlock,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "dispute",
      label: "Raise Dispute",
      icon: AlertTriangle,
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      id: "refund",
      label: "Process Refund",
      icon: ArrowDownRight,
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      id: "extend",
      label: "Extend Deadline",
      icon: Calendar,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      id: "cancel",
      label: "Cancel Escrow",
      icon: XCircle,
      color: "bg-gray-600 hover:bg-gray-700",
    },
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
          <p className="text-gray-500 dark:text-gray-400 ml-4">
            Loading escrow details...
          </p>
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
            The escrow agreement you're looking for doesn't exist or has been
            removed.
          </p>
          <motion.button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/escrows")}
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
            onClick={() => navigate("/escrows")}
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
            whileHover={{
              y: -2,
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ y: 0 }}
          >
            <Edit size={16} className="mr-2" strokeWidth={2} />
            Edit
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm shadow-lg"
            onClick={() => setShowActionModal(true)}
            whileHover={{
              y: -2,
              boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
            }}
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
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(escrow.amountMinor, escrow.currency)}
              </p>
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
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Funded Amount
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatCurrency(escrow.fundedMinor, escrow.currency)}
              </p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Secured
                </span>
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
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Released Amount
              </p>
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
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Days Remaining
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {Math.ceil(
                  (new Date(escrow.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </p>
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  Until deadline
                </span>
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
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Escrow Progress
          </h3>
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
          <span>
            Funded: {formatCurrency(escrow.fundedMinor, escrow.currency)}
          </span>
          <span>
            Released: {formatCurrency(escrow.releasedMinor, escrow.currency)}
          </span>
          <span>
            Remaining:{" "}
            {formatCurrency(
              (
                parseInt(escrow.amountMinor) -
                parseInt(escrow.releasedMinor) -
                parseInt(escrow.refundedMinor)
              ).toString(),
              escrow.currency
            )}
          </span>
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
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
          {activeTab === "overview" && (
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
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Escrow ID
                        </label>
                        <p className="font-mono text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-600 p-2 rounded border">
                          {escrow.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Status
                        </label>
                        <div className="mt-1">
                          {getStatusBadge(escrow.status)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Purpose
                        </label>
                        <p className="text-sm text-gray-800 dark:text-gray-100">
                          {escrow.purpose}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                          Payment Method
                        </label>
                        <p className="text-sm text-gray-800 dark:text-gray-100">
                          Method ID: {escrow.paymentMethodId}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">
                        Tenant ID
                      </label>
                      <p className="font-mono text-xs text-gray-600 dark:text-gray-300">
                        {escrow.tenantId}
                      </p>
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
                        <h5 className="font-medium text-gray-800 dark:text-gray-100">
                          Initiator (Buyer)
                        </h5>
                        <User className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {escrow.initiator}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: {escrow.buyerId}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-600 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800 dark:text-gray-100">
                          Counterparty (Seller)
                        </h5>
                        <User className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {escrow.counterparty}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: {escrow.sellerId}
                      </p>
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Total Amount
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {formatCurrency(escrow.amountMinor, escrow.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Funded
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {formatCurrency(escrow.fundedMinor, escrow.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Released
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(escrow.releasedMinor, escrow.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Refunded
                      </span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        {formatCurrency(escrow.refundedMinor, escrow.currency)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Remaining
                        </span>
                        <span className="font-bold text-gray-800 dark:text-gray-100">
                          {formatCurrency(
                            (
                              parseInt(escrow.amountMinor) -
                              parseInt(escrow.releasedMinor) -
                              parseInt(escrow.refundedMinor)
                            ).toString(),
                            escrow.currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Created
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        {formatDate(escrow.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last Updated
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        {formatDate(escrow.updatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Deadline
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">
                        {formatDate(escrow.deadline)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Days Remaining
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          Math.ceil(
                            (new Date(escrow.deadline).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) < 7
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {Math.ceil(
                          (new Date(escrow.deadline).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "milestones" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Milestones ({escrow.milestones?.length || 0})
                  </h4>
                  {escrow.has_milestone && (
                    <motion.button
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Milestone
                    </motion.button>
                  )}
                </div>

                {escrow.has_milestone ? (
                  escrow.milestones && escrow.milestones.length > 0 ? (
                    <div className="space-y-4">
                      {escrow.milestones.map(
                        (milestone: any, index: number) => (
                          <motion.div
                            key={milestone.idx}
                            className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-800 dark:text-gray-100">
                                      {milestone.name ||
                                        `Milestone ${index + 1}`}
                                    </h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      ID: {milestone.idx.slice(0, 8)}...
                                    </p>
                                  </div>
                                  {getMilestoneStatusBadge(milestone.status)}
                                </div>

                                {milestone.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    {milestone.description}
                                  </p>
                                )}

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400">
                                      Amount
                                    </label>
                                    <p className="font-medium text-gray-800 dark:text-gray-100">
                                      {formatCurrency(
                                        milestone.amountMinor,
                                        escrow.currency
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400">
                                      Released
                                    </label>
                                    <p className="font-medium text-green-600 dark:text-green-400">
                                      {formatCurrency(
                                        milestone.releasedMinor,
                                        escrow.currency
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      milestone.status === "COMPLETED"
                                        ? "bg-green-500"
                                        : milestone.status === "IN_PROGRESS"
                                        ? "bg-blue-500"
                                        : "bg-gray-400"
                                    }`}
                                    style={{
                                      width:
                                        milestone.status === "COMPLETED"
                                          ? "100%"
                                          : milestone.status === "IN_PROGRESS"
                                          ? "50%"
                                          : "0%",
                                    }}
                                  />
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  Created: {formatDate(milestone.createdAt)}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2 ml-4">
                                <motion.button
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </motion.button>
                                {milestone.status !== "COMPLETED" && (
                                  <motion.button
                                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Release Funds"
                                  >
                                    <Unlock className="w-4 h-4" />
                                  </motion.button>
                                )}
                                <motion.button
                                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="More Actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No milestones created yet
                      </h5>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Create milestones to break down the escrow into
                        manageable releases
                      </p>
                      <motion.button
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Milestone
                      </motion.button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      This escrow doesn't use milestones
                    </h5>
                    <p className="text-gray-500 dark:text-gray-400">
                      This is a simple escrow without milestone-based releases
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "ledger" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Transaction Ledger
                  </h4>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </motion.button>
                    <motion.button
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </motion.button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Transaction
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Party
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Reference
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {ledgerData.map((entry, index) => (
                          <motion.tr
                            key={entry.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-600"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {entry.type.replace("_", " ")}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {entry.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {formatCurrency(entry.amount, entry.currency)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  entry.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {entry.party}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(entry.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                              {entry.reference}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "parties" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Detailed Party Information
                </h5>
                <p className="text-gray-500 dark:text-gray-400">
                  Enhanced party details will be available soon
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Document Management
                </h5>
                <p className="text-gray-500 dark:text-gray-400">
                  Document uploads and management coming soon
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Activity Timeline
                </h5>
                <p className="text-gray-500 dark:text-gray-400">
                  Detailed activity logs will be displayed here
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Analytics Dashboard
                </h5>
                <p className="text-gray-500 dark:text-gray-400">
                  Performance analytics and insights coming soon
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Action Modal */}
      {showActionModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowActionModal(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Escrow Actions
              </h3>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setShowActionModal(false)}
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              {actionButtons.map((action) => {
                const IconComponent = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    className={`w-full flex items-center justify-center px-4 py-3 ${action.color} text-white rounded-lg font-medium transition-colors`}
                    onClick={() => {
                      setSelectedAction(action.id);
                      setShowActionModal(false);
                      // Handle action logic here
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {action.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EscrowDetailPage;