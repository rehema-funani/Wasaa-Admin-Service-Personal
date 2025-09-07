import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Flag,
  Scale,
  MessageSquare,
  FileText,
  Image,
  Activity,
  Shield,
  RefreshCw,
  Upload,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { escrowService } from '../../../api/services/escrow';

const DisputeDetailPage: React.FC = () => {
  const [dispute, setDispute] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDisputeDetails();
    }
  }, [id]);

  const fetchDisputeDetails = async () => {
    try {
      setIsLoading(true);
      const res = await escrowService.getDisputeById(id);
      setDispute(res);
    } catch (error) {
      console.error("Error fetching dispute details:", error);
      setDispute(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: {
        color: "bg-blue-100/80 text-blue-700 border-blue-200",
        dot: "bg-blue-400",
      },
      UNDER_REVIEW: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200",
        dot: "bg-amber-400",
      },
      PENDING_RESPONSE: {
        color: "bg-orange-100/80 text-orange-700 border-orange-200",
        dot: "bg-orange-400",
      },
      ESCALATED: {
        color: "bg-red-100/80 text-red-700 border-red-200",
        dot: "bg-red-400",
      },
      RESOLVED: {
        color: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-400",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{status.replace("_", " ")}</span>
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      HIGH: { color: "bg-red-100/80 text-red-700 border-red-200", icon: "🔥" },
      MEDIUM: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200",
        icon: "⚡",
      },
      LOW: {
        color: "bg-green-100/80 text-green-700 border-green-200",
        icon: "📝",
      },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig.MEDIUM;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="text-sm font-medium">{priority}</span>
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

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1048576).toFixed(1)} MB`;
  };

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-400 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Dispute Not Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The dispute you're looking for doesn't exist or has been removed.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/disputes")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Disputes
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                onClick={() => navigate("/disputes")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Dispute Resolution
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 font-mono">
                    #{dispute.id.slice(0, 8)}
                  </span>
                  {getStatusBadge(dispute.status)}
                  {getPriorityBadge(dispute.priority)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 rounded-xl transition-colors"
                onClick={fetchDisputeDetails}
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
                className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                onClick={() => setShowActionModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Resolve
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Alert Banner */}
        <motion.div
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Dispute Requires Attention
                </h2>
                <p className="text-red-100 mt-1">
                  Status: {dispute.status} • Priority: {dispute.priority} •
                  Raised {getTimeElapsed(dispute.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatCurrency(
                  dispute.escrow.amountMinor,
                  dispute.escrow.currency
                )}
              </p>
              <p className="text-red-100 text-sm">Disputed Amount</p>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dispute Overview */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-500" />
                  Dispute Details
                </h3>
                <motion.button
                  className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="bg-red-50/50 rounded-xl p-4 border border-red-100">
                  <h4 className="font-medium text-red-900 mb-2">
                    Dispute Reason
                  </h4>
                  <p className="text-red-800">{dispute.reason}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Raised By
                    </label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {dispute.escrow.initiator.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {dispute.escrow.initiator}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {dispute.raisedBy.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Escrow Agreement
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                        <span className="font-mono text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                          {dispute.escrowId.slice(0, 12)}...
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {dispute.escrow.purpose}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Created
                    </label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(dispute.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium">
                      Last Updated
                    </label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(dispute.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Evidence Section */}
            {dispute.evidence && dispute.evidence.length > 0 && (
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Evidence ({dispute.evidence.length})
                  </h3>
                  <motion.button
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dispute.evidence.map((evidence: any, index: number) => (
                    <motion.div
                      key={evidence.id}
                      className="flex items-center gap-4 p-4 bg-white/40 rounded-xl border border-white/30 hover:bg-white/60 transition-all duration-200 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          {evidence.contentType.startsWith("image/") ? (
                            <Image className="w-6 h-6 text-blue-600" />
                          ) : (
                            <FileText className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {evidence.objectKey.split("/").pop()}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(evidence.sizeBytes)} •{" "}
                          {evidence.contentType}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded {formatDate(evidence.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related Disputes */}
            {dispute.escrow.disputes && dispute.escrow.disputes.length > 1 && (
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Related Disputes ({dispute.escrow.disputes.length})
                </h3>

                <div className="space-y-3">
                  {dispute.escrow.disputes.map(
                    (relatedDispute: any, index: number) => (
                      <motion.div
                        key={relatedDispute.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                          relatedDispute.id === dispute.id
                            ? "bg-red-50 border-red-200"
                            : "bg-white/40 border-white/30 hover:bg-white/60"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              relatedDispute.status === "RESOLVED"
                                ? "bg-green-400"
                                : relatedDispute.status === "ESCALATED"
                                ? "bg-red-400"
                                : "bg-amber-400"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {relatedDispute.reason.slice(0, 50)}...
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(relatedDispute.createdAt)} •{" "}
                              {relatedDispute.status}
                            </p>
                          </div>
                        </div>
                        {relatedDispute.id === dispute.id && (
                          <div className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                            Current
                          </div>
                        )}
                      </motion.div>
                    )
                  )}
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
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResolutionModal(true)}
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve Dispute
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-4 h-4" />
                  Escalate to Admin
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-3 p-3 bg-white/50 hover:bg-white/70 text-gray-700 rounded-xl font-medium border border-white/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Parties
                </motion.button>
                <motion.button
                  className="w-full flex items-center gap-3 p-3 bg-white/50 hover:bg-white/70 text-gray-700 rounded-xl font-medium border border-white/30 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
                </motion.button>
              </div>
            </motion.div>

            {/* Escrow Summary */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Escrow Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(
                      dispute.escrow.amountMinor,
                      dispute.escrow.currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dispute.escrow.status === "DISPUTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {dispute.escrow.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Purpose</span>
                  <span className="text-gray-900 font-medium">
                    {dispute.escrow.purpose}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Deadline</span>
                  <span className="text-gray-900">
                    {formatDate(dispute.escrow.deadline)}
                  </span>
                </div>
                <motion.button
                  className="w-full mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/escrows/${dispute.escrowId}`)}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Escrow
                </motion.button>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <Flag className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Dispute Raised</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(dispute.createdAt)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {dispute.reason}
                    </p>
                  </div>
                </div>
                {dispute.evidence && dispute.evidence.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Evidence Submitted
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(dispute.evidence[0].createdAt)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {dispute.evidence.length} file(s) uploaded
                      </p>
                    </div>
                  </div>
                )}
                {dispute.status === "ESCALATED" && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                      <Zap className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Escalated</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(dispute.updatedAt)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Requires admin attention
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResolutionModal(false)}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Resolve Dispute
              </h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setShowResolutionModal(false)}
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Outcome
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select outcome...</option>
                  <option value="buyer_favor">Favor Buyer</option>
                  <option value="seller_favor">Favor Seller</option>
                  <option value="partial_refund">Partial Refund</option>
                  <option value="mediated_solution">Mediated Solution</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                  placeholder="Explain the resolution decision..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  onClick={() => setShowResolutionModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Resolve
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
              <h3 className="text-xl font-bold text-gray-900">
                Dispute Actions
              </h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setShowActionModal(false)}
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowActionModal(false);
                  setShowResolutionModal(true);
                }}
              >
                <CheckCircle className="w-6 h-6" />
                <span className="text-sm font-medium">Resolve</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-6 h-6" />
                <span className="text-sm font-medium">Escalate</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm font-medium">Message</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Clock className="w-6 h-6" />
                <span className="text-sm font-medium">Defer</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Scale className="w-6 h-6" />
                <span className="text-sm font-medium">Mediate</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">Report</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DisputeDetailPage;