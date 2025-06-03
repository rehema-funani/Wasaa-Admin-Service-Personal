import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Eye,
    Plus,
    Clock,
    CalendarDays,
    AlertCircle,
    ShieldCheck
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../components/common/StatusBadge';
import SearchBox from '../../../components/common/SearchBox';
import FilterPanel from '../../../components/common/FilterPanel';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import { roleService } from '../../../api/services/roles';

interface Role {
    id: string;
    title: string;
    description: string;
    permissions: string[];
    status: string;
    userCount: number;
    createdAt: string;
    updatedAt: string;
}

const roles = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [roles, setRoles] = useState<Role[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'admin', 'inactive', 'moderator'
    ]);

    const fetchRoles = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await roleService.getRoles();
            const formattedRoles = response.map((role: any) => ({
                id: role.id,
                title: role.title || 'Untitled Role',
                description: role.description || 'No description',
                permissions: role.permissions || [],
                status: role.status || 'active',
                userCount: role.user_count || 0,
                createdAt: role.createdAt ? format(new Date(role.createdAt), 'MMM d, yyyy') : 'Unknown',
                updatedAt: role.updatedAt ? formatDistanceToNow(new Date(role.updatedAt), { addSuffix: true }) : 'Never'
            }));

            setRoles(formattedRoles);
            setFilteredRoles(formattedRoles);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
            setError('Failed to load roles. Please try again later.');
            toast.error('Failed to load roles');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const columns = [
        {
            id: 'title',
            header: 'Role Name',
            accessor: (row: Role) => row.title,
            sortable: true,
            cell: (value: string, row: Role) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                        <ShieldCheck size={16} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{value}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{row.description}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (row: Role) => row.status,
            sortable: true,
            width: '120px',
            cell: (value: string) => (
                <StatusBadge status={value as any} size="sm" withIcon withDot={value === 'active'} />
            )
        },
        {
            id: 'createdAt',
            header: 'Created',
            accessor: (row: Role) => row.createdAt,
            sortable: true,
            cell: (value: string) => (
                <div className="flex items-center">
                    <CalendarDays size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                    <span>{value}</span>
                </div>
            )
        },
        {
            id: 'updatedAt',
            header: 'Last Updated',
            accessor: (row: Role) => row.updatedAt,
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
            accessor: (row: Role) => row.id,
            sortable: false,
            width: '100px',
            cell: (value: string, row: Role) => (
                <div className="flex items-center space-x-1">
                    <motion.button
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="View role"
                        onClick={() => handleViewRole(row)}
                    >
                        <Eye size={16} strokeWidth={1.8} />
                    </motion.button>
                </div>
            )
        }
    ];

    const handleViewRole = (role: Role) => {
        navigate(`/admin/system/roles/${role.id}`);
    };

    const handleAddRole = () => {
        navigate('/admin/system/roles/create');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredRoles(roles);
            return;
        }

        const lowercasedQuery = query.toLowerCase();

        const filtered = roles.filter(role =>
            (role.title?.toLowerCase() || '').includes(lowercasedQuery) ||
            (role.description?.toLowerCase() || '').includes(lowercasedQuery)
        );

        setFilteredRoles(filtered);

        if (query.trim() !== '' && !recentSearches.includes(query)) {
            setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
        }

        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
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
                    <h1 className="text-2xl font-semibold text-gray-800">Roles</h1>
                    <p className="text-gray-500 mt-1">Manage user roles and associated permissions</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <motion.button
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm shadow-sm"
                        whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                        whileTap={{ y: 0 }}
                        onClick={handleAddRole}
                    >
                        <Plus size={16} className="mr-2" strokeWidth={1.8} />
                        Add Role
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
                        placeholder="Search roles by name or description..."
                        onSearch={handleSearch}
                        suggestions={roles.map(role => role.title).slice(0, 5)}
                        recentSearches={recentSearches}
                        showRecentByDefault={true}
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
                    data={filteredRoles}
                    selectable={true}
                    isLoading={isLoading}
                    emptyMessage="No roles found."
                    defaultRowsPerPage={itemsPerPage}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <Pagination
                    totalItems={filteredRoles.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                    showSummary={true}
                />
            </motion.div>
        </div>
    );
};

export default roles;