import React from 'react'
import { AlertCircle, CheckCircle2, Eye } from 'lucide-react'

const ViewAlertModal = ({
    selectedAlert,
    setIsModalOpen,
    openUpdateStatusModal,
    getRiskLevelColor,
    getRiskLevelIcon,
    getStatusColor,
    getStatusIcon,
    formatAlertType,
    formatDate
}) => {
  return (
      <div className="space-y-6 p-1">
          <div className="bg-gray-50 p-5 rounded-xl mb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedAlert.RiskLevel.name)}`}>
                          {getRiskLevelIcon(selectedAlert.RiskLevel.name)}
                          {selectedAlert.RiskLevel.name.charAt(0).toUpperCase() + selectedAlert.RiskLevel.name.slice(1)} Risk
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>
                          {getStatusIcon(selectedAlert.status)}
                          {selectedAlert.status === 'under_review'
                              ? 'Under Review'
                              : selectedAlert.status === 'false_positive'
                                  ? 'False Positive'
                                  : selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1)}
                      </span>
                  </div>
                  <div className="text-xs text-gray-500">ID: {selectedAlert.id.substring(0, 8)}...</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <div className="text-gray-500 mb-1">User:</div>
                      <div className="font-medium text-gray-800">{selectedAlert.userName}</div>
                      <div className="text-gray-500 text-xs mt-0.5">ID: {selectedAlert.userUuid.substring(0, 8)}...</div>
                  </div>
                  <div>
                      <div className="text-gray-500 mb-1">Alert Type:</div>
                      <div className="font-medium text-gray-800">{formatAlertType(selectedAlert.AlertType.name)}</div>
                      <div className="text-gray-500 text-xs mt-0.5">Created: {formatDate(selectedAlert.createdAt)}</div>
                  </div>
              </div>
          </div>

          <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Alert Description</h3>
              <div className="p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-700">
                  {selectedAlert.description}
              </div>
          </div>

          {selectedAlert.userWalletTransactionIds && selectedAlert.userWalletTransactionIds.length > 0 && (
              <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Related Transactions</h3>
                  <div className="overflow-hidden border border-gray-200 rounded-xl">
                      <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Transaction ID</th>
                                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                  {selectedAlert.userWalletTransactionIds.map((txId) => (
                                      <tr key={txId} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{txId.substring(0, 8)}...</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                              <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                                  View Details
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status Timeline</h3>
                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                              <AlertCircle size={16} className="text-blue-600" />
                          </div>
                          <div className="flex-grow pt-1">
                              <div className="text-sm font-medium text-gray-800">Alert Created</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                  {formatDate(selectedAlert.createdAt)}
                              </div>
                          </div>
                      </div>

                      {selectedAlert.assignedTo && selectedAlert.reviewedAt && (
                          <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                                  <Eye size={16} className="text-yellow-600" />
                              </div>
                              <div className="flex-grow pt-1">
                                  <div className="text-sm font-medium text-gray-800">Under Review</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                      {formatDate(selectedAlert.reviewedAt)} by {selectedAlert.assignedTo}
                                  </div>
                              </div>
                          </div>
                      )}

                      {selectedAlert.resolvedAt && (
                          <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                                  <CheckCircle2 size={16} className="text-green-600" />
                              </div>
                              <div className="flex-grow pt-1">
                                  <div className="text-sm font-medium text-gray-800">
                                      {selectedAlert.status === 'false_positive' ? 'Marked as False Positive' : 'Resolved'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                      {formatDate(selectedAlert.resolvedAt)}
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* If we had resolution data */}
              {/* {selectedAlert.resolution && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Resolution</h3>
                                    <div className="p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-700">
                                        {selectedAlert.resolution}
                                    </div>
                                </div>
                            )} */}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
              <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              >
                  Close
              </button>

              {(selectedAlert.status === 'new' || selectedAlert.status === 'under_review') && (
                  <button
                      onClick={() => openUpdateStatusModal(selectedAlert)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 transition-all"
                  >
                      Update Status
                  </button>
              )}
          </div>
      </div>
  )
}

export default ViewAlertModal
