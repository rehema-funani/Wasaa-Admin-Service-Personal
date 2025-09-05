import { motion } from "framer-motion";
import {
  RotateCcw,
  Download,
  RefreshCw,
  Clock,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const HeaderSection = ({ statsData, isLoading, refreshData, isFetching }) => {
  const handleExport = () => {
    toast.success("Refund and chargeback data exported successfully");
  };

  return (
    <>
     <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-4 bg-gradient-to-br from-[#FF6B81] to-[#B75BFF] w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <RotateCcw className="text-white" size={20} />
            </span>
            Refunds & Chargebacks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-14">
            Manage donor refunds and dispute chargebacks
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </motion.button>
          <motion.button
            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#f9fafb",
            }}
            whileTap={{ y: 0 }}
            onClick={refreshData}
            disabled={isFetching}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Refunds
            </p>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <RotateCcw size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.totalRefunds}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            All refund requests
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Pending Refunds
            </p>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.pendingRefunds}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Awaiting decision
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Chargebacks
            </p>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.totalChargebacks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            All chargeback cases
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Pending Chargebacks
            </p>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <AlertOctagon size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.pendingChargebacks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Require immediate response
          </p>
        </motion.div>

        {/* Critical Priority */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Critical Priority
            </p>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <AlertOctagon size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.criticalPriority}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            High-value or urgent cases
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Auto-Approval Eligible
            </p>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : statsData.autoApprovalEligible}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Match automatic approval rules
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default HeaderSection;
