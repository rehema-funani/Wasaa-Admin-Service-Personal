import {
  Ban,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Lock,
  Mail,
  Phone,
  X,
  Shield,
  AlertTriangle,
  MessageSquare,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const SelectedUser = ({
  selectedContact,
  handleCloseModal,
  handleBlockContact,
  getUserFullName,
  getUserInitials,
  handleLockContact
}) => {
  const getEnhancedStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      case "reviewed":
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "cleared":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getStatusIcon = (status: string | any) => {
    switch (status) {
      case "pending":
        return <Clock size={14} className="mr-1.5" />;
      case "reviewed":
        return <Eye size={14} className="mr-1.5" />;
      case "cleared":
        return <CheckCircle size={14} className="mr-1.5" />;
      default:
        return <AlertTriangle size={14} className="mr-1.5" />;
    }
  };

  const getReportedReasons = () => {
    return selectedContact.reported_reasons || [];
  };

  const getReportersCount = () => {
    const reasons = getReportedReasons();
    const uniqueReporters = new Set(reasons.map(r => r.user_id));
    return uniqueReporters.size;
  };

  const getTotalReportsCount = () => {
    return selectedContact._count?.contact_id || getReportedReasons().length;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white/95 dark:bg-gray-900/95 max-h-[85vh] backdrop-blur-xl mt-[85px] rounded-2xl shadow-2xl border border-white/20 dark:border-gray-800/50 w-full max-w-4xl overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-slate-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Flagged Contact Details
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Review flagged contact information and reported reasons
              </p>
            </div>
            <button
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              onClick={handleCloseModal}
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                  <div className="text-center mb-6">
                    {selectedContact.user_details.profile_picture ? (
                      <div className="relative inline-block">
                        <img
                          src={selectedContact.user_details.profile_picture}
                          alt={getUserFullName(selectedContact)}
                          className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-lg ring-4 ring-white dark:ring-gray-800"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Flag size={14} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-lg ring-4 ring-white dark:ring-gray-800">
                          {getUserInitials(selectedContact)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Flag size={14} className="text-white" />
                        </div>
                      </div>
                    )}

                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                      {getUserFullName(selectedContact)}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      @{selectedContact.user_details.username}
                    </p>

                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium ${getEnhancedStatusStyle(
                          selectedContact.status || "pending"
                        )}`}
                      >
                        {getStatusIcon(selectedContact.status || "pending")}
                        {selectedContact.status
                          ? selectedContact.status.charAt(0).toUpperCase() +
                            selectedContact.status.slice(1)
                          : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/30">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Phone Number
                        </p>
                        <p className="text-gray-900 dark:text-white font-medium mt-0.5">
                          {selectedContact.user_details.phone_number}
                        </p>
                      </div>
                    </div>

                    {selectedContact.user_details.email && (
                      <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/30">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <Mail
                            size={16}
                            className="text-green-600 dark:text-green-400"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Email Address
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium mt-0.5 truncate">
                            {selectedContact.user_details.email}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-start space-x-3 p-3 rounded-xl bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                          <Flag
                            size={16}
                            className="text-red-600 dark:text-red-400"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                            Total Reports
                          </p>
                          <p className="text-red-900 dark:text-red-100 font-bold mt-0.5">
                            {getTotalReportsCount()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 rounded-xl bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <Users
                            size={16}
                            className="text-orange-600 dark:text-orange-400"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                            Reporters
                          </p>
                          <p className="text-orange-900 dark:text-orange-100 font-bold mt-0.5">
                            {getReportersCount()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Shield
                        size={18}
                        className="text-amber-600 dark:text-amber-400"
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Contact Information
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/30">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Current Status
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium ${getEnhancedStatusStyle(
                          selectedContact.status || "pending"
                        )}`}
                      >
                        {getStatusIcon(selectedContact.status || "pending")}
                        {selectedContact.status
                          ? selectedContact.status.charAt(0).toUpperCase() +
                            selectedContact.status.slice(1)
                          : "Pending"}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/30">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        KYC Status
                      </p>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium ${
                        selectedContact.user_details.kyc_status 
                          ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
                      }`}>
                        {selectedContact.user_details.kyc_status ? (
                          <CheckCircle size={14} className="mr-1.5" />
                        ) : (
                          <X size={14} className="mr-1.5" />
                        )}
                        {selectedContact.user_details.kyc_status ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/30">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Contact ID
                    </p>
                    <p className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg inline-block">
                      {selectedContact.contact_id}
                    </p>
                  </div>
                </div>

                {getReportedReasons().length > 0 && (
                  <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <MessageSquare
                          size={18}
                          className="text-red-600 dark:text-red-400"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Reported Reasons ({getReportedReasons().length})
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {getReportedReasons().map((report, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                                {index + 1}
                              </span>
                              <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                                Report #{index + 1}
                              </p>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Reporter ID: {report.user_id?.slice(0, 8)}...
                            </div>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line pl-8">
                            {report.reason || "No specific reason provided"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          <strong>Summary:</strong> This contact has been reported {getTotalReportsCount()} time(s) by {getReportersCount()} different user(s).
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-t border-slate-200/50 dark:border-gray-700/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              {(selectedContact.status === "pending" ||
                selectedContact.status === "reviewed" || 
                !selectedContact.status) && (
                <>
                  <button
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={() => {
                      handleBlockContact(selectedContact.user_details.id);
                      handleCloseModal();
                    }}
                  >
                    <Ban size={16} className="mr-2" strokeWidth={2} />
                    Suspend Account
                  </button>

                  <button
                    onClick={() => {
                      handleLockContact(selectedContact.user_details.id);
                      handleCloseModal();
                    }}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Lock size={16} className="mr-2" strokeWidth={2} />
                    Lock Account
                  </button>
                </>
              )}
            </div>

            <button
              className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium transition-all duration-200"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectedUser;