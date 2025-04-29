import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Upload,
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Clock,
    CalendarDays,
    AlertCircle,
    X,
    Search,
    Shield
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import userService from '../../../api/services/users';
import { roleService } from '../../../api/services/roles';
import StatusBadge from '../../../components/common/StatusBadge';
import SearchBox from '../../../components/common/SearchBox';
import FilterPanel from '../../../components/common/FilterPanel';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';

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

const users = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'admin', 'inactive', 'new york'
    ]);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await userService.getAdminUsers();
            const formattedUsers = response.users.map((user: any) => ({
                id: user.id,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                email: user.email || '',
                role: user.role?.title || 'User',
                status: user.status || 'active',
                location: user.location || 'Not specified',
                lastActive: user.last_login ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true }) : 'Never',
                joinDate: user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown',
                transactions: user.transactions_count || 0,
                role_id: user.role_id,
                phone_number: user.phone_number,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                createdAt: user.createdAt,
                last_login: user.last_login,
                transactions_count: user.transactions_count || 0
            }));

            setUsers(formattedUsers);
            setFilteredUsers(formattedUsers);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users. Please try again later.');
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await roleService.getRoles();
            setRoles(response.roles || []);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        setIsLoading(true);
        try {
            await userService.deleteUser(userId);
            toast.success('User deleted successfully');
            fetchUsers();
            setDeleteModalOpen(false);
        } catch (err) {
            console.error('Failed to delete user:', err);
            toast.error('Failed to delete user');
        } finally {
            setIsLoading(false);
        }
    };

    const filterOptions = [
        {
            id: 'role',
            label: 'Role',
            type: 'select' as const,
            options: roles.map(role => ({ value: role.title, label: role.title }))
        },
        {
            id: 'status',
            label: 'Status',
            type: 'multiselect' as const,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'processing', label: 'Processing' }
            ]
        },
        {
            id: 'joinDate',
            label: 'Join Date',
            type: 'daterange' as const
        },
        {
            id: 'transactions',
            label: 'Transactions',
            type: 'number' as const
        },
        {
            id: 'verified',
            label: 'Verified Email',
            type: 'boolean' as const
        }
    ];

    const columns = [
        {
            id: 'name',
            header: 'Name',
            accessor: (row: User) => row.name,
            sortable: true,
            cell: (value: string, row: User) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                        {value ? value.split(' ').map(n => n[0]).join('') : '??'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{value || 'Unnamed User'}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'role',
            header: 'Role',
            accessor: (row: User) => row.role,
            sortable: true,
            width: '120px',
            cell: (value: string) => (
                <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {value}
                </span>
            )
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (row: User) => row.status,
            sortable: true,
            width: '120px',
            cell: (value: string) => (
                <StatusBadge status={value as any} size="sm" withIcon withDot={value === 'active'} />
            )
        },
        {
            id: 'lastActive',
            header: 'Last Active',
            accessor: (row: User) => row.lastActive,
            sortable: true,
            cell: (value: string) => (
                <div className="flex items-center">
                    <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                    <span>{value}</span>
                </div>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (row: User) => row.id,
            sortable: false,
            width: '140px',
            cell: (value: string, row: User) => (
                <div className="flex items-center space-x-1">
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="View user"
                        onClick={() => handleViewUser(row)}
                    >
                        <Eye size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Edit user"
                        onClick={() => handleEditUser(row)}
                    >
                        <Edit size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Assign role"
                        onClick={() => handleAssignRole(row)}
                    >
                        <Shield size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Delete user"
                        onClick={() => handleConfirmDelete(row)}
                    >
                        <Trash2 size={16} strokeWidth={1.8} />
                    </motion.button>
                </div>
            )
        }
    ];

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setViewModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleAssignRole = (user: User) => {
        setSelectedUser(user);
        setRoleModalOpen(true);
    };

    const handleConfirmDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setCreateModalOpen(true);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredUsers(users);
            return;
        }

        const lowercasedQuery = query.toLowerCase();

        const filtered = users.filter(user =>
            (user.name?.toLowerCase() || '').includes(lowercasedQuery) ||
            (user.email?.toLowerCase() || '').includes(lowercasedQuery) ||
            (user.role?.toLowerCase() || '').includes(lowercasedQuery) ||
            (user.location?.toLowerCase() || '').includes(lowercasedQuery)
        );

        setFilteredUsers(filtered);

        if (query.trim() !== '' && !recentSearches.includes(query)) {
            setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
        }

        setCurrentPage(1);
    };

    const handleApplyFilters = (filters: Record<string, any>) => {
        setAppliedFilters(filters);

        let filtered = [...users];

        if (filters.role) {
            filtered = filtered.filter(user => user.role === filters.role);
        }

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(user => filters.status.includes(user.status));
        }

        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                (user.name?.toLowerCase() || '').includes(lowercasedQuery) ||
                (user.email?.toLowerCase() || '').includes(lowercasedQuery) ||
                (user.role?.toLowerCase() || '').includes(lowercasedQuery) ||
                (user.location?.toLowerCase() || '').includes(lowercasedQuery)
            );
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setAppliedFilters({});
        setFilteredUsers(users);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };

    const handleExport = () => {
        toast.success('Users exported successfully');
    };

    const handleModalSuccess = () => {
        fetchUsers();
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
                    <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <motion.button
                        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0 }}
                    >
                        <Upload size={16} className="mr-2" strokeWidth={1.8} />
                        Import
                    </motion.button>
                    <motion.button
                        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={{ y: 0 }}
                        onClick={handleExport}
                    >
                        <Download size={16} className="mr-2" strokeWidth={1.8} />
                        Export
                    </motion.button>
                    <motion.button
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
                        whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                        whileTap={{ y: 0 }}
                        onClick={handleAddUser}
                    >
                        <UserPlus size={16} className="mr-2" strokeWidth={1.8} />
                        Add User
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="md:col-span-2">
                    <SearchBox
                        placeholder="Search users by name, email, role or location..."
                        onSearch={handleSearch}
                        suggestions={users.map(user => user.name).slice(0, 5)}
                        recentSearches={recentSearches}
                        showRecentByDefault={true}
                    />
                </div>
                <div className="md:col-span-1">
                    <FilterPanel
                        title="User Filters"
                        filters={filterOptions}
                        onApplyFilters={handleApplyFilters}
                        onResetFilters={handleResetFilters}
                        initialExpanded={false}
                    />
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

            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    selectable={true}
                    isLoading={isLoading}
                    emptyMessage="No users found. Try adjusting your filters or search terms."
                    defaultRowsPerPage={itemsPerPage}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <Pagination
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                    showSummary={true}
                />
            </motion.div>

            {/* Modal Components */}
            <AnimatePresence>
                {createModalOpen && (
                    <CreateUserModal
                        isOpen={createModalOpen}
                        onClose={() => setCreateModalOpen(false)}
                        onSuccess={handleModalSuccess}
                        roles={roles}
                    />
                )}

                {editModalOpen && selectedUser && (
                    <EditUserModal
                        isOpen={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        onSuccess={handleModalSuccess}
                        user={selectedUser}
                        roles={roles}
                    />
                )}

                {viewModalOpen && selectedUser && (
                    <ViewUserModal
                        isOpen={viewModalOpen}
                        onClose={() => setViewModalOpen(false)}
                        user={selectedUser}
                    />
                )}

                {deleteModalOpen && selectedUser && (
                    <DeleteUserModal
                        isOpen={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={() => handleDeleteUser(selectedUser.id)}
                        user={selectedUser}
                    />
                )}

                {roleModalOpen && selectedUser && (
                    <UserRoleModal
                        isOpen={roleModalOpen}
                        onClose={() => setRoleModalOpen(false)}
                        onSuccess={handleModalSuccess}
                        userId={selectedUser.id}
                        roles={roles}
                        currentRoleId={selectedUser.role_id || ''}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Modal Backdrop Component
const ModalBackdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClick}
    />
);

// Create User Modal Component
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
        password: '',
        confirm_password: '',
        role_id: '',
        status: 'active',
        location: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            // Remove confirm_password before sending
            const { confirm_password, ...dataToSend } = formData;

            await userService.createUser(dataToSend);
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

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'blocked', label: 'Blocked' }
    ];

    return (
        <>
            <ModalBackdrop onClick={onClose} />

            <motion.div
                className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Create New User</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                <p className="flex items-center">
                                    <AlertCircle size={16} className="mr-2" /> {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone_number">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm_password">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm_password"
                                        name="confirm_password"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role_id">
                                        Role
                                    </label>
                                    <select
                                        id="role_id"
                                        name="role_id"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                'Create User'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    return (
        <>
            <ModalBackdrop onClick={onClose} />

            <motion.div
                className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                <p className="flex items-center">
                                    <AlertCircle size={16} className="mr-2" /> {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone_number">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id="changePassword"
                                        checked={changePassword}
                                        onChange={toggleChangePassword}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="changePassword" className="ml-2 block text-sm text-gray-700">
                                        Change Password
                                    </label>
                                </div>

                                {changePassword && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                                New Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                required={changePassword}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm_password">
                                                Confirm New Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                id="confirm_password"
                                                name="confirm_password"
                                                required={changePassword}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role_id">
                                        Role
                                    </label>
                                    <select
                                        id="role_id"
                                        name="role_id"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                'Update User'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

// View User Modal Component
interface ViewUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
    return (
        <>
            <ModalBackdrop onClick={onClose} />

            <motion.div
                className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-bold text-xl mr-4">
                                {user.name ? user.name.split(' ').map(n => n[0]).join('') : '??'}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Role</h4>
                                <p className="text-gray-800 font-medium">{user.role || 'No role assigned'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                                <StatusBadge status={user.status as any} size="md" withIcon />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Phone Number</h4>
                                <p className="text-gray-800">{user.phone_number || 'Not provided'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                                <p className="text-gray-800">{user.location || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Last Active</h4>
                                <p className="text-gray-800 flex items-center">
                                    <Clock size={16} className="mr-2 text-gray-400" />
                                    {user.last_login ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true }) : 'Never'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Joined</h4>
                                <p className="text-gray-800 flex items-center">
                                    <CalendarDays size={16} className="mr-2 text-gray-400" />
                                    {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Count</h4>
                            <p className="text-gray-800">{user.transactions_count}</p>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

// Delete User Confirmation Modal
interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: User;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <ModalBackdrop onClick={onClose} />

            <motion.div
                className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-center text-gray-900">Delete User</h3>
                        <p className="text-sm text-center text-gray-500">
                            Are you sure you want to delete the user <span className="font-medium text-gray-800">{user.name}</span>? This action cannot be undone.
                        </p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Deleting...
                                </>
                            ) : (
                                'Delete User'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

// User Role Assignment Modal
interface UserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
    roles: Role[];
    currentRoleId: string;
}

const UserRoleModal: React.FC<UserRoleModalProps> = ({ isOpen, onClose, onSuccess, userId, roles, currentRoleId }) => {
    const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoles, setFilteredRoles] = useState<Role[]>(roles);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <>
            <ModalBackdrop onClick={onClose} />

            <motion.div
                className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Assign Role</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                <p className="flex items-center">
                                    <AlertCircle size={16} className="mr-2" /> {error}
                                </p>
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
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                                ? 'border-indigo-200 bg-indigo-50'
                                                : 'border-gray-200 hover:bg-gray-50'}
                    `}
                                        onClick={() => handleRoleSelect(role.id)}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center">
                                                <Shield size={16} strokeWidth={2} />
                                            </div>
                                        </div>

                                        <div className="ml-3 flex-grow">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-800">{role.title}</p>
                                                <input
                                                    type="radio"
                                                    checked={selectedRoleId === role.id}
                                                    onChange={() => { }}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                />
                                            </div>
                                            {role.description && (
                                                <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                            )}
                                            {role.permissions.length > 0 && (
                                                <p className="text-xs text-indigo-600 mt-2">
                                                    {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center"
                            disabled={isLoading || !selectedRoleId}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Assigning...
                                </>
                            ) : (
                                'Assign Role'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default users;