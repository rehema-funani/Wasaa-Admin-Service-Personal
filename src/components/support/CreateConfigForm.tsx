import { AlertOctagon, BarChart3, Clock, Save, Settings, Users, XCircle } from 'lucide-react';
import { motion } from 'framer-motion'
import React from 'react'

const CreateConfigForm = ({
    formData,
    handleInputChange,
    handlePriorityChange,
    handleCreateConfig,
    setShowCreateModal
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Create Queue Configuration
        </h3>
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          onClick={() => setShowCreateModal(false)}
        >
          <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-5 border border-gray-100 dark:border-slate-600">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-red-500 dark:text-red-400" />
            Basic Information
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Configuration Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                placeholder="e.g. Default Queue Configuration"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Method
                </label>
                <select
                  name="assignmentMethod"
                  value={formData.assignmentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATED">Automated</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Assignment
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="autoAssignmentEnabled"
                      checked={formData.autoAssignmentEnabled}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-5 border border-gray-100 dark:border-slate-600">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            Queue Settings
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Tickets Per Agent
              </label>
              <input
                type="number"
                name="maxTicketsPerAgent"
                value={formData.maxTicketsPerAgent}
                onChange={handleInputChange}
                min="1"
                max="50"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lock Timeout (mins)
              </label>
              <input
                type="number"
                name="lockTimeoutMinutes"
                value={formData.lockTimeoutMinutes}
                onChange={handleInputChange}
                min="5"
                max="120"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Escalation Threshold (hrs)
              </label>
              <input
                type="number"
                name="escalationThresholdHours"
                value={formData.escalationThresholdHours}
                onChange={handleInputChange}
                min="1"
                max="72"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill Matching Required
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="skillMatchingRequired"
                  checked={formData.skillMatchingRequired}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              When enabled, tickets will only be assigned to agents with
              matching skills
            </p>
          </div>
        </div>

        {/* Priority Weights */}
        <div className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-5 border border-gray-100 dark:border-slate-600">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            Priority Weights
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="inline-block w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full mr-2 text-center leading-5">
                  L
                </span>
                Low Priority
              </label>
              <input
                type="number"
                value={formData.priorityWeights.LOW}
                onChange={(e) => handlePriorityChange("LOW", e.target.value)}
                min="1"
                max="10"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="inline-block w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full mr-2 text-center leading-5">
                  M
                </span>
                Medium Priority
              </label>
              <input
                type="number"
                value={formData.priorityWeights.MEDIUM}
                onChange={(e) => handlePriorityChange("MEDIUM", e.target.value)}
                min="1"
                max="10"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="inline-block w-5 h-5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full mr-2 text-center leading-5">
                  H
                </span>
                High Priority
              </label>
              <input
                type="number"
                value={formData.priorityWeights.HIGH}
                onChange={(e) => handlePriorityChange("HIGH", e.target.value)}
                min="1"
                max="10"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="inline-block w-5 h-5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full mr-2 text-center leading-5">
                  C
                </span>
                Critical Priority
              </label>
              <input
                type="number"
                value={formData.priorityWeights.CRITICAL}
                onChange={(e) =>
                  handlePriorityChange("CRITICAL", e.target.value)
                }
                min="1"
                max="10"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Higher weight values will give tickets with that priority level
              more attention in the queue
            </p>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-5 border border-gray-100 dark:border-slate-600">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Business Hours
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="businessHours.start"
                value={formData.businessHours.start}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="businessHours.end"
                value={formData.businessHours.end}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <select
                name="businessHours.timezone"
                value={formData.businessHours.timezone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">
                  Central European Time (CET)
                </option>
                <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Configuration Status */}
        <div className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-5 border border-gray-100 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-500 dark:text-red-400" />
                Configuration Status
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Activate this configuration immediately?
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <motion.button
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
            onClick={() => setShowCreateModal(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            onClick={handleCreateConfig}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4 inline-block mr-2" />
            Create Configuration
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default CreateConfigForm
