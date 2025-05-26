import React from 'react'

const ReversalDetails = ({
    selectedRefund,
    setIsModalOpen,
    getStatusColor,
    formatCurrency,
    formatDate,
    getWalletTypeDisplay
}) => {
  return (
      <div className="space-y-4 p-1">
          <div className="bg-primary-50 p-5 rounded-lg mb-2 border border-primary-100">
              <div className="flex justify-between items-center mb-4">
                  <div>
                      <div className="text-sm text-neutral-500">Transaction ID</div>
                      <div className="text-base font-medium text-neutral-900 font-mono">{selectedRefund.OriginalTransaction.id.substring(0, 8)}...</div>
                  </div>
                  <div>
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedRefund.OriginalTransaction.status)}`}>
                          {selectedRefund.OriginalTransaction.status}
                      </div>
                  </div>
              </div>

              <div className="flex items-center justify-between">
                  <div>
                      <div className="text-sm text-neutral-500">Amount</div>
                      <div className={`text-xl font-semibold ${selectedRefund.OriginalTransaction.debit > 0 ? 'text-success-600' : 'text-primary-600'}`}>
                          {selectedRefund.OriginalTransaction.debit > 0
                              ? '+' + formatCurrency(selectedRefund.OriginalTransaction.debit)
                              : '-' + formatCurrency(selectedRefund.OriginalTransaction.credit)}
                      </div>
                  </div>
                  <div className="flex flex-col items-end">
                      <div className="text-sm text-neutral-500">Date & Time</div>
                      <div className="text-sm font-medium text-neutral-900">{formatDate(selectedRefund.OriginalTransaction.createdAt)}</div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Transaction Details</h3>
                  <div className="space-y-3 p-4 bg-white border border-neutral-200 rounded-lg">
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">Description:</div>
                          <div className="font-medium text-neutral-800">{selectedRefund.OriginalTransaction.description || 'N/A'}</div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">External Reference:</div>
                          <div className="font-medium text-neutral-800 font-mono">{selectedRefund.OriginalTransaction.external_id || 'N/A'}</div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">Balance After:</div>
                          <div className="font-medium text-neutral-800">{formatCurrency(selectedRefund.OriginalTransaction.balance)}</div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">Wallet ID:</div>
                          <div className="font-medium text-neutral-800 font-mono">{selectedRefund.OriginalTransaction.userWalletId.substring(0, 8)}...</div>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Wallet Information</h3>
                  <div className="space-y-3 p-4 bg-white border border-neutral-200 rounded-lg">
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">Type:</div>
                          <div className="font-medium text-neutral-800 capitalize">{getWalletTypeDisplay(selectedRefund.UserWallet.type, selectedRefund.UserWallet.purpose)}</div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">Current Balance:</div>
                          <div className="font-medium text-neutral-800">{formatCurrency(selectedRefund.UserWallet.balance)}</div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">Status:</div>
                          <div className="font-medium text-neutral-800">{selectedRefund.UserWallet.status}</div>
                      </div>
                      <div className="flex justify-between text-sm">
                          <div className="text-neutral-500">Last Updated:</div>
                          <div className="font-medium text-neutral-800">{formatDate(selectedRefund.UserWallet.updatedAt)}</div>
                      </div>
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
          </div>
      </div>
  )
}

export default ReversalDetails
