import React from 'react'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, X, AlertTriangle, CheckCircle2, Zap, BarChart3, ChevronDown, Shield, Save } from "lucide-react";

const EditCategory = ({
  editFormData,
  setEditFormData,
  editFormErrors,
  handleEditFormChange,
  handleEditSubmit,
  isSubmitting,
  setShowEditModal,
  touched,
  getHumanReadableTime,
  formatTime,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/95 backdrop-blur-xl max-h-[85vh] mt-6 overflow-y-auto rounded-2xl border border-slate-200/50 p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Edit size={20} className="text-indigo-500 mr-2" />
              Edit Category
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Update category details and SLA settings
            </p>
          </div>

          <button
            onClick={() => setShowEditModal(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleEditSubmit}>
          <div className="space-y-5">
            {/* Category name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Category Name <span className="text-rose-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className={`block w-full px-4 py-2.5 sm:text-sm rounded-lg shadow-sm transition-colors duration-200 ${
                    editFormErrors.name
                      ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
                {editFormErrors.name ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertTriangle size={18} className="text-rose-500" />
                  </div>
                ) : (
                  touched.name && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                  )
                )}
              </div>
              {editFormErrors.name && (
                <p className="mt-1 text-sm text-rose-600 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {editFormErrors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description <span className="text-rose-500">*</span>
              </label>
              <div className="mt-1 relative">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  className={`block w-full px-4 py-2.5 sm:text-sm rounded-lg shadow-sm transition-colors duration-200 ${
                    editFormErrors.description
                      ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                ></textarea>
                {editFormErrors.description ? (
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <AlertTriangle size={18} className="text-rose-500" />
                  </div>
                ) : (
                  touched.description && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                  )
                )}
              </div>
              {editFormErrors.description && (
                <p className="mt-1 text-sm text-rose-600 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {editFormErrors.description}
                </p>
              )}
            </div>

            {/* SLA times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstResponseSla"
                  className="block text-sm font-medium text-slate-700"
                >
                  Response Time (min) <span className="text-rose-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    id="firstResponseSla"
                    name="firstResponseSla"
                    value={editFormData.firstResponseSla}
                    onChange={handleEditFormChange}
                    min="1"
                    className={`block w-full px-4 py-2.5 sm:text-sm rounded-lg shadow-sm transition-colors duration-200 ${
                      editFormErrors.firstResponseSla
                        ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                        : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                  {editFormErrors.firstResponseSla ? (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertTriangle size={18} className="text-rose-500" />
                    </div>
                  ) : (
                    touched.firstResponseSla && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      </div>
                    )
                  )}
                </div>
                {editFormErrors.firstResponseSla ? (
                  <p className="mt-1 text-sm text-rose-600 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {editFormErrors.firstResponseSla}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    {editFormData.firstResponseSla > 0
                      ? getHumanReadableTime(editFormData.firstResponseSla)
                      : ""}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="resolutionSla"
                  className="block text-sm font-medium text-slate-700"
                >
                  Resolution Time (min) <span className="text-rose-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    id="resolutionSla"
                    name="resolutionSla"
                    value={editFormData.resolutionSla}
                    onChange={handleEditFormChange}
                    min="1"
                    className={`block w-full px-4 py-2.5 sm:text-sm rounded-lg shadow-sm transition-colors duration-200 ${
                      editFormErrors.resolutionSla
                        ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/50"
                        : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                  {editFormErrors.resolutionSla ? (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertTriangle size={18} className="text-rose-500" />
                    </div>
                  ) : (
                    touched.resolutionSla && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      </div>
                    )
                  )}
                </div>
                {editFormErrors.resolutionSla ? (
                  <p className="mt-1 text-sm text-rose-600 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {editFormErrors.resolutionSla}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    {editFormData.resolutionSla > 0
                      ? getHumanReadableTime(editFormData.resolutionSla)
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {/* SLA timeline visualization */}
            {editFormData.firstResponseSla > 0 &&
              editFormData.resolutionSla > editFormData.firstResponseSla && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                    <BarChart3 size={16} className="mr-1.5 text-indigo-500" />
                    SLA Timeline
                  </h3>

                  <div className="relative h-14">
                    {/* Timeline bar */}
                    <div className="absolute top-8 left-0 right-0 h-2 bg-slate-200 rounded-full"></div>

                    {/* Ticket created marker */}
                    <div className="absolute top-6 left-0 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                      <div className="text-xs font-medium text-slate-700 mt-1">
                        Created
                      </div>
                    </div>

                    {/* Response marker */}
                    <div
                      className="absolute top-6 flex flex-col items-center"
                      style={{
                        left: `${Math.min(
                          30,
                          (editFormData.firstResponseSla /
                            (editFormData.resolutionSla * 1.2)) *
                            100
                        )}%`,
                      }}
                    >
                      <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div>
                      <div className="text-xs font-medium text-amber-700 mt-1">
                        Response
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {formatTime(editFormData.firstResponseSla)}
                      </div>
                    </div>

                    {/* Resolution marker */}
                    <div
                      className="absolute top-6 flex flex-col items-center"
                      style={{
                        left: `${Math.min(
                          90,
                          (editFormData.resolutionSla /
                            (editFormData.resolutionSla * 1.2)) *
                            100
                        )}%`,
                      }}
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                      <div className="text-xs font-medium text-emerald-700 mt-1">
                        Resolution
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {formatTime(editFormData.resolutionSla)}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="absolute top-8 left-0 h-2 bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          90,
                          (editFormData.resolutionSla /
                            (editFormData.resolutionSla * 1.2)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

            {/* Priority */}
            <div>
              <label
                htmlFor="defaultPriority"
                className="block text-sm font-medium text-slate-700"
              >
                Default Priority <span className="text-rose-500">*</span>
              </label>
              <div className="mt-1 relative">
                <select
                  id="defaultPriority"
                  name="defaultPriority"
                  value={editFormData.defaultPriority}
                  onChange={handleEditFormChange}
                  className="block w-full px-4 py-2.5 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={18} className="text-slate-400" />
                </div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((priority) => (
                  <div
                    key={priority}
                    onClick={() =>
                      setEditFormData((prev) => ({
                        ...prev,
                        defaultPriority: priority as any,
                      }))
                    }
                    className={`cursor-pointer flex items-center justify-center p-2 rounded-lg border transition-all ${
                      editFormData.defaultPriority === priority
                        ? priority === "LOW"
                          ? "bg-emerald-50 border-emerald-200 shadow-sm"
                          : priority === "MEDIUM"
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : priority === "HIGH"
                          ? "bg-amber-50 border-amber-200 shadow-sm"
                          : "bg-rose-50 border-rose-200 shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-medium flex flex-col items-center">
                      <Shield
                        size={14}
                        className={`mb-1 ${
                          priority === "LOW"
                            ? "text-emerald-500"
                            : priority === "MEDIUM"
                            ? "text-blue-500"
                            : priority === "HIGH"
                            ? "text-amber-500"
                            : "text-rose-500"
                        }`}
                      />
                      <span
                        className={`${
                          priority === "LOW"
                            ? "text-emerald-700"
                            : priority === "MEDIUM"
                            ? "text-blue-700"
                            : priority === "HIGH"
                            ? "text-amber-700"
                            : "text-rose-700"
                        }`}
                      >
                        {priority.charAt(0) + priority.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-start bg-white rounded-lg p-4 border border-slate-200 transition-colors duration-200 hover:bg-indigo-50/30 hover:border-indigo-200/50">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={editFormData.isActive}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      isActive: e.target.checked,
                    })
                  }
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 flex-1">
                <label
                  htmlFor="isActive"
                  className="font-medium text-slate-700 flex items-center text-sm"
                >
                  <Zap size={16} className="mr-1.5 text-indigo-500" />
                  Active Category
                </label>
                <p className="text-slate-500 text-sm mt-1">
                  When enabled, this category will be available for selection
                  when creating new tickets.
                </p>
              </div>

              {/* Status badge */}
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  editFormData.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {editFormData.isActive ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="inline-flex items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2.5 shadow-lg shadow-indigo-200/50 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Category
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditCategory
