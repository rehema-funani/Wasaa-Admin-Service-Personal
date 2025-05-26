import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  Hash,
  Phone,
  CreditCard,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Building2,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Withdrawal } from '../../../../types/finance';
import financeService from '../../../../api/services/finance';

const FinancialWithdrawalsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const getWithdrawals = async () => {
    const response = await financeService.getAllWithdrawalRequests();
    setWithdrawals(response.withdrawals || []);
    setFilteredWithdrawals(response.withdrawals || []);
    setIsLoading(false);
  };

  useEffect(() => {
    getWithdrawals();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
    };
  };

  const getPaymentMethodIcon = (methodName: string) => {
    const normalizedName = methodName.toLowerCase();
    if (normalizedName.includes('mpesa') || normalizedName.includes('mobile')) {
      return <Phone size={16} className="text-green-600" />;
    } else if (normalizedName.includes('card') || normalizedName.includes('visa')) {
      return <CreditCard size={16} className="text-blue-600" />;
    } else if (normalizedName.includes('bank')) {
      return <Building2 size={16} className="text-indigo-600" />;
    }
    return <DollarSign size={16} className="text-gray-600" />;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredWithdrawals(withdrawals);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = withdrawals.filter(withdrawal =>
      withdrawal.id.toLowerCase().includes(lowercaseQuery) ||
      withdrawal.user?.username.toLowerCase().includes(lowercaseQuery) ||
      withdrawal.phone.toLowerCase().includes(lowercaseQuery) ||
      withdrawal.description.toLowerCase().includes(lowercaseQuery) ||
      withdrawal.transactionCode?.toLowerCase().includes(lowercaseQuery)
    );

    setFilteredWithdrawals(filtered);
    setCurrentPage(1);
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map(row => row.id)));
    }
  };

  // Sort data
  const sortedData = [...filteredWithdrawals].sort((a, b) => {
    let aValue = a[sortField as keyof Withdrawal];
    let bValue = b[sortField as keyof Withdrawal];

    if (sortField === 'user') {
      aValue = a.user?.username || '';
      bValue = b.user?.username || '';
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const completedAmount = withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0);
  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading withdrawal data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl text-gray-900">Withdrawal Management</h1>
            <p className="text-sm text-gray-600 mt-1">Monitor and manage customer withdrawal requests</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Download size={16} className="mr-2" />
              Export Report
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Shield size={16} className="mr-2" />
              Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-[16px] font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-[16px] font-bold text-gray-900">{formatCurrency(completedAmount)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-[16px] font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-[16px] font-bold text-gray-900">{withdrawals.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search withdrawals..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === currentData.length && currentData.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Transaction ID
                      <div className="ml-1 flex flex-col">
                        <ChevronUp size={12} className={sortField === 'id' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'} />
                        <ChevronDown size={12} className={sortField === 'id' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center">
                      Customer
                      <div className="ml-1 flex flex-col">
                        <ChevronUp size={12} className={sortField === 'user' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'} />
                        <ChevronDown size={12} className={sortField === 'user' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      <div className="ml-1 flex flex-col">
                        <ChevronUp size={12} className={sortField === 'amount' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'} />
                        <ChevronDown size={12} className={sortField === 'amount' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date & Time
                      <div className="ml-1 flex flex-col">
                        <ChevronUp size={12} className={sortField === 'createdAt' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'} />
                        <ChevronDown size={12} className={sortField === 'createdAt' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((withdrawal, index) => {
                  const { date, time } = formatDate(withdrawal.createdAt);
                  return (
                    <motion.tr
                      key={withdrawal.id}
                      className={`hover:bg-gray-50 ${selectedRows.has(withdrawal.id) ? 'bg-blue-50' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(withdrawal.id)}
                          onChange={() => handleSelectRow(withdrawal.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Hash size={14} className="text-gray-400 mr-2" />
                          <div className="min-w-0">
                            <p className="font-mono text-sm text-gray-900 truncate">{withdrawal.id}</p>
                            {withdrawal.transactionCode && (
                              <p className="text-xs text-gray-500 truncate">{withdrawal.transactionCode}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs mr-3 flex-shrink-0">
                            {withdrawal.user?.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-900 truncate">{withdrawal.user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{withdrawal.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(withdrawal.PaymentMethod?.name || '')}
                          <span className="ml-2 text-sm text-gray-900 truncate">
                            {withdrawal.PaymentMethod?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{formatCurrency(withdrawal.amount)}</p>
                          <p className="text-xs text-gray-500 truncate">{withdrawal.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">{date}</p>
                          <p className="text-xs text-gray-500">{time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  if (totalPages <= 5) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  let displayPage = page;
                  if (currentPage > 3) {
                    displayPage = currentPage - 2 + i;
                  }
                  if (displayPage > totalPages) return null;

                  return (
                    <button
                      key={displayPage}
                      onClick={() => setCurrentPage(displayPage)}
                      className={`px-3 py-2 rounded-lg ${currentPage === displayPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {displayPage}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialWithdrawalsPage;