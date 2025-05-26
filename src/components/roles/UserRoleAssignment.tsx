import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    X,
    Search,
    Loader2,
    ShieldCheck,
    User,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { roleService } from '../../api/services/roles';
import userService from '../../api/services/users';

interface User {
    id: string;
    name: string;
    email: string;
    role_id: string | null;
    status: string;
}

interface Role {
    id: string;
    title: string;
    description: string;
    permissions: string[];
}

interface UserRoleAssignmentProps {
    userId?: string;
    onClose: () => void;
    onSuccess?: () => void;
}

const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({
    userId,
    onClose,
    onSuccess
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

    useEffect(() => {
        fetchRoles();
        if (userId) {
            fetchUserDetails(userId);
        }
    }, [userId]);

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

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const response = await roleService.getRoles();
            setRoles(response.roles || []);
            setFilteredRoles(response.roles || []);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
            setError('Failed to load roles. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserDetails = async (id: string) => {
        setIsLoading(true);
        try {
            const userData = await userService.getUser(id);
            setUser(userData);
            if (userData.role_id) {
                setSelectedRoleId(userData.role_id);
            }
        } catch (err) {
            console.error('Failed to fetch user details:', err);
            setError('Failed to load user details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleSelect = (roleId: string) => {
        setSelectedRoleId(roleId);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = async () => {
        if (!user) return;

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await userService.updateUserRole(user.id, selectedRoleId);
            setSuccess('User role updated successfully');
            toast.success('User role updated successfully');

            if (onSuccess) {
                onSuccess();
            }

            // Close the modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Failed to update user role:', err);
            setError('Failed to update user role. Please try again later.');
            toast.error('Failed to update user role');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Assign Role to User</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {error && (
                    <motion.div
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle size={18} className="mr-2" />
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CheckCircle2 size={18} className="mr-2" />
                        {success}
                    </motion.div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-primary-500" />
                    </div>
                ) : (
                    <>
                        {user && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                                        <User size={20} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">Current Role:</span>
                                    {user.role_id ? (
                                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-md">
                                            {roles.find(role => role.id === user.role_id)?.title || 'Unknown Role'}
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                            No Role Assigned
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="space-y-3 mb-6">
                            {filteredRoles.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    {searchQuery.trim() !== ''
                                        ? 'No roles match your search criteria'
                                        : 'No roles available'}
                                </div>
                            ) : (
                                filteredRoles.map(role => (
                                    <div
                                        key={role.id}
                                        className={`
                      flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-150
                      ${selectedRoleId === role.id
                                                ? 'border-primary-200 bg-primary-50'
                                                : 'border-gray-200 hover:bg-gray-50'}
                    `}
                                        onClick={() => handleRoleSelect(role.id)}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-primary-500 text-white flex items-center justify-center">
                                                <ShieldCheck size={16} strokeWidth={2} />
                                            </div>
                                        </div>

                                        <div className="ml-3 flex-grow">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-800">{role.title}</p>
                                                <input
                                                    type="radio"
                                                    checked={selectedRoleId === role.id}
                                                    onChange={() => { }}
                                                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                                />
                                            </div>
                                            {role.description && (
                                                <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                            )}
                                            {role.permissions.length > 0 && (
                                                <p className="text-xs text-primary-600 mt-2">
                                                    {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    disabled={isSaving}
                >
                    <X size={16} className="mr-2" />
                    Cancel
                </motion.button>

                <motion.button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50"
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    disabled={isSaving || isLoading || !selectedRoleId}
                >
                    {isSaving ? (
                        <>
                            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" />
                            Assign Role
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default UserRoleAssignment;