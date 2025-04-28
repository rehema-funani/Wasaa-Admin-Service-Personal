import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  Clock,
  CalendarDays,
  FileText,
  DollarSign,
  CreditCard,
  RefreshCw,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Banknote
} from 'lucide-react';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const page = () => {
  // States for the page
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredTopUps, setFilteredTopUps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'credit card', 'failed', 'emma johnson'
  ]);

  const topUpHistoryData = [
    {
      id: 'TUP-3001',
      user: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      },
      amount: 500.00,
      fee: 15.00,
      totalAmount: 515.00,
      currency: 'USD',
      status: 'completed',
      method: 'credit_card',
      methodDetails: {
        cardType: 'Visa',
        cardNumber: '****5678',
        expiryDate: '09/27'
      },
      date: 'Apr 26, 2025',
      time: '09:32',
      notes: 'Monthly top-up',
      reference: 'REF-9876',
      receiptUrl: '/receipts/TUP-3001.pdf'
    },
    {
      id: 'TUP-3002',
      user: {
        id: '3',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com'
      },
      amount: 1200.00,
      fee: 36.00,
      totalAmount: 1236.00,
      currency: 'USD',
      status: 'completed',
      method: 'bank_transfer',
      methodDetails: {
        bank: 'Bank of America',
        accountNumber: '****2345'
      },
      date: 'Apr 25, 2025',
      time: '14:15',
      notes: 'Business account funding',
      reference: 'REF-9877',
      receiptUrl: '/receipts/TUP-3002.pdf'
    },
    {
      id: 'TUP-3003',
      user: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      },
      amount: 750.00,
      fee: 22.50,
      totalAmount: 772.50,
      currency: 'USD',
      status: 'failed',
      method: 'credit_card',
      methodDetails: {
        cardType: 'MasterCard',
        cardNumber: '****1234',
        expiryDate: '12/26'
      },
      date: 'Apr 24, 2025',
      time: '11:45',
      notes: 'Card declined',
      reference: 'REF-9878',
      receiptUrl: null,
      errorCode: 'card_declined'
    },
    {
      id: 'TUP-3004',
      user: {
        id: '7',
        name: 'Isabella Brown',
        email: 'isabella.brown@example.com'
      },
      amount: 300.00,
      fee: 9.00,
      totalAmount: 309.00,
      currency: 'USD',
      status: 'completed',
      method: 'paypal',
      methodDetails: {
        email: 'isabella.brown@gmail.com'
      },
      date: 'Apr 26, 2025',
      time: '10:20',
      notes: 'Regular top-up',
      reference: 'REF-9879',
      receiptUrl: '/receipts/TUP-3004.pdf'
    },
    {
      id: 'TUP-3005',
      user: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      },
      amount: 2000.00,
      fee: 60.00,
      totalAmount: 2060.00,
      currency: 'USD',
      status: 'processing',
      method: 'wire_transfer',
      methodDetails: {
        bank: 'Chase Bank',
        reference: 'WIRE-5432'
      },
      date: 'Apr 26, 2025',
      time: '08:35',
      notes: 'Large business deposit',
      reference: 'REF-9880',
      receiptUrl: null
    },
    {
      id: 'TUP-3006',
      user: {
        id: '13',
        name: 'Amelia Lopez',
        email: 'amelia.lopez@example.com'
      },
      amount: 450.00,
      fee: 13.50,
      totalAmount: 463.50,
      currency: 'USD',
      status: 'completed',
      method: 'credit_card',
      methodDetails: {
        cardType: 'Visa',
        cardNumber: '****7890',
        expiryDate: '04/26'
      },
      date: 'Apr 23, 2025',
      time: '16:40',
      notes: 'Account funding',
      reference: 'REF-9881',
      receiptUrl: '/receipts/TUP-3006.pdf'
    },
    {
      id: 'TUP-3007',
      user: {
        id: '15',
        name: 'Mia Hernandez',
        email: 'mia.hernandez@example.com'
      },
      amount: 800.00,
      fee: 24.00,
      totalAmount: 824.00,
      currency: 'USD',
      status: 'completed',
      method: 'bank_transfer',
      methodDetails: {
        bank: 'Wells Fargo',
        accountNumber: '****4321'
      },
      date: 'Apr 22, 2025',
      time: '13:55',
      notes: 'Monthly deposit',
      reference: 'REF-9882',
      receiptUrl: '/receipts/TUP-3007.pdf'
    },
    {
      id: 'TUP-3008',
      user: {
        id: '8',
        name: 'Ethan Miller',
        email: 'ethan.miller@example.com'
      },
      amount: 200.00,
      fee: 6.00,
      totalAmount: 206.00,
      currency: 'USD',
      status: 'completed',
      method: 'paypal',
      methodDetails: {
        email: 'ethan.miller@outlook.com'
      },
      date: 'Apr 21, 2025',
      time: '09:15',
      notes: 'Small top-up',
      reference: 'REF-9883',
      receiptUrl: '/receipts/TUP-3008.pdf'
    },
    {
      id: 'TUP-3009',
      user: {
        id: '2',
        name: 'Liam Wilson',
        email: 'liam.wilson@example.com'
      },
      amount: 650.00,
      fee: 19.50,
      totalAmount: 669.50,
      currency: 'USD',
      status: 'pending',
      method: 'bank_transfer',
      methodDetails: {
        bank: 'TD Bank',
        accountNumber: '****8765'
      },
      date: 'Apr 26, 2025',
      time: '11:30',
      notes: 'Awaiting confirmation',
      reference: 'REF-9884',
      receiptUrl: null
    },
    {
      id: 'TUP-3010',
      user: {
        id: '6',
        name: 'James Taylor',
        email: 'james.taylor@example.com'
      },
      amount: 350.00,
      fee: 10.50,
      totalAmount: 360.50,
      currency: 'USD',
      status: 'failed',
      method: 'credit_card',
      methodDetails: {
        cardType: 'Discover',
        cardNumber: '****5432',
        expiryDate: '07/25'
      },
      date: 'Apr 20, 2025',
      time: '14:50',
      notes: 'Insufficient funds',
      reference: 'REF-9885',
      receiptUrl: null,
      errorCode: 'insufficient_funds'
    },
    {
      id: 'TUP-3011',
      user: {
        id: '9',
        name: 'Sophia Garcia',
        email: 'sophia.garcia@example.com'
      },
      amount: 1500.00,
      fee: 45.00,
      totalAmount: 1545.00,
      currency: 'USD',
      status: 'completed',
      method: 'wire_transfer',
      methodDetails: {
        bank: 'Citibank',
        reference: 'WIRE-6543'
      },
      date: 'Apr 19, 2025',
      time: '10:20',
      notes: 'Large deposit',
      reference: 'REF-9886',
      receiptUrl: '/receipts/TUP-3011.pdf'
    },
    {
      id: 'TUP-3012',
      user: {
        id: '12',
        name: 'Lucas Wright',
        email: 'lucas.wright@example.com'
      },
      amount: 100.00,
      fee: 3.00,
      totalAmount: 103.00,
      currency: 'USD',
      status: 'completed',
      method: 'paypal',
      methodDetails: {
        email: 'lucas.wright@gmail.com'
      },
      date: 'Apr 18, 2025',
      time: '16:15',
      notes: 'Micro deposit',
      reference: 'REF-9887',
      receiptUrl: '/receipts/TUP-3012.pdf'
    }
  ];

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'processing', label: 'Processing' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' }
      ]
    },
    {
      id: 'method',
      label: 'Payment Method',
      type: 'multiselect' as const,
      options: [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'wire_transfer', label: 'Wire Transfer' },
        { value: 'paypal', label: 'PayPal' }
      ]
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'range' as const,
      min: 0,
      max: 2000,
      step: 100
    },
    {
      id: 'date',
      label: 'Date',
      type: 'daterange' as const
    },
    {
      id: 'hasReceipt',
      label: 'Has Receipt',
      type: 'boolean' as const
    }
  ];

  const columns = [
    {
      id: 'id',
      header: 'Top-up ID',
      accessor: (row: any) => row.id,
      sortable: true,
      width: '120px',
      cell: (value: string) => (
        <span className="font-medium text-gray-800">{value}</span>
      )
    },
    {
      id: 'user',
      header: 'User',
      accessor: (row: any) => row.user.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center font-medium text-sm mr-3">
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
      id: 'amountDetails',
      header: 'Amount',
      accessor: (row: any) => row.amount,
      sortable: true,
      width: '150px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-800">
            ${value.toFixed(2)}
            <span className="text-xs text-gray-500 ml-1">{row.currency}</span>
          </div>
          <div className="flex flex-col text-xs text-gray-500 mt-0.5">
            <span>Fee: ${row.fee.toFixed(2)}</span>
            <span>Total: ${row.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )
    },
    {
      id: 'method',
      header: 'Payment Method',
      accessor: (row: any) => row.method,
      sortable: true,
      cell: (value: string, row: any) => {
        const methodIcons: Record<string, React.ReactNode> = {
          'credit_card': <CreditCard size={14} className="text-indigo-500 mr-1.5" strokeWidth={1.8} />,
          'bank_transfer': <Banknote size={14} className="text-blue-500 mr-1.5" strokeWidth={1.8} />,
          'wire_transfer': <Banknote size={14} className="text-green-500 mr-1.5" strokeWidth={1.8} />,
          'paypal': <DollarSign size={14} className="text-blue-500 mr-1.5" strokeWidth={1.8} />
        };

        const methodLabels: Record<string, string> = {
          'credit_card': 'Credit Card',
          'bank_transfer': 'Bank Transfer',
          'wire_transfer': 'Wire Transfer',
          'paypal': 'PayPal'
        };

        let details = '';
        if (value === 'credit_card') {
          details = `${row.methodDetails.cardType} ${row.methodDetails.cardNumber}`;
        } else if (value === 'bank_transfer' || value === 'wire_transfer') {
          details = row.methodDetails.bank + (row.methodDetails.accountNumber ? ` ${row.methodDetails.accountNumber}` : '');
        } else if (value === 'paypal') {
          details = row.methodDetails.email;
        }

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              {methodIcons[value]}
              <span className="font-medium text-gray-800">{methodLabels[value]}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 ml-5">{details}</p>
          </div>
        );
      }
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '120px',
      cell: (value: string, row: any) => {
        const statusMap: Record<string, any> = {
          'completed': { color: 'green', icon: <CheckCircle size={14} strokeWidth={1.8} /> },
          'processing': { color: 'blue', icon: <RefreshCw size={14} strokeWidth={1.8} /> },
          'pending': { color: 'yellow', icon: <Clock size={14} strokeWidth={1.8} /> },
          'failed': { color: 'red', icon: <XCircle size={14} strokeWidth={1.8} /> }
        };

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize
                ${value === 'completed' ? 'bg-green-100 text-green-700' :
                  value === 'processing' ? 'bg-blue-100 text-blue-700' :
                    value === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'}
              `}>
                <span className="mr-1">{statusMap[value].icon}</span>
                {value}
              </span>
            </div>
            {row.errorCode && (
              <p className="text-xs text-red-500 mt-1 capitalize">
                {row.errorCode.replace(/_/g, ' ')}
              </p>
            )}
          </div>
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
      id: 'notes',
      header: 'Details',
      accessor: (row: any) => row.notes,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-start">
            <FileText size={14} className="text-gray-400 mr-1.5 mt-0.5" strokeWidth={1.8} />
            <span className="text-gray-600 text-sm">{value}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-5">
            Ref: {row.reference}
          </p>
        </div>
      )
    },
    {
      id: 'receipt',
      header: 'Receipt',
      accessor: (row: any) => row.receiptUrl,
      sortable: true,
      width: '100px',
      cell: (value: string | null) => (
        value ? (
          <motion.button
            className="flex items-center px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-xs"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <Download size={14} className="mr-1" strokeWidth={1.8} />
            Receipt
          </motion.button>
        ) : (
          <span className="text-gray-400 text-xs">Not available</span>
        )
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '80px',
      cell: (value: string, row: any) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View details"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          {row.status === 'failed' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-100 hover:text-blue-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Retry payment"
            >
              <RefreshCw size={16} strokeWidth={1.8} />
            </motion.button>
          )}
          {row.status === 'pending' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-yellow-100 hover:text-yellow-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Check status"
            >
              <AlertCircle size={16} strokeWidth={1.8} />
            </motion.button>
          )}
        </div>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredTopUps(topUpHistoryData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredTopUps(topUpHistoryData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = topUpHistoryData.filter(topUp =>
      topUp.id.toLowerCase().includes(lowercasedQuery) ||
      topUp.user.name.toLowerCase().includes(lowercasedQuery) ||
      topUp.user.email.toLowerCase().includes(lowercasedQuery) ||
      topUp.reference.toLowerCase().includes(lowercasedQuery) ||
      topUp.notes.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredTopUps(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...topUpHistoryData];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(topUp => filters.status.includes(topUp.status));
    }

    if (filters.method && filters.method.length > 0) {
      filtered = filtered.filter(topUp => filters.method.includes(topUp.method));
    }

    if (filters.amount && (filters.amount.from !== undefined || filters.amount.to !== undefined)) {
      if (filters.amount.from !== undefined) {
        filtered = filtered.filter(topUp => topUp.amount >= filters.amount.from);
      }
      if (filters.amount.to !== undefined) {
        filtered = filtered.filter(topUp => topUp.amount <= filters.amount.to);
      }
    }

    if (filters.hasReceipt !== undefined) {
      filtered = filtered.filter(topUp =>
        filters.hasReceipt ? topUp.receiptUrl !== null : topUp.receiptUrl === null
      );
    }

    if (filters.date && (filters.date.from || filters.date.to)) {
      // Simple date comparison - in a real app would use proper date objects
      if (filters.date.from) {
        filtered = filtered.filter(topUp => {
          const month = topUp.date.split(' ')[0];
          const fromMonth = filters.date.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.date.to) {
        filtered = filtered.filter(topUp => {
          const month = topUp.date.split(' ')[0];
          const toMonth = filters.date.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(topUp =>
        topUp.id.toLowerCase().includes(lowercasedQuery) ||
        topUp.user.name.toLowerCase().includes(lowercasedQuery) ||
        topUp.user.email.toLowerCase().includes(lowercasedQuery) ||
        topUp.reference.toLowerCase().includes(lowercasedQuery) ||
        topUp.notes.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredTopUps(filtered);
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
    setFilteredTopUps(topUpHistoryData);
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
          <h1 className="text-2xl font-semibold text-gray-800">Top-up History</h1>
          <p className="text-gray-500 mt-1">Track and manage wallet funding transactions</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            <ArrowUpRight size={16} className="mr-2" strokeWidth={1.8} />
            New Top-up
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
            placeholder="Search by ID, user, reference or notes..."
            onSearch={handleSearch}
            suggestions={[
              'TUP-3001',
              'Emma Johnson',
              'REF-9876',
              'Monthly top-up'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Top-up Filters"
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
          data={filteredTopUps}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No top-up transactions found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredTopUps.length}
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