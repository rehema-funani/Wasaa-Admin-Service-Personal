import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Edit,
  Trash2,
  X,
  Search,
  Key,
  User,
  Settings,
  Globe,
  FileText,
  AlertCircle,
  HelpCircle,
  Save,
  RefreshCw,
  Clipboard,
  KeyRound,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { roleService } from '../../../api/services/roles';

// Modal Component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const capitalizeWords = (str) => {
  return str
    .replace(/_/g, ' ')
    .replace(/can_/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

const getCategoryIcon = (category) => {
  const iconMap = {
    users: <User size={18} />,
    staff: <User size={18} />,
    roles: <Shield size={18} />,
    permissions: <Key size={18} />,
    apikeys: <KeyRound size={18} />,
    settings: <Settings size={18} />,
    languages: <Globe size={18} />,
    account_types: <User size={18} />,
  };

  return iconMap[category.toLowerCase()] || <FileText size={18} />;
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

// Role Detail Category component
const PermissionCategory = ({ category, permissions }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 bg-white">
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
            <h3 className="text-md font-semibold text-gray-800 capitalize">
              {category.replace(/_/g, ' ')}
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                {permissions.length}
              </span>
            </h3>
          </div>
        </div>

        <div>
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
          {permissions.map((rp) => {
            const action = getPermissionAction(rp.permissions.title);
            const actionColor = getActionColor(action);

            return (
              <div
                key={rp.id}
                className="p-4 border border-gray-100 rounded-xl hover:border-blue-100 hover:shadow-sm transition-all duration-300 bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${actionColor.bg} ${actionColor.text} border ${actionColor.border}`}>
                    {action}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">ID: {rp.id}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {capitalizeWords(rp.permissions.title)}
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
const RoleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editedRoleTitle, setEditedRoleTitle] = useState('');

  // Fetch role details
  const fetchRoleDetails = async () => {
    try {
      setLoading(true);
      if (id) {
        const response = await roleService.getRole(id);
        setRole(response);
        setEditedRoleTitle(response.title);
      } else {
        throw new Error('Role ID is undefined.');
      }
    } catch (error) {
      console.error('Failed to load role details:', error);
      setError('Failed to load role details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleDetails();
  }, [id]);

  // Update role
  const handleUpdateRole = async () => {
    try {
      if (id && editedRoleTitle.trim()) {
        await roleService.updateRole(id, { title: editedRoleTitle });
        setRole(prev => prev ? { ...prev, title: editedRoleTitle } : null);
        setIsEditModalOpen(false);
        toast.success('Role updated successfully');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update role');
    }
  };

  // Delete role
  const handleDeleteRole = async () => {
    try {
      setIsConfirmingDelete(true);
      if (id) {
        await roleService.deleteRole(id);
        setIsDeleteModalOpen(false);
        toast.success('Role deleted successfully');
        navigate(-1);
      }
    } catch (error) {
      console.error('Failed to delete role:', error);
      toast.error('Failed to delete role');
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  // Filter and group permissions
  const groupedPermissions = useMemo(() => {
    if (!role) return {};

    const filtered = searchQuery
      ? role.role_permissions.filter(rp =>
        rp.permissions.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : role.role_permissions;

    return filtered.reduce((acc, rp) => {
      const category = getPermissionCategory(rp.permissions.title);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(rp);
      return acc;
    }, {});
  }, [role, searchQuery]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
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
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!role) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <ArrowLeft size={20} className="text-gray-500" />
              </button>
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{role.title}</h1>
                  <div className="ml-3 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                    Role ID: {id}
                  </div>
                </div>
                <p className="text-gray-500 mt-1 flex items-center">
                  <Shield size={16} className="mr-1.5" />
                  {role.role_permissions.length} permissions in {Object.keys(groupedPermissions).length} categories
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/system/roles/${id}/edit`)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl flex items-center transition-all duration-200 shadow-sm hover:shadow"
              >
                <Key size={16} className="mr-2" />
                Edit Permissions
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl flex items-center transition-all duration-200 shadow-sm"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-xl shadow-sm mr-4">
                  <Shield size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Total Permissions</h3>
                  <p className="text-2xl font-bold text-gray-800">{role.role_permissions.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Assigned to this role</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-xl shadow-sm mr-4">
                  <Key size={22} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Permission Categories</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {Object.keys(groupedPermissions).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Groups of related permissions</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-xl shadow-sm mr-4">
                  <User size={22} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Role Type</h3>
                  <p className="text-2xl font-bold text-gray-800 flex items-center">
                    {role.title.includes('Admin') ? 'Administrative' : 'Standard'}
                    {role.title.includes('Admin') && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-100">
                        Elevated
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Access level classification</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions List */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">Role Permissions</h2>
              <span className="ml-3 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {role.role_permissions.length} total
              </span>
            </div>

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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {Object.keys(groupedPermissions).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <PermissionCategory
                  key={category}
                  category={category}
                  permissions={permissions}
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
                {searchQuery
                  ? `No permissions matching "${searchQuery}" were found.`
                  : "This role doesn't have any permissions assigned yet."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-6 border border-blue-100 mb-8">
          <div className="flex items-start">
            <div className="bg-white p-3 rounded-xl shadow-sm mr-4 flex-shrink-0">
              <Info size={22} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About Role Permissions</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Roles define what users can do in the system. Each permission grants specific capabilities
                to users with this role. To modify permissions, use the "Edit Permissions" button above.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100">
                  <CheckCircle size={16} className="text-emerald-500 mr-1.5" />
                  <span className="text-sm text-gray-700">Create</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100">
                  <CheckCircle size={16} className="text-blue-500 mr-1.5" />
                  <span className="text-sm text-gray-700">Update</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100">
                  <CheckCircle size={16} className="text-violet-500 mr-1.5" />
                  <span className="text-sm text-gray-700">List</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100">
                  <CheckCircle size={16} className="text-cyan-500 mr-1.5" />
                  <span className="text-sm text-gray-700">View</span>
                </div>
                <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100">
                  <CheckCircle size={16} className="text-red-500 mr-1.5" />
                  <span className="text-sm text-gray-700">Delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Role Name"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="roleTitle">
              Role Title
            </label>
            <input
              id="roleTitle"
              type="text"
              value={editedRoleTitle}
              onChange={(e) => setEditedRoleTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter role title"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateRole}
              disabled={!editedRoleTitle.trim()}
              className={`px-4 py-2.5 rounded-xl transition-all duration-300 font-medium flex items-center ${editedRoleTitle.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Role"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Are you sure?</h3>
          <p className="text-gray-600 mb-6">
            This will permanently delete the role <span className="font-semibold">"{role.title}"</span> and remove all associated permissions. This action cannot be undone.
          </p>

          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors duration-300 font-medium"
              disabled={isConfirmingDelete}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteRole}
              disabled={isConfirmingDelete}
              className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 flex items-center font-medium shadow-sm hover:shadow"
            >
              {isConfirmingDelete ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete Role
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoleDetail;
