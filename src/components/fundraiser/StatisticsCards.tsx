import { motion } from "framer-motion";
import {
  Gift,
  Clock,
  Zap,
  CheckCircle,
  Flag,
  DollarSign,
  Shield,
  AlertTriangle,
  ShieldAlert,
  MessageCircle,
} from "lucide-react";

const StatisticsCards = ({ stats, isLoading }) => {
  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Gift size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.total.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            All campaigns
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.pending.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Awaiting review
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Active Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.active.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Currently active
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Completed Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.campaigns.completed.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Successfully completed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Flagged Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <Flag size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading
              ? "..."
              : (stats.campaigns.flagged || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Require attention
          </p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Total Raised
            </p>
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            Kes {isLoading ? "..." : stats.revenue.totalRaised.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Across all campaigns
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending KYC
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Shield size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading
              ? "..."
              : (stats.compliance?.pendingKYC || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Verification required
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Pending Payouts
            </p>
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading ? "..." : stats.payouts.pending.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Awaiting approval
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              High Risk Campaigns
            </p>
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <ShieldAlert size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading
              ? "..."
              : (stats.fraud?.highRiskCampaigns || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Fraud risk detected
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Open Support Tickets
            </p>
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <MessageCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-light text-slate-900 dark:text-gray-100">
            {isLoading
              ? "..."
              : (stats.support?.openTickets || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Require resolution
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default StatisticsCards;
