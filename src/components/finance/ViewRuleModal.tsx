import React from 'react'

const ViewRuleModal = ({
    selectedRule,
    setIsModalOpen,
    openEditRuleModal,
    renderParametersSection,
    renderConditionsSection,
    renderActionsSection,
    getSeverityColor,
    getStatusColor,
    getStatusIcon,
    getRuleTypeIcon,
    formatRuleType,
    getCategoryIcon,
    formatCategory,
    formatDate
}) => {
  return (
      <div className="space-y-4 p-1">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedRule.severity)}`}>
                          {selectedRule.severity.charAt(0).toUpperCase() + selectedRule.severity.slice(1)} Severity
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRule.status)}`}>
                          {getStatusIcon(selectedRule.status)}
                          {selectedRule.status.charAt(0).toUpperCase() + selectedRule.status.slice(1)}
                      </span>
                      {selectedRule.isSystemRule && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              System Rule
                          </span>
                      )}
                  </div>
                  <div className="text-sm text-gray-500">ID: {selectedRule.id} (v{selectedRule.version})</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <div className="text-gray-500">Type:</div>
                      <div className="font-medium text-gray-800 flex items-center">
                          <div className="mr-2">
                              {getRuleTypeIcon(selectedRule.ruleType)}
                          </div>
                          {formatRuleType(selectedRule.ruleType)}
                      </div>
                  </div>
                  <div>
                      <div className="text-gray-500">Category:</div>
                      <div className="font-medium text-gray-800 flex items-center">
                          <div className="mr-2">
                              {getCategoryIcon(selectedRule.category)}
                          </div>
                          {formatCategory(selectedRule.category)}
                      </div>
                  </div>
              </div>

              <div className="mt-3">
                  <div className="text-gray-500">Description:</div>
                  <div className="font-medium text-gray-800 mt-1">{selectedRule.description}</div>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Created By</h3>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-medium text-gray-800">{selectedRule.createdBy}</div>
                      <div className="text-gray-500 text-xs mt-1">{formatDate(selectedRule.createdAt)}</div>
                  </div>
              </div>

              <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Last Updated</h3>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-medium text-gray-800">{selectedRule.updatedBy || 'N/A'}</div>
                      <div className="text-gray-500 text-xs mt-1">{formatDate(selectedRule.updatedAt)}</div>
                  </div>
              </div>
          </div>

          {selectedRule.triggerCount !== undefined && (
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Trigger Statistics</h3>
                      <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-700">Total Triggers:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedRule.triggerCount}</span>
                          </div>
                          {selectedRule.lastTriggered && (
                              <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700">Last Triggered:</span>
                                  <span className="text-sm text-gray-500">{formatDate(selectedRule.lastTriggered)}</span>
                              </div>
                          )}
                      </div>
                  </div>

                  {selectedRule.falsePositiveRate !== undefined && (
                      <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Effectiveness</h3>
                          <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="mb-2">
                                  <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm text-gray-700">Accuracy Rate:</span>
                                      <span className="text-sm font-medium text-gray-900">
                                          {(1 - selectedRule.falsePositiveRate) * 100}%
                                      </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                          className={`h-2 rounded-full ${(1 - selectedRule.falsePositiveRate) >= 0.9 ? 'bg-green-500' :
                                              (1 - selectedRule.falsePositiveRate) >= 0.7 ? 'bg-primary-500' :
                                                  (1 - selectedRule.falsePositiveRate) >= 0.5 ? 'bg-yellow-500' :
                                                      'bg-red-500'
                                              }`}
                                          style={{ width: `${(1 - selectedRule.falsePositiveRate) * 100}%` }}
                                      ></div>
                                  </div>
                              </div>
                              <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700">False Positive Rate:</span>
                                  <span className="text-sm font-medium text-gray-900">
                                      {selectedRule.falsePositiveRate * 100}%
                                  </span>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          )}

          <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Parameters</h3>
              {renderParametersSection(selectedRule.parameters)}
          </div>

          <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Conditions</h3>
              {renderConditionsSection(selectedRule.conditions)}
          </div>

          <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
              {renderActionsSection(selectedRule.actions)}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-gray-200">
              <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                  Close
              </button>

              {!selectedRule.isSystemRule && (
                  <button
                      onClick={() => openEditRuleModal(selectedRule)}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700"
                  >
                      Edit Rule
                  </button>
              )}
          </div>
      </div>
  )
}

export default ViewRuleModal
