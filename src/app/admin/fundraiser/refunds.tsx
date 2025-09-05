import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { subDays, addDays, isFuture } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import RefundDetailsPanel from "../../../components/fundraiser/RefundDetailsPanel";
import RefundsTable from "../../../components/fundraiser/RefundsTable";
import HeaderSection from "../../../components/fundraiser/HeaderSection";
import FilterSection from "../../../components/fundraiser/FilterSection";

const refundService = {
  getRefundsAndChargebacks: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const refundsAndChargebacks = Array.from({ length: 40 }).map(
          (_, index) => {
            // Generate random refund/chargeback data
            const types = ["refund", "chargeback"];
            const type = types[Math.floor(Math.random() * types.length)];

            // Different statuses based on type
            let statuses;
            if (type === "refund") {
              statuses = [
                "completed",
                "pending",
                "processing",
                "rejected",
                "approved",
                "cancelled",
              ];
            } else {
              // chargeback
              statuses = ["pending", "disputed", "settled", "lost"];
            }

            const status =
              statuses[Math.floor(Math.random() * statuses.length)];

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
              "Disputed amount",
            ];

            // For chargebacks, determine if it's within the dispute window
            const disputeDeadline =
              type === "chargeback" ? addDays(createdAt, 45) : null;
            const withinDisputeWindow =
              type === "chargeback" ? isFuture(disputeDeadline) : false;

            // Automatically create some communication logs
            const communicationCount = Math.floor(Math.random() * 5);
            const communications = Array.from({ length: communicationCount })
              .map((_, i) => {
                const communicationType = ["email", "chat", "note", "call"][
                  Math.floor(Math.random() * 4)
                ];
                const fromActor = ["admin", "donor", "system", "bank"][
                  Math.floor(Math.random() * 4)
                ];

                return {
                  id: `comm-${index}-${i}`,
                  type: communicationType,
                  from: fromActor,
                  timestamp: subDays(new Date(), daysAgo - i),
                  content:
                    fromActor === "system"
                      ? "Automatic notification sent to user about refund status change."
                      : fromActor === "donor"
                      ? "I would like to request a refund because I made this donation by mistake."
                      : fromActor === "admin"
                      ? "Processed refund request after verifying donor identity and reason."
                      : "Bank has initiated a chargeback investigation for this transaction.",
                  subject:
                    communicationType === "email"
                      ? "Refund Request Update"
                      : null,
                };
              })
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Automated rules that might apply
            const autoRules = [
              "30-day money back guarantee",
              "Duplicate payment auto-refund",
              "Small amount express refund",
              "First-time donor goodwill refund",
              "Suspicious activity auto-refund",
            ];

            const eligibleForAutoRefund = Math.random() < 0.3;
            const autoRule = eligibleForAutoRefund
              ? autoRules[Math.floor(Math.random() * autoRules.length)]
              : null;

            // Random priority
            const priorities = ["low", "medium", "high", "critical"];
            const priorityWeight =
              type === "chargeback"
                ? [0.1, 0.2, 0.4, 0.3]
                : [0.4, 0.3, 0.2, 0.1];

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
              "Wildlife Conservation Effort",
            ];

            // Documentation status
            const documentationStatus =
              Math.random() < 0.7 ? "complete" : "incomplete";

            // Bank reference and evidence data
            const hasBankReference =
              type === "chargeback" || Math.random() < 0.3;
            const bankReference = hasBankReference
              ? `BRF${Math.floor(Math.random() * 1000000)
                  .toString()
                  .padStart(6, "0")}`
              : null;

            const evidenceTypes = [
              "Donor confirmation email",
              "Transaction receipt",
              "IP address logs",
              "Communication records",
              "Identity verification",
              "Banking records",
            ];

            const hasEvidence = Math.random() < 0.6;
            const evidenceDocuments = hasEvidence
              ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
                  (_, i) => ({
                    id: `doc-${index}-${i}`,
                    type: evidenceTypes[
                      Math.floor(Math.random() * evidenceTypes.length)
                    ],
                    filename: `evidence_${index}_${i}.pdf`,
                    uploadDate: subDays(
                      new Date(),
                      daysAgo - Math.floor(Math.random() * 3)
                    ),
                    fileSize: `${Math.floor(Math.random() * 5) + 1}MB`,
                  })
                )
              : [];

            // For refunds, determine if eligible for auto-approval based on rules
            const eligibleForAutoApproval =
              type === "refund" &&
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
              campaignTitle:
                campaignTitles[
                  Math.floor(Math.random() * campaignTitles.length)
                ],
              userId: `user-${Math.floor(Math.random() * 50) + 1}`,
              userName: `${
                ["John", "Mary", "Peter", "Sarah", "David"][
                  Math.floor(Math.random() * 5)
                ]
              } ${
                ["Doe", "Smith", "Johnson", "Kimani", "Ochieng"][
                  Math.floor(Math.random() * 5)
                ]
              }`,
              userEmail: `user${Math.floor(Math.random() * 1000)}@example.com`,
              paymentMethod: ["wallet", "mpesa", "card", "bank_transfer"][
                Math.floor(Math.random() * 4)
              ],
              referenceNumber: `REF${Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, "0")}`,
              requestReason:
                requestReasons[
                  Math.floor(Math.random() * requestReasons.length)
                ],
              notes:
                Math.random() > 0.6
                  ? "Donor called to explain refund situation in detail"
                  : null,
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
              bankResponseSubmitted:
                type === "chargeback" ? Math.random() < 0.6 : null,
              // Decision maker
              processedBy:
                status === "completed" ||
                status === "rejected" ||
                status === "approved"
                  ? `admin-${Math.floor(Math.random() * 10) + 1}`
                  : null,
              // For auto-approved or auto-rejected
              automaticDecision: Math.random() < 0.3,
              decisionReason:
                status === "completed" ||
                status === "rejected" ||
                status === "approved"
                  ? Math.random() < 0.3
                    ? "Auto-approved based on refund policy"
                    : "Reviewed and approved by admin after verification"
                  : null,
            };
          }
        );

        resolve({
          data: refundsAndChargebacks,
          pagination: {
            page: 1,
            limit: 20,
            total: 40,
          },
        });
      }, 1000);
    });
  },
};

const RefundsAndChargebacksPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
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

  return (
    <div
      ref={containerRef}
      className="p-6 sm:p-8 w-full mx-auto max-w-[1600px] bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <HeaderSection
        statsData={statsData}
        isLoading={isLoading}
        refreshData={refreshData}
        isFetching={isFetching}
      />

      <FilterSection
        searchQuery={searchQuery}
        filters={filters}
        handleSearch={handleSearch}
        handleFilterChange={handleFilterChange}
        handleResetFilters={handleResetFilters}
        filteredRefunds={filteredRefunds}
        pagination={pagination}
      />

      {/* Refunds Table Section */}
      <RefundsTable
        isLoading={isLoading}
        filteredRefunds={filteredRefunds}
        viewRefundDetails={viewRefundDetails}
        approveRefund={approveRefund}
        rejectRefund={rejectRefund}
        processDispute={processDispute}
        applyAutoRule={applyAutoRule}
        pagination={pagination}
        changePage={changePage}
        handleResetFilters={handleResetFilters}
      />

      {/* Refund Details Panel */}
      <RefundDetailsPanel
        selectedRefund={selectedRefund}
        setSelectedRefund={setSelectedRefund}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        approveRefund={approveRefund}
        rejectRefund={rejectRefund}
        processDispute={processDispute}
        newNote={newNote}
        setNewNote={setNewNote}
        addCommunication={addCommunication}
        sendEmail={sendEmail}
      />
    </div>
  );
};

export default RefundsAndChargebacksPage;
