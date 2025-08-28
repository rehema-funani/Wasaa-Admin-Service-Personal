import { motion } from "framer-motion";
import { X, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { fundraiserService } from "../../api/services/fundraiser";

const RejectCampaignModal = ({ onClose, onRejected, campaignTitle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    action: "reject",
    reason: "",
    feedback: "",
  });
  const { id } = useParams();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReject = async () => {
    if (!formData.reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    setIsLoading(true);
    try {
      await fundraiserService.publishCampaign(id, formData);
      onRejected?.();
    } catch (error) {
      toast.error("Failed to reject campaign");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-gray-200 dark:border-gray-700"
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mx-auto mb-4">
          <XCircle size={28} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
          Reject Campaign
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {campaignTitle ? `"${campaignTitle}"` : "This campaign"} will be
          rejected and the creator will be notified.
        </p>

        {/* Form */}
        <div className="space-y-4">
          {/* Action (hidden) */}
          <input type="hidden" name="action" value="reject" />

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rejection Reason <span className="text-gray-500">(required)</span>
            </label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none transition-all"
            >
              <option value="">Select a reason</option>
              <option value="inappropriate_content">
                Inappropriate Content
              </option>
              <option value="incomplete_information">
                Incomplete Information
              </option>
              <option value="policy_violation">Policy Violation</option>
              <option value="duplicate">Duplicate Campaign</option>
              <option value="suspicious_activity">Suspicious Activity</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Feedback for Creator{" "}
              <span className="text-gray-500">(recommended)</span>
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Provide feedback to help the creator understand why their campaign was rejected..."
              rows={4}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <motion.button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-all"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleReject}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gray-800 dark:bg-gray-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-gray-700 dark:hover:bg-gray-500 transition-all shadow-sm"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {isLoading ? (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <XCircle size={16} className="mr-1" />
            )}
            {isLoading ? "Processing..." : "Reject Campaign"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RejectCampaignModal;
