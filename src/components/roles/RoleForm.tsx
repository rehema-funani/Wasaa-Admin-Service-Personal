import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    X,
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    Search
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { permissionService } from '../../api/services/permissions';
import { roleService } from '../../api/services/roles';

interface Permission {
    id: string;
    name: string;
    description: string;
    category: string;
}

interface RoleFormProps {
    isEdit?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [role, setRole] = useState({
        title: '',
        description: '',
        permissions: [] as string[],
        status: 'active'
    });

    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [permissionSearchQuery, setPermissionSearchQuery] = useState('');
    const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    useEffect(() => {
        fetchPermissions();

        if (isEdit && id) {
            fetchRoleDetails(id);
        }
    }, [isEdit, id]);

    useEffect(() => {
        if (permissionSearchQuery.trim() === '') {
            setFilteredPermissions(allPermissions);
            return;
        }

        const lowercasedQuery = permissionSearchQuery.toLowerCase();

        const filtered = allPermissions.filter(permission =>
            (permission.name?.toLowerCase() || '').includes(lowercasedQuery) ||
            (permission.description?.toLowerCase() || '').includes(lowercasedQuery) ||
            (permission.category?.toLowerCase() || '').includes(lowercasedQuery)
        );

        setFilteredPermissions(filtered);
    }, [permissionSearchQuery, allPermissions]);

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const response = await permissionService.getPermissions();
            setAllPermissions(response.permissions || []);
            setFilteredPermissions(response.permissions || []);
        } catch (err) {
            console.error('Failed to fetch permissions:', err);
            setError('Failed to load permissions. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoleDetails = async (roleId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await roleService.getRole(roleId);
            setRole({
                title: response.title || '',
                description: response.description || '',
                permissions: response.permissions || [],
                status: response.status || 'active'
            });
        } catch (err) {
            console.error('Failed to fetch role details:', err);
            setError('Failed to load role details. Please try again later.');
            toast.error('Failed to load role details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRole(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionToggle = (permissionId: string) => {
        setRole(prev => {
            const permissions = [...prev.permissions];
            if (permissions.includes(permissionId)) {
                return { ...prev, permissions: permissions.filter(id => id !== permissionId) };
            } else {
                return { ...prev, permissions: [...permissions, permissionId] };
            }
        });
    };

    const handlePermissionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPermissionSearchQuery(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!role.title.trim()) {
            setError('Role title is required');
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEdit && id) {
                await roleService.updateRole(id, role);
                setSuccess('Role updated successfully');
                toast.success('Role updated successfully');
            } else {
                await roleService.createRole(role);
                setSuccess('Role created successfully');
                toast.success('Role created successfully');
                setRole({
                    title: '',
                    description: '',
                    permissions: [],
                    status: 'active'
                });
            }
        } catch (err) {
            console.error('Failed to save role:', err);
            setError('Failed to save role. Please try again later.');
            toast.error('Failed to save role');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/roles');
    };

    // Group permissions by category
    const permissionsByCategory = filteredPermissions.reduce((acc, permission) => {
        const category = permission.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const categoryNames = Object.keys(permissionsByCategory).sort();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={() => navigate('/roles')}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} className="text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Edit Role' : 'Create New Role'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEdit ? 'Modify role details and permissions' : 'Define a new role with specific permissions'}
                    </p>
                </div>
            </motion.div>

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

            <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Role Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Role Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={role.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter role name"
                                required
                            />
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={role.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={role.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter role description"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Permissions</h2>

                    <div className="mb-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search permissions..."
                            value={permissionSearchQuery}
                            onChange={handlePermissionSearch}
                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    ) : (
                        <div className="max-h-96 overflow-y-auto pr-2">
                            {categoryNames.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No permissions found
                                </div>
                            ) : (
                                categoryNames.map(category => (
                                    <div key={category} className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                            {category}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {permissionsByCategory[category].map(permission => (
                                                <div
                                                    key={permission.id}
                                                    className={`
                            flex items-start p-3 rounded-lg border 
                            ${role.permissions.includes(permission.id)
                                                            ? 'border-primary-200 bg-primary-50'
                                                            : 'border-gray-200 hover:bg-gray-50'}
                            cursor-pointer transition-all duration-150
                          `}
                                                    onClick={() => handlePermissionToggle(permission.id)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={role.permissions.includes(permission.id)}
                                                        onChange={() => { }}
                                                        className="mt-0.5 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                    />
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-800">{permission.name}</p>
                                                        {permission.description && (
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{permission.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <motion.button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                        disabled={isSaving}
                    >
                        <X size={16} className="mr-2" />
                        Cancel
                    </motion.button>

                    <motion.button
                        type="submit"
                        className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50"
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2" />
                                Save Role
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
};

export default RoleForm;