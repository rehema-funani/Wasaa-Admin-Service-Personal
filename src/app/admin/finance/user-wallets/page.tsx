import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Wallet,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  ArrowUpRight,
  User
} from 'lucide-react';
import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredWallets, setFilteredWallets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'high balance', 'inactive', 'USD'
  ]);

  const walletsData = [
    {
      id: 'WAL-1001',
      user: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      },
      balance: 2350.75,
      pendingBalance: 150.00,
      currency: 'USD',
      status: 'active',
      type: 'personal',
      lastTransaction: '25 minutes ago',
      created: 'Jan 15, 2024',
      transactionCount: 67,
      securityLevel: 'high'
    },
    {
      id: 'WAL-1002',
      user: {
        id: '2',
        name: 'Liam Wilson',
        email: 'liam.wilson@example.com'
      },
      balance: 145.50,
      pendingBalance: 0,
      currency: 'USD',
      status: 'inactive',
      type: 'personal',
      lastTransaction: '3 days ago',
      created: 'Mar 22, 2024',
      transactionCount: 5,
      securityLevel: 'medium'
    },
    {
      id: 'WAL-1003',
      user: {
        id: '3',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com'
      },
      balance: 5721.25,
      pendingBalance: 250.00,
      currency: 'USD',
      status: 'active',
      type: 'business',
      lastTransaction: '5 hours ago',
      created: 'Nov 8, 2023',
      transactionCount: 128,
      securityLevel: 'high'
    },
    {
      id: 'WAL-1004',
      user: {
        id: '4',
        name: 'Noah Martinez',
        email: 'noah.martinez@example.com'
      },
      balance: 0,
      pendingBalance: 0,
      currency: 'USD',
      status: 'pending',
      type: 'personal',
      lastTransaction: 'Never',
      created: 'Apr 1, 2024',
      transactionCount: 0,
      securityLevel: 'low'
    },
    {
      id: 'WAL-1005',
      user: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      },
      balance: 8732.90,
      pendingBalance: 0,
      currency: 'USD',
      status: 'active',
      type: 'business',
      lastTransaction: '1 hour ago',
      created: 'Aug 17, 2023',
      transactionCount: 243,
      securityLevel: 'high'
    },
    {
      id: 'WAL-1006',
      user: {
        id: '6',
        name: 'James Taylor',
        email: 'james.taylor@example.com'
      },
      balance: 210.15,
      pendingBalance: 0,
      currency: 'USD',
      status: 'frozen',
      type: 'personal',
      lastTransaction: '2 months ago',
      created: 'Feb 3, 2023',
      transactionCount: 31,
      securityLevel: 'medium'
    },
    {
      id: 'WAL-1007',
      user: {
        id: '7',
        name: 'Isabella Brown',
        email: 'isabella.brown@example.com'
      },
      balance: 1650.50,
      pendingBalance: 75.25,
      currency: 'USD',
      status: 'active',
      type: 'personal',
      lastTransaction: '30 minutes ago',
      created: 'Jun 12, 2023',
      transactionCount: 87,
      securityLevel: 'high'
    },
    {
      id: 'WAL-1008',
      user: {
        id: '8',
        name: 'Ethan Miller',
        email: 'ethan.miller@example.com'
      },
      balance: 943.25,
      pendingBalance: 0,
      currency: 'USD',
      status: 'active',
      type: 'personal',
      lastTransaction: '12 hours ago',
      created: 'Sep 28, 2023',
      transactionCount: 54,
      securityLevel: 'medium'
    },
    {
      id: 'WAL-1009',
      user: {
        id: '9',
        name: 'Sophia Garcia',
        email: 'sophia.garcia@example.com'
      },
      balance: 325.75,
      pendingBalance: 0,
      currency: 'USD',
      status: 'inactive',
      type: 'personal',
      lastTransaction: '5 days ago',
      created: 'Dec 7, 2023',
      transactionCount: 12,
      securityLevel: 'low'
    },
    {
      id: 'WAL-1010',
      user: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      },
      balance: 6250.00,
      pendingBalance: 320.50,
      currency: 'USD',
      status: 'active',
      type: 'business',
      lastTransaction: '1 minute ago',
      created: 'Apr 30, 2023',
      transactionCount: 198,
      securityLevel: 'high'
    },
    {
      id: 'WAL-1011',
      user: {
        id: '11',
        name: 'Charlotte Lee',
        email: 'charlotte.lee@example.com'
      },
      balance: 125.00,
      pendingBalance: 50.00,
      currency: 'USD',
      status: 'processing',
      type: 'personal',
      lastTransaction: 'Now',
      created: 'May 15, 2024',
      transactionCount: 3,
      securityLevel: 'medium'
    },
    {
      id: 'WAL-1012',
      user: {
        id: '12',
        name: 'Lucas Wright',
        email: 'lucas.wright@example.com'
      },
      balance: 567.80,
      pendingBalance: 0,
      currency: 'USD',
      status: 'active',
      type: 'personal',
      lastTransaction: '3 hours ago',
      created: 'Jan 2, 2024',
      transactionCount: 27,
      securityLevel: 'high'
    },
    {
      id: 'WAL-1013',
      user: {
        id: '13',
        name: 'Amelia Lopez',
        email: 'amelia.lopez@example.com'
      },
      balance: 2175.30,
      pendingBalance: 0,
      currency: 'USD',
      status: 'active',
      type: 'business',
      lastTransaction: '45 minutes ago',
      created: 'Jul 19, 2023',
      transactionCount: 92,
      securityLevel: 'high'
    },
    {
      id: 'WAL-1014',
      user: {
        id: '14',
        name: 'Benjamin Young',
        email: 'benjamin.young@example.com'
      },
      balance: 435.65,
      pendingBalance: 0,
      currency: 'USD',
      status: 'inactive',
      type: 'personal',
      lastTransaction: '1 week ago',
      created: 'Oct 11, 2023',
      transactionCount: 18,
      securityLevel: 'medium'
    },
    {
      id: 'WAL-1015',
      user: {
        id: '15',
        name: 'Mia Hernandez',
        email: 'mia.hernandez@example.com'
      },
      balance: 4250.25,
      pendingBalance: 175.00,
      currency: 'USD',
      status: 'active',
      type: 'business',
      lastTransaction: '10 minutes ago',
      created: 'Feb 28, 2024',
      transactionCount: 156,
      securityLevel: 'high'
    }
  ];

  const filterOptions = [
    {
      id: 'type',
      label: 'Wallet Type',
      type: 'select' as const,
      options: [
        { value: 'personal', label: 'Personal' },
        { value: 'business', label: 'Business' }
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
        { value: 'frozen', label: 'Frozen' },
        { value: 'processing', label: 'Processing' }
      ]
    },
    {
      id: 'balance',
      label: 'Balance',
      type: 'range' as const,
      min: 0,
      max: 10000,
      step: 100
    },
    {
      id: 'created',
      label: 'Creation Date',
      type: 'daterange' as const
    },
    {
      id: 'securityLevel',
      label: 'Security Level',
      type: 'select' as const,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]
    },
    {
      id: 'hasPendingBalance',
      label: 'Has Pending Balance',
      type: 'boolean' as const
    }
  ];

  const columns = [
    {
      id: 'user',
      header: 'User',
      accessor: (row: any) => row.user.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            {value.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.user.email}</p>
          </div>
        </div>
      )
    },
    {
      id: 'walletDetails',
      header: 'Wallet Details',
      accessor: (row: any) => row.id,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <p className="font-medium text-gray-800">
            {value}
            <span className="ml-2 px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-600 capitalize">
              {row.type}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Created: {row.created}</p>
        </div>
      )
    },
    {
      id: 'balance',
      header: 'Balance',
      accessor: (row: any) => row.balance,
      sortable: true,
      width: '150px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-800">
            ${value.toFixed(2)}
            <span className="text-xs text-gray-500 ml-1">{row.currency}</span>
          </div>
          {row.pendingBalance > 0 && (
            <div className="text-xs text-gray-500 mt-0.5">
              Pending: ${row.pendingBalance.toFixed(2)}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '120px',
      cell: (value: string) => {
        const statusMap: Record<string, any> = {
          'active': { color: 'green', icon: true },
          'inactive': { color: 'gray', icon: false },
          'pending': { color: 'yellow', icon: true },
          'frozen': { color: 'blue', icon: true },
          'processing': { color: 'purple', icon: true }
        };
        return (
          <StatusBadge
            status={value as any}
            size="sm"
            withIcon
            withDot={value === 'active'}
            className={`text-${statusMap[value]?.color}-500`}
          />
        );
      }
    },
    {
      id: 'lastTransaction',
      header: 'Last Transaction',
      accessor: (row: any) => row.lastTransaction,
      sortable: true,
      cell: (value: string) => (
        <div className="flex items-center">
          <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'transactionCount',
      header: 'Transactions',
      accessor: (row: any) => row.transactionCount,
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
      id: 'securityLevel',
      header: 'Security',
      accessor: (row: any) => row.securityLevel,
      sortable: true,
      width: '120px',
      cell: (value: string) => {
        const securityColors: Record<string, string> = {
          'low': 'bg-red-100 text-red-700',
          'medium': 'bg-yellow-100 text-yellow-700',
          'high': 'bg-green-100 text-green-700'
        };
        return (
          <div className="flex items-center">
            <Shield size={14} className={`mr-1.5 ${value === 'high' ? 'text-green-500' :
              value === 'medium' ? 'text-yellow-500' : 'text-red-500'
              }`} strokeWidth={1.8} />
            <span className={`
              px-2 py-0.5 rounded-md text-xs font-medium capitalize
              ${securityColors[value] || 'bg-gray-100 text-gray-700'}
            `}>
              {value}
            </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '140px',
      cell: (value: string) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View wallet"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit wallet"
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View transactions"
          >
            <BarChart3 size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Freeze wallet"
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
      setFilteredWallets(walletsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredWallets(walletsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = walletsData.filter(wallet =>
      wallet.id.toLowerCase().includes(lowercasedQuery) ||
      wallet.user.name.toLowerCase().includes(lowercasedQuery) ||
      wallet.user.email.toLowerCase().includes(lowercasedQuery) ||
      wallet.type.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredWallets(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...walletsData];

    if (filters.type) {
      filtered = filtered.filter(wallet => wallet.type === filters.type);
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(wallet => filters.status.includes(wallet.status));
    }

    if (filters.securityLevel) {
      filtered = filtered.filter(wallet => wallet.securityLevel === filters.securityLevel);
    }

    if (filters.hasPendingBalance) {
      filtered = filtered.filter(wallet => wallet.pendingBalance > 0);
    }

    if (filters.balance && (filters.balance.from !== undefined || filters.balance.to !== undefined)) {
      if (filters.balance.from !== undefined) {
        filtered = filtered.filter(wallet => wallet.balance >= filters.balance.from);
      }
      if (filters.balance.to !== undefined) {
        filtered = filtered.filter(wallet => wallet.balance <= filters.balance.to);
      }
    }

    if (filters.created && (filters.created.from || filters.created.to)) {
      if (filters.created.from) {
        filtered = filtered.filter(wallet => {
          const month = wallet.created.split(' ')[0];
          const fromMonth = filters.created.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.created.to) {
        filtered = filtered.filter(wallet => {
          const month = wallet.created.split(' ')[0];
          const toMonth = filters.created.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(wallet =>
        wallet.id.toLowerCase().includes(lowercasedQuery) ||
        wallet.user.name.toLowerCase().includes(lowercasedQuery) ||
        wallet.user.email.toLowerCase().includes(lowercasedQuery) ||
        wallet.type.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredWallets(filtered);
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
    setFilteredWallets(walletsData);
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
          <h1 className="text-2xl font-semibold text-gray-800">User Wallets</h1>
          <p className="text-gray-500 mt-1">Manage balances and wallet security settings</p>
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
            <Plus size={16} className="mr-2" strokeWidth={1.8} />
            Add Wallet
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
            placeholder="Search wallets by ID, user name, email or type..."
            onSearch={handleSearch}
            suggestions={[
              'WAL-1001',
              'Emma Johnson',
              'business',
              'personal'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Wallet Filters"
            filters={[]}
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
          data={filteredWallets}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No wallets found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredWallets.length}
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