import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Shield,
    Edit,
    Trash2,
    X,
    Search,
    Key,
    User,
    Settings,
    Globe,
    FileText,
    AlertCircle,
    HelpCircle,
    Save,
    RefreshCw,
    Clipboard,
    KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { roleService } from '../../../api/services/roles';

interface Permission {
    id: string;
    title: string;
}

interface RolePermission {
    id: number;
    permissions: Permission;
}

interface Role {
    id: string;
    title: string;
    role_permissions: RolePermission[];
}

const capitalizeWords = (str: string): string => {
    return str
        .replace(/_/g, ' ')
        .replace(/can_/g, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getPermissionCategory = (permissionTitle: string): string => {
    const parts = permissionTitle.split('_');
    if (parts.length > 2) {
        return parts[parts.length - 1];
    }
    return 'other';
};

const getPermissionAction = (permissionTitle: string): string => {
    const parts = permissionTitle.split('_');
    if (parts.length > 1) {
        return parts[1];
    }
    return 'other';
};

const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
        users: <User size={16} />,
        staff: <User size={16} />,
        roles: <Shield size={16} />,
        permissions: <Key size={16} />,
        apikeys: <KeyRound size={16} />,
        settings: <Settings size={16} />,
        languages: <Globe size={16} />,
        account_types: <User size={16} />,
    };

    return iconMap[category.toLowerCase()] || <FileText size={16} />;
};

const getActionColor = (action: string): string => {
    const colorMap: Record<string, string> = {
        create: 'bg-green-100 text-green-700',
        update: 'bg-primary-100 text-primary-700',
        delete: 'bg-red-100 text-red-700',
        list: 'bg-purple-100 text-purple-700',
        view: 'bg-primary-100 text-primary-700',
    };

    return colorMap[action] || 'bg-gray-100 text-gray-700';
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const roledetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [editedRoleTitle, setEditedRoleTitle] = useState<string>('');

    const fetchroledetails = async () => {
        try {
            setLoading(true);
            if (id) {
                const response = await roleService.getRole(id);
                setRole(response);
                setEditedRoleTitle(response.title);
            } else {
                throw new Error('Role ID is undefined.');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setError('Failed to load role details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchroledetails();
    }, [id]);

    const handleUpdateRole = async () => {
        try {
            if (id && editedRoleTitle.trim()) {
                await roleService.updateRole(id, { title: editedRoleTitle });
                setRole(prev => prev ? { ...prev, title: editedRoleTitle } : null);
                setIsEditModalOpen(false);
                toast.success('Role updated successfully');
            }
        } catch (error) {
            console.error('Failed to update role:', error);
            toast.error('Failed to update role');
        }
    };

    const handleDeleteRole = async () => {
        try {
            setIsConfirmingDelete(true);
            if (id) {
                await roleService.deleteRole(id);
                setIsDeleteModalOpen(false);
                toast.success('Role deleted successfully');
                navigate(-1);
            }
        } catch (error) {
            console.error('Failed to delete role:', error);
            toast.error('Failed to delete role');
        } finally {
            setIsConfirmingDelete(false);
        }
    };

    const groupedPermissions = useMemo(() => {
        if (!role) return {};

        const filtered = searchQuery
            ? role.role_permissions.filter(rp =>
                rp.permissions.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : role.role_permissions;

        return filtered.reduce((acc: Record<string, RolePermission[]>, rp) => {
            const category = getPermissionCategory(rp.permissions.title);
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(rp);
            return acc;
        }, {});
    }, [role, searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-pulse">
                        <div className="w-48 h-8 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="w-64 h-6 bg-gray-200 rounded-lg"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
                        <div className="w-1/3 h-6 bg-gray-200 rounded-lg mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!role) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                        >
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{role.title}</h1>
                            <p className="text-gray-500 mt-1 flex items-center">
                                <Clipboard size={14} className="mr-1" />
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate(`/admin/system/roles/${id}/edit`)}
                                className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm flex items-center"
                            >
                                <Edit size={16} className="mr-2" />
                                Edit Role
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center"
                            >
                                <Trash2 size={16} className="mr-2 text-gray-500" />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-primary-50 to-primary-50 p-6 rounded-xl border border-primary-100">
                            <div className="flex items-start">
                                <div className="bg-white p-3 rounded-lg shadow-sm mr-4">
                                    <Shield size={20} className="text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-gray-600 text-sm font-medium">Total Permissions</h3>
                                    <p className="text-2xl font-bold text-gray-800">{role.role_permissions.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                            <div className="flex items-start">
                                <div className="bg-white p-3 rounded-lg shadow-sm mr-4">
                                    <Key size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-gray-600 text-sm font-medium">Permission Categories</h3>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {Object.keys(groupedPermissions).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                            <div className="flex items-start">
                                <div className="bg-white p-3 rounded-lg shadow-sm mr-4">
                                    <User size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-gray-600 text-sm font-medium">Role Type</h3>
                                    <p className="text-lg font-bold text-gray-800">
                                        {role.title.includes('Admin') ? 'Administrative' : 'Standard'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Role Permissions</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search permissions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full md:w-64 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {Object.keys(groupedPermissions).length > 0 ? (
                        <div className="space-y-8">
                            {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                <div key={category} className="border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-lg bg-primary-50 mr-3">
                                            {getCategoryIcon(category)}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800 capitalize">
                                            {category.replace(/_/g, ' ')}
                                        </h3>
                                        <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                                            {permissions.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {permissions.map((rp) => {
                                            const action = getPermissionAction(rp.permissions.title);
                                            const actionColor = getActionColor(action);

                                            return (
                                                <div
                                                    key={rp.id}
                                                    className="p-4 border border-gray-100 rounded-lg hover:border-primary-100 transition-colors duration-300 bg-white"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionColor}`}>
                                                            {action}
                                                        </span>
                                                        <span className="text-xs text-gray-400">#{rp.id}</span>
                                                    </div>
                                                    <p className="text-gray-800 font-medium">
                                                        {capitalizeWords(rp.permissions.title)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <HelpCircle size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No Permissions Found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {searchQuery
                                    ? `No permissions matching "${searchQuery}" were found.`
                                    : "This role doesn't have any permissions assigned yet."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors duration-300"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Role"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="roleTitle">
                            Role Title
                        </label>
                        <input
                            id="roleTitle"
                            type="text"
                            value={editedRoleTitle}
                            onChange={(e) => setEditedRoleTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter role title"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdateRole}
                            disabled={!editedRoleTitle.trim()}
                            className={`px-4 py-2.5 rounded-xl transition-colors duration-300 ${editedRoleTitle.trim()
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Save size={16} className="inline mr-2" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Role"
            >
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Are you sure?</h3>
                    <p className="text-gray-600 mb-6">
                        This will permanently delete the role <span className="font-semibold">"{role.title}"</span> and remove all associated permissions. This action cannot be undone.
                    </p>

                    <div className="flex justify-center space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors duration-300"
                            disabled={isConfirmingDelete}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteRole}
                            disabled={isConfirmingDelete}
                            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-colors duration-300 flex items-center"
                        >
                            {isConfirmingDelete ? (
                                <>
                                    <RefreshCw size={16} className="animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Role
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default roledetail;
