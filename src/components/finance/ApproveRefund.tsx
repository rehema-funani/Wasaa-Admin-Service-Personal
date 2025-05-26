import { AlertTriangle } from 'lucide-react'
import React from 'react'

const ApproveRefund = ({
    selectedRequest,
    setIsModalOpen,
    handleStatusUpdate,
    formatCurrency,
    approvalNote,
    setApprovalNote
}) => {
  return (
      <div className="space-y-4 p-1">
          <div className="bg-warning-50 border-l-4 border-warning-400 p-3 rounded-md">
              <div className="flex">
                  <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-warning-400" />
                  </div>
                  <div className="ml-3">
                      <p className="text-sm text-warning-700">
                          You are about to approve a reversal of {formatCurrency(selectedRequest.amount)} for transaction {selectedRequest.transactionId.substring(0, 8)}...
                          This action requires dual approval and will be logged for audit purposes.
                      </p>
                  </div>
              </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Approval Note (Optional)</label>
              <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Add any additional notes or justification for approving this reversal..."
                  rows={4}
                  className="p-3 w-full bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-300 text-neutral-700 text-sm"
              />
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-neutral-200">
              <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
              >
                  Cancel
              </button>
              <button
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'approved', approvalNote)}
                  className="px-4 py-2 text-sm font-medium text-white bg-success-600 border border-transparent rounded-lg hover:bg-success-700 shadow-button"
              >
                  Confirm Approval
              </button>
          </div>
      </div>
  )
}

export default ApproveRefund
