import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCog, Shield, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import businessService from "../../../api/services/businessService";

interface BusinessUser {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
    title?: string;
  };
  business: {
    id: string;
    name: string;
  };
}

interface ManageUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  businessUser: BusinessUser | null;
}

const ManageUserModal: React.FC<ManageUserModalProps> = ({ isOpen, onClose, onSuccess, businessUser }) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && businessUser) {
      setSelectedRole(businessUser.role.id);
      const fetchRoles = async () => {
        setIsLoading(true);
        try {
          const rolesData = await businessService.getBusinessRoles(businessUser.business.id);
          const extractedRoles = Array.isArray(rolesData) ? rolesData : (rolesData as any)?.roles || [];
          setRoles(extractedRoles);
        } catch (error) {
          console.error("Failed to load roles for business:", error);
          toast.error("Could not load available roles.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRoles();
    }
  }, [isOpen, businessUser]);

  const handleRoleChange = async () => {
    if (!businessUser || !selectedRole || selectedRole === businessUser.role.id) return;

    setIsSaving(true);
    try {
      await businessService.updateBusinessUserRole(businessUser.id, selectedRole);
      toast.success("User role updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error((error as Error).message || "Failed to update role.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveUser = async () => {
    if (!businessUser) return;

    setIsDeleting(true);
    try {
      await businessService.removeBusinessUser(businessUser.id);
      toast.success("User removed from business successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to remove user:", error);
      toast.error((error as Error).message || "Failed to remove user.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!businessUser) return null;

  const userName = `${businessUser.user.first_name || ''} ${businessUser.user.last_name || ''}`.trim() || businessUser.user.email;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UserCog size={22} className="text-primary-600" />
                Manage User
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300">
                User: <span className="font-medium text-gray-800 dark:text-gray-100">{userName}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Business: <span className="font-medium text-gray-800 dark:text-gray-100">{businessUser.business.name}</span>
              </p>
            </div>

            {isLoading ? (
              <div className="h-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Change Role</label>
                  <div className="flex gap-2">
                    <select 
                      value={selectedRole} 
                      onChange={(e) => setSelectedRole(e.target.value)} 
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      {roles.map(r => <option key={r.id} value={r.id}>{r.title || r.name}</option>)}
                    </select>
                    <button
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                      onClick={handleRoleChange}
                      disabled={isSaving || selectedRole === businessUser.role.id}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle size={18} />
                Danger Zone
              </h4>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Remove user from this business.</p>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                  Remove User
                </button>
              </div>
            </div>

            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Are you sure you want to remove <strong>{userName}</strong> from <strong>{businessUser.business.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-md"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md flex items-center gap-1"
                    onClick={handleRemoveUser}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Removal"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ManageUserModal;