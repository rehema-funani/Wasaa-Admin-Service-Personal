import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  DollarSign,
  Users,
  Target,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Download,
  Lock,
  Unlock,
  X,
  Info,
  BarChart2,
  ExternalLink,
  ChevronRight,
  CreditCard,
  FileText,
  Briefcase
} from 'lucide-react';

// Dummy fundraiser data
const dummyFundraiser = {
  id: 'MA-001234',
  name: 'Save Nairobi Orphanage',
  type: 'FUNDRAISER',
  owner: 'NGO Kenya',
  ownerId: 'ORG-12345',
  ownerType: 'ORGANIZATION',
  balance: 3200000,
  goalAmount: 5000000,
  currency: 'KES',
  status: 'ACTIVE',
  riskLevel: 'MEDIUM',
  pendingWithdrawals: 2,
  donorCount: 1254,
  lastActivity: '2025-09-10T10:30:00Z',
  createdAt: '2025-09-01T08:15:00Z',
  description: 'Fundraising campaign for Nairobi Orphanage expansion project',
  startDate: '2025-09-01T00:00:00Z',
  endDate: '2025-12-31T23:59:59Z',
  kycVerified: true,
  amlFlagged: false
};

// Dummy donors data
const dummyDonors = [
  {
    id: 'SW-1001',
    name: 'John Doe',
    amount: 10000,
    currency: 'KES',
    status: 'ACTIVE',
    lastActivity: '2025-09-10T09:45:00Z',
    subwalletId: 'SW-1001'
  },
  {
    id: 'SW-1002',
    name: 'Mary Kimani',
    amount: 5000,
    currency: 'KES',
    status: 'ACTIVE',
    lastActivity: '2025-09-09T14:30:00Z',
    subwalletId: 'SW-1002'
  },
  {
    id: 'SW-1003',
    name: 'James Otieno',
    amount: 25000,
    currency: 'KES',
    status: 'ACTIVE',
    lastActivity: '2025-09-08T11:20:00Z',
    subwalletId: 'SW-1003'
  },
  {
    id: 'SW-1004',
    name: 'Grace Wanjiku',
    amount: 50000,
    currency: 'KES',
    status: 'ACTIVE',
    lastActivity: '2025-09-07T16:15:00Z',
    subwalletId: 'SW-1004'
  },
  {
    id: 'SW-1005',
    name: 'David Mwangi',
    amount: 100000,
    currency: 'KES',
    status: 'FROZEN',
    lastActivity: '2025-09-06T10:45:00Z',
    subwalletId: 'SW-1005'
  },
  {
    id: 'SW-1006',
    name: 'Sarah Njeri',
    amount: 15000,
    currency: 'KES',
    status: 'ACTIVE',
    lastActivity: '2025-09-05T13:30:00Z',
    subwalletId: 'SW-1006'
  }
];

// Dummy audit trail data
const dummyAuditTrail = [
  {
    id: 'AUD-001',
    action: 'Campaign Created',
    details: 'Fundraiser campaign initialized with KES 5,000,000 goal',
    timestamp: '2025-09-01T08:15:00Z',
    userId: 'USR-ADMIN-001',
    user: 'Admin Jane W.'
  },
  {
    id: 'AUD-002',
    action: 'Donor Contribution',
    details: 'Donor John Doe contributed KES 10,000',
    timestamp: '2025-09-10T09:45:00Z',
    userId: 'USR-SYS-001',
    user: 'System'
  },
  {
    id: 'AUD-003',
    action: 'Donor Contribution',
    details: 'Donor Mary Kimani contributed KES 5,000',
    timestamp: '2025-09-09T14:30:00Z',
    userId: 'USR-SYS-001',
    user: 'System'
  },
  {
    id: 'AUD-004',
    action: 'AML Alert',
    details: 'Campaign auto-flagged for AML threshold review',
    timestamp: '2025-09-08T08:30:00Z',
    userId: 'USR-SYS-001',
    user: 'System'
  },
  {
    id: 'AUD-005',
    action: 'AML Review',
    details: 'AML alert reviewed and cleared',
    timestamp: '2025-09-08T11:45:00Z',
    userId: 'USR-COMP-002',
    user: 'Compliance Officer Paul K.'
  }
];

const FundraiserEscrowDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [fundraiser, setFundraiser] = useState(null);
  const [donors, setDonors] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [error, setError] = useState(null);
  const [showDonors, setShowDonors] = useState(true);
  const [showAuditTrail, setShowAuditTrail] = useState(true);

  // For donors pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    // Simulate API fetch with delay
    setTimeout(() => {
      setFundraiser(dummyFundraiser);
      setDonors(dummyDonors);
      setAuditTrail(dummyAuditTrail);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const formatCurrency = (amount, currency = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        dot: "bg-green-500",
      },
      FROZEN: {
        color:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500",
      },
      CLOSED: {
        color:
          "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
        dot: "bg-gray-500",
      },
    };

    const config = statusConfig[status] || statusConfig["ACTIVE"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5 ${
            status === "ACTIVE" ? "animate-pulse" : ""
          }`}
        ></span>
        {status}
      </span>
    );
  };

  const getRiskBadge = (riskLevel) => {
    const riskConfig = {
      HIGH: {
        color:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        icon: <AlertTriangle className="w-3 h-3 mr-1" />,
      },
      MEDIUM: {
        color:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      LOW: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
    };

    const config = riskConfig[riskLevel] || riskConfig["LOW"];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.icon}
        {riskLevel}
      </span>
    );
  };

  const toggleFreezeFundraiser = async () => {
    if (!fundraiser) return;

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const newStatus = fundraiser.status === "FROZEN" ? "ACTIVE" : "FROZEN";

      // Update local state
      setFundraiser({
        ...fundraiser,
        status: newStatus,
      });

      // Add to audit trail
      const newAuditEntry = {
        id: `AUD-${(auditTrail.length + 1).toString().padStart(3, "0")}`,
        action:
          newStatus === "FROZEN" ? "Campaign Frozen" : "Campaign Unfrozen",
        details:
          newStatus === "FROZEN"
            ? "Campaign funds frozen by admin"
            : "Campaign funds unfrozen by admin",
        timestamp: new Date().toISOString(),
        userId: "USR-ADMIN-001",
        user: "Admin User",
      };

      setAuditTrail([newAuditEntry, ...auditTrail]);
      setIsLoading(false);
    }, 500);
  };

  const closeFundraiser = async () => {
    if (!fundraiser || fundraiser.status === "CLOSED") return;

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // Update local state
      setFundraiser({
        ...fundraiser,
        status: "CLOSED",
      });

      // Add to audit trail
      const newAuditEntry = {
        id: `AUD-${(auditTrail.length + 1).toString().padStart(3, "0")}`,
        action: "Campaign Closed",
        details: "Campaign permanently closed by admin",
        timestamp: new Date().toISOString(),
        userId: "USR-ADMIN-001",
        user: "Admin User",
      };

      setAuditTrail([newAuditEntry, ...auditTrail]);
      setIsLoading(false);
    }, 500);
  };

  const approveDistribution = async () => {
    if (!fundraiser) return;

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // Add to audit trail
      const newAuditEntry = {
        id: `AUD-${(auditTrail.length + 1).toString().padStart(3, "0")}`,
        action: "Distribution Approved",
        details: "Funds distribution approved to campaign owner",
        timestamp: new Date().toISOString(),
        userId: "USR-ADMIN-001",
        user: "Admin User",
      };

      setAuditTrail([newAuditEntry, ...auditTrail]);

      // Update fundraiser state
      setFundraiser({
        ...fundraiser,
        pendingWithdrawals: Math.max(0, fundraiser.pendingWithdrawals - 1),
      });

      setIsLoading(false);
    }, 500);
  };

  // For donors pagination
  const totalDonorPages =
    donors.length > 0 ? Math.ceil(donors.length / itemsPerPage) : 0;

  const paginatedDonors = donors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading && !fundraiser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 dark:border-purple-800 dark:border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-pink-400 dark:border-r-pink-500 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fundraiser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || "Fundraiser Not Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't load the fundraiser details. Please try again or check
              if the fundraiser exists.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/admin/escrow/master")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Master Accounts
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/escrow/master")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                  Fundraiser Escrow
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {fundraiser.id}
                  </span>
                  {getStatusBadge(fundraiser.status)}
                  {fundraiser.riskLevel && getRiskBadge(fundraiser.riskLevel)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                onClick={() => window.location.reload()}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              <motion.button
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                Export Details
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Campaign Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Campaign Info */}
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {fundraiser.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {fundraiser.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Owner
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      {fundraiser.ownerType === "USER" ? (
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                        {fundraiser.owner}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {fundraiser.ownerType} · ID: {fundraiser.ownerId}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Period
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {formatDate(fundraiser.startDate).split(",")[0]} -{" "}
                      {formatDate(fundraiser.endDate).split(",")[0]}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Compliance Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <Shield
                        className={`w-4 h-4 ${
                          fundraiser.kycVerified
                            ? "text-green-500 dark:text-green-400"
                            : "text-gray-400"
                        }`}
                      />
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        KYC {fundraiser.kycVerified ? "Verified" : "Pending"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          fundraiser.amlFlagged
                            ? "text-red-500 dark:text-red-400"
                            : "text-gray-400"
                        }`}
                      />
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        AML {fundraiser.amlFlagged ? "Flagged" : "Clear"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Activity
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {fundraiser.donorCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Donors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {fundraiser.pendingWithdrawals}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pending Withdrawals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Created / Last Activity
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {formatDate(fundraiser.createdAt).split(",")[0]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {formatDate(fundraiser.lastActivity).split(",")[0]}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <div className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      {getStatusBadge(fundraiser.status)}
                      {getRiskBadge(fundraiser.riskLevel)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Campaign Stats */}
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Campaign Goal
              </h2>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800/30 mb-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 bg-clip-text text-transparent">
                  {formatCurrency(fundraiser.balance, fundraiser.currency)} /{" "}
                  {formatCurrency(fundraiser.goalAmount, fundraiser.currency)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {((fundraiser.balance / fundraiser.goalAmount) * 100).toFixed(
                    1
                  )}
                  % of goal raised
                </p>
              </div>

              <div className="mt-4">
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{
                      width: `${
                        (fundraiser.balance / fundraiser.goalAmount) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50/60 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800/30">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Raised
                  </p>
                  <p className="text-lg font-medium text-purple-700 dark:text-purple-400">
                    {formatCurrency(fundraiser.balance, fundraiser.currency)}
                  </p>
                </div>

                <div className="bg-pink-50/60 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-100 dark:border-pink-800/30">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Remaining
                  </p>
                  <p className="text-lg font-medium text-pink-700 dark:text-pink-400">
                    {formatCurrency(
                      fundraiser.goalAmount - fundraiser.balance,
                      fundraiser.currency
                    )}
                  </p>
                </div>
              </div>

              {fundraiser.pendingWithdrawals > 0 && (
                <div className="bg-amber-50/60 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        {fundraiser.pendingWithdrawals} Pending Withdrawal
                        {fundraiser.pendingWithdrawals > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                        Requires admin approval
                      </p>
                    </div>
                    <motion.button
                      className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={approveDistribution}
                      disabled={isLoading}
                    >
                      Review
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Campaign Actions
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-2">
                  <motion.button
                    className={`py-2.5 px-4 rounded-lg text-white font-medium text-sm flex items-center justify-center gap-2 ${
                      fundraiser.status === "ACTIVE"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-md"
                        : "bg-gradient-to-r from-green-600 to-teal-600 hover:shadow-md"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={approveDistribution}
                    disabled={fundraiser.pendingWithdrawals === 0 || isLoading}
                  >
                    <DollarSign className="w-4 h-4" />
                    Approve Distribution
                  </motion.button>

                  <motion.button
                    className={`py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${
                      fundraiser.status === "FROZEN"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleFreezeFundraiser}
                    disabled={isLoading || fundraiser.status === "CLOSED"}
                  >
                    {fundraiser.status === "FROZEN" ? (
                      <>
                        <Unlock className="w-4 h-4" />
                        Unfreeze Campaign
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Freeze Campaign
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    className="py-2.5 px-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeFundraiser}
                    disabled={isLoading || fundraiser.status === "CLOSED"}
                  >
                    <X className="w-4 h-4" />
                    Close Campaign
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Donors Section */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Donors
              </h2>
            </div>

            <motion.button
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setShowDonors(!showDonors)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showDonors ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm">Hide</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm">Show</span>
                </>
              )}
            </motion.button>
          </div>

          {showDonors && (
            <>
              {donors.length === 0 ? (
                <div className="text-center py-8 bg-gray-50/50 dark:bg-slate-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No Donors Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    This campaign doesn't have any donors yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50/80 dark:bg-slate-700/80">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Donor ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Donor Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Amount Contributed
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Last Activity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedDonors.map((donor, index) => (
                          <tr
                            key={donor.id}
                            className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {donor.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {donor.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatCurrency(donor.amount, donor.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(donor.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(donor.lastActivity)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <motion.button
                                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  navigate(
                                    `/admin/escrow/subwallet/${donor.subwalletId}`
                                  )
                                }
                              >
                                View
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalDonorPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700 mt-4 rounded-b-xl">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Showing
                          <span className="mx-1 font-medium">
                            {(currentPage - 1) * itemsPerPage + 1}
                          </span>
                          to
                          <span className="mx-1 font-medium">
                            {Math.min(
                              currentPage * itemsPerPage,
                              donors.length
                            )}
                          </span>
                          of
                          <span className="mx-1 font-medium">
                            {donors.length}
                          </span>
                          donors
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>

                        <nav
                          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                          aria-label="Pagination"
                        >
                          <button
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0"
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <span className="sr-only">Previous</span>
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          <button
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0"
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalDonorPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalDonorPages}
                          >
                            <span className="sr-only">Next</span>
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </motion.div>

        {/* Audit Trail Section */}
        <motion.div
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-6 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Audit Trail
              </h2>
            </div>

            <motion.button
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAuditTrail ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm">Hide</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm">Show</span>
                </>
              )}
            </motion.button>
          </div>

          {showAuditTrail && (
            <>
              {auditTrail.length === 0 ? (
                <div className="text-center py-8 bg-gray-50/50 dark:bg-slate-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                  <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No Audit Trail Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    No activity has been recorded for this campaign yet.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-6 relative">
                    {auditTrail.map((entry, index) => (
                      <motion.div
                        key={entry.id || index}
                        className="ml-9 relative"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-purple-500 dark:bg-purple-400 z-10"></div>
                        <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {entry.action}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(entry.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {entry.details || "No additional details provided"}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">
                              By:{" "}
                              {entry.userId
                                ? `${entry.user} (${entry.userId})`
                                : entry.user}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FundraiserEscrowDetailPage;