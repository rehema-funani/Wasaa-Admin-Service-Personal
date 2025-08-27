import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Share2,
  BarChart2,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Target,
  Percent,
  Heart,
  MessageSquare,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link,
  MapPin,
  User,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  FileText,
  RefreshCw,
  Star,
  TrendingUp,
  PieChart,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { format, formatDistance } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_approval: {
      color:
        "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      icon: <Clock size={10} className="mr-1" />,
      label: "Pending Approval",
    },
    approved: {
      color:
        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      icon: <CheckCircle size={10} className="mr-1" />,
      label: "Approved",
    },
    active: {
      color:
        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      icon: <Zap size={10} className="mr-1" />,
      label: "Active",
    },
    rejected: {
      color: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      icon: <XCircle size={10} className="mr-1" />,
      label: "Rejected",
    },
    completed: {
      color: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      icon: <CheckCircle size={10} className="mr-1" />,
      label: "Completed",
    },
    paused: {
      color:
        "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
      icon: <AlertTriangle size={10} className="mr-1" />,
      label: "Paused",
    },
  };

  const config = statusConfig[status] || {
    color:
      "bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400",
    icon: <Clock size={10} className="mr-1" />,
    label: status.replace(/_/g, " "),
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm"
    whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <div
        className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    {subtitle && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      {tabs.map((tab: { id: string; label: string }) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? "border-[#FF6B81] text-[#FF6B81]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      try {
        const response = await fundraiserService.getCampaignById(id);
        setCampaign({
          ...response.data,
          progress: calculateProgress(
            response.raisedAmount,
            response.goalAmount
          ),
        });
      } catch (error) {
        console.error("Error loading campaign:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
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
    { id: "overview", label: "Overview" },
    { id: "updates", label: "Updates" },
    { id: "donations", label: "Donations" },
    { id: "comments", label: "Comments" },
    { id: "analytics", label: "Analytics" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw
            size={30}
            className="text-[#FF6B81] animate-spin mx-auto mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">
            Loading campaign details...
          </p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle size={40} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The campaign you're looking for doesn't exist or may have been
            removed.
          </p>
          <button
            onClick={() => navigate("/admin/fundraising/campaigns")}
            className="px-4 py-2 bg-[#FF6B81] text-white rounded-lg flex items-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full mx-auto max-w-[1600px]">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/fundraising/campaigns")}
            className="p-2 mr-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              Campaign Details
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              View and manage this fundraising campaign
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <motion.button
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Edit size={16} className="mr-2" />
            <span>Edit</span>
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Edit size={16} className="mr-2" />
            <span>Edit</span>
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            whileHover={{
              y: -2,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)",
            }}
            whileTap={{ y: 0 }}
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} className="mr-2" />
            <span>Delete</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div
          className="relative h-64 md:h-80 bg-gray-200 dark:bg-gray-700 bg-center bg-cover"
          style={{
            backgroundImage: `url(${
              campaign.images && campaign.images.length > 0
                ? campaign.images[0]
                : `https://placehold.co/800x400/4f46e5/ffffff/png?text=${encodeURIComponent(
                    campaign.title
                  )}`
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center mb-2">
              <StatusBadge status={campaign.status} />
              {campaign.featured && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                  <Star size={10} className="mr-1" />
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {campaign.title}
            </h1>
            <p className="text-gray-200 text-sm md:text-base line-clamp-2">
              {campaign.subtitle || campaign.description}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span className="font-medium flex items-center">
                    <Percent size={14} className="mr-1" />
                    {campaign.progress}%
                  </span>
                </div>
                <ProgressBar progress={campaign.progress} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Raised
                  </p>
                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                    $
                    {parseFloat(campaign.raisedAmount || 0).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 }
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Goal
                  </p>
                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                    $
                    {parseFloat(campaign.goalAmount || 0).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 }
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-1">
                    <Users size={16} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.donorsCount || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Donors
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-1">
                    <Heart size={16} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.likesCount || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Likes
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-1">
                    <MessageSquare size={16} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.commentsCount || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Comments
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-1">
                    <Eye size={16} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.viewsCount || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Views
                  </p>
                </div>
              </div>
            </div>

            <div className="md:w-1/3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Campaign Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar
                      size={14}
                      className="text-gray-500 dark:text-gray-400 mr-2"
                    />
                    <span className="text-gray-600 dark:text-gray-300">
                      Created:{" "}
                    </span>
                    <span className="ml-auto text-gray-900 dark:text-white">
                      {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock
                      size={14}
                      className="text-gray-500 dark:text-gray-400 mr-2"
                    />
                    <span className="text-gray-600 dark:text-gray-300">
                      Last updated:{" "}
                    </span>
                    <span className="ml-auto text-gray-900 dark:text-white">
                      {formatDistance(
                        new Date(campaign.updatedAt),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                  {campaign.endDate && (
                    <div className="flex items-center text-sm">
                      <Target
                        size={14}
                        className="text-gray-500 dark:text-gray-400 mr-2"
                      />
                      <span className="text-gray-600 dark:text-gray-300">
                        End date:{" "}
                      </span>
                      <span className="ml-auto text-gray-900 dark:text-white">
                        {format(new Date(campaign.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <MapPin
                      size={14}
                      className="text-gray-500 dark:text-gray-400 mr-2"
                    />
                    <span className="text-gray-600 dark:text-gray-300">
                      Category:{" "}
                    </span>
                    <span className="ml-auto text-gray-900 dark:text-white capitalize">
                      {campaign.category || "General"}
                    </span>
                  </div>
                  {campaign.organizer && (
                    <div className="flex items-center text-sm">
                      <User
                        size={14}
                        className="text-gray-500 dark:text-gray-400 mr-2"
                      />
                      <span className="text-gray-600 dark:text-gray-300">
                        Organizer:{" "}
                      </span>
                      <span className="ml-auto text-gray-900 dark:text-white">
                        {campaign.organizer.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Story
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {campaign.description || "No description provided."}
                  </p>

                  {campaign.story && (
                    <>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                        Our Story
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {campaign.story}
                      </p>
                    </>
                  )}
                </div>

                {/* Image gallery */}
                {campaign.images && campaign.images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {campaign.images.slice(0, 6).map((image, index) => (
                        <motion.div
                          key={index}
                          className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setSelectedImage(index);
                            setShowImageGallery(true);
                          }}
                        >
                          <img
                            src={image}
                            alt={`Campaign image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 5 && campaign.images.length > 6 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-medium">
                                +{campaign.images.length - 6} more
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Organizer
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <User
                        size={20}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {campaign.organizer?.name || "Unknown Organizer"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Campaign Organizer
                      </p>
                    </div>
                  </div>

                  {campaign.organizer && (
                    <div className="space-y-2 text-sm">
                      {campaign.organizer.email && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Mail size={14} className="mr-2" />
                          {campaign.organizer.email}
                        </div>
                      )}
                      {campaign.organizer.phone && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Phone size={14} className="mr-2" />
                          {campaign.organizer.phone}
                        </div>
                      )}
                      {campaign.organizer.website && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Globe size={14} className="mr-2" />
                          <a
                            href={campaign.organizer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FF6B81]"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex mt-4 space-x-2">
                    <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Share This Campaign
                </h2>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook size={16} />
                  </button>
                  <button className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    <Twitter size={16} />
                  </button>
                  <button className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                    <Instagram size={16} />
                  </button>
                  <button className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    <Linkedin size={16} />
                  </button>
                  <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Link size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Visits"
                value="1,243"
                icon={<Eye size={16} />}
                color="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                subtitle="+12% from last week"
              />
              <StatCard
                title="Conversion Rate"
                value="4.2%"
                icon={<TrendingUp size={16} />}
                color="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                subtitle="+2.1% from last week"
              />
              <StatCard
                title="Avg. Donation"
                value="$86.42"
                icon={<DollarSign size={16} />}
                color="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                subtitle="+$4.32 from last week"
              />
              <StatCard
                title="Social Shares"
                value="327"
                icon={<Share2 size={16} />}
                color="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                subtitle="+43 from last week"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Traffic Sources
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <PieChart size={40} className="mx-auto mb-2" />
                  <p>Traffic sources chart would be displayed here</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Donations Over Time
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <BarChart2 size={40} className="mx-auto mb-2" />
                    <p>Donations timeline chart would be displayed here</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Demographics
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <Users size={40} className="mx-auto mb-2" />
                    <p>Demographics chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== "overview" && activeTab !== "analytics" && (
          <motion.div
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <FileText
                size={40}
                className="text-gray-400 dark:text-gray-500 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label} content
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This section would show {activeTab} for the campaign.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Delete Campaign
                </h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#FF6B81] rounded-lg transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-4">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Confirm Deletion
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Are you sure you want to delete this campaign? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {campaign.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Status: {campaign.status.replace(/_/g, " ")}</span>
                    <span className="mx-2">•</span>
                    <span>
                      Raised: $
                      {parseFloat(campaign.raisedAmount || 0).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center"
                    onClick={handleDeleteCampaign}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Campaign
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImageGallery && campaign.images && campaign.images.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageGallery(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setShowImageGallery(false)}
            >
              <XCircle size={24} />
            </button>

            <button
              className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? campaign.images.length - 1 : prev - 1
                )
              }
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === campaign.images.length - 1 ? 0 : prev + 1
                )
              }
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              className="max-w-4xl w-full max-h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={campaign.images[selectedImage]}
                alt={`Campaign image ${selectedImage + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </motion.div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex space-x-2">
                {campaign.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === selectedImage ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignDetailsPage;
