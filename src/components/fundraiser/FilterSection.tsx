import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, RotateCcw } from "lucide-react";

const FilterSection = ({
  searchQuery,
  filters,
  handleSearch,
  handleFilterChange,
  handleResetFilters,
  filteredRefunds,
  pagination,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, reference number, campaign, or user name..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 focus:border-transparent transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              whileHover={{
                y: -2,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
                backgroundColor: "#f9fafb",
              }}
              whileTap={{ y: 0 }}
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${
                  showFilters ? "transform rotate-180" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["refund", "chargeback"].map((type) => (
                        <label key={type} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.type.includes(type)}
                            onChange={(e) => {
                              const newType = e.target.checked
                                ? [...filters.type, type]
                                : filters.type.filter((t) => t !== type);
                              handleFilterChange({
                                ...filters,
                                type: newType,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "pending",
                        "processing",
                        "approved",
                        "completed",
                        "rejected",
                        "disputed",
                        "settled",
                        "lost",
                        "cancelled",
                      ].map((status) => (
                        <label
                          key={status}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              const newStatus = e.target.checked
                                ? [...filters.status, status]
                                : filters.status.filter((s) => s !== status);
                              handleFilterChange({
                                ...filters,
                                status: newStatus,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["low", "medium", "high", "critical"].map((priority) => (
                        <label
                          key={priority}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                            checked={filters.priority.includes(priority)}
                            onChange={(e) => {
                              const newPriority = e.target.checked
                                ? [...filters.priority, priority]
                                : filters.priority.filter(
                                    (p) => p !== priority
                                  );
                              handleFilterChange({
                                ...filters,
                                priority: newPriority,
                              });
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize mr-2">
                            {priority}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                    </select>
                  </div>

                  {/* Amount Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount Range
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.amountRange}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          amountRange: e.target.value,
                        })
                      }
                    >
                      <option value="all">All Amounts</option>
                      <option value="small">Small (&lt; 1,000 KES)</option>
                      <option value="medium">Medium (1,000 - 5,000 KES)</option>
                      <option value="large">Large (&gt; 5,000 KES)</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/50 transition-all shadow-sm"
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange({
                          ...filters,
                          sortBy: e.target.value,
                        })
                      }
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="amount_high">Amount (High to Low)</option>
                      <option value="amount_low">Amount (Low to High)</option>
                      <option value="priority_high">
                        Priority (High to Low)
                      </option>
                    </select>
                  </div>

                  {/* Special Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Filters
                    </label>
                    <div className="flex flex-col space-y-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                          checked={filters.eligibleForAutoApproval}
                          onChange={(e) => {
                            handleFilterChange({
                              ...filters,
                              eligibleForAutoApproval: e.target.checked,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Auto-Approval Eligible
                        </span>
                      </label>

                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-[#FF6B81] mr-1.5 focus:ring-[#FF6B81]/50 h-4 w-4"
                          checked={filters.withinDisputeWindow}
                          onChange={(e) => {
                            handleFilterChange({
                              ...filters,
                              withinDisputeWindow: e.target.checked,
                            });
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Within Dispute Window
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-end">
                    <motion.button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 text-[#FF6B81] dark:text-[#FF6B81] bg-[#FF6B81]/5 hover:bg-[#FF6B81]/10 rounded-xl text-sm transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="flex items-center justify-between mb-5 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <RotateCcw size={14} className="mr-2 text-[#FF6B81]" />
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
            {filteredRefunds.length}
          </span>
          {filteredRefunds.length !== pagination.total && (
            <>
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300 mx-1">
                {pagination.total}
              </span>
            </>
          )}
          refunds and chargebacks
        </div>
      </motion.div>
    </>
  );
};

export default FilterSection;
