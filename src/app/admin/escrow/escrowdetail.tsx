import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Clock,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  MessageSquare,
  RefreshCw,
  Wallet,
  Lock,
  Unlock,
  Plus,
  Timer,
  ArrowUpRight,
  DollarSign,
  Users,
  Database,
  Receipt,
  Building,
  Info,
  Eye,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const EscrowDetailPage: React.FC = () => {
  const [escrow, setEscrow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showActionModal, setShowActionModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEscrowDetails();
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
        color: "bg-purple-100/80 text-purple-700 border-purple-200",
        icon: ArrowUpRight,
        dot: "bg-purple-400",
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

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{status.replace("_", " ")}</span>
      </div>
    );
  };

  const getMilestoneStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100/80 text-yellow-700 border-yellow-200",
        dot: "bg-yellow-400",
      },
      IN_PROGRESS: {
        color: "bg-blue-100/80 text-blue-700 border-blue-200",
        dot: "bg-blue-400",
      },
      COMPLETED: {
        color: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-400",
      },
      DISPUTED: {
        color: "bg-red-100/80 text-red-700 border-red-200",
        dot: "bg-red-400",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="text-xs font-medium">{status.replace("_", " ")}</span>
      </div>
    );
  };

  const formatCurrency = (amountMinor: string | number, currency: string) => {
    const amount = parseInt(amountMinor.toString()) / 100;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
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
    const total = parseInt(escrow.amountMinor || "0");
    const released = parseInt(escrow.releasedMinor || "0");
    const refunded = parseInt(escrow.refundedMinor || "0");
    return total > 0 ? ((released + refunded) / total) * 100 : 0;
  };

  const calculateMilestoneProgress = (milestone: any) => {
    const total = parseInt(milestone.amountMinor || "0");
    const released = parseInt(milestone.releasedMinor || "0");
    return total > 0 ? (released / total) * 100 : 0;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "milestones", label: "Milestones", icon: Target },
    { id: "ledger", label: "Ledger Account", icon: BookOpen },
    { id: "parties", label: "Parties", icon: Users },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animation-delay-75" />
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate(-1)}
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
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                onClick={() => navigate(-1)}
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
                    #{escrow.id?.slice(0, 8) || "N/A"}
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
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            className="col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 text-white"
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
                    {formatCurrency(
                      escrow.amountMinor || "0",
                      escrow.currency || "KES"
                    )}
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
                  {formatCurrency(
                    escrow.fundedMinor || "0",
                    escrow.currency || "KES"
                  )}
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
                  {escrow.deadline
                    ? Math.max(
                        0,
                        Math.ceil(
                          (new Date(escrow.deadline).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )
                    : "No deadline"}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-sm text-orange-600 font-medium">
                    {escrow.deadline ? "Until deadline" : "Open-ended"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-2xl">
                <Timer className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="border-b border-gray-200/50">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Basic Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">
                          Escrow ID
                        </label>
                        <p className="font-mono text-sm text-gray-800 bg-white p-2 rounded border mt-1">
                          {escrow.id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Status</label>
                        <div className="mt-2">
                          {getStatusBadge(escrow.status)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Purpose</label>
                        <p className="text-sm text-gray-800 mt-1">
                          {escrow.purpose || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Payment Method
                        </label>
                        <p className="text-sm text-gray-800 mt-1">
                          Method ID: {escrow.paymentMethodId || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Tenant ID</label>
                      <p className="font-mono text-xs text-gray-600 mt-1">
                        {escrow.tenantId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parties Information */}
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Parties
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">
                          Initiator (Buyer)
                        </h5>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {escrow.initiator?.charAt(0) || "U"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {escrow.initiator || "Not specified"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {escrow.buyerId || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">
                          Counterparty (Seller)
                        </h5>
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {escrow.counterparty?.charAt(0) || "U"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {escrow.counterparty || "Not specified"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {escrow.sellerId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Created</span>
                      <span className="text-sm text-gray-800">
                        {formatDate(escrow.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Last Updated
                      </span>
                      <span className="text-sm text-gray-800">
                        {formatDate(escrow.updatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Deadline</span>
                      <span className="text-sm text-gray-800">
                        {formatDate(escrow.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Total Amount
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(
                          escrow.amountMinor || "0",
                          escrow.currency || "KES"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Funded</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(
                          escrow.fundedMinor || "0",
                          escrow.currency || "KES"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Released</span>
                      <span className="font-medium text-emerald-600">
                        {formatCurrency(
                          escrow.releasedMinor || "0",
                          escrow.currency || "KES"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Refunded</span>
                      <span className="font-medium text-orange-600">
                        {formatCurrency(
                          escrow.refundedMinor || "0",
                          escrow.currency || "KES"
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          Remaining
                        </span>
                        <span className="font-bold text-gray-800">
                          {formatCurrency(
                            (
                              parseInt(escrow.amountMinor || "0") -
                              parseInt(escrow.releasedMinor || "0") -
                              parseInt(escrow.refundedMinor || "0")
                            ).toString(),
                            escrow.currency || "KES"
                          )}
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
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">
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
                            className="bg-white/40 rounded-xl p-6 border border-white/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <span className="text-sm font-medium text-blue-600">
                                      {milestone.order || index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-800">
                                      {milestone.name ||
                                        `Milestone ${index + 1}`}
                                    </h5>
                                    <p className="text-xs text-gray-500">
                                      ID: {milestone.idx?.slice(0, 8) || "N/A"}
                                      ...
                                    </p>
                                  </div>
                                  {getMilestoneStatusBadge(milestone.status)}
                                </div>

                                {milestone.description && (
                                  <p className="text-sm text-gray-600 mb-3">
                                    {milestone.description}
                                  </p>
                                )}

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Amount
                                    </label>
                                    <p className="font-medium text-gray-800">
                                      {formatCurrency(
                                        milestone.amountMinor || "0",
                                        escrow.currency || "KES"
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Released
                                    </label>
                                    <p className="font-medium text-green-600">
                                      {formatCurrency(
                                        milestone.releasedMinor || "0",
                                        escrow.currency || "KES"
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {milestone.deadline && (
                                  <div className="mb-3">
                                    <label className="text-xs text-gray-500">
                                      Deadline
                                    </label>
                                    <p className="text-sm text-gray-700">
                                      {formatDate(milestone.deadline)}
                                    </p>
                                  </div>
                                )}

                                {milestone.completedDate && (
                                  <div className="mb-3">
                                    <label className="text-xs text-gray-500">
                                      Completed
                                    </label>
                                    <p className="text-sm text-gray-700">
                                      {formatDate(milestone.completedDate)}
                                    </p>
                                  </div>
                                )}

                                {/* Progress Bar */}
                                <div className="mt-4">
                                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <span>Progress</span>
                                    <span>
                                      {Math.round(
                                        calculateMilestoneProgress(milestone)
                                      )}
                                      %
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                      className={`h-3 rounded-full transition-all duration-500 ${
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
                                            : `${Math.max(
                                                calculateMilestoneProgress(
                                                  milestone
                                                ),
                                                5
                                              )}%`,
                                      }}
                                    />
                                  </div>
                                </div>

                                <p className="text-xs text-gray-500 mt-2">
                                  Created: {formatDate(milestone.createdAt)}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2 ml-4">
                                <motion.button
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </motion.button>
                                {milestone.status !== "COMPLETED" && (
                                  <motion.button
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Release Funds"
                                  >
                                    <Unlock className="w-4 h-4" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/40 rounded-xl border-2 border-dashed border-gray-300">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h5 className="text-lg font-medium text-gray-900 mb-2">
                        No milestones created yet
                      </h5>
                      <p className="text-gray-500 mb-4">
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
                  <div className="text-center py-12 bg-gray-50/50 rounded-xl">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg font-medium text-gray-900 mb-2">
                      This escrow doesn't use milestones
                    </h5>
                    <p className="text-gray-500">
                      This is a simple escrow without milestone-based releases
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "ledger" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {escrow.ledgerAccounts && escrow.ledgerAccounts.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        Ledger Accounts ({escrow.ledgerAccounts.length})
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {escrow.ledgerAccounts.map(
                        (account: any, index: number) => (
                          <motion.div
                            key={account.id}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-medium text-gray-800">
                                Account #{index + 1}
                              </h5>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  account.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {account.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Account ID
                                  </label>
                                  <p className="font-mono text-sm text-gray-800 bg-white p-2 rounded border mt-1">
                                    {account.id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Owner Type
                                  </label>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {account.ownerType || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Owner ID
                                  </label>
                                  <p className="font-mono text-xs text-gray-600 mt-1">
                                    {account.ownerId?.slice(0, 8)}...
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Account Kind
                                  </label>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {account.kind || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Currency
                                  </label>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {account.currency || "N/A"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Current Balance
                                  </label>
                                  <p className="text-lg font-bold text-gray-800 mt-1">
                                    {formatCurrency(
                                      account.balance || 0,
                                      account.currency || "KES"
                                    )}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm text-gray-500">
                                      Total Debit
                                    </label>
                                    <p className="text-sm font-medium text-red-600 mt-1">
                                      {formatCurrency(
                                        account.debit || 0,
                                        account.currency || "KES"
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-500">
                                      Total Credit
                                    </label>
                                    <p className="text-sm font-medium text-green-600 mt-1">
                                      {formatCurrency(
                                        account.credit || 0,
                                        account.currency || "KES"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Created
                                  </label>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {formatDate(account.createdAt)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-500">
                                    Escrow Agreement
                                  </label>
                                  <p className="font-mono text-xs text-gray-600 mt-1">
                                    {account.escrowAgreementId?.slice(0, 12)}...
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Account Summary */}
                            <div className="mt-6 pt-4 border-t border-blue-200">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  Net Position:
                                </span>
                                <span
                                  className={`font-medium ${
                                    (account.credit || 0) -
                                      (account.debit || 0) >=
                                    0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {formatCurrency(
                                    (account.credit || 0) -
                                      (account.debit || 0),
                                    account.currency || "KES"
                                  )}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                      <h5 className="font-medium text-gray-800 mb-4">
                        Accounts Summary
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {escrow.ledgerAccounts.length}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total Accounts
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {
                              escrow.ledgerAccounts.filter(
                                (acc: any) => acc.status === "ACTIVE"
                              ).length
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            Active Accounts
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">
                            {formatCurrency(
                              escrow.ledgerAccounts.reduce(
                                (sum: number, acc: any) =>
                                  sum + (acc.balance || 0),
                                0
                              ),
                              escrow.currency || "KES"
                            )}
                          </p>
                          <p className="text-sm text-gray-500">Total Balance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg font-medium text-gray-900 mb-2">
                      No Ledger Accounts
                    </h5>
                    <p className="text-gray-500">
                      No ledger account information available for this escrow
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "parties" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {escrow.parties && escrow.parties.length > 0 ? (
                  <div className="space-y-4">
                    {escrow.parties.map((party: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white/40 rounded-xl p-6 border border-white/30"
                      >
                        <h5 className="font-medium text-gray-800 mb-2">
                          Party {index + 1}
                        </h5>
                        <p className="text-gray-600">
                          Party information will be displayed here
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg font-medium text-gray-900 mb-2">
                      No Additional Parties
                    </h5>
                    <p className="text-gray-500">
                      Only the initiator and counterparty are involved in this
                      escrow
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "financial" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Holds */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Holds ({escrow.holds?.length || 0})
                  </h4>
                  {escrow.holds && escrow.holds.length > 0 ? (
                    <div className="space-y-3">
                      {escrow.holds.map((hold: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <p className="text-gray-800">Hold {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No holds on this escrow</p>
                  )}
                </div>

                {/* Fees */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Receipt className="w-5 h-5 mr-2" />
                    Fees ({escrow.fees?.length || 0})
                  </h4>
                  {escrow.fees && escrow.fees.length > 0 ? (
                    <div className="space-y-3">
                      {escrow.fees.map((fee: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <p className="text-gray-800">Fee {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No fees applied to this escrow
                    </p>
                  )}
                </div>

                {/* Tax Items */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Tax Items ({escrow.taxItems?.length || 0})
                  </h4>
                  {escrow.taxItems && escrow.taxItems.length > 0 ? (
                    <div className="space-y-3">
                      {escrow.taxItems.map((tax: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <p className="text-gray-800">Tax Item {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No tax items for this escrow
                    </p>
                  )}
                </div>

                {/* Payouts */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Payouts ({escrow.payouts?.length || 0})
                  </h4>
                  {escrow.payouts && escrow.payouts.length > 0 ? (
                    <div className="space-y-3">
                      {escrow.payouts.map((payout: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <p className="text-gray-800">Payout {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No payouts processed yet</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {escrow.disputes && escrow.disputes.length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Disputes ({escrow.disputes.length})
                      </h4>
                      <div className="space-y-3">
                        {escrow.disputes.map((dispute: any, index: number) => (
                          <motion.div
                            key={dispute.id}
                            className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                            whileHover={{ scale: 1.01 }}
                            onClick={() => navigate(`/disputes/${dispute.id}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {dispute.reason?.slice(0, 60)}...
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(dispute.createdAt)} • Priority:{" "}
                                  {dispute.priority}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    dispute.status === "RESOLVED"
                                      ? "bg-green-100 text-green-700"
                                      : dispute.status === "ESCALATED"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {dispute.status}
                                </span>
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg font-medium text-gray-900 mb-2">
                      No Activity Yet
                    </h5>
                    <p className="text-gray-500">
                      Activity history will appear here as the escrow progresses
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
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
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
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