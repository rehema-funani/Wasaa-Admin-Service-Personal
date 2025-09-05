import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Mail,
  MessageSquare,
  UserCheck,
  Users,
  Shield,
  CreditCard,
  Download,
  Eye,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

// Status Badge Component (same as in RefundsTable)
const StatusBadge = ({ status, type }) => {
  // Implementation same as RefundsTable - omitted for brevity
};

// Priority Badge Component (same as in RefundsTable)
const PriorityBadge = ({ priority }) => {
  // Implementation same as RefundsTable - omitted for brevity
};

// Documentation Badge Component (same as in RefundsTable)
const DocumentationBadge = ({ status }) => {
  // Implementation same as RefundsTable - omitted for brevity
};

const RefundDetailsPanel = ({
  selectedRefund,
  setSelectedRefund,
  activeTab,
  setActiveTab,
  approveRefund,
  rejectRefund,
  processDispute,
  newNote,
  setNewNote,
  addCommunication,
  sendEmail,
}) => {
  if (!selectedRefund) return null;

  return (
    <AnimatePresence>
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
                    {selectedRefund.documentationStatus === "incomplete" && (
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
                            onClick={() => processDispute(selectedRefund.id)}
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
                              toast.success(`Viewing document: ${doc.filename}`)
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
                ["pending", "processing"].includes(selectedRefund.status) && (
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
    </AnimatePresence>
  );
};

export default RefundDetailsPanel;