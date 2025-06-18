import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Search,
  CheckSquare,
  Square,
  Filter,
  X,
  Save,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Key,
  User,
  Settings,
  Globe,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { roleService } from '../../../api/services/roles';
import { permissionService } from '../../../api/services/permissions';

// Helper functions
const getPermissionCategory = (permissionTitle) => {
  const parts = permissionTitle.split('_');
  if (parts.length > 2) {
    return parts[parts.length - 1];
  }
  return 'other';
};

const getPermissionAction = (permissionTitle) => {
  const parts = permissionTitle.split('_');
  if (parts.length > 1) {
    return parts[1];
  }
  return 'other';
};

const capitalizeWords = (str) => {
  return str
    .replace(/_/g, ' ')
    .replace(/can_/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getCategoryIcon = (category) => {
  const iconMap = {
    users: <User size={16} />,
    staff: <User size={16} />,
    roles: <Shield size={16} />,
    permissions: <Key size={16} />,
    apikeys: <Key size={16} />,
    settings: <Settings size={16} />,
    languages: <Globe size={16} />,
    account_types: <User size={16} />,
  };

  return iconMap[category.toLowerCase()] || <FileText size={16} />;
};

const getActionColor = (action) => {
  const colorMap = {
    create: 'bg-green-100/70 text-green-700 border-green-200/80 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30',
    update: 'bg-primary-100/70 text-primary-700 border-primary-200/80 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/30',
    delete: 'bg-red-100/70 text-red-700 border-red-200/80 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30',
    list: 'bg-purple-100/70 text-purple-700 border-purple-200/80 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/30',
    view: 'bg-primary-100/70 text-primary-700 border-primary-200/80 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/30',
  };

  return colorMap[action] || 'bg-gray-100/70 text-gray-700 border-gray-200/80 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800/30';
};

// Category component
const CategoryPermissions = ({
  category,
  permissions,
  selectedPermissions,
  onTogglePermission,
  onToggleCategory
}) => {
  const [expanded, setExpanded] = useState(true);

  const allSelected = permissions.every(p => selectedPermissions.includes(p.id));
  const someSelected = permissions.some(p => selectedPermissions.includes(p.id)) && !allSelected;

  const selectedInCategory = permissions.filter(p => selectedPermissions.includes(p.id)).length;

  return (
    <div className="border border-gray-100 dark:border-gray-800/40 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 bg-white/70 dark:bg-gray-800/30 backdrop-blur-sm">
      <div
        className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/20 dark:to-gray-800/40 hover:from-gray-100/80 hover:to-gray-200/80 dark:hover:from-gray-800/30 dark:hover:to-gray-800/50 transition-colors duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/30 mr-3 shadow-sm">
            {getCategoryIcon(category)}
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 capitalize flex items-center">
              {category.replace(/_/g, ' ')}
              <span className="ml-2 bg-gray-200/70 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded-full">
                {permissions.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedInCategory} of {permissions.length} selected
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className="relative flex items-center mr-4"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCategory(permissions, !allSelected);
            }}
          >
            {allSelected ? (
              <CheckSquare size={18} className="text-primary-600 dark:text-primary-400" />
            ) : someSelected ? (
              <div className="w-[18px] h-[18px] border-2 border-primary-600 dark:border-primary-400 rounded-sm flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-primary-600 dark:bg-primary-400 rounded-sm"></div>
              </div>
            ) : (
              <Square size={18} className="text-gray-400 dark:text-gray-500" />
            )}
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {allSelected ? 'Deselect All' : 'Select All'}
            </span>
          </div>

          {expanded ? (
            <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {permissions.map((permission) => {
            const isSelected = selectedPermissions.includes(permission.id);
            const action = getPermissionAction(permission.title);
            const actionColor = getActionColor(action);

            return (
              <div
                key={permission.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-300
                                ${isSelected
                    ? `${actionColor} border-2`
                    : 'border-gray-100/80 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-700 bg-white/40 dark:bg-gray-800/20 backdrop-blur-sm'
                  }`}
                onClick={() => onTogglePermission(permission.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionColor.split(' ')[0]} ${actionColor.split(' ')[1]} whitespace-nowrap backdrop-blur-sm`}>
                    {action}
                  </span>
                  {isSelected ? (
                    <CheckSquare size={16} className="text-primary-600 dark:text-primary-400" />
                  ) : (
                    <Square size={16} className="text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                  {capitalizeWords(permission.title)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleLoading, setRoleLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch role data
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setRoleLoading(true);
        const roleData = await roleService.getRole(id);

        setTitle(roleData.title);
        setDescription(roleData.description || '');

        // Extract permission IDs from role_permissions
        const permissionIds = roleData.role_permissions.map(rp => rp.permissions.id);
        setSelectedPermissions(permissionIds);
      } catch (error) {
        console.error('Failed to fetch role data:', error);
        setError('Failed to load role data. Please try again.');
      } finally {
        setRoleLoading(false);
      }
    };

    if (id) {
      fetchRoleData();
    }
  }, [id]);

  // Fetch all permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setPermissionsLoading(true);
        const response = await permissionService.getPermissions();
        setAllPermissions(response.data || response);
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        setError('Failed to load permissions. Please try again.');
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Filter permissions based on search and category
  const filteredPermissions = useMemo(() => {
    return allPermissions.filter(permission => {
      const matchesSearch = searchQuery
        ? permission.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = activeFilter !== 'all'
        ? getPermissionCategory(permission.title).toLowerCase() === activeFilter.toLowerCase()
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [allPermissions, searchQuery, activeFilter]);

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce((acc, permission) => {
      const category = getPermissionCategory(permission.title);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    }, {});
  }, [filteredPermissions]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allPermissions.map(p => getPermissionCategory(p.title)));
    return ['all', ...Array.from(uniqueCategories)];
  }, [allPermissions]);

  // Permission toggle handlers
  const handleTogglePermission = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleToggleCategory = (categoryPermissions, selected) => {
    const categoryPermissionIds = categoryPermissions.map(p => p.id);

    if (selected) {
      setSelectedPermissions(prev =>
        [...new Set([...prev, ...categoryPermissionIds])]
      );
    } else {
      setSelectedPermissions(prev =>
        prev.filter(id => !categoryPermissionIds.includes(id))
      );
    }
  };

  const handleToggleAll = (selected) => {
    if (selected) {
      const allFilteredIds = filteredPermissions.map(p => p.id);
      setSelectedPermissions(prev =>
        [...new Set([...prev, ...allFilteredIds])]
      );
    } else {
      const allFilteredIds = new Set(filteredPermissions.map(p => p.id));
      setSelectedPermissions(prev =>
        prev.filter(id => !allFilteredIds.has(id))
      );
    }
  };

  // Submit handler
  const handleUpdateRole = async () => {
    if (!title.trim()) {
      alert('Please enter a role title');
      return;
    }

    if (!description.trim()) {
      alert('Please enter a role description');
      return;
    }

    if (selectedPermissions.length === 0) {
      alert('Please select at least one permission');
      return;
    }

    try {
      setSubmitting(true);

      const roleData = {
        title: title.trim(),
        description: description.trim(),
        permissions: selectedPermissions
      };

      await roleService.updateRole(id, roleData);
      alert('Role updated successfully');
      navigate(`/admin/system/roles/${id}`);
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (roleLoading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-8 mb-8 animate-pulse">
            <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="w-64 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm p-8 animate-pulse">
            <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="bg-white/90 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-sm flex items-center justify-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-300"
            >
              <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Role</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Update role details and permissions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="roleTitle">
                  Role Title <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="roleTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/70 focus:border-transparent text-gray-800 dark:text-gray-200"
                  placeholder="Enter role title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="roleDescription">
                  Description <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  id="roleDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-primary-500/70 focus:border-transparent text-gray-800 dark:text-gray-200"
                  placeholder="Enter role description"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50/80 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-xl border border-primary-100/70 dark:border-primary-800/30 flex items-center backdrop-blur-sm">
              <div className="flex-shrink-0 bg-white/90 dark:bg-gray-800/70 p-4 rounded-xl shadow-sm mr-4 backdrop-blur-sm">
                <Shield size={32} className="text-primary-600 dark:text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">About Role Permissions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Roles define what users can do in the system. Assign permissions carefully to ensure proper access control.
                </p>
                <div className="flex items-center mt-3 text-sm">
                  <span className="inline-flex items-center text-primary-600 dark:text-primary-400">
                    <CheckCircle2 size={14} className="mr-1" />
                    {selectedPermissions.length} permissions selected
                  </span>
                  <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {allPermissions.length} permissions available
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
            <button
              onClick={() => navigate(-1)}
              className="text-sm px-4 py-2.5 bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 rounded-xl transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateRole}
              disabled={submitting || !title.trim() || !description.trim() || selectedPermissions.length === 0}
              className={`text-sm px-5 py-2.5 rounded-xl flex items-center transition-all duration-300 ${submitting || !title.trim() || !description.trim() || selectedPermissions.length === 0
                  ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg'
                }`}
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Update Role
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Select Permissions</h2>
              <span className="ml-2 bg-primary-100/70 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 text-xs font-medium px-2 py-1 rounded-full">
                {selectedPermissions.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 text-sm w-full md:w-64 bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/70 focus:border-transparent text-gray-800 dark:text-gray-200"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative group">
                <button className="px-4 py-2.5 text-sm bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 rounded-xl flex items-center">
                  <Filter size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  {activeFilter === 'all' ? 'All Categories' : capitalizeWords(activeFilter)}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/80 dark:border-gray-700/50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`w-full text-left px-4 py-2.5 text-sm ${activeFilter === category
                          ? 'bg-primary-50/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50'
                        }`}
                      onClick={() => setActiveFilter(category)}
                    >
                      {category === 'all' ? 'All Categories' : capitalizeWords(category)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="px-4 py-2.5 text-sm bg-primary-50/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100/80 dark:hover:bg-primary-900/50 rounded-xl flex items-center backdrop-blur-sm"
                onClick={() => handleToggleAll(
                  filteredPermissions.length > 0 &&
                  !filteredPermissions.every(p => selectedPermissions.includes(p.id))
                )}
              >
                {filteredPermissions.length > 0 &&
                  filteredPermissions.every(p => selectedPermissions.includes(p.id)) ? (
                  <>
                    <Square size={16} className="mr-2" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <CheckSquare size={16} className="mr-2" />
                    Select All
                  </>
                )}
              </button>
            </div>
          </div>

          {Object.keys(groupedPermissions).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <CategoryPermissions
                  key={category}
                  category={category}
                  permissions={categoryPermissions}
                  selectedPermissions={selectedPermissions}
                  onTogglePermission={handleTogglePermission}
                  onToggleCategory={handleToggleCategory}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-gray-50/80 dark:bg-gray-800/30 rounded-xl border border-gray-100/80 dark:border-gray-700/50 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto bg-gray-100/80 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                <HelpCircle size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No Permissions Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {searchQuery || activeFilter !== 'all'
                  ? `No permissions matching your filters were found.`
                  : "No permissions available to assign."}
              </p>
              {(searchQuery || activeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-primary-50/80 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100/80 dark:hover:bg-primary-900/50 transition-colors duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-sm p-4 border border-gray-100/80 dark:border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary-100/70 dark:bg-primary-900/30 p-2 rounded-lg mr-3">
              <CheckCircle2 size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {selectedPermissions.length} permissions selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Object.keys(groupedPermissions).length} categories
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 text-sm bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/80 rounded-xl transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateRole}
              disabled={submitting || !title.trim() || !description.trim() || selectedPermissions.length === 0}
              className={`px-5 py-2.5 text-sm rounded-xl flex items-center transition-all duration-300 ${submitting || !title.trim() || !description.trim() || selectedPermissions.length === 0
                  ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg'
                }`}
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Update Role
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRole;
