import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Calendar,
  Target,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowUp,
  ArrowDown,
  Layers,
  AlertCircle,
  Tag,
  Eye,
  Lock,
  Unlock,
  Plus,
  Bell,
  FileText,
  Repeat,
  Info
} from 'lucide-react';

// Dummy data for master accounts
const dummyMasterAccounts = [
  {
    id: 'MA-001234',
    name: 'Save Nairobi Orphanage',
    type: 'FUNDRAISER',
    owner: 'NGO Kenya',
    ownerType: 'ORGANIZATION',
    balance: 3200000,
    currency: 'KES',
    status: 'ACTIVE',
    riskLevel: 'MEDIUM',
    pendingDistributions: 2,
    lastActivity: '2025-09-10T10:30:00Z',
    createdAt: '2025-09-01T08:15:00Z',
    description: 'Fundraising campaign for Nairobi Orphanage expansion project'
  },
  {
    id: 'MA-001235',
    name: 'Youth Savings Circle',
    type: 'GROUP',
    owner: 'James Atieno',
    ownerType: 'USER',
    balance: 1800000,
    currency: 'KES',
    status: 'ACTIVE',
    riskLevel: 'HIGH',
    pendingDistributions: 0,
    lastActivity: '2025-09-09T14:20:00Z',
    createdAt: '2025-08-15T09:45:00Z',
    description: 'Monthly contributions for youth entrepreneur funding'
  },
  {
    id: 'MA-001236',
    name: 'Afrobeat Concert 2025',
    type: 'EVENT',
    owner: 'Party People Entertainment',
    ownerType: 'BUSINESS',
    balance: 42500000,
    currency: 'KES',
    status: 'ACTIVE',
    riskLevel: 'LOW',
    pendingDistributions: 3,
    lastActivity: '2025-09-08T16:10:00Z',
    createdAt: '2025-07-20T11:30:00Z',
    description: 'Ticket sales and vendor payments for upcoming concert'
  },
  {
    id: 'MA-001237',
    name: 'Rural Health Initiative',
    type: 'FUNDRAISER',
    owner: 'Mary Kimani',
    ownerType: 'USER',
    balance: 450000,
    currency: 'KES',
    status: 'FROZEN',
    riskLevel: 'HIGH',
    pendingDistributions: 0,
    lastActivity: '2025-09-07T09:15:00Z',
    createdAt: '2025-09-05T10:20:00Z',
    description: 'Medical supplies funding for rural clinics'
  },
  {
    id: 'MA-001238',
    name: 'Tech Startup Incubator',
    type: 'GROUP',
    owner: 'Innovation Hub Ltd',
    ownerType: 'BUSINESS',
    balance: 5600000,
    currency: 'USD',
    status: 'ACTIVE',
    riskLevel: 'MEDIUM',
    pendingDistributions: 4,
    lastActivity: '2025-09-09T11:40:00Z',
    createdAt: '2025-08-10T13:25:00Z',
    description: 'Shared funding pool for tech startup investments'
  },
  {
    id: 'MA-001239',
    name: 'Community Football Tournament',
    type: 'EVENT',
    owner: 'Nairobi Sports Association',
    ownerType: 'ORGANIZATION',
    balance: 850000,
    currency: 'KES',
    status: 'ACTIVE',
    riskLevel: 'LOW',
    pendingDistributions: 5,
    lastActivity: '2025-09-08T15:50:00Z',
    createdAt: '2025-08-25T09:10:00Z',
    description: 'Registration fees and prize money for local tournament'
  },
  {
    id: 'MA-001240',
    name: 'Women Empowerment Fund',
    type: 'FUNDRAISER',
    owner: 'Equity Foundation',
    ownerType: 'ORGANIZATION',
    balance: 7500000,
    currency: 'KES',
    status: 'ACTIVE',
    riskLevel: 'LOW',
    pendingDistributions: 10,
    lastActivity: '2025-09-10T08:30:00Z',
    createdAt: '2025-07-15T10:45:00Z',
    description: 'Microloans for women-led businesses'
  },
  {
    id: 'MA-001241',
    name: 'Family Investment Club',
    type: 'GROUP',
    owner: 'John Mwangi',
    ownerType: 'USER',
    balance: 3200000,
    currency: 'KES',
    status: 'CLOSED',
    riskLevel: 'MEDIUM',
    pendingDistributions: 0,
    lastActivity: '2025-09-02T12:15:00Z',
    createdAt: '2025-06-10T08:20:00Z',
    description: 'Family savings and investment group'
  }
];

// Dummy alerts data
const dummyAlerts = [
  {
    id: 'ALT-001',
    title: 'High-Risk Account Detected',
    message: 'Youth Savings Circle has been flagged for suspicious activity patterns.',
    severity: 'HIGH',
    accountId: 'MA-001235',
    createdAt: '2025-09-09T13:45:00Z'
  },
  {
    id: 'ALT-002',
    title: 'Large Contribution Alert',
    message: 'Rural Health Initiative received an unusually large contribution requiring review.',
    severity: 'CRITICAL',
    accountId: 'MA-001237',
    createdAt: '2025-09-07T08:30:00Z'
  },
  {
    id: 'ALT-003',
    title: 'Multiple Failed Distributions',
    message: 'Afrobeat Concert 2025 has 3 failed distribution attempts to vendors.',
    severity: 'MEDIUM',
    accountId: 'MA-001236',
    createdAt: '2025-09-08T15:20:00Z'
  },
  {
    id: 'ALT-004',
    title: 'Compliance Review Required',
    message: 'Tech Startup Incubator requires compliance review for international transfers.',
    severity: 'MEDIUM',
    accountId: 'MA-001238',
    createdAt: '2025-09-09T10:15:00Z'
  },
  {
    id: 'ALT-005',
    title: 'Account Approaching Goal',
    message: 'Save Nairobi Orphanage is at 64% of fundraising goal.',
    severity: 'LOW',
    accountId: 'MA-001234',
    createdAt: '2025-09-10T09:45:00Z'
  }
];

const MasterEscrowAccountsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [masterAccounts, setMasterAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortField, setSortField] = useState("lastActivity");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalFunds: 0,
    activeCount: 0,
    frozenCount: 0,
    closedCount: 0,
    highRiskCount: 0,
    pendingDistributions: 0,
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate API fetch with delay
    setTimeout(() => {
      setMasterAccounts(dummyMasterAccounts);
      setAlerts(dummyAlerts);

      // Calculate summary metrics
      const metrics = {
        totalFunds: dummyMasterAccounts.reduce(
          (sum, item) => sum + item.balance,
          0
        ),
        activeCount: dummyMasterAccounts.filter(
          (item) => item.status === "ACTIVE"
        ).length,
        frozenCount: dummyMasterAccounts.filter(
          (item) => item.status === "FROZEN"
        ).length,
        closedCount: dummyMasterAccounts.filter(
          (item) => item.status === "CLOSED"
        ).length,
        highRiskCount: dummyMasterAccounts.filter(
          (item) => item.riskLevel === "HIGH"
        ).length,
        pendingDistributions: dummyMasterAccounts.reduce(
          (sum, item) => sum + item.pendingDistributions,
          0
        ),
      };
      setSummaryMetrics(metrics);

      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    masterAccounts,
    searchQuery,
    typeFilter,
    statusFilter,
    riskFilter,
    activeTab,
    sortField,
    sortDirection,
  ]);

  const applyFilters = () => {
    let result = [...masterAccounts];

    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter((item) => item.type.toLowerCase() === activeTab);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          (item.name && item.name.toLowerCase().includes(query)) ||
          (item.owner && item.owner.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply risk filter
    if (riskFilter !== "all") {
      result = result.filter((item) => item.riskLevel === riskFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      // Handle date fields
      if (sortField === "lastActivity" || sortField === "createdAt") {
        fieldA = new Date(fieldA).getTime();
        fieldB = new Date(fieldB).getTime();
      }

      // Handle numeric fields
      if (sortField === "balance") {
        fieldA = Number(fieldA);
        fieldB = Number(fieldB);
      }

      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAccounts(result);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

  const getTypeIcon = (type) => {
    switch (type) {
      case "FUNDRAISER":
        return (
          <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        );
      case "GROUP":
        return <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "EVENT":
        return (
          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      default:
        return (
          <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export functionality
  const exportData = (format) => {
    // Implement export logic here (CSV, PDF)
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30">
        <div className="w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Master Escrow Accounts
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage fundraisers, groups, events, and more
              </p>
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
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/escrow/master/create")}
              >
                <Plus className="w-4 h-4" />
                Create Account
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto p-6 space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summaryMetrics.totalFunds)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Funds
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {summaryMetrics.activeCount}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span>{summaryMetrics.frozenCount} Frozen</span>
                  <span>•</span>
                  <span>{summaryMetrics.closedCount} Closed</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.highRiskCount}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  High-Risk Accounts
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.pendingDistributions}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Pending Distributions
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 dark:border-slate-700/50 w-fit">
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => setActiveTab("all")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All Accounts
          </motion.button>

          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === "fundraiser"
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => setActiveTab("fundraiser")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DollarSign className="w-4 h-4" />
            Fundraisers
          </motion.button>

          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === "group"
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => setActiveTab("group")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users className="w-4 h-4" />
            Groups
          </motion.button>

          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === "event"
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => setActiveTab("event")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-4 h-4" />
            Events
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search by ID, Name, or Admin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <motion.button
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 flex items-center gap-2 border border-gray-200/50 dark:border-slate-700/50"
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                Filters
                <span className="ml-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {statusFilter !== "all" ||
                  riskFilter !== "all" ||
                  typeFilter !== "all"
                    ? "!"
                    : "0"}
                </span>
              </motion.button>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="FROZEN">Frozen</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-slate-700/70"
                onClick={() => exportData("csv")}
              >
                <Download className="w-4 h-4" />
              </button>

              <select
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split("-");
                  setSortField(field);
                  setSortDirection(direction);
                }}
              >
                <option value="lastActivity-desc">Latest Activity</option>
                <option value="lastActivity-asc">Oldest Activity</option>
                <option value="balance-desc">Highest Balance</option>
                <option value="balance-asc">Lowest Balance</option>
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-slate-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type
                </label>
                <select
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="FUNDRAISER">Fundraiser</option>
                  <option value="GROUP">Group</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Balance Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Date Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex justify-end mt-2">
                <button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg mr-2"
                  onClick={() => {
                    setTypeFilter("all");
                    setStatusFilter("all");
                    setRiskFilter("all");
                    setShowFilters(false);
                  }}
                >
                  Reset Filters
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Accounts List */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 dark:border-r-purple-500 rounded-full animate-spin animation-delay-75" />
                </div>
              </div>
            ) : paginatedAccounts.length === 0 ? (
              <motion.div
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/30 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Master Accounts Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  No master accounts match your current filters. Try adjusting
                  your search criteria or create a new master escrow account.
                </p>
              </motion.div>
            ) : (
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50/80 dark:bg-slate-700/80">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("id")}
                          >
                            Account ID
                            {sortField === "id" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            Name/Title
                            {sortField === "name" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("type")}
                          >
                            Type
                            {sortField === "type" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("owner")}
                          >
                            Owner/Admin
                            {sortField === "owner" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("balance")}
                          >
                            Balance
                            {sortField === "balance" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("status")}
                          >
                            Status
                            {sortField === "status" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSort("riskLevel")}
                          >
                            Risk
                            {sortField === "riskLevel" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-3 h-3" />
                              ) : (
                                <ArrowDown className="w-3 h-3" />
                              ))}
                          </div>
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
                      {paginatedAccounts.map((account, index) => (
                        <motion.tr
                          key={account.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {account.id.slice(0, 8)}...
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {account.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {account.name || "Unnamed Account"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {account.description &&
                              account.description.length > 30
                                ? `${account.description.substring(0, 30)}...`
                                : account.description || "No description"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                {getTypeIcon(account.type)}
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {account.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {account.ownerType === "USER" ? (
                                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                ) : (
                                  <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account.owner || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {account.ownerType || "UNKNOWN"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(
                                account.balance,
                                account.currency
                              )}
                            </div>
                            {account.pendingDistributions > 0 && (
                              <div className="text-xs text-amber-600 dark:text-amber-400">
                                {account.pendingDistributions} pending{" "}
                                {account.pendingDistributions === 1
                                  ? "payout"
                                  : "payouts"}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(account.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRiskBadge(account.riskLevel || "LOW")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                className="p-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  if (account.type === "FUNDRAISER") {
                                    navigate(
                                      `/admin/escrow/fundraiser/${account.id}`
                                    );
                                  } else if (account.type === "GROUP") {
                                    navigate(
                                      `/admin/escrow/group/${account.id}`
                                    );
                                  } else if (account.type === "EVENT") {
                                    navigate(
                                      `/admin/escrow/event/${account.id}`
                                    );
                                  } else {
                                    navigate(
                                      `/admin/escrow/master/${account.id}`
                                    );
                                  }
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </motion.button>

                              <motion.button
                                className={`p-1.5 ${
                                  account.status === "FROZEN"
                                    ? "text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                    : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {account.status === "FROZEN" ? (
                                  <Unlock className="h-4 w-4" />
                                ) : (
                                  <Lock className="h-4 w-4" />
                                )}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700">
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
                            filteredAccounts.length
                          )}
                        </span>
                        of
                        <span className="mx-1 font-medium">
                          {filteredAccounts.length}
                        </span>
                        results
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
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
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
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
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
              </div>
            )}
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl p-5 border border-white/20 dark:border-slate-700/30 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  Alerts
                </h3>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                  {alerts.length}
                </span>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No alerts found
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.severity === "CRITICAL"
                          ? "bg-red-50/70 dark:bg-red-900/20 border-red-100 dark:border-red-800/30"
                          : alert.severity === "HIGH"
                          ? "bg-amber-50/70 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30"
                          : "bg-blue-50/70 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        {alert.severity === "CRITICAL" ? (
                          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        ) : alert.severity === "HIGH" ? (
                          <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-sm font-medium ${
                                alert.severity === "CRITICAL"
                                  ? "text-red-800 dark:text-red-300"
                                  : alert.severity === "HIGH"
                                  ? "text-amber-800 dark:text-amber-300"
                                  : "text-blue-800 dark:text-blue-300"
                              }`}
                            >
                              {alert.title}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(alert.createdAt)}
                            </span>
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              alert.severity === "CRITICAL"
                                ? "text-red-700 dark:text-red-400"
                                : alert.severity === "HIGH"
                                ? "text-amber-700 dark:text-amber-400"
                                : "text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            {alert.message}
                          </p>
                          {alert.accountId && (
                            <div className="mt-2">
                              <motion.button
                                className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  const account = masterAccounts.find(
                                    (acc) => acc.id === alert.accountId
                                  );
                                  if (account) {
                                    if (account.type === "FUNDRAISER") {
                                      navigate(
                                        `/admin/escrow/fundraiser/${account.id}`
                                      );
                                    } else if (account.type === "GROUP") {
                                      navigate(
                                        `/admin/escrow/group/${account.id}`
                                      );
                                    } else if (account.type === "EVENT") {
                                      navigate(
                                        `/admin/escrow/event/${account.id}`
                                      );
                                    } else {
                                      navigate(
                                        `/admin/escrow/master/${account.id}`
                                      );
                                    }
                                  }
                                }}
                              >
                                <Eye className="w-3 h-3" />
                                View Account
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterEscrowAccountsPage;