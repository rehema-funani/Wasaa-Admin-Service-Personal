import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Tag,
  ShoppingBag,
  CreditCard,
  Shield,
  FileText,
  Upload,
  ExternalLink,
  Eye,
  EyeOff,
  MessageSquare,
  BarChart2,
  TrendingUp,
  RefreshCw,
  Settings,
  Lock,
  Trash2,
  Users,
  Filter,
  Plus,
  ChevronRight,
} from "lucide-react";
import businessService from "../../../api/services/businessService";
import { Business } from "../../../types/business";
import { toast } from "react-hot-toast";
import UploadDocumentModal from "./UploadDocumentModal";

const BusinessDetailPage: React.FC = () => {
  const [business, setBusiness] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showActionModal, setShowActionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const location = useLocation();

  const apiStatusToDisplay: Record<string, string> = {
    ACTIVE: "Active",
    PENDING_VERIFICATION: "Pending Verification",
    INCOMPLETE: "Incomplete",
    SUSPENDED: "Suspended",
    ONBOARDING: "ONBOARDING",
  };

  useEffect(() => {
    // If business data is passed via navigation state, use it.
    // Otherwise, fetch it from the API (e.g., on page refresh).
    if (location.state?.business) {
      setBusiness(location.state.business);
      setIsLoading(false);
    } else if (id) {
      fetchBusinessDetails(id); 
    }
  }, [id, location.state]);

  const fetchBusinessDetails = async (businessId: string) => {
    setIsLoading(true);
    try {
      const apiBusiness = await businessService.getBusinessById(businessId);
      setBusiness({
        ...apiBusiness,
        status: apiStatusToDisplay[apiBusiness.status] || apiBusiness.status,
      });
    } catch (error) {
      console.error("Error fetching business details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load business details.";
      toast.error(errorMessage);
      setBusiness(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (business) {
      console.log(`Changing status from ${business.status} to ${newStatus}`);
      setBusiness({
        ...business,
        status: newStatus as Business["status"],
      });
    }
    setShowStatusModal(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: {
        color: "bg-green-100/80 text-green-700 border-green-200",
        dot: "bg-green-400",
      },
      "Pending Verification": {
        color: "bg-amber-100/80 text-amber-700 border-amber-200",
        dot: "bg-amber-400",
      },
      Suspended: {
        color: "bg-red-100/80 text-red-700 border-red-200",
        dot: "bg-red-400",
      },
      Incomplete: {
        color: "bg-gray-100/80 text-gray-700 border-gray-200",
        dot: "bg-gray-400",
      },
    };

    if (!status) {
      return null;
    }

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.Active;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm font-medium">{status}</span>
      </div>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      Enterprise: {
        color: "bg-purple-100/80 text-purple-700 border-purple-200",
        icon: "⚡",
      },
      SME: {
        color: "bg-blue-100/80 text-blue-700 border-blue-200",
        icon: "💼",
      },
      NGO: {
        color: "bg-amber-100/80 text-amber-700 border-amber-200",
        icon: "🤝",
      },
    };

    if (!tier) {
      return null;
    }

    const config =
      tierConfig[tier as keyof typeof tierConfig] || tierConfig.SME;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} backdrop-blur-sm`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="text-sm font-medium">{tier}</span>
      </div>
    );
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") {
      return "";
    }
    return name.trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const viewDocument = (document: any) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin animation-delay-75" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Business Not Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The business you're looking for doesn't exist or has been removed.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              onClick={() => navigate("/admin/business/all-businesses")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Businesses
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const ownerName = business.owner // Check for pre-formatted name from list page state
    ? business.owner
    : business.created_by // Fallback for direct fetch
    ? `${business.created_by.first_name || ""} ${business.created_by.last_name || ""}`.trim() || "Unnamed User"
    : "Admin/System";
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                onClick={() => navigate("/admin/business/all-businesses")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Business Details
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 font-mono">
                    #{business.id}
                  </span>
                  {getStatusBadge(business.status)}
                  {getTierBadge(business.tier || business.type)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="p-2.5 hover:bg-white/50 rounded-xl transition-colors"
                onClick={() => id && fetchBusinessDetails(id)}
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
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                onClick={() => setShowActionModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Manage
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-1 overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "products"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "transactions"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "documents"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "activity"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              Activity Log
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "settings"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Business Info Card */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  {business.logo ? (
                    <img
                      src={business.logo}
                      alt={business.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {getInitials(business.name)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {business.name}
                    </h2>
                    {business.kycStatus === "Verified" && (
                      <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 mt-1">
                    {business.description || "No description available."}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Category:</span>
                      <span className="text-gray-900 font-medium">
                        {business.category || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Region:</span>
                      <span className="text-gray-900 font-medium">
                        {business.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Joined:</span>
                      <span className="text-gray-900 font-medium">
                        {formatDate(business.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">KYC Status:</span>
                      <span
                        className={`font-medium ${
                          business.verification_status === "VERIFIED"
                            ? "text-green-600"
                            : business.verification_status === "PENDING"
                            ? "text-amber-600"
                            : "text-gray-600"
                        }`}
                      >
                        {business.verification_status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
                  <motion.button
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    onClick={() =>
                      navigate(`/admin/business/edit/${business.id}`)
                    }
                  >
                    <Edit className="w-4 h-4" />
                    Edit Business
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    onClick={() =>
                      navigate(`/admin/business/${business.id}/roles`)
                    }
                  >
                    <Settings className="w-4 h-4" />
                    Manage Roles
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    onClick={() =>
                      navigate(`/admin/business/profile/${business.id}`)
                    }
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium border border-gray-200 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowStatusModal(true)}
                  >
                    {business.status === "Active" ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-500 text-sm">Products</p>
                  <div className="p-2 rounded-lg bg-blue-50">
                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {business.productsCount || 0}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Total products/services
                </p>
              </motion.div>

              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-500 text-sm">Revenue</p>
                  <div className="p-2 rounded-lg bg-green-50">
                    <CreditCard className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(business.revenue || 0)}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Total revenue</p>
              </motion.div>

              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-500 text-sm">Orders</p>
                  <div className="p-2 rounded-lg bg-amber-50">
                    <FileText className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  N/A
                </h3>
                <p className="text-xs text-gray-500 mt-1">Total orders</p>
              </motion.div>

              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-500 text-sm">Transactions</p>
                  <div className="p-2 rounded-lg bg-purple-50">
                    <BarChart2 className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  N/A
                </h3>
                <p className="text-xs text-gray-500 mt-1">Total transactions</p>
              </motion.div>

              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-500 text-sm">Avg. Order</p>
                  <div className="p-2 rounded-lg bg-red-50">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  N/A
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Average order value
                </p>
              </motion.div>
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {business.email ? <a
                        href={`mailto:${business.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {business.email}
                      </a> : <span className="text-gray-500">Not provided</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {business.phone ? <a
                        href={`tel:${business.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {business.phone}
                      </a> : <span className="text-gray-500">Not provided</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Website</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      {business.website ? <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {business.website}
                      </a> : <span className="text-gray-500">Not provided</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Address</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {business.address || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Owner Information */}
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Owner Information
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {getInitials(ownerName)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ownerName}</p>
                    <p className="text-sm text-gray-500">
                      {/* Role is not in API response */}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {business.created_by?.email ? (
                      <a href={`mailto:${business.created_by.email}`} className="text-blue-600 hover:underline">
                        {business.created_by.email}
                      </a>
                    ) : (
                      <span className="text-gray-500">Email not available</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {business.created_by?.phone_number ? (
                      <a href={`tel:${business.created_by.phone_number}`} className="text-blue-600 hover:underline">
                        {business.created_by.phone_number}
                      </a>
                    ) : (
                      <span className="text-gray-500">Phone not available</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      Verification:
                      <span
                        className={`ml-1 ${ // Owner verification status not in API response
                          false
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        N/A
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <motion.button
                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      navigate(`/admin/business/edit/${business.id}`)
                    }
                  >
                    <Edit className="w-4 h-4" />
                    Edit Business
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message Business
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center gap-3 p-3 bg-white/50 hover:bg-white/70 text-gray-700 rounded-xl font-medium border border-white/30 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </motion.button>
                  {business.status === "Active" ? (
                    <motion.button
                      className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowStatusModal(true)}
                    >
                      <EyeOff className="w-4 h-4" />
                      Suspend Business
                    </motion.button>
                  ) : (
                    <motion.button
                      className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowStatusModal(true)}
                    >
                      <Eye className="w-4 h-4" />
                      Activate Business
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Recent Products and Transactions Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Products
                  </h3>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {/* This data is not available from the getBusinessById endpoint */}
                  <div className="text-center py-4 text-gray-500">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Product data is not available.</p>
                  </div>
                  {/* {business.products.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-white/40 rounded-xl hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                  ))} */}
                </div>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Transactions
                  </h3>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {/* This data is not available from the getBusinessById endpoint */}
                  <div className="text-center py-4 text-gray-500">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Transaction data is not available.</p>
                  </div>
                  {/* {business.transactions.slice(0, 3).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-white/40 rounded-xl hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === "Sale"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <CreditCard
                            className={`w-5 h-5 ${
                              transaction.type === "Sale"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.customer}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.type === "Sale"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "Sale" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                  ))} */}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Actions Header */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900">
                Products & Services ({business.productsCount || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
                <motion.button
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </motion.button>
              </div>
            </motion.div>

            {/* Products Table */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Inventory
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Sales
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/40 divide-y divide-gray-200">
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No products found for this business.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            {/* Actions Header */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900">
                Transactions History
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
                <motion.button
                  className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </motion.button>
              </div>
            </motion.div>

            {/* Transactions Table */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/40 divide-y divide-gray-200">
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No transactions found for this business.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            {/* Actions Header */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900">
                Business Documents
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(true)}
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </motion.button>
              </div>
            </motion.div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-full text-center py-10 text-gray-500 bg-white/60 backdrop-blur-xl rounded-2xl">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No documents have been uploaded for this business.</p>
              </div>

            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            {/* Actions Header */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900">Activity Log</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <Download className="w-4 h-4" />
                  Export Log
                </motion.button>
                <motion.button
                  className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </motion.button>
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="space-y-8">
                <div className="text-center py-10 text-gray-500">
                  <BarChart2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No activity has been logged for this business.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Status Section */}
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Business Status
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-gray-700 font-medium">Current Status</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Change the operational status of this business
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(business.status as string)}
                    <motion.button
                      className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowStatusModal(true)}
                    >
                      {business.status === "Active" ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Activate
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-gray-700 font-medium">
                      KYC Verification
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Verification status of business documents
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${ // TODO: Use correct status
                        business.verification_status === "VERIFIED"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {business.verification_status}
                    </span>
                    <motion.button
                      className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Shield className="w-4 h-4" />
                      Verify Documents
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-gray-700 font-medium">Business Tier</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Tier level and associated capabilities
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTierBadge(business.type)}
                    <motion.button
                      className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Edit className="w-4 h-4" />
                      Change Tier
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              className="bg-red-50/80 backdrop-blur-xl rounded-2xl p-6 border border-red-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-red-100">
                  <div>
                    <p className="text-red-700 font-medium">Suspend Business</p>
                    <p className="text-red-600/70 text-sm mt-1">
                      Temporarily suspend all business operations and
                      transactions
                    </p>
                  </div>
                  <motion.button
                    className="px-4 py-2 bg-white hover:bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-200 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowStatusModal(true)}
                    disabled={business.status === "Suspended"}
                  >
                    <EyeOff className="w-4 h-4" />
                    Suspend
                  </motion.button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-red-100">
                  <div>
                    <p className="text-red-700 font-medium">
                      Reset Credentials
                    </p>
                    <p className="text-red-600/70 text-sm mt-1">
                      Force password reset and invalidate current sessions
                    </p>
                  </div>
                  <motion.button
                    className="px-4 py-2 bg-white hover:bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-200 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Lock className="w-4 h-4" />
                    Reset
                  </motion.button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-red-700 font-medium">Delete Business</p>
                    <p className="text-red-600/70 text-sm mt-1">
                      Permanently delete this business and all associated data
                    </p>
                  </div>
                  <motion.button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowStatusModal(false)}
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
                {business.status === "Active"
                  ? "Suspend Business"
                  : "Activate Business"}
              </h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setShowStatusModal(false)}
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm">
                <p className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>
                    {business.status === "Active"
                      ? "Suspending this business will prevent them from making transactions, managing products, or accessing certain features."
                      : "Activating this business will restore full access to all platform features."}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for{" "}
                  {business.status === "Active" ? "Suspension" : "Activation"}
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder={`Explain why you're ${
                    business.status === "Active" ? "suspending" : "activating"
                  } this business...`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  onClick={() => setShowStatusModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={`flex-1 px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 ${
                    business.status === "Active"
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleStatusChange(
                      business.status === "Active" ? "Suspended" : "Active"
                    )
                  }
                >
                  {business.status === "Active" ? "Suspend" : "Activate"}
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
                Business Actions
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
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowActionModal(false);
                  navigate(`/admin/business/edit/${business.id}`);
                }}
              >
                <Edit className="w-6 h-6" />
                <span className="text-sm font-medium">Edit</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm font-medium">Message</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm font-medium">Verify</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-6 h-6" />
                <span className="text-sm font-medium">Settings</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">Report</span>
              </motion.button>
              {business.status === "Active" ? (
                <motion.button
                  className="flex flex-col items-center gap-2 p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowActionModal(false);
                    setShowStatusModal(true);
                  }}
                >
                  <EyeOff className="w-6 h-6" />
                  <span className="text-sm font-medium">Suspend</span>
                </motion.button>
              ) : (
                <motion.button
                  className="flex flex-col items-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowActionModal(false);
                    setShowStatusModal(true);
                  }}
                >
                  <Eye className="w-6 h-6" />
                  <span className="text-sm font-medium">Activate</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upload Document Modal */}
      {business?.id && (
        <UploadDocumentModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => id && fetchBusinessDetails(id)} // Refetch details on success
          businessId={business.id}
        />
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDocumentViewer(false)}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 max-w-4xl w-full h-4/5 border border-white/20 flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedDocument.name}
              </h3>
              <div className="flex items-center gap-2">
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </motion.button>
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDocumentViewer(false)}
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl flex-1 flex items-center justify-center">
              {/* Document preview would go here - using placeholder */}
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Document preview not available</p>
                <p className="text-gray-400 text-sm mt-2">
                  Status: {selectedDocument.status}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Uploaded on {formatDate(selectedDocument.dateUploaded)} •{" "}
                  {selectedDocument.fileSize}
                </p>
              </div>
              <div>
                {selectedDocument.status !== "Verified" ? (
                  <motion.button
                    className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify Document
                  </motion.button>
                ) : (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BusinessDetailPage;
