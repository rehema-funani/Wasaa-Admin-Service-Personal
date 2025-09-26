import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Plus, Edit, Trash2, Shield, Loader2, X, Save, Settings, CheckSquare, Square } from "lucide-react";
import businessService from "../../../api/services/businessService";

interface Role {
  id: string;
  title: string;
  description: string;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: Omit<Role, 'id'>) => Promise<void>;
  role?: Role | null;
  allPermissions: Permission[];
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave, role, allPermissions }) => {
  const [formData, setFormData] = useState({ title: '', description: '', permissions: [] as string[] });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData({ title: role.title, description: role.description, permissions: role.permissions || [] });
      } else {
        setFormData({ title: '', description: '', permissions: [] });
      }
    }
  }, [isOpen, role]);

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Role title is required.");
      return;
    }
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Shield size={22} className="text-primary-600" />
                {role ? 'Edit Role' : 'Create New Role'}
              </h3>
              <button className="text-gray-400 hover:text-gray-500" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  placeholder="e.g., Store Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  rows={2}
                  placeholder="A brief description of the role's responsibilities"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions</label>
                <div className="max-h-48 overflow-y-auto grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                  {allPermissions.map(permission => (
                    <label key={permission.id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                      />
                      {formData.permissions.includes(permission.id) ? <CheckSquare size={16} className="text-primary-600" /> : <Square size={16} className="text-gray-400" />}
                      <span className="text-sm text-gray-800 dark:text-gray-200">{permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6 mt-4 border-t dark:border-gray-700">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg" onClick={onClose}>Cancel</button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                {isSaving ? "Saving..." : "Save Role"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ManageBusinessRolesPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [business, setBusiness] = useState<{ id: string, name: string } | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const fetchData = useCallback(async () => {
    if (!businessId) return;
    setIsLoading(true);
    try {
      const [rolesData, businessData, permissionsData] = await Promise.all([
        businessService.getBusinessRoles(businessId),
        businessService.getBusinessById(businessId),
        businessService.getBusinessRolePermissions(),
      ]);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      
      // The API returns the business object nested, e.g., { business: { ... } }
      const extractedBusiness = (businessData as any)?.business || businessData;
      setBusiness(extractedBusiness);
      setAllPermissions(Array.isArray(permissionsData) ? permissionsData.filter(p => p.id && p.name) : []);
    } catch (error) {
      console.error("Failed to fetch roles data:", error);
      toast.error("Could not load roles for this business.");
      navigate('/admin/business/all-businesses');
    } finally {
      setIsLoading(false);
    }
  }, [businessId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleSaveRole = async (roleData: Omit<Role, 'id'>) => {
    try {
      if (editingRole) {
        await businessService.updateBusinessRole(editingRole.id, roleData);
        toast.success(`Role "${roleData.title}" updated successfully!`);
      } else {
        if (!businessId) return;
        await businessService.createBusinessRole(businessId, roleData);
        toast.success(`Role "${roleData.title}" created successfully!`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error((error as Error).message || "Failed to save role.");
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;
    try {
      await businessService.deleteBusinessRole(deletingRole.id);
      toast.success(`Role "${deletingRole.title}" deleted.`);
      setDeletingRole(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error((error as Error).message || "Failed to delete role.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <>
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRole}
        role={editingRole}
        allPermissions={allPermissions}
      />
      <AnimatePresence>
        {deletingRole && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeletingRole(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Are you sure you want to delete the role "<strong>{deletingRole.title}</strong>"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg" onClick={() => setDeletingRole(null)}>Cancel</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={handleDeleteRole}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/admin/business/view/${businessId}`)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Roles</h1>
              <p className="text-gray-500 dark:text-gray-400">For business: {business?.name}</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2"
          >
            <Plus size={16} />
            Create Role
          </button>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          {roles.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <Shield size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No Custom Roles Found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new role to define specific permissions for this business.</p>
            </div>
          ) : (
            roles.map((role, index) => (
              <motion.div
                key={role.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{role.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions && role.permissions.length > 0 ? role.permissions.map(permissionId => (
                          <span key={permissionId} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                            {allPermissions.find(p => p.id === permissionId)?.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || permissionId}
                          </span>
                        )) : (
                          <span className="text-xs text-gray-400 italic">No permissions assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => navigate(`/admin/business/roles/${role.id}`)}
                      className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="View Details">
                      <Settings size={16} />
                    </button>
                    <button
                      onClick={() => openEditModal(role)}
                      className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Edit Role"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingRole(role)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg"
                      title="Delete Role"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ManageBusinessRolesPage;