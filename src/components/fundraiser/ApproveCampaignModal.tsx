import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { fundraiserService } from "../../api/services/fundraiser";

const ApproveCampaignModal = ({
  onClose,
  onApproved,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    action: "approve",
    reason: "",
    notes: "",
  });
  const { id } = useParams();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = async () => {
    if (!formData.reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    setIsLoading(true);
    try {
      await fundraiserService.publishCampaign(id, formData);
      onApproved?.();
    } catch (error) {
      console.error("Error approving campaign:", error);
      toast.error("Failed to approve campaign");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mx-auto mb-4">
          <CheckCircle size={28} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
          Approve Campaign
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Please provide details before approving this campaign.
        </p>

        {/* Form */}
        <div className="space-y-4">
          {/* Action (hidden or dropdown if needed later) */}
          <input type="hidden" name="action" value="approve" />

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="E.g. Campaign meets all community guidelines"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B81] focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add additional notes here..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B81] focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 ${
              isLoading
                ? "bg-[#FF6B81]/70 cursor-not-allowed"
                : "bg-[#FF6B81] hover:bg-[#e75b72]"
            }`}
          >
            {isLoading && (
              <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Approve
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApproveCampaignModal;
