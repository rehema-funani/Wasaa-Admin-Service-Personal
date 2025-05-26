import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, User, Mail, Phone, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ModalBackdrop from './ModalBackdrop';
import userService from '../../api/services/users';

interface Role {
    id: string;
    title: string;
    description: string;
    permissions: string[];
}

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roles: Role[];
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess, roles }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role_id: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.first_name || !formData.last_name) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await userService.createUser(formData);
            toast.success('User created successfully');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to create user:', err);
            setError(err.message || 'Failed to create user. Please try again.');
            toast.error('Failed to create user');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <ModalBackdrop onClick={onClose} />

                    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                        >
                            <div className="relative">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-primary-50 to-primary-50">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-primary-100 rounded-full p-2">
                                            <User size={20} className="text-primary-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800">Create New User</h2>
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
                            </div>

                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
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

                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
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

                                        <div className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role_id">
                                                Role <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Shield size={18} className="text-gray-400" />
                                                </div>
                                                <select
                                                    id="role_id"
                                                    name="role_id"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                                                    value={formData.role_id}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Role</option>
                                                    {roles.map(role => (
                                                        <option key={role.id} value={role.id}>{role.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {formData.role_id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100"
                                            >
                                                <p className="text-xs text-primary-700 font-medium">
                                                    {roles.find(r => r.id === formData.role_id)?.description || 'No description available for this role.'}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="mt-4 p-3 bg-primary-50 rounded-xl border border-primary-100">
                                        <p className="text-sm text-primary-800 flex items-start">
                                            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0 text-primary-500" />
                                            The user will receive a welcome email with instructions to set their password.
                                        </p>
                                    </div>
                                </form>
                            </div>

                            <div className="px-6 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 flex justify-end items-center">
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all duration-200 mr-2"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="px-6 py-2 text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 shadow-md transition-all duration-200 flex items-center"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create User'
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

const InputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    icon,
    placeholder = ''
}: {
    label: string,
    name: string,
    type?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    icon?: React.ReactNode,
    placeholder?: string
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
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white text-gray-900 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100`}
            />
        </div>
    </div>
);

export default CreateUserModal;