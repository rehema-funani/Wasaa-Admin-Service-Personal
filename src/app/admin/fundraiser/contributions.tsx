import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Filter,
  Search,
  Download,
  ChevronDown,
  Clock,
  CreditCard,
  TrendingUp,
  Calendar,
  User,
  DollarSign,
  BarChart2,
  PieChart,
  Info,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
  Eye,
  Zap,
  Flag,
  CheckCircle,
  Loader,
  RefreshCw,
} from "lucide-react";
import { format, formatDistanceToNow, subDays, addDays, addHours, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "react-hot-toast";

// Dummy data generator for campaign contributions
const generateDummyContributions = () => {
  const statusOptions = ["completed", "pending", "failed"];
  const paymentMethods = ["credit_card", "bank_transfer", "mobile_money", "paypal"];
  const campaignTitles = [
    "Build a School in Rural Kenya",
    "Hurricane Relief Fund",
    "Cancer Treatment Support",
    "Community Garden Project",
    "Youth Basketball League",
    "Local Theater Renovation",
    "College Scholarship Fund",
    "Animal Shelter Expansion",
  ];
  
  const contributors = Array.from({ length: 30 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: [
      "Alex Johnson", "Maria Garcia", "John Smith", "Sarah Chen", "Michael Brown",
      "Emily Wilson", "David Kim", "Olivia Martinez", "James Williams", "Sophia Lee",
      "Amelia Thompson", "Benjamin Taylor", "Sofia Rodriguez", "William Davis", "Charlotte Miller"
    ][i % 15],
    email: `donor${i + 1}@example.com`,
    location: [
      "Nairobi, Kenya", "Mombasa, Kenya", "Kisumu, Kenya", "Nakuru, Kenya", 
      "Eldoret, Kenya", "New York, USA", "London, UK", "Tokyo, Japan", "Sydney, Australia"
    ][i % 9],
    donationsCount: Math.floor(Math.random() * 20) + 1,
    totalAmount: Math.round((Math.random() * 5000 + 100) / 10) * 10,
    firstDonation: subDays(new Date(), Math.floor(Math.random() * 365) + 30),
  }));
  
  const transactions = [];
  
  // Generate random contributions across the last 6 months
  for (let i = 0; i < 200; i++) {
    const amount = Math.round((Math.random() * 1000 + 10) / 5) * 5;
    const contributor = contributors[Math.floor(Math.random() * contributors.length)];
    const status = statusOptions[Math.floor(Math.random() * (i > 180 ? 3 : 1.1))]; // Make most of them completed
    const date = subDays(new Date(), Math.floor(Math.random() * 180));
    const campaignIndex = Math.floor(Math.random() * campaignTitles.length);
    
    transactions.push({
      id: `trx-${i + 1}`,
      type: "donation",
      amount,
      fee: Math.round(amount * 0.03 * 100) / 100,
      netAmount: Math.round((amount - (amount * 0.03)) * 100) / 100,
      status,
      date,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      campaign: {
        id: `camp-${campaignIndex + 1}`,
        title: campaignTitles[campaignIndex],
      },
      contributor,
      notes: Math.random() > 0.9 ? "First-time donor! Sent welcome email." : "",
      isRecurring: Math.random() > 0.8,
      recurringFrequency: Math.random() > 0.8 ? "monthly" : "weekly",
      isAnonymous: Math.random() > 0.85,
      message: Math.random() > 0.7 ? [
        "Keep up the great work!",
        "Happy to support this cause.",
        "This means a lot to my family.",
        "Wishing you all the best with this project.",
        "In memory of a loved one.",
      ][Math.floor(Math.random() * 5)] : "",
    });
  }
  
  return transactions;
};

// Generate monthly stats for charts
const generateMonthlyStats = (transactions) => {
  const sixMonthsAgo = subDays(new Date(), 180);
  const months = [];
  
  for (let i = 0; i < 6; i++) {
    const monthStart = startOfMonth(addDays(sixMonthsAgo, 30 * i));
    const monthEnd = endOfMonth(monthStart);
    const monthTransactions = transactions.filter(
      t => new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd && t.status === "completed"
    );
    
    months.push({
      month: format(monthStart, "MMM yyyy"),
      count: monthTransactions.length,
      amount: monthTransactions.reduce((sum, t) => sum + t.amount, 0),
      uniqueDonors: new Set(monthTransactions.map(t => t.contributor.id)).size,
    });
  }
  
  return months;
};

// Generate payment method stats
const generatePaymentMethodStats = (transactions) => {
  const completedTransactions = transactions.filter(t => t.status === "completed");
  const methods = {};
  
  completedTransactions.forEach(t => {
    const method = t.paymentMethod;
    if (!methods[method]) {
      methods[method] = {
        count: 0,
        amount: 0,
      };
    }
    methods[method].count += 1;
    methods[method].amount += t.amount;
  });
  
  return Object.keys(methods).map(key => ({
    method: key,
    count: methods[key].count,
    amount: methods[key].amount,
    percentage: Math.round((methods[key].count / completedTransactions.length) * 100),
  }));
};

const CampaignContributions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    campaign: "",
    dateRange: "all",
    amountRange: "all",
    paymentMethod: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContribution, setActiveContribution] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [paymentMethodStats, setPaymentMethodStats] = useState([]);
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [view, setView] = useState("all");

  useEffect(() => {
    // Simulate API request
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const dummyContributions = generateDummyContributions();
        setContributions(dummyContributions);
        setFilteredContributions(dummyContributions);
        
        // Generate stats for charts and insights
        setMonthlyStats(generateMonthlyStats(dummyContributions));
        setPaymentMethodStats(generatePaymentMethodStats(dummyContributions));
        
        // Generate top campaigns by donation amount
        const campaignStats = {};
        dummyContributions.forEach(c => {
          if (c.status === "completed") {
            if (!campaignStats[c.campaign.id]) {
              campaignStats[c.campaign.id] = {
                id: c.campaign.id,
                title: c.campaign.title,
                amount: 0,
                count: 0,
              };
            }
            campaignStats[c.campaign.id].amount += c.amount;
            campaignStats[c.campaign.id].count += 1;
          }
        });
        
        setTopCampaigns(
          Object.values(campaignStats)
            .sort((a: any, b: any) => b.amount - a.amount)
            .slice(0, 5)
        );
        
        const contributorStats = {};
        dummyContributions.forEach(c => {
          if (c.status === "completed" && !c.isAnonymous) {
            if (!contributorStats[c.contributor.id]) {
              contributorStats[c.contributor.id] = {
                id: c.contributor.id,
                name: c.contributor.name,
                email: c.contributor.email,
                amount: 0,
                count: 0,
                location: c.contributor.location,
              };
            }
            contributorStats[c.contributor.id].amount += c.amount;
            contributorStats[c.contributor.id].count += 1;
          }
        });
        
        setTopContributors(
          Object.values(contributorStats)
            .sort((a: any, b: any) => b.amount - a.amount)
            .slice(0, 5)
        );
        
      } catch (error) {
        console.error("Error loading contributions:", error);
        toast.error("Failed to load contribution data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      applyFilters(filters, contributions);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = contributions.filter(
      contribution => 
        contribution.campaign.title.toLowerCase().includes(lowercaseQuery) ||
        contribution.contributor.name.toLowerCase().includes(lowercaseQuery) ||
        contribution.contributor.email.toLowerCase().includes(lowercaseQuery) ||
        contribution.id.toLowerCase().includes(lowercaseQuery)
    );
    
    applyFilters(filters, filtered);
  };
  
  const applyFilters = (newFilters, items = contributions) => {
    setFilters(newFilters);
    
    let filtered = [...items];
    
    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter(c => newFilters.status.includes(c.status));
    }
    
    if (newFilters.campaign) {
      filtered = filtered.filter(c => c.campaign.id === newFilters.campaign);
    }
    
    if (newFilters.paymentMethod) {
      filtered = filtered.filter(c => c.paymentMethod === newFilters.paymentMethod);
    }
    
    if (newFilters.dateRange !== "all") {
      const daysMap = {
        "7days": 7,
        "30days": 30,
        "90days": 90
      };
      
      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
      filtered = filtered.filter(c => new Date(c.date) >= cutoffDate);
    }
    
    if (newFilters.amountRange !== "all") {
      const rangeMaps = {
        "small": { min: 0, max: 50 },
        "medium": { min: 50, max: 200 },
        "large": { min: 200, max: Infinity }
      };
      
      const range = rangeMaps[newFilters.amountRange];
      filtered = filtered.filter(c => c.amount >= range.min && c.amount < range.max);
    }
    
    setFilteredContributions(filtered);
  };
  
  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      status: [],
      campaign: "",
      dateRange: "all",
      amountRange: "all",
      paymentMethod: "",
    };
    
    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredContributions(contributions);
  };
  
  const handleViewDetails = (contribution) => {
    setActiveContribution(contribution);
    setShowDetailsModal(true);
  };
  
  const handleExport = () => {
    toast.success("Contribution data exported successfully");
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };
  
  const sortedContributions = [...filteredContributions].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case "date":
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
        break;
      case "amount":
        valueA = a.amount;
        valueB = b.amount;
        break;
      case "name":
        valueA = a.contributor.name;
        valueB = b.contributor.name;
        break;
      case "campaign":
        valueA = a.campaign.title;
        valueB = b.campaign.title;
        break;
      default:
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
    }
    
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === "asc"
        ? valueA - valueB
        : valueB - valueA;
    }
  });
  
  // Get contributions based on view
  const getViewContributions = () => {
    switch (view) {
      case "completed":
        return sortedContributions.filter(c => c.status === "completed").slice(0, 50);
      case "pending":
        return sortedContributions.filter(c => c.status === "pending").slice(0, 50);
      case "failed":
        return sortedContributions.filter(c => c.status === "failed").slice(0, 50);
      case "recurring":
        return sortedContributions.filter(c => c.isRecurring).slice(0, 50);
      case "all":
      default:
        return sortedContributions.slice(0, 50);
    }
  };
  
  const viewContributions = getViewContributions();
  
  // Statistics
  const getTotalRaised = () => {
    return contributions
      .filter(c => c.status === "completed")
      .reduce((sum, c) => sum + c.amount, 0);
  };
  
  const getCompletedCount = () => {
    return contributions.filter(c => c.status === "completed").length;
  };
  
  const getPendingCount = () => {
    return contributions.filter(c => c.status === "pending").length;
  };
  
  const getFailedCount = () => {
    return contributions.filter(c => c.status === "failed").length;
  };
  
  const getRecurringCount = () => {
    return contributions.filter(c => c.isRecurring).length;
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            <CheckCircle size={10} className="mr-1" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <Clock size={10} className="mr-1" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
            <AlertTriangle size={10} className="mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };
  
  const getPaymentIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="text-primary-500" size={16} />;
      case "bank_transfer":
        return <RefreshCw className="text-blue-500" size={16} />;
      case "mobile_money":
        return <DollarSign className="text-emerald-500" size={16} />;
      case "paypal":
        return <DollarSign className="text-blue-500" size={16} />;
      default:
        return <DollarSign className="text-slate-500" size={16} />;
    }
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
            Campaign Contributions
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
            Track and manage all donations to fundraising campaigns
          </p>
        </div>
        <motion.button
          className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
          whileTap={{ y: 0 }}
          onClick={handleExport}
        >
          <Download size={16} className="mr-2" />
          <span>Export Data</span>
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Raised
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            ${isLoading ? "..." : getTotalRaised().toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            From completed donations
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
            {isLoading ? "..." : getCompletedCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Successful transactions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getPendingCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Processing transactions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Failed
            </p>
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getFailedCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Failed transactions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Recurring
            </p>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <RefreshCw size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : getRecurringCount()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Recurring donations
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
              placeholder="Search by campaign, donor name, or email..."
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["completed", "pending", "failed"].map((status) => (
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
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Campaign
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.campaign}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          campaign: e.target.value,
                        })
                      }
                    >
                      <option value="">All Campaigns</option>
                      {[...new Set(contributions.map(c => c.campaign.id))].map((campaignId) => {
                        const campaign = contributions.find(c => c.campaign.id === campaignId).campaign;
                        return (
                          <option key={campaignId} value={campaignId}>
                            {campaign.title}
                          </option>
                        );
                      })}
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
                      Amount Range
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
                      <option value="small">Small (&lt; $50)</option>
                      <option value="medium">Medium ($50 - $200)</option>
                      <option value="large">Large ({'>'} $200)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                      Payment Method
                    </label>
                    <select
                      className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filters.paymentMethod}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <option value="">All Methods</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 lg:col-span-5 flex justify-end">
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

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Analytics Cards */}
        <motion.div 
          className="col-span-12 lg:col-span-4 space-y-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {/* Monthly Donations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Monthly Donations
              </h2>
              <BarChart2 size={18} className="text-slate-400 dark:text-gray-500" />
            </div>
            
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader size={24} className="text-primary-500 animate-spin mr-3" />
                </div>
              ) : (
                <div className="space-y-3">
                  {monthlyStats.map((month, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-slate-700 dark:text-gray-300">{month.month}</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          ${month.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 rounded-full"
                          style={{ 
                            width: `${Math.min(100, (month.amount / Math.max(...monthlyStats.map(m => m.amount))) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400 mt-1">
                        <span>{month.count} donations</span>
                        <span>{month.uniqueDonors} unique donors</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Top Campaigns */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Top Campaigns
              </h2>
              <Flag size={18} className="text-slate-400 dark:text-gray-500" />
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-gray-700">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader size={24} className="text-primary-500 animate-spin mr-3" />
                </div>
              ) : (
                topCampaigns.map((campaign, index) => (
                  <div key={index} className="p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                          {campaign.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          {campaign.count} donations
                        </p>
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        ${campaign.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Payment Methods
              </h2>
              <PieChart size={18} className="text-slate-400 dark:text-gray-500" />
            </div>
            
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader size={24} className="text-primary-500 animate-spin mr-3" />
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethodStats.map((method, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          {getPaymentIcon(method.method)}
                          <span className="ml-2 text-sm text-slate-700 dark:text-gray-300 capitalize">
                            {method.method.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {method.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            index === 0 ? "bg-primary-500" :
                            index === 1 ? "bg-blue-500" :
                            index === 2 ? "bg-emerald-500" :
                            "bg-amber-500"
                          }`}
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400 mt-1">
                        <span>{method.count} transactions</span>
                        <span>${method.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Contributions List */}
        <motion.div 
          className="col-span-12 lg:col-span-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                Contribution Transactions
              </h2>
              
              <div className="flex space-x-1 bg-slate-100 dark:bg-gray-700 p-1 rounded-lg">
                {["all", "completed", "pending", "failed", "recurring"].map((viewType) => (
                  <button
                    key={viewType}
                    className={`px-3 py-1 text-xs rounded-md ${
                      view === viewType
                        ? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
                        : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                    }`}
                    onClick={() => setView(viewType)}
                  >
                    <span className="capitalize">{viewType}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={30} className="text-primary-500 animate-spin mr-3" />
                  <span className="text-slate-500 dark:text-gray-400">Loading contribution data...</span>
                </div>
              ) : viewContributions.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-gray-700 rounded-full mb-4">
                    <Gift size={24} className="text-slate-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-2">
                    No contributions found
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
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-gray-700 border-b border-slate-100 dark:border-gray-600">
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none"
                        >
                          <span>Date</span>
                          {sortBy === "date" && (
                            <span className="ml-1 text-primary-500">
                              {sortDirection === "asc" ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronDown size={14} className="transform rotate-180" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none"
                        >
                          <span>Donor</span>
                          {sortBy === "name" && (
                            <span className="ml-1 text-primary-500">
                              {sortDirection === "asc" ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronDown size={14} className="transform rotate-180" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("campaign")}
                          className="flex items-center text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none"
                        >
                          <span>Campaign</span>
                          {sortBy === "campaign" && (
                            <span className="ml-1 text-primary-500">
                              {sortDirection === "asc" ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronDown size={14} className="transform rotate-180" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </span>
                      </th>
                      <th className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSort("amount")}
                          className="flex items-center justify-end text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none ml-auto"
                        >
                          <span>Amount</span>
                          {sortBy === "amount" && (
                            <span className="ml-1 text-primary-500">
                              {sortDirection === "asc" ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronDown size={14} className="transform rotate-180" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">
                        <span className="text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewContributions.map((contribution, index) => (
                      <tr
                        key={contribution.id}
                        className={`border-b border-slate-100 dark:border-gray-600 ${
                          index % 2 === 0 
                            ? "bg-white dark:bg-gray-800" 
                            : "bg-slate-50/30 dark:bg-gray-700/30"
                        } hover:bg-slate-50 dark:hover:bg-gray-700`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-900 dark:text-white">
                              {format(new Date(contribution.date), "MMM d, yyyy")}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-gray-400">
                              {format(new Date(contribution.date), "h:mm a")}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                              <User className="text-slate-500 dark:text-gray-400" size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {contribution.isAnonymous ? "Anonymous Donor" : contribution.contributor.name}
                              </span>
                              {!contribution.isAnonymous && (
                                <span className="text-xs text-slate-500 dark:text-gray-400">
                                  {contribution.contributor.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-900 dark:text-white max-w-[200px] truncate">
                              {contribution.campaign.title}
                            </span>
                            <div className="flex items-center text-xs">
                              <span className="capitalize text-slate-500 dark:text-gray-400 flex items-center">
                                {getPaymentIcon(contribution.paymentMethod)}
                                <span className="ml-1 capitalize">
                                  {contribution.paymentMethod.replace('_', ' ')}
                                </span>
                              </span>
                              {contribution.isRecurring && (
                                <>
                                  <span className="mx-1 text-slate-300 dark:text-gray-600">•</span>
                                  <span className="flex items-center text-purple-600 dark:text-purple-400">
                                    <RefreshCw size={10} className="mr-1" />
                                    Recurring
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(contribution.status)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              ${contribution.amount.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-gray-400">
                              Net: ${contribution.netAmount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            className="p-2 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                            onClick={() => handleViewDetails(contribution)}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {!isLoading && viewContributions.length > 0 && (
              <div className="p-4 border-t border-slate-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-gray-400">
                  Showing {viewContributions.length} of {filteredContributions.length} contributions
                </span>
                <button
                  className="text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center"
                  onClick={() => toast.success("Loading more contributions")}
                >
                  Load More
                  <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Contribution Details Modal */}
      <AnimatePresence>
        {showDetailsModal && activeContribution && (
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Contribution Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Donation Information</h3>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-gray-400">ID</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{activeContribution.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-gray-400">Date</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {format(new Date(activeContribution.date), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-gray-400">Status</span>
                      <span>{getStatusBadge(activeContribution.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-gray-400">Payment Method</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                        {activeContribution.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-gray-400">Recurring</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {activeContribution.isRecurring ? `Yes (${activeContribution.recurringFrequency})` : "No"}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300 mt-4 mb-2">Amount Details</h3>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500 dark:text-gray-400">Amount</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        ${activeContribution.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500 dark:text-gray-400">Platform Fee</span>
                      <span className="text-sm text-slate-700 dark:text-gray-300">
                        ${activeContribution.fee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Net Amount</span>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        ${activeContribution.netAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Campaign</h3>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500 dark:text-gray-400">Title</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {activeContribution.campaign.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-gray-400">ID</span>
                      <a className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                        {activeContribution.campaign.id}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300 mt-4 mb-2">Donor Information</h3>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3">
                    {activeContribution.isAnonymous ? (
                      <div className="flex items-center justify-center py-2">
                        <Info size={16} className="text-slate-400 dark:text-gray-500 mr-2" />
                        <span className="text-sm text-slate-700 dark:text-gray-300">Anonymous Donation</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-500 dark:text-gray-400">Name</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {activeContribution.contributor.name}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-500 dark:text-gray-400">Email</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {activeContribution.contributor.email}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-500 dark:text-gray-400">Location</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {activeContribution.contributor.location}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-gray-400">Previous Donations</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {activeContribution.contributor.donationsCount > 1 
                              ? `${activeContribution.contributor.donationsCount - 1} previous`
                              : "First donation"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {activeContribution.message && (
                    <>
                      <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300 mt-4 mb-2">Donor Message</h3>
                      <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-sm text-slate-700 dark:text-gray-300 italic">
                          "{activeContribution.message}"
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                  onClick={() => {
                    toast.success("Downloading receipt");
                    setShowDetailsModal(false);
                  }}
                >
                  Download Receipt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignContributions;