import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Sliders,
  UserX,
  Globe,
  FileCheck,
  BarChart3,
  PieChart,
  Eye,
  Flag,
  Plus,
} from "lucide-react";
import { Modal } from "../../../../components/common/Modal";
import BlacklistWhitelistManager from "./blacklistwhitelistmanager";
import SuspiciousActivityMonitor from "./suspiciousactivitymonitor";
import AMLRulesConfiguration from "./amlrulesconfiguration";
import financeService from "../../../../api/services/finance";
import { AMLAlert, GroupedCount, RiskMetrics } from "../../../../types/finance";
import ViewAlertModal from "../../../../components/finance/ViewAlertModal";
import UpdateAlertModal from "../../../../components/finance/UpdateAlertModal";
import renderDashboard from "../../../../components/finance/renderDashboard";

const AMLComplianceDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<AMLAlert[]>([]);
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "blacklist" | "activity" | "rules"
  >("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "under_review" | "escalated" | "resolved" | "false_positive"
  >("all");
  const [riskFilter, setRiskFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [timeframeFilter, setTimeframeFilter] = useState<
    "24h" | "7d" | "30d" | "all"
  >("7d");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AMLAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"view" | "update" | null>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAMLData();
  }, []);

  const fetchAMLData = async () => {
    setIsLoading(true);
    try {
      const response = await financeService.getAMLChecks();

      if (response && response.data) {
        const processedAlerts = response.data.amlAlerts.map((alert) => ({
          ...alert,
          userName: `User ${alert.userUuid.substring(0, 8)}`,
        }));

        setAlerts(processedAlerts);

        calculateMetrics(response.data.groupedCounts, processedAlerts);
      } else {
        throw new Error("Invalid response format");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch AML data", error);
      setErrorMessage("Failed to load AML compliance data");
      setIsLoading(false);
    }
  };

  const calculateMetrics = (
    groupedCounts: GroupedCount[],
    alerts: AMLAlert[]
  ) => {
    const alertTypes = alerts.reduce((acc, alert) => {
      const typeName = formatAlertType(alert.AlertType.name);
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const alertsByType = Object.entries(alertTypes).map(([name, value]) => ({
      name,
      value,
    }));

    let highRiskAlerts = 0;
    let mediumRiskAlerts = 0;
    let lowRiskAlerts = 0;
    let newAlerts = 0;
    let underReviewAlerts = 0;
    let escalatedAlerts = 0;
    let resolvedAlerts = 0;

    groupedCounts.forEach((group) => {
      const totalInGroup =
        group.statuses.new +
        group.statuses.under_review +
        group.statuses.escalated +
        group.statuses.resolved;

      if (group.riskLevelName === "high") {
        highRiskAlerts += totalInGroup;
      } else if (group.riskLevelName === "medium") {
        mediumRiskAlerts += totalInGroup;
      } else if (group.riskLevelName === "low") {
        lowRiskAlerts += totalInGroup;
      }

      newAlerts += group.statuses.new;
      underReviewAlerts += group.statuses.under_review;
      escalatedAlerts += group.statuses.escalated;
      resolvedAlerts += group.statuses.resolved;
    });

    const totalAlerts =
      newAlerts + underReviewAlerts + escalatedAlerts + resolvedAlerts;

    const falsePositives = alerts.filter(
      (a) => a.status === "false_positive"
    ).length;

    const alertsByRisk = [
      { name: "High", value: highRiskAlerts },
      { name: "Medium", value: mediumRiskAlerts },
      { name: "Low", value: lowRiskAlerts },
    ];

    setMetrics({
      totalAlerts,
      newAlerts,
      underReviewAlerts,
      escalatedAlerts,
      resolvedAlerts,
      falsePositives,
      highRiskAlerts,
      mediumRiskAlerts,
      lowRiskAlerts,
      alertsByType,
      alertsByRisk,
    });
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      alert.userUuid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || alert.status === statusFilter;
    const matchesRisk =
      riskFilter === "all" || alert.RiskLevel.name === riskFilter;

    if (timeframeFilter === "all")
      return matchesSearch && matchesStatus && matchesRisk;

    const alertDate = new Date(alert.createdAt);
    const now = new Date();
    const timeDiff = now.getTime() - alertDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    const matchesTimeframe =
      (timeframeFilter === "24h" && daysDiff <= 1) ||
      (timeframeFilter === "7d" && daysDiff <= 7) ||
      (timeframeFilter === "30d" && daysDiff <= 30);

    return matchesSearch && matchesStatus && matchesRisk && matchesTimeframe;
  });

  const handleStatusUpdate = (
    alertId: string,
    newStatus: AMLAlert["status"],
    resolution?: string
  ) => {
    const updatedAlerts = alerts.map((alert) => {
      if (alert.id === alertId) {
        const updatedAlert = { ...alert, status: newStatus };

        if (newStatus === "under_review" && alert.status === "new") {
          updatedAlert.assignedTo = "Current Compliance Officer";
          updatedAlert.reviewedAt = new Date().toISOString();
        } else if (newStatus === "escalated") {
          updatedAlert.assignedTo = "Senior Compliance Manager";
          updatedAlert.reviewedAt = new Date().toISOString();
        } else if (newStatus === "resolved" || newStatus === "false_positive") {
          updatedAlert.resolvedAt = new Date().toISOString();
          // if (resolution) updatedAlert.resolution = resolution;
        }

        return updatedAlert;
      }
      return alert;
    });

    setAlerts(updatedAlerts);

    const actionText =
      newStatus === "under_review"
        ? "marked for review"
        : newStatus === "escalated"
        ? "escalated"
        : newStatus === "resolved"
        ? "resolved"
        : "marked as false positive";

    showSuccess(`AML alert successfully ${actionText}`);

    // Reset states
    setIsModalOpen(false);
    setModalType(null);
    setSelectedAlert(null);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage(null);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const openAlertViewModal = (alert: AMLAlert) => {
    setSelectedAlert(alert);
    setModalType("view");
    setIsModalOpen(true);
  };

  const openUpdateStatusModal = (alert: AMLAlert) => {
    setSelectedAlert(alert);
    setModalType("update");
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAlertType = (type: string) => {
    switch (type) {
      case "high_frequency":
        return "High Frequency";
      case "high_volume":
        return "High Volume";
      case "unusual_pattern":
        return "Unusual Pattern";
      case "restricted_country":
        return "Restricted Country";
      case "multiple_accounts":
        return "Multiple Accounts";
      case "structured_transactions":
        return "Structured Transactions";
      case "watchlist_match":
        return "Watchlist Match";
      default:
        return type
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50";
      case "under_review":
        return "bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50";
      case "escalated":
        return "bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50";
      case "resolved":
        return "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50";
      case "false_positive":
        return "bg-gray-50 text-gray-600 border border-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50";
      case "medium":
        return "bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50";
      case "high":
        return "bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case "low":
        return <AlertCircle className="w-4 h-4" />;
      case "medium":
        return <AlertCircle className="w-4 h-4" />;
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="w-4 h-4" />;
      case "under_review":
        return <Eye className="w-4 h-4" />;
      case "escalated":
        return <Flag className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "false_positive":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "high_frequency":
      case "high_volume":
        return (
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case "unusual_pattern":
        return (
          <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        );
      case "restricted_country":
        return <Globe className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "multiple_accounts":
        return (
          <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      case "structured_transactions":
        return <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "watchlist_match":
        return (
          <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      default:
        return (
          <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const getModalTitle = () => {
    if (!selectedAlert) return "";

    switch (modalType) {
      case "view":
        return `AML Alert: ${formatAlertType(selectedAlert.AlertType.name)}`;
      case "update":
        return "Update Alert Status";
      default:
        return "";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard({
          metrics,
          alerts,
          isLoading,
          searchQuery,
          setSearchQuery,
          filterOpen,
          setFilterOpen,
          statusFilter,
          setStatusFilter: (filter: string) =>
            setStatusFilter(
              filter as
                | "all"
                | "new"
                | "under_review"
                | "escalated"
                | "resolved"
                | "false_positive"
            ),
          riskFilter,
          setRiskFilter: (filter: string) =>
            setRiskFilter(filter as "all" | "low" | "medium" | "high"),
          timeframeFilter,
          setTimeframeFilter: (filter: string) =>
            setTimeframeFilter(filter as "all" | "24h" | "7d" | "30d"),
          filteredAlerts,
          fetchAMLData,
          openAlertViewModal,
          openUpdateStatusModal,
          getAlertTypeIcon,
          getRiskLevelColor,
          getRiskLevelIcon,
          getStatusColor,
          getStatusIcon,
          formatAlertType,
        });
      case "blacklist":
        return <BlacklistWhitelistManager />;
      case "activity":
        return <SuspiciousActivityMonitor />;
      case "rules":
        return <AMLRulesConfiguration />;
      default:
        return renderDashboard({
          metrics,
          alerts,
          isLoading,
          searchQuery,
          setSearchQuery,
          filterOpen,
          setFilterOpen,
          statusFilter,
          setStatusFilter,
          riskFilter,
          setRiskFilter,
          timeframeFilter,
          setTimeframeFilter,
          filteredAlerts,
          fetchAMLData,
          openAlertViewModal,
          openUpdateStatusModal,
          getAlertTypeIcon,
          getRiskLevelColor,
          getRiskLevelIcon,
          getStatusColor,
          getStatusIcon,
          formatAlertType,
        });
    }
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-900 font-['SF Pro Display', 'Inter', sans-serif]">
      <div className="w-full mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                AML & Compliance Monitoring
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Monitor suspicious activities, manage compliance controls, and
                configure AML rules
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                <span>New Rule</span>
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all text-sm">
                <Download size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Success and Error Messages */}
          {successMessage && (
            <div className="mb-5 flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-800/50 text-green-700 dark:text-green-300 animate-fadeIn">
              <div className="p-1 bg-green-100 dark:bg-green-800/70 rounded-full">
                <CheckCircle2
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-100 dark:border-red-800/50 text-red-700 dark:text-red-300 animate-fadeIn">
              <div className="p-1 bg-red-100 dark:bg-red-800/70 rounded-full">
                <AlertTriangle
                  size={16}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto scrollbar-hide mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Shield size={16} className="mr-2" />
              Dashboard
            </button>
            <button
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "blacklist"
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70"
              }`}
              onClick={() => setActiveTab("blacklist")}
            >
              <UserX size={16} className="mr-2" />
              Blacklist/Whitelist
            </button>
            <button
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "activity"
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              <AlertTriangle size={16} className="mr-2" />
              Suspicious Activity
            </button>
            <button
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "rules"
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70"
              }`}
              onClick={() => setActiveTab("rules")}
            >
              <Sliders size={16} className="mr-2" />
              AML Rules
            </button>
          </div>

          {renderTabContent()}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalType(null);
          setSelectedAlert(null);
        }}
        title={getModalTitle()}
        size="md"
      >
        {modalType === "view" && selectedAlert && (
          <ViewAlertModal
            selectedAlert={selectedAlert}
            setIsModalOpen={setIsModalOpen}
            openUpdateStatusModal={openUpdateStatusModal}
            getRiskLevelColor={getRiskLevelColor}
            getRiskLevelIcon={getRiskLevelIcon}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            formatAlertType={formatAlertType}
            formatDate={formatDate}
          />
        )}

        {modalType === "update" && selectedAlert && (
          <UpdateAlertModal
            selectedAlert={selectedAlert}
            setIsModalOpen={setIsModalOpen}
            handleStatusUpdate={handleStatusUpdate}
            getRiskLevelColor={getRiskLevelColor}
            getRiskLevelIcon={getRiskLevelIcon}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            formatAlertType={formatAlertType}
          />
        )}
      </Modal>

      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
    </div>
  );
};

function Layers(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className || ""}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
  );
}

function Users(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className || ""}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

export default AMLComplianceDashboard;
