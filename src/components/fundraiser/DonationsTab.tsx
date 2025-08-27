import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  DollarSign,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const DonationsTab = ({ campaignId, fundraiserService }) => {
  const [donations, setDonations] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonors: 0,
    averageDonation: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchDonations = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fundraiserService.getCampaignDonations(
        campaignId,
        { page, limit: pagination.limit }
      );

      setDonations(response.data || []);
      setPagination(response.pagination || pagination);
      setStats(response.stats || stats);
    } catch (error) {
      console.error("Error loading donations:", error);
      toast.error("Failed to load donations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [campaignId]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchDonations(newPage);
    }
  };

  if (isLoading && donations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw
            size={30}
            className="text-[#FF6B81] animate-spin mx-auto mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">
            Loading donations...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoading && donations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Heart
            size={40}
            className="text-gray-400 dark:text-gray-500 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No Donations Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This campaign hasn't received any donations yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Total Donations
            </span>
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Kes {stats.totalAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            From {stats.totalDonors} donor{stats.totalDonors !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Average Donation
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Heart size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Kes{" "}
            {stats.averageDonation.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Per donation
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Total Donors
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalDonors.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Unique supporters
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Recent Donations
          </h3>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <User
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {donation.anonymous
                        ? "Anonymous Donor"
                        : donation.donorName || "Anonymous Donor"}
                    </p>
                    <span className="text-[#FF6B81] font-bold">
                      Kes{" "}
                      {parseFloat(donation.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {donation.message && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {donation.message}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <Clock size={12} className="mr-1" />
                    <span>{formatDate(donation.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} donations
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-md flex items-center justify-center ${
                pagination.page === 1
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                    pageNum === pagination.page
                      ? "bg-[#FF6B81] text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`p-2 rounded-md flex items-center justify-center ${
                pagination.page === pagination.pages
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DonationsTab;
