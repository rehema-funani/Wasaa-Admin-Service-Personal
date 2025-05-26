import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Download,
    Upload,
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Clock,
    AlertCircle,
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
import {
    CreateUserModal,
    EditUserModal,
    DeleteUserModal,
    UserRoleModal
} from '../../../components/users';

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

const UserManagementPage: React.FC = () => {
    const navigate = useNavigate();
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
            setRoles(response || []);
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
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3 shadow-sm">
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
                <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
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
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="View user"
                        onClick={() => handleViewUser(row)}
                    >
                        <Eye size={16} strokeWidth={1.8} />
                    </motion.button>
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
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
        // Navigate to user details page instead of opening modal
        navigate(`/admin/users/${user.id}`);
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

    // iOS 18-inspired button component
    const ActionButton = ({
        icon,
        label,
        onClick,
        isPrimary = false
    }: {
        icon: React.ReactNode,
        label: string,
        onClick: () => void,
        isPrimary?: boolean
    }) => (
        <motion.button
            className={`flex items-center px-4 py-2.5 rounded-xl text-sm shadow-sm transition-all duration-200 ${isPrimary
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ y: 0, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            onClick={onClick}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </motion.button>
    );

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div>
                    <motion.h1
                        className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        User Management
                    </motion.h1>
                    <motion.p
                        className="text-gray-500 mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        Manage user accounts and permissions
                    </motion.p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <ActionButton
                        icon={<UserPlus size={16} className="mr-2" strokeWidth={1.8} />}
                        label="Add User"
                        onClick={handleAddUser}
                        isPrimary
                    />
                </div>
            </motion.div>

            <SearchBox
                placeholder="Search users by name, email, role or location..."
                onSearch={handleSearch}
                suggestions={users.map(user => user.name).slice(0, 5)}
                recentSearches={recentSearches}
                showRecentByDefault={true}
                className="shadow-sm rounded-xl"
            />
            <div className="mb-2 w-full text-white">.</div>

            {error && (
                <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center"
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

            {/* Modals - Remove ViewUserModal as it's been replaced by a standalone page */}
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

export default UserManagementPage;