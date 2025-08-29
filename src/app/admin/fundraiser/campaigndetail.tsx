import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Eye,
  Share2,
  BarChart2,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Target,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  User,
  Mail,
  Phone,
  Globe,
  RefreshCw,
  Star,
  TrendingUp,
  PieChart,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  ExternalLink,
  Award,
  Heart,
  Bookmark,
} from "lucide-react";
import { format, formatDistance } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";
import DonationsTab from "../../../components/fundraiser/DonationsTab";
import ApproveCampaignModal from "../../../components/fundraiser/ApproveCampaignModal";
import DeleteCampaignModal from "../../../components/fundraiser/DeleteCampaignModal";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_approval: {
      color:
        "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50",
      label: "Pending Approval",
      dot: "bg-amber-400",
    },
    approved: {
      color:
        "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/50",
      label: "Approved",
      dot: "bg-green-400",
    },
    active: {
      color:
        "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50",
      label: "Active",
      dot: "bg-blue-400",
    },
    rejected: {
      color:
        "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-800/50",
      label: "Rejected",
      dot: "bg-red-400",
    },
    completed: {
      color:
        "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50",
      label: "Completed",
      dot: "bg-purple-400",
    },
    paused: {
      color:
        "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 text-gray-700 dark:text-gray-400 border border-gray-200/50 dark:border-gray-800/50",
      label: "Paused",
      dot: "bg-gray-400",
    },
  };

  const config = statusConfig[status] || {
    color:
      "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 text-gray-700 dark:text-gray-400 border border-gray-200/50 dark:border-gray-800/50",
    label: status?.replace(/_/g, " ") || "Unknown",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} mr-2`}></span>
      {config.label}
    </span>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="relative w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out rounded-full"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
    </div>
  );
};

type StatCardProps = {
  title: any;
  value: any;
  subtitle?: any;
  icon: any;
  color: any;
  trend?: any;
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}: StatCardProps) => (
  <motion.div
    className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
    whileHover={{ y: -4 }}
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${color}`}
    />
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  </motion.div>
);

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [comments, setComments] = useState([]);
  const [donations, setDonations] = useState([]);
  const [approveModal, setApproveModal] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const [campaignRes, commentsRes, donationsRes] = await Promise.all([
          fundraiserService.getCampaignById(id),
          fundraiserService.getCampaignComments(id),
          fundraiserService.getCampaignDonations(id),
        ]);

        setCampaign({
          ...campaignRes.data,
          progress: calculateProgress(
            campaignRes.data.raisedAmount,
            campaignRes.data.goalAmount
          ),
        });

        setComments(commentsRes.data || []);
        setDonations(donationsRes.data);
      } catch (error) {
        console.error("Error loading campaign data:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  const calculateProgress = (raised: string, goal: string) => {
    const raisedNum = parseFloat(raised);
    const goalNum = parseFloat(goal);
    if (goalNum <= 0) return 0;
    return Math.min(Math.round((raisedNum / goalNum) * 100), 100);
  };

  const handleDeleteCampaign = async () => {
    try {
      await fundraiserService.deleteCampaign(id);
      toast.success("Campaign deleted successfully");
      navigate("/admin/fundraising/campaigns");
    } catch (error) {
      toast.error("Failed to delete campaign");
      console.error("Error deleting campaign:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "updates", label: "Updates", icon: RefreshCw },
    { id: "donations", label: "Donations", icon: Heart },
    { id: "comments", label: "Comments", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950 flex items-center justify-center">
        <div className="flex items-center bg-white dark:bg-gray-900 px-6 py-4 rounded-xl border border-gray-100 dark:border-gray-800">
          <RefreshCw size={24} className="text-blue-500 animate-spin mr-3" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Loading campaign details...
          </span>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800">
          <AlertTriangle size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The campaign you're looking for doesn't exist or may have been
            removed.
          </p>
          <button
            onClick={() => navigate("/admin/fundraising/campaigns")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:shadow-xl"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/fundraising/campaigns")}
                className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Campaign Details
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and review campaign information
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {campaign.status === "pending_approval" && (
                <button
                  onClick={() => setApproveModal(true)}
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:shadow-xl"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve Campaign
                </button>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-5 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/50 dark:border-gray-800/50 overflow-hidden mb-8"
        >
          <div
            className="relative h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                campaign.images?.[0] ||
                `https://placehold.co/800x400/3b82f6/ffffff/png?text=${encodeURIComponent(
                  campaign.title
                )}`
              })`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
            <div className="absolute top-4 left-6 right-6 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <StatusBadge status={campaign.status} />
                {campaign.featured && (
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-full border border-amber-200/50 dark:border-amber-800/50">
                    <Star size={12} className="mr-1.5" />
                    Featured
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors">
                  <Bookmark size={16} />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
            <div className="absolute bottom-4 left-6 right-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                {campaign.title}
              </h1>
              <p className="text-gray-200 text-sm max-w-2xl line-clamp-2">
                {campaign.subtitle || campaign.description}
              </p>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Progress Section */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Campaign Progress
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {campaign.progress}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        of goal
                      </span>
                    </div>
                  </div>
                  <ProgressBar progress={campaign.progress} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Amount Raised"
                    value={`Kes ${parseFloat(
                      campaign.raisedAmount || 0
                    ).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-gradient-to-r from-green-500 to-emerald-500"
                    trend="+12.3%"
                  />
                  <StatCard
                    title="Goal Amount"
                    value={`Kes ${parseFloat(
                      campaign.goalAmount || 0
                    ).toLocaleString()}`}
                    icon={Target}
                    color="bg-gradient-to-r from-blue-500 to-cyan-500"
                  />
                  <StatCard
                    title="Total Donors"
                    value={(donations?.length || 0).toString()}
                    icon={Users}
                    color="bg-gradient-to-r from-purple-500 to-pink-500"
                    trend="+3 today"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Award size={18} className="text-blue-500 mr-2" />
                  Campaign Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-3 text-blue-500" />
                      Created
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock size={16} className="mr-3 text-blue-500" />
                      Updated
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDistance(
                        new Date(campaign.updatedAt),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>

                  {campaign.endDate && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Target size={16} className="mr-3 text-blue-500" />
                        End date
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {format(new Date(campaign.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-3 text-blue-500" />
                      Category
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {campaign.category || "General"}
                    </span>
                  </div>

                  {campaign.organizer && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <User size={16} className="mr-3 text-blue-500" />
                        Organizer
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {campaign.organizer.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/50 dark:border-gray-800/50 overflow-hidden">
          <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <nav className="flex space-x-1 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <MessageSquare size={20} className="text-blue-500 mr-3" />
                      Campaign Story
                    </h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                        {campaign.description || "No description provided."}
                      </p>
                      {campaign.story && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Detailed Story
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {campaign.story}
                          </p>
                        </div>
                      )}
                    </div>

                    {campaign.images && campaign.images.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Eye size={18} className="text-blue-500 mr-2" />
                          Gallery ({campaign.images.length} images)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {campaign.images.slice(0, 6).map((image, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                              onClick={() => {
                                setSelectedImage(index);
                                setShowImageGallery(true);
                              }}
                            >
                              <img
                                src={image}
                                alt={`Campaign image ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                              {index === 5 && campaign.images.length > 6 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                  <span className="text-white text-sm font-semibold">
                                    +{campaign.images.length - 6} more
                                  </span>
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Organizer Info */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-xl p-6 border border-gray-100/50 dark:border-gray-700/50">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <User size={18} className="text-blue-500 mr-2" />
                        Organizer
                      </h2>
                      <div className="flex items-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                          <User size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {campaign.organizer?.name || "Unknown Organizer"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Campaign Creator
                          </p>
                        </div>
                      </div>

                      {campaign.organizer && (
                        <div className="space-y-3 text-sm">
                          {campaign.organizer.email && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <Mail size={14} className="mr-3 text-blue-500" />
                              {campaign.organizer.email}
                            </div>
                          )}
                          {campaign.organizer.phone && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <Phone size={14} className="mr-3 text-blue-500" />
                              {campaign.organizer.phone}
                            </div>
                          )}
                          {campaign.organizer.website && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <Globe size={14} className="mr-3 text-blue-500" />
                              <a
                                href={campaign.organizer.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
                              >
                                Visit Website
                                <ExternalLink size={12} className="ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-3 mt-6">
                        <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:shadow-xl">
                          View Profile
                        </button>
                        <button className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Views"
                    value="1,243"
                    icon={Eye}
                    color="bg-gradient-to-r from-blue-500 to-cyan-500"
                    trend="+12%"
                    subtitle="This month"
                  />
                  <StatCard
                    title="Conversion Rate"
                    value="4.2%"
                    icon={TrendingUp}
                    color="bg-gradient-to-r from-green-500 to-emerald-500"
                    trend="+2.1%"
                    subtitle="Above average"
                  />
                  <StatCard
                    title="Avg. Donation"
                    value="Kes 86"
                    icon={DollarSign}
                    color="bg-gradient-to-r from-amber-500 to-orange-500"
                    trend="+Kes 4"
                    subtitle="Per donor"
                  />
                  <StatCard
                    title="Social Shares"
                    value="327"
                    icon={Share2}
                    color="bg-gradient-to-r from-purple-500 to-pink-500"
                    trend="+43"
                    subtitle="This week"
                  />
                </div>

                {/* Enhanced Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-xl p-8 border border-blue-100/50 dark:border-blue-800/20">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <BarChart2 size={18} className="text-blue-500 mr-2" />
                      Donations Over Time
                    </h3>
                    <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <BarChart2
                          size={40}
                          className="mx-auto mb-3 text-blue-400"
                        />
                        <p className="text-sm font-medium">
                          Chart visualization
                        </p>
                        <p className="text-xs">would appear here</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-8 border border-purple-100/50 dark:border-purple-800/20">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <PieChart size={18} className="text-purple-500 mr-2" />
                      Traffic Sources
                    </h3>
                    <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <PieChart
                          size={40}
                          className="mx-auto mb-3 text-purple-400"
                        />
                        <p className="text-sm font-medium">
                          Chart visualization
                        </p>
                        <p className="text-xs">would appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "donations" && (
              <DonationsTab
                campaignId={id}
                fundraiserService={fundraiserService}
              />
            )}

            {activeTab === "comments" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={32} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No Comments Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Comments and feedback from supporters will appear here once
                  people start engaging with the campaign.
                </p>
              </motion.div>
            )}

            {activeTab === "updates" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <RefreshCw size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No Updates Posted
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Campaign updates and progress reports will be displayed here
                  when the organizer shares them.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modals remain the same */}
      <AnimatePresence>
        {approveModal && (
          <ApproveCampaignModal
            onClose={() => setApproveModal(false)}
            onApproved={() => {
              setCampaign((prev) => ({ ...prev, status: "active" }));
              setApproveModal(false);
              toast.success("Campaign approved successfully");
            }}
            campaignTitle={campaign.title}
            id={id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteCampaignModal
            campaign={campaign}
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDeleteCampaign}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Image Gallery */}
      <AnimatePresence>
        {showImageGallery && campaign.images && campaign.images.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageGallery(false)}
          >
            <button
              className="absolute top-6 right-6 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
              onClick={() => setShowImageGallery(false)}
            >
              <XCircle size={28} />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? campaign.images.length - 1 : prev - 1
                )
              }
            >
              <ChevronLeft size={28} />
            </button>

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === campaign.images.length - 1 ? 0 : prev + 1
                )
              }
            >
              <ChevronRight size={28} />
            </button>

            <div
              className="max-w-5xl max-h-[85vh] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={campaign.images[selectedImage]}
                alt={`Campaign image ${selectedImage + 1}`}
                className="w-full h-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
              {campaign.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === selectedImage
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignDetailsPage;
