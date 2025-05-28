import { Wallet } from 'lucide-react'

const ViewBlackListModal = ({
  selectedEntry,
  setIsModalOpen,
  openEditModal,
  getEntityTypeIcon,
  formatEntityType,
  getStatusIcon,
  getStatusColor,
  formatCurrency,
  getRiskColor,
  formatDate
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 p-6 rounded-xl border border-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              {getEntityTypeIcon(selectedEntry.entityType)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {formatEntityType(selectedEntry.entityType)} Entry
              </h3>
              <p className="text-sm text-slate-500">ID: {selectedEntry.id}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(selectedEntry.status)}`}>
            {getStatusIcon(selectedEntry.status)}
            {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
          </span>
        </div>

        {/* Wallet Information */}
        <div className="bg-white p-4 rounded-lg border border-slate-200/50">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Wallet ID:</span>
              <p className="font-mono text-slate-700 break-all">{selectedEntry.userWalletId}</p>
            </div>
            <div>
              <span className="text-slate-500">Type:</span>
              <p className="font-medium text-slate-700">{selectedEntry.UserWallet.type}</p>
            </div>
            <div>
              <span className="text-slate-500">Balance:</span>
              <p className="font-bold text-slate-900">{formatCurrency(selectedEntry.UserWallet.balance)}</p>
            </div>
            <div>
              <span className="text-slate-500">Status:</span>
              <p className="font-medium text-slate-700">{selectedEntry.UserWallet.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Reason</label>
            <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              {selectedEntry.reason || 'No reason provided'}
            </div>
          </div>

          {selectedEntry.notes && (
            <div>
              <label className="text-sm font-semibold text-slate-700">Notes</label>
              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                {selectedEntry.notes}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Risk Assessment</label>
            <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              {selectedEntry.riskScore !== null ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Risk Score</span>
                    <span className={`text-lg font-bold ${getRiskColor(selectedEntry.riskScore)}`}>
                      {selectedEntry.riskScore}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${selectedEntry.riskScore >= 80 ? 'bg-red-500' :
                          selectedEntry.riskScore >= 60 ? 'bg-orange-500' :
                            selectedEntry.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      style={{ width: `${selectedEntry.riskScore}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-slate-500">No risk score available</span>
              )}

              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Trigger Count: {selectedEntry.triggerCount}</div>
                  {selectedEntry.lastTriggered && (
                    <div>Last Triggered: {formatDate(selectedEntry.lastTriggered)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Timeline</label>
            <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="text-sm">
                <span className="text-slate-500">Added:</span>
                <span className="ml-2 font-medium">{formatDate(selectedEntry.addedAt)}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Updated:</span>
                <span className="ml-2 font-medium">{formatDate(selectedEntry.updatedAt)}</span>
              </div>
              {selectedEntry.addedBy && (
                <div className="text-sm">
                  <span className="text-slate-500">Added by:</span>
                  <span className="ml-2 font-medium">{selectedEntry.addedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-6 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
        >
          Close
        </button>
        <button
          onClick={() => openEditModal(selectedEntry)}
          className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          Edit Entry
        </button>
      </div>
    </div>
  )
}

export default ViewBlackListModal
