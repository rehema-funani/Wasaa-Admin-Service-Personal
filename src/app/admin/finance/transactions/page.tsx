import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  CalendarDays,
  ArrowDownLeft,
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
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'pending', 'failed', 'emma johnson'
  ]);

  const transactionsData = [
    {
      id: 'TRX-8721',
      sender: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      },
      recipient: {
        id: '3',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com'
      },
      amount: 250.00,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 26, 2025',
      time: '14:32',
      description: 'Monthly rent payment',
      reference: 'REF-7652'
    },
    {
      id: 'TRX-8722',
      sender: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      },
      recipient: {
        id: '2',
        name: 'Liam Wilson',
        email: 'liam.wilson@example.com'
      },
      amount: 75.50,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 25, 2025',
      time: '09:15',
      description: 'Dinner payment',
      reference: 'REF-7653'
    },
    {
      id: 'TRX-8723',
      sender: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      },
      recipient: {
        id: '7',
        name: 'Isabella Brown',
        email: 'isabella.brown@example.com'
      },
      amount: 1500.00,
      currency: 'USD',
      type: 'transfer',
      status: 'pending',
      date: 'Apr 26, 2025',
      time: '16:45',
      description: 'Consultation fee',
      reference: 'REF-7654'
    },
    {
      id: 'TRX-8724',
      sender: {
        id: '4',
        name: 'Noah Martinez',
        email: 'noah.martinez@example.com'
      },
      recipient: {
        id: '6',
        name: 'James Taylor',
        email: 'james.taylor@example.com'
      },
      amount: 45.99,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 24, 2025',
      time: '11:20',
      description: 'Book purchase',
      reference: 'REF-7655'
    },
    {
      id: 'TRX-8725',
      sender: {
        id: '8',
        name: 'Ethan Miller',
        email: 'ethan.miller@example.com'
      },
      recipient: {
        id: '12',
        name: 'Lucas Wright',
        email: 'lucas.wright@example.com'
      },
      amount: 350.00,
      currency: 'USD',
      type: 'transfer',
      status: 'failed',
      date: 'Apr 24, 2025',
      time: '15:10',
      description: 'Car repair',
      reference: 'REF-7656'
    },
    {
      id: 'TRX-8726',
      sender: {
        id: '2',
        name: 'Liam Wilson',
        email: 'liam.wilson@example.com'
      },
      recipient: {
        id: '9',
        name: 'Sophia Garcia',
        email: 'sophia.garcia@example.com'
      },
      amount: 120.75,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 23, 2025',
      time: '13:05',
      description: 'Shared utilities',
      reference: 'REF-7657'
    },
    {
      id: 'TRX-8727',
      sender: {
        id: '15',
        name: 'Mia Hernandez',
        email: 'mia.hernandez@example.com'
      },
      recipient: {
        id: '3',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com'
      },
      amount: 85.25,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 23, 2025',
      time: '10:30',
      description: 'Group gift contribution',
      reference: 'REF-7658'
    },
    {
      id: 'TRX-8728',
      sender: {
        id: '11',
        name: 'Charlotte Lee',
        email: 'charlotte.lee@example.com'
      },
      recipient: {
        id: '13',
        name: 'Amelia Lopez',
        email: 'amelia.lopez@example.com'
      },
      amount: 2000.00,
      currency: 'USD',
      type: 'transfer',
      status: 'processing',
      date: 'Apr 26, 2025',
      time: '09:25',
      description: 'Loan repayment',
      reference: 'REF-7659'
    },
    {
      id: 'TRX-8729',
      sender: {
        id: '14',
        name: 'Benjamin Young',
        email: 'benjamin.young@example.com'
      },
      recipient: {
        id: '8',
        name: 'Ethan Miller',
        email: 'ethan.miller@example.com'
      },
      amount: 95.50,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 22, 2025',
      time: '18:15',
      description: 'Concert tickets',
      reference: 'REF-7660'
    },
    {
      id: 'TRX-8730',
      sender: {
        id: '7',
        name: 'Isabella Brown',
        email: 'isabella.brown@example.com'
      },
      recipient: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      },
      amount: 750.00,
      currency: 'USD',
      type: 'transfer',
      status: 'pending',
      date: 'Apr 26, 2025',
      time: '11:40',
      description: 'Monthly invoice',
      reference: 'REF-7661'
    },
    {
      id: 'TRX-8731',
      sender: {
        id: '6',
        name: 'James Taylor',
        email: 'james.taylor@example.com'
      },
      recipient: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      },
      amount: 65.00,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 22, 2025',
      time: '14:50',
      description: 'Shared meal',
      reference: 'REF-7662'
    },
    {
      id: 'TRX-8732',
      sender: {
        id: '9',
        name: 'Sophia Garcia',
        email: 'sophia.garcia@example.com'
      },
      recipient: {
        id: '4',
        name: 'Noah Martinez',
        email: 'noah.martinez@example.com'
      },
      amount: 180.25,
      currency: 'USD',
      type: 'transfer',
      status: 'failed',
      date: 'Apr 21, 2025',
      time: '16:35',
      description: 'Event planning payment',
      reference: 'REF-7663'
    },
    {
      id: 'TRX-8733',
      sender: {
        id: '3',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com'
      },
      recipient: {
        id: '15',
        name: 'Mia Hernandez',
        email: 'mia.hernandez@example.com'
      },
      amount: 325.50,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 21, 2025',
      time: '10:05',
      description: 'Project payment',
      reference: 'REF-7664'
    },
    {
      id: 'TRX-8734',
      sender: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      },
      recipient: {
        id: '14',
        name: 'Benjamin Young',
        email: 'benjamin.young@example.com'
      },
      amount: 55.75,
      currency: 'USD',
      type: 'transfer',
      status: 'completed',
      date: 'Apr 20, 2025',
      time: '19:30',
      description: 'Group activity',
      reference: 'REF-7665'
    },
    {
      id: 'TRX-8735',
      sender: {
        id: '12',
        name: 'Lucas Wright',
        email: 'lucas.wright@example.com'
      },
      recipient: {
        id: '11',
        name: 'Charlotte Lee',
        email: 'charlotte.lee@example.com'
      },
      amount: 950.00,
      currency: 'USD',
      type: 'transfer',
      status: 'processing',
      date: 'Apr 26, 2025',
      time: '13:25',
      description: 'Equipment purchase',
      reference: 'REF-7666'
    }
  ];

  const filterOptions = [
    {
      id: 'type',
      label: 'Transaction Type',
      type: 'select' as const,
      options: [
        { value: 'transfer', label: 'Transfer' },
        { value: 'deposit', label: 'Deposit' },
        { value: 'withdrawal', label: 'Withdrawal' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'failed', label: 'Failed' }
      ]
    },
    {
      id: 'date',
      label: 'Transaction Date',
      type: 'daterange' as const
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'number' as const,
      min: 0,
      max: 2000,
      step: 10
    },
    {
      id: 'user',
      label: 'User',
      type: 'select' as const,
      options: [
        ...new Set([
          ...transactionsData.map(t => ({ value: t.sender.id, label: t.sender.name })),
          ...transactionsData.map(t => ({ value: t.recipient.id, label: t.recipient.name }))
        ])
      ].filter((v, i, a) => a.findIndex(t => t.value === v.value) === i)
    }
  ];

  const columns = [
    {
      id: 'id',
      header: 'Transaction ID',
      accessor: (row: any) => row.id,
      sortable: true,
      width: '130px',
      cell: (value: string) => (
        <span className="font-medium text-gray-800">{value}</span>
      )
    },
    {
      id: 'users',
      header: 'Users',
      accessor: (row: any) => row.sender.name + row.recipient.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-xs mr-2">
              {row.sender.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-gray-800">{row.sender.name}</p>
              {/* <p className="text-xs text-gray-500">{row.sender.email}</p> */}
            </div>
          </div>
          <div className="flex items-center my-1 ml-3">
            <ArrowDownLeft size={14} className="text-green-500 mr-1" strokeWidth={2} />
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-medium text-xs mr-2">
              {row.recipient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-gray-800">{row.recipient.name}</p>
              {/* <p className="text-xs text-gray-500">{row.recipient.email}</p> */}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row: any) => row.amount,
      sortable: true,
      width: '120px',
      cell: (value: number, row: any) => (
        <div className="font-medium text-gray-800">
          ${value.toFixed(2)}
          <span className="text-xs text-gray-500 ml-1">{row.currency}</span>
        </div>
      )
    },
    // {
    //   id: 'type',
    //   header: 'Type',
    //   accessor: (row: any) => row.type,
    //   sortable: true,
    //   width: '120px',
    //   cell: (value: string) => (
    //     <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
    //       {value}
    //     </span>
    //   )
    // },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '120px',
      cell: (value: string) => {
        const statusMap: Record<string, any> = {
          'completed': { color: 'green', icon: true },
          'pending': { color: 'yellow', icon: true },
          'processing': { color: 'blue', icon: true },
          'failed': { color: 'red', icon: true }
        };
        return (
          <StatusBadge
            status={value as any}
            size="sm"
            withIcon
            withDot={value === 'completed'}
            className={`status-badge-${statusMap[value]?.color}`}
          />
        );
      }
    },
    {
      id: 'date',
      header: 'Date & Time',
      accessor: (row: any) => row.date,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <CalendarDays size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span>{value}</span>
          </div>
          <div className="flex items-center mt-1">
            <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span className="text-gray-500 text-sm">{row.time}</span>
          </div>
        </div>
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
            aria-label="View transaction"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit transaction"
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete transaction"
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
      setFilteredTransactions(transactionsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredTransactions(transactionsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = transactionsData.filter(transaction =>
      transaction.id.toLowerCase().includes(lowercasedQuery) ||
      transaction.sender.name.toLowerCase().includes(lowercasedQuery) ||
      transaction.recipient.name.toLowerCase().includes(lowercasedQuery) ||
      transaction.description.toLowerCase().includes(lowercasedQuery) ||
      transaction.reference.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredTransactions(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...transactionsData];

    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(transaction => filters.status.includes(transaction.status));
    }

    if (filters.amount && (filters.amount.from !== undefined || filters.amount.to !== undefined)) {
      if (filters.amount.from !== undefined) {
        filtered = filtered.filter(transaction => transaction.amount >= filters.amount.from);
      }
      if (filters.amount.to !== undefined) {
        filtered = filtered.filter(transaction => transaction.amount <= filters.amount.to);
      }
    }

    if (filters.user) {
      filtered = filtered.filter(transaction =>
        transaction.sender.id === filters.user || transaction.recipient.id === filters.user
      );
    }

    if (filters.date && (filters.date.from || filters.date.to)) {
      if (filters.date.from) {
        filtered = filtered.filter(transaction => {
          const month = transaction.date.split(' ')[0];
          const fromMonth = filters.date.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.date.to) {
        filtered = filtered.filter(transaction => {
          const month = transaction.date.split(' ')[0];
          const toMonth = filters.date.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.id.toLowerCase().includes(lowercasedQuery) ||
        transaction.sender.name.toLowerCase().includes(lowercasedQuery) ||
        transaction.recipient.name.toLowerCase().includes(lowercasedQuery) ||
        transaction.description.toLowerCase().includes(lowercasedQuery) ||
        transaction.reference.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const getMonthNumber = (month: string) => {
    const months: Record<string, string> = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    return months[month] || '01';
  };

  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredTransactions(transactionsData);
  };

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
          <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
          <p className="text-gray-500 mt-1">Track and manage money transfers between users</p>
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
            New Transaction
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
            placeholder="Search by ID, user, description or reference..."
            onSearch={handleSearch}
            suggestions={[
              'TRX-8721',
              'Emma Johnson',
              'Rent payment',
              'REF-7652'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Transaction Filters"
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
          data={filteredTransactions}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No transactions found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredTransactions.length}
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