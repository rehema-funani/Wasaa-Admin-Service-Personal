import { X } from 'lucide-react';
import React from 'react'

const AssignModal = ({
    setShowAssignModal,
    assignData,
    setAssignData,
    handleAssignTicket,
    agents,
    loadingAgents,
    getFullName,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Assign Ticket
          </h2>
          <button
            onClick={() => setShowAssignModal(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assign to Agent
          </label>
          {loadingAgents ? (
            <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
          ) : (
            <select
              value={assignData.userId}
              onChange={(e) =>
                setAssignData({ ...assignData, userId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.userId}>
                  {getFullName(agent.user.firstName, agent.user.lastName)} (
                  {agent.department})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowAssignModal(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignTicket}
            disabled={!assignData.userId}
            className={`px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              !assignData.userId
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignModal
