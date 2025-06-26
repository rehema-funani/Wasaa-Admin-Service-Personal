import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Eye,
  Clock,
  FileText,
  DollarSign,
  CreditCard,
  Banknote,
  Hash,
  Plus,
  Phone,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
  Filter,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import financeService from '../../../../api/services/finance';

interface WalletTopUp {
  id: string;
  user_uuid: string;
  paymentMethodId: number;
  amount: number;
  phone: string;
  description: string | null;
  transactionCode: string | null;
  status: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: {
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
  formattedDate?: string;
  formattedTime?: string;
  fee?: number;
  totalAmount?: number;
  currency?: string;
}

type SortConfig = {
  key: keyof WalletTopUp | 'paymentMethod.name' | '';
  direction: 'asc' | 'desc';
};

const TopUpsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [topUps, setTopUps] = useState<WalletTopUp[]>([]);
  const [filteredTopUps, setFilteredTopUps] = useState<WalletTopUp[]>([]);
  const [displayedTopUps, setDisplayedTopUps] = useState<WalletTopUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'desc'
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'deposit', 'mpesa', 'card'
  ]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const formatPhoneNumber = (phone: string | undefined | null): string => {
    if (!phone) return '';

    if (phone.startsWith('254')) {
      return `+${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6, 9)} ${phone.substring(9)}`;
    }
    return phone;
  };

  const getPaymentMethodIcon = (methodName: string | undefined): React.ReactNode => {
    if (!methodName) return <DollarSign size={14} className="text-gray-500" strokeWidth={1.8} />;

    const normalizedName = methodName.toLowerCase();

    if (normalizedName.includes('mpesa') || normalizedName.includes('mobile')) {
      return <Phone size={14} className="text-green-500" strokeWidth={1.8} />;
    } else if (normalizedName.includes('card') || normalizedName.includes('visa') || normalizedName.includes('master')) {
      return <CreditCard size={14} className="text-primary-500" strokeWidth={1.8} />;
    } else if (normalizedName.includes('bank') || normalizedName.includes('transfer')) {
      return <Banknote size={14} className="text-primary-500" strokeWidth={1.8} />;
    } else {
      return <DollarSign size={14} className="text-gray-500" strokeWidth={1.8} />;
    }
  };

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

  useEffect(() => {
    fetchTopUps();
  }, []);

  useEffect(() => {
    // Update pagination data whenever filtered data changes
    setTotalItems(filteredTopUps.length);
    setTotalPages(Math.ceil(filteredTopUps.length / itemsPerPage));

    // Update displayed data based on current page and items per page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedTopUps(filteredTopUps.slice(startIndex, endIndex));
  }, [filteredTopUps, currentPage, itemsPerPage]);

  useEffect(() => {
    // Apply sorting when sortConfig changes
    if (sortConfig.key) {
      sortData();
    }
  }, [sortConfig]);

  const fetchTopUps = async () => {
    try {
      setIsLoading(true);
      const response = await financeService.getAllTopUps();

      const data = response || [];

      const processedData = data.map((deposit: any) => {
        if (!deposit.user) {
          deposit.user = {
            id: deposit.user_uuid || 'unknown',
            username: 'User #' + (deposit.user_uuid?.substring(0, 5) || 'Unknown'),
            phone_number: deposit.phone || 'No phone available'
          };
        }

        return {
          ...deposit,
          amount: Number(deposit.amount),
          formattedDate: formatDateTime(deposit.createdAt).date,
          formattedTime: formatDateTime(deposit.createdAt).time,
          currency: 'KES' // Default currency
        };
      });

      setTopUps(processedData);
      setFilteredTopUps(processedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching deposits:', err);
      setError('Failed to load deposit history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);

    // Apply both search query and status filter
    filterData(query, statusFilter);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    filterData('', statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);

    // Apply both search query and status filter
    filterData(searchQuery, status);
  };

  const filterData = (query: string, status: string) => {
    let filtered = [...topUps];

    // Apply search filter
    if (query.trim() !== '') {
      const lowercasedQuery = query.toLowerCase();

      filtered = filtered.filter(topUp => {
        const id = topUp.id?.toLowerCase() || '';
        const description = topUp.description?.toLowerCase() || '';
        const username = topUp.user?.username?.toLowerCase() || '';
        const phone = topUp.user?.phone_number?.toLowerCase() || topUp.phone?.toLowerCase() || '';
        const paymentMethodName = topUp.paymentMethod?.name?.toLowerCase() || '';
        const transactionCode = topUp.transactionCode?.toLowerCase() || '';

        return id.includes(lowercasedQuery) ||
          (description && description.includes(lowercasedQuery)) ||
          username.includes(lowercasedQuery) ||
          phone.includes(lowercasedQuery) ||
          paymentMethodName.includes(lowercasedQuery) ||
          transactionCode.includes(lowercasedQuery);
      });
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(topUp =>
        topUp.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredTopUps(filtered);
  };

  const sortData = () => {
    if (!sortConfig.key) return;

    const sortedData = [...filteredTopUps].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Handle nested properties like 'paymentMethod.name'
      if (sortConfig.key === 'paymentMethod.name') {
        aValue = a.paymentMethod?.name;
        bValue = b.paymentMethod?.name;
      } else {
        aValue = a[sortConfig.key as keyof WalletTopUp];
        bValue = b[sortConfig.key as keyof WalletTopUp];
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numeric comparison
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredTopUps(sortedData);
  };

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (filteredTopUps.length === 0) {
      alert('No deposit data to export');
      return;
    }
    alert('Export functionality would go here');
  };

  const renderSortIcon = (key: SortConfig['key']) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    }

    return sortConfig.direction === 'asc'
      ? <ChevronUp size={14} className="ml-1 text-primary-500" />
      : <ChevronDown size={14} className="ml-1 text-primary-500" />;
  };

  const renderStatusBadge = (status: string) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-700';
    let icon = null;

    if (statusLower === 'completed' || statusLower === 'success') {
      bgColor = 'bg-green-50';
      textColor = 'text-green-700';
      icon = <CheckCircle size={12} className="mr-1 text-green-500" />;
    } else if (statusLower === 'pending') {
      bgColor = 'bg-amber-50';
      textColor = 'text-amber-700';
      icon = <Clock size={12} className="mr-1 text-amber-500" />;
    } else if (statusLower === 'failed' || statusLower === 'error') {
      bgColor = 'bg-red-50';
      textColor = 'text-red-700';
      icon = <AlertTriangle size={12} className="mr-1 text-red-500" />;
    }

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </div>
    );
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
          <h1 className="text-2xl font-semibold text-gray-800">Deposit History</h1>
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
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0 }}
          >
            <Plus size={16} className="mr-2" strokeWidth={1.8} />
            New Deposit
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="mb-6 flex flex-wrap gap-4 items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by ID, user, phone, payment method..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex-shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Advanced Filter Button */}
        <button className="flex items-center px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm hover:bg-gray-50 transition-all">
          <Filter size={16} className="mr-2" strokeWidth={1.8} />
          Filters
        </button>
      </motion.div>

      <motion.div
        className="mb-6 relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {error ? (
          <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{error}</h3>
            <p className="text-gray-500 mb-6">We couldn't load your deposit data. Please try again.</p>
            <button
              onClick={fetchTopUps}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading deposit data...</p>
              </div>
            ) : filteredTopUps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">No deposits found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchQuery ?
                    `We couldn't find any deposits matching "${searchQuery}". Try adjusting your search terms.` :
                    "There are no deposits in the system yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-light">
                          #
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none"
                            onClick={() => handleSort('id')}
                          >
                            ID {renderSortIcon('id')}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </span>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none"
                            onClick={() => handleSort('paymentMethod.name')}
                          >
                            Method {renderSortIcon('paymentMethod.name')}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none"
                            onClick={() => handleSort('amount')}
                          >
                            Amount {renderSortIcon('amount')}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </span>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none"
                            onClick={() => handleSort('status')}
                          >
                            Status {renderSortIcon('status')}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <button
                            className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none"
                            onClick={() => handleSort('createdAt')}
                          >
                            Date {renderSortIcon('createdAt')}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <AnimatePresence>
                        {displayedTopUps.map((topUp, index) => (
                          <motion.tr
                            key={topUp.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(topUp.id) ? 'bg-primary-50' : ''
                              }`}
                          >
                            <td className="px-4 py-4 font-light">
                              {index + 1}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <Hash size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                                <span className="text-sm font-medium text-gray-800">{topUp.id.substring(0, 8)}...</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-medium text-sm mr-2">
                                  {(topUp.user?.username?.charAt(0) || 'U').toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{topUp.user?.username || 'Unknown User'}</p>
                                  <p className="text-xs text-gray-500">{formatPhoneNumber(topUp.user?.phone_number || topUp.phone)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-2">
                                  {getPaymentMethodIcon(topUp.paymentMethod?.name)}
                                </div>
                                <span className="text-sm text-gray-800">{topUp.paymentMethod?.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-800">
                                {topUp.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className="text-xs text-gray-500 ml-1">{topUp.currency}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="max-w-[200px] truncate text-sm text-gray-800">
                                {topUp.description || <span className="text-gray-400 italic">No description</span>}
                              </div>
                              {topUp.transactionCode && (
                                <div className="text-xs text-gray-500 mt-1">{topUp.transactionCode}</div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {renderStatusBadge(topUp.status)}
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-800">{topUp.formattedDate}</div>
                              <div className="text-xs text-gray-500">{topUp.formattedTime}</div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                <Eye size={16} strokeWidth={1.8} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>
                      Showing <span className="font-medium text-gray-700">{Math.min(1 + (currentPage - 1) * itemsPerPage, totalItems)}</span> to <span className="font-medium text-gray-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-gray-700">{totalItems}</span> deposits
                    </span>

                    <div className="ml-4 md:ml-6">
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="ml-2 text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronsLeft size={16} />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Display pages around the current page
                        let pageToShow = i + 1;
                        if (totalPages > 5) {
                          if (currentPage > 3) {
                            pageToShow = currentPage - 2 + i;
                          }
                          if (pageToShow > totalPages) {
                            pageToShow = totalPages - (4 - i);
                          }
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(pageToShow)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${currentPage === pageToShow
                              ? 'bg-primary-50 text-primary-600 font-medium border border-primary-200'
                              : 'text-gray-500 hover:bg-gray-50 border border-gray-200'
                              }`}
                          >
                            {pageToShow}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TopUpsPage;
