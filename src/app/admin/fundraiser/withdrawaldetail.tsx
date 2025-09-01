import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Shield,
  Loader,
  User,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { fundraiserService } from "../../../api/services/fundraiser";

const WithdrawalDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawal, setWithdrawal] = useState(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchWithdrawalDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fundraiserService.getPayoutDetails(id);
        setWithdrawal(response.withdrawal);
      } catch (error) {
        console.error("Error fetching withdrawal details:", error);
        toast.error("Failed to load withdrawal details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawalDetails();
  }, [id]);

  const handleApproveWithdrawal = async () => {
    setIsProcessing(true);
    try {
      await fundraiserService.approvePayout(id, { notes: approvalNote });
      toast.success("Withdrawal request approved successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast.error("Failed to approve withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectWithdrawal = async () => {
    setIsProcessing(true);
    try {
      await fundraiserService.rejectPayout(id, {
        notes: approvalNote,
        reason: "Rejected by admin",
      });
      toast.success("Withdrawal request rejected");
      navigate(-1);
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      toast.error("Failed to reject withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  // Status Indicator
  const getStatusIndicator = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full text-sm">
            <Clock size={14} />
            <span>Pending</span>
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-sm">
            <CheckCircle size={14} />
            <span>Approved</span>
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full text-sm">
            <XCircle size={14} />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Risk Indicator
  const getRiskIndicator = (score) => {
    if (score < 30) {
      return (
        <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm">
          <Shield size={16} className="mr-1.5" />
          Low Risk ({score}/100)
        </span>
      );
    } else if (score < 70) {
      return (
        <span className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
          <AlertTriangle size={16} className="mr-1.5" />
          Medium Risk ({score}/100)
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-red-600 dark:text-red-400 text-sm">
          <AlertTriangle size={16} className="mr-1.5" />
          High Risk ({score}/100)
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={30} className="text-primary-500 animate-spin mr-3" />
        <span className="text-slate-500 dark:text-gray-400">
          Loading withdrawal details...
        </span>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-gray-700 rounded-full mb-4">
            <CreditCard
              size={24}
              className="text-slate-400 dark:text-gray-500"
            />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-2">
            Withdrawal request not found
          </h3>
          <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            The withdrawal request you're looking for doesn't exist or you don't
            have permission to view it.
          </p>
          <button
            onClick={() => navigate("/admin/withdrawals")}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
          >
            Return to Withdrawals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/withdrawals")}
          className="flex items-center text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span>Back to Withdrawal Requests</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-medium text-slate-900 dark:text-white">
                Withdrawal Request {withdrawal.id}
              </h1>
              {getStatusIndicator(withdrawal.status)}
            </div>
            <p className="text-slate-500 dark:text-gray-400">
              Requested on{" "}
              {format(
                new Date(withdrawal.requestDate),
                "MMMM d, yyyy 'at' h:mm a"
              )}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-medium text-slate-900 dark:text-white">
              ${withdrawal.amount.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 dark:text-gray-400">
              Fee: ${withdrawal.fee.toLocaleString()} • Net: $
              {withdrawal.netAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Campaign Information */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Campaign Information
                </h2>
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-base font-medium text-slate-800 dark:text-gray-200 mb-2">
                    {withdrawal.campaignTitle}
                  </h3>
                  <div className="flex items-center text-sm">
                    <span className="text-slate-500 dark:text-gray-400 mr-2">
                      Campaign ID:
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {withdrawal.campaignId}
                    </span>
                    <button className="ml-2 text-primary-500 hover:text-primary-600 dark:text-primary-400">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Requester Information */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Requester Information
                </h2>
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                      <User className="text-primary-500" size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-slate-800 dark:text-gray-200">
                        {withdrawal.accountDetails.accountName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        Requester
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-slate-500 dark:text-gray-400">
                        Payment Method:
                      </span>
                      <span className="text-slate-900 dark:text-white capitalize">
                        {withdrawal.paymentMethod.replace("_", " ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-slate-500 dark:text-gray-400">
                        {withdrawal.paymentMethod === "bank_transfer"
                          ? "Account Number:"
                          : "Phone Number:"}
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {withdrawal.accountDetails.accountNumber}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-slate-500 dark:text-gray-400">
                        {withdrawal.paymentMethod === "bank_transfer"
                          ? "Bank:"
                          : "Provider:"}
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {withdrawal.accountDetails.bankName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Risk Assessment
                </h2>
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    {getRiskIndicator(withdrawal.riskScore)}
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        withdrawal.riskScore < 30
                          ? "bg-emerald-500"
                          : withdrawal.riskScore < 70
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${withdrawal.riskScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    This withdrawal request has been automatically assessed for
                    risk factors including transaction history, account
                    activity, and verification status.
                  </p>
                </div>
              </div>

              {/* Documents */}
              {withdrawal.documents && withdrawal.documents.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                    Supporting Documents
                  </h2>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="space-y-2">
                      {withdrawal.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700"
                        >
                          <div className="flex items-center">
                            <FileText
                              size={16}
                              className="text-slate-400 dark:text-gray-500 mr-2"
                            />
                            <span className="text-sm text-slate-900 dark:text-white">
                              {doc}
                            </span>
                          </div>
                          <button className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div>
              {/* Transaction Details */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Transaction Details
                </h2>
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-gray-400">
                        Amount Requested
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        ${withdrawal.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-gray-400">
                        Platform Fee (2.5%)
                      </span>
                      <span className="text-slate-700 dark:text-gray-300">
                        ${withdrawal.fee.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-gray-600 pt-3 flex justify-between">
                      <span className="font-medium text-slate-700 dark:text-gray-300">
                        Net Amount
                      </span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        ${withdrawal.netAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Timeline
                </h2>
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-gray-600"></div>

                    <div className="relative pl-10 pb-6">
                      <div className="absolute left-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 border-2 border-primary-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-slate-800 dark:text-gray-200">
                          Request Submitted
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          {format(
                            new Date(withdrawal.requestDate),
                            "MMMM d, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>

                    {withdrawal.status !== "pending" && (
                      <div className="relative pl-10">
                        <div
                          className="absolute left-0 w-6 h-6 rounded-full flex items-center justify-center border-2"
                          style={{
                            backgroundColor:
                              withdrawal.status === "approved"
                                ? "rgba(16, 185, 129, 0.1)"
                                : "rgba(239, 68, 68, 0.1)",
                            borderColor:
                              withdrawal.status === "approved"
                                ? "#10b981"
                                : "#ef4444",
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                withdrawal.status === "approved"
                                  ? "#10b981"
                                  : "#ef4444",
                            }}
                          ></div>
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-slate-800 dark:text-gray-200">
                            {withdrawal.status === "approved"
                              ? "Request Approved"
                              : "Request Rejected"}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-gray-400">
                            {format(
                              new Date(withdrawal.reviewDate),
                              "MMMM d, yyyy 'at' h:mm a"
                            )}
                            {withdrawal.reviewedBy &&
                              ` by ${withdrawal.reviewedBy.name}`}
                          </p>
                          {withdrawal.reason && (
                            <p className="text-sm text-red-500 mt-1">
                              Reason: {withdrawal.reason}
                            </p>
                          )}
                          {withdrawal.notes && (
                            <p className="text-sm text-slate-600 dark:text-gray-300 mt-1 bg-slate-100 dark:bg-gray-700 p-2 rounded-md">
                              "{withdrawal.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {withdrawal.status === "pending" && (
                <div>
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                    Admin Actions
                  </h2>
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="mb-4">
                      <label
                        htmlFor="approvalNote"
                        className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2"
                      >
                        Add Notes (optional)
                      </label>
                      <textarea
                        id="approvalNote"
                        rows={4}
                        className="w-full border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Add any notes about this withdrawal request..."
                        value={approvalNote}
                        onChange={(e) => setApprovalNote(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleApproveWithdrawal}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} />
                            <span>Approve</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleRejectWithdrawal}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 py-3 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetailsPage;
