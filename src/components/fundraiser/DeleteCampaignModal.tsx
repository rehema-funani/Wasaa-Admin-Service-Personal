import { motion } from "framer-motion";
import { XCircle, AlertTriangle, Trash2 } from "lucide-react";

const DeleteCampaignModal = ({ campaign, onClose, onDelete }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-red-200 dark:border-red-700/40"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-red-50 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle
              size={20}
              className="text-red-600 dark:text-red-400"
            />
            Danger Zone
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start mb-5">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-4">
              <AlertTriangle size={26} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">
                This campaign will be{" "}
                <span className="font-medium text-red-600 dark:text-red-400">
                  permanently deleted
                </span>
                . This action{" "}
                <span className="font-bold">cannot be undone</span> and is
                strongly discouraged unless absolutely necessary.
              </p>
            </div>
          </div>

          {/* Campaign preview */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">
              {campaign.title}
            </p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Status: {campaign.status.replace(/_/g, " ")}</span>
              <span className="mx-2">•</span>
              <span>
                Raised: Kes{" "}
                {parseFloat(campaign.raisedAmount || 0).toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center shadow-sm"
              onClick={onDelete}
            >
              <Trash2 size={16} className="mr-2" />
              Yes, Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteCampaignModal;
