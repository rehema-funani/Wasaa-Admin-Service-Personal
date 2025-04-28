import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  AlertCircle,
  DollarSign,
  FileText,
  ArrowDownRight,
  CreditCard,
  Banknote,
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
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'pending', 'high priority', 'bank transfer'
  ]);

  const withdrawalRequestsData = [
    {
      id: 'WDR-4501',
      user: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      },
      amount: 500.00,
      fee: 5.00,
      currency: 'USD',
      status: 'pending',
      priority: 'medium',
      method: 'bank_transfer',
      methodDetails: {
        bank: 'Chase Bank',
        accountNumber: '****3456',
        routingNumber: '****7890'
      },
      requestDate: 'Apr 26, 2025',
      requestTime: '14:32',
      expectedDate: 'Apr 28, 2025',
      notes: 'Monthly withdrawal',
      reasonCode: null
    },
    {
      id: 'WDR-4502',
      user: {
        id: '3',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com'
      },
      amount: 1200.00,
      fee: 12.00,
      currency: 'USD',
      status: 'completed',
      priority: 'standard',
      method: 'bank_transfer',
      methodDetails: {
        bank: 'Bank of America',
        accountNumber: '****2345',
        routingNumber: '****6789'
      },
      requestDate: 'Apr 24, 2025',
      requestTime: '09:15',
      expectedDate: 'Apr 26, 2025',
      notes: 'Business expense reimbursement',
      reasonCode: null
    },
    {
      id: 'WDR-4503',
      user: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      },
      amount: 2500.00,
      fee: 25.00,
      currency: 'USD',
      status: 'pending',
      priority: 'high',
      method: 'wire_transfer',
      methodDetails: {
        bank: 'Citibank',
        accountNumber: '****8765',
        swiftCode: 'CITIUS33'
      },
      requestDate: 'Apr 26, 2025',
      requestTime: '11:45',
      expectedDate: 'Apr 29, 2025',
      notes: 'Urgent vendor payment',
      reasonCode: null
    },
    {
      id: 'WDR-4504',
      user: {
        id: '7',
        name: 'Isabella Brown',
        email: 'isabella.brown@example.com'
      },
      amount: 350.00,
      fee: 3.50,
      currency: 'USD',
      status: 'rejected',
      priority: 'standard',
      method: 'bank_transfer',
      methodDetails: {
        bank: 'Wells Fargo',
        accountNumber: '****1234',
        routingNumber: '****5678'
      },
      requestDate: 'Apr 23, 2025',
      requestTime: '15:20',
      expectedDate: 'Apr 25, 2025',
      notes: 'Personal withdrawal',
      reasonCode: 'insufficient_funds'
    },
    {
      id: 'WDR-4505',
      user: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      },
      amount: 1750.00,
      fee: 17.50,
      currency: 'USD',
      status: 'processing',
      priority: 'medium',
      method: 'debit_card',
      methodDetails: {
        cardType: 'Visa',
        cardNumber: '****7890',
        expiryDate: '06/27'
      },
      requestDate: 'Apr 25, 2025',
      requestTime: '10:35',
      expectedDate: 'Apr 26, 2025',
      notes: 'Monthly profit withdrawal',
      reasonCode: null
    },
    {
      id: 'WDR-4506',
      user: {
        id: '13',
        name: 'Amelia Lopez',
        email: 'amelia.lopez@example.com'
      },
      amount: 900.00,
      fee: 9.00,
      currency: 'USD',
      status: 'completed',
      priority: 'standard',
      method: 'paypal',
      methodDetails: {
        email: 'amelia.lopez@gmail.com'
      },
      requestDate: 'Apr 22, 2025',
      requestTime: '13:40',
      expectedDate: 'Apr 24, 2025',
      notes: 'Freelance payment',
      reasonCode: null
    },
    {
      id: 'WDR-4507',
      user: {
        id: '15',
        name: 'Mia Hernandez',
        email: 'mia.hernandez@example.com'
      },
      amount: 3200.00,
      fee: 32.00,
      currency: 'USD',
      status: 'pending',
      priority: 'high',
      method: 'wire_transfer',
      methodDetails: {
        bank: 'TD Bank',
        accountNumber: '****6543',
        swiftCode: 'TDOMUS44'
      },
      requestDate: 'Apr 26, 2025',
      requestTime: '09:55',
      expectedDate: 'Apr 30, 2025',
      notes: 'Business expense withdrawal',
      reasonCode: null
    },
    {
      id: 'WDR-4508',
      user: {
        id: '8',
        name: 'Ethan Miller',
        email: 'ethan.miller@example.com'
      },
      amount: 150.00,
      fee: 1.50,
      currency: 'USD',
      status: 'completed',
      priority: 'low',
      method: 'debit_card',
      methodDetails: {
        cardType: 'MasterCard',
        cardNumber: '****4321',
        expiryDate: '11/26'
      },
      requestDate: 'Apr 21, 2025',
      requestTime: '16:15',
      expectedDate: 'Apr 22, 2025',
      notes: 'Small expense reimbursement',
      reasonCode: null
    },
    {
      id: 'WDR-4509',
      user: {
        id: '12',
        name: 'Lucas Wright',
        email: 'lucas.wright@example.com'
      },
      amount: 450.00,
      fee: 4.50,
      currency: 'USD',
      status: 'cancelled',
      priority: 'standard',
      method: 'bank_transfer',
      methodDetails: {
        bank: 'PNC Bank',
        accountNumber: '****9876',
        routingNumber: '****5432'
      },
      requestDate: 'Apr 24, 2025',
      requestTime: '11:30',
      expectedDate: 'Apr 26, 2025',
      notes: 'Cancelled by user',
      reasonCode: 'user_cancelled'
    },
    {
      id: 'WDR-4510',
      user: {
        id: '2',
        name: 'Liam Wilson',
        email: 'liam.wilson@example.com'
      },
      amount: 75.00,
      fee: 0.75,
      currency: 'USD',
      status: 'completed',
      priority: 'low',
      method: 'paypal',
      methodDetails: {
        email: 'liam.wilson@hotmail.com'
      },
      requestDate: 'Apr 20, 2025',
      requestTime: '14:50',
      expectedDate: 'Apr 21, 2025',
      notes: 'Small withdrawal',
      reasonCode: null
    },
    {
      id: 'WDR-4511',
      user: {
        id: '6',
        name: 'James Taylor',
        email: 'james.taylor@example.com'
      },
      amount: 1100.00,
      fee: 11.00,
      currency: 'USD',
      status: 'on_hold',
      priority: 'medium',
      method: 'wire_transfer',
      methodDetails: {
        bank: 'Santander',
        accountNumber: '****3456',
        swiftCode: 'SVRNUS33'
      },
      requestDate: 'Apr 23, 2025',
      requestTime: '10:20',
      expectedDate: 'Apr 27, 2025',
      notes: 'On hold pending verification',
      reasonCode: 'verification_needed'
    },
    {
      id: 'WDR-4512',
      user: {
        id: '9',
        name: 'Sophia Garcia',
        email: 'sophia.garcia@example.com'
      },
      amount: 250.00,
      fee: 2.50,
      currency: 'USD',
      status: 'pending',
      priority: 'standard',
      method: 'debit_card',
      methodDetails: {
        cardType: 'Visa',
        cardNumber: '****1234',
        expiryDate: '08/26'
      },
      requestDate: 'Apr 25, 2025',
      requestTime: '13:10',
      expectedDate: 'Apr 26, 2025',
      notes: 'Regular withdrawal',
      reasonCode: null
    }
  ];

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'on_hold', label: 'On Hold' }
      ]
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'select' as const,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'standard', label: 'Standard' },
        { value: 'low', label: 'Low' }
      ]
    },
    {
      id: 'method',
      label: 'Withdrawal Method',
      type: 'multiselect' as const,
      options: [
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'wire_transfer', label: 'Wire Transfer' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'paypal', label: 'PayPal' }
      ]
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'range' as const,
      min: 0,
      max: 5000,
      step: 100
    },
    {
      id: 'requestDate',
      label: 'Request Date',
      type: 'daterange' as const
    }
  ];

  const columns = [
    {
      id: 'id',
      header: 'Request ID',
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-medium text-sm mr-3">
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
      id: 'amount',
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
          <div className="text-xs text-gray-500 mt-0.5">
            Fee: ${row.fee.toFixed(2)}
          </div>
        </div>
      )
    },
    {
      id: 'method',
      header: 'Method',
      accessor: (row: any) => row.method,
      sortable: true,
      cell: (value: string, row: any) => {
        const methodIcons: Record<string, React.ReactNode> = {
          'bank_transfer': <Banknote size={14} className="text-blue-500 mr-1.5" strokeWidth={1.8} />,
          'wire_transfer': <Banknote size={14} className="text-indigo-500 mr-1.5" strokeWidth={1.8} />,
          'debit_card': <CreditCard size={14} className="text-green-500 mr-1.5" strokeWidth={1.8} />,
          'paypal': <DollarSign size={14} className="text-blue-500 mr-1.5" strokeWidth={1.8} />
        };

        const methodLabels: Record<string, string> = {
          'bank_transfer': 'Bank Transfer',
          'wire_transfer': 'Wire Transfer',
          'debit_card': 'Debit Card',
          'paypal': 'PayPal'
        };

        let details = '';
        if (value === 'bank_transfer' || value === 'wire_transfer') {
          details = row.methodDetails.bank;
        } else if (value === 'debit_card') {
          details = `${row.methodDetails.cardType} ${row.methodDetails.cardNumber}`;
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
          'pending': { color: 'yellow', icon: true },
          'processing': { color: 'blue', icon: true },
          'completed': { color: 'green', icon: true },
          'rejected': { color: 'red', icon: true },
          'cancelled': { color: 'gray', icon: false },
          'on_hold': { color: 'purple', icon: true }
        };

        return (
          <div className="flex flex-col">
            <StatusBadge
              status={value as any}
              size="sm"
              withIcon
              withDot={value === 'completed'}
              className={`status-badge-${statusMap[value]?.color}`}
            />
            {row.reasonCode && (
              <p className="text-xs text-red-500 mt-1 capitalize">
                {row.reasonCode.replace(/_/g, ' ')}
              </p>
            )}
          </div>
        );
      }
    },
    {
      id: 'priority',
      header: 'Priority',
      accessor: (row: any) => row.priority,
      sortable: true,
      width: '100px',
      cell: (value: string) => {
        const priorityColors: Record<string, string> = {
          'high': 'bg-red-100 text-red-700',
          'medium': 'bg-yellow-100 text-yellow-700',
          'standard': 'bg-blue-100 text-blue-700',
          'low': 'bg-gray-100 text-gray-700'
        };

        return (
          <span className={`
            px-2 py-1 rounded-md text-xs font-medium capitalize
            ${priorityColors[value] || 'bg-gray-100 text-gray-700'}
          `}>
            {value}
          </span>
        );
      }
    },
    {
      id: 'dates',
      header: 'Dates',
      accessor: (row: any) => row.requestDate,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <CalendarDays size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span className="text-gray-800">Requested: {value}</span>
          </div>
          <div className="flex items-center mt-1">
            <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
            <span className="text-gray-500 text-sm">{row.requestTime}</span>
          </div>
          <div className="flex items-center mt-1">
            <ArrowDownRight size={14} className="text-green-500 mr-1.5" strokeWidth={1.8} />
            <span className="text-gray-600 text-sm">Expected: {row.expectedDate}</span>
          </div>
        </div>
      )
    },
    {
      id: 'notes',
      header: 'Notes',
      accessor: (row: any) => row.notes,
      sortable: true,
      width: '200px',
      cell: (value: string) => (
        <div className="flex items-start">
          <FileText size={14} className="text-gray-400 mr-1.5 mt-0.5" strokeWidth={1.8} />
          <span className="text-gray-600 text-sm">{value}</span>
        </div>
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
            aria-label="View details"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          {row.status === 'pending' && (
            <>
              <motion.button
                className="p-1.5 rounded-lg text-gray-500 hover:bg-green-100 hover:text-green-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Approve request"
              >
                <CheckCircle size={16} strokeWidth={1.8} />
              </motion.button>
              <motion.button
                className="p-1.5 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Reject request"
              >
                <XCircle size={16} strokeWidth={1.8} />
              </motion.button>
            </>
          )}
          {(row.status === 'on_hold' || row.status === 'processing') && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-yellow-100 hover:text-yellow-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Flag for review"
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
      setFilteredRequests(withdrawalRequestsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredRequests(withdrawalRequestsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = withdrawalRequestsData.filter(request =>
      request.id.toLowerCase().includes(lowercasedQuery) ||
      request.user.name.toLowerCase().includes(lowercasedQuery) ||
      request.user.email.toLowerCase().includes(lowercasedQuery) ||
      request.notes.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredRequests(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...withdrawalRequestsData];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(request => filters.status.includes(request.status));
    }

    if (filters.priority) {
      filtered = filtered.filter(request => request.priority === filters.priority);
    }

    if (filters.method && filters.method.length > 0) {
      filtered = filtered.filter(request => filters.method.includes(request.method));
    }

    if (filters.amount && (filters.amount.from !== undefined || filters.amount.to !== undefined)) {
      if (filters.amount.from !== undefined) {
        filtered = filtered.filter(request => request.amount >= filters.amount.from);
      }
      if (filters.amount.to !== undefined) {
        filtered = filtered.filter(request => request.amount <= filters.amount.to);
      }
    }

    if (filters.requestDate && (filters.requestDate.from || filters.requestDate.to)) {
      // Simple date comparison - in a real app would use proper date objects
      if (filters.requestDate.from) {
        filtered = filtered.filter(request => {
          const month = request.requestDate.split(' ')[0];
          const fromMonth = filters.requestDate.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.requestDate.to) {
        filtered = filtered.filter(request => {
          const month = request.requestDate.split(' ')[0];
          const toMonth = filters.requestDate.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(request =>
        request.id.toLowerCase().includes(lowercasedQuery) ||
        request.user.name.toLowerCase().includes(lowercasedQuery) ||
        request.user.email.toLowerCase().includes(lowercasedQuery) ||
        request.notes.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredRequests(filtered);
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
    setFilteredRequests(withdrawalRequestsData);
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
          <h1 className="text-2xl font-semibold text-gray-800">Withdrawal Requests</h1>
          <p className="text-gray-500 mt-1">Process and manage user withdrawal requests</p>
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
            placeholder="Search by ID, user, email or notes..."
            onSearch={handleSearch}
            suggestions={[
              'WDR-4501',
              'Emma Johnson',
              'pending',
              'high priority'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Withdrawal Filters"
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
          data={filteredRequests}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No withdrawal requests found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredRequests.length}
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