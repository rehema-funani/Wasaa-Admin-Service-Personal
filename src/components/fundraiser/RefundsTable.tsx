import { motion } from "framer-motion";
import {
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  FileText,
  Loader,
  RotateCcw,
  Users,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const StatusBadge = ({ status, type }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <Info size={12} className="mr-1.5" />;

  if (type === "chargeback") {
    switch (status) {
      case "pending":
        bgColor =
          "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "disputed":
        bgColor =
          "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
        icon = <AlertTriangle size={12} className="mr-1.5" />;
        break;
      case "settled":
        bgColor =
          "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "lost":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  } else {
    switch (status) {
      case "completed":
        bgColor =
          "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        icon = <CheckCircle size={12} className="mr-1.5" />;
        break;
      case "approved":
        bgColor =
          "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
        icon = <ThumbsUp size={12} className="mr-1.5" />;
        break;
      case "pending":
        bgColor =
          "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        icon = <Clock size={12} className="mr-1.5" />;
        break;
      case "processing":
        bgColor =
          "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        icon = <RotateCcw size={12} className="mr-1.5" />;
        break;
      case "rejected":
      case "cancelled":
        bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <ThumbsDown size={12} className="mr-1.5" />;
        break;
      default:
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  let bgColor = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  let icon = <Info size={12} className="mr-1.5" />;

  switch (priority) {
    case "low":
      bgColor =
        "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      icon = <Info size={12} className="mr-1.5" />;
      break;
    case "medium":
      bgColor =
        "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      icon = <AlertTriangle size={12} className="mr-1.5" />;
      break;
    case "high":
      bgColor =
        "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
      icon = <AlertTriangle size={12} className="mr-1.5" />;
      break;
    case "critical":
      bgColor = "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      icon = <AlertTriangle size={12} className="mr-1.5" />;
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}
    >
      {icon}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

const DocumentationBadge = ({ status }) => {
  let bgColor =
    status === "complete"
      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
      : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";

  let icon =
    status === "complete" ? (
      <CheckCircle size={12} className="mr-1.5" />
    ) : (
      <AlertTriangle size={12} className="mr-1.5" />
    );

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}
    >
      {icon}
      {status === "complete"
        ? "Documentation Complete"
        : "Documentation Needed"}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const bgColor =
    type === "refund"
      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
      : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";

  const icon =
    type === "refund" ? (
      <RotateCcw size={12} className="mr-1.5" />
    ) : (
      <AlertTriangle size={12} className="mr-1.5" />
    );

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}
    >
      {icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const RefundsTable = ({
  isLoading,
  filteredRefunds,
  viewRefundDetails,
  approveRefund,
  rejectRefund,
  processDispute,
  applyAutoRule,
  pagination,
  changePage,
  handleResetFilters,
}) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={36} className="text-[#FF6B81] animate-spin mr-4" />
        <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
          Loading refund data...
        </span>
      </div>
    );
  }

  if (filteredRefunds.length === 0) {
    return (
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
          Try adjusting your search or filters to find what you're looking for.
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
    );
  }

  return (
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
                      {format(new Date(refund.createdAt), "MMM d, yyyy h:mm a")}
                    </div>
                    {refund.type === "chargeback" && refund.disputeDeadline && (
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
                    <StatusBadge status={refund.status} type={refund.type} />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <DocumentationBadge status={refund.documentationStatus} />
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
                        ["pending", "processing"].includes(refund.status) && (
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
      {filteredRefunds.length > 0 && totalPages > 1 && (
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
                      typeof pageNumber === "number" && changePage(pageNumber)
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
  );
};

export default RefundsTable;
