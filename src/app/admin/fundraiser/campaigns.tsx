import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  ListFilter,
  Grid,
  Gift,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Flag,
  MoreHorizontal,
  BarChart2,
  Zap,
  Loader,
  Plus,
  Share2,
  Star,
  StarOff,
  DollarSign,
  Award,
  Menu,
} from "lucide-react";
import { format, formatDistanceToNow, subDays, addDays } from "date-fns";
import { toast } from "react-hot-toast";

// Dummy data generator for campaigns
const generateDummyCampaigns = () => {
  const categories = ["Medical", "Education", "Disaster Relief", "Community", "Arts", "Sports", "Business", "Technology"];
  const statusOptions = ["active", "completed", "draft", "pending_review", "rejected", "paused"];
  const campaignNames = [
    "Build a School in Rural Kenya",
    "Hurricane Relief Fund",
    "Cancer Treatment Support",
    "Community Garden Project",
    "Youth Basketball League",
    "Local Theater Renovation",
    "College Scholarship Fund",
    "Animal Shelter Expansion",
    "Clean Water Initiative",
    "Wheelchair Accessibility Project",
    "Emergency Food Drive",
    "Historical Museum Preservation",
    "Children's Hospital Equipment",
    "Renewable Energy Education",
    "Local Business Recovery",
    "Tech Education for Girls",
    "Elderly Care Program",
    "Wildlife Conservation",
    "Homeless Shelter Support",
    "Mental Health Awareness",
    "COVID-19 Relief Efforts",
    "Literacy Program Funding",
    "Art Therapy for Children",
    "Veterans Support Network",
  ];

  const locations = [
    "Nairobi, Kenya",
    "Mombasa, Kenya",
    "Kisumu, Kenya",
    "Nakuru, Kenya",
    "Eldoret, Kenya",
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Lagos, Nigeria",
    "Cairo, Egypt",
    "Accra, Ghana",
    "Kampala, Uganda",
    "Addis Ababa, Ethiopia",
    "Johannesburg, South Africa",
  ];
  
  const organizerNames = [
    "Jane Cooper", "Robert Fox", "Esther Howard", "Cameron Williamson", "Brooklyn Simmons",
    "John Smith", "Sarah Miller", "Michael Brown", "Emily Wilson", "David Kim",
    "Olivia Martinez", "James Williams", "Sophia Lee", "Amelia Thompson", "Benjamin Taylor",
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const goal = Math.round((Math.random() * 50000 + 5000) / 100) * 100;
    const raised = Math.round((Math.random() * goal) / 100) * 100;
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const startDate = subDays(new Date(), Math.floor(Math.random() * 90 + 10));
    
    // End date depends on status
    let endDate;
    if (status === 'completed') {
      endDate = subDays(new Date(), Math.floor(Math.random() * 10));
    } else if (status === 'active' || status === 'paused') {
      endDate = addDays(new Date(), Math.floor(Math.random() * 60 + 20));
    } else {
      endDate = addDays(new Date(), Math.floor(Math.random() * 90 + 30));
    }
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const donorsCount = Math.floor(Math.random() * 500) + 5;
    const viewsCount = Math.floor(Math.random() * 5000) + 100;
    const organizer = organizerNames[Math.floor(Math.random() * organizerNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      id: `camp-${i + 1}`,
      title: campaignNames[i % campaignNames.length],
      description: `This campaign aims to raise funds for ${campaignNames[i % campaignNames.length].toLowerCase()}. Support is needed to achieve our goal and make a positive impact.`,
      goal,
      raised,
      progress: Math.round((raised / goal) * 100),
      status,
      creator: {
        id: `user-${i + 10}`,
        name: organizer,
        email: `${organizer.toLowerCase().replace(' ', '.')}@example.com`,
        avatar: null,
      },
      category,
      donorsCount,
      viewsCount,
      startDate,
      endDate,
      lastActivity: subDays(new Date(), Math.floor(Math.random() * 7)),
      location,
      featured: Math.random() > 0.7,
      verificationStatus: Math.random() > 0.2 ? "verified" : "pending",
      socialShares: Math.floor(Math.random() * 200),
      createdAt: subDays(startDate, Math.floor(Math.random() * 10 + 3)),
      updatedAt: subDays(new Date(), Math.floor(Math.random() * 5)),
      commentsCount: Math.floor(Math.random() * 50),
      tags: getRandomTags(categories, 1, 3),
      image: getRandomImage(i),
      riskScore: Math.floor(Math.random() * 100),
      flagged: Math.random() > 0.9,
      payoutMethod: Math.random() > 0.5 ? "bank_transfer" : "mobile_money",
      withdrawnAmount: status === 'completed' ? raised * 0.9 : raised * Math.random() * 0.5,
      pendingReview: Math.random() > 0.8 && status !== 'rejected',
    };
  });
};

// Helper functions for dummy data
function getRandomTags(categories, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomImage(index) {
  // Simulate image URLs - in a real app, these would be actual image URLs
  const colorOptions = ['4f46e5', '0ea5e9', '10b981', 'f59e0b', 'ef4444', '8b5cf6', 'ec4899'];
  const color = colorOptions[index % colorOptions.length];
  return `https://placehold.co/800x400/${color}/ffffff/png?text=Campaign+${index + 1}`;
}

const AllCampaignsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    category: "",
    dateRange: "all",
    amountRange: "all",
    verificationStatus: "",
    featured: "",
    sortBy: "newest",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);

  // Campaign bulk actions
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);

  useEffect(() => {
    // Simulate API request
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const dummyCampaigns = generateDummyCampaigns();
        setCampaigns(dummyCampaigns);
        setFilteredCampaigns(dummyCampaigns);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      applyFilters(filters, campaigns);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = campaigns.filter(
      campaign => 
        campaign.title.toLowerCase().includes(lowercaseQuery) ||
        campaign.description.toLowerCase().includes(lowercaseQuery) ||
        campaign.creator.name.toLowerCase().includes(lowercaseQuery) ||
        campaign.location.toLowerCase().includes(lowercaseQuery) ||
        campaign.category.toLowerCase().includes(lowercaseQuery)
    );
    
    applyFilters(filters, filtered);
  };
  
  const applyFilters = (newFilters, items = campaigns) => {
    setFilters(newFilters);
    
    let filtered = [...items];
    
    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter(c => newFilters.status.includes(c.status));
    }
    
    if (newFilters.category) {
      filtered = filtered.filter(c => c.category === newFilters.category || c.tags.includes(newFilters.category));
    }
    
    if (newFilters.verificationStatus) {
      filtered = filtered.filter(c => c.verificationStatus === newFilters.verificationStatus);
    }
    
    if (newFilters.featured) {
      if (newFilters.featured === "featured") {
        filtered = filtered.filter(c => c.featured);
      } else if (newFilters.featured === "not_featured") {
        filtered = filtered.filter(c => !c.featured);
      }
    }
    
    if (newFilters.dateRange !== "all") {
      const daysMap = {
        "7days": 7,
        "30days": 30,
        "90days": 90
      };
      
      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
      filtered = filtered.filter(c => new Date(c.startDate) >= cutoffDate);
    }
    
    if (newFilters.amountRange !== "all") {
      const rangeMaps = {
        "small": { min: 0, max: 10000 },
        "medium": { min: 10000, max: 25000 },
        "large": { min: 25000, max: Infinity }
      };
      
      const range = rangeMaps[newFilters.amountRange];
      filtered = filtered.filter(c => c.goal >= range.min && c.goal < range.max);
    }
    
    // Apply sorting
    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "oldest":
          filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case "amount_high":
          filtered.sort((a, b) => b.raised - a.raised);
          break;
        case "amount_low":
          filtered.sort((a, b) => a.raised - b.raised);
          break;
        case "progress_high":
          filtered.sort((a, b) => b.progress - a.progress);
          break;
        case "end_date":
          filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
          break;
        case "donors_high":
          filtered.sort((a, b) => b.donorsCount - a.donorsCount);
          break;
        default:
          break;
      }
    }
    
    setFilteredCampaigns(filtered);
    setSelectedCampaigns([]);
  };
  
  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      status: [],
      category: "",
      dateRange: "all",
      amountRange: "all",
      verificationStatus: "",
      featured: "",
      sortBy: "newest",
    };
    
    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredCampaigns(campaigns);
  };
  
  const handleExport = () => {
    toast.success("Campaign data exported successfully");
  };
  
  const toggleCampaignSelection = (campaignId) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(filteredCampaigns.map(c => c.id));
    }
  };
  
  const handleDeleteCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteCampaign = () => {
    // Simulate API call
    setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    setFilteredCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    toast.success("Campaign deleted successfully");
    setShowDeleteModal(false);
  };
  
  const handleToggleFeatured = (campaign) => {
    setSelectedCampaign(campaign);
    setShowFeaturedModal(true);
  };
  
  const confirmToggleFeatured = () => {
    // Simulate API call
    const updatedCampaigns = campaigns.map(c => 
      c.id === selectedCampaign.id 
        ? { ...c, featured: !c.featured } 
        : c
    );
    
    setCampaigns(updatedCampaigns);
    setFilteredCampaigns(updatedCampaigns.filter(c => 
      filteredCampaigns.some(fc => fc.id === c.id)
    ));
    
    toast.success(`Campaign ${selectedCampaign.featured ? "removed from" : "added to"} featured campaigns`);
    setShowFeaturedModal(false);
  };
  
  const handleBulkAction = (action) => {
    if (selectedCampaigns.length === 0) {
      toast.error("No campaigns selected");
      return;
    }
    
    // Simulate bulk actions
    switch (action) {
      case "feature":
        toast.success(`${selectedCampaigns.length} campaigns featured`);
        setCampaigns(prev => prev.map(c => 
          selectedCampaigns.includes(c.id) ? { ...c, featured: true } : c
        ));
        break;
      case "unfeature":
        toast.success(`${selectedCampaigns.length} campaigns unfeatured`);
        setCampaigns(prev => prev.map(c => 
          selectedCampaigns.includes(c.id) ? { ...c, featured: false } : c
        ));
        break;
      case "verify":
        toast.success(`${selectedCampaigns.length} campaigns verified`);
        setCampaigns(prev => prev.map(c => 
          selectedCampaigns.includes(c.id) ? { ...c, verificationStatus: "verified" } : c
        ));
        break;
      case "delete":
        toast.success(`${selectedCampaigns.length} campaigns deleted`);
        setCampaigns(prev => prev.filter(c => !selectedCampaigns.includes(c.id)));
        setFilteredCampaigns(prev => prev.filter(c => !selectedCampaigns.includes(c.id)));
        break;
      case "export":
        toast.success(`${selectedCampaigns.length} campaigns exported`);
        break;
      default:
        break;
    }
    
    setSelectedCampaigns([]);
    setShowBulkActionMenu(false);
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            <Zap size={10} className="mr-1" />
            Active
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            <CheckCircle size={10} className="mr-1" />
            Completed
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400">
            <Clock size={10} className="mr-1" />
            Draft
          </span>
        );
      case "pending_review":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <Clock size={10} className="mr-1" />
            Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
            <XCircle size={10} className="mr-1" />
            Rejected
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
            <AlertTriangle size={10} className="mr-1" />
            Paused
          </span>
        );
      default:
        return null;
    }
  };
  
  // Statistics for quick summary
  const getActiveCampaignsCount = () => campaigns.filter(c => c.status === "active").length;
  const getPendingReviewCount = () => campaigns.filter(c => c.status === "pending_review").length;
  const getCompletedCampaignsCount = () => campaigns.filter(c => c.status === "completed").length;
  const getFeaturedCampaignsCount = () => campaigns.filter(c => c.featured).length;
  
  // Handle view campaign details
  const handleViewCampaign = (campaignId) => {
    toast.success(`Viewing campaign details: ${campaignId}`);
    // In a real app, this would navigate to campaign details page
  };
  
  // Handle edit campaign
  const handleEditCampaign = (campaignId) => {
    toast.success(`Editing campaign: ${campaignId}`);
    // In a real app, this would navigate to campaign edit page
  };

  return (
    <div className="p-6 w-full mx-auto max-w-[1600px]">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-light text-slate-900 dark:text-gray-100">
            All Campaigns
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Manage and monitor all fundraising campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            className="flex items-center px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
            whileTap={{ y: 0 }}
            onClick={() => toast.success("Creating new campaign")}
          >
            <Plus size={16} className="mr-2" />
            <span>Create Campaign</span>
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Active Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getActiveCampaignsCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Currently active fundraisers
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending Review
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getPendingReviewCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Awaiting approval
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Completed
            </p>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getCompletedCampaignsCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Successful campaigns
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Featured
            </p>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Award size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getFeaturedCampaignsCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Highlighted campaigns
          </p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns by title, creator, location..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg flex items-center text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </button>
            
            <div className="flex border border-slate-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 flex items-center ${
                  viewMode === "grid"
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600"
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 flex items-center ${
                  viewMode === "list"
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600"
                }`}
              >
                <ListFilter size={16} />
              </button>
            </div>
            
            {selectedCampaigns.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBulkActionMenu(!showBulkActionMenu)}
                  className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 rounded-lg flex items-center text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                >
                  <Menu size={16} className="mr-2" />
                  <span>Bulk Actions ({selectedCampaigns.length})</span>
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform ${
                      showBulkActionMenu ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                
                {showBulkActionMenu && (
                  <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 border border-slate-100 dark:border-gray-700">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400"
                      onClick={() => handleBulkAction("feature")}
                    >
                      <Star size={14} className="inline mr-2" />
                      Feature Selected
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400"
                      onClick={() => handleBulkAction("unfeature")}
                    >
                      <StarOff size={14} className="inline mr-2" />
                      Unfeature Selected
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400"
                      onClick={() => handleBulkAction("verify")}
                    >
                      <CheckCircle size={14} className="inline mr-2" />
                      Verify Selected
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400"
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download size={14} className="inline mr-2" />
                      Export Selected
                    </button>
                    <div className="border-t border-slate-100 dark:border-gray-700 my-1"></div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <Trash2 size={14} className="inline mr-2" />
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["active", "completed", "draft", "pending_review", "rejected", "paused"].map((status) => (
                        <label key={status} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 mr-1.5"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              const newStatus = e.target.checked
                                ? [...filters.status, status]
                                : filters.status.filter(s => s !== status);
                              handleFilterChange({
                                ...filters,
                                status: newStatus,
                              });
                            }}
                          />
                          <span className="text-sm text-slate-600 dark:text-gray-400 capitalize mr-2">
                            {status.replace('_', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">All Categories</option>
                      {["Medical", "Education", "Disaster Relief", "Community", "Arts", "Sports", "Business", "Technology"].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Goal Amount
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.amountRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          amountRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; $10,000)</option>
                      <option value="medium">Medium ($10,000 - $25,000)</option>
                      <option value="large">Large ({'>'} $25,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Verification
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.verificationStatus}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          verificationStatus: e.target.value,
                        })
                      }
                    >
                      <option value="">All</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Featured Status
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.featured}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          featured: e.target.value,
                        })
                      }
                    >
                      <option value="">All</option>
                      <option value="featured">Featured</option>
                      <option value="not_featured">Not Featured</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          sortBy: e.target.value,
                        })
                      }
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="amount_high">Highest Amount</option>
                      <option value="amount_low">Lowest Amount</option>
                      <option value="progress_high">Progress (High to Low)</option>
                      <option value="end_date">End Date (Soonest)</option>
                      <option value="donors_high">Most Donors</option>
                    </select>
                  </div>

                  <div className="lg:col-span-4 flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-slate-600 dark:text-gray-400 text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        className="flex items-center justify-between mb-4 text-sm text-slate-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <Gift size={14} className="mr-2" />
          Showing{" "}
          <span className="font-medium text-slate-700 dark:text-gray-300 mx-1">
            {filteredCampaigns.length}
          </span>
          {filteredCampaigns.length !== campaigns.length && (
            <>
              of{" "}
              <span className="font-medium text-slate-700 dark:text-gray-300 mx-1">
                {campaigns.length}
              </span>
            </>
          )}
          campaigns
          
          {selectedCampaigns.length > 0 && (
            <span className="ml-2">
              ({selectedCampaigns.length} selected)
            </span>
          )}
        </div>
        
        {filteredCampaigns.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="text-primary-600 dark:text-primary-400 hover:underline text-xs"
          >
            {selectedCampaigns.length === filteredCampaigns.length
              ? "Deselect All"
              : "Select All"}
          </button>
        )}
      </motion.div>

      {/* Campaign Grid/List View */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={30} className="text-primary-500 animate-spin mr-3" />
          <span className="text-slate-500 dark:text-gray-400">Loading campaigns...</span>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm py-12 px-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-gray-700 rounded-full mb-4">
            <Gift size={24} className="text-slate-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-2">
            No campaigns found
          </h3>
          <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      ) : viewMode === "grid" ? (
        // Grid View
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {filteredCampaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border ${
                selectedCampaigns.includes(campaign.id)
                  ? "border-primary-300 dark:border-primary-700 ring-2 ring-primary-100 dark:ring-primary-900"
                  : "border-slate-100 dark:border-gray-700"
              } shadow-sm overflow-hidden`}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div 
                  className="h-40 bg-slate-200 dark:bg-gray-700 bg-center bg-cover"
                  style={{ backgroundImage: `url(${campaign.image})` }}
                >
                  <div className="absolute top-0 left-0 p-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-primary-600 w-5 h-5"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={() => toggleCampaignSelection(campaign.id)}
                      />
                    </label>
                  </div>
                  
                  {campaign.featured && (
                    <div className="absolute top-0 right-0 p-2">
                      <span className="bg-white dark:bg-gray-800 text-amber-500 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <Award size={12} className="mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {campaign.flagged && (
                    <div className="absolute bottom-0 right-0 p-2">
                      <span className="bg-white dark:bg-gray-800 text-red-500 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <Flag size={12} className="mr-1" />
                        Flagged
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  {getStatusBadge(campaign.status)}
                  
                  <div className="text-xs text-slate-500 dark:text-gray-400 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {format(new Date(campaign.endDate), "MMM d, yyyy")}
                  </div>
                </div>
                
                <h3 className="font-medium text-slate-900 dark:text-white text-lg mb-2 line-clamp-2">
                  {campaign.title}
                </h3>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{campaign.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        campaign.status === "completed" ? "bg-blue-500" : "bg-primary-500"
                      }`}
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-gray-400">Raised</p>
                    <p className="font-medium text-slate-900 dark:text-white">${campaign.raised.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-gray-400">Goal</p>
                    <p className="font-medium text-slate-900 dark:text-white">${campaign.goal.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-gray-700 pt-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-medium text-sm mr-2">
                      {campaign.creator.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-xs">
                      <p className="text-slate-700 dark:text-gray-300">{campaign.creator.name}</p>
                      <p className="text-slate-500 dark:text-gray-400">{campaign.location}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    {selectedCampaign && selectedCampaign.id === campaign.id && (
                      <div className="absolute right-0 bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-100 dark:border-gray-700 py-1 w-48 z-10">
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                          onClick={() => {
                            setSelectedCampaign(null);
                            handleViewCampaign(campaign.id);
                          }}
                        >
                          <Eye size={14} className="mr-2" />
                          View Details
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                          onClick={() => {
                            setSelectedCampaign(null);
                            handleEditCampaign(campaign.id);
                          }}
                        >
                          <Edit size={14} className="mr-2" />
                          Edit Campaign
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                          onClick={() => {
                            setSelectedCampaign(null);
                            handleToggleFeatured(campaign);
                          }}
                        >
                          {campaign.featured ? (
                            <>
                              <StarOff size={14} className="mr-2" />
                              Remove from Featured
                            </>
                          ) : (
                            <>
                              <Star size={14} className="mr-2" />
                              Add to Featured
                            </>
                          )}
                        </button>
                        <div className="border-t border-slate-100 dark:border-gray-700 my-1"></div>
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
                          onClick={() => {
                            setSelectedCampaign(null);
                            handleDeleteCampaign(campaign);
                          }}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete Campaign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // List View
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="divide-y divide-slate-100 dark:divide-gray-700">
            {filteredCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 ${
                  selectedCampaigns.includes(campaign.id)
                    ? "bg-primary-50 dark:bg-primary-900/30"
                    : ""
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="mr-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 w-5 h-5"
                          checked={selectedCampaigns.includes(campaign.id)}
                          onChange={() => toggleCampaignSelection(campaign.id)}
                        />
                      </label>
                    </div>
                    
                    <div 
                      className="w-16 h-16 bg-slate-200 dark:bg-gray-700 rounded-lg bg-center bg-cover mr-3 relative"
                      style={{ backgroundImage: `url(${campaign.image})` }}
                    >
                      {campaign.featured && (
                        <div className="absolute -top-2 -right-2">
                          <Award size={16} className="text-amber-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center mb-1">
                        {getStatusBadge(campaign.status)}
                        {campaign.flagged && (
                          <span className="ml-2 text-xs text-red-600 dark:text-red-400 flex items-center">
                            <Flag size={10} className="mr-1" />
                            Flagged
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-slate-900 dark:text-white text-md mb-1">
                        {campaign.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-gray-400 gap-2">
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {format(new Date(campaign.endDate), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center">
                          <Users size={12} className="mr-1" />
                          {campaign.donorsCount} donors
                        </span>
                        <span className="capitalize px-2 py-0.5 bg-slate-100 dark:bg-gray-700 rounded-full">
                          {campaign.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center ml-0 md:ml-auto md:space-x-4">
                    <div className="mb-3 md:mb-0 md:w-32">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-gray-400 mb-1">
                        <span>${campaign.raised.toLocaleString()}</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            campaign.status === "completed" ? "bg-blue-500" : "bg-primary-500"
                          }`}
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-slate-500 dark:text-gray-400 mt-1">
                        of ${campaign.goal.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                        onClick={() => handleViewCampaign(campaign.id)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                        onClick={() => handleEditCampaign(campaign.id)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                        onClick={() => handleDeleteCampaign(campaign)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedCampaign && (
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
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Delete Campaign
                </h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-1 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-4">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Confirm Deletion</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      Are you sure you want to delete this campaign? This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCampaign.title}</p>
                  <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 mt-1">
                    <span>Status: {selectedCampaign.status.replace('_', ' ')}</span>
                    <span className="mx-2">•</span>
                    <span>Goal: ${selectedCampaign.goal.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                    onClick={confirmDeleteCampaign}
                  >
                    Delete Campaign
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Feature Campaign Modal */}
      <AnimatePresence>
        {showFeaturedModal && selectedCampaign && (
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeaturedModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  {selectedCampaign.featured ? "Remove from Featured" : "Add to Featured"}
                </h2>
                <button
                  onClick={() => setShowFeaturedModal(false)}
                  className="p-1 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4">
                    {selectedCampaign.featured ? <StarOff size={20} /> : <Star size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      {selectedCampaign.featured ? "Remove from Featured" : "Add to Featured"}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      {selectedCampaign.featured 
                        ? "This campaign will no longer appear in the featured section." 
                        : "Featured campaigns are highlighted on the homepage and receive more visibility."}
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                  <p className="font-medium text-slate-900 dark:text-white">{selectedCampaign.title}</p>
                  <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 mt-1">
                    <span>Status: {selectedCampaign.status.replace('_', ' ')}</span>
                    <span className="mx-2">•</span>
                    <span>Progress: {selectedCampaign.progress}%</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowFeaturedModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                    onClick={confirmToggleFeatured}
                  >
                    {selectedCampaign.featured ? "Remove from Featured" : "Add to Featured"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllCampaignsPage;