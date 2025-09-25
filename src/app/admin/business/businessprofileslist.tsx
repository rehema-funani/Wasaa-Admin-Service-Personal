import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Briefcase, User, Edit, Plus, Search, CheckCircle, XCircle } from "lucide-react";
import businessService from "../../../api/services/businessService";
import { Business } from "../../../types/business";

interface BusinessWithProfileStatus extends Business {
  profileExists: boolean;
}

const BusinessProfilesListPage = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<BusinessWithProfileStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBusinessesAndProfiles = async () => {
      setIsLoading(true);
      try {
        const allBusinesses = await businessService.getAllBusinesses();
        
        // For each business, check if a profile exists.
        const businessesWithProfileStatus = await Promise.all(
          allBusinesses.map(async (business) => {
            try {
              const profile = await businessService.getBusinessProfile(business.id);
              return {
                ...business,
                profileExists: !!profile && Object.keys(profile).length > 0,
              };
            } catch (profileError) {
              // Assuming a 404 or similar error means no profile exists
              return {
                ...business,
                profileExists: false,
              };
            }
          })
        );

        setBusinesses(businessesWithProfileStatus);
      } catch (error) {
        console.error("Failed to fetch businesses and profiles:", error);
        toast.error("Could not load business profiles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessesAndProfiles();
  }, []);

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Business Profiles
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage public-facing profiles for all businesses.
          </p>
        </div>
        <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 w-full"
              placeholder="Search by business name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </motion.div>

      {/* Business Profiles Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading business profiles...</div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              No businesses found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no businesses matching your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profile Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{business.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{business.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {business.profileExists ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Profile Created
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <XCircle className="w-4 h-4 mr-1.5" />
                          No Profile
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {business.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {business.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/business/profile/${business.id}`}
                        className="flex items-center justify-end gap-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        {business.profileExists ? (
                          <>
                            <Edit size={16} />
                            Edit Profile
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Create Profile
                          </>
                        )}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BusinessProfilesListPage;