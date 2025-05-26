import { CheckCircle2, ExternalLink, FileText, XCircle } from 'lucide-react'
import React from 'react'

const ViewRefund = ({
    selectedRequest,
    selectedRefund,
    setIsModalOpen,
    getStatusColor,
    formatCurrency,
    formatDate,
    getWalletTypeDisplay,
    openRefundDetails,
    openRejectModal,
    openApproveModal,
    handleStatusUpdate,
    getStatusIcon
}) => {
  return (
      <div className="space-y-4 p-1">
          <div className="bg-neutral-50 p-5 rounded-lg mb-4 border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                          {getStatusIcon(selectedRequest.status)}
                          {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </span>
                      <span className="text-sm text-neutral-500 font-mono">ID: {selectedRequest.id.substring(0, 8)}...</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-700">
                      {formatCurrency(selectedRequest.amount)}
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <div className="text-neutral-500 text-xs mb-1">Original Transaction:</div>
                      <div className="font-medium text-neutral-800 flex items-center">
                          <span className="font-mono">{selectedRequest.transactionId.substring(0, 12)}...</span>
                          <button
                              className="ml-1 text-primary-600 hover:text-primary-700"
                              onClick={() => openRefundDetails(selectedRequest.id)}
                          >
                              <ExternalLink size={14} />
                          </button>
                      </div>
                  </div>
                  <div>
                      <div className="text-neutral-500 text-xs mb-1">Wallet Type:</div>
                      <div className="font-medium text-neutral-800">{getWalletTypeDisplay(selectedRefund.UserWallet.type, selectedRefund.UserWallet.purpose)}</div>
                  </div>
              </div>
          </div>

          <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Reversal Reason</h3>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700">
                  {selectedRequest.reason}
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Transaction Information</h3>
                  <div className="space-y-2 p-3 bg-white border border-neutral-200 rounded-lg">
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500 text-xs">Description:</div>
                          <div className="font-medium text-neutral-800 text-xs">
                              {selectedRefund.OriginalTransaction.description || 'No description'}
                          </div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500 text-xs">Original Amount:</div>
                          <div className="font-medium text-neutral-800 text-xs">
                              {selectedRefund.OriginalTransaction.debit > 0
                                  ? formatCurrency(selectedRefund.OriginalTransaction.debit)
                                  : formatCurrency(selectedRefund.OriginalTransaction.credit)}
                          </div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500 text-xs">Current Balance:</div>
                          <div className="font-medium text-neutral-800 text-xs">
                              {formatCurrency(selectedRefund.UserWallet.balance)}
                          </div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500 text-xs">External Reference:</div>
                          <div className="font-medium text-neutral-800 text-xs font-mono">
                              {selectedRefund.OriginalTransaction.external_id || 'N/A'}
                          </div>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Request Timeline</h3>
                  <div className="space-y-3 p-3 bg-white border border-neutral-200 rounded-lg">
                      <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-primary-100 rounded-full">
                              <FileText size={14} className="text-primary-600" />
                          </div>
                          <div>
                              <div className="text-xs font-medium text-neutral-800">Requested</div>
                              <div className="text-xs text-neutral-500 mt-0.5">
                                  {formatDate(selectedRequest.requestedAt)} by {selectedRequest.requestedBy}
                              </div>
                          </div>
                      </div>

                      {selectedRequest.approvedBy && selectedRequest.approvedAt && (
                          <div className="flex items-start gap-2">
                              <div className="p-1.5 bg-success-100 rounded-full">
                                  <CheckCircle2 size={14} className="text-success-600" />
                              </div>
                              <div>
                                  <div className="text-xs font-medium text-neutral-800">Approved</div>
                                  <div className="text-xs text-neutral-500 mt-0.5">
                                      {formatDate(selectedRequest.approvedAt)} by {selectedRequest.approvedBy}
                                  </div>
                              </div>
                          </div>
                      )}

                      {selectedRequest.rejectedBy && selectedRequest.rejectedAt && (
                          <div className="flex items-start gap-2">
                              <div className="p-1.5 bg-danger-100 rounded-full">
                                  <XCircle size={14} className="text-danger-600" />
                              </div>
                              <div>
                                  <div className="text-xs font-medium text-neutral-800">Rejected</div>
                                  <div className="text-xs text-neutral-500 mt-0.5">
                                      {formatDate(selectedRequest.rejectedAt)} by {selectedRequest.rejectedBy}
                                  </div>
                              </div>
                          </div>
                      )}

                      {selectedRequest.completedAt && (
                          <div className="flex items-start gap-2">
                              <div className="p-1.5 bg-success-100 rounded-full">
                                  <CheckCircle2 size={14} className="text-success-600" />
                              </div>
                              <div>
                                  <div className="text-xs font-medium text-neutral-800">Completed</div>
                                  <div className="text-xs text-neutral-500 mt-0.5">
                                      {formatDate(selectedRequest.completedAt)}
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200">
              <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                  Close
              </button>

              {selectedRequest.status === 'pending' && (
                  <>
                      <button
                          onClick={() => openRejectModal(selectedRequest)}
                          className="px-4 py-2 text-sm font-medium text-white bg-danger-600 border border-transparent rounded-lg hover:bg-danger-700 shadow-sm"
                      >
                          Reject
                      </button>
                      <button
                          onClick={() => openApproveModal(selectedRequest)}
                          className="px-4 py-2 text-sm font-medium text-white bg-success-600 border border-transparent rounded-lg hover:bg-success-700 shadow-sm"
                      >
                          Approve
                      </button>
                  </>
              )}

              {selectedRequest.status === 'approved' && (
                  <button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')}
                      className="px-4 py-2 text-sm font-medium text-white bg-success-600 border border-transparent rounded-lg hover:bg-success-700 shadow-sm"
                  >
                      Mark as Completed
                  </button>
              )}
          </div>
      </div>
  )
}

export default ViewRefund
