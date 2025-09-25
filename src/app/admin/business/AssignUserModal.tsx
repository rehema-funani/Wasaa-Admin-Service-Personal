// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, UserPlus, Briefcase, User, Shield, Loader2 } from "lucide-react";
// import { toast } from "react-hot-toast";
// import businessService from "../../../api/services/businessService";
// import userService from "../../../api/services/users";
// import { roleService } from "../../../api/services/roles";

// interface AssignUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const AssignUserModal: React.FC<AssignUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [businesses, setBusinesses] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [roles, setRoles] = useState<any[]>([]);

//   const [selectedBusiness, setSelectedBusiness] = useState("");
//   const [selectedUser, setSelectedUser] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     if (isOpen) {
//       const fetchData = async () => {
//         setIsLoading(true);
//         try {
//           const [businessesData, usersData, rolesData] = await Promise.all([
//             businessService.getAllBusinesses(),
//             userService.getAllUsers(),
//             roleService.getRoles(),
//           ]);

//           // Safely extract arrays from the API responses, which might be nested.
//           const extractedUsers = usersData?.users || (Array.isArray(usersData) ? usersData : []);
//           const extractedRoles = rolesData?.roles || (Array.isArray(rolesData) ? rolesData : []);

//           setBusinesses(businessesData);
//           setUsers(extractedUsers);
//           setRoles(extractedRoles.filter(role => role.name !== 'SUPER_ADMIN' && role.name !== 'USER')); // Filter out SUPER_ADMIN and USER roles
//         } catch (error) {
//           console.error("Failed to load data for assignment:", error);
//           toast.error("Could not load necessary data. Please try again.");
//           onClose();
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [isOpen, onClose]);

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!selectedBusiness) newErrors.business = "Business is required.";
//     if (!selectedUser) newErrors.user = "User is required.";
//     if (!selectedRole) newErrors.role = "Role is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setIsSaving(true);
//     try {
//       await businessService.assignUserToBusiness(selectedBusiness, selectedUser, selectedRole);
//       toast.success("User assigned to business successfully!");
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Failed to assign user:", error);
//       toast.error((error as Error).message || "Failed to assign user.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

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
//                 <UserPlus size={22} className="text-primary-600" />
//                 Assign User to Business
//               </h3>
//               <button
//                 className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
//                 onClick={onClose}
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {isLoading ? (
//               <div className="h-48 flex items-center justify-center">
//                 <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business</label>
//                   <select value={selectedBusiness} onChange={(e) => setSelectedBusiness(e.target.value)} className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.business ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg`}>
//                     <option value="">Select a business</option>
//                     {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//                   </select>
//                   {errors.business && <p className="text-red-500 text-xs mt-1">{errors.business}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
//                   <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg`}>
//                     <option value="">Select a user</option>
//                     {users.map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>)}
//                   </select>
//                   {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
//                   <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg`}>
//                     <option value="">Select a role</option>
//                     {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
//                   </select>
//                   {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
//                     onClick={onClose}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
//                     onClick={handleSubmit}
//                     disabled={isSaving}
//                   >
//                     {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus size={16} />}
//                     {isSaving ? "Assigning..." : "Assign User"}
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

// export default AssignUserModal;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Briefcase, User, Shield, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import businessService from "../../../api/services/businessService";
import userService from "../../../api/services/users";

interface AssignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignUserModal: React.FC<AssignUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch businesses and users on modal open
  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
          const [businessesData, usersData] = await Promise.all([
            businessService.getAllBusinesses(),
            userService.getAllUsers(),
          ]);

          console.log("Raw API responses:", { businessesData, usersData });

          setBusinesses(Array.isArray(businessesData) ? businessesData : []);
          setUsers(Array.isArray(usersData) ? usersData : []);

        } catch (error) {
          console.error("Failed to load initial data:", error);
          toast.error("Could not load necessary data. Please try again.");
          onClose();
        } finally {
          setIsLoading(false);
        }
      };
      fetchInitialData();
    }
  }, [isOpen, onClose]);

  // Fetch business-specific roles when business is selected
  useEffect(() => {
    const fetchBusinessRoles = async () => {
      if (!selectedBusiness) {
        setRoles([]);
        return;
      }

      setIsLoadingRoles(true);
      try {
        // CHANGE: Fetch business-specific roles instead of global roles
        // You'll need to add this method to your businessService
        const rolesData = await businessService.getBusinessRoles(selectedBusiness);
        
        console.log("Business roles data:", rolesData);
        // The API might return an array directly, or an object like { roles: [...] }
        // This safely handles both cases.
        const extractedRoles = Array.isArray(rolesData) ? rolesData : (rolesData as any)?.roles || [];
        setRoles(extractedRoles || []);
      } catch (error) {
        console.error("Failed to load business roles:", error);
        toast.error("Could not load roles for selected business.");
        setRoles([]);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchBusinessRoles();
  }, [selectedBusiness]);

  // Reset role selection when business changes
  useEffect(() => {
    setSelectedRole("");
  }, [selectedBusiness]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedBusiness) newErrors.business = "Business is required.";
    if (!selectedUser) newErrors.user = "User is required.";
    if (!selectedRole) newErrors.role = "Role is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await businessService.assignUserToBusiness(selectedBusiness, selectedUser, selectedRole);
      toast.success("User assigned to business successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign user:", error);
      toast.error((error as Error).message || "Failed to assign user.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get user display name
  const getUserDisplayName = (user: any) => {
    const firstName = user.first_name || user.firstName || '';
    const lastName = user.last_name || user.lastName || '';
    const email = user.email || '';
    
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName ? `${fullName} (${email})` : email || 'Unknown User';
  };

  // Helper function to get role display name
  const getRoleDisplayName = (role: any) => {
    return role.title || role.name || 'Unknown Role';
  };

  // Helper function to get business display name
  const getBusinessDisplayName = (business: any) => {
    return business.name || business.title || 'Unknown Business';
  };

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
                <UserPlus size={22} className="text-primary-600" />
                Assign User to Business
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>

            {isLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business</label>
                  <select 
                    value={selectedBusiness} 
                    onChange={(e) => setSelectedBusiness(e.target.value)} 
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.business ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg`}
                  >
                    <option value="">Select a business</option>
                    {businesses.map(b => (
                      <option key={b.id} value={b.id}>
                        {getBusinessDisplayName(b)}
                      </option>
                    ))}
                  </select>
                  {errors.business && <p className="text-red-500 text-xs mt-1">{errors.business}</p>}
                  <p className="text-xs text-gray-500 mt-1">Found {businesses.length} businesses</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
                  <select 
                    value={selectedUser} 
                    onChange={(e) => setSelectedUser(e.target.value)} 
                    className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg`}
                  >
                    <option value="">Select a user</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {getUserDisplayName(u)}
                      </option>
                    ))}
                  </select>
                  {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user}</p>}
                  <p className="text-xs text-gray-500 mt-1">Found {users.length} users</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <div className="relative">
                    <select 
                      value={selectedRole} 
                      onChange={(e) => setSelectedRole(e.target.value)} 
                      disabled={!selectedBusiness || isLoadingRoles}
                      className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">
                        {!selectedBusiness ? "Select a business first" : isLoadingRoles ? "Loading roles..." : "Select a role"}
                      </option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>
                          {getRoleDisplayName(r)}
                        </option>
                      ))}
                    </select>
                    {isLoadingRoles && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                      </div>
                    )}
                  </div>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedBusiness ? `Found ${roles.length} business roles` : "Select a business to see available roles"}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={isSaving || !selectedBusiness || !selectedUser || !selectedRole}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus size={16} />}
                    {isSaving ? "Assigning..." : "Assign User"}
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

export default AssignUserModal;