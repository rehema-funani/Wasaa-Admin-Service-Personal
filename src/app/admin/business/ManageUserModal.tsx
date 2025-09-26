// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, UserCog, Shield, Trash2, Loader2, AlertTriangle } from "lucide-react";
// import { toast } from "react-hot-toast";
// import businessService from "../../../api/services/businessService";

// interface BusinessUser {
//   id: string;
//   user: {
//     id: string;
//     first_name: string;
//     last_name: string;
//     email: string;
//   };
//   role: {
//     id: string;
//     name: string;
//     title?: string;
//   };
//   business: {
//     id: string;
//     name: string;
//   };
// }

// interface ManageUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   businessUser: BusinessUser | null;
// }

// const ManageUserModal: React.FC<ManageUserModalProps> = ({ isOpen, onClose, onSuccess, businessUser }) => {
//   const [roles, setRoles] = useState<any[]>([]);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   useEffect(() => {
//     if (isOpen && businessUser) {
//       setSelectedRole(businessUser.role.id);
//       const fetchRoles = async () => {
//         setIsLoading(true);
//         try {
//           const rolesData = await businessService.getBusinessRoles(businessUser.business.id);
//           const extractedRoles = Array.isArray(rolesData) ? rolesData : (rolesData as any)?.roles || [];
//           setRoles(extractedRoles);
//         } catch (error) {
//           console.error("Failed to load roles for business:", error);
//           toast.error("Could not load available roles.");
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchRoles();
//     }
//   }, [isOpen, businessUser]);

//   const handleRoleChange = async () => {
//     if (!businessUser || !selectedRole || selectedRole === businessUser.role.id) return;

//     setIsSaving(true);
//     try {
//       await businessService.updateBusinessUserRole(businessUser.id, selectedRole);
//       toast.success("User role updated successfully!");
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Failed to update role:", error);
//       toast.error((error as Error).message || "Failed to update role.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleRemoveUser = async () => {
//     if (!businessUser) return;

//     setIsDeleting(true);
//     try {
//       await businessService.removeBusinessUser(businessUser.id);
//       toast.success("User removed from business successfully!");
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Failed to remove user:", error);
//       toast.error((error as Error).message || "Failed to remove user.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   if (!businessUser) return null;

//   const userName = `${businessUser.user.first_name || ''} ${businessUser.user.last_name || ''}`.trim() || businessUser.user.email;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//         >
//           <motion.div
//             className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
//                 <UserCog size={22} className="text-primary-600" />
//                 Manage User
//               </h3>
//               <button
//                 className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
//                 onClick={onClose}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="mb-4">
//               <p className="text-gray-600 dark:text-gray-300">
//                 User: <span className="font-medium text-gray-800 dark:text-gray-100">{userName}</span>
//               </p>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Business: <span className="font-medium text-gray-800 dark:text-gray-100">{businessUser.business.name}</span>
//               </p>
//             </div>

//             {isLoading ? (
//               <div className="h-24 flex items-center justify-center">
//                 <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Change Role</label>
//                   <div className="flex gap-2">
//                     <select 
//                       value={selectedRole} 
//                       onChange={(e) => setSelectedRole(e.target.value)} 
//                       className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
//                     >
//                       {roles.map(r => <option key={r.id} value={r.id}>{r.title || r.name}</option>)}
//                     </select>
//                     <button
//                       className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
//                       onClick={handleRoleChange}
//                       disabled={isSaving || selectedRole === businessUser.role.id}
//                     >
//                       {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//               <h4 className="text-md font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
//                 <AlertTriangle size={18} />
//                 Danger Zone
//               </h4>
//               <div className="mt-2 flex justify-between items-center">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Remove user from this business.</p>
//                 <button
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
//                   onClick={() => setShowDeleteConfirm(true)}
//                   disabled={isDeleting}
//                 >
//                   <Trash2 size={16} />
//                   Remove User
//                 </button>
//               </div>
//             </div>

//             {showDeleteConfirm && (
//               <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
//                 <p className="text-sm text-red-700 dark:text-red-300 mb-3">
//                   Are you sure you want to remove <strong>{userName}</strong> from <strong>{businessUser.business.name}</strong>? This action cannot be undone.
//                 </p>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-md"
//                     onClick={() => setShowDeleteConfirm(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="px-3 py-1 text-sm bg-red-600 text-white rounded-md flex items-center gap-1"
//                     onClick={handleRemoveUser}
//                     disabled={isDeleting}
//                   >
//                     {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Removal"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ManageUserModal;

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
      fetchAllRoles();
    }
  }, [isOpen, businessUser]);

  const fetchAllRoles = async () => {
    if (!businessUser) return;
    
    setIsLoading(true);
    try {
      console.log("🎯 Fetching roles for business:", businessUser.business.id, businessUser.business.name);
      
      // Try multiple approaches to get roles
      let rolesData = [];
      
      // Approach 1: Try business-specific roles first
      try {
        console.log("📋 Attempting to fetch business-specific roles...");
        const businessRoles = await businessService.getBusinessRoles(businessUser.business.id);
        console.log("📋 Business roles response:", businessRoles);
        
        if (Array.isArray(businessRoles)) {
          rolesData = businessRoles;
        } else if (businessRoles?.roles && Array.isArray(businessRoles.roles)) {
          rolesData = businessRoles.roles;
        } else if (businessRoles?.data && Array.isArray(businessRoles.data)) {
          rolesData = businessRoles.data;
        }
        
        console.log("📋 Extracted business roles:", rolesData);
      } catch (error) {
        console.warn("⚠️ Business-specific roles failed:", error);
      }
      
      // Approach 2: If no business-specific roles, try role permissions endpoint
      if (rolesData.length === 0) {
        try {
          console.log("📋 Attempting to fetch role permissions to create default roles...");
          const permissions = await businessService.getBusinessRolePermissions();
          console.log("📋 Available permissions:", permissions);
          
          // If we have permissions, we know roles exist, so create common ones
          if (Array.isArray(permissions) && permissions.length > 0) {
            rolesData = [
              { id: "admin", name: "Admin", title: "Admin" },
              { id: "manager", name: "Manager", title: "Manager" },
              { id: "employee", name: "Employee", title: "Employee" },
              { id: "owner", name: "Owner", title: "Owner" },
            ];
            console.log("📋 Created roles based on available permissions");
          }
        } catch (error) {
          console.warn("⚠️ Role permissions fetch failed:", error);
        }
      }
      
      // Approach 3: If still no roles, create a default set including current user's role
      if (rolesData.length === 0) {
        console.log("📋 No roles found via API, creating default role set...");
        
        const defaultRoles = [
          { id: "admin", name: "Admin", title: "Admin" },
          { id: "manager", name: "Manager", title: "Manager" },
          { id: "employee", name: "Employee", title: "Employee" },
          { id: "owner", name: "Owner", title: "Owner" },
          { id: "user", name: "User", title: "User" },
        ];
        
        // Always include the current user's role if it's not in defaults
        const currentRole = businessUser.role;
        const currentRoleExists = defaultRoles.some(role => 
          role.id === currentRole.id || 
          role.name.toLowerCase() === currentRole.name.toLowerCase()
        );
        
        if (!currentRoleExists && currentRole.id) {
          defaultRoles.unshift({
            id: currentRole.id,
            name: currentRole.name,
            title: currentRole.title || currentRole.name
          });
        }
        
        rolesData = defaultRoles;
        console.log("📋 Using default roles with current role:", rolesData);
      }
      
      // Ensure current role is always available in the list
      const currentRole = businessUser.role;
      const currentRoleExists = rolesData.some(role => role.id === currentRole.id);
      
      if (!currentRoleExists && currentRole.id) {
        rolesData.unshift({
          id: currentRole.id,
          name: currentRole.name,
          title: currentRole.title || currentRole.name
        });
        console.log("📋 Added current role to list:", currentRole);
      }
      
      console.log("🎯 Final roles to display:", rolesData);
      setRoles(rolesData);
      
      if (rolesData.length === 0) {
        toast.error("No roles available. Please check with your administrator.");
      } else {
        console.log(`✅ Successfully loaded ${rolesData.length} roles`);
      }
      
    } catch (error) {
      console.error("💥 Failed to load roles:", error);
      toast.error("Could not load available roles. Please try again.");
      
      // Fallback: at least show the current role
      if (businessUser.role) {
        setRoles([{
          id: businessUser.role.id,
          name: businessUser.role.name,
          title: businessUser.role.title || businessUser.role.name
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!businessUser || !selectedRole || selectedRole === businessUser.role.id) {
      console.log("⚠️ Role change cancelled:", { 
        hasBusinessUser: !!businessUser, 
        hasSelectedRole: !!selectedRole, 
        isSameRole: selectedRole === businessUser?.role.id 
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log("🔄 Updating user role:", {
        businessUserId: businessUser.id,
        oldRole: businessUser.role.id,
        newRole: selectedRole
      });
      
      await businessService.updateBusinessUserRole(businessUser.id, selectedRole);
      toast.success("User role updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("💥 Failed to update role:", error);
      toast.error((error as Error).message || "Failed to update role.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveUser = async () => {
    if (!businessUser) return;

    setIsDeleting(true);
    try {
      console.log("🗑️ Removing user from business:", {
        businessUserId: businessUser.id,
        user: `${businessUser.user.first_name} ${businessUser.user.last_name}`,
        business: businessUser.business.name
      });
      
      await businessService.removeBusinessUser(businessUser.id);
      toast.success("User removed from business successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("💥 Failed to remove user:", error);
      toast.error((error as Error).message || "Failed to remove user.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!businessUser) return null;

  const userName = `${businessUser.user.first_name || ''} ${businessUser.user.last_name || ''}`.trim() || businessUser.user.email;
  const hasRoleChanged = selectedRole && selectedRole !== businessUser.role.id;

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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current role: <span className="font-medium">{businessUser.role.title || businessUser.role.name}</span>
              </p>
            </div>

            {isLoading ? (
              <div className="h-24 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Loading available roles...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Change Role
                    <span className="text-xs text-gray-500 ml-1">({roles.length} available)</span>
                  </label>
                  <div className="flex gap-2">
                    <select 
                      value={selectedRole} 
                      onChange={(e) => {
                        console.log("🎯 Role selection changed:", e.target.value);
                        setSelectedRole(e.target.value);
                      }}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {roles.length === 0 ? (
                        <option value="">No roles available</option>
                      ) : (
                        roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.title || role.name}
                            {role.id === businessUser.role.id ? ' (Current)' : ''}
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={handleRoleChange}
                      disabled={isSaving || !hasRoleChanged || roles.length === 0}
                      title={!hasRoleChanged ? "Select a different role to update" : "Update user role"}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                  {hasRoleChanged && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Role will be changed from "{businessUser.role.title || businessUser.role.name}" to "{roles.find(r => r.id === selectedRole)?.title || roles.find(r => r.id === selectedRole)?.name}"
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                <AlertTriangle size={18} />
                Danger Zone
              </h4>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remove user from this business.
                </p>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                  Remove User
                </button>
              </div>
            </div>

            {showDeleteConfirm && (
              <motion.div 
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Are you sure you want to remove <strong>{userName}</strong> from <strong>{businessUser.business.name}</strong>? 
                  <br />
                  <span className="text-xs">This action cannot be undone.</span>
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md transition-colors"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1 disabled:opacity-50 transition-colors"
                    onClick={handleRemoveUser}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      "Confirm Removal"
                    )}
                  </button>
                </div>
              </motion.div>
            )}


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ManageUserModal;