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
  Activity,
  Eye,
  MessageSquare,
  RefreshCw,
  PlayCircle,
  Wallet,
  Lock,
  Unlock,
  Zap,
  Settings,
  Copy,
  ExternalLink,
  BookOpen,
  BarChart3,
  Filter,
  Plus,
  AlertCircle,
  Info,
  Hash,
  Timer,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const EscrowDetailPage: React.FC = () => {
  const [escrow, setEscrow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [showActionModal, setShowActionModal] = useState(false);
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
        color: "bg-slate-100/80 text-slate-700 border-slate-200",
        icon: FileText,
        dot: "bg-slate-400",
      },
      PENDING_FUNDING: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200",
        icon: Clock,
        dot: "bg-amber-400",
      },
      FUNDED: {
        color: "bg-blue-100/80 text-blue-700 border-blue-200",
        icon: CheckCircle,
        dot: "bg-blue-400",
      },
      PARTIALLY_RELEASED: {
        color: "bg-primary-100/80 text-primary-700 border-primary-200",
        icon: ArrowUpRight,
        dot: "bg-primary-400",
      },
      RELEASED: {
        color: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
        dot: "bg-emerald-400",
      },
      DISPUTED: {
        color: "bg-red-100/80 text-red-700 border-red-200",
        icon: AlertTriangle,
        dot: "bg-red-400",
      },
      CANCELLED: {
        color: "bg-gray-100/80 text-gray-700 border-gray-200",
        icon: XCircle,
        dot: "bg-gray-400",
      },
      REFUNDED: {
        color: "bg-orange-100/80 text-orange-700 border-orange-200",
        icon: ArrowUpRight,
        dot: "bg-orange-400",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className="text-sm font-medium">{status.replace("_", " ")}</span>
      </div>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary-400 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Escrow Not Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The escrow agreement you're looking for doesn't exist or has been
              removed.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/escrows")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Escrows
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                onClick={() => navigate("/escrows")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Escrow Agreement
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 font-mono">
                    #{escrow.id.slice(0, 8)}
                  </span>
                  {getStatusBadge(escrow.status)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 rounded-xl transition-colors"
                onClick={fetchEscrowDetails}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button
                className="p-2.5 hover:bg-white/50 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Download className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                onClick={() => setShowActionModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Actions
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-primary-700 p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Value
                  </p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(escrow.amountMinor, escrow.currency)}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-white h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(calculateProgress(), 5)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.round(calculateProgress())}%
                </span>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Funded</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(escrow.fundedMinor, escrow.currency)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-sm text-emerald-600 font-medium">
                    Secured
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <Lock className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Days Left</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.ceil(
                    (new Date(escrow.deadline).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-sm text-orange-600 font-medium">
                    Until deadline
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-2xl">
                <Timer className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Overview</h3>
                <motion.button
                  className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Purpose
                    </label>
                    <p className="text-gray-900 font-medium mt-1">
                      {escrow.purpose}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Created
                    </label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(escrow.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Deadline
                    </label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(escrow.deadline)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Initiator
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {escrow.initiator.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">
                        {escrow.initiator}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Counterparty
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {escrow.counterparty.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">
                        {escrow.counterparty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Milestones */}
            {escrow.has_milestone &&
              escrow.milestones &&
              escrow.milestones.length > 0 && (
                <motion.div
                  className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Milestones ({escrow.milestones.length})
                    </h3>
                    <motion.button
                      className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {escrow.milestones.map((milestone: any, index: number) => (
                      <motion.div
                        key={milestone.idx}
                        className="flex items-center gap-4 p-4 bg-white/40 rounded-xl border border-white/30"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {milestone.name || `Milestone ${index + 1}`}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                milestone.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : milestone.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {milestone.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatCurrency(
                              milestone.amountMinor,
                              escrow.currency
                            )}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                milestone.status === "COMPLETED"
                                  ? "bg-emerald-500"
                                  : milestone.status === "IN_PROGRESS"
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                              style={{
                                width:
                                  milestone.status === "COMPLETED"
                                    ? "100%"
                                    : milestone.status === "IN_PROGRESS"
                                    ? "50%"
                                    : "10%",
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Unlock className="w-4 h-4" />
                  Release Funds
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-3 p-3 bg-white/50 hover:bg-white/70 text-gray-700 rounded-xl font-medium border border-white/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-3 p-3 bg-white/50 hover:bg-white/70 text-gray-700 rounded-xl font-medium border border-white/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-4 h-4" />
                  View Documents
                </motion.button>
              </div>
            </motion.div>

            {/* Financial Breakdown */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Financial Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(escrow.amountMinor, escrow.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Funded</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(escrow.fundedMinor, escrow.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Released</span>
                  <span className="font-medium text-emerald-600">
                    {formatCurrency(escrow.releasedMinor, escrow.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Refunded</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(escrow.refundedMinor, escrow.currency)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Remaining</span>
                    <span className="font-bold text-gray-900">
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
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {ledgerData.slice(0, 3).map((entry, index) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {entry.type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowActionModal(false)}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setShowActionModal(false)}
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Unlock className="w-6 h-6" />
                <span className="text-sm font-medium">Release</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wallet className="w-6 h-6" />
                <span className="text-sm font-medium">Fund</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AlertTriangle className="w-6 h-6" />
                <span className="text-sm font-medium">Dispute</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm font-medium">Extend</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowUpRight className="w-6 h-6" />
                <span className="text-sm font-medium">Refund</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm font-medium">Message</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EscrowDetailPage;