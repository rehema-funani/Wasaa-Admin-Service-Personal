import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [filteredMethods, setFilteredMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'visa', 'default', 'expired'
  ]);

  const paymentMethodsData = [
    {
      id: 'PM-5001',
      user: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      },
      type: 'credit_card',
      details: {
        cardType: 'Visa',
        cardNumber: '•••• •••• •••• 5678',
        expiryDate: '09/27',
        cardholderName: 'Emma Johnson'
      },
      status: 'active',
      isDefault: true,
      isVerified: true,
      securityLevel: 'high',
      addedDate: 'Jan 15, 2024',
      lastUsed: '2 hours ago',
      billingAddress: {
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      },
      usageCount: 24
    },
    {
      id: 'PM-5002',
      user: {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com'
      },
      type: 'bank_account',
      details: {
        bankName: 'Chase Bank',
        accountType: 'Checking',
        accountNumber: '•••• •••• 3456',
        routingNumber: '•••• 7890'
      },
      status: 'active',
      isDefault: false,
      isVerified: true,
      securityLevel: 'high',
      addedDate: 'Mar 22, 2024',
      lastUsed: '5 days ago',
      billingAddress: {
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      },
      usageCount: 7
    },
    {
      id: 'PM-5003',
      user: {
        id: '3',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com'
      },
      type: 'credit_card',
      details: {
        cardType: 'Mastercard',
        cardNumber: '•••• •••• •••• 4321',
        expiryDate: '11/26',
        cardholderName: 'Olivia Davis'
      },
      status: 'active',
      isDefault: true,
      isVerified: true,
      securityLevel: 'high',
      addedDate: 'Nov 8, 2023',
      lastUsed: '1 day ago',
      billingAddress: {
        line1: '456 Oak St',
        city: 'Sydney',
        state: 'NSW',
        zip: '2000',
        country: 'Australia'
      },
      usageCount: 42
    },
    {
      id: 'PM-5004',
      user: {
        id: '5',
        name: 'Ava Thompson',
        email: 'ava.thompson@example.com'
      },
      type: 'paypal',
      details: {
        email: 'ava.thompson@gmail.com',
        verified: true
      },
      status: 'active',
      isDefault: true,
      isVerified: true,
      securityLevel: 'medium',
      addedDate: 'Aug 17, 2023',
      lastUsed: '12 hours ago',
      billingAddress: {
        line1: '789 Pine St',
        city: 'Berlin',
        state: '',
        zip: '10115',
        country: 'Germany'
      },
      usageCount: 18
    },
    {
      id: 'PM-5005',
      user: {
        id: '7',
        name: 'Isabella Brown',
        email: 'isabella.brown@example.com'
      },
      type: 'credit_card',
      details: {
        cardType: 'American Express',
        cardNumber: '•••• •••• •••• 9876',
        expiryDate: '04/25',
        cardholderName: 'Isabella Brown'
      },
      status: 'expired',
      isDefault: false,
      isVerified: true,
      securityLevel: 'medium',
      addedDate: 'Jun 12, 2023',
      lastUsed: '2 months ago',
      billingAddress: {
        line1: '234 Cedar St',
        city: 'Tokyo',
        state: '',
        zip: '100-0001',
        country: 'Japan'
      },
      usageCount: 9
    },
    {
      id: 'PM-5006',
      user: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      },
      type: 'bank_account',
      details: {
        bankName: 'Bank of America',
        accountType: 'Savings',
        accountNumber: '•••• •••• 6543',
        routingNumber: '•••• 2109'
      },
      status: 'active',
      isDefault: true,
      isVerified: true,
      securityLevel: 'high',
      addedDate: 'Apr 30, 2023',
      lastUsed: '3 hours ago',
      billingAddress: {
        line1: '567 Maple St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94101',
        country: 'United States'
      },
      usageCount: 31
    },
    {
      id: 'PM-5007',
      user: {
        id: '10',
        name: 'Mason Rodriguez',
        email: 'mason.rodriguez@example.com'
      },
      type: 'credit_card',
      details: {
        cardType: 'Visa',
        cardNumber: '•••• •••• •••• 8765',
        expiryDate: '07/26',
        cardholderName: 'Mason Rodriguez'
      },
      status: 'active',
      isDefault: false,
      isVerified: true,
      securityLevel: 'high',
      addedDate: 'Sep 15, 2023',
      lastUsed: '1 week ago',
      billingAddress: {
        line1: '567 Maple St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94101',
        country: 'United States'
      },
      usageCount: 12
    },
    {
      id: 'PM-5008',
      user: {
        id: '13',
        name: 'Amelia Lopez',
        email: 'amelia.lopez@example.com'
      },
      type: 'credit_card',
      details: {
        cardType: 'Discover',
        cardNumber: '•••• •••• •••• 2345',
        expiryDate: '03/28',
        cardholderName: 'Amelia Lopez'
      },
      status: 'pending_verification',
      isDefault: false,
      isVerified: false,
      securityLevel: 'low',
      addedDate: 'Apr 20, 2025',
      lastUsed: 'Never',
      billingAddress: {
        line1: '890 Birch St',
        city: 'Barcelona',
        state: '',
        zip: '08001',
        country: 'Spain'
      },
      usageCount: 0
    },
    {
      id: 'PM-5009',
      user: {
        id: '15',
        name: 'Mia Hernandez',
        email: 'mia.hernandez@example.com'
      },
      type: 'apple_pay',
      details: {
        deviceName: 'iPhone 16 Pro',
        tokenizedId: '••••••••AF24'
      },
      status: 'active',
      isDefault: true,
      isVerified: true,
      securityLevel: 'high',
      addedDate: 'Feb 28, 2024',
      lastUsed: '5 hours ago',
      billingAddress: {
        line1: '345 Elm St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'United States'
      },
      usageCount: 27
    },
    {
      id: 'PM-5010',
      user: {
        id: '8',
        name: 'Ethan Miller',
        email: 'ethan.miller@example.com'
      },
      type: 'google_pay',
      details: {
        deviceName: 'Pixel 9',
        tokenizedId: '••••••••BT37'
      },
      status: 'active',
      isDefault: true,
      isVerified: true,
      securityLevel: 'high',
      addedDate: 'Sep 28, 2023',
      lastUsed: '2 days ago',
      billingAddress: {
        line1: '678 Walnut St',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'United States'
      },
      usageCount: 15
    },
    {
      id: 'PM-5011',
      user: {
        id: '2',
        name: 'Liam Wilson',
        email: 'liam.wilson@example.com'
      },
      type: 'credit_card',
      details: {
        cardType: 'Visa',
        cardNumber: '•••• •••• •••• 3456',
        expiryDate: '12/26',
        cardholderName: 'Liam Wilson'
      },
      status: 'suspended',
      isDefault: false,
      isVerified: true,
      securityLevel: 'medium',
      addedDate: 'Mar 22, 2024',
      lastUsed: '2 weeks ago',
      billingAddress: {
        line1: '901 Spruce St',
        city: 'London',
        state: '',
        zip: 'SW1A 1AA',
        country: 'United Kingdom'
      },
      usageCount: 3
    },
    {
      id: 'PM-5012',
      user: {
        id: '9',
        name: 'Sophia Garcia',
        email: 'sophia.garcia@example.com'
      },
      type: 'paypal',
      details: {
        email: 'sophia.garcia@hotmail.com',
        verified: true
      },
      status: 'active',
      isDefault: true,
      isVerified: true,
      securityLevel: 'medium',
      addedDate: 'Dec 7, 2023',
      lastUsed: '3 days ago',
      billingAddress: {
        line1: '123 Rose St',
        city: 'Madrid',
        state: '',
        zip: '28001',
        country: 'Spain'
      },
      usageCount: 8
    }
  ];

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
        { value: 'expired', label: 'Expired' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'pending_verification', label: 'Pending Verification' }
      ]
    },
    {
      id: 'isDefault',
      label: 'Default Method',
      type: 'boolean' as const
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
      id: 'usageCount',
      label: 'Usage Count',
      type: 'range' as const,
      min: 0,
      max: 50,
      step: 5
    },
    {
      id: 'addedDate',
      label: 'Added Date',
      type: 'daterange' as const
    }
  ];

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return <CreditCard size={16} className="text-indigo-500" strokeWidth={1.8} />;
      case 'bank_account':
        return <Banknote size={16} className="text-blue-500" strokeWidth={1.8} />;
      case 'paypal':
        return <DollarSign size={16} className="text-blue-600" strokeWidth={1.8} />;
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
      accessor: (row: any) => row.user.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-medium text-sm mr-3">
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
                {row.details.cardType === 'Visa' && (
                  <span className="text-blue-600 font-medium mr-1">VISA</span>
                )}
                {row.details.cardType === 'Mastercard' && (
                  <span className="text-orange-600 font-medium mr-1">MC</span>
                )}
                {row.details.cardType === 'American Express' && (
                  <span className="text-blue-800 font-medium mr-1">AMEX</span>
                )}
                {row.details.cardType === 'Discover' && (
                  <span className="text-orange-500 font-medium mr-1">DISC</span>
                )}
                <span>{row.details.cardNumber}</span>
              </div>
            );
          } else if (value === 'bank_account') {
            return `${row.details.bankName} - ${row.details.accountType}`;
          } else if (value === 'paypal') {
            return row.details.email;
          } else if (value === 'apple_pay' || value === 'google_pay') {
            return `${row.details.deviceName} (${row.details.tokenizedId})`;
          }
          return '';
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
                  <span className="ml-2 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md text-xs">
                    Default
                  </span>
                )}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-600 ml-6">
              {getDetailsText()}
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500 ml-6">
              <CalendarDays size={12} className="mr-1" strokeWidth={1.8} />
              <span>Expires: {row.details.expiryDate}</span>
            </div>
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
            label: 'Pending Verification',
            color: 'bg-yellow-100 text-yellow-700',
            icon: <AlertTriangle size={12} className="mr-1" strokeWidth={2} />
          }
        };

        const config = statusConfig[value] || statusConfig['active'];

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

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Shield size={14} className={securityColors[value]} strokeWidth={1.8} />
              <span className={`ml-1.5 font-medium capitalize ${securityColors[value]}`}>
                {value}
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
      accessor: (row: any) => row.billingAddress.country,
      sortable: true,
      cell: (value: string, row: any) => {
        const address = row.billingAddress;
        return (
          <div className="text-sm">
            <div>{address.line1}</div>
            <div>
              {address.city}{address.state ? `, ${address.state}` : ''} {address.zip}
            </div>
            <div className="text-gray-500">{address.country}</div>
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
              ${value === 0
                ? 'bg-gray-100 text-gray-500'
                : value > 20
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-50 text-blue-700'}
            `}>
              {value} {value === 1 ? 'time' : 'times'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Last used: {row.lastUsed}
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
          <span>{value}</span>
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
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View payment method"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit payment method"
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          {!row.isDefault && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Delete payment method"
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
            >
              <Star size={16} strokeWidth={1.8} />
            </motion.button>
          )}
        </div>
      )
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredMethods(paymentMethodsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredMethods(paymentMethodsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    const filtered = paymentMethodsData.filter(method =>
      method.id.toLowerCase().includes(lowercasedQuery) ||
      method.user.name.toLowerCase().includes(lowercasedQuery) ||
      method.user.email.toLowerCase().includes(lowercasedQuery) ||
      method.type.toLowerCase().includes(lowercasedQuery) ||
      (method.details.cardType && method.details.cardType.toLowerCase().includes(lowercasedQuery)) ||
      (method.details.bankName && method.details.bankName.toLowerCase().includes(lowercasedQuery))
    );

    setFilteredMethods(filtered);

    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...paymentMethodsData];

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
        filtered = filtered.filter(method => method.usageCount >= filters.usageCount.from);
      }
      if (filters.usageCount.to !== undefined) {
        filtered = filtered.filter(method => method.usageCount <= filters.usageCount.to);
      }
    }

    if (filters.addedDate && (filters.addedDate.from || filters.addedDate.to)) {
      if (filters.addedDate.from) {
        filtered = filtered.filter(method => {
          const month = method.addedDate.split(' ')[0];
          const fromMonth = filters.addedDate.from.split('-')[1];
          return parseInt(getMonthNumber(month)) >= parseInt(fromMonth);
        });
      }

      if (filters.addedDate.to) {
        filtered = filtered.filter(method => {
          const month = method.addedDate.split(' ')[0];
          const toMonth = filters.addedDate.to.split('-')[1];
          return parseInt(getMonthNumber(month)) <= parseInt(toMonth);
        });
      }
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(method =>
        method.id.toLowerCase().includes(lowercasedQuery) ||
        method.user.name.toLowerCase().includes(lowercasedQuery) ||
        method.user.email.toLowerCase().includes(lowercasedQuery) ||
        method.type.toLowerCase().includes(lowercasedQuery) ||
        (method.details.cardType && method.details.cardType.toLowerCase().includes(lowercasedQuery)) ||
        (method.details.bankName && method.details.bankName.toLowerCase().includes(lowercasedQuery))
      );
    }

    setFilteredMethods(filtered);
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
    setFilteredMethods(paymentMethodsData);
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
          <h1 className="text-2xl font-semibold text-gray-800">Payment Methods</h1>
          <p className="text-gray-500 mt-1">Manage user payment methods and security settings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0 }}
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
              'Emma Johnson',
              'Chase Bank',
              'default'
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
    </div>
  );
};

export default page;