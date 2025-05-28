import { AlertTriangle } from 'lucide-react';

const AddEditBlacklistModal = ({
    modalType,
    setModalType,
    activeTab,
    selectedEntry,
    formData,
    setFormData,
    handleAddEntry,
    handleUpdateEntry,
    setIsModalOpen,
    resetForm
}) => {
  return (
        <div className="space-y-6">
            <div className={`p-4 rounded-lg border-l-4 ${modalType === 'add'
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-amber-50 border-amber-400'
                }`}>
                <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${modalType === 'add' ? 'text-blue-500' : 'text-amber-500'
                        }`} />
                    <p className={`text-sm font-medium ${modalType === 'add' ? 'text-blue-800' : 'text-amber-800'
                        }`}>
                        {modalType === 'add'
                            ? `Adding a new entry to the ${activeTab}. This action will be logged for audit purposes.`
                            : `Editing an existing ${selectedEntry?.type} entry. Changes will be logged for audit purposes.`
                        }
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Entity Type</label>
                        <select
                            value={formData.entityType}
                            onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        >
                            <option value="user">User</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="ip_address">IP Address</option>
                            <option value="device_id">Device ID</option>
                            <option value="account">Account</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Wallet ID</label>
                        <input
                            type="text"
                            value={formData.userWalletId}
                            onChange={(e) => setFormData({ ...formData, userWalletId: e.target.value })}
                            placeholder="Enter wallet ID..."
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Reason</label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder={`Why is this entity being ${activeTab === 'blacklist' ? 'blacklisted' : 'whitelisted'}?`}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Any additional information about this entry..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <button
                    onClick={() => {
                        setIsModalOpen(false);
                        setModalType(null);
                        resetForm();
                    }}
                    className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={modalType === 'add' ? handleAddEntry : handleUpdateEntry}
                    disabled={!formData.userWalletId || !formData.reason}
                    className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {modalType === 'add' ? 'Add' : 'Update'} Entry
                </button>
            </div>
        </div>
    )
}

export default AddEditBlacklistModal
