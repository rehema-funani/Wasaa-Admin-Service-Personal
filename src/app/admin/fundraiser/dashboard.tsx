import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Download,
  ChevronDown,
  ArrowUpRight,
  Clock,
  Gift,
  Zap,
  AlertTriangle,
  Settings,
  Eye,
  Flag,
  CreditCard,
  RefreshCw,
  Loader,
  CheckCircle,
  PiggyBank,
  Bell,
  Globe,
  User,
  LogOut,
  Shield,
  FileText,
  MessageCircle,
  ShieldAlert,
  Lock,
  BadgeAlert,
  ShieldCheck,
  ThumbsDown,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";
import { useNavigate } from "react-router-dom";

const FundraisingDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    category: "",
    dateRange: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [view, setView] = useState("active");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [stats, setStats] = useState({
    campaigns: {
      total: 0,
      pending: 0,
      active: 0,
      completed: 0,
      flagged: 0,
    },
    payouts: {
      total: 0,
      pending: 0,
      approved: 0,
    },
    donations: {
      total: 0,
    },
    revenue: {
      totalRaised: 0,
      platformFees: 0,
    },
    compliance: {
      pendingKYC: 0,
      verifiedOrganizers: 0,
      riskAlerts: 0,
    },
    support: {
      openTickets: 0,
      resolvedToday: 0,
    },
    fraud: {
      highRiskCampaigns: 0,
      suspiciousTransactions: 0,
    },
  });
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "fraud",
      title: "Suspicious donation pattern detected",
      description: "Multiple large donations from the same IP address to 'Medical Fund for Jane'",
      severity: "high",
      timestamp: new Date(),
      campaignId: "12345",
    },
    {
      id: 2,
      type: "compliance",
      title: "KYC verification pending",
      description: "5 organizers have incomplete KYC documentation",
      severity: "medium",
      timestamp: new Date(),
      campaignId: null,
    },
    {
      id: 3,
      type: "financial",
      title: "Payout reconciliation mismatch",
      description: "Wallet balance doesn't match expected escrow for 'Community Garden Project'",
      severity: "high",
      timestamp: new Date(),
      campaignId: "67890",
    },
    {
      id: 4,
      type: "system",
      title: "Wallet service integration issue",
      description: "Intermittent connection errors with WasaaChat Wallet service",
      severity: "medium",
      timestamp: new Date(),
      campaignId: null,
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New campaign submitted",
      message: "'Education Fund for Kibera School' requires approval",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Fraud alert escalated",
      message: "Compliance officer has escalated a fraud case for review",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Payout approved",
      message: "You approved payout for 'Medical Fund for Sarah'",
      time: "2 hours ago", 
      read: true,
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await fundraiserService.getDashboardStats();
        const res = await fundraiserService.getCampaigns(1, 4);
        setStats(response.data);
        setCampaigns(res.data);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(campaigns);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = campaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(lowercaseQuery) ||
        campaign.creator.name.toLowerCase().includes(lowercaseQuery) ||
        campaign.location.toLowerCase().includes(lowercaseQuery) ||
        campaign.category.toLowerCase().includes(lowercaseQuery)
    );

    setSearchResults(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    let filtered = [...campaigns];

    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter((c) => newFilters.status.includes(c.status));
    }

    if (newFilters.category) {
      filtered = filtered.filter((c) => c.category === newFilters.category);
    }

    if (newFilters.dateRange !== "all") {
      const daysMap = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };

      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
      filtered = filtered.filter((c) => new Date(c.startDate) >= cutoffDate);
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(lowercaseQuery) ||
          campaign.creator.name.toLowerCase().includes(lowercaseQuery) ||
          campaign.location.toLowerCase().includes(lowercaseQuery) ||
          campaign.category.toLowerCase().includes(lowercaseQuery)
      );
    }

    setSearchResults(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      category: "",
      dateRange: "all",
    });
    setSearchResults(campaigns);
  };

  const handleExport = () => {
    toast.success("Dashboard data exported successfully");
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "approveCampaign":
        toast.success("Opening campaign approval wizard");
        navigate("/admin/fundraising/campaigns/pending");
        break;
      case "escalateFraud":
        toast.success("Opening fraud escalation form");
        navigate("/admin/fundraising/compliance/fraud");
        break;
      case "issueRefund":
        toast.success("Opening refund wizard");
        navigate("/admin/fundraising/finance/refunds/new");
        break;
      case "generateReport":
        toast.success("Opening report generator");
        navigate("/admin/fundraising/reports/create");
        break;
      default:
        break;
    }
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setShowLanguageMenu(false);
    toast.success(`Language changed to ${language}`);
  };

  const handleNotificationRead = (id) => {
    setNotifications(
      notifications.map((notif) => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleAlertAction = (alertId, action) => {
    toast.success(`Alert ${alertId} ${action}`);
    
    // In a real implementation, we would call appropriate API endpoints
    // For now, just remove the alert from the UI for demonstration
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const getAlertSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle size={16} className="text-red-500" />;
      case "medium":
        return <BadgeAlert size={16} className="text-amber-500" />;
      case "low":
        return <Flag size={16} className="text-blue-500" />;
      default:
        return <Flag size={16} />;
    }
  };
  
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "fraud":
        return <ShieldAlert size={16} className="text-red-500" />;
      case "compliance":
        return <FileText size={16} className="text-amber-500" />;
      case "financial":
        return <DollarSign size={16} className="text-green-500" />;
      case "system":
        return <Settings size={16} className="text-blue-500" />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="p-6 w-full mx-auto max-w-[1600px]">
      <motion.div 
        className="fixed top-0 right-0 left-0 z-10 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 shadow-sm px-6 py-3 flex items-center justify-end gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* System Status Indicator */}
        <div className="flex items-center mr-auto">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-slate-500 dark:text-gray-400">System operational</span>
        </div>
        
        {/* Search */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-slate-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Quick search..."
            className="w-64 pl-9 pr-4 py-1.5 text-sm border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="p-3 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-slate-900 dark:text-white">Notifications</h3>
                  <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 ${notification.read ? 'opacity-75' : ''}`}
                      onClick={() => handleNotificationRead(notification.id)}
                    >
                      <div className="flex">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${notification.read ? 'bg-slate-100 dark:bg-gray-700' : 'bg-primary-50 dark:bg-primary-900/30'}`}>
                          {notification.title.includes('campaign') ? (
                            <Gift size={16} className="text-primary-600 dark:text-primary-400" />
                          ) : notification.title.includes('Fraud') ? (
                            <ShieldAlert size={16} className="text-red-600 dark:text-red-400" />
                          ) : notification.title.includes('Payout') ? (
                            <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                          ) : (
                            <Bell size={16} className="text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-slate-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 dark:border-gray-700 text-center">
                  <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Language Selector */}
        <div className="relative">
          <button 
            className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full flex items-center"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <Globe size={18} />
            <span className="ml-1 text-xs">{currentLanguage.substring(0, 2)}</span>
          </button>
          
          {/* Language Menu Dropdown */}
          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                onMouseLeave={() => setShowLanguageMenu(false)}
              >
                <div className="py-1">
                  {["English", "Swahili", "French", "Arabic"].map(language => (
                    <button
                      key={language}
                      className={`w-full text-left px-4 py-2 text-sm ${currentLanguage === language ? 'bg-slate-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
                      onClick={() => handleLanguageChange(language)}
                    >
                      {language}
                      {currentLanguage === language && (
                        <CheckCircle size={14} className="inline ml-2 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 p-1 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm">
              SA
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Super Admin</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">admin@wasaachat.com</p>
            </div>
            <ChevronDown size={16} className="hidden md:block" />
          </button>
          
          {/* Profile Menu Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="p-3 border-b border-slate-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Super Admin</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">admin@wasaachat.com</p>
                  <p className="text-xs mt-1 py-0.5 px-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full inline-block">
                    Super Admin Role
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center">
                    <User size={14} className="mr-2" />
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center">
                    <Settings size={14} className="mr-2" />
                    Preferences
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center">
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Main Content Area */}
      <div className="mt-16">
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-2xl font-light text-slate-900 dark:text-gray-100">
              Fundraising Dashboard
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
              Overview of all fundraising campaigns and activities
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction("approveCampaign")}
              className="px-3 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >
              <CheckCircle size={14} className="mr-1.5" />
              Approve Campaign
            </button>
            <button
              onClick={() => handleQuickAction("escalateFraud")}
              className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              <ShieldAlert size={14} className="mr-1.5" />
              Escalate Fraud
            </button>
            <button
              onClick={() => handleQuickAction("issueRefund")}
              className="px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              <RefreshCw size={14} className="mr-1.5" />
              Issue Refund
            </button>
            <button
              onClick={() => handleQuickAction("generateReport")}
              className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <FileText size={14} className="mr-1.5" />
              Generate Report
            </button>
          </div>
        </motion.div>

        {/* Campaign Statistics */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Total Campaigns
              </p>
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Gift size={16} />
              </div>
            </div>
            <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
              {isLoading ? "..." : stats.campaigns.total.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              All campaigns
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Pending Campaigns
              </p>
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
              {isLoading ? "..." : stats.campaigns.pending.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Awaiting review
            </p>
          </div>

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
              {isLoading ? "..." : stats.campaigns.active.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Currently active
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Completed Campaigns
              </p>
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <CheckCircle size={16} />
              </div>
            </div>
            <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
              {isLoading ? "..." : stats.campaigns.completed.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Successfully completed
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Flagged Campaigns
              </p>
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <Flag size={16} />
              </div>
            </div>
            <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
             {isLoading ? "..." : (stats.campaigns.flagged || 0).toLocaleString()}
           </p>
           <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
             Require attention
           </p>
         </div>
       </motion.div>

       {/* Financial & Compliance Statistics */}
       <motion.div
         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3, delay: 0.15 }}
       >
         <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-500 dark:text-gray-400 text-sm">
               Total Raised
             </p>
             <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
               <DollarSign size={16} />
             </div>
           </div>
           <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
             Kes {isLoading ? "..." : stats.revenue.totalRaised.toLocaleString()}
           </p>
           <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
             Across all campaigns
           </p>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-500 dark:text-gray-400 text-sm">
               Pending KYC
             </p>
             <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
               <Shield size={16} />
             </div>
           </div>
           <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
             {isLoading ? "..." : (stats.compliance?.pendingKYC || 0).toLocaleString()}
           </p>
           <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
             Verification required
           </p>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-500 dark:text-gray-400 text-sm">
               Pending Payouts
             </p>
             <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
               <AlertTriangle size={16} />
             </div>
           </div>
           <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
             {isLoading ? "..." : stats.payouts.pending.toLocaleString()}
           </p>
           <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
             Awaiting approval
           </p>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-500 dark:text-gray-400 text-sm">
               High Risk Campaigns
             </p>
             <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
               <ShieldAlert size={16} />
             </div>
           </div>
           <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
             {isLoading ? "..." : (stats.fraud?.highRiskCampaigns || 0).toLocaleString()}
           </p>
           <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
             Fraud risk detected
           </p>
         </div>

         <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-500 dark:text-gray-400 text-sm">
               Open Support Tickets
             </p>
             <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
               <MessageCircle size={16} />
             </div>
           </div>
           <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
             {isLoading ? "..." : (stats.support?.openTickets || 0).toLocaleString()}
           </p>
           <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
             Require resolution
           </p>
         </div>
       </motion.div>

       {/* Active Issues & Alerts Panel */}
       <motion.div
         className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3, delay: 0.2 }}
       >
         <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
             <AlertTriangle size={18} className="text-red-500 mr-2" />
             Active Issues & Alerts
           </h2>
           <button
             className="text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center"
           >
             View All Alerts
             <ArrowUpRight size={14} className="ml-1" />
           </button>
         </div>
         
         <div className="space-y-3">
           {alerts.length === 0 ? (
             <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
               <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
               <p className="text-slate-700 dark:text-gray-300">No active issues requiring attention</p>
             </div>
           ) : (
             alerts.map((alert) => {
               const getSeverityColor = (severity) => {
                 switch (severity) {
                   case 'high':
                     return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
                   case 'medium':
                     return 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20';
                   case 'low':
                   default:
                     return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
                 }
               };

               return (
                 <div 
                   key={alert.id} 
                   className={`rounded-lg ${getSeverityColor(alert.severity)} p-3 flex flex-col sm:flex-row sm:items-center justify-between`}
                 >
                   <div className="flex items-start mb-3 sm:mb-0">
                     <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mr-3">
                       {getAlertTypeIcon(alert.type)}
                     </div>
                     <div>
                       <div className="flex items-center mb-1">
                         {getAlertSeverityIcon(alert.severity)}
                         <p className="font-medium text-slate-900 dark:text-white text-sm ml-1.5">
                           {alert.title}
                         </p>
                       </div>
                       <p className="text-xs text-slate-600 dark:text-gray-400">
                         {alert.description}
                       </p>
                       <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                         {format(new Date(alert.timestamp), "MMM d, h:mm a")}
                       </p>
                     </div>
                   </div>
                   <div className="flex space-x-2">
                     {alert.campaignId && (
                       <button 
                         className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                         onClick={() => navigate(`/admin/fundraising/campaigns/${alert.campaignId}`)}
                       >
                         <Eye size={14} className="inline mr-1" />
                         View
                       </button>
                     )}
                     <button 
                       className="px-3 py-1.5 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                       onClick={() => handleAlertAction(alert.id, 'resolved')}
                     >
                       <CheckCircle size={14} className="inline mr-1" />
                       Resolve
                     </button>
                     <button 
                       className="px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                       onClick={() => handleAlertAction(alert.id, 'escalated')}
                     >
                       <ArrowUpRight size={14} className="inline mr-1" />
                       Escalate
                     </button>
                   </div>
                 </div>
               );
             })
           )}
         </div>
       </motion.div>

       {/* Search and Filters */}
       <motion.div
         className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm p-4 mb-6"
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3, delay: 0.25 }}
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

           <div className="flex space-x-2">
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
             
             <button
               onClick={handleExport}
               className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg flex items-center text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
             >
               <Download size={16} className="mr-2" />
               <span>Export</span>
             </button>
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
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                       Status
                     </label>
                     <div className="flex flex-wrap gap-2">
                       {["active", "completed", "draft", "pending_review"].map(
                         (status) => (
                           <label
                             key={status}
                             className="inline-flex items-center"
                           >
                             <input
                               type="checkbox"
                               className="rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 mr-1.5"
                               checked={filters.status.includes(status)}
                               onChange={(e) => {
                                 const newStatus = e.target.checked
                                   ? [...filters.status, status]
                                   : filters.status.filter((s) => s !== status);
                                 handleFilterChange({
                                   ...filters,
                                   status: newStatus,
                                 });
                               }}
                             />
                             <span className="text-sm text-slate-600 dark:text-gray-400 capitalize mr-2">
                               {status.replace("_", " ")}
                             </span>
                           </label>
                         )
                       )}
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
                       {[
                         "Medical",
                         "Education",
                         "Disaster Relief",
                         "Community",
                         "Arts",
                         "Sports",
                       ].map((category) => (
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

                   <div className="md:col-span-3 flex justify-end">
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

       {isLoading ? (
         <div className="flex items-center justify-center p-12">
           <Loader size={30} className="text-primary-500 animate-spin mr-3" />
           <span className="text-slate-500 dark:text-gray-400">
             Loading dashboard data...
           </span>
         </div>
       ) : (
         <>
           {/* Campaigns Table */}
           <motion.div
             className="mb-8"
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3, delay: 0.3 }}
           >
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-gray-700">
                 <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                   Campaigns
                 </h2>
                 <div className="flex space-x-1">
                   <button
                     onClick={() => setView('all')}
                     className={`px-3 py-1 text-xs rounded-lg ${
                       view === 'all' 
                         ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                         : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                     }`}
                   >
                     All
                   </button>
                   <button
                     onClick={() => setView('active')}
                     className={`px-3 py-1 text-xs rounded-lg ${
                       view === 'active' 
                         ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                         : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                     }`}
                   >
                     Active
                   </button>
                   <button
                     onClick={() => setView('pending')}
                     className={`px-3 py-1 text-xs rounded-lg ${
                       view === 'pending' 
                         ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                         : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                     }`}
                   >
                     Pending
                   </button>
                   <button
                     onClick={() => setView('completed')}
                     className={`px-3 py-1 text-xs rounded-lg ${
                       view === 'completed' 
                         ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                         : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                     }`}
                   >
                     Completed
                   </button>
                 </div>
               </div>

               <div className="divide-y divide-slate-100 dark:divide-gray-700">
                 {campaigns.length === 0 ? (
                   <div className="py-12 px-4 text-center">
                     <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-gray-700 rounded-full mb-4">
                       <Gift
                         size={24}
                         className="text-slate-400 dark:text-gray-500"
                       />
                     </div>
                     <h3 className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-2">
                       No campaigns found
                     </h3>
                     <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                       Try adjusting your search or filters to find what you're
                       looking for.
                     </p>
                     <button
                       onClick={handleResetFilters}
                       className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                     >
                       Clear filters
                     </button>
                   </div>
                 ) : (
                   campaigns.map((campaign) => {
                     const getStatusBadge = (status: string) => {
                       switch (status) {
                         case "active":
                           return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800";
                         case "completed":
                           return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800";
                         case "draft":
                           return "bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 border border-slate-100 dark:border-slate-800";
                         case "pending_review":
                           return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800";
                         default:
                           return "bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 border border-slate-100 dark:border-slate-800";
                       }
                     };

                     // Random risk score for demo
                     const riskScore = Math.floor(Math.random() * 100);
                     const getRiskColor = (score) => {
                       if (score < 30) return "text-emerald-600 dark:text-emerald-400";
                       if (score < 70) return "text-amber-600 dark:text-amber-400";
                       return "text-red-600 dark:text-red-400";
                     };

                     return (
                       <motion.div
                         key={campaign.id}
                         className="flex flex-col md:flex-row md:items-center p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50"
                         whileHover={{ x: 5 }}
                         transition={{ duration: 0.2 }}
                       >
                         <div className="flex-grow mb-4 md:mb-0">
                           <div className="flex flex-col md:flex-row md:items-center">
                             <div className="flex items-start md:items-center mb-4 md:mb-0">
                               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-medium text-sm mr-3">
                                 {campaign.category
                                   .substring(0, 2)
                                   .toUpperCase()}
                               </div>

                               <div className="flex-grow">
                                 <h3 className="font-medium text-slate-900 dark:text-white text-md mb-1 pr-8 md:pr-0 flex items-center">
                                   {campaign.title}
                                   {riskScore > 70 && (
                                     <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md flex items-center">
                                       <AlertTriangle size={10} className="mr-1" />
                                       High Risk
                                     </span>
                                   )}
                                 </h3>
                                 <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-gray-400 gap-2">
                                   <span className="flex items-center">
                                     <Users size={12} className="mr-1" />
                                     {campaign.donorsCount} donors
                                   </span>
                                   <span className="flex items-center">
                                     <Calendar size={12} className="mr-1" />
                                     {format(
                                       new Date(campaign.endDate),
                                       "MMM d, yyyy"
                                     )}
                                   </span>
                                   <span className="flex items-center">
                                     <TrendingUp size={12} className="mr-1" />
                                     Kes {campaign.raisedAmount.toLocaleString()}{" "}
                                     raised
                                   </span>
                                   
                                   <span className="flex items-center">
                                     <Shield size={12} className="mr-1" />
                                     <span className={getRiskColor(riskScore)}>
                                       Risk: {riskScore}%
                                     </span>
                                   </span>
                                 </div>
                               </div>
                             </div>

                             <div className="flex items-center ml-0 md:ml-auto space-x-3">
                               <div className="min-w-[100px] md:text-center">
                                 <p className="text-xs text-slate-600 dark:text-gray-400">
                                   {campaign.raisedAmount}% of Kes{" "}
                                   {campaign.goalAmount.toLocaleString()}
                                 </p>
                               </div>

                               <span
                                 className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                                   campaign.status
                                 )}`}
                               >
                                 {campaign.status.replace("_", " ")}
                               </span>

                               <div className="flex items-center">
                                 {campaign.status === "active" ? (
                                   <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                                     <ShieldCheck size={12} className="mr-1" />
                                     Verified
                                   </span>
                                 ) : (
                                   <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center">
                                     <Clock size={12} className="mr-1" />
                                     Pending
                                   </span>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>

                         <div className="flex space-x-1 ml-0 md:ml-4">
                           <button
                             className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                             onClick={() =>
                               navigate(
                                 `/admin/fundraising/campaigns/${campaign.id}`
                               )
                             }
                           >
                             <Eye size={18} />
                           </button>
                           
                           {campaign.status === "pending_review" && (
                             <>
                               <button
                                 className="p-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                 onClick={() => toast.success(`Campaign ${campaign.id} approved`)}
                               >
                                 <CheckCircle size={18} />
                               </button>
                               <button
                                 className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                 onClick={() => toast.error(`Campaign ${campaign.id} rejected`)}
                               >
                                 <ThumbsDown size={18} />
                               </button>
                             </>
                           )}
                           
                           {riskScore > 50 && (
                             <button
                               className="p-2 text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                               onClick={() => toast.success(`Campaign ${campaign.id} escalated to compliance`)}
                             >
                               <Flag size={18} />
                             </button>
                           )}
                         </div>
                       </motion.div>
                     );
                   })
                  )}
               </div>

               <div className="p-4 border-t border-slate-100 dark:border-gray-700 flex justify-center">
                 <button
                   className="text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center"
                   onClick={() => navigate("/admin/fundraising/campaigns")}
                 >
                   View All Campaigns
                   <ArrowUpRight size={14} className="ml-1" />
                 </button>
               </div>
             </div>
           </motion.div>

           {/* Bottom Panels - Transactions & Integration Status */}
           <motion.div
             className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3, delay: 0.4 }}
           >
             {/* Recent Transactions Panel */}
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-gray-700">
                 <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                   Recent Transactions
                 </h2>
                 <button
                   className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                   onClick={() =>
                     navigate("/admin/fundraising/finance/transactions")
                   }
                 >
                   View All
                 </button>
               </div>

               <div className="divide-y divide-slate-100 dark:divide-gray-700">
                 {recentTransactions.length === 0 ? (
                   <div className="p-6 text-center">
                     <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                       <DollarSign
                         size={24}
                         className="text-slate-400 dark:text-gray-500"
                       />
                     </div>
                     <p className="text-slate-600 dark:text-gray-400">
                       No recent transactions
                     </p>
                   </div>
                 ) : (
                   recentTransactions.map((transaction) => {
                     const getTransactionIcon = (type) => {
                       switch (type) {
                         case "donation":
                           return <Gift className="text-emerald-500" size={18} />;
                         case "withdrawal":
                           return <CreditCard className="text-blue-500" size={18} />;
                         case "refund":
                           return <RefreshCw className="text-amber-500" size={18} />;
                         default:
                           return <DollarSign className="text-slate-500" size={18} />;
                       }
                     };

                     const getTransactionColor = (type) => {
                       switch (type) {
                         case "donation":
                           return "text-emerald-600 dark:text-emerald-400";
                         case "withdrawal":
                           return "text-blue-600 dark:text-blue-400";
                         case "refund":
                           return "text-amber-600 dark:text-amber-400";
                         default:
                           return "text-slate-600 dark:text-gray-400";
                       }
                     };

                     return (
                       <div
                         key={transaction.id}
                         className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50"
                       >
                         <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                           {getTransactionIcon(transaction.type)}
                         </div>

                         <div className="flex-grow">
                           <div className="flex justify-between">
                             <p className="font-medium text-slate-900 dark:text-white text-sm">
                               {transaction.type === "donation"
                                 ? "Donation to"
                                 : transaction.type === "withdrawal"
                                 ? "Withdrawal from"
                                 : "Refund for"}
                             </p>
                             <p
                               className={`font-medium ${getTransactionColor(
                                 transaction.type
                               )}`}
                             >
                               {transaction.type === "donation" ? "+" : "-"}$
                               {transaction.amount.toLocaleString()}
                             </p>
                           </div>

                           <div className="flex justify-between text-xs mt-1">
                             <div className="text-slate-500 dark:text-gray-400">
                               <span className="truncate max-w-[180px]">
                                 {transaction.campaignTitle}
                               </span>
                               <span className="mx-1">•</span>
                               <span>
                                 {format(
                                   new Date(transaction.createdAt),
                                   "MMM d, yyyy"
                                 )}
                               </span>
                             </div>

                             <span
                               className={`${
                                 transaction.status === "completed"
                                   ? "text-emerald-600 dark:text-emerald-400"
                                   : "text-amber-600 dark:text-amber-400"
                               }`}
                             >
                               {transaction.status === "completed"
                                 ? "Completed"
                                 : "Pending"}
                             </span>
                           </div>
                         </div>
                       </div>
                     );
                   })
                 )}
               </div>
             </div>

             {/* Integration Status Panel */}
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-gray-700">
                 <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                   System Integrations
                 </h2>
                 <button
                   className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                   onClick={() =>
                     navigate("/admin/settings/integrations")
                   }
                 >
                   Manage
                 </button>
               </div>

               <div className="divide-y divide-slate-100 dark:divide-gray-700">
                 {/* Wallet Service */}
                 <div className="flex items-center justify-between p-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center mr-3">
                       <CreditCard size={18} className="text-green-600 dark:text-green-400" />
                     </div>
                     <div>
                       <p className="font-medium text-slate-900 dark:text-white text-sm">Wallet Service</p>
                       <p className="text-xs text-slate-500 dark:text-gray-400">Processes donations and payouts</p>
                     </div>
                   </div>
                   <div className="flex items-center">
                     <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                       Operational
                     </span>
                     <button className="ml-4 text-slate-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
                       <Settings size={16} />
                     </button>
                   </div>
                 </div>

                 {/* Support System */}
                 <div className="flex items-center justify-between p-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                       <MessageCircle size={18} className="text-indigo-600 dark:text-indigo-400" />
                     </div>
                     <div>
                       <p className="font-medium text-slate-900 dark:text-white text-sm">Support System</p>
                       <p className="text-xs text-slate-500 dark:text-gray-400">Manages tickets and resolutions</p>
                     </div>
                   </div>
                   <div className="flex items-center">
                     <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                       Operational
                     </span>
                     <button className="ml-4 text-slate-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
                       <Settings size={16} />
                     </button>
                   </div>
                 </div>

                 {/* Notification Service */}
                 <div className="flex items-center justify-between p-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                       <Bell size={18} className="text-blue-600 dark:text-blue-400" />
                     </div>
                     <div>
                       <p className="font-medium text-slate-900 dark:text-white text-sm">Notification Service</p>
                       <p className="text-xs text-slate-500 dark:text-gray-400">Sends alerts to users</p>
                     </div>
                   </div>
                   <div className="flex items-center">
                     <span className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                       <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                       Degraded
                     </span>
                     <button className="ml-4 text-slate-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
                       <Settings size={16} />
                     </button>
                   </div>
                 </div>

                 {/* KYC/Compliance API */}
                 <div className="flex items-center justify-between p-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                       <Lock size={18} className="text-amber-600 dark:text-amber-400" />
                     </div>
                     <div>
                       <p className="font-medium text-slate-900 dark:text-white text-sm">KYC/Compliance API</p>
                       <p className="text-xs text-slate-500 dark:text-gray-400">Verifies user identities</p>
                     </div>
                   </div>
                   <div className="flex items-center">
                     <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                       Operational
                     </span>
                     <button className="ml-4 text-slate-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
                       <Settings size={16} />
                     </button>
                   </div>
                 </div>

                 {/* Regulatory Reporting API */}
                 <div className="flex items-center justify-between p-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                       <FileText size={18} className="text-purple-600 dark:text-purple-400" />
                     </div>
                     <div>
                       <p className="font-medium text-slate-900 dark:text-white text-sm">Regulatory Reporting</p>
                       <p className="text-xs text-slate-500 dark:text-gray-400">Submits reports to authorities</p>
                     </div>
                   </div>
                   <div className="flex items-center">
                     <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                       Operational
                     </span>
                     <button className="ml-4 text-slate-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400">
                       <Settings size={16} />
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </motion.div>
         </>
       )}
     </div>
   </div>
 );
};

export default FundraisingDashboard;