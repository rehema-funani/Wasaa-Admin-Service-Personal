import { AlertTriangle, Info } from 'lucide-react';

const AddEditRuleModal = ({
    modalType,
    ruleFormData,
    setRuleFormData,
    setIsModalOpen,
    setModalType,
    setSelectedRule,
    handleAddRule,
    handleUpdateRule
}) => {
  return (
      <div className="space-y-4 p-1">
          {modalType === 'edit' ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4">
                  <div className="flex">
                      <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                              You are editing an AML rule. Changes may affect detection patterns and alerts.
                          </p>
                      </div>
                  </div>
              </div>
          ) : (
              <div className="bg-primary-50 border-l-4 border-primary-400 p-3 rounded-md mb-4">
                  <div className="flex">
                      <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-primary-400" />
                      </div>
                      <div className="ml-3">
                          <p className="text-sm text-primary-700">
                              You are creating a new AML rule. The rule will be set to inactive by default until you activate it.
                          </p>
                      </div>
                  </div>
              </div>
          )}

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
              <input
                  type="text"
                  value={ruleFormData.name}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, name: e.target.value })}
                  placeholder="Enter rule name..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                  required
              />
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                  value={ruleFormData.description}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, description: e.target.value })}
                  placeholder="Enter rule description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                  required
              />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
                  <select
                      value={ruleFormData.ruleType}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, ruleType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                  >
                      <option value="transaction">Transaction</option>
                      <option value="behavior">Behavior</option>
                      <option value="identity">Identity</option>
                      <option value="velocity">Velocity</option>
                      <option value="pattern">Pattern</option>
                      <option value="geographic">Geographic</option>
                  </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                      value={ruleFormData.category}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
                  >
                      <option value="monitoring">Monitoring</option>
                      <option value="screening">Screening</option>
                      <option value="detection">Detection</option>
                      <option value="verification">Verification</option>
                  </select>
              </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                  value={ruleFormData.severity}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, severity: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm"
              >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
              </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Rule Configuration</h3>
              <p className="text-sm text-gray-500 mb-3">
                  In a complete implementation, this section would include interfaces for configuring:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 ml-5 list-disc">
                  <li>Rule parameters (thresholds, criteria values)</li>
                  <li>Rule conditions (logical expressions, comparison operators)</li>
                  <li>Rule actions (alerts, blocking, notifications)</li>
                  <li>Testing capabilities against historical data</li>
              </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
              <button
                  onClick={() => {
                      setIsModalOpen(false);
                      setModalType(null);
                      setSelectedRule(null);
                      setRuleFormData({
                          name: '',
                          description: '',
                          ruleType: 'transaction',
                          category: 'detection',
                          status: 'inactive',
                          severity: 'medium',
                          parameters: [],
                          conditions: [],
                          actions: []
                      });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                  Cancel
              </button>

              <button
                  onClick={modalType === 'add' ? handleAddRule : handleUpdateRule}
                  disabled={!ruleFormData.name || !ruleFormData.description}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {modalType === 'add' ? 'Add Rule' : 'Update Rule'}
              </button>
          </div>
      </div>
  )
}

export default AddEditRuleModal
