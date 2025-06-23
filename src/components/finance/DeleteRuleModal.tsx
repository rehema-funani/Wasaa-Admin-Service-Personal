import { AlertTriangle } from 'lucide-react';

const DeleteRuleModal = ({
    selectedRule,
    setIsModalOpen,
    setModalType,
    setSelectedRule,
    handleDeleteRule,
    formatRuleType
}) => {
  return (
      <div className="space-y-4 p-1">
          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
              <div className="flex">
                  <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                      <p className="text-sm text-red-700">
                          Are you sure you want to delete this AML rule? This action cannot be undone and may affect compliance monitoring.
                      </p>
                  </div>
              </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <div className="text-gray-500">Rule Name:</div>
                      <div className="font-medium text-gray-800">{selectedRule.name}</div>
                  </div>
                  <div>
                      <div className="text-gray-500">Rule Type:</div>
                      <div className="font-medium text-gray-800">{formatRuleType(selectedRule.ruleType)}</div>
                  </div>
              </div>

              <div className="mt-3">
                  <div className="text-gray-500">Description:</div>
                  <div className="font-medium text-gray-800">{selectedRule.description}</div>
              </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
              <button
                  onClick={() => {
                      setIsModalOpen(false);
                      setModalType(null);
                      setSelectedRule(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                  Cancel
              </button>

              <button
                  onClick={handleDeleteRule}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
              >
                  Delete Rule
              </button>
          </div>
      </div>
  )
}

export default DeleteRuleModal
