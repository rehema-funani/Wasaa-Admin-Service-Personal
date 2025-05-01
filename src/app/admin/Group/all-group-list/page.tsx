import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Plus,
  UsersRound,
  Ban,
  AlertCircle,
  Check,
  X,
  Clock,
  Shield
} from 'lucide-react';
import SearchBox from '../../../../components/common/SearchBox';
import DataTable from '../../../../components/common/DataTable';
import Pagination from '../../../../components/common/Pagination';
import groupService from '../../../../api/services/groups';
import { useNavigate } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  admin: string;
  adminId: string;
  icon?: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
}

const page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'marketing', 'design', 'active'
  ]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<{ id: string, action: string } | null>(null);
  const navigate = useNavigate();
  const groupStats = React.useMemo(() => {
    const totalGroups = groups.length;
    const activeGroups = groups.filter(group => group.status === 'active').length;
    const inactiveGroups = groups.filter(group => group.status === 'inactive').length;
    const blockedGroups = groups.filter(group => group.status === 'blocked').length;
    const totalMembers = groups.reduce((sum, group) => sum + group.memberCount, 0);


    return {
      totalGroups,
      activeGroups,
      inactiveGroups,
      blockedGroups,
      totalMembers
    };
  }, [groups]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const response = await groupService.getGroups();

        const groupsData = response?.data?.groups || [];

        setGroups(groupsData);
        setFilteredGroups(groupsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load groups. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Table columns definition
  const columns = [
    {
      id: 'name',
      header: 'Group',
      accessor: (row: Group) => row.name,
      sortable: true,
      cell: (value: string, row: Group) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-medium text-sm mr-3">
            <UsersRound size={18} strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{row.description || 'No description'}</p>
          </div>
        </div>
      )
    },
    {
      id: 'memberCount',
      header: 'Members',
      accessor: (row: Group) => row.memberCount,
      sortable: true,
      width: '120px',
      cell: (value: number) => (
        <div className="flex items-center">
          <Users size={14} className="text-indigo-400 mr-1.5" strokeWidth={1.8} />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      id: 'admin',
      header: 'Admin',
      accessor: (row: Group) => row.admin,
      sortable: true,
      width: '160px',
      cell: (value: string) => (
        <div className="flex items-center">
          <Shield size={14} className="text-purple-400 mr-1.5" strokeWidth={1.8} />
          <span className="font-medium text-gray-700">{value}</span>
        </div>
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (row: Group) => row.createdAt,
      sortable: true,
      width: '120px',
      cell: (value: string) => {
        // Format date if needed
        try {
          const date = new Date(value);
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return (
            <div className="flex items-center">
              <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
              <span>{formattedDate}</span>
            </div>
          );
        } catch (e) {
          return (
            <div className="flex items-center">
              <Clock size={14} className="text-gray-400 mr-1.5" strokeWidth={1.8} />
              <span>{value}</span>
            </div>
          );
        }
      }
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Group) => row.status,
      sortable: true,
      width: '120px',
      cell: (value: string) => {
        let color = '';
        let bgColor = '';
        let icon = null;

        switch (value) {
          case 'active':
            color = 'text-green-700';
            bgColor = 'bg-green-50';
            icon = <Check size={14} className="mr-1.5 text-green-500" strokeWidth={2} />;
            break;
          case 'inactive':
            color = 'text-amber-700';
            bgColor = 'bg-amber-50';
            icon = <Clock size={14} className="mr-1.5 text-amber-500" strokeWidth={2} />;
            break;
          case 'blocked':
            color = 'text-red-700';
            bgColor = 'bg-red-50';
            icon = <Ban size={14} className="mr-1.5 text-red-500" strokeWidth={2} />;
            break;
          default:
            color = 'text-gray-700';
            bgColor = 'bg-gray-50';
            icon = <AlertCircle size={14} className="mr-1.5 text-gray-500" strokeWidth={2} />;
        }

        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${bgColor} ${color} capitalize`}>
            {icon}
            {value}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Group) => row.id,
      sortable: false,
      width: '180px',
      cell: (value: string, row: Group) => (
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View group"
            onClick={() => handleViewGroup(row.id)}
            disabled={actionInProgress === row.id}
          >
            <Eye size={16} strokeWidth={1.8} />
          </motion.button>
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Edit group"
            onClick={() => handleEditGroup(row.id)}
            disabled={actionInProgress === row.id}
          >
            <Edit size={16} strokeWidth={1.8} />
          </motion.button>
          {row.status === 'active' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-amber-100 hover:text-amber-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Deactivate group"
              onClick={() => handleConfirmAction(row.id, 'deactivate')}
              disabled={actionInProgress === row.id}
            >
              <Ban size={16} strokeWidth={1.8} />
            </motion.button>
          )}
          {row.status === 'inactive' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-green-100 hover:text-green-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Activate group"
              onClick={() => handleConfirmAction(row.id, 'activate')}
              disabled={actionInProgress === row.id}
            >
              <Check size={16} strokeWidth={1.8} />
            </motion.button>
          )}
          {row.status === 'blocked' && (
            <motion.button
              className="p-1.5 rounded-lg text-gray-500 hover:bg-green-100 hover:text-green-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Unblock group"
              onClick={() => handleConfirmAction(row.id, 'unblock')}
              disabled={actionInProgress === row.id}
            >
              <Check size={16} strokeWidth={1.8} />
            </motion.button>
          )}
          <motion.button
            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete group"
            onClick={() => handleConfirmAction(row.id, 'delete')}
            disabled={actionInProgress === row.id}
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </motion.button>
        </div>
      )
    }
  ];

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredGroups(groups);
      return;
    }

    const lowercasedQuery = query.toLowerCase();

    // Filter by name, description, or admin
    const filtered = groups.filter(group =>
      group.name.toLowerCase().includes(lowercasedQuery) ||
      (group.description && group.description.toLowerCase().includes(lowercasedQuery)) ||
      group.admin.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredGroups(filtered);

    // Add to recent searches
    if (query.trim() !== '' && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setCurrentPage(1); // Reset to first page
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

  const handleViewGroup = (id: string) => {
    navigate(`/admin/groups/${id}`);
  };

  const handleEditGroup = (id: string) => {
    navigate(`/admin/groups/${id}/edit`);
  };

  const handleConfirmAction = (id: string, action: string) => {
    setShowConfirmation({ id, action });
  };

  const handleCancelAction = () => {
    setShowConfirmation(null);
  };

  const handleActivateGroup = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.updateGroupStatus(id, 'active');

      setGroups(prev => prev.map(group =>
        group.id === id ? { ...group, status: 'active' } : group
      ));
      setFilteredGroups(prev => prev.map(group =>
        group.id === id ? { ...group, status: 'active' } : group
      ));

      setShowConfirmation(null);
    } catch (error) {
      console.error('Error activating group:', error);
      alert('Failed to activate group. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeactivateGroup = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.updateGroupStatus(id, 'inactive');

      setGroups(prev => prev.map(group =>
        group.id === id ? { ...group, status: 'inactive' } : group
      ));
      setFilteredGroups(prev => prev.map(group =>
        group.id === id ? { ...group, status: 'inactive' } : group
      ));

      setShowConfirmation(null);
    } catch (error) {
      console.error('Error deactivating group:', error);
      alert('Failed to deactivate group. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleUnblockGroup = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.updateGroupStatus(id, 'active');

      setGroups(prev => prev.map(group =>
        group.id === id ? { ...group, status: 'active' } : group
      ));
      setFilteredGroups(prev => prev.map(group =>
        group.id === id ? { ...group, status: 'active' } : group
      ));

      setShowConfirmation(null);
    } catch (error) {
      console.error('Error unblocking group:', error);
      alert('Failed to unblock group. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      setActionInProgress(id);
      await groupService.deleteGroup(id);

      setGroups(prev => prev.filter(group => group.id !== id));
      setFilteredGroups(prev => prev.filter(group => group.id !== id));

      setShowConfirmation(null);
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleConfirmationAction = () => {
    if (!showConfirmation) return;

    const { id, action } = showConfirmation;

    switch (action) {
      case 'activate':
        handleActivateGroup(id);
        break;
      case 'deactivate':
        handleDeactivateGroup(id);
        break;
      case 'unblock':
        handleUnblockGroup(id);
        break;
      case 'delete':
        handleDeleteGroup(id);
        break;
      default:
        setShowConfirmation(null);
    }
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
          <h1 className="text-2xl font-semibold text-gray-800">Groups</h1>
          <p className="text-gray-500 mt-1">Manage user groups and communities</p>
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
            onClick={() => navigate('/admin/groups/create')}
          >
            <Plus size={16} className="mr-2" strokeWidth={1.8} />
            Create Group
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
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

        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-blue-50 rounded-xl p-2">
              <Users size={20} className="text-blue-500" strokeWidth={1.8} />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            {groupStats.totalMembers.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-500">Total Members</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-green-50 rounded-xl p-2">
              <Check size={20} className="text-green-500" strokeWidth={1.8} />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            {groupStats.activeGroups}
          </h3>
          <p className="text-sm text-gray-500">Active Groups</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-red-50 rounded-xl p-2">
              <Ban size={20} className="text-red-500" strokeWidth={1.8} />
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-0.5 bg-amber-50 rounded-full text-xs text-amber-600 font-medium">
                {groupStats.inactiveGroups} inactive
              </div>
              <div className="px-2 py-0.5 bg-red-50 rounded-full text-xs text-red-600 font-medium">
                {groupStats.blockedGroups} blocked
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            {groupStats.inactiveGroups + groupStats.blockedGroups}
          </h3>
          <p className="text-sm text-gray-500">Inactive/Blocked</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SearchBox
          placeholder="Search groups by name, description or admin..."
          onSearch={handleSearch}
          suggestions={[
            'marketing',
            'design',
            'active',
            'blocked'
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
            data={filteredGroups}
            selectable={true}
            isLoading={isLoading}
            emptyMessage="No groups found. Try adjusting your search terms."
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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {showConfirmation.action === 'delete' ? 'Delete Group' :
                showConfirmation.action === 'activate' ? 'Activate Group' :
                  showConfirmation.action === 'deactivate' ? 'Deactivate Group' : 'Unblock Group'}
            </h3>
            <p className="text-gray-600 mb-6">
              {showConfirmation.action === 'delete'
                ? 'Are you sure you want to delete this group? This action cannot be undone.'
                : showConfirmation.action === 'activate'
                  ? 'Are you sure you want to activate this group? This will make it visible to members.'
                  : showConfirmation.action === 'deactivate'
                    ? 'Are you sure you want to deactivate this group? This will hide it from members.'
                    : 'Are you sure you want to unblock this group? This will restore access to members.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                onClick={handleCancelAction}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-white
                  ${showConfirmation.action === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : showConfirmation.action === 'deactivate'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-green-600 hover:bg-green-700'}`}
                onClick={handleConfirmationAction}
                disabled={actionInProgress !== null}
              >
                {actionInProgress === showConfirmation.id ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>Confirm</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default page;