import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpDown,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  CreditCard,
  DollarSign,
  Target,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  Settings,
  Share2,
  Database,
  LineChart,
  MoreVertical,
  Maximize2,
  CalendarDays,
  Scale,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Timer,
  Award,
  ThumbsUp,
  ThumbsDown,
  Building,
  Wallet,
  Smartphone,
  Banknote,
  Shield,
  Lock,
  UserCheck,
  AlertCircle,
  Flag,
  Gavel,
  BookOpen,
  ClipboardCheck,
  FileSearch,
  ShieldCheck,
  Bell,
  Brain,
  Scan,
  Fingerprint
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const ComplianceReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("quarterly");
  const [selectedRegulation, setSelectedRegulation] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [selectedView, setSelectedView] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Compliance metrics
  const complianceMetrics = {
    overallScore: 94.7,
    kycCompliance: 96.8,
    amlCompliance: 92.4,
    regulatoryCompliance: 95.2,
    dataProtection: 98.1,
    fraudPrevention: 89.3,
    riskAssessment: 93.6,
    auditReadiness: 97.2,
    growth: {
      overall: 2.8,
      kyc: 1.9,
      aml: 4.2,
      regulatory: 3.1,
      dataProtection: 0.7,
      fraud: 6.8,
      risk: 2.3,
      audit: 1.4,
    },
  };

  // Regulatory requirements tracking
  const regulatoryRequirements = [
    {
      regulation: "PCI DSS",
      status: "compliant",
      lastAudit: "2024-12-15",
      nextAudit: "2025-06-15",
      score: 98.5,
      requirements: 12,
      completed: 12,
      criticalIssues: 0,
      minorIssues: 2,
      auditor: "CyberSec Auditors Ltd",
      certificate: "PCI-DSS-2024-WC-001",
    },
    {
      regulation: "GDPR",
      status: "compliant",
      lastAudit: "2024-11-30",
      nextAudit: "2025-05-30",
      score: 95.8,
      requirements: 8,
      completed: 8,
      criticalIssues: 0,
      minorIssues: 3,
      auditor: "Privacy Compliance Co",
      certificate: "GDPR-2024-EU-003",
    },
    {
      regulation: "Central Bank Kenya",
      status: "under_review",
      lastAudit: "2024-10-20",
      nextAudit: "2025-04-20",
      score: 92.1,
      requirements: 15,
      completed: 14,
      criticalIssues: 1,
      minorIssues: 4,
      auditor: "Kenya Compliance Partners",
      certificate: "CBK-2024-FIN-007",
    },
    {
      regulation: "FATF Guidelines",
      status: "action_required",
      lastAudit: "2024-09-10",
      nextAudit: "2025-03-10",
      score: 88.9,
      requirements: 20,
      completed: 17,
      criticalIssues: 2,
      minorIssues: 6,
      auditor: "AML Compliance Experts",
      certificate: "FATF-2024-AML-012",
    },
    {
      regulation: "ISO 27001",
      status: "compliant",
      lastAudit: "2024-08-15",
      nextAudit: "2025-02-15",
      score: 96.3,
      requirements: 114,
      completed: 110,
      criticalIssues: 0,
      minorIssues: 8,
      auditor: "InfoSec Auditors International",
      certificate: "ISO27001-2024-SEC-045",
    },
  ];

  // Risk assessment data
  const riskAssessments = [
    {
      category: "Money Laundering",
      level: "medium",
      score: 65,
      trend: "decreasing",
      lastReview: "2025-01-05",
      controls: 12,
      effectiveControls: 10,
      recommendations: 3,
      dueDate: "2025-02-15",
    },
    {
      category: "Fraud Detection",
      level: "low",
      score: 85,
      trend: "stable",
      lastReview: "2025-01-03",
      controls: 15,
      effectiveControls: 14,
      recommendations: 2,
      dueDate: "2025-03-01",
    },
    {
      category: "Data Privacy",
      level: "low",
      score: 92,
      trend: "improving",
      lastReview: "2024-12-28",
      controls: 18,
      effectiveControls: 17,
      recommendations: 1,
      dueDate: "2025-01-30",
    },
    {
      category: "Operational Risk",
      level: "medium",
      score: 72,
      trend: "improving",
      lastReview: "2024-12-20",
      controls: 20,
      effectiveControls: 16,
      recommendations: 5,
      dueDate: "2025-02-28",
    },
    {
      category: "Cybersecurity",
      level: "high",
      score: 45,
      trend: "stable",
      lastReview: "2024-12-15",
      controls: 25,
      effectiveControls: 18,
      recommendations: 8,
      dueDate: "2025-01-31",
    },
    {
      category: "Regulatory Changes",
      level: "medium",
      score: 78,
      trend: "stable",
      lastReview: "2024-12-10",
      controls: 8,
      effectiveControls: 7,
      recommendations: 2,
      dueDate: "2025-02-10",
    },
  ];

  // Compliance timeline data
  const complianceTimelineData = [
    {
      month: "Jul",
      overall: 91.2,
      kyc: 94.1,
      aml: 87.8,
      regulatory: 92.5,
      fraud: 82.1,
    },
    {
      month: "Aug",
      overall: 92.1,
      kyc: 94.8,
      aml: 88.9,
      regulatory: 93.2,
      fraud: 84.3,
    },
    {
      month: "Sep",
      overall: 92.8,
      kyc: 95.2,
      aml: 89.7,
      regulatory: 93.8,
      fraud: 85.9,
    },
    {
      month: "Oct",
      overall: 93.4,
      kyc: 95.9,
      aml: 90.5,
      regulatory: 94.1,
      fraud: 87.2,
    },
    {
      month: "Nov",
      overall: 94.1,
      kyc: 96.3,
      aml: 91.2,
      regulatory: 94.7,
      fraud: 88.6,
    },
    {
      month: "Dec",
      overall: 94.7,
      kyc: 96.8,
      aml: 92.4,
      regulatory: 95.2,
      fraud: 89.3,
    },
  ];

  // Audit findings data
  const auditFindings = [
    {
      finding: "KYC document verification delay",
      severity: "medium",
      regulation: "Central Bank Kenya",
      dateIdentified: "2024-12-20",
      dueDate: "2025-01-31",
      status: "in_progress",
      assignee: "Sarah K. (Compliance)",
      description: "Average verification time exceeds 48-hour requirement",
      remediation: "Implement automated document processing system",
    },
    {
      finding: "Incomplete transaction monitoring logs",
      severity: "high",
      regulation: "FATF Guidelines",
      dateIdentified: "2024-12-15",
      dueDate: "2025-01-15",
      status: "overdue",
      assignee: "Michael B. (AML Team)",
      description:
        "15% of high-value transactions lack complete monitoring records",
      remediation:
        "Update monitoring system and train staff on logging requirements",
    },
    {
      finding: "Data retention policy gaps",
      severity: "low",
      regulation: "GDPR",
      dateIdentified: "2024-12-10",
      dueDate: "2025-02-28",
      status: "planned",
      assignee: "Lisa M. (Data Protection)",
      description: "Some data categories lack clear retention schedules",
      remediation: "Develop comprehensive data retention matrix",
    },
    {
      finding: "Incident response documentation",
      severity: "medium",
      regulation: "ISO 27001",
      dateIdentified: "2024-12-05",
      dueDate: "2025-01-20",
      status: "completed",
      assignee: "John D. (IT Security)",
      description: "Incident response procedures need detailed documentation",
      remediation: "Create detailed incident response playbooks",
    },
  ];

  // Training and awareness data
  const trainingData = [
    {
      program: "AML/CFT Training",
      completionRate: 94.2,
      participants: 342,
      completed: 322,
      pending: 20,
      lastSession: "2024-12-15",
      nextSession: "2025-02-15",
      certificationValid: 298,
      certificationExpiring: 24,
    },
    {
      program: "Data Protection Training",
      completionRate: 96.8,
      participants: 285,
      completed: 276,
      pending: 9,
      lastSession: "2024-11-30",
      nextSession: "2025-01-30",
      certificationValid: 265,
      certificationExpiring: 11,
    },
    {
      program: "Fraud Prevention Training",
      completionRate: 89.1,
      participants: 198,
      completed: 176,
      pending: 22,
      lastSession: "2024-12-20",
      nextSession: "2025-03-20",
      certificationValid: 168,
      certificationExpiring: 8,
    },
    {
      program: "Cybersecurity Awareness",
      completionRate: 91.7,
      participants: 412,
      completed: 378,
      pending: 34,
      lastSession: "2024-12-10",
      nextSession: "2025-02-10",
      certificationValid: 352,
      certificationExpiring: 26,
    },
  ];

  const refreshData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      compliant: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      under_review: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
      },
      action_required: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
      in_progress: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Activity,
      },
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
      },
      overdue: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertTriangle,
      },
      planned: {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        icon: Calendar,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace(/_/g, " ").charAt(0).toUpperCase() +
          status.replace(/_/g, " ").slice(1)}
      </span>
    );
  };

  const getRiskLevelBadge = (level: string) => {
    const levelConfig = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          levelConfig[level as keyof typeof levelConfig]
        }`}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          severityConfig[severity as keyof typeof severityConfig]
        }`}
      >
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const formatPercentage = (num: number, decimals: number = 1) => {
    return `${num.toFixed(decimals)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatPercentage(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-[1800px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Compliance & Risk Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Comprehensive regulatory compliance monitoring and risk assessment
            dashboard
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Compliance Status: Active</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last audit: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="monthly">Monthly View</option>
            <option value="quarterly">Quarterly View</option>
            <option value="yearly">Annual View</option>
            <option value="custom">Custom Range</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedRegulation}
            onChange={(e) => setSelectedRegulation(e.target.value)}
          >
            <option value="all">All Regulations</option>
            <option value="pci_dss">PCI DSS</option>
            <option value="gdpr">GDPR</option>
            <option value="cbk">Central Bank Kenya</option>
            <option value="fatf">FATF Guidelines</option>
            <option value="iso27001">ISO 27001</option>
          </select>
          <motion.button
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm shadow-sm"
            onClick={refreshData}
            disabled={refreshing}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ y: 0 }}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
              strokeWidth={2}
            />
            {refreshing ? "Updating..." : "Refresh"}
          </motion.button>
          <motion.button
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-sm shadow-lg"
            whileHover={{
              y: -2,
              boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
            }}
            whileTap={{ y: 0 }}
          >
            <Download size={16} className="mr-2" strokeWidth={2} />
            Export Compliance Report
          </motion.button>
        </div>
      </motion.div>

      {/* Compliance Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
        <motion.div
          className="col-span-1 lg:col-span-2 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Overall Compliance Score
              </p>
              <p className="text-4xl font-bold mt-1">
                {formatPercentage(complianceMetrics.overallScore)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  +{formatPercentage(complianceMetrics.growth.overall)} vs last
                  period
                </span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                KYC Compliance
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatPercentage(complianceMetrics.kycCompliance)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{formatPercentage(complianceMetrics.growth.kyc)}
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                AML Compliance
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatPercentage(complianceMetrics.amlCompliance)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{formatPercentage(complianceMetrics.growth.aml)}
                </span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Data Protection
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatPercentage(complianceMetrics.dataProtection)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{formatPercentage(complianceMetrics.growth.dataProtection)}
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Fraud Prevention
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatPercentage(complianceMetrics.fraudPrevention)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{formatPercentage(complianceMetrics.growth.fraud)}
                </span>
              </div>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Scan className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                Audit Readiness
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {formatPercentage(complianceMetrics.auditReadiness)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{formatPercentage(complianceMetrics.growth.audit)}
                </span>
              </div>
            </div>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Trend Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Compliance Trends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monthly compliance scores across key areas
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Maximize2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={complianceTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis
                  domain={[80, 100]}
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Overall"
                  dot={{ fill: "#10B981", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="kyc"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="KYC"
                />
                <Line
                  type="monotone"
                  dataKey="aml"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="AML"
                />
                <Line
                  type="monotone"
                  dataKey="regulatory"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  name="Regulatory"
                />
                <Line
                  type="monotone"
                  dataKey="fraud"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Fraud Prevention"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Assessment Matrix */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Risk Assessment Matrix
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current risk levels across operational categories
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {riskAssessments.map((risk, index) => (
              <motion.div
                key={risk.category}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        risk.level === "low"
                          ? "bg-green-500"
                          : risk.level === "medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {risk.category}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last reviewed: {formatDate(risk.lastReview)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getRiskLevelBadge(risk.level)}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Score: {risk.score}/100
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Risk Score
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {risk.score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      risk.score >= 80
                        ? "bg-green-500"
                        : risk.score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${risk.score}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Controls</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {risk.effectiveControls}/{risk.controls}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Actions</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {risk.recommendations}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatDate(risk.dueDate)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Regulatory Requirements Status */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Regulatory Compliance Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current compliance status across all regulatory frameworks
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30">
              Schedule Audit
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Regulation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Requirements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Next Audit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {regulatoryRequirements.map((regulation) => (
                <tr
                  key={regulation.regulation}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {regulation.regulation}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {regulation.auditor}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(regulation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium ${
                            regulation.score >= 95
                              ? "text-green-600 dark:text-green-400"
                              : regulation.score >= 90
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatPercentage(regulation.score)}
                        </div>
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                          <div
                            className={`h-1 rounded-full ${
                              regulation.score >= 95
                                ? "bg-green-500"
                                : regulation.score >= 90
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${regulation.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {regulation.completed}/{regulation.requirements}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatPercentage(
                        (regulation.completed / regulation.requirements) * 100
                      )}{" "}
                      complete
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {regulation.criticalIssues > 0 && (
                        <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {regulation.criticalIssues} Critical
                        </div>
                      )}
                      {regulation.minorIssues > 0 && (
                        <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {regulation.minorIssues} Minor
                        </div>
                      )}
                      {regulation.criticalIssues === 0 &&
                        regulation.minorIssues === 0 && (
                          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            No Issues
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(regulation.nextAudit)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.ceil(
                        (new Date(regulation.nextAudit).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="View Certificate"
                      >
                        <Award className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Generate Report"
                      >
                        <FileText className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Audit Findings and Training */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Audit Findings */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Recent Audit Findings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Outstanding issues requiring attention
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full">
                1 Overdue
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {auditFindings.map((finding, index) => (
              <motion.div
                key={finding.finding}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSeverityBadge(finding.severity)}
                      {getStatusBadge(finding.status)}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {finding.finding}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {finding.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Remediation:</strong> {finding.remediation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Regulation: {finding.regulation}</span>
                  <span>Due: {formatDate(finding.dueDate)}</span>
                </div>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  Assigned to: {finding.assignee}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Training & Awareness */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Training & Awareness
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Staff certification and training completion rates
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {trainingData.map((training, index) => (
              <motion.div
                key={training.program}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {training.program}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {training.completed}/{training.participants} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        training.completionRate >= 95
                          ? "text-green-600 dark:text-green-400"
                          : training.completionRate >= 90
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatPercentage(training.completionRate)}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      training.completionRate >= 95
                        ? "bg-green-500"
                        : training.completionRate >= 90
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${training.completionRate}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {training.pending}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Expiring Soon
                    </p>
                    <p className="font-semibold text-orange-600 dark:text-orange-400">
                      {training.certificationExpiring}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Next session: {formatDate(training.nextSession)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Executive Summary */}
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-white dark:text-gray-100">
              Executive Compliance Summary
            </h3>
            <p className="text-gray-300 dark:text-gray-300 text-lg">
              Strategic compliance overview for leadership and board reporting
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400 dark:text-gray-400">
                Compliance Health
              </p>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-green-400 dark:text-green-400" />
                <span className="text-xl font-bold text-green-400 dark:text-green-400">
                  Strong
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 rounded-full flex items-center justify-center">
              <Gavel className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Compliance Status */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/20 dark:bg-green-500/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400 dark:text-green-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Compliance Status
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Overall Score:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  94.7%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Regulations:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  5/5 Compliant
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Critical Issues:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  3 Open
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Next Audit:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  Feb 15
                </span>
              </li>
            </ul>
          </div>

          {/* Risk Management */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-500/20 dark:bg-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-400 dark:text-yellow-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Risk Management
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  High Risk Areas:
                </span>
                <span className="font-semibold text-yellow-400 dark:text-yellow-300">
                  1
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Medium Risk:
                </span>
                <span className="font-semibold text-yellow-400 dark:text-yellow-300">
                  3
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Controls Active:
                </span>
                <span className="font-semibold text-yellow-400 dark:text-yellow-300">
                  98/108
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Risk Trend:
                </span>
                <span className="font-semibold text-yellow-400 dark:text-yellow-300">
                  Improving
                </span>
              </li>
            </ul>
          </div>

          {/* Training & Awareness */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-400 dark:text-blue-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Training Status
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Avg Completion:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  92.9%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Staff Certified:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  1,083/1,237
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Expiring Soon:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  69
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Programs:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  4 Active
                </span>
              </li>
            </ul>
          </div>

          {/* Action Items */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg">
                <ClipboardCheck className="w-6 h-6 text-purple-400 dark:text-purple-300" />
              </div>
              <h4 className="font-bold text-lg text-white dark:text-gray-100">
                Action Items
              </h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Overdue Items:
                </span>
                <span className="font-semibold text-red-400 dark:text-red-300">
                  1
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Due This Week:
                </span>
                <span className="font-semibold text-orange-400 dark:text-orange-300">
                  3
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  In Progress:
                </span>
                <span className="font-semibold text-blue-400 dark:text-blue-300">
                  8
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-300 dark:text-gray-300">
                  Completed:
                </span>
                <span className="font-semibold text-green-400 dark:text-green-300">
                  47
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10 mb-6">
          <h4 className="text-xl font-bold mb-4 flex items-center text-white dark:text-gray-100">
            <Brain className="w-6 h-6 text-blue-400 dark:text-blue-300 mr-2" />
            Strategic Compliance Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-green-400 dark:text-green-300">
                Immediate Actions
              </h5>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-300">
                <li>• Address overdue AML monitoring compliance issue</li>
                <li>• Complete cybersecurity risk assessment update</li>
                <li>• Renew 69 expiring staff certifications</li>
                <li>• Schedule Q2 2025 regulatory audit preparation</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-blue-400 dark:text-blue-300">
                Process Improvements
              </h5>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-300">
                <li>• Implement automated compliance monitoring</li>
                <li>• Enhance real-time risk detection systems</li>
                <li>• Streamline audit documentation processes</li>
                <li>• Deploy AI-powered regulatory change tracking</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-purple-400 dark:text-purple-300">
                Strategic Initiatives
              </h5>
              <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-300">
                <li>• Establish compliance center of excellence</li>
                <li>• Develop integrated GRC platform</li>
                <li>• Create predictive compliance analytics</li>
                <li>• Implement continuous audit methodology</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Compliance Forecast */}
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 dark:from-green-600/30 dark:to-blue-600/30 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/10">
          <h4 className="text-xl font-bold mb-4 flex items-center text-white dark:text-gray-100">
            <TrendingUp className="w-6 h-6 text-green-400 dark:text-green-300 mr-2" />
            Q2 2025 Compliance Forecast
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                Projected Score
              </p>
              <p className="text-2xl font-bold text-green-400 dark:text-green-300">
                96.2%
              </p>
              <p className="text-sm text-green-400 dark:text-green-300">
                +1.5% improvement
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                Risk Reduction
              </p>
              <p className="text-2xl font-bold text-blue-400 dark:text-blue-300">
                15%
              </p>
              <p className="text-sm text-blue-400 dark:text-blue-300">
                High-risk areas
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                Automation Rate
              </p>
              <p className="text-2xl font-bold text-purple-400 dark:text-purple-300">
                78%
              </p>
              <p className="text-sm text-purple-400 dark:text-purple-300">
                +23% increase
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                Cost Savings
              </p>
              <p className="text-2xl font-bold text-orange-400 dark:text-orange-300">
                $340K
              </p>
              <p className="text-sm text-orange-400 dark:text-orange-300">
                Annual reduction
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Quick Actions & Reports
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Streamline compliance management with automated workflows
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 group"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Generate Compliance Report
                </h4>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Full regulatory summary
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 group"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Schedule Audit
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  External compliance review
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 group"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(147, 51, 234, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Scan className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <h4 className="font-medium text-purple-800 dark:text-purple-200">
                  Risk Assessment
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Comprehensive analysis
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 group"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <div className="text-left">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">
                  Training Dashboard
                </h4>
                <p className="text-xs text-orange-600 dark:text-orange-300">
                  Staff certification portal
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Additional Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Bell className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Alerts
              </span>
            </div>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              3
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Require attention
            </p>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Pending
              </span>
            </div>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              12
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Action items
            </p>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Fingerprint className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Audits
              </span>
            </div>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              5
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This quarter
            </p>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Award className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Certificates
              </span>
            </div>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              98%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Valid & current
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplianceReportsPage;