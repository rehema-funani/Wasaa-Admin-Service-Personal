import { Ban, CheckCircle, Clock, Eye, Flag, Lock, Mail, Phone, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
const SelectedUser = ({
    selectedContact,
    handleCloseModal,
    handleBlockContact,
    getUserFullName,
    getUserInitials,
    getStatusColor,
    handleLockContact,
    formatDate
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Contact Details
          </h3>
          <button
            className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleCloseModal}
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  {selectedContact.user_details.profile_picture ? (
                    <img
                      src={selectedContact.user_details.profile_picture}
                      alt={getUserFullName(selectedContact)}
                      className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl font-medium mr-4">
                      {getUserInitials(selectedContact)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {getUserFullName(selectedContact)}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      @{selectedContact.user_details.username}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedContact.status || "pending"
                        )}`}
                      >
                        {selectedContact.status === "pending" && (
                          <Clock size={12} className="mr-1.5" />
                        )}
                        {selectedContact.status === "reviewed" && (
                          <Eye size={12} className="mr-1.5" />
                        )}
                        {selectedContact.status === "cleared" && (
                          <CheckCircle size={12} className="mr-1.5" />
                        )}
                        {selectedContact.status
                          ? selectedContact.status.charAt(0).toUpperCase() +
                            selectedContact.status.slice(1)
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center">
                    <Phone
                      size={16}
                      className="text-gray-500 dark:text-gray-400 mr-3"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Phone Number
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {selectedContact.user_details.phone_number}
                      </p>
                    </div>
                  </div>

                  {selectedContact.user_details.email && (
                    <div className="flex items-center">
                      <Mail
                        size={16}
                        className="text-gray-500 dark:text-gray-400 mr-3"
                      />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Email
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">
                          {selectedContact.user_details.email}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Flag
                      size={16}
                      className="text-red-500 dark:text-red-400 mr-3"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Flag Count
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {selectedContact._count.contact_id || 1} time(s)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Flag Information
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedContact.status || "pending"
                      )}`}
                    >
                      {selectedContact.status === "pending" && (
                        <Clock size={12} className="mr-1.5" />
                      )}
                      {selectedContact.status === "reviewed" && (
                        <Eye size={12} className="mr-1.5" />
                      )}
                      {selectedContact.status === "cleared" && (
                        <CheckCircle size={12} className="mr-1.5" />
                      )}
                      {selectedContact.status
                        ? selectedContact.status.charAt(0).toUpperCase() +
                          selectedContact.status.slice(1)
                        : "Pending"}
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Flagged At:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">
                      {
                        formatDate(
                          selectedContact.flagged_at || new Date().toISOString()
                        ).formattedDate
                      }
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Contact ID:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-mono text-xs">
                      {selectedContact.contact_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Flag Reason
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {selectedContact.reason ||
                      "This contact has been flagged for review."}
                  </p>
                </div>
              </div>

              {selectedContact.flagged_by &&
                selectedContact.flagged_by.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Flagged By
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedContact.flagged_by.map((flagger, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                              <User
                                size={14}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            </div>
                            <div>
                              <p className="text-gray-800 dark:text-gray-200 text-sm">
                                {flagger.first_name && flagger.last_name
                                  ? `${flagger.first_name} ${flagger.last_name}`
                                  : flagger.username}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Actions
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-wrap gap-2">
                  {(selectedContact.status === "pending" ||
                    selectedContact.status === "reviewed") && (
                    <>
                      <button
                        className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        onClick={() => {
                          handleBlockContact(selectedContact.user_details.id);
                          handleCloseModal();
                        }}
                      >
                        <Ban size={16} className="mr-2" strokeWidth={1.8} />
                        Suspend Account
                      </button>
                      <button onClick={() => {
                        handleLockContact(selectedContact.user_details.id);
                        handleCloseModal();
                      }} className="flex items-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm">
                        <Lock size={16} className="mr-2" strokeWidth={1.8} />
                        Lock Account
                      </button>
                    </>
                  )}

                  <button
                    className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm ml-auto"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SelectedUser
