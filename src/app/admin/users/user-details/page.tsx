import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Clock,
  CalendarDays,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import { userService } from '../../../../api/services/users';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'admin', 'inactive', 'new york'
  ]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getUsers();
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
        phone_number: user.phone_number
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row: any) => row.name,
      sortable: true,
      cell: (value: string, row: any) => (
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
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '120px',
      cell: (value: string) => (
        <StatusBadge status={value as any} size="sm" withIcon withDot={value === 'active'} />
      )
    },
    {
      id: 'location',
      header: 'Location',
      accessor: (row: any) => row.location,
      sortable: true
    },
    {
      id: 'lastActive',
      header: 'Last Active',
      accessor: (row: any) => row.lastActive,
      sortable: true,
      cell: (value: string) => (
        <div className="flex items-center">
          <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      accessor: (row: any) => row.joinDate,
      sortable: true,
      cell: (value: string) => (
        <div className="flex items-center">
          <CalendarDays size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'transactions',
      header: 'Transactions',
      accessor: (row: any) => row.transactions,
      sortable: true,
      width: '120px',
      cell: (value: number) => (
        <span className={`
          px-2 py-1 rounded-md text-xs font-medium
          ${value === 0
            ? 'bg-gray-100 text-gray-500'
            : value > 100
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-50 text-blue-700'}
        `}>
          {value}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '100px',
      cell: (value: string, row: any) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View user"
            onClick={() => navigate(`/admin/users/user-details/${value}`)}
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
    }
  ];

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

    if (filters.transactions) {
      const transactionCount = parseInt(filters.transactions);
      if (!isNaN(transactionCount)) {
        filtered = filtered.filter(user => user.transactions >= transactionCount);
      }
    }

    if (filters.verified) {
      filtered = filtered.filter(user => user.transactions > 10);
    }

    if (filters.joinDate && (filters.joinDate.from || filters.joinDate.to)) {
      if (filters.joinDate.from) {
        const fromDate = new Date(filters.joinDate.from);
        filtered = filtered.filter(user => {
          const userDate = new Date(user.joinDate);
          return userDate >= fromDate;
        });
      }

      if (filters.joinDate.to) {
        const toDate = new Date(filters.joinDate.to);
        filtered = filtered.filter(user => {
          const userDate = new Date(user.joinDate);
          return userDate <= toDate;
        });
      }
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    alert('Export functionality would go here');
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
          <p className="text-gray-500 mt-1">Manage user accounts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <UserPlus size={16} className="mr-2" strokeWidth={1.8} />
            Export
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
            filters={[]}
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
    </div>
  );
};

export default page;