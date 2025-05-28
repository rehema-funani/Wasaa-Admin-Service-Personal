import { AlertCircle, ArrowRight, CheckCircle2, Eye, Flag, XCircle } from 'lucide-react'

const UpdateAlertModal = ({
    selectedAlert,
    setIsModalOpen,
    handleStatusUpdate,
    getRiskLevelColor,
    getRiskLevelIcon,
    getStatusColor,
    getStatusIcon,
    formatAlertType
}) => {
  return (
        <div className="space-y-5 p-1">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            You are updating the status of an AML alert for <strong>{selectedAlert.userName}</strong>.
                            This action will be logged for audit purposes.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
                <div className="p-4 bg-gray-50 rounded-xl mb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>
                            {getStatusIcon(selectedAlert.status)}
                            {selectedAlert.status === 'under_review'
                                ? 'Under Review'
                                : selectedAlert.status === 'false_positive'
                                    ? 'False Positive'
                                    : selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedAlert.RiskLevel.name)}`}>
                            {getRiskLevelIcon(selectedAlert.RiskLevel.name)}
                            {selectedAlert.RiskLevel.name.charAt(0).toUpperCase() + selectedAlert.RiskLevel.name.slice(1)} Risk
                        </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                        <strong>Alert:</strong> {formatAlertType(selectedAlert.AlertType.name)}
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                        <strong>Description:</strong> {selectedAlert.description}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Update Status To:</label>
                <div className="space-y-3">
                    {selectedAlert.status === 'new' && (
                        <button
                            onClick={() => handleStatusUpdate(selectedAlert.id, 'under_review')}
                            className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-yellow-200 transition-all"
                        >
                            <div className="flex items-center">
                                <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-lg mr-3">
                                    <Eye size={18} className="text-yellow-600" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-gray-900">Mark as Under Review</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Begin investigating this alert</div>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-gray-400" />
                        </button>
                    )}

                    {(selectedAlert.status === 'new' || selectedAlert.status === 'under_review') && (
                        <button
                            onClick={() => handleStatusUpdate(selectedAlert.id, 'escalated')}
                            className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-orange-200 transition-all"
                        >
                            <div className="flex items-center">
                                <div className="p-2.5 bg-orange-50 border border-orange-100 rounded-lg mr-3">
                                    <Flag size={18} className="text-orange-600" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-gray-900">Escalate</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Escalate to senior compliance team</div>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-gray-400" />
                        </button>
                    )}

                    {(selectedAlert.status === 'new' || selectedAlert.status === 'under_review' || selectedAlert.status === 'escalated') && (
                        <>
                            <button
                                onClick={() => {
                                    const resolution = window.prompt('Please provide a resolution note:');
                                    if (resolution) {
                                        handleStatusUpdate(selectedAlert.id, 'resolved', resolution);
                                    }
                                }}
                                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-200 transition-all"
                            >
                                <div className="flex items-center">
                                    <div className="p-2.5 bg-green-50 border border-green-100 rounded-lg mr-3">
                                        <CheckCircle2 size={18} className="text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-medium text-gray-900">Mark as Resolved</div>
                                        <div className="text-xs text-gray-500 mt-0.5">Alert has been addressed and resolved</div>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-gray-400" />
                            </button>

                            <button
                                onClick={() => {
                                    const resolution = window.prompt('Please provide a reason for false positive:');
                                    if (resolution) {
                                        handleStatusUpdate(selectedAlert.id, 'false_positive', resolution);
                                    }
                                }}
                                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                <div className="flex items-center">
                                    <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-lg mr-3">
                                        <XCircle size={18} className="text-gray-600" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-medium text-gray-900">Mark as False Positive</div>
                                        <div className="text-xs text-gray-500 mt-0.5">Alert was triggered incorrectly</div>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-gray-400" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default UpdateAlertModal
