import { X, Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import userService from '../../api/services/users';
import { roleService } from '../../api/services/roles';

const EditAdmin = ({
    isEditModalOpen,
    setIsEditModalOpen,
    editFormData,
    setEditFormData,
    handleEditFormChange,
    handleEditSubmit
}) => {
    const [roles, setRoles] = useState([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [roleError, setRoleError] = useState(null);

    useEffect(() => {
        if (isEditModalOpen) {
            fetchRoles();
        }
    }, [isEditModalOpen]);

    const fetchRoles = async () => {
        setIsLoadingRoles(true);
        setRoleError(null);

        try {
            const response = await roleService.getRoles();

            setRoles(response);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setRoleError('Failed to load roles. Please try again.');
        } finally {
            setIsLoadingRoles(false);
        }
    };

    const glassStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '24px'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div style={glassStyle} className="max-w-md w-full mx-auto">
                <div className="flex items-center justify-between p-5 border-b border-gray-100/80">
                    <h3 className="text-xl font-semibold text-gray-800">Edit User</h3>
                    <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-gray-100/50 p-2"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditFormChange}
                                    required
                                    className="w-full py-2.5 px-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm transition-all duration-200"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={editFormData.first_name}
                                        onChange={handleEditFormChange}
                                        className="w-full py-2.5 px-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm transition-all duration-200"
                                        placeholder="John"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={editFormData.last_name}
                                        onChange={handleEditFormChange}
                                        className="w-full py-2.5 px-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm transition-all duration-200"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={editFormData.phone_number}
                                    onChange={handleEditFormChange}
                                    className="w-full py-2.5 px-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm transition-all duration-200"
                                    placeholder="+254700000000"
                                />
                            </div>

                            <div>
                                <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Role
                                </label>
                                <div className="relative">
                                    <select
                                        id="role_id"
                                        name="role_id"
                                        value={editFormData.role_id}
                                        onChange={handleEditFormChange}
                                        className="w-full py-2.5 px-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 text-sm appearance-none transition-all duration-200"
                                        disabled={isLoadingRoles}
                                    >
                                        <option value="">Select Role</option>
                                        {isLoadingRoles ? (
                                            <option disabled>Loading roles...</option>
                                        ) : roleError ? (
                                            <option disabled>Error loading roles</option>
                                        ) : (
                                            roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.title}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        {isLoadingRoles ? (
                                            <Loader2 size={16} className="text-gray-400 animate-spin" />
                                        ) : (
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                {roleError && (
                                    <p className="mt-1 text-xs text-red-500">{roleError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Status
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'active', color: 'emerald' },
                                        { value: 'inactive', color: 'gray' },
                                        { value: 'blocked', color: 'amber' },
                                        { value: 'terminated', color: 'red' }
                                    ].map((status) => (
                                        <button
                                            key={status.value}
                                            type="button"
                                            onClick={() => setEditFormData(prev => ({
                                                ...prev,
                                                account_status: status.value
                                            }))}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${editFormData.account_status === status.value
                                                    ? `bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200 shadow-sm`
                                                    : 'bg-white/50 text-gray-600 hover:bg-gray-100/80 border border-transparent'
                                                }`}
                                        >
                                            {status.value.charAt(0).toUpperCase() + status.value.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100/80">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditAdmin