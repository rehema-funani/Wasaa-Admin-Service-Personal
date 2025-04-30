import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, User, Mail, Phone, Lock, MapPin, Edit2, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ModalBackdrop from './ModalBackdrop';
import userService from '../../api/services/users';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    role_id: string | null;
    status: string;
    location: string;
    last_login: string | null;
    createdAt: string;
    transactions_count: number;
    phone_number: string | null;
    first_name: string;
    last_name: string;
    lastActive?: string;
}

interface Role {
    id: string;
    title: string;
    description: string;
    permissions: string[];
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User;
    roles: Role[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSuccess, user, roles }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        password: '',
        confirm_password: '',
        role_id: user.role_id || '',
        status: user.status || 'active',
        location: user.location || ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [changePassword, setChangePassword] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleChangePassword = () => {
        setChangePassword(!changePassword);
        if (!changePassword) {
            setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (changePassword && formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const { confirm_password, ...dataToSend } = formData;

            if (!changePassword) {
                delete (dataToSend as { password?: string }).password;
            }

            await userService.updateUser(user.id, dataToSend);
            toast.success('User updated successfully');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to update user:', err);
            setError(err.message || 'Failed to update user. Please try again.');
            toast.error('Failed to update user');
        } finally {
            setIsSaving(false);
        }
    };

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'blocked', label: 'Blocked' }
    ];

    // iOS-inspired Input Component
    const InputField = ({
        label,
        name,
        type = 'text',
        value,
        onChange,
        required = false,
        icon,
        placeholder = '',
        disabled = false
    }: {
        label: string,
        name: string,
        type?: string,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        required?: boolean,
        icon?: React.ReactNode,
        placeholder?: string,
        disabled?: boolean
    }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    id={name}
                    name={name}
                    required={required}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>
    );

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
                            {/* Header with user avatar */}
                            <div className="relative">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center mr-3 shadow-md">
                                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
                                        <p className="text-sm text-gray-500">{user.email}</p>
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

                                {/* Tabs */}
                                <div className="flex border-b border-gray-100">
                                    <motion.button
                                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-600 hover:text-gray-800'}`}
                                        onClick={() => setActiveTab('basic')}
                                        whileHover={{ backgroundColor: activeTab === 'basic' ? undefined : '#f9fafb' }}
                                    >
                                        Basic Info
                                    </motion.button>
                                    <motion.button
                                        className={`px-6 py-3 text-sm font-medium ${activeTab === 'account' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-600 hover:text-gray-800'}`}
                                        onClick={() => setActiveTab('account')}
                                        whileHover={{ backgroundColor: activeTab === 'account' ? undefined : '#f9fafb' }}
                                    >
                                        Account Settings
                                    </motion.button>
                                </div>
                            </div>

                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
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

                                <form onSubmit={(e) => e.preventDefault()}>
                                    <AnimatePresence mode="wait">
                                        {/* Basic Info Tab */}
                                        {activeTab === 'basic' && (
                                            <motion.div
                                                key="basic"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputField
                                                        label="First Name"
                                                        name="first_name"
                                                        value={formData.first_name}
                                                        onChange={handleChange}
                                                        required
                                                        icon={<User size={18} className="text-gray-400" />}
                                                        placeholder="Enter first name"
                                                    />

                                                    <InputField
                                                        label="Last Name"
                                                        name="last_name"
                                                        value={formData.last_name}
                                                        onChange={handleChange}
                                                        required
                                                        icon={<User size={18} className="text-gray-400" />}
                                                        placeholder="Enter last name"
                                                    />
                                                </div>

                                                <InputField
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    icon={<Mail size={18} className="text-gray-400" />}
                                                    placeholder="Enter email address"
                                                />

                                                <InputField
                                                    label="Phone Number"
                                                    name="phone_number"
                                                    type="tel"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                    icon={<Phone size={18} className="text-gray-400" />}
                                                    placeholder="Enter phone number"
                                                />

                                                <InputField
                                                    label="Location"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    icon={<MapPin size={18} className="text-gray-400" />}
                                                    placeholder="Enter location"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Account Settings Tab */}
                                        {activeTab === 'account' && (
                                            <motion.div
                                                key="account"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="mb-5">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-base font-medium text-gray-800">Password</h3>
                                                        <div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    value=""
                                                                    className="sr-only peer"
                                                                    checked={changePassword}
                                                                    onChange={toggleChangePassword}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                                                <span className="ml-2 text-sm font-medium text-gray-700">Change Password</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {changePassword && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                                                        >
                                                            <InputField
                                                                label="New Password"
                                                                name="password"
                                                                type="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                required={changePassword}
                                                                icon={<Lock size={18} className="text-gray-400" />}
                                                                placeholder="Enter new password"
                                                            />

                                                            <InputField
                                                                label="Confirm New Password"
                                                                name="confirm_password"
                                                                type="password"
                                                                value={formData.confirm_password}
                                                                onChange={handleChange}
                                                                required={changePassword}
                                                                icon={<Lock size={18} className="text-gray-400" />}
                                                                placeholder="Confirm new password"
                                                            />
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className="mb-5">
                                                    <h3 className="text-base font-medium text-gray-800 mb-2">Role & Permissions</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role_id">
                                                                Role
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Shield size={18} className="text-gray-400" />
                                                                </div>
                                                                <select
                                                                    id="role_id"
                                                                    name="role_id"
                                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                                                                    value={formData.role_id || ''}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="">Select Role</option>
                                                                    {roles.map(role => (
                                                                        <option key={role.id} value={role.id}>{role.title}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                                                                Status
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <div className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' :
                                                                            formData.status === 'inactive' ? 'bg-gray-500' :
                                                                                formData.status === 'pending' ? 'bg-yellow-500' :
                                                                                    'bg-red-500'
                                                                        }`}></div>
                                                                </div>
                                                                <select
                                                                    id="status"
                                                                    name="status"
                                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                                                                    value={formData.status}
                                                                    onChange={handleChange}
                                                                >
                                                                    {statusOptions.map(option => (
                                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Activity Summary */}
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Summary</h3>
                                                    <div className="text-xs text-gray-600">
                                                        <p className="mb-1">Last active: {user.lastActive || 'Never'}</p>
                                                        <p className="mb-1">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                                                        <p>Transactions: {user.transactions_count}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 flex justify-end items-center">
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all duration-200 mr-2"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl hover:from-indigo-500 hover:to-indigo-400 shadow-md transition-all duration-200 flex items-center"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 size={16} className="mr-2" />
                                            Update User
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

export default EditUserModal;