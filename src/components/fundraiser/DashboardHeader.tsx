    import { motion } from "framer-motion";
    import {
      CheckCircle,
      ShieldAlert,
      RefreshCw,
      FileText,
    } from "lucide-react";
    import { useNavigate } from "react-router-dom";
    import { toast } from "react-hot-toast";

    const DashboardHeader = () => {
      const navigate = useNavigate();

      const handleQuickAction = (action) => {
        switch (action) {
          case "approveCampaign":
            toast.success("Opening campaign approval wizard");
            navigate("/admin/fundraising/campaigns/pending");
            break;
          case "escalateFraud":
            toast.success("Opening fraud escalation form");
            navigate("/admin/fundraising/compliance/fraud");
            break;
          case "issueRefund":
            toast.success("Opening refund wizard");
            navigate("/admin/fundraising/finance/refunds/new");
            break;
          case "generateReport":
            toast.success("Opening report generator");
            navigate("/admin/fundraising/reports/create");
            break;
          default:
            break;
        }
      };

      return (
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-2xl font-light text-slate-900 dark:text-gray-100">
              Fundraising Dashboard
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
              Overview of all fundraising campaigns and activities
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction("approveCampaign")}
              className="px-3 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >
              <CheckCircle size={14} className="mr-1.5" />
              Approve Campaign
            </button>
            <button
              onClick={() => handleQuickAction("escalateFraud")}
              className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              <ShieldAlert size={14} className="mr-1.5" />
              Escalate Fraud
            </button>
            <button
              onClick={() => handleQuickAction("issueRefund")}
              className="px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              <RefreshCw size={14} className="mr-1.5" />
              Issue Refund
            </button>
            <button
              onClick={() => handleQuickAction("generateReport")}
              className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <FileText size={14} className="mr-1.5" />
              Generate Report
            </button>
          </div>
        </motion.div>
      );
    };

    export default DashboardHeader;