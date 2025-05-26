import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  BarChart3,
  Globe,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';
import StatusBadge from '../../../../components/common/StatusBadge';
import SearchBox from '../../../../components/common/SearchBox';
import FilterPanel from '../../../../components/common/FilterPanel';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';

const CountryUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'united states', 'europe', 'asia'
  ]);

  const countriesData = [
    {
      id: '1',
      country: 'United States',
      region: 'North America',
      totalUsers: 5742,
      activeUsers: 3891,
      inactiveUsers: 1851,
      growthRate: 12.5,
      averageTransactions: 38.2,
      lastUserJoined: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      country: 'United Kingdom',
      region: 'Europe',
      totalUsers: 3156,
      activeUsers: 2408,
      inactiveUsers: 748,
      growthRate: 8.7,
      averageTransactions: 42.6,
      lastUserJoined: '45 minutes ago',
      status: 'active'
    },
    {
      id: '3',
      country: 'Germany',
      region: 'Europe',
      totalUsers: 2871,
      activeUsers: 1986,
      inactiveUsers: 885,
      growthRate: 6.3,
      averageTransactions: 35.1,
      lastUserJoined: '1 day ago',
      status: 'active'
    },
    {
      id: '4',
      country: 'Japan',
      region: 'Asia',
      totalUsers: 2345,
      activeUsers: 1782,
      inactiveUsers: 563,
      growthRate: 5.8,
      averageTransactions: 29.7,
      lastUserJoined: '3 hours ago',
      status: 'active'
    },
    {
      id: '5',
      country: 'Canada',
      region: 'North America',
      totalUsers: 1987,
      activeUsers: 1456,
      inactiveUsers: 531,
      growthRate: 7.2,
      averageTransactions: 33.4,
      lastUserJoined: '5 hours ago',
      status: 'active'
    },
    {
      id: '6',
      country: 'France',
      region: 'Europe',
      totalUsers: 1854,
      activeUsers: 1231,
      inactiveUsers: 623,
      growthRate: 4.9,
      averageTransactions: 31.8,
      lastUserJoined: '1 day ago',
      status: 'active'
    },
    {
      id: '7',
      country: 'Australia',
      region: 'Oceania',
      totalUsers: 1632,
      activeUsers: 1124,
      inactiveUsers: 508,
      growthRate: 9.3,
      averageTransactions: 36.5,
      lastUserJoined: '6 hours ago',
      status: 'active'
    },
    {
      id: '8',
      country: 'Brazil',
      region: 'South America',
      totalUsers: 1478,
      activeUsers: 956,
      inactiveUsers: 522,
      growthRate: 15.7,
      averageTransactions: 27.3,
      lastUserJoined: '12 hours ago',
      status: 'active'
    },
    {
      id: '9',
      country: 'India',
      region: 'Asia',
      totalUsers: 4521,
      activeUsers: 2987,
      inactiveUsers: 1534,
      growthRate: 21.5,
      averageTransactions: 24.8,
      lastUserJoined: '30 minutes ago',
      status: 'active'
    },
    {
      id: '10',
      country: 'South Korea',
      region: 'Asia',
      totalUsers: 1245,
      activeUsers: 935,
      inactiveUsers: 310,
      growthRate: 11.2,
      averageTransactions: 41.3,
      lastUserJoined: '8 hours ago',
      status: 'active'
    },
    {
      id: '11',
      country: 'Spain',
      region: 'Europe',
      totalUsers: 1358,
      activeUsers: 872,
      inactiveUsers: 486,
      growthRate: 3.7,
      averageTransactions: 29.4,
      lastUserJoined: '2 days ago',
      status: 'inactive'
    },
    {
      id: '12',
      country: 'Mexico',
      region: 'North America',
      totalUsers: 1287,
      activeUsers: 754,
      inactiveUsers: 533,
      growthRate: 13.8,
      averageTransactions: 21.6,
      lastUserJoined: '1 day ago',
      status: 'active'
    },
    {
      id: '13',
      country: 'Italy',
      region: 'Europe',
      totalUsers: 1176,
      activeUsers: 723,
      inactiveUsers: 453,
      growthRate: 2.5,
      averageTransactions: 28.9,
      lastUserJoined: '4 days ago',
      status: 'inactive'
    },
    {
      id: '14',
      country: 'China',
      region: 'Asia',
      totalUsers: 3852,
      activeUsers: 2450,
      inactiveUsers: 1402,
      growthRate: -1.2,
      averageTransactions: 32.7,
      lastUserJoined: '3 days ago',
      status: 'pending'
    },
    {
      id: '15',
      country: 'Russia',
      region: 'Europe/Asia',
      totalUsers: 1621,
      activeUsers: 987,
      inactiveUsers: 634,
      growthRate: 0.5,
      averageTransactions: 19.8,
      lastUserJoined: '5 days ago',
      status: 'inactive'
    }
  ];

  const regionStats = React.useMemo(() => {
    const stats: Record<string, { users: number, active: number, countries: number }> = {};

    countriesData.forEach(country => {
      if (!stats[country.region]) {
        stats[country.region] = { users: 0, active: 0, countries: 0 };
      }

      stats[country.region].users += country.totalUsers;
      stats[country.region].active += country.activeUsers;
      stats[country.region].countries += 1;
    });

    return Object.entries(stats).map(([region, data]) => ({
      region,
      ...data,
      activePercentage: Math.round((data.active / data.users) * 100)
    }));
  }, []);

  // Filter options for FilterPanel
  const filterOptions = [
    {
      id: 'region',
      label: 'Region',
      type: 'multiselect' as const,
      options: [
        { value: 'North America', label: 'North America' },
        { value: 'South America', label: 'South America' },
        { value: 'Europe', label: 'Europe' },
        { value: 'Asia', label: 'Asia' },
        { value: 'Africa', label: 'Africa' },
        { value: 'Oceania', label: 'Oceania' }
      ]
    },
    {
      id: 'activeUserPercentage',
      label: 'Active User %',
      type: 'number' as const,
    },
    {
      id: 'growthRate',
      label: 'Growth Rate',
      type: 'select' as const,
      options: [
        { value: 'positive', label: 'Positive Growth' },
        { value: 'negative', label: 'Negative Growth' },
        { value: 'high', label: 'High Growth (>10%)' },
        { value: 'low', label: 'Low Growth (<5%)' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ]
    },
    {
      id: 'hasHighTransactions',
      label: 'High Transactions',
      type: 'boolean' as const
    }
  ];

  // Table columns definition
  const columns = [
    {
      id: 'country',
      header: 'Country',
      accessor: (row: any) => row.country,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            <Globe size={16} strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.region}</p>
          </div>
        </div>
      )
    },
    {
      id: 'totalUsers',
      header: 'Total Users',
      accessor: (row: any) => row.totalUsers,
      sortable: true,
      width: '130px',
      cell: (value: number) => (
        <div className="flex items-center">
          <Users size={14} className="text-primary-400 mr-1.5" strokeWidth={1.8} />
          <span className="font-medium">{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      id: 'activePercentage',
      header: 'Active Users',
      accessor: (row: any) => Math.round((row.activeUsers / row.totalUsers) * 100),
      sortable: true,
      width: '160px',
      cell: (value: number, row: any) => (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Active users</span>
            <span className="text-xs font-medium">{value}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-500"
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      id: 'growthRate',
      header: 'Growth',
      accessor: (row: any) => row.growthRate,
      sortable: true,
      width: '120px',
      cell: (value: number) => (
        <div className={`flex items-center ${value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {value >= 0 ? (
            <ArrowUpRight size={14} className="mr-1.5" strokeWidth={1.8} />
          ) : (
            <ArrowDownRight size={14} className="mr-1.5" strokeWidth={1.8} />
          )}
          <span className="font-medium">{value}%</span>
        </div>
      )
    },
    {
      id: 'averageTransactions',
      header: 'Avg Transactions',
      accessor: (row: any) => row.averageTransactions,
      sortable: true,
      width: '150px',
      cell: (value: number) => (
        <div className="flex items-center">
          <TrendingUp size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value.toFixed(1)}</span>
        </div>
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
      id: 'lastUserJoined',
      header: 'Last Join',
      accessor: (row: any) => row.lastUserJoined,
      sortable: true,
      width: '140px',
      cell: (value: string) => (
        <div className="flex items-center">
          <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value}</span>
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
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View country details"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View country analytics"
          >
            <BarChart3 size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
    }
  ];

  // Simulating data loading
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredCountries(countriesData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredCountries(countriesData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    // Filter by country, region
    const filtered = countriesData.filter(country =>
      country.country.toLowerCase().includes(lowercasedQuery) ||
      country.region.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredCountries(filtered);

    // Add to recent searches
    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1); // Reset to first page
  };

  // Handle filter apply
  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...countriesData];

    // Filter by region (multiselect)
    if (filters.region && filters.region.length > 0) {
      filtered = filtered.filter(country => filters.region.includes(country.region));
    }

    // Filter by active user percentage
    if (filters.activeUserPercentage) {
      const minPercent = parseInt(filters.activeUserPercentage);
      if (!isNaN(minPercent)) {
        filtered = filtered.filter(country =>
          (country.activeUsers / country.totalUsers) * 100 >= minPercent
        );
      }
    }

    // Filter by growth rate
    if (filters.growthRate) {
      switch (filters.growthRate) {
        case 'positive':
          filtered = filtered.filter(country => country.growthRate > 0);
          break;
        case 'negative':
          filtered = filtered.filter(country => country.growthRate < 0);
          break;
        case 'high':
          filtered = filtered.filter(country => country.growthRate >= 10);
          break;
        case 'low':
          filtered = filtered.filter(country => country.growthRate < 5 && country.growthRate >= 0);
          break;
      }
    }

    // Filter by status (multiselect)
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(country => filters.status.includes(country.status));
    }

    // Filter by high transactions (boolean)
    if (filters.hasHighTransactions) {
      filtered = filtered.filter(country => country.averageTransactions > 30);
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(country =>
        country.country.toLowerCase().includes(lowercasedQuery) ||
        country.region.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredCountries(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Reset all filters
  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredCountries(countriesData);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // Reset to first page
  };

  // Export as CSV (placeholder)
  const handleExport = () => {
    alert('Export functionality would go here');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">User Geography</h1>
          <p className="text-gray-500 mt-1">User distribution and metrics by country</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <Globe size={16} className="mr-2" strokeWidth={1.8} />
            Map View
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
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm shadow-sm"
            whileHover={{ y: -2, backgroundColor: '#4f46e5', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ y: 0 }}
          >
            <BarChart3 size={16} className="mr-2" strokeWidth={1.8} />
            Analytics
          </motion.button>
        </div>
      </motion.div>

      {/* Region Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {regionStats.slice(0, 4).map((region, index) => (
          <motion.div
            key={region.region}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 text-white flex items-center justify-center mr-2">
                  <MapPin size={14} strokeWidth={1.8} />
                </div>
                <h3 className="font-medium text-gray-700">{region.region}</h3>
              </div>
              <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                {region.countries} countries
              </span>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Users</span>
              <span className="text-sm font-medium">{region.users.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">Active Users</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-green-600 mr-1">{region.activePercentage}%</span>
                <span className="text-xs text-gray-400">({region.active.toLocaleString()})</span>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-primary-500"
                style={{ width: `${region.activePercentage}%` }}
              ></div>
            </div>

            <motion.button
              className="w-full mt-3 text-xs text-primary-600 font-medium flex items-center justify-center"
              whileHover={{ x: 3 }}
            >
              View Details <ChevronRight size={14} className="ml-1" />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="md:col-span-2">
          <SearchBox
            placeholder="Search countries or regions..."
            onSearch={handleSearch}
            suggestions={countriesData.map(country => country.country).slice(0, 5)}
            recentSearches={recentSearches}
            showRecentByDefault={true}
            className="w-full"
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Country Filters"
            filters={filterOptions}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            initialExpanded={false}
          />
        </div>
      </motion.div>

      {/* Countries Table */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={filteredCountries}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No countries found. Try adjusting your filters or search terms."
          defaultRowsPerPage={itemsPerPage}
        />
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredCountries.length}
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

export default CountryUsersPage;