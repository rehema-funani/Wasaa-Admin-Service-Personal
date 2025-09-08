import { AlertTriangle, Eye, Plus, Target, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react'

const EscrowMilestones = ({
    escrow,
    formatCurrency,
    formatDate,
    getMilestoneStatusBadge,
    calculateMilestoneProgress,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-800">
          Milestones ({escrow.milestones?.length || 0})
        </h4>
        {escrow.has_milestone && (
          <motion.button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </motion.button>
        )}
      </div>

      {escrow.has_milestone ? (
        escrow.milestones && escrow.milestones.length > 0 ? (
          <div className="space-y-4">
            {escrow.milestones.map((milestone: any, index: number) => (
              <motion.div
                key={milestone.idx}
                className="bg-white/40 rounded-xl p-6 border border-white/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-sm font-medium text-blue-600">
                          {milestone.order || index + 1}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">
                          {milestone.name || `Milestone ${index + 1}`}
                        </h5>
                        <p className="text-xs text-gray-500">
                          ID: {milestone.idx?.slice(0, 8) || "N/A"}
                          ...
                        </p>
                      </div>
                      {getMilestoneStatusBadge(milestone.status)}
                    </div>

                    {milestone.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {milestone.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="text-xs text-gray-500">Amount</label>
                        <p className="font-medium text-gray-800">
                          {formatCurrency(
                            milestone.amountMinor || "0",
                            escrow.currency || "KES"
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Released
                        </label>
                        <p className="font-medium text-green-600">
                          {formatCurrency(
                            milestone.releasedMinor || "0",
                            escrow.currency || "KES"
                          )}
                        </p>
                      </div>
                    </div>

                    {milestone.deadline && (
                      <div className="mb-3">
                        <label className="text-xs text-gray-500">
                          Deadline
                        </label>
                        <p className="text-sm text-gray-700">
                          {formatDate(milestone.deadline)}
                        </p>
                      </div>
                    )}

                    {milestone.completedDate && (
                      <div className="mb-3">
                        <label className="text-xs text-gray-500">
                          Completed
                        </label>
                        <p className="text-sm text-gray-700">
                          {formatDate(milestone.completedDate)}
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>
                          {Math.round(calculateMilestoneProgress(milestone))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            milestone.status === "COMPLETED"
                              ? "bg-green-500"
                              : milestone.status === "IN_PROGRESS"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                          style={{
                            width:
                              milestone.status === "COMPLETED"
                                ? "100%"
                                : `${Math.max(
                                    calculateMilestoneProgress(milestone),
                                    5
                                  )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Created: {formatDate(milestone.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    {milestone.status !== "COMPLETED" && (
                      <motion.button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Release Funds"
                      >
                        <Unlock className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/40 rounded-xl border-2 border-dashed border-gray-300">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h5 className="text-lg font-medium text-gray-900 mb-2">
              No milestones created yet
            </h5>
            <p className="text-gray-500 mb-4">
              Create milestones to break down the escrow into manageable
              releases
            </p>
            <motion.button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Milestone
            </motion.button>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50/50 rounded-xl">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h5 className="text-lg font-medium text-gray-900 mb-2">
            This escrow doesn't use milestones
          </h5>
          <p className="text-gray-500">
            This is a simple escrow without milestone-based releases
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default EscrowMilestones
