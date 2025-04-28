import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Clock,
  FileText,
  UsersRound,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  UserCheck,
  BarChart3
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
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'design', 'marketing', 'active'
  ]);

  const groupsData = [
    {
      id: '1',
      name: 'Design Team',
      description: 'Product design and UX team collaboration',
      memberCount: 18,
      activeMembers: 14,
      admin: 'Emma Johnson',
      type: 'private',
      createdAt: 'Jan 15, 2024',
      lastActive: '5 minutes ago',
      status: 'active',
      postsCount: 249,
      engagementRate: 86,
      growthRate: 6.8
    },
    {
      id: '2',
      name: 'Marketing Strategy',
      description: 'Marketing strategy and campaign planning',
      memberCount: 32,
      activeMembers: 21,
      admin: 'Liam Wilson',
      type: 'public',
      createdAt: 'Mar 22, 2024',
      lastActive: '1 hour ago',
      status: 'active',
      postsCount: 387,
      engagementRate: 72,
      growthRate: 12.4
    },
    {
      id: '3',
      name: 'Engineering Team',
      description: 'Software engineering and development',
      memberCount: 45,
      activeMembers: 38,
      admin: 'Noah Martinez',
      type: 'private',
      createdAt: 'Nov 8, 2023',
      lastActive: '20 minutes ago',
      status: 'active',
      postsCount: 583,
      engagementRate: 93,
      growthRate: 4.2
    },
    {
      id: '4',
      name: 'Product Feedback',
      description: 'Customer feedback and product improvement',
      memberCount: 124,
      activeMembers: 56,
      admin: 'Olivia Davis',
      type: 'public',
      createdAt: 'Apr 1, 2024',
      lastActive: '3 days ago',
      status: 'inactive',
      postsCount: 762,
      engagementRate: 45,
      growthRate: -2.3
    },
    {
      id: '5',
      name: 'Executive Team',
      description: 'C-suite and leadership discussions',
      memberCount: 8,
      activeMembers: 8,
      admin: 'Ava Thompson',
      type: 'private',
      createdAt: 'Aug 17, 2023',
      lastActive: '30 minutes ago',
      status: 'active',
      postsCount: 195,
      engagementRate: 98,
      growthRate: 0.5
    },
    {
      id: '6',
      name: 'Client Support',
      description: 'Client support and customer success',
      memberCount: 27,
      activeMembers: 22,
      admin: 'James Taylor',
      type: 'private',
      createdAt: 'Feb 3, 2023',
      lastActive: '10 minutes ago',
      status: 'active',
      postsCount: 831,
      engagementRate: 87,
      growthRate: 8.1
    },
    {
      id: '7',
      name: 'Finance Department',
      description: 'Finance and accounting team',
      memberCount: 14,
      activeMembers: 12,
      admin: 'Isabella Brown',
      type: 'private',
      createdAt: 'Jun 12, 2023',
      lastActive: '1 day ago',
      status: 'active',
      postsCount: 215,
      engagementRate: 79,
      growthRate: 3.5
    },
    {
      id: '8',
      name: 'Community Forum',
      description: 'Open community discussions',
      memberCount: 526,
      activeMembers: 218,
      admin: 'Ethan Miller',
      type: 'public',
      createdAt: 'Sep 28, 2023',
      lastActive: 'Just now',
      status: 'active',
      postsCount: 1842,
      engagementRate: 64,
      growthRate: 15.7
    },
    {
      id: '9',
      name: 'HR Announcements',
      description: 'HR updates and company announcements',
      memberCount: 142,
      activeMembers: 87,
      admin: 'Sophia Garcia',
      type: 'announcement',
      createdAt: 'Dec 7, 2023',
      lastActive: '2 hours ago',
      status: 'active',
      postsCount: 148,
      engagementRate: 92,
      growthRate: 2.8
    },
    {
      id: '10',
      name: 'New Product Launch',
      description: 'Upcoming product launch coordination',
      memberCount: 36,
      activeMembers: 32,
      admin: 'Mason Rodriguez',
      type: 'private',
      createdAt: 'Apr 30, 2023',
      lastActive: '45 minutes ago',
      status: 'active',
      postsCount: 412,
      engagementRate: 95,
      growthRate: 7.2
    },
    {
      id: '11',
      name: 'Social Media Team',
      description: 'Social media strategy and content',
      memberCount: 19,
      activeMembers: 15,
      admin: 'Charlotte Lee',
      type: 'private',
      createdAt: 'May 15, 2024',
      lastActive: '2 days ago',
      status: 'inactive',
      postsCount: 328,
      engagementRate: 68,
      growthRate: -1.5
    },
    {
      id: '12',
      name: 'Remote Work',
      description: 'Remote work resources and discussions',
      memberCount: 78,
      activeMembers: 45,
      admin: 'Lucas Wright',
      type: 'public',
      createdAt: 'Jan 2, 2024',
      lastActive: '4 hours ago',
      status: 'active',
      postsCount: 273,
      engagementRate: 71,
      growthRate: 9.3
    },
    {
      id: '13',
      name: 'Tech Support',
      description: 'IT and technical support',
      memberCount: 23,
      activeMembers: 18,
      admin: 'Amelia Lopez',
      type: 'private',
      createdAt: 'Jul 19, 2023',
      lastActive: '1 hour ago',
      status: 'active',
      postsCount: 456,
      engagementRate: 83,
      growthRate: 5.7
    },
    {
      id: '14',
      name: 'Customer Research',
      description: 'Market and customer research discussions',
      memberCount: 42,
      activeMembers: 26,
      admin: 'Benjamin Young',
      type: 'private',
      createdAt: 'Oct 11, 2023',
      lastActive: '3 hours ago',
      status: 'active',
      postsCount: 287,
      engagementRate: 74,
      growthRate: 4.9
    },
    {
      id: '15',
      name: 'Project Alpha',
      description: 'Secret project development team',
      memberCount: 12,
      activeMembers: 12,
      admin: 'Mia Hernandez',
      type: 'private',
      createdAt: 'Feb 28, 2024',
      lastActive: '15 minutes ago',
      status: 'active',
      postsCount: 187,
      engagementRate: 97,
      growthRate: 11.2
    }
  ];

  // Calculate group statistics
  const groupStats = React.useMemo(() => {
    const totalGroups = groupsData.length;
    const activeGroups = groupsData.filter(group => group.status === 'active').length;
    const totalMembers = groupsData.reduce((sum, group) => sum + group.memberCount, 0);
    const activeMembers = groupsData.reduce((sum, group) => sum + group.activeMembers, 0);
    const avgEngagement = Math.round(groupsData.reduce((sum, group) => sum + group.engagementRate, 0) / totalGroups);

    return {
      totalGroups,
      activeGroups,
      totalMembers,
      activeMembers,
      avgEngagement,
      publicGroups: groupsData.filter(group => group.type === 'public').length,
      privateGroups: groupsData.filter(group => group.type === 'private').length,
      announcementGroups: groupsData.filter(group => group.type === 'announcement').length
    };
  }, []);

  // Filter options for FilterPanel
  const filterOptions = [
    {
      id: 'groupType',
      label: 'Group Type',
      type: 'multiselect' as const,
      options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
        { value: 'announcement', label: 'Announcement' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      id: 'memberCount',
      label: 'Minimum Members',
      type: 'number' as const
    },
    {
      id: 'engagementRate',
      label: 'Min Engagement Rate',
      type: 'number' as const
    },
    {
      id: 'positiveGrowth',
      label: 'Positive Growth Only',
      type: 'boolean' as const
    }
  ];

  // Table columns definition
  const columns = [
    {
      id: 'name',
      header: 'Group',
      accessor: (row: any) => row.name,
      sortable: true,
      cell: (value: string, row: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            <UsersRound size={18} strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.description}</p>
          </div>
        </div>
      )
    },
    {
      id: 'memberCount',
      header: 'Members',
      accessor: (row: any) => row.memberCount,
      sortable: true,
      width: '120px',
      cell: (value: number, row: any) => (
        <div>
          <div className="flex items-center">
            <Users size={14} className="text-indigo-400 mr-1.5" strokeWidth={1.8} />
            <span className="font-medium">{value}</span>
          </div>
          <div className="flex items-center mt-1">
            <UserCheck size={14} className="text-green-500 mr-1.5" strokeWidth={1.8} />
            <span className="text-xs text-gray-500">{row.activeMembers} active</span>
          </div>
        </div>
      )
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (row: any) => row.type,
      sortable: true,
      width: '100px',
      cell: (value: string) => {
        let color = '';
        let bgColor = '';

        switch (value) {
          case 'public':
            color = 'text-blue-700';
            bgColor = 'bg-blue-50';
            break;
          case 'private':
            color = 'text-purple-700';
            bgColor = 'bg-purple-50';
            break;
          case 'announcement':
            color = 'text-amber-700';
            bgColor = 'bg-amber-50';
            break;
          default:
            color = 'text-gray-700';
            bgColor = 'bg-gray-50';
        }

        return (
          <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${bgColor} ${color} capitalize`}>
            {value}
          </span>
        );
      }
    },
    {
      id: 'postsCount',
      header: 'Posts',
      accessor: (row: any) => row.postsCount,
      sortable: true,
      width: '80px',
      cell: (value: number) => (
        <div className="flex items-center">
          <FileText size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'engagementRate',
      header: 'Engagement',
      accessor: (row: any) => row.engagementRate,
      sortable: true,
      width: '120px',
      cell: (value: number) => (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Rate</span>
            <span className="text-xs font-medium">{value}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${value >= 90 ? 'bg-green-500' :
                  value >= 70 ? 'bg-blue-500' :
                    value >= 50 ? 'bg-amber-500' : 'bg-gray-400'
                }`}
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
      width: '100px',
      cell: (value: number) => (
        <div className={`flex items-center ${value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {value >= 0 ? (
            <ArrowUpRight size={14} className="mr-1.5" strokeWidth={1.8} />
          ) : (
            <ArrowDownRight size={14} className="mr-1.5" strokeWidth={1.8} />
          )}
          <span className="font-medium">{Math.abs(value)}%</span>
        </div>
      )
    },
    {
      id: 'admin',
      header: 'Admin',
      accessor: (row: any) => row.admin,
      sortable: true,
      width: '140px'
    },
    {
      id: 'lastActive',
      header: 'Last Active',
      accessor: (row: any) => row.lastActive,
      sortable: true,
      width: '120px',
      cell: (value: string) => (
        <div className="flex items-center">
          <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
          <span>{value}</span>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: any) => row.status,
      sortable: true,
      width: '100px',
      cell: (value: string) => (
        <StatusBadge status={value as any} size="sm" withIcon withDot={value === 'active'} />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => row.id,
      sortable: false,
      width: '120px',
      cell: () => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View group"
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit group"
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete group"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
    }
  ];

  // Simulating data loading
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredGroups(groupsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredGroups(groupsData);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    // Filter by name, description, or admin
    const filtered = groupsData.filter(group =>
      group.name.toLowerCase().includes(lowercasedQuery) ||
      group.description.toLowerCase().includes(lowercasedQuery) ||
      group.admin.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredGroups(filtered);

    // Add to recent searches
    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1); // Reset to first page
  };

  // Handle filter apply
  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);

    let filtered = [...groupsData];

    // Filter by group type (multiselect)
    if (filters.groupType && filters.groupType.length > 0) {
      filtered = filtered.filter(group => filters.groupType.includes(group.type));
    }

    // Filter by status (multiselect)
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(group => filters.status.includes(group.status));
    }

    // Filter by member count
    if (filters.memberCount) {
      const minMembers = parseInt(filters.memberCount);
      if (!isNaN(minMembers)) {
        filtered = filtered.filter(group => group.memberCount >= minMembers);
      }
    }

    // Filter by engagement rate
    if (filters.engagementRate) {
      const minEngagement = parseInt(filters.engagementRate);
      if (!isNaN(minEngagement)) {
        filtered = filtered.filter(group => group.engagementRate >= minEngagement);
      }
    }

    // Filter by positive growth (boolean)
    if (filters.positiveGrowth) {
      filtered = filtered.filter(group => group.growthRate > 0);
    }

    // Apply search query if it exists
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(lowercasedQuery) ||
        group.description.toLowerCase().includes(lowercasedQuery) ||
        group.admin.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredGroups(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Reset all filters
  const handleResetFilters = () => {
    setAppliedFilters({});
    setFilteredGroups(groupsData);
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
          <h1 className="text-2xl font-semibold text-gray-800">Groups</h1>
          <p className="text-gray-500 mt-1">Manage collaboration groups and team spaces</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm shadow-sm"
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
          >
            <BarChart3 size={16} className="mr-2" strokeWidth={1.8} />
            Analytics
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
            Create Group
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Total Groups Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-indigo-50 rounded-xl p-2">
              <UsersRound size={20} className="text-indigo-500" strokeWidth={1.8} />
            </div>
            <div className="flex items-center">
              <div className="px-2 py-0.5 bg-indigo-50 rounded-full text-xs text-indigo-600 font-medium">
                {groupStats.activeGroups} active
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            {groupStats.totalGroups}
          </h3>
          <p className="text-sm text-gray-500">Total Groups</p>
        </motion.div>

        {/* Members Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-blue-50 rounded-xl p-2">
              <Users size={20} className="text-blue-500" strokeWidth={1.8} />
            </div>
            <div className="flex items-center">
              <div className="px-2 py-0.5 bg-green-50 rounded-full text-xs text-green-600 font-medium">
                {Math.round((groupStats.activeMembers / groupStats.totalMembers) * 100)}% active
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            {groupStats.totalMembers.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-500">Total Members</p>
        </motion.div>

        {/* Group Types Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-purple-50 rounded-xl p-2">
              <Link2 size={20} className="text-purple-500" strokeWidth={1.8} />
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-0.5 bg-blue-50 rounded-full text-xs text-blue-600 font-medium">
                {groupStats.publicGroups} public
              </div>
              <div className="px-2 py-0.5 bg-purple-50 rounded-full text-xs text-purple-600 font-medium">
                {groupStats.privateGroups} private
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            {groupStats.publicGroups + groupStats.privateGroups}
          </h3>
          <p className="text-sm text-gray-500">Active Groups</p>
        </motion.div>

        {/* Engagement Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-green-50 rounded-xl p-2">
              <TrendingUp size={20} className="text-green-500" strokeWidth={1.8} />
            </div>
            <div className="flex items-center">
              <div className={`flex items-center text-green-600 text-xs font-medium`}>
                <ArrowUpRight size={12} className="mr-0.5" strokeWidth={1.8} />
                <span>Healthy</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            {groupStats.avgEngagement}%
          </h3>
          <p className="text-sm text-gray-500">Avg. Engagement</p>
        </motion.div>
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
            placeholder="Search groups by name, description or admin..."
            onSearch={handleSearch}
            suggestions={groupsData.map(group => group.name).slice(0, 5)}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>
        <div className="md:col-span-1">
          <FilterPanel
            title="Group Filters"
            filters={filterOptions}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            initialExpanded={false}
          />
        </div>
      </motion.div>

      {/* Groups Table */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={filteredGroups}
          selectable={true}
          isLoading={isLoading}
          emptyMessage="No groups found. Try adjusting your filters or search terms."
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
          totalItems={filteredGroups.length}
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