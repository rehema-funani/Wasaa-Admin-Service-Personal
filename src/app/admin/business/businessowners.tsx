import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Users, Briefcase, Search, UserCheck, Mail, Phone, Plus } from "lucide-react";
import businessService from "../../../api/services/businessService";
import AssignUserModal from "./AssignUserModal";

interface BusinessUser {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  role: {
    id: string;
    name: string;
  };
  business: {
    id: string;
    name: string;
  };
}

const BusinessOwnersPage = () => {
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllBusinessUsers = React.useCallback(async () => {
      setIsLoading(true);
      try {
        // 1. Fetch all businesses
        const businesses = await businessService.getAllBusinesses();
        console.log("Debug: Fetched all businesses:", businesses); // Debug log
        
        // 2. For each business, fetch its users
        const userPromises = businesses.map(async (business) => {
          try {
            const users = await businessService.getBusinessUsers(business.id);
            // console.log(`Debug: Fetched users for business ${business.name} (${business.id}):`, users); // Debug log
            // Add business info to each user object
            return users.map(user => ({ ...user, business: { id: business.id, name: business.name } }));
          } catch (error) {
            console.warn(`Could not fetch users for business ${business.id}:`, error);
            return []; // Return empty array if a business has no users or errors out
          }
        });
        // console.log("Debug: User promises created."); // Debug log

        // 3. Consolidate all users into a single list
        const allUsersNested = await Promise.all(userPromises);
        const allUsersFlat = allUsersNested.flat();
        // console.log("Debug: Consolidated all business users:", allUsersFlat); // Debug log

        setBusinessUsers(allUsersFlat);
      } catch (error) {
        console.error("Failed to fetch business users:", error);
        toast.error("Could not load business user data.");
      } finally {
        setIsLoading(false);
      }
    }, []); // Empty dependency array for useCallback

  useEffect(() => {
    fetchAllBusinessUsers();
  }, [fetchAllBusinessUsers]);

  const filteredUsers = businessUsers.filter(bu => {
    const fullName = `${bu.user.first_name} ${bu.user.last_name}`.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      fullName.includes(lowerSearchTerm) ||
      bu.user.email.toLowerCase().includes(lowerSearchTerm) ||
      bu.business.name.toLowerCase().includes(lowerSearchTerm)
    );
  });

  return (
    <>
    <AssignUserModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={fetchAllBusinessUsers} />
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Business Owners & Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all users associated with business accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 w-full"
              placeholder="Search by user, email, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button
            className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Assign User
          </motion.button>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading business users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              No Business Users Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no users assigned to any businesses yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((bu) => (
                  <tr key={bu.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{bu.user.first_name} {bu.user.last_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                        <Mail size={12} /> {bu.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/business/view/${bu.business.id}`} className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
                        {bu.business.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <UserCheck className="w-4 h-4 mr-1.5" />
                        {bu.role.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default BusinessOwnersPage;