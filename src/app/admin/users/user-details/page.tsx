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
  CalendarDays
} from 'lucide-react';
import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const page = () => {
  // States for the page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'admin', 'inactive', 'new york'
  ]);

  const usersData = [
    {
      id: '1',
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      role: 'Admin',
      status: 'active',
      location: 'New York, USA',
      lastActive: '2 minutes ago',
      joinDate: 'Jan 15, 2024',
      transactions: 67
    },
    {
      id: '2',
      name: 'Liam Wilson',
      email: 'liam.wilson@example.com',
      role: 'User',
      status: 'inactive',
      location: 'London, UK',
      lastActive: '3 days ago',
      joinDate: 'Mar 22, 2024',
      transactions: 5
    },
    {
      id: '3',
      name: 'Olivia Davis',
      email: 'olivia.davis@example.com',
      role: 'Moderator',
      status: 'active',
      location: 'Sydney, Australia',
      lastActive: '5 hours ago',
      joinDate: 'Nov 8, 2023',
      transactions: 128
    },
    {
      id: '4',
      name: 'Noah Martinez',
      email: 'noah.martinez@example.com',
      role: 'User',
      status: 'pending',
      location: 'Toronto, Canada',
      lastActive: 'Never',
      joinDate: 'Apr 1, 2024',
      transactions: 0
    },
    {
      id: '5',
      name: 'Ava Thompson',
      email: 'ava.thompson@example.com',
      role: 'Admin',
      status: 'active',
      location: 'Berlin, Germany',
      lastActive: '1 hour ago',
      joinDate: 'Aug 17, 2023',
      transactions: 243
    },
    {
      id: '6',
      name: 'James Taylor',
      email: 'james.taylor@example.com',
      role: 'User',
      status: 'blocked',
      location: 'Paris, France',
      lastActive: '2 months ago',
      joinDate: 'Feb 3, 2023',
      transactions: 31
    },
    {
      id: '7',
      name: 'Isabella Brown',
      email: 'isabella.brown@example.com',
      role: 'Moderator',
      status: 'active',
      location: 'Tokyo, Japan',
      lastActive: '30 minutes ago',
      joinDate: 'Jun 12, 2023',
      transactions: 87
    },
    {
      id: '8',
      name: 'Ethan Miller',
      email: 'ethan.miller@example.com',
      role: 'User',
      status: 'active',
      location: 'Chicago, USA',
      lastActive: '12 hours ago',
      joinDate: 'Sep 28, 2023',
      transactions: 54
    },
    {
      id: '9',
      name: 'Sophia Garcia',
      email: 'sophia.garcia@example.com',
      role: 'User',
      status: 'inactive',
      location: 'Madrid, Spain',
      lastActive: '5 days ago',
      joinDate: 'Dec 7, 2023',
      transactions: 12
    },
    {
      id: '10',
      name: 'Mason Rodriguez',
      email: 'mason.rodriguez@example.com',
      role: 'Admin',
      status: 'active',
      location: 'San Francisco, USA',
      lastActive: '1 minute ago',
      joinDate: 'Apr 30, 2023',
      transactions: 198
    },
    {
      id: '11',
      name: 'Charlotte Lee',
      email: 'charlotte.lee@example.com',
      role: 'User',
      status: 'processing',
      location: 'Seoul, South Korea',
      lastActive: 'Now',
      joinDate: 'May 15, 2024',
      transactions: 3
    },
    {
      id: '12',
      name: 'Lucas Wright',
      email: 'lucas.wright@example.com',
      role: 'User',
      status: 'active',
      location: 'Miami, USA',
      lastActive: '3 hours ago',
      joinDate: 'Jan 2, 2024',
      transactions: 27
    },
    {
      id: '13',
      name: 'Amelia Lopez',
      email: 'amelia.lopez@example.com',
      role: 'Moderator',
      status: 'active',
      location: 'Barcelona, Spain',
      lastActive: '45 minutes ago',
      joinDate: 'Jul 19, 2023',
      transactions: 92
    },
    {
      id: '14',
      name: 'Benjamin Young',
      email: 'benjamin.young@example.com',
      role: 'User',
      status: 'inactive',
      location: 'Amsterdam, Netherlands',
      lastActive: '1 week ago',
      joinDate: 'Oct 11, 2023',
      transactions: 18
    },
    {
      id: '15',
      name: 'Mia Hernandez',
      email: 'mia.hernandez@example.com',
      role: 'Admin',
      status: 'active',
      location: 'Los Angeles, USA',
      lastActive: '10 minutes ago',
      joinDate: 'Feb 28, 2024',
      transactions: 156
    }
  ];

  const filterOptions = [
    {
      id: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Moderator', label: 'Moderator' },
        { value: 'User', label: 'User' }
      ]
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
      accessor: (row: any) => row.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (row: any) => row.role,
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
      cell: (value: string) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View user"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit user"
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete user"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredUsers(usersData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredUsers(usersData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = usersData.filter(user =>
      user.name.toLowerCase().includes(lowercasedQuery) ||
      user.email.toLowerCase().includes(lowercasedQuery) ||
      user.role.toLowerCase().includes(lowercasedQuery) ||
      user.location.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredUsers(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...usersData];

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
        filtered = filtered.filter(user => {
          const month = user.joinDate.split(' ')[0];
          const fromMonth = filters.joinDate.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.joinDate.to) {
        filtered = filtered.filter(user => {
          const month = user.joinDate.split(' ')[0];
          const toMonth = filters.joinDate.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.role.toLowerCase().includes(lowercasedQuery) ||
        user.location.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Helper to get month number
  const getMonthNumber = (month: string) => {
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    return months[month] || '01';
  };

  // Reset all filters
  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredUsers(usersData);
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
            suggestions={usersData.map(user => user.name).slice(0, 5)}
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