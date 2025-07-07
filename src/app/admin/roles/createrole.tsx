import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Key,
  User,
  Settings,
  Globe,
  FileText,
  HelpCircle,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
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
    account_types: <User size={16} />
  };

  return iconMap[category.toLowerCase()] || <FileText size={16} />;
};

const getActionColor = (action) => {
  const colorMap = {
    create: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      gradient: 'from-emerald-500 to-teal-600'
    },
    update: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
      gradient: 'from-blue-500 to-indigo-600'
    },
    delete: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-100',
      gradient: 'from-red-500 to-rose-600'
    },
    list: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-100',
      gradient: 'from-violet-500 to-purple-600'
    },
    view: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-100',
      gradient: 'from-cyan-500 to-blue-600'
    }
  };

  return colorMap[action] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-100',
    gradient: 'from-gray-500 to-gray-600'
  };
};

// Category Permissions Component
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
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      {/* Category Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="p-2.5 rounded-xl bg-white border border-gray-100 mr-3 shadow-sm">
            {getCategoryIcon(category)}
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-800 capitalize flex items-center">
              {category.replace(/_/g, ' ')}
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                {permissions.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500">
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
              <CheckSquare size={18} className="text-blue-600" />
            ) : someSelected ? (
              <div className="w-[18px] h-[18px] border-2 border-blue-600 rounded-sm flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-blue-600 rounded-sm"></div>
              </div>
            ) : (
              <Square size={18} className="text-gray-400" />
            )}
            <span className="ml-2 text-sm text-gray-700">
              {allSelected ? 'Deselect All' : 'Select All'}
            </span>
          </div>

          {expanded ? (
            <ChevronUp size={18} className="text-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Permission Cards */}
      {expanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {permissions.map((permission) => {
            const isSelected = selectedPermissions.includes(permission.id);
            const action = getPermissionAction(permission.title);
            const actionColor = getActionColor(action);

            return (
              <div
                key={permission.id}
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${isSelected
                    ? `${actionColor.bg} ${actionColor.border} shadow-sm`
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                onClick={() => onTogglePermission(permission.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionColor.bg} ${actionColor.text} ${actionColor.border} whitespace-nowrap`}
                  >
                    {action}
                  </span>
                  {isSelected ? (
                    <CheckSquare size={16} className="text-blue-600" />
                  ) : (
                    <Square size={16} className="text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1">
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

// Main Component
const CreateRole = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await permissionService.getPermissions();
        setPermissions(response.data || response);
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        setError('Failed to load permissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Filter permissions based on search and category
  const filteredPermissions = useMemo(() => {
    return permissions.filter(permission => {
      const matchesSearch = searchQuery
        ? permission.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = activeFilter !== 'all'
        ? getPermissionCategory(permission.title).toLowerCase() === activeFilter.toLowerCase()
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [permissions, searchQuery, activeFilter]);

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
    const uniqueCategories = new Set(permissions.map(p => getPermissionCategory(p.title)));
    return ['all', ...Array.from(uniqueCategories)];
  }, [permissions]);

  // Handle permission selection
  const handleTogglePermission = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle category selection
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

  // Handle select/deselect all
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

  // Create role
  const handleCreateRole = async () => {
    if (!title.trim()) {
      toast.error('Please enter a role title');
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    try {
      setSubmitting(true);

      const roleData = {
        title: title.trim(),
        description: description.trim(),
        permissions: selectedPermissions
      };

      await roleService.createRole(roleData);
      toast.success('Role created successfully');
      navigate('/admin/system/roles');
    } catch (error) {
      console.error('Failed to create role:', error);
      toast.error('Failed to create role. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 animate-pulse">
            <div className="w-48 h-8 bg-gray-200 rounded-lg mb-4"></div>
            <div className="w-64 h-6 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
            <div className="w-1/3 h-6 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-xl"></div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-sm flex items-center justify-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Role</h1>
              <p className="text-gray-500 mt-1">Define role details and assign permissions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Role Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="roleTitle">
                  Role Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="roleTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter role title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="roleDescription">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="roleDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 border border-gray-200 rounded-xl h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter role description"
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 flex items-start">
              <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm mr-4 mt-1">
                <Shield size={28} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About Role Permissions</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Roles define what users can do in the system. Assign permissions carefully
                  to ensure proper access control and security. Each permission grants specific
                  capabilities to users with this role.
                </p>
                <div className="flex items-center text-sm bg-white px-4 py-3 rounded-lg shadow-sm border border-blue-100">
                  <div className="flex items-center text-blue-600 mr-4">
                    <CheckCircle size={16} className="mr-1.5" />
                    <span className="font-medium">{selectedPermissions.length} permissions selected</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <div className="flex items-center text-gray-600">
                    <Info size={16} className="mr-1.5" />
                    <span>{permissions.length} permissions available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRole}
              disabled={submitting || !title.trim() || selectedPermissions.length === 0 || !description.trim()}
              className={`px-5 py-2.5 rounded-xl flex items-center transition-all duration-300 font-medium ${submitting || !title.trim() || selectedPermissions.length === 0 || !description.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow'
                }`}
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Create Role
                </>
              )}
            </button>
          </div>
        </div>

        {/* Permissions Selection Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">Select Permissions</h2>
              <span className="ml-3 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {selectedPermissions.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full md:w-64 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="relative">
                <button
                  className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter size={16} className="mr-2 text-gray-500" />
                  {activeFilter === 'all' ? 'All Categories' : capitalizeWords(activeFilter)}
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`w-full text-left px-4 py-2.5 text-sm ${activeFilter === category
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        onClick={() => {
                          setActiveFilter(category);
                          setFilterOpen(false);
                        }}
                      >
                        {category === 'all' ? 'All Categories' : capitalizeWords(category)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Select/Deselect All */}
              <button
                className="px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl flex items-center font-medium transition-colors duration-200"
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

          {/* Permission Categories */}
          {Object.keys(groupedPermissions).length > 0 ? (
            <div className="space-y-6">
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
            <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <HelpCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Permissions Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
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
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between sticky bottom-6 z-10">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2.5 rounded-xl mr-3">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                {selectedPermissions.length} permissions selected
              </p>
              <p className="text-xs text-gray-500">
                {Object.keys(groupedPermissions).length} categories
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRole}
              disabled={submitting || !title.trim() || selectedPermissions.length === 0 || !description.trim()}
              className={`px-5 py-2.5 rounded-xl flex items-center transition-all duration-300 font-medium ${submitting || !title.trim() || selectedPermissions.length === 0 || !description.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow'
                }`}
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Create Role
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
