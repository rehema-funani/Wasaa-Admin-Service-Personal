import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    X,
    Search,
    Shield,
    Lock,
    CheckCircle,
    Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ModalBackdrop from './ModalBackdrop';
import userService from '../../api/services/users';

interface Role {
    id: string;
    title: string;
    description: string;
    permissions: string[];
}

interface UserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
    roles: Role[];
    currentRoleId: string;
}

const UserRoleModal: React.FC<UserRoleModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    userId,
    roles,
    currentRoleId
}) => {
    const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoles, setFilteredRoles] = useState<Role[]>(roles);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hoverRoleId, setHoverRoleId] = useState<string | null>(null);

    // Role permission category colors
    const permissionColors: Record<string, string> = {
        'read': 'bg-blue-100 text-blue-700',
        'write': 'bg-green-100 text-green-700',
        'delete': 'bg-red-100 text-red-700',
        'manage': 'bg-purple-100 text-purple-700',
        'admin': 'bg-indigo-100 text-indigo-700',
        'user': 'bg-orange-100 text-orange-700'
    };

    // Get color for permission
    const getPermissionColor = (permission: string) => {
        const category = permission.split(':')[0];
        return permissionColors[category] || 'bg-gray-100 text-gray-700';
    };

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredRoles(roles);
            return;
        }

        const lowercasedQuery = searchQuery.toLowerCase();

        const filtered = roles.filter(role =>
            (role.title?.toLowerCase() || '').includes(lowercasedQuery) ||
            (role.description?.toLowerCase() || '').includes(lowercasedQuery)
        );

        setFilteredRoles(filtered);
    }, [searchQuery, roles]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleRoleSelect = (roleId: string) => {
        setSelectedRoleId(roleId);
    };

    const handleSubmit = async () => {
        if (selectedRoleId === currentRoleId) {
            onClose();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await userService.updateUserRole(userId, selectedRoleId);
            toast.success('User role updated successfully');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to update user role:', err);
            setError(err.message || 'Failed to update user role. Please try again.');
            toast.error('Failed to update user role');
        } finally {
            setIsLoading(false);
        }
    };

    const currentRole = roles.find(role => role.id === currentRoleId);
    const selectedRole = roles.find(role => role.id === selectedRoleId);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <ModalBackdrop onClick={onClose} />

                    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="flex items-center">
                                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                        <Shield size={18} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">Assign Role</h2>
                                        <p className="text-xs text-gray-500">Current role: {currentRole?.title || 'None'}</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none bg-white rounded-full p-2 shadow-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-160px)]">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start"
                                    >
                                        <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                {/* Search */}
                                <div className="mb-4 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search roles..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                                    />
                                </div>

                                {/* Role selection */}
                                <div className="space-y-3 mb-4">
                                    {filteredRoles.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">
                                            {searchQuery.trim() !== ''
                                                ? 'No roles match your search criteria'
                                                : 'No roles available'}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {filteredRoles.map(role => (
                                                <motion.div
                                                    key={role.id}
                                                    className={`
                            relative p-4 rounded-xl border cursor-pointer transition-all duration-150
                            ${selectedRoleId === role.id
                                                            ? 'border-indigo-300 bg-indigo-50 shadow-md'
                                                            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                        }
                          `}
                                                    onClick={() => handleRoleSelect(role.id)}
                                                    whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                                                    onHoverStart={() => setHoverRoleId(role.id)}
                                                    onHoverEnd={() => setHoverRoleId(null)}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className={`w-10 h-10 rounded-lg ${selectedRoleId === role.id
                                                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                                                    : 'bg-gradient-to-br from-gray-500 to-gray-400'
                                                                } text-white flex items-center justify-center shadow-md`}>
                                                                <Shield size={18} strokeWidth={2} />
                                                            </div>
                                                        </div>

                                                        <div className="ml-3 flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <p className={`text-base font-medium ${selectedRoleId === role.id ? 'text-indigo-700' : 'text-gray-800'
                                                                    }`}>
                                                                    {role.title}
                                                                </p>

                                                                <div className="flex items-center">
                                                                    {selectedRoleId === role.id && (
                                                                        <motion.div
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-2 shadow-sm"
                                                                        >
                                                                            <Check size={14} className="text-white" />
                                                                        </motion.div>
                                                                    )}

                                                                    <div className={`w-5 h-5 rounded-full border ${selectedRoleId === role.id
                                                                            ? 'border-indigo-500 bg-indigo-100'
                                                                            : 'border-gray-300 bg-white'
                                                                        }`}>
                                                                        {selectedRoleId === role.id && (
                                                                            <motion.div
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 1 }}
                                                                                className="w-full h-full flex items-center justify-center"
                                                                            >
                                                                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {role.description && (
                                                                <p className={`text-sm mt-1 ${selectedRoleId === role.id ? 'text-indigo-600' : 'text-gray-500'
                                                                    }`}>
                                                                    {role.description}
                                                                </p>
                                                            )}

                                                            {role.permissions.length > 0 && (
                                                                <div className="mt-3">
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {role.permissions.slice(0, 3).map((permission, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getPermissionColor(permission)}`}
                                                                            >
                                                                                <Lock size={10} className="mr-1" />
                                                                                {permission}
                                                                            </span>
                                                                        ))}

                                                                        {role.permissions.length > 3 && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                                                +{role.permissions.length - 3} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Permission tooltip on hover */}
                                                    {hoverRoleId === role.id && role.permissions.length > 3 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="absolute left-4 right-4 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10"
                                                        >
                                                            <div className="text-xs font-medium text-gray-700 mb-2">All Permissions:</div>
                                                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                                                {role.permissions.map((permission, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getPermissionColor(permission)}`}
                                                                    >
                                                                        <Lock size={10} className="mr-1" />
                                                                        {permission}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-200"></div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Role comparison if a different role is selected */}
                                {selectedRoleId !== currentRoleId && currentRole && selectedRole && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-2 p-4 bg-gray-50 rounded-xl border border-gray-200"
                                    >
                                        <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                                            <CheckCircle size={14} className="text-indigo-500 mr-2" />
                                            Role Change Summary
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">From</p>
                                                <p className="text-sm font-medium text-gray-700">{currentRole.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{currentRole.permissions.length} permissions</p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">To</p>
                                                <p className="text-sm font-medium text-indigo-700">{selectedRole.title}</p>
                                                <p className="text-xs text-indigo-500 mt-1">{selectedRole.permissions.length} permissions</p>
                                            </div>
                                        </div>

                                        {/* Show permission differences */}
                                        {currentRole.permissions.length !== selectedRole.permissions.length && (
                                            <div className="mt-2 text-xs">
                                                <span className={selectedRole.permissions.length > currentRole.permissions.length ? "text-green-600" : "text-red-600"}>
                                                    {selectedRole.permissions.length > currentRole.permissions.length ? "+" : ""}
                                                    {selectedRole.permissions.length - currentRole.permissions.length} permissions
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 flex justify-end gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all duration-200"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    whileHover={selectedRoleId ? { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" } : {}}
                                    whileTap={selectedRoleId ? { scale: 0.98 } : {}}
                                    onClick={handleSubmit}
                                    className={`px-6 py-2.5 text-white rounded-xl shadow-md transition-all duration-200 flex items-center ${selectedRoleId
                                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400'
                                            : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    disabled={isLoading || !selectedRoleId}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={16} className="mr-2" />
                                            {selectedRoleId === currentRoleId ? 'Close' : 'Assign Role'}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserRoleModal;