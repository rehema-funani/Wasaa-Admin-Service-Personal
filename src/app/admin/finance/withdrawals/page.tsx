import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  DollarSign,
  FileText,
  Banknote,
  Hash,
  Phone,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import SearchBox from '../../../../components/common/SearchBox';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import financeService from '../../../../api/services/finance';

interface Withdrawal {
  id: string;
  user_uuid: string;
  paymentMethodId: number;
  amount: number;
  phone: string;
  description: string;
  transactionCode: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  PaymentMethod?: {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  user?: {
    id: string;
    username: string;
    phone_number: string;
    email: string | null;
    profile_picture: string | null;
    preferences: any;
  };
  // Additional properties
  formattedDate?: string;
  formattedTime?: string;
  currency?: string;
}

const page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'withdrawal', 'mpesa', 'bank transfer'
  ]);

  // Helper function to format phone numbers
  const formatPhoneNumber = (phone: string | undefined | null): string => {
    if (!phone) return '';

    // For Kenyan numbers that start with 254
    if (phone.startsWith('254')) {
      return `+${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 9)} ${phone.substring(9)}`;
    }

    // Return as is if not matching our expected format
    return phone;
  };

  // Helper function to get payment method icon
  const getPaymentMethodIcon = (methodName: string | undefined): React.ReactNode => {
    if (!methodName) return <DollarSign size={14} className="text-gray-500 mr-1.5" strokeWidth={1.8} />;

    const normalizedName = methodName.toLowerCase();

    if (normalizedName.includes('mpesa') || normalizedName.includes('mobile')) {
      return <Phone size={14} className="text-green-500 mr-1.5" strokeWidth={1.8} />;
    } else if (normalizedName.includes('card') || normalizedName.includes('visa') || normalizedName.includes('master')) {
      return <CreditCard size={14} className="text-indigo-500 mr-1.5" strokeWidth={1.8} />;
    } else if (normalizedName.includes('bank') || normalizedName.includes('transfer')) {
      return <Banknote size={14} className="text-blue-500 mr-1.5" strokeWidth={1.8} />;
    } else {
      return <DollarSign size={14} className="text-gray-500 mr-1.5" strokeWidth={1.8} />;
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string): { date: string; time: string } => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    } catch (error) {
      return { date: 'Invalid Date', time: '--:--' };
    }
  };

  // Fetch withdrawal requests from API
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setIsLoading(true);
        const response = await financeService.getAllWithdrawals();

        // Check if the response has the expected structure
        const data = response?.withdrawals || response?.data?.withdrawals || [];

        // Process data to add user info if not available
        const processedData = data.map((withdrawal: Withdrawal) => {
          if (!withdrawal.user) {
            withdrawal.user = {
              id: withdrawal.user_uuid || 'unknown',
              username: 'User #' + (withdrawal.user_uuid?.substring(0, 5) || 'Unknown'),
              phone_number: withdrawal.phone || 'No phone available',
              email: null,
              profile_picture: null,
              preferences: null
            };
          }

          return {
            ...withdrawal,
            amount: Number(withdrawal.amount),
            formattedDate: formatDateTime(withdrawal.createdAt).date,
            formattedTime: formatDateTime(withdrawal.createdAt).time,
            currency: 'KES' // Default currency
          };
        });

        setWithdrawals(processedData);
        setFilteredWithdrawals(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching withdrawals:', err);
        setError('Failed to load withdrawal data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // Define table columns
  const columns = [
    {
      id: 'id',
      header: 'Withdrawal ID',
      accessor: (row: Withdrawal) => row.id,
      sortable: true,
      width: '130px',
      cell: (value: string) => (
        <div className="flex items-center">
          <Hash size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span className="font-medium text-gray-800 text-sm">{value.substring(0, 8)}...</span>
        </div>
      )
    },
    {
      id: 'user',
      header: 'User',
      accessor: (row: Withdrawal) => row.user?.username || '',
      sortable: true,
      width: '180px',
      cell: (value: string, row: Withdrawal) => {
        // Get the first letter of the username as initial
        const initial = (value && value.length > 0) ? value[0].toUpperCase() : 'U';

        return (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-medium text-sm mr-3">
              {initial}
            </div>
            <div>
              <p className="font-medium text-gray-800">{value || 'Unknown User'}</p>
              <p className="text-xs text-gray-500">{formatPhoneNumber(row.user?.phone_number || row.phone)}</p>
            </div>
          </div>
        );
      }
    },
    {
      id: 'method',
      header: 'Payment Method',
      accessor: (row: Withdrawal) => row.PaymentMethod?.name || '',
      sortable: true,
      width: '150px',
      cell: (value: string, row: Withdrawal) => {
        const icon = getPaymentMethodIcon(value);

        return (
          <div className="flex items-center">
            {icon}
            <span className="font-medium text-gray-800">{value || 'Unknown Method'}</span>
          </div>
        );
      }
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row: Withdrawal) => row.amount || 0,
      sortable: true,
      width: '130px',
      cell: (value: number, row: Withdrawal) => {
        const currency = row.currency || 'KES';

        return (
          <div className="font-medium text-gray-800">
            <div className="flex items-center">
              <DollarSign size={14} strokeWidth={1.8} className="text-gray-400 mr-0.5" />
              <span>{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-xs text-gray-500 ml-1">{currency}</span>
            </div>
          </div>
        );
      }
    },
    {
      id: 'transaction',
      header: 'Transaction',
      accessor: (row: Withdrawal) => row.transactionCode || '',
      sortable: true,
      width: '150px',
      cell: (value: string) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-800 text-sm">{value || 'N/A'}</span>
        </div>
      )
    },
    {
      id: 'description',
      header: 'Description',
      accessor: (row: Withdrawal) => row.description || '',
      sortable: true,
      cell: (value: string, row: Withdrawal) => {
        // Extract account information from metadata if available
        let accountInfo = '';
        if (row.metadata && row.metadata.account) {
          accountInfo = `Account: ${row.metadata.account}`;
        }

        return (
          <div className="flex items-start">
            <FileText size={14} className="text-gray-400 mr-1.5 mt-0.5" strokeWidth={1.8} />
            <div>
              <p className="text-gray-800 text-sm">{value || 'No description'}</p>
              {accountInfo && (
                <p className="text-xs text-gray-500 mt-0.5">{accountInfo}</p>
              )}
            </div>
          </div>
        );
      }
    },
    {
      id: 'date',
      header: 'Date & Time',
      accessor: (row: Withdrawal) => row.createdAt || '',
      sortable: true,
      width: '150px',
      cell: (value: string) => {
        const { date, time } = formatDateTime(value);

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <CalendarDays size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center mt-1">
              <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
              <span className="text-gray-500 text-sm">{time}</span>
            </div>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Withdrawal) => row.id,
      sortable: false,
      width: '80px',
      cell: (value: string) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View details"
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
      setFilteredWithdrawals(withdrawals);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = withdrawals.filter(withdrawal => {
      const id = withdrawal.id?.toLowerCase() || '';
      const description = withdrawal.description?.toLowerCase() || '';
      const username = withdrawal.user?.username?.toLowerCase() || '';
      const phone = withdrawal.user?.phone_number?.toLowerCase() || withdrawal.phone?.toLowerCase() || '';
      const paymentMethod = withdrawal.PaymentMethod?.name?.toLowerCase() || '';
      const transactionCode = withdrawal.transactionCode?.toLowerCase() || '';

      return id.includes(lowercasedQuery) ||
        description.includes(lowercasedQuery) ||
        username.includes(lowercasedQuery) ||
        phone.includes(lowercasedQuery) ||
        paymentMethod.includes(lowercasedQuery) ||
        transactionCode.includes(lowercasedQuery);
    });

    setFilteredWithdrawals(filtered);

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

  const handleExport = () => {
    if (filteredWithdrawals.length === 0) {
      alert('No withdrawal data to export');
      return;
    }
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
          <h1 className="text-2xl font-semibold text-gray-800">Withdrawals</h1>
          <p className="text-gray-500 mt-1">Track and manage user withdrawals</p>
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
            New Withdrawal
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SearchBox
          placeholder="Search by ID, username, phone, transaction code..."
          onSearch={handleSearch}
          suggestions={[
            'Mpesa',
            '254712',
            'TXN-',
            'Withdrawal'
          ]}
          recentSearches={recentSearches}
          showRecentByDefault={true}
        />
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredWithdrawals}
            selectable={true}
            isLoading={isLoading}
            emptyMessage="No withdrawals found. Try adjusting your search terms."
            defaultRowsPerPage={itemsPerPage}
          />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredWithdrawals.length}
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