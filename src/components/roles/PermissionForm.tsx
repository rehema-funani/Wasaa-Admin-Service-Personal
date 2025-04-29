import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    X,
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    InfoIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { permissionService } from '../../api/services/permissions';

interface PermissionFormProps {
    isEdit?: boolean;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [permission, setPermission] = useState({
        name: '',
        description: '',
        category: 'General',
        status: 'active'
    });

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    const categoryOptions = [
        { value: 'General', label: 'General' },
        { value: 'User', label: 'User Management' },
        { value: 'Content', label: 'Content Management' },
        { value: 'Admin', label: 'Administration' },
        { value: 'Reports', label: 'Reports & Analytics' }
    ];

    useEffect(() => {
        if (isEdit && id) {
            fetchPermissionDetails(id);
        }
    }, [isEdit, id]);

    const fetchPermissionDetails = async (permissionId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await permissionService.getPermission(permissionId);
            setPermission({
                name: response.name || '',
                description: response.description || '',
                category: response.category || 'General',
                status: response.status || 'active'
            });
        } catch (err) {
            console.error('Failed to fetch permission details:', err);
            setError('Failed to load permission details. Please try again later.');
            toast.error('Failed to load permission details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPermission(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!permission.name.trim()) {
            setError('Permission name is required');
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEdit && id) {
                await permissionService.updatePermission(id, permission);
                setSuccess('Permission updated successfully');
                toast.success('Permission updated successfully');
            } else {
                await permissionService.createPermission(permission);
                setSuccess('Permission created successfully');
                toast.success('Permission created successfully');
                // Reset form after successful creation
                setPermission({
                    name: '',
                    description: '',
                    category: 'General',
                    status: 'active'
                });
            }
        } catch (err) {
            console.error('Failed to save permission:', err);
            setError('Failed to save permission. Please try again later.');
            toast.error('Failed to save permission');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/permissions');
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={() => navigate('/permissions')}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} className="text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Edit Permission' : 'Create New Permission'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEdit ? 'Modify permission details' : 'Define a new system permission'}
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

            <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="p-4 bg-blue-50 border-b border-blue-100 rounded-t-xl flex gap-3 items-start">
                    <InfoIcon size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-700">Permission Naming Guidelines</h3>
                        <p className="text-sm text-blue-600 mt-1">
                            Use descriptive names with action and resource (e.g., "create_users", "view_reports").
                            Permissions should clearly indicate what action they allow on what resource.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Permission Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={permission.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., create_users"
                                required
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Use snake_case format (e.g., create_users, delete_posts)
                            </p>
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={permission.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isLoading}
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={permission.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe what this permission allows users to do"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={permission.status}
                            onChange={handleInputChange}
                            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isLoading}
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <motion.button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 0 }}
                            disabled={isSaving || isLoading}
                        >
                            <X size={16} className="mr-2" />
                            Cancel
                        </motion.button>

                        <motion.button
                            type="submit"
                            className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 0 }}
                            disabled={isSaving || isLoading}
                        >
                            {isSaving ? (
                                <>
                                    <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} className="mr-2" />
                                    {isEdit ? 'Update Permission' : 'Create Permission'}
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PermissionForm;