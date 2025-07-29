import { X } from 'lucide-react';
import React from 'react'

const ResolveModal = ({
    setShowResolveModal,
    resolveData,
    setResolveData,
    handleResolveTicket,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Resolve Ticket
          </h2>
          <button
            onClick={() => setShowResolveModal(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Resolution notes
          </label>
          <textarea
            value={resolveData.resolutionNotes}
            onChange={(e) =>
              setResolveData({
                ...resolveData,
                resolutionNotes: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            rows={3}
            placeholder="Provide details about how this issue was resolved..."
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowResolveModal(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={handleResolveTicket}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResolveModal
