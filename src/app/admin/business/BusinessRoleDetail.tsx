import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Shield, CheckSquare, Loader2 } from "lucide-react";
import businessService from "../../../api/services/businessService";

interface Role {
  id: string;
  title: string;
  description: string;
  permissions: string[];
  business_id: string; // The API likely returns this
  businessName?: string; // We will add this property after fetching it
}

const BusinessRoleDetailPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoleDetails = useCallback(async () => {
    if (!roleId) {
      toast.error("Role ID is missing.");
      navigate(-1);
      return;
    }
    setIsLoading(true);
    try {
      const roleData: Role = await businessService.getBusinessRoleById(roleId);
      if (roleData && roleData.business_id) {
        const businessData = await businessService.getBusinessById(roleData.business_id);
        // Combine the role data with the fetched business name
        setRole({ ...roleData, businessName: businessData.name });
      } else {
        setRole(roleData); // Set role even if business_id is missing
      }
    } catch (error) {
      console.error("Failed to fetch role details:", error);
      toast.error("Could not load role details.");
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  }, [roleId, navigate]);

  useEffect(() => {
    fetchRoleDetails();
  }, [fetchRoleDetails]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Role not found.</h2>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/business/${role.business_id}/roles`)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{role.title}</h1>
            <p className="text-gray-500 dark:text-gray-400">Role details for business: {role.businessName || 'Loading...'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary-500" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{role.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Permissions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {role.permissions && role.permissions.length > 0 ? (
              role.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <CheckSquare size={16} className="text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">No permissions assigned to this role.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessRoleDetailPage;