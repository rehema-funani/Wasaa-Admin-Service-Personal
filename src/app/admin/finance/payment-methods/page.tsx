import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  AlertTriangle,
  CalendarDays,
  Star,
  Banknote,
  DollarSign,
  Eye,
  RefreshCw,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import financeService from '../../../../api/services/finance';

// import CreatePaymentMethodModal from './modals/CreatePaymentMethodModal';
// import EditPaymentMethodModal from './modals/EditPaymentMethodModal';
// import ViewPaymentMethodModal from './modals/ViewPaymentMethodModal';
// import DeletePaymentMethodModal from './modals/DeletePaymentMethodModal';

const PaymentMethods = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'visa', 'default', 'expired'
  ]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  // Fetch payment methods from API
  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await financeService.getAllPaymentMethods();
      setPaymentMethods(response.data || []);
      setFilteredMethods(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch payment methods:', err);
      setError(err.message || 'Failed to load payment methods. Please try again.');
      toast.error('Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return <CreditCard size={16} className="text-primary-500" strokeWidth={1.8} />;
      case 'bank_account':
        return <Banknote size={16} className="text-primary-500" strokeWidth={1.8} />;
      case 'paypal':
        return <DollarSign size={16} className="text-primary-600" strokeWidth={1.8} />;
      case 'apple_pay':
        return <CreditCard size={16} className="text-gray-800" strokeWidth={1.8} />;
      case 'google_pay':
        return <CreditCard size={16} className="text-green-600" strokeWidth={1.8} />;
      default:
        return <CreditCard size={16} className="text-gray-500" strokeWidth={1.8} />;
    }
  };

  const getPaymentMethodTitle = (type: string) => {
    switch (type) {
      case 'credit_card': return 'Credit Card';
      case 'bank_account': return 'Bank Account';
      case 'paypal': return 'PayPal';
      case 'apple_pay': return 'Apple Pay';
      case 'google_pay': return 'Google Pay';
      default: return type.replace('_', ' ');
    }
  };

  const columns = [
    {
      id: 'user',
      header: 'User',
      accessor: (row: any) => row.user?.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            {value ? value.split(' ').map((n: string) => n[0]).join('') : '??'}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value || 'Unknown User'}</p>
            <p className="text-xs text-gray-500">{row.user?.email || 'No email'}</p>
          </div>
        </div>
      )
    },
    {
      id: 'paymentMethod',
      header: 'Payment Method',
      accessor: (row: any) => row.type,
      sortable: true,
      cell: (value: string, row: any) => {
        const icon = getPaymentMethodIcon(value);
        const title = getPaymentMethodTitle(value);

        const getDetailsText = () => {
          if (value === 'credit_card') {
            return (
              <div className="flex items-center">
                {row.details?.cardType === 'Visa' && (
                  <span className="text-primary-600 font-medium mr-1">VISA</span>
                )}
                {row.details?.cardType === 'Mastercard' && (
                  <span className="text-orange-600 font-medium mr-1">MC</span>
                )}
                {row.details?.cardType === 'American Express' && (
                  <span className="text-primary-800 font-medium mr-1">AMEX</span>
                )}
                {row.details?.cardType === 'Discover' && (
                  <span className="text-orange-500 font-medium mr-1">DISC</span>
                )}
                <span>{row.details?.cardNumber || '••••'}</span>
              </div>
            );
          } else if (value === 'bank_account') {
            return `${row.details?.bankName || 'Bank'} - ${row.details?.accountType || 'Account'}`;
          } else if (value === 'paypal') {
            return row.details?.email || 'PayPal Account';
          } else if (value === 'apple_pay' || value === 'google_pay') {
            return `${row.details?.deviceName || 'Device'} (${row.details?.tokenizedId || '••••'})`;
          }
          return 'No details available';
        };

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="mr-2">
                {icon}
              </div>
              <span className="font-medium text-gray-800">
                {title}
                {row.isDefault && (
                  <span className="ml-2 bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md text-xs">
                    Default
                  </span>
                )}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-600 ml-6">
              {getDetailsText()}
            </div>
            {row.details?.expiryDate && (
              <div className="flex items-center mt-1 text-xs text-gray-500 ml-6">
                <CalendarDays size={12} className="mr-1" strokeWidth={1.8} />
                <span>Expires: {row.details.expiryDate}</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '140px',
      cell: (value: string) => {
        const statusConfig: Record<string, { label: string, color: string, icon: React.ReactNode }> = {
          'active': {
            label: 'Active',
            color: 'bg-green-100 text-green-700',
            icon: <CheckCircle size={12} className="mr-1" strokeWidth={2} />
          },
          'expired': {
            label: 'Expired',
            color: 'bg-red-100 text-red-700',
            icon: <AlertTriangle size={12} className="mr-1" strokeWidth={2} />
          },
          'suspended': {
            label: 'Suspended',
            color: 'bg-orange-100 text-orange-700',
            icon: <AlertTriangle size={12} className="mr-1" strokeWidth={2} />
          },
          'pending_verification': {
            label: 'Pending',
            color: 'bg-yellow-100 text-yellow-700',
            icon: <AlertTriangle size={12} className="mr-1" strokeWidth={2} />
          },
          'inactive': {
            label: 'Inactive',
            color: 'bg-gray-100 text-gray-700',
            icon: <XCircle size={12} className="mr-1" strokeWidth={2} />
          }
        };

        const config = statusConfig[value] || statusConfig['inactive'];

        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
            {config.icon}
            {config.label}
          </span>
        );
      }
    },
    {
      id: 'security',
      header: 'Security',
      accessor: (row: any) => row.securityLevel,
      sortable: true,
      width: '120px',
      cell: (value: string, row: any) => {
        const securityColors: Record<string, string> = {
          'high': 'text-green-600',
          'medium': 'text-yellow-600',
          'low': 'text-red-600'
        };

        const level = value || 'medium';

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Shield size={14} className={securityColors[level]} strokeWidth={1.8} />
              <span className={`ml-1.5 font-medium capitalize ${securityColors[level]}`}>
                {level}
              </span>
            </div>
            {row.isVerified ? (
              <span className="text-xs text-green-600 flex items-center mt-1 ml-0.5">
                <CheckCircle size={10} className="mr-1" strokeWidth={2} />
                Verified
              </span>
            ) : (
              <span className="text-xs text-yellow-600 flex items-center mt-1 ml-0.5">
                <AlertTriangle size={10} className="mr-1" strokeWidth={2} />
                Unverified
              </span>
            )}
          </div>
        );
      }
    },
    {
      id: 'billingAddress',
      header: 'Billing Address',
      accessor: (row: any) => row.billingAddress?.country,
      sortable: true,
      cell: (value: string, row: any) => {
        const address = row.billingAddress || {};
        return (
          <div className="text-sm">
            <div>{address.line1 || 'No address'}</div>
            {address.city && (
              <div>
                {address.city}{address.state ? `, ${address.state}` : ''} {address.zip}
              </div>
            )}
            <div className="text-gray-500">{address.country || 'Not specified'}</div>
          </div>
        );
      }
    },
    {
      id: 'usage',
      header: 'Usage',
      accessor: (row: any) => row.usageCount,
      sortable: true,
      width: '110px',
      cell: (value: number, row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`
              px-2 py-1 rounded-md text-xs font-medium
              ${!value
                ? 'bg-gray-100 text-gray-500'
                : value > 20
                  ? 'bg-green-100 text-green-700'
                  : 'bg-primary-50 text-primary-700'}
            `}>
              {value || 0} {value === 1 ? 'time' : 'times'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Last used: {row.lastUsed || 'Never'}
          </div>
        </div>
      )
    },
    {
      id: 'added',
      header: 'Added Date',
      accessor: (row: any) => row.addedDate,
      sortable: true,
      width: '110px',
      cell: (value: string) => (
        <div className="flex items-center">
          <CalendarDays size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value || 'Unknown'}</span>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '120px',
      cell: (value: string, row: any) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View payment method"
            onClick={() => handleViewMethod(row)}
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit payment method"
            onClick={() => handleEditMethod(row)}
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          {!row.isDefault && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Delete payment method"
              onClick={() => handleDeleteMethod(row)}
            >
              <Trash2 size={16} strokeWidth={1.8} />
            </motion.button>
          )}
          {!row.isDefault && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-yellow-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Set as default"
              onClick={() => handleSetDefault(row.id)}
            >
              <Star size={16} strokeWidth={1.8} />
            </motion.button>
          )}
        </div>
      )
    }
  ];

  // Handler for toggling payment method status (active/inactive)
  const handleToggleStatus = async (methodId: string) => {
    try {
      setIsLoading(true);
      await financeService.togglePaymentMethodStatus(methodId);
      toast.success('Payment method status updated successfully');
      fetchPaymentMethods(); // Reload the list
    } catch (err: any) {
      console.error('Failed to toggle payment method status:', err);
      toast.error(err.message || 'Failed to update payment method status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for setting a payment method as default
  const handleSetDefault = async (methodId: string) => {
    try {
      setIsLoading(true);
      // This endpoint may vary depending on your API
      await financeService.updatePaymentMethod(methodId, { isDefault: true });
      toast.success('Default payment method updated');
      fetchPaymentMethods(); // Reload the list
    } catch (err: any) {
      console.error('Failed to set default payment method:', err);
      toast.error(err.message || 'Failed to update default payment method');
    } finally {
      setIsLoading(false);
    }
  };

  // Modal handlers
  const handleCreateMethod = () => {
    setSelectedMethod(null);
    setShowCreateModal(true);
  };

  const handleEditMethod = (method: any) => {
    setSelectedMethod(method);
    setShowEditModal(true);
  };

  const handleViewMethod = (method: any) => {
    setSelectedMethod(method);
    setShowViewModal(true);
  };

  const handleDeleteMethod = (method: any) => {
    setSelectedMethod(method);
    setShowDeleteModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredMethods(paymentMethods);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = paymentMethods.filter(method =>
      (method.id?.toLowerCase() || '').includes(lowercasedQuery) ||
      (method.user?.name?.toLowerCase() || '').includes(lowercasedQuery) ||
      (method.user?.email?.toLowerCase() || '').includes(lowercasedQuery) ||
      (method.type?.toLowerCase() || '').includes(lowercasedQuery) ||
      (method.details?.cardType?.toLowerCase() || '').includes(lowercasedQuery) ||
      (method.details?.bankName?.toLowerCase() || '').includes(lowercasedQuery)
    );

    setFilteredMethods(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const filterOptions = [
    {
      id: 'type',
      label: 'Payment Type',
      type: 'multiselect' as const,
      options: [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'bank_account', label: 'Bank Account' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'apple_pay', label: 'Apple Pay' },
        { value: 'google_pay', label: 'Google Pay' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending_verification', label: 'Pending' },
        { value: 'expired', label: 'Expired' },
        { value: 'suspended', label: 'Suspended' }
      ]
    },
    {
      id: 'securityLevel',
      label: 'Security Level',
      type: 'select' as const,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    },
    {
      id: 'isDefault',
      label: 'Default Method',
      type: 'boolean' as const
    },
    {
      id: 'usageCount',
      label: 'Usage Count',
      type: 'range' as const
    },
    {
      id: 'addedDate',
      label: 'Added Date',
      type: 'daterange' as const
    }
  ];

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...paymentMethods];

    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(method => filters.type.includes(method.type));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(method => filters.status.includes(method.status));
    }

    if (filters.securityLevel) {
      filtered = filtered.filter(method => method.securityLevel === filters.securityLevel);
    }

    if (filters.isDefault !== undefined) {
      filtered = filtered.filter(method => method.isDefault === filters.isDefault);
    }

    if (filters.usageCount && (filters.usageCount.from !== undefined || filters.usageCount.to !== undefined)) {
      if (filters.usageCount.from !== undefined) {
        filtered = filtered.filter(method => (method.usageCount || 0) >= filters.usageCount.from);
      }
      if (filters.usageCount.to !== undefined) {
        filtered = filtered.filter(method => (method.usageCount || 0) <= filters.usageCount.to);
      }
    }

    if (filters.addedDate && (filters.addedDate.from || filters.addedDate.to)) {
      // This would need to be adapted based on your date format
      filtered = filtered.filter(method => {
        const addedDate = new Date(method.addedDate || '2000-01-01');
        const fromDate = filters.addedDate.from ? new Date(filters.addedDate.from) : new Date(0);
        const toDate = filters.addedDate.to ? new Date(filters.addedDate.to) : new Date(9999, 11, 31);

        return addedDate >= fromDate && addedDate <= toDate;
      });
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(method =>
        (method.id?.toLowerCase() || '').includes(lowercasedQuery) ||
        (method.user?.name?.toLowerCase() || '').includes(lowercasedQuery) ||
        (method.user?.email?.toLowerCase() || '').includes(lowercasedQuery) ||
        (method.type?.toLowerCase() || '').includes(lowercasedQuery) ||
        (method.details?.cardType?.toLowerCase() || '').includes(lowercasedQuery) ||
        (method.details?.bankName?.toLowerCase() || '').includes(lowercasedQuery)
      );
    }

    setFilteredMethods(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Reset all filters
  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredMethods(paymentMethods);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const confirmDelete = async (methodId: string) => {
    try {
      setIsLoading(true);
      await financeService.deletePaymentMethod(methodId);
      toast.success('Payment method deleted successfully');
      fetchPaymentMethods(); // Reload the list
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error('Failed to delete payment method:', err);
      toast.error(err.message || 'Failed to delete payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSuccess = () => {
    fetchPaymentMethods();
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
          <h1 className="text-2xl font-semibold text-gray-800 bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
            Payment Methods
          </h1>
          <p className="text-gray-500 mt-1">Manage user payment methods and security settings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            onClick={handleCreateMethod}
          >
            <Plus size={16} className="mr-2" strokeWidth={1.8} />
            Add Payment Method
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
            placeholder="Search by user, payment type, card type or bank name..."
            onSearch={handleSearch}
            suggestions={[
              'Visa',
              'Mastercard',
              'Bank Account',
              'PayPal'
            ]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Payment Method Filters"
            filters={[]}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            initialExpanded={false}
          />
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center"
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
          data={filteredMethods}
          selectable={false}
          isLoading={isLoading}
          emptyMessage="No payment methods found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredMethods.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          showSummary={true}
        />
      </motion.div>

      {/* <AnimatePresence>
        {showCreateModal && (
          <CreatePaymentMethodModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleModalSuccess}
          />
        )}

        {showEditModal && selectedMethod && (
          <EditPaymentMethodModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={handleModalSuccess}
            paymentMethod={selectedMethod}
          />
        )}

        {showViewModal && selectedMethod && (
          <ViewPaymentMethodModal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            paymentMethod={selectedMethod}
          />
        )}

        {showDeleteModal && selectedMethod && (
          <DeletePaymentMethodModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => confirmDelete(selectedMethod.id)}
            paymentMethod={selectedMethod}
          />
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default PaymentMethods;