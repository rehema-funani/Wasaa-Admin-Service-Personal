import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  RotateCcw,
  CreditCard,
  Gift,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Info,
  UserCheck,
  Loader,
  ChevronRight,
  ChevronLeft,
  Eye,
  ArrowLeft,
  Users,
  MessageSquare,
  FileText,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  Lock,
  Mail,
  ExternalLink
} from "lucide-react";
import { format, subDays, formatDistance, addDays, isFuture } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Mock data service for refunds and chargebacks
const refundService = {
  getRefundsAndChargebacks: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const refundsAndChargebacks = Array.from({ length: 40 }).map((_, index) => {
          // Generate random refund/chargeback data
          const types = ["refund", "chargeback"];
          const type = types[Math.floor(Math.random() * types.length)];
          
          // Different statuses based on type
          let statuses;
          if (type === "refund") {
            statuses = ["completed", "pending", "processing", "rejected", "approved", "cancelled"];
          } else { // chargeback
            statuses = ["pending", "disputed", "settled", "lost"];
          }
          
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Random amounts
          const amount = Math.floor(Math.random() * 10000) + 100;
          
          // Random dates in the last 60 days
          const daysAgo = Math.floor(Math.random() * 60);
          const createdAt = subDays(new Date(), daysAgo);
          
          // Random request reasons
          const requestReasons = [
            "Accidental donation",
            "Donation error",
            "Campaign concerns",
            "Changed mind",
            "Duplicate transaction",
            "Fraudulent transaction",
            "Unauthorized payment",
            "Disputed amount"
          ];
          
          // For chargebacks, determine if it's within the dispute window
          const disputeDeadline = type === "chargeback" ? addDays(createdAt, 45) : null;
          const withinDisputeWindow = type === "chargeback" ? isFuture(disputeDeadline) : false;
          
          // Automatically create some communication logs
          const communicationCount = Math.floor(Math.random() * 5);
          const communications = Array.from({ length: communicationCount }).map((_, i) => {
            const communicationType = ["email", "chat", "note", "call"][Math.floor(Math.random() * 4)];
            const fromActor = ["admin", "donor", "system", "bank"][Math.floor(Math.random() * 4)];
            
            return {
              id: `comm-${index}-${i}`,
              type: communicationType,
              from: fromActor,
              timestamp: subDays(new Date(), daysAgo - i),
              content: fromActor === "system" 
                ? "Automatic notification sent to user about refund status change."
                : fromActor === "donor"
                ? "I would like to request a refund because I made this donation by mistake."
                : fromActor === "admin"
                ? "Processed refund request after verifying donor identity and reason."
                : "Bank has initiated a chargeback investigation for this transaction.",
              subject: communicationType === "email" ? "Refund Request Update" : null
            };
          }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          // Automated rules that might apply
          const autoRules = [
            "30-day money back guarantee",
            "Duplicate payment auto-refund",
            "Small amount express refund",
            "First-time donor goodwill refund",
            "Suspicious activity auto-refund"
          ];
          
          const eligibleForAutoRefund = Math.random() < 0.3;
          const autoRule = eligibleForAutoRefund ? autoRules[Math.floor(Math.random() * autoRules.length)] : null;
          
          // Random priority
          const priorities = ["low", "medium", "high", "critical"];
          const priorityWeight = type === "chargeback" ? [0.1, 0.2, 0.4, 0.3] : [0.4, 0.3, 0.2, 0.1];
          
          let priority;
          const rand = Math.random();
          let cumulativeWeight = 0;
          
          for (let i = 0; i < priorities.length; i++) {
            cumulativeWeight += priorityWeight[i];
            if (rand <= cumulativeWeight) {
              priority = priorities[i];
              break;
            }
          }
          
          // Campaign data
          const campaignTitles = [
            "Medical Fund for Sarah",
            "Build a School in Nakuru",
            "Emergency Relief for Flood Victims",
            "Support Local Artists Initiative",
            "Children's Cancer Treatment Fund",
            "Community Garden Project",
            "Elderly Care Program",
            "Youth Sports Equipment Drive",
            "Scholarship for Underprivileged Students",
            "Wildlife Conservation Effort"
          ];
          
          // Documentation status
          const documentationStatus = Math.random() < 0.7 ? "complete" : "incomplete";
          
          // Bank reference and evidence data
          const hasBankReference = type === "chargeback" || Math.random() < 0.3;
          const bankReference = hasBankReference ? `BRF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}` : null;
          
          const evidenceTypes = [
            "Donor confirmation email",
            "Transaction receipt",
            "IP address logs",
            "Communication records",
            "Identity verification",
            "Banking records"
          ];
          
          const hasEvidence = Math.random() < 0.6;
          const evidenceDocuments = hasEvidence 
            ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => ({
                id: `doc-${index}-${i}`,
                type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
                filename: `evidence_${index}_${i}.pdf`,
                uploadDate: subDays(new Date(), daysAgo - Math.floor(Math.random() * 3)),
                fileSize: `${Math.floor(Math.random() * 5) + 1}MB`
              }))
            : [];
          
          // For refunds, determine if eligible for auto-approval based on rules
          const eligibleForAutoApproval = type === "refund" && 
            (amount < 1000 || daysAgo < 7) && 
            Math.random() < 0.7;
          
          return {
            id: `${type}-${index + 1000}`,
            type,
            status,
            amount,
            createdAt,
            updatedAt: subDays(createdAt, Math.floor(Math.random() * 2)),
            currency: "KES",
            donationId: `don-${Math.floor(Math.random() * 10000) + 1}`,
            campaignId: `camp-${Math.floor(Math.random() * 20) + 1}`,
            campaignTitle: campaignTitles[Math.floor(Math.random() * campaignTitles.length)],
            userId: `user-${Math.floor(Math.random() * 50) + 1}`,
            userName: `${["John", "Mary", "Peter", "Sarah", "David"][Math.floor(Math.random() * 5)]} ${["Doe", "Smith", "Johnson", "Kimani", "Ochieng"][Math.floor(Math.random() * 5)]}`,
            userEmail: `user${Math.floor(Math.random() * 1000)}@example.com`,
            paymentMethod: ["wallet", "mpesa", "card", "bank_transfer"][Math.floor(Math.random() * 4)],
            referenceNumber: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
            requestReason: requestReasons[Math.floor(Math.random() * requestReasons.length)],
            notes: Math.random() > 0.6 ? "Donor called to explain refund situation in detail" : null,
            communications,
            autoRule,
            eligibleForAutoRefund,
            eligibleForAutoApproval,
            priority,
            documentationStatus,
            bankReference,
            evidenceDocuments,
            disputeDeadline,
            withinDisputeWindow,
            // For chargebacks, determine if we have responded to the bank yet
            bankResponseSubmitted: type === "chargeback" ? Math.random() < 0.6 : null,
            // Decision maker
            processedBy: status === "completed" || status === "rejected" || status === "approved" 
              ? `admin-${Math.floor(Math.random() * 10) + 1}` 
              : null,
            // For auto-approved or auto-rejected
            automaticDecision: Math.random() < 0.3,
            decisionReason: status === "completed" || status === "rejected" || status === "approved" 
              ? Math.random() < 0.3 
                ? "Auto-approved based on refund policy" 
                : "Reviewed and approved by admin after verification" 
              : null
          };
        });
        
        resolve({
          data: refundsAndChargebacks,
          pagination: {
            page: 1,
            limit: 20,
            total: 40
          }
        });
      }, 1000);
    });
  }
};

// Status Badge Component
const StatusBadge = ({ status, type }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <Info size={12} className="mr-1.5" />;
  
  if (type === "chargeback") {
    switch (status) {
      case "pending":
        bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "disputed":
        bgColor = "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
        icon = <AlertOctagon size={12} className="mr-1.5" />;
        break;
      case "settled":
        bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "lost":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <XCircle size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  } else {
    switch (status) {
      case "completed":
        bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "approved":
        bgColor = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        icon = <ThumbsUp size={12} className="mr-1.5" />;
        break;
      case "pending":
        bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "processing":
        bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <RefreshCw size={12} className="mr-1.5" />;
        break;
      case "rejected":
      case "cancelled":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <XCircle size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <Info size={12} className="mr-1.5" />;
  
  switch (priority) {
    case "low":
      bgColor = "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      icon = <Info size={12} className="mr-1.5" />;
      break;
    case "medium":
      bgColor = "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      icon = <AlertTriangle size={12} className="mr-1.5" />;
      break;
    case "high":
      bgColor = "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
      icon = <AlertTriangle size={12} className="mr-1.5" />;
      break;
    case "critical":
      bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      icon = <AlertOctagon size={12} className="mr-1.5" />;
      break;
    default:
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

// Documentation Badge Component
const DocumentationBadge = ({ status }) => {
  let bgColor = status === "complete" 
    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
    : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    
  let icon = status === "complete" 
    ? <CheckCircle size={12} className="mr-1.5" /> 
    : <AlertTriangle size={12} className="mr-1.5" />;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {status === "complete" ? "Documentation Complete" : "Documentation Needed"}
    </span>
  );
};

// Type Badge Component
const TypeBadge = ({ type }) => {
  const bgColor = type === "refund"
    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
    : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    
  const icon = type === "refund"
    ? <RotateCcw size={12} className="mr-1.5" />
    : <AlertTriangle size={12} className="mr-1.5" />;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const RefundsAndChargebacksPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [activeTab, setActiveTab] = useState("details"); // details, communications, evidence
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    status: [],
    dateRange: "all",
    amountRange: "all",
    priority: [],
    eligibleForAutoApproval: false,
    withinDisputeWindow: false,
    sortBy: "newest",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [statsData, setStatsData] = useState({
    totalRefunds: 0,
    totalChargebacks: 0,
    pendingRefunds: 0,
    pendingChargebacks: 0,
    criticalPriority: 0,
    autoApprovalEligible: 0,
  });
  const [newNote, setNewNote] = useState("");

  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await refundService.getRefundsAndChargebacks();

        setRefunds(response.data);
        setFilteredRefunds(response.data);
        setPagination(response.pagination);

        // Calculate stats
        const stats = {
          totalRefunds: response.data.filter((item) => item.type === "refund")
            .length,
          totalChargebacks: response.data.filter(
            (item) => item.type === "chargeback"
          ).length,
          pendingRefunds: response.data.filter(
            (item) => item.type === "refund" && item.status === "pending"
          ).length,
          pendingChargebacks: response.data.filter(
            (item) => item.type === "chargeback" && item.status === "pending"
          ).length,
          criticalPriority: response.data.filter(
            (item) => item.priority === "critical"
          ).length,
          autoApprovalEligible: response.data.filter(
            (item) => item.eligibleForAutoApproval
          ).length,
        };

        setStatsData(stats);
      } catch (error) {
        console.error("Error loading refunds and chargebacks:", error);
        toast.error("Failed to load refund data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Close refund details when clicking outside
    const handleClickOutside = (event) => {
      if (selectedRefund && !event.target.closest(".refund-details-panel")) {
        setSelectedRefund(null);
        setActiveTab("details");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters(filters, refunds);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = refunds.filter(
      (item) =>
        item.id.toLowerCase().includes(lowercaseQuery) ||
        item.referenceNumber.toLowerCase().includes(lowercaseQuery) ||
        item.campaignTitle.toLowerCase().includes(lowercaseQuery) ||
        item.userName.toLowerCase().includes(lowercaseQuery) ||
        (item.requestReason &&
          item.requestReason.toLowerCase().includes(lowercaseQuery))
    );

    applyFilters(filters, filtered);
  };

  const applyFilters = (newFilters, items = refunds) => {
    setFilters(newFilters);

    let filtered = [...items];

    // Filter by type
    if (newFilters.type && newFilters.type.length > 0) {
      filtered = filtered.filter((item) => newFilters.type.includes(item.type));
    }

    // Filter by status
    if (newFilters.status && newFilters.status.length > 0) {
      filtered = filtered.filter((item) =>
        newFilters.status.includes(item.status)
      );
    }

    // Filter by date range
    if (newFilters.dateRange !== "all") {
      const daysMap = {
        today: 1,
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };

      const cutoffDate = subDays(new Date(), daysMap[newFilters.dateRange]);
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) >= cutoffDate
      );
    }

    // Filter by amount range
    if (newFilters.amountRange !== "all") {
      const rangeMaps = {
        small: { min: 0, max: 1000 },
        medium: { min: 1000, max: 5000 },
        large: { min: 5000, max: Infinity },
      };

      const range = rangeMaps[newFilters.amountRange];
      filtered = filtered.filter(
        (item) => item.amount >= range.min && item.amount < range.max
      );
    }

    // Filter by priority
    if (newFilters.priority && newFilters.priority.length > 0) {
      filtered = filtered.filter((item) =>
        newFilters.priority.includes(item.priority)
      );
    }

    // Filter auto-approval eligible
    if (newFilters.eligibleForAutoApproval) {
      filtered = filtered.filter((item) => item.eligibleForAutoApproval);
    }

    // Filter within dispute window
    if (newFilters.withinDisputeWindow) {
      filtered = filtered.filter(
        (item) => item.type === "chargeback" && item.withinDisputeWindow
      );
    }

    // Apply sorting
    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
        case "newest":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "oldest":
          filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        case "amount_high":
          filtered.sort((a, b) => b.amount - a.amount);
          break;
        case "amount_low":
          filtered.sort((a, b) => a.amount - b.amount);
          break;
        case "priority_high":
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          filtered.sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
          );
          break;
        default:
          break;
      }
    }

    setFilteredRefunds(filtered);
  };

  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      type: [],
      status: [],
      dateRange: "all",
      amountRange: "all",
      priority: [],
      eligibleForAutoApproval: false,
      withinDisputeWindow: false,
      sortBy: "newest",
    };

    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredRefunds(refunds);
  };

  const handleExport = () => {
    toast.success("Refund and chargeback data exported successfully");
  };

  const refreshData = async () => {
    setIsFetching(true);

    try {
      const response = await refundService.getRefundsAndChargebacks();

      setRefunds(response.data);
      setFilteredRefunds(response.data);
      setPagination(response.pagination);

      // Calculate stats
      const stats = {
        totalRefunds: response.data.filter((item) => item.type === "refund")
          .length,
        totalChargebacks: response.data.filter(
          (item) => item.type === "chargeback"
        ).length,
        pendingRefunds: response.data.filter(
          (item) => item.type === "refund" && item.status === "pending"
        ).length,
        pendingChargebacks: response.data.filter(
          (item) => item.type === "chargeback" && item.status === "pending"
        ).length,
        criticalPriority: response.data.filter(
          (item) => item.priority === "critical"
        ).length,
        autoApprovalEligible: response.data.filter(
          (item) => item.eligibleForAutoApproval
        ).length,
      };

      setStatsData(stats);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const viewRefundDetails = (refund) => {
    setSelectedRefund(refund);
    setActiveTab("details");
  };

  const approveRefund = (refundId, event) => {
    event?.stopPropagation();
    toast.success(`Refund ${refundId} has been approved`);

    // Update local state to reflect the change
    setRefunds((prevRefunds) =>
      prevRefunds.map((r) =>
        r.id === refundId
          ? { ...r, status: "approved", updatedAt: new Date() }
          : r
      )
    );

    setFilteredRefunds((prevRefunds) =>
      prevRefunds.map((r) =>
        r.id === refundId
          ? { ...r, status: "approved", updatedAt: new Date() }
          : r
      )
    );

    // If the selected refund is being approved, update it too
    if (selectedRefund && selectedRefund.id === refundId) {
      setSelectedRefund({
        ...selectedRefund,
        status: "approved",
        updatedAt: new Date(),
      });
    }
  };

  const rejectRefund = (refundId, event) => {
    event?.stopPropagation();
    toast.error(`Refund ${refundId} has been rejected`);

    // Update local state
    setRefunds((prevRefunds) =>
      prevRefunds.map((r) =>
        r.id === refundId
          ? { ...r, status: "rejected", updatedAt: new Date() }
          : r
      )
    );

    setFilteredRefunds((prevRefunds) =>
      prevRefunds.map((r) =>
        r.id === refundId
          ? { ...r, status: "rejected", updatedAt: new Date() }
          : r
      )
    );

    // If the selected refund is being rejected, update it too
    if (selectedRefund && selectedRefund.id === refundId) {
      setSelectedRefund({
        ...selectedRefund,
        status: "rejected",
        updatedAt: new Date(),
      });
    }
  };

  const processDispute = (chargebackId, event) => {
    event?.stopPropagation();
    toast.success(`Dispute for chargeback ${chargebackId} has been initiated`);

    // Update local state
    setRefunds((prevRefunds) =>
      prevRefunds.map((r) =>
        r.id === chargebackId
          ? {
              ...r,
              status: "disputed",
              bankResponseSubmitted: true,
              updatedAt: new Date(),
            }
          : r
      )
    );

    setFilteredRefunds((prevRefunds) =>
      prevRefunds.map((r) =>
        r.id === chargebackId
          ? {
              ...r,
              status: "disputed",
              bankResponseSubmitted: true,
              updatedAt: new Date(),
            }
          : r
      )
    );

    // If the selected refund is being disputed, update it too
    if (selectedRefund && selectedRefund.id === chargebackId) {
      setSelectedRefund({
        ...selectedRefund,
        status: "disputed",
        bankResponseSubmitted: true,
        updatedAt: new Date(),
      });
    }
  };

  const addCommunication = () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    const newCommunication = {
      id: `note-${Date.now()}`,
      type: "note",
      from: "admin",
      timestamp: new Date(),
      content: newNote,
    };

    // Update the selected refund
    const updatedCommunications = [
      newCommunication,
      ...(selectedRefund.communications || []),
    ];

    const updatedRefund = {
      ...selectedRefund,
      communications: updatedCommunications,
    };

    // Update in the lists
    setRefunds((prevRefunds) =>
      prevRefunds.map((r) => (r.id === selectedRefund.id ? updatedRefund : r))
    );

    setFilteredRefunds((prevRefunds) =>
      prevRefunds.map((r) => (r.id === selectedRefund.id ? updatedRefund : r))
    );

    setSelectedRefund(updatedRefund);
    setNewNote("");
    toast.success("Note added successfully");
  };

  const sendEmail = () => {
    toast.success(`Email sent to ${selectedRefund.userName}`);
  };

  const applyAutoRule = (refundId, event) => {
    event?.stopPropagation();

    const refund = refunds.find((r) => r.id === refundId);
    if (!refund || !refund.autoRule) return;

    toast.success(`Applied auto-rule: "${refund.autoRule}" to ${refundId}`);
    approveRefund(refundId);
  };

  const changePage = (newPage) => {
    if (
      newPage > 0 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      setPagination({
        ...pagination,
        page: newPage,
      });

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, pagination.page - delta);
      i <= Math.min(totalPages - 1, pagination.page + delta);
      i++
    ) {
      range.push(i);
    }

    if (pagination.page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div
      ref={containerRef}
      className="p-6 sm:p-8 w-full mx-auto max-w-[1600px] bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-4 bg-gradient-to-br from-[#FF6B81] to-[#B75BFF] w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <RotateCcw className="text-white" size={20} />
            </span>
            Refunds & Chargebacks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-14">
            Manage donor refunds and dispute chargebacks
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </motion.button>
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={refreshData}
            disabled={isFetching}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Total Refunds */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Refunds
            </p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <RotateCcw size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.totalRefunds}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            All refund requests
          </p>
        </motion.div>

        {/* Pending Refunds */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Pending Refunds
            </p>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.pendingRefunds}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Awaiting decision
          </p>
        </motion.div>

        {/* Total Chargebacks */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Chargebacks
            </p>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.totalChargebacks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            All chargeback cases
          </p>
        </motion.div>

        {/* Pending Chargebacks */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Pending Chargebacks
            </p>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <AlertOctagon size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.pendingChargebacks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Require immediate response
          </p>
        </motion.div>

        {/* Critical Priority */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Critical Priority
            </p>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <AlertOctagon size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.criticalPriority}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            High-value or urgent cases
          </p>
        </motion.div>

        {/* Auto-Approval Eligible */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Auto-Approval Eligible
            </p>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.autoApprovalEligible}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Match automatic approval rules
          </p>
        </motion.div>
      </motion.div>

      {/* Search & Filter Controls */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, reference number, campaign, or user name..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-transparent transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              whileHover={{
                y: -2,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
                backgroundColor: "#f9fafb",
              }}
              whileTap={{ y: 0 }}
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["refund", "chargeback"].map((type) => (
                        <label key={type} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.type.includes(type)}
                            onChange={(e) => {
                              const newType = e.target.checked
                                ? [...filters.type, type]
                                : filters.type.filter((t) => t !== type);
                              handleFilterChange({
                                ...filters,
                                type: newType,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "pending",
                        "processing",
                        "approved",
                        "completed",
                        "rejected",
                        "disputed",
                        "settled",
                        "lost",
                        "cancelled",
                      ].map((status) => (
                        <label
                          key={status}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
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
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["low", "medium", "high", "critical"].map((priority) => (
                        <label
                          key={priority}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.priority.includes(priority)}
                            onChange={(e) => {
                              const newPriority = e.target.checked
                                ? [...filters.priority, priority]
                                : filters.priority.filter(
                                    (p) => p !== priority
                                  );
                              handleFilterChange({
                                ...filters,
                                priority: newPriority,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {priority}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                    </select>
                  </div>

                  {/* Amount Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.amountRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          amountRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; 1,000 KES)</option>
                      <option value="medium">Medium (1,000 - 5,000 KES)</option>
                      <option value="large">Large (&gt; 5,000 KES)</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
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
                      <option value="amount_high">Amount (High to Low)</option>
                      <option value="amount_low">Amount (Low to High)</option>
                      <option value="priority_high">
                        Priority (High to Low)
                      </option>
                    </select>
                  </div>

                  {/* Special Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Filters
                    </label>
                    <div className="flex flex-col space-y-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                          checked={filters.eligibleForAutoApproval}
                          onChange={(e) => {
                            handleFilterChange({
                              ...filters,
                              eligibleForAutoApproval: e.target.checked,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Auto-Approval Eligible
                        </span>
                      </label>

                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                          checked={filters.withinDisputeWindow}
                          onChange={(e) => {
                            handleFilterChange({
                              ...filters,
                              withinDisputeWindow: e.target.checked,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Within Dispute Window
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-end">
                    <motion.button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 text-[#FF6B81] dark:text-[#FF6B81] bg-[#FF6B81]/5 hover:bg-[#FF6B81]/10 rounded-xl text-sm transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="flex items-center justify-between mb-5 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <RotateCcw size={14} className="mr-2 text-[#FF6B81]" />
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
            {filteredRefunds.length}
          </span>
          {filteredRefunds.length !== pagination.total && (
            <>
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
                {pagination.total}
              </span>
            </>
          )}
          refunds and chargebacks
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={36} className="text-[#FF6B81] animate-spin mr-4" />
          <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Loading refund data...
          </span>
        </div>
      ) : filteredRefunds.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm py-16 px-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-700 rounded-full mb-5">
            <RotateCcw size={28} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
            No refunds or chargebacks found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <motion.button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-[#FF6B81]/10 text-[#FF6B81] rounded-xl text-sm hover:bg-[#FF6B81]/20 transition-colors shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Clear filters
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Refunds & Chargebacks Table */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.3,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID & Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Campaign & Donor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredRefunds.map((refund) => (
                    <tr
                      key={refund.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        refund.priority === "critical"
                          ? "bg-red-50 dark:bg-red-900/10"
                          : refund.priority === "high"
                          ? "bg-orange-50 dark:bg-orange-900/10"
                          : ""
                      }`}
                      onClick={() => viewRefundDetails(refund)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {refund.id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {format(
                            new Date(refund.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </div>
                        {refund.type === "chargeback" &&
                          refund.disputeDeadline && (
                            <div
                              className={`text-xs flex items-center mt-1 ${
                                refund.withinDisputeWindow
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              <AlertTriangle size={12} className="mr-1" />
                              {refund.withinDisputeWindow
                                ? `Dispute window: ${format(
                                    new Date(refund.disputeDeadline),
                                    "MMM d"
                                  )}`
                                : "Dispute window closed"}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TypeBadge type={refund.type} />
                        {refund.autoRule && refund.eligibleForAutoRefund && (
                          <div className="mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center w-fit">
                              <CheckCircle size={12} className="mr-1.5" />
                              Auto-Rule Eligible
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          KES {refund.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Ref: {refund.referenceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-1 mb-1">
                          {refund.campaignTitle}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Users size={12} className="mr-1" />
                          {refund.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={refund.status}
                          type={refund.type}
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <DocumentationBadge
                            status={refund.documentationStatus}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityBadge priority={refund.priority} />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">
                          {refund.requestReason}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewRefundDetails(refund);
                            }}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Refund Specific Actions */}
                          {refund.type === "refund" &&
                            ["pending", "processing"].includes(
                              refund.status
                            ) && (
                              <>
                                <button
                                  onClick={(e) => approveRefund(refund.id, e)}
                                  className="p-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                  title="Approve Refund"
                                >
                                  <ThumbsUp size={18} />
                                </button>
                                <button
                                  onClick={(e) => rejectRefund(refund.id, e)}
                                  className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Reject Refund"
                                >
                                  <ThumbsDown size={18} />
                                </button>
                                {refund.eligibleForAutoRefund && (
                                  <button
                                    onClick={(e) => applyAutoRule(refund.id, e)}
                                    className="p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title={`Apply Auto-Rule: ${refund.autoRule}`}
                                  >
                                    <CheckCircle size={18} />
                                  </button>
                                )}
                              </>
                            )}

                          {/* Chargeback Specific Actions */}
                          {refund.type === "chargeback" &&
                            refund.status === "pending" && (
                              <button
                                onClick={(e) => processDispute(refund.id, e)}
                                className="p-2 text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                title="Process Dispute"
                              >
                                <FileText size={18} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          {!isLoading && filteredRefunds.length > 0 && totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {startItem}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pagination.total}
                    </span>{" "}
                    items
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === 1
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof pageNumber === "number" &&
                          changePage(pageNumber)
                        }
                        disabled={pageNumber === "..."}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pageNumber === pagination.page
                            ? "bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] text-white shadow-sm"
                            : pageNumber === "..."
                            ? "text-gray-400 dark:text-gray-500 cursor-default"
                            : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page === totalPages}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pagination.page === totalPages
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refund/Chargeback Details Panel */}
      <AnimatePresence>
        {selectedRefund && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedRefund(null);
              setActiveTab("details");
            }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden refund-details-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center 
                       ${
                         selectedRefund.type === "refund"
                           ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                           : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                       }`}
                      >
                        {selectedRefund.type === "refund" ? (
                          <RotateCcw size={20} />
                        ) : (
                          <AlertTriangle size={20} />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedRefund.type === "refund"
                          ? "Refund Request"
                          : "Chargeback Case"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedRefund.id} •{" "}
                        {format(
                          new Date(selectedRefund.createdAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <StatusBadge
                      status={selectedRefund.status}
                      type={selectedRefund.type}
                    />
                    <PriorityBadge priority={selectedRefund.priority} />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "details"
                        ? "text-[#FF6B81] border-b-2 border-[#FF6B81]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "communications"
                        ? "text-[#FF6B81] border-b-2 border-[#FF6B81]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("communications")}
                  >
                    Communications
                    {selectedRefund.communications &&
                      selectedRefund.communications.length > 0 && (
                        <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                          {selectedRefund.communications.length}
                        </span>
                      )}
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "evidence"
                        ? "text-[#FF6B81] border-b-2 border-[#FF6B81]"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("evidence")}
                  >
                    Evidence
                    {selectedRefund.evidenceDocuments &&
                      selectedRefund.evidenceDocuments.length > 0 && (
                        <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                          {selectedRefund.evidenceDocuments.length}
                        </span>
                      )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Amount & Reference
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          KES {selectedRefund.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Reference: {selectedRefund.referenceNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Original Donation: {selectedRefund.donationId}
                        </p>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Campaign
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {selectedRefund.campaignTitle}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {selectedRefund.campaignId}
                        </p>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Donor Information
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {selectedRefund.userName}
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                          <Mail size={14} className="mr-1.5" />
                          {selectedRefund.userEmail}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {selectedRefund.userId}
                        </p>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Payment Method
                        </p>
                        <p className="text-base text-gray-900 dark:text-white capitalize">
                          {selectedRefund.paymentMethod.replace("_", " ")}
                        </p>
                      </div>

                      {selectedRefund.notes && (
                        <div className="mb-6">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Admin Notes
                          </p>
                          <p className="text-base text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            {selectedRefund.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Request Reason
                        </p>
                        <p className="text-base text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                          {selectedRefund.requestReason}
                        </p>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Documentation Status
                        </p>
                        <DocumentationBadge
                          status={selectedRefund.documentationStatus}
                        />
                        {selectedRefund.documentationStatus ===
                          "incomplete" && (
                          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                            Additional documentation is required to process this
                            request
                          </p>
                        )}
                      </div>

                      {selectedRefund.eligibleForAutoRefund && (
                        <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1 flex items-center">
                            <CheckCircle size={16} className="mr-1.5" />
                            Eligible for Automatic Approval
                          </p>
                          <p className="text-sm text-emerald-700 dark:text-emerald-400">
                            Matches rule: "{selectedRefund.autoRule}"
                          </p>
                          <button
                            className="mt-2 px-3 py-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                            onClick={() => approveRefund(selectedRefund.id)}
                          >
                            Apply Auto-Approval
                          </button>
                        </div>
                      )}

                      {selectedRefund.type === "chargeback" && (
                        <div
                          className={`mb-6 p-3 ${
                            selectedRefund.withinDisputeWindow
                              ? "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800"
                              : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
                          } rounded-xl`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              selectedRefund.withinDisputeWindow
                                ? "text-amber-700 dark:text-amber-400"
                                : "text-red-700 dark:text-red-400"
                            } mb-1 flex items-center`}
                          >
                            <AlertTriangle size={16} className="mr-1.5" />
                            {selectedRefund.withinDisputeWindow
                              ? "Dispute Window Active"
                              : "Dispute Window Closed"}
                          </p>
                          {selectedRefund.withinDisputeWindow ? (
                            <>
                              <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                                Respond by:{" "}
                                {format(
                                  new Date(selectedRefund.disputeDeadline),
                                  "MMMM d, yyyy"
                                )}
                              </p>
                              <button
                                className="px-3 py-1.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                                onClick={() =>
                                  processDispute(selectedRefund.id)
                                }
                                disabled={selectedRefund.status !== "pending"}
                              >
                                {selectedRefund.bankResponseSubmitted
                                  ? "View Dispute Response"
                                  : "Create Dispute Response"}
                              </button>
                            </>
                          ) : (
                            <p className="text-sm text-red-700 dark:text-red-400">
                              Deadline was:{" "}
                              {format(
                                new Date(selectedRefund.disputeDeadline),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          )}
                          {selectedRefund.bankReference && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              Bank Reference: {selectedRefund.bankReference}
                            </p>
                          )}
                        </div>
                      )}

                      {selectedRefund.processedBy && (
                        <div className="mb-6">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Processing Information
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            Processed by:{" "}
                            {selectedRefund.automaticDecision
                              ? "Automated System"
                              : `Admin (${selectedRefund.processedBy})`}
                          </p>
                          {selectedRefund.decisionReason && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Reason: {selectedRefund.decisionReason}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Updated:{" "}
                            {format(
                              new Date(selectedRefund.updatedAt),
                              "MMM d, yyyy h:mm a"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Communications Tab */}
                {activeTab === "communications" && (
                  <div>
                    {/* New Communication Form */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Add Internal Note
                      </p>
                      <textarea
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-transparent min-h-[100px]"
                        placeholder="Add notes, decisions, or context about this refund/chargeback..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      ></textarea>
                      <div className="flex justify-between mt-3">
                        <button
                          className="px-4 py-2 text-white bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] rounded-xl text-sm hover:opacity-90 transition-colors shadow-sm"
                          onClick={addCommunication}
                        >
                          Add Note
                        </button>
                        <button
                          className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => sendEmail()}
                        >
                          <Mail size={14} className="inline mr-2" />
                          Send Email
                        </button>
                      </div>
                    </div>

                    {/* Communications History */}
                    {selectedRefund.communications &&
                    selectedRefund.communications.length > 0 ? (
                      <div className="space-y-4">
                        {selectedRefund.communications.map(
                          (communication, index) => (
                            <div
                              key={communication.id}
                              className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                      communication.from === "admin"
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        : communication.from === "donor"
                                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                        : communication.from === "system"
                                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                        : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                    }`}
                                  >
                                    {communication.from === "admin" ? (
                                      <UserCheck size={16} />
                                    ) : communication.from === "donor" ? (
                                      <Users size={16} />
                                    ) : communication.from === "system" ? (
                                      <Shield size={16} />
                                    ) : (
                                      <CreditCard size={16} />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                      {communication.from}
                                      {communication.type === "email" && (
                                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                          Email
                                        </span>
                                      )}
                                      {communication.type === "note" && (
                                        <span className="ml-2 text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                                          Note
                                        </span>
                                      )}
                                      {communication.type === "chat" && (
                                        <span className="ml-2 text-xs px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                                          Chat
                                        </span>
                                      )}
                                      {communication.type === "call" && (
                                        <span className="ml-2 text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                                          Call
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {format(
                                        new Date(communication.timestamp),
                                        "MMM d, yyyy h:mm a"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {communication.subject && (
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Subject: {communication.subject}
                                </p>
                              )}

                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {communication.content}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                          <MessageSquare
                            size={24}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No communications found for this request
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "evidence" && (
                  <div>
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Upload Evidence Documents
                      </p>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                          <FileText
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          Supported formats: PDF, JPG, PNG (Max size: 10MB)
                        </p>
                        <button
                          className="px-4 py-2 text-white bg-gradient-to-r from-[#FF6B81] to-[#B75BFF] rounded-xl text-sm hover:opacity-90 transition-colors shadow-sm"
                          onClick={() =>
                            toast.success(
                              "File upload feature would be implemented here"
                            )
                          }
                        >
                          Upload Files
                        </button>
                      </div>
                    </div>

                    {/* Evidence Documents */}
                    {selectedRefund.evidenceDocuments &&
                    selectedRefund.evidenceDocuments.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                          Uploaded Documents
                        </h3>

                        {selectedRefund.evidenceDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                                <FileText
                                  size={20}
                                  className="text-gray-500 dark:text-gray-400"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                  {doc.filename}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <span className="mr-3">{doc.fileSize}</span>
                                  <span className="mr-3">
                                    Uploaded:{" "}
                                    {format(
                                      new Date(doc.uploadDate),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                    {doc.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <button
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10 rounded-lg transition-colors"
                                onClick={() =>
                                  toast.success(
                                    `Viewing document: ${doc.filename}`
                                  )
                                }
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FF6B81] dark:hover:text-[#FF6B81] hover:bg-[#FF6B81]/10 rounded-lg transition-colors ml-1"
                                onClick={() =>
                                  toast.success(
                                    `Downloading document: ${doc.filename}`
                                  )
                                }
                              >
                                <Download size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                          <FileText
                            size={24}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                          No evidence documents have been uploaded
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {selectedRefund.documentationStatus === "incomplete"
                            ? "Additional documentation is required to process this request"
                            : "This request has complete documentation"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-between gap-4">
                <div>
                  <button
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      setSelectedRefund(null);
                      setActiveTab("details");
                    }}
                  >
                    <XCircle size={16} className="inline mr-2" />
                    Close
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Refund Actions */}
                  {selectedRefund.type === "refund" &&
                    ["pending", "processing"].includes(
                      selectedRefund.status
                    ) && (
                      <>
                        <button
                          className="px-5 py-2.5 text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl text-sm transition-colors shadow-sm"
                          onClick={() => approveRefund(selectedRefund.id)}
                        >
                          <ThumbsUp size={16} className="inline mr-2" />
                          Approve Refund
                        </button>

                        <button
                          className="px-5 py-2.5 text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-xl text-sm transition-colors shadow-sm"
                          onClick={() => rejectRefund(selectedRefund.id)}
                        >
                          <ThumbsDown size={16} className="inline mr-2" />
                          Reject Refund
                        </button>
                      </>
                    )}

                  {/* Chargeback Actions */}
                  {selectedRefund.type === "chargeback" &&
                    selectedRefund.status === "pending" &&
                    selectedRefund.withinDisputeWindow && (
                      <button
                        className="px-5 py-2.5 text-white bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 rounded-xl text-sm transition-colors shadow-sm"
                        onClick={() => processDispute(selectedRefund.id)}
                      >
                        <FileText size={16} className="inline mr-2" />
                        Process Dispute
                      </button>
                    )}

                  {/* View Original Donation */}
                  <button
                    className="px-5 py-2.5 text-[#FF6B81] bg-[#FF6B81]/10 hover:bg-[#FF6B81]/20 rounded-xl text-sm transition-colors"
                    onClick={() =>
                      toast.success(
                        `Viewing original donation: ${selectedRefund.donationId}`
                      )
                    }
                  >
                    <ExternalLink size={16} className="inline mr-2" />
                    View Original Donation
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

export default RefundsAndChargebacksPage;