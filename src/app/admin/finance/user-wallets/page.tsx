import { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Upload,
  Eye,
  Clock,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Users,
  Building2,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import financeService from '../../../../api/services/finance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WalletsPage = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('balance');
  const [sortDirection, setSortDirection] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  const fetchWallets = async () => {
    setIsLoading(true);

    try {
      const response = await financeService.getAllWallets();

      const formattedWallets = response.data.map((wallet) => ({
        id: wallet.id || '',
        user: {
          id: wallet.user_uuid || wallet.group_uuid || '',
          name: wallet.user?.username || wallet.group?.name || (wallet.type === 'system' ? 'System Wallet' : 'Unknown'),
          email: wallet.user?.email || 'N/A',
        },
        balance: parseFloat(wallet.balance) || 0,
        debit: parseFloat(wallet.debit) || 0,
        credit: parseFloat(wallet.credit) || 0,
        currency: wallet.Currency?.symbol || 'KES',
        currencyName: wallet.Currency?.name || 'Kenya Shillings',
        status: wallet.status || 'Active',
        type: wallet.type || 'user',
        purpose: wallet.purpose || null,
        created: new Date(wallet.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        lastUpdated: new Date(wallet.updatedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        activity: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendPercentage: (Math.random() * 10).toFixed(2),
      }));

      setWallets(formattedWallets);
    } catch (err) {
      toast.error('Failed to load wallets');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // Filter wallets based on search term and filter type
  const filteredWallets = useMemo(() => {
    return wallets.filter(wallet => {
      // Search filter
      const searchMatch = searchTerm === '' ||
        wallet.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.type.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const typeMatch = filterType === 'all' || wallet.type === filterType;

      return searchMatch && typeMatch;
    });
  }, [wallets, searchTerm, filterType]);

  // Sort wallets
  const sortedWallets = useMemo(() => {
    return [...filteredWallets].sort((a, b) => {
      let comparison = 0;

      // Handle different field types
      if (sortField === 'balance') {
        comparison = a.balance - b.balance;
      } else if (sortField === 'user') {
        comparison = a.user.name.localeCompare(b.user.name);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === 'created') {
        comparison = new Date(a.created) - new Date(b.created);
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredWallets, sortField, sortDirection]);

  // Pagination
  const paginatedWallets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedWallets.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedWallets, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedWallets.length / itemsPerPage);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const totalTransactions = wallets.reduce((sum, wallet) => sum + (wallet.debit + wallet.credit), 0);
    const activeWallets = wallets.filter(wallet => wallet.status === 'Active').length;
    const systemWallets = wallets.filter(wallet => wallet.type === 'system').length;
    const userWallets = wallets.filter(wallet => wallet.type === 'user').length;
    const groupWallets = wallets.filter(wallet => wallet.type === 'group').length;

    return {
      totalBalance,
      totalTransactions,
      activeWallets,
      systemWallets,
      userWallets,
      groupWallets,
      currency: wallets[0]?.currency || 'KES'
    };
  }, [wallets]);

  // Handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 h-32">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-12 bg-gray-100 flex items-center px-6"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-t border-gray-100 h-16 px-6 flex items-center">
            <div className="h-8 bg-gray-200 rounded-full w-8 mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="ml-auto h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Wallets</h1>
          <p className="text-gray-500 mt-1">Manage balances and wallet security settings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm shadow-sm hover:from-indigo-700 hover:to-blue-700 transition-colors">
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </button>
        </div>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 shadow-lg shadow-indigo-500/10 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-8 bottom-4 opacity-30">
              <DollarSign size={40} />
            </div>
            <h3 className="text-indigo-100 font-medium">Total Balance</h3>
            <p className="text-2xl font-bold mt-1">
              {new Intl.NumberFormat('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(summaryStats.totalBalance)} {summaryStats.currency}
            </p>
            <div className="flex items-center mt-2 text-xs text-indigo-100">
              <span>Across {wallets.length} wallets</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute right-5 top-5 bg-emerald-50 rounded-xl p-2">
              <Users size={20} className="text-emerald-500" />
            </div>
            <h3 className="text-gray-500 font-medium">User Wallets</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.userWallets}</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4">
              <div
                className="h-1.5 bg-emerald-500 rounded-full"
                style={{ width: `${(summaryStats.userWallets / wallets.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{Math.round((summaryStats.userWallets / wallets.length) * 100)}% of total</span>
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                Active
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute right-5 top-5 bg-blue-50 rounded-xl p-2">
              <Building2 size={20} className="text-blue-500" />
            </div>
            <h3 className="text-gray-500 font-medium">Group Wallets</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.groupWallets}</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4">
              <div
                className="h-1.5 bg-blue-500 rounded-full"
                style={{ width: `${(summaryStats.groupWallets / wallets.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{Math.round((summaryStats.groupWallets / wallets.length) * 100)}% of total</span>
              <span className="text-blue-500 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                Groups
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute right-5 top-5 bg-amber-50 rounded-xl p-2">
              <Wallet size={20} className="text-amber-500" />
            </div>
            <h3 className="text-gray-500 font-medium">System Wallets</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{summaryStats.systemWallets}</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4">
              <div
                className="h-1.5 bg-amber-500 rounded-full"
                style={{ width: `${(summaryStats.systemWallets / wallets.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{Math.round((summaryStats.systemWallets / wallets.length) * 100)}% of total</span>
              <span className="text-amber-500 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                System
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search wallets by name, ID or type..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors text-sm shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${filterType === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => handleFilterTypeChange('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${filterType === 'user'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => handleFilterTypeChange('user')}
          >
            Users
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${filterType === 'group'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => handleFilterTypeChange('group')}
          >
            Groups
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${filterType === 'system'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => handleFilterTypeChange('system')}
          >
            System
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1.5" />
            More Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors text-sm shadow-sm">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="frozen">Frozen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balance Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors text-sm shadow-sm"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors text-sm shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
            <input
              type="date"
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors text-sm shadow-sm"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-sm hover:bg-indigo-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Table Header with dynamic rendering of results */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 py-4 px-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-800">{sortedWallets.length}</span> {filterType !== 'all' ? filterType : ''} wallets found
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Custom Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center">
                      <span>Owner</span>
                      {sortField === 'user' && (
                        sortDirection === 'asc' ?
                          <ChevronUp size={14} className="ml-1 text-indigo-500" /> :
                          <ChevronDown size={14} className="ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('balance')}
                  >
                    <div className="flex items-center">
                      <span>Balance</span>
                      {sortField === 'balance' && (
                        sortDirection === 'asc' ?
                          <ChevronUp size={14} className="ml-1 text-indigo-500" /> :
                          <ChevronDown size={14} className="ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {sortField === 'status' && (
                        sortDirection === 'asc' ?
                          <ChevronUp size={14} className="ml-1 text-indigo-500" /> :
                          <ChevronDown size={14} className="ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('activity')}
                  >
                    <div className="flex items-center">
                      <span>Activity</span>
                      {sortField === 'activity' && (
                        sortDirection === 'asc' ?
                          <ChevronUp size={14} className="ml-1 text-indigo-500" /> :
                          <ChevronDown size={14} className="ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('lastUpdated')}
                  >
                    <div className="flex items-center">
                      <span>Last Updated</span>
                      {sortField === 'lastUpdated' && (
                        sortDirection === 'asc' ?
                          <ChevronUp size={14} className="ml-1 text-indigo-500" /> :
                          <ChevronDown size={14} className="ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedWallets.length > 0 ? (
                  paginatedWallets.map((wallet, index) => (
                    <tr
                      key={wallet.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Owner Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm mr-3 shadow-sm ${wallet.type === 'user'
                              ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
                              : wallet.type === 'group'
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                            }`}>
                            {wallet.type === 'user' && <Users size={16} className="text-white" />}
                            {wallet.type === 'group' && <Building2 size={16} className="text-white" />}
                            {wallet.type === 'system' && <Wallet size={16} className="text-white" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 flex items-center">
                              {wallet.user.name}
                              {wallet.purpose && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                  {wallet.purpose.replace(/_/g, ' ')}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {wallet.type === 'user' && 'User Wallet'}
                              {wallet.type === 'group' && 'Group Wallet'}
                              {wallet.type === 'system' && 'System Wallet'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Balance Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-1 h-8 rounded-full mr-2 ${wallet.balance > 0
                              ? 'bg-emerald-500'
                              : wallet.balance < 0
                                ? 'bg-red-500'
                                : 'bg-gray-300'
                            }`}></div>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center">
                              {new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(wallet.balance)}
                              <span className="text-xs text-gray-500 ml-1">{wallet.currency}</span>
                            </div>
                            <div className={`text-xs flex items-center mt-0.5 ${wallet.trend === 'up'
                                ? 'text-emerald-600'
                                : 'text-red-600'
                              }`}>
                              {wallet.trend === 'up'
                                ? <ArrowUpRight size={12} className="mr-0.5" />
                                : <ArrowDownRight size={12} className="mr-0.5" />}
                              {wallet.trendPercentage}%
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        {(() => {
                          const statusConfig = {
                            'Active': { color: 'emerald', icon: true, pulse: true },
                            'Inactive': { color: 'gray', icon: false, pulse: false },
                            'Pending': { color: 'amber', icon: true, pulse: true },
                            'Frozen': { color: 'blue', icon: true, pulse: false },
                            'Suspended': { color: 'red', icon: true, pulse: false },
                          };

                          const config = statusConfig[wallet.status] || statusConfig['Active'];

                          return (
                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-700`}>
                              {config.pulse && (
                                <span className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500 mr-1.5 ${config.pulse ? 'animate-pulse' : ''}`}></span>
                              )}
                              {wallet.status}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Activity Column */}
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${wallet.activity > 75
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : wallet.activity > 40
                                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
                              }`}
                            style={{ width: `${wallet.activity}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Last Updated Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
                          <span className="text-sm text-gray-600">{wallet.lastUpdated}</span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                            onClick={() => navigate(`/admin/finance/user-wallets/${wallet.id}`)}
                            title="View Details"
                          >
                            <Eye size={18} strokeWidth={1.8} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                            onClick={() => alert(`Refresh wallet ${wallet.id}`)}
                            title="Refresh Balance"
                          >
                            <RefreshCw size={18} strokeWidth={1.8} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                            onClick={() => alert(`Edit wallet ${wallet.id}`)}
                            title="Edit Settings"
                          >
                            <Sliders size={18} strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-50 p-4 rounded-full">
                          <AlertTriangle size={24} className="text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No wallets found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Custom Pagination */}
          {paginatedWallets.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedWallets.length)} of {sortedWallets.length} wallets
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                    } transition-colors`}
                >
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show first page, last page, current page, and pages around current page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                          } transition-colors`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return <span key={page} className="text-gray-500">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                    } transition-colors`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletsPage;