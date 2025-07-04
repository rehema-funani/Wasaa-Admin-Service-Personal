import React, { useState, useEffect } from 'react';
import {
  User,
  ChevronRight,
  Calendar,
  Shield,
  LogOut,
  Key,
  Clock,
  Edit,
  Bell,
  Lock,
  Mail,
  Phone,
  Plus,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define TypeScript interface for user data based on the provided structure
interface Permission {
  id: string;
  title: string;
}

interface RolePermission {
  id: number;
  permissions: Permission;
}

interface Role {
  id: string;
  title: string;
  role_permissions: RolePermission[];
}

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string | null;
  account_status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  last_login: string;
  last_password_reset: string;
  role_id: string;
  role: Role;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'account' | 'security' | 'permissions'>('account');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('userData');

      if (!storedUserData) {
        throw new Error('No user data found');
      }

      const parsedUserData: UserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
      setIsLoading(false);
    }
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    navigate('/auth/login');
  };

  const getTimeSince = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (diffDays === 0) {
        if (diffHours === 0) return 'Just now';
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
    } catch {
      return 'Unknown';
    }
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const groupPermissionsByCategory = (permissions: RolePermission[]): Record<string, Permission[]> => {
    const grouped: Record<string, Permission[]> = {};

    permissions.forEach(rp => {
      const perm = rp.permissions;
      const parts = perm.title.split('_');
      let category = 'General';

      if (parts.length >= 2 && parts[0] === 'can') {
        const entityParts = parts.slice(1);

        const entities = ['user', 'ticket', 'report', 'dashboard', 'payment', 'account', 'profile'];
        const foundEntity = entityParts.find(part => entities.includes(part));

        if (foundEntity) {
          category = foundEntity.charAt(0).toUpperCase() + foundEntity.slice(1);
        }
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(perm);
    });

    return grouped;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const formatPermissionTitle = (title: string): string => {
    let formatted = title.replace(/^can_/, '').replace(/_/g, ' ');

    formatted = formatted.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return formatted;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-4 w-4 mb-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-light">Loading profile information...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-medium text-slate-800 mb-2">Unable to load profile</h2>
            <p className="text-slate-500 text-sm mb-6">{error || 'User data not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-500 text-white text-sm rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedPermissions = userData.role?.role_permissions
    ? groupPermissionsByCategory(userData.role.role_permissions)
    : {};

  return (
    <div className="h-auto bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-light text-slate-900 mb-1">My Profile</h1>
          <p className="text-slate-500 text-sm">Manage your personal information and account settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 pt-8 pb-6 px-6 relative">
                <div className="flex flex-col items-center relative z-10">
                  {userData.profile_picture ? (
                    <img
                      src={userData.profile_picture}
                      alt={`${userData.first_name} ${userData.last_name}`}
                      className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white text-primary-600 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
                      {getInitials(userData.first_name, userData.last_name)}
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-light text-white">
                      {userData.first_name} {userData.last_name}
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">{userData.email}</p>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H40V40H0V0Z" fill="white" />
                    <path d="M40 0H80V40H40V0Z" fill="white" />
                    <path d="M0 40H40V80H0V40Z" fill="white" />
                    <path d="M40 40H80V80H40V40Z" fill="white" />
                  </svg>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-2 ${userData.account_status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}></div>
                  <span className={`text-sm font-medium ${userData.account_status === 'active' ? 'text-emerald-600' : 'text-slate-600'
                    } capitalize`}>{userData.account_status}</span>

                  <div className="ml-auto px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                    {userData.role.title}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="bg-slate-50 rounded-xl p-4 mb-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Last login</p>
                      <p className="text-xs text-slate-500">{getTimeSince(userData.last_login)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Member since</p>
                      <p className="text-xs text-slate-500">{formatDate(userData.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="p-2">
                <button
                  onClick={() => setActiveSection('account')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left ${activeSection === 'account'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-700 hover:bg-slate-50'
                    } transition-colors`}
                >
                  <User className={`h-5 w-5 mr-3 ${activeSection === 'account' ? 'text-primary-500' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">Account Information</span>
                </button>

                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left ${activeSection === 'security'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-700 hover:bg-slate-50'
                    } transition-colors`}
                >
                  <Lock className={`h-5 w-5 mr-3 ${activeSection === 'security' ? 'text-primary-500' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">Security & Login</span>
                </button>

                <button
                  onClick={() => setActiveSection('permissions')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left ${activeSection === 'permissions'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-700 hover:bg-slate-50'
                    } transition-colors`}
                >
                  <Shield className={`h-5 w-5 mr-3 ${activeSection === 'permissions' ? 'text-primary-500' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">Roles & Permissions</span>
                </button>
              </div>

              <div className="px-4 py-4 border-t border-slate-100">
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>

          <div className="flex-grow">
            {activeSection === 'account' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                  <h2 className="text-xl font-light text-slate-800">Account Information</h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">First Name</label>
                        <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50">
                          <span className="text-slate-800">{userData.first_name}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                        <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50">
                          <Mail className="h-4 w-4 text-slate-400 mr-2" />
                          <span className="text-slate-800">{userData.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Account Status</label>
                        <div className={`inline-flex items-center px-3 py-1 rounded-lg ${userData.account_status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                          }`}>
                          <div className={`h-1.5 w-1.5 rounded-full mr-2 ${userData.account_status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}></div>
                          <span className="text-sm font-medium capitalize">{userData.account_status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                        <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50">
                          <span className="text-slate-800">{userData.last_name}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
                        <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50">
                          <Phone className="h-4 w-4 text-slate-400 mr-2" />
                          <span className="text-slate-800">{userData.phone_number}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Role</label>
                        <div className="flex items-center h-10 px-4 rounded-lg bg-slate-50">
                          <Shield className="h-4 w-4 text-slate-400 mr-2" />
                          <span className="text-slate-800">{userData.role.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-medium text-slate-700 mb-4">Additional Information</h3>

                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center bg-slate-50 px-4 py-2.5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <Calendar className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Account Created</p>
                          <p className="text-sm font-medium text-slate-800">{formatDate(userData.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center bg-slate-50 px-4 py-2.5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Last Updated</p>
                          <p className="text-sm font-medium text-slate-800">{formatDate(userData.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100">
                  <h2 className="text-xl font-light text-slate-800">Security & Login</h2>
                </div>

                <div className="p-8">
                  <div className="mb-10">
                    <h3 className="text-lg font-light text-slate-800 mb-4 flex items-center">
                      <Clock className="h-5 w-5 text-primary-500 mr-2" />
                      Login Activity
                    </h3>

                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-slate-800 font-medium mb-1">Current Session</h4>
                          <p className="text-slate-500 text-sm">Last logged in {getTimeSince(userData.last_login)}</p>

                          <div className="flex mt-4 items-center text-xs text-slate-500">
                            <div className="flex items-center pr-3 mr-3 border-r border-slate-200">
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                              Active Now
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">IP:</span>
                              192.168.1.1
                            </div>
                          </div>
                        </div>
                        <button className="ml-4 px-3 py-1 text-xs text-red-600 font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0">
                          End Session
                        </button>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                          <span>View All Sessions</span>
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-lg font-light text-slate-800 mb-4 flex items-center">
                      <Key className="h-5 w-5 text-primary-500 mr-2" />
                      Password Management
                    </h3>

                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-slate-800 font-medium mb-1">Password</h4>
                          <p className="text-slate-500 text-sm">Last changed {getTimeSince(userData.last_password_reset)}</p>
                        </div>
                        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                          Change Password
                        </button>
                      </div>

                      <div className="mt-6 flex items-center">
                        <div className="flex-grow h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="ml-3 text-xs font-medium text-slate-600">Strong password</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-slate-800 mb-4 flex items-center">
                      <Shield className="h-5 w-5 text-primary-500 mr-2" />
                      Two-Factor Authentication
                    </h3>

                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-slate-800 font-medium mb-1">Not Enabled</h4>
                          <p className="text-slate-500 text-sm">Add an extra layer of security to your account by requiring both your password and a verification code.</p>
                        </div>
                        <button className="ml-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex-shrink-0">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Section */}
            {activeSection === 'permissions' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-light text-slate-800">Roles & Permissions</h2>
                    <div className="px-3 py-1 bg-primary-50 rounded-lg">
                      <span className="text-sm font-medium text-primary-700">{userData.role.title}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-start p-5 bg-slate-50 rounded-xl mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-slate-700 font-medium mb-1">Role-Based Access Control</p>
                      <p className="text-slate-500 text-sm">Your access is determined by your role: <span className="font-medium text-primary-600">{userData.role.title}</span>. The permissions below outline what actions you can perform in the system.</p>
                    </div>
                  </div>

                  {/* Permissions Overview */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-slate-800">Permissions Overview</h3>
                      <div className="flex items-center text-sm text-primary-600">
                        <span className="font-medium mr-1">{Object.values(groupedPermissions).flat().length}</span>
                        <span className="text-slate-500">total permissions</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {Object.entries(groupedPermissions).map(([category, perms]) => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`flex items-center px-4 py-2.5 rounded-full text-sm transition-colors ${expandedCategories[category]
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                          <span className="mr-2">{category}</span>
                          <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${expandedCategories[category]
                            ? 'bg-primary-200 text-primary-800'
                            : 'bg-slate-200 text-slate-600'
                            }`}>{perms.length}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Permission Cards */}
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                      expandedCategories[category] && (
                        <div key={category} className="bg-white rounded-xl overflow-hidden">
                          <div className="bg-slate-50 px-6 py-4 border border-slate-200 rounded-t-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                                  <Shield className="h-4 w-4 text-primary-600" />
                                </div>
                                <h3 className="font-medium text-slate-800">{category} Permissions</h3>
                              </div>
                              <button
                                onClick={() => toggleCategory(category)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="p-6 border border-t-0 border-slate-200 rounded-b-xl">
                            <div className="flex flex-wrap gap-2">
                              {permissions.map((permission) => {
                                // Extract action from permission title (e.g., "view", "edit", "delete")
                                const permTitle = permission.title;
                                let actionType = "view"; // default

                                if (permTitle.includes("create") || permTitle.includes("add")) {
                                  actionType = "create";
                                } else if (permTitle.includes("edit") || permTitle.includes("update")) {
                                  actionType = "edit";
                                } else if (permTitle.includes("delete") || permTitle.includes("remove")) {
                                  actionType = "delete";
                                }

                                // Determine color based on action type
                                const colors = {
                                  view: "bg-blue-50 text-blue-700 border-blue-100",
                                  create: "bg-green-50 text-green-700 border-green-100",
                                  edit: "bg-amber-50 text-amber-700 border-amber-100",
                                  delete: "bg-red-50 text-red-700 border-red-100"
                                };

                                return (
                                  <div
                                    key={permission.id}
                                    className={`px-3 py-1.5 rounded-lg border text-sm ${colors[actionType]}`}
                                    title={permission.title}
                                  >
                                    {formatPermissionTitle(permission.title)}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    ))}

                    {/* If no categories are expanded, show a message */}
                    {Object.values(expandedCategories).every(expanded => !expanded) && (
                      <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-4">
                          <Shield className="h-6 w-6 text-slate-400" />
                        </div>
                        <h4 className="text-slate-700 font-medium mb-2">Select a permission category</h4>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">
                          Click on any of the permission categories above to view the detailed permissions for that section.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 p-5 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Plus className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">Need Additional Access?</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Contact your system administrator if you require additional permissions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
